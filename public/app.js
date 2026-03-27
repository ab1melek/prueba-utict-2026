// app.js (módulo)
// Responsabilidad: orquestar inicialización del front importando módulos especializados
import { setupAudio } from './modules/audio.js';
import { initCatalog } from './modules/catalog.js';
import { initGame } from './modules/game.js';

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
  throw new Error('Missing window.API_BASE');
}

// Elementos DOM compartidos
const elements = {
  modeEl: document.getElementById('mode'),
  optionsEl: document.getElementById('options'),
  searchBtn: document.getElementById('search'),
  leftCol: document.getElementById('left-col'),
  rightCol: document.getElementById('right-col'),
  prevBtn: document.getElementById('prev'),
  nextBtn: document.getElementById('next'),
  pageInfo: document.getElementById('pageInfo'),

  gameToggleBtn: document.getElementById('game-toggle'),
  catalogView: document.getElementById('catalog-view'),
  gameView: document.getElementById('game-view'),
  gameArea: document.getElementById('game-area'),
  timerEl: document.getElementById('timer'),
  scoreEl: document.getElementById('score'),
  highscoreEl: document.getElementById('highscore'),
  backBtn: document.getElementById('back-catalog'),
  gameOverEl: document.getElementById('game-over'),
  finalScoreEl: document.getElementById('final-score'),
  highScoreMsgEl: document.getElementById('high-score-msg'),
  playAgainBtn: document.getElementById('play-again'),
};

// Inicialización: audio, catálogo y juego
setupAudio(0.1);

(async () => {
  await initCatalog(API_BASE, elements);
  const game = initGame(API_BASE, elements);
  if (game && game.loadCharacterImages) await game.loadCharacterImages();
})();
