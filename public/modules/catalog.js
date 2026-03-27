// catalog.js
// Responsabilidad: carga y renderizado del catálogo (búsqueda, paginación y opciones)
export async function initCatalog(API_BASE, elements) {
  const {
    modeEl, optionsEl, searchBtn, leftCol, rightCol, prevBtn, nextBtn, pageInfo,
  } = elements;

  let page = 1;
  let lastPagination = null;

  async function loadCatalog(path, key) {
    try {
      const res = await fetch(API_BASE + path);
      if (!res.ok) return [];
      const json = await res.json();
      return json[key] || [];
    } catch (e) { return []; }
  }

  async function populateOptions() {
    optionsEl.innerHTML = '';
    if (modeEl.value === 'name') {
      const names = await loadCatalog('/catalogo/nombres', 'nombres');
      names.forEach(n => { const o = document.createElement('option'); o.value = n; o.text = n; optionsEl.appendChild(o); });
      optionsEl.style.display = 'inline-block';
    } else if (modeEl.value === 'species') {
      const species = await loadCatalog('/catalogo/especies', 'especies');
      species.forEach(n => { const o = document.createElement('option'); o.value = n; o.text = n; optionsEl.appendChild(o); });
      optionsEl.style.display = 'inline-block';
    } else {
      optionsEl.style.display = 'none';
    }
  }

  async function doSearch() {
    const params = new URLSearchParams();
    if (modeEl.value === 'name') {
      if (!optionsEl.value) { alert('Selecciona un nombre'); return; }
      params.set('name', optionsEl.value);
    } else if (modeEl.value === 'species') {
      if (!optionsEl.value) { alert('Selecciona una especie'); return; }
      params.set('species', optionsEl.value);
    }
    params.set('page', String(page));

    try {
      const url = `${API_BASE}/characters?${params.toString()}`;
      const res = await fetch(url);
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: res.statusText }));
        alert(err.description || err.message || res.statusText);
        return;
      }
      const body = await res.json();
      render(body.data || [], body.pagination || null);
    } catch (e) {
      console.error('Fetch error:', e);
      alert('Error cargando personajes');
    }
  }

  function render(items, pagination) {
    leftCol.innerHTML = ''; rightCol.innerHTML = '';
    lastPagination = pagination;
    pageInfo.textContent = pagination && pagination.pages ? `Página ${page} / ${pagination.pages}` : `Página ${page}`;

    if (!Array.isArray(items)) items = [];

    const left = items.slice(0, 5);
    const right = items.slice(5, 10);

    left.forEach(item => leftCol.appendChild(makeCard(item)));
    right.forEach(item => rightCol.appendChild(makeCard(item)));

    prevBtn.disabled = page <= 1;
    nextBtn.disabled = !(pagination && pagination.pages && page < pagination.pages);
  }

  function makeCard(item) {
    const el = document.createElement('div'); el.className = 'card';
    el.innerHTML = `
      <img src="${item.imagen}" alt="${item.nombre}" />
      <div class="meta">
        <h3>${item.nombre}</h3>
        <div class="specie">${item.especie}</div>
      </div>`;
    return el;
  }

  // Listeners
  modeEl.addEventListener('change', populateOptions);
  prevBtn.addEventListener('click', () => { if (page > 1) { page--; doSearch(); } });
  nextBtn.addEventListener('click', () => { if (lastPagination && lastPagination.pages && page < lastPagination.pages) { page++; doSearch(); } });
  searchBtn.addEventListener('click', () => { page = 1; doSearch(); });

  // Inicialización: poblar opciones y hacer una búsqueda inicial
  await populateOptions();
  await doSearch();

  // Exponer función para forzar búsqueda cuando sea necesario
  return { doSearch };
}
