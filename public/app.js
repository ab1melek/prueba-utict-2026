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

  // Init: cargar catálogos y personajes desde backend
  (async()=>{ 
    await populateOptions(); 
    await doSearch(); 
  })();
})();
