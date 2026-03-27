// game.js
// Responsabilidad: lógica del minijuego (cargar imágenes, control del juego y efectos de sonido)
export function initGame(API_BASE, elements) {
  const {
    gameToggleBtn, catalogView, gameView, gameArea, timerEl, scoreEl, highscoreEl, backBtn, gameOverEl, finalScoreEl, highScoreMsgEl, playAgainBtn,
  } = elements;

  let gameActive = false;
  let gameTimer = null;
  let spawnInterval = null;
  let timeLeft = 60;
  let currentScore = 0;
  let characterImages = [];

  function playLaserSound() {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.12);

      gainNode.gain.setValueAtTime(0.0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.18, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.12);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.14);
    } catch (e) {
      console.log('Audio no disponible');
    }
  }

  function getHighScore() {
    return parseInt(localStorage.getItem('rm-game-highscore') || '0');
  }

  function setHighScore(score) {
    localStorage.setItem('rm-game-highscore', score.toString());
  }

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

    gameTimer = setInterval(() => {
      timeLeft--;
      timerEl.textContent = timeLeft;
      if (timeLeft <= 0) endGame();
    }, 1000);

    spawnInterval = setInterval(() => { if (gameActive) spawnTarget(); }, 800);
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
    const randomImg = characterImages.length > 0 ? characterImages[Math.floor(Math.random() * characterImages.length)] : 'https://rickandmortyapi.com/api/character/avatar/1.jpeg';
    target.innerHTML = `<img src="${randomImg}" alt="target" />`;

    const side = Math.floor(Math.random() * 4);
    const size = 80;
    const maxX = gameArea.offsetWidth - size;
    const maxY = gameArea.offsetHeight - size;
    let startX, startY, endX, endY;
    switch (side) {
      case 0:
        startX = Math.random() * maxX; startY = -size; endX = Math.random() * maxX; endY = maxY + size; break;
      case 1:
        startX = maxX + size; startY = Math.random() * maxY; endX = -size; endY = Math.random() * maxY; break;
      case 2:
        startX = Math.random() * maxX; startY = maxY + size; endX = Math.random() * maxX; endY = -size; break;
      default:
        startX = -size; startY = Math.random() * maxY; endX = maxX + size; endY = Math.random() * maxY; break;
    }

    target.style.left = startX + 'px';
    target.style.top = startY + 'px';

    target.addEventListener('click', () => {
      if (!gameActive) return;
      playLaserSound();
      currentScore++; scoreEl.textContent = currentScore; target.classList.add('hit'); setTimeout(() => target.remove(), 300);
    });

    gameArea.appendChild(target);
    target.addEventListener('dragstart', e => e.preventDefault());
    const imgEl = target.querySelector('img'); if (imgEl) { imgEl.draggable = false; imgEl.addEventListener('dragstart', e => e.preventDefault()); imgEl.style.userSelect = 'none'; }

    const duration = 3000 + Math.random() * 2000;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime; const progress = Math.min(elapsed / duration, 1);
      const currentX = startX + (endX - startX) * progress; const currentY = startY + (endY - startY) * progress;
      target.style.left = currentX + 'px'; target.style.top = currentY + 'px';
      if (progress < 1 && gameActive && target.parentElement) requestAnimationFrame(animate); else if (target.parentElement) target.remove();
    };
    requestAnimationFrame(animate);
  }

  // Listeners
  gameToggleBtn.addEventListener('click', () => { catalogView.style.display = 'none'; gameView.style.display = 'flex'; startGame(); });
  backBtn.addEventListener('click', () => { stopGame(); gameView.style.display = 'none'; catalogView.style.display = 'flex'; });
  playAgainBtn.addEventListener('click', () => { gameOverEl.style.display = 'none'; startGame(); });

  return { loadCharacterImages };
}
