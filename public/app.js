// Front minimal — lógica separada
(function(){
  // Strict: use only window.API_BASE. No defaults allowed.
  const API_BASE = window.API_BASE;
  if (!API_BASE) {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.left = '0';
    overlay.style.top = '0';
    overlay.style.right = '0';
    overlay.style.bottom = '0';
    overlay.style.background = 'rgba(255,255,255,0.98)';
    overlay.style.zIndex = '9999';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.padding = '20px';
    overlay.innerHTML = `<div style="max-width:720px;text-align:center;color:#111;font-family:Arial">
      <h2>Configuración faltante: API_BASE</h2>
      <p>El front requiere que la variable <strong>window.API_BASE</strong> esté definida antes de cargar el script.<br>
      Inserta: <code>&lt;script&gt;window.API_BASE = 'http://host:port/api/v1';&lt;/script&gt;</code> antes de cargar <code>app.js</code> o configura el servidor para inyectarla desde <code>.env</code>.</p>
    </div>`;
    document.body.appendChild(overlay);
    return;
  }

  const modeEl = document.getElementById('mode');
  const optionsEl = document.getElementById('options');
  const searchBtn = document.getElementById('search');
  const leftCol = document.getElementById('left-col');
  const rightCol = document.getElementById('right-col');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const pageInfo = document.getElementById('pageInfo');

  let page = 1;
  let lastPagination = null;

  async function loadCatalog(path, key){
    try{
      const res = await fetch(API_BASE + path);
      if(!res.ok) return [];
      const json = await res.json();
      return json[key] || [];
    }catch(e){ return []; }
  }

  async function populateOptions(){
    optionsEl.innerHTML = '';
    if(modeEl.value === 'name'){
      const names = await loadCatalog('/catalogo/nombres','nombres');
      names.forEach(n=>{ const o=document.createElement('option'); o.value=n; o.text=n; optionsEl.appendChild(o); });
      optionsEl.style.display='inline-block';
    } else if(modeEl.value === 'species'){
      const species = await loadCatalog('/catalogo/especies','especies');
      species.forEach(n=>{ const o=document.createElement('option'); o.value=n; o.text=n; optionsEl.appendChild(o); });
      optionsEl.style.display='inline-block';
    } else {
      optionsEl.style.display='none';
    }
  }

  modeEl.addEventListener('change', populateOptions);

  async function doSearch(){
    const params = new URLSearchParams();
    if(modeEl.value === 'name'){
      if(!optionsEl.value) { alert('Selecciona un nombre'); return; }
      params.set('name', optionsEl.value);
    } else if(modeEl.value === 'species'){
      if(!optionsEl.value) { alert('Selecciona una especie'); return; }
      params.set('species', optionsEl.value);
    }
    params.set('page', String(page));

    try {
      const url = `${API_BASE}/characters?${params.toString()}`;
      const res = await fetch(url);
      if(!res.ok){
        const err = await res.json().catch(()=>({message:res.statusText}));
        alert(err.description || err.message || res.statusText);
        return;
      }
      const body = await res.json();
      render(body.data || [], body.pagination || null);
    } catch(e) {
      console.error('Fetch error:', e);
      alert('Error cargando personajes');
    }
  }

  function render(items, pagination){
    leftCol.innerHTML=''; rightCol.innerHTML='';
    lastPagination = pagination;
    pageInfo.textContent = pagination && pagination.pages ? `Página ${page} / ${pagination.pages}` : `Página ${page}`;

    // Asegurar que items es un array
    if (!Array.isArray(items)) {
      items = [];
    }

    const left = items.slice(0,5);
    const right = items.slice(5,10);

    left.forEach(item => leftCol.appendChild(makeCard(item)));
    right.forEach(item => rightCol.appendChild(makeCard(item)));

    prevBtn.disabled = page <= 1;
    nextBtn.disabled = !(pagination && pagination.pages && page < pagination.pages);
  }

  function makeCard(item){
    const el = document.createElement('div'); el.className='card';
    el.innerHTML = `
      <img src="${item.imagen}" alt="${item.nombre}" />
      <div class="meta">
        <h3>${item.nombre}</h3>
        <div class="specie">${item.especie}</div>
      </div>`;
    return el;
  }

  prevBtn.addEventListener('click', ()=>{ if(page>1){ page--; doSearch(); } });
  nextBtn.addEventListener('click', ()=>{ if(lastPagination && lastPagination.pages && page < lastPagination.pages){ page++; doSearch(); } });
  searchBtn.addEventListener('click', ()=>{ page=1; doSearch(); });

  // Intentar reproducir audio automáticamente
  const audio = document.querySelector('audio');
  if (audio) {
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay bloqueado: agregar listener para primer click del usuario
        document.addEventListener('click', () => {
          audio.play().catch(() => {});
        }, { once: true });
      });
    }
  }

  // ===== MINIJUEGO =====
  const gameToggleBtn = document.getElementById('game-toggle');
  const catalogView = document.getElementById('catalog-view');
  const gameView = document.getElementById('game-view');
  const gameArea = document.getElementById('game-area');
  const timerEl = document.getElementById('timer');
  const scoreEl = document.getElementById('score');
  const highscoreEl = document.getElementById('highscore');
  const backBtn = document.getElementById('back-catalog');
  const gameOverEl = document.getElementById('game-over');
  const finalScoreEl = document.getElementById('final-score');
  const highScoreMsgEl = document.getElementById('high-score-msg');
  const playAgainBtn = document.getElementById('play-again');

  let gameActive = false;
  let gameTimer = null;
  let spawnInterval = null;
  let timeLeft = 60;
  let currentScore = 0;
  let characterImages = []; // Cache de imágenes de personajes

  // Crear sonido de laser con Web Audio API
  function playLaserSound() {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.15);
      
      gainNode.gain.setValueAtTime(0.6, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.15);
    } catch (e) {
      console.log('Audio no disponible');
    }
  }

  // Cargar highscore de localStorage
  function getHighScore() {
    return parseInt(localStorage.getItem('rm-game-highscore') || '0');
  }

  function setHighScore(score) {
    localStorage.setItem('rm-game-highscore', score.toString());
  }

  // Toggle vista catálogo <-> juego
  gameToggleBtn.addEventListener('click', () => {
    catalogView.style.display = 'none';
    gameView.style.display = 'flex';
    startGame();
  });

  backBtn.addEventListener('click', () => {
    stopGame();
    gameView.style.display = 'none';
    catalogView.style.display = 'flex';
  });

  playAgainBtn.addEventListener('click', () => {
    gameOverEl.style.display = 'none';
    startGame();
  });

  async function loadCharacterImages() {
    try {
      const res = await fetch(`${API_BASE}/characters`);
      if (!res.ok) return;
      const json = await res.json();
      if (Array.isArray(json.data)) {
        characterImages = json.data.map(char => char.imagen);
      }
    } catch (e) {
      console.error('Error cargando imágenes:', e);
    }
  }

  function startGame() {
    gameActive = true;
    timeLeft = 60;
    currentScore = 0;
    gameArea.innerHTML = '';
    gameOverEl.style.display = 'none';
    
    timerEl.textContent = timeLeft;
    scoreEl.textContent = currentScore;
    highscoreEl.textContent = getHighScore();

    // Timer
    gameTimer = setInterval(() => {
      timeLeft--;
      timerEl.textContent = timeLeft;
      if (timeLeft <= 0) {
        endGame();
      }
    }, 1000);

    // Spawn targets cada 800ms
    spawnInterval = setInterval(() => {
      if (gameActive) spawnTarget();
    }, 800);
  }

  function stopGame() {
    gameActive = false;
    if (gameTimer) clearInterval(gameTimer);
    if (spawnInterval) clearInterval(spawnInterval);
    gameArea.innerHTML = '';
  }

  function endGame() {
    stopGame();
    
    finalScoreEl.textContent = currentScore;
    const highScore = getHighScore();
    
    if (currentScore > highScore) {
      setHighScore(currentScore);
      highScoreMsgEl.textContent = '¡NUEVO RÉCORD! 🎉';
      highscoreEl.textContent = currentScore;
    } else if (currentScore === highScore && currentScore > 0) {
      highScoreMsgEl.textContent = '¡Igualaste el récord!';
    } else {
      highScoreMsgEl.textContent = `Récord a superar: ${highScore}`;
    }
    
    gameOverEl.style.display = 'block';
  }

  function spawnTarget() {
    const target = document.createElement('div');
    target.className = 'flying-target';
    
    // Imagen aleatoria
    const randomImg = characterImages.length > 0 
      ? characterImages[Math.floor(Math.random() * characterImages.length)]
      : 'https://rickandmortyapi.com/api/character/avatar/1.jpeg';
    
    target.innerHTML = `<img src="${randomImg}" alt="target" />`;
    
    // Posición inicial aleatoria en los bordes
    const side = Math.floor(Math.random() * 4); // 0=top, 1=right, 2=bottom, 3=left
    const size = 80;
    const maxX = gameArea.offsetWidth - size;
    const maxY = gameArea.offsetHeight - size;
    
    let startX, startY, endX, endY;
    
    switch(side) {
      case 0: // top
        startX = Math.random() * maxX;
        startY = -size;
        endX = Math.random() * maxX;
        endY = maxY + size;
        break;
      case 1: // right
        startX = maxX + size;
        startY = Math.random() * maxY;
        endX = -size;
        endY = Math.random() * maxY;
        break;
      case 2: // bottom
        startX = Math.random() * maxX;
        startY = maxY + size;
        endX = Math.random() * maxX;
        endY = -size;
        break;
      case 3: // left
        startX = -size;
        startY = Math.random() * maxY;
        endX = maxX + size;
        endY = Math.random() * maxY;
        break;
    }
    
    target.style.left = startX + 'px';
    target.style.top = startY + 'px';
    
    // Click handler
    target.addEventListener('click', () => {
      if (!gameActive) return;
      playLaserSound();
      currentScore++;
      scoreEl.textContent = currentScore;
      target.classList.add('hit');
      setTimeout(() => target.remove(), 300);
    });
    
    gameArea.appendChild(target);
    
    // Animación de movimiento
    const duration = 3000 + Math.random() * 2000; // 3-5 segundos
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const currentX = startX + (endX - startX) * progress;
      const currentY = startY + (endY - startY) * progress;
      
      target.style.left = currentX + 'px';
      target.style.top = currentY + 'px';
      
      if (progress < 1 && gameActive && target.parentElement) {
        requestAnimationFrame(animate);
      } else if (target.parentElement) {
        target.remove();
      }
    };
    
    requestAnimationFrame(animate);
  }

  // Init: cargar catálogos y personajes desde backend
  (async()=>{ 
    await populateOptions(); 
    await doSearch();
    await loadCharacterImages(); // Cargar imágenes para el juego
  })();
})();
