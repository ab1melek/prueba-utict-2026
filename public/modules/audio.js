// audio.js
// Responsabilidad: configurar el elemento <audio> del sitio (volumen y autoplay)
export function setupAudio(defaultVolume = 0.15) {
  const audio = document.querySelector('audio');
  if (!audio) return null;
  try {
    // establecer volumen inicial
    audio.volume = defaultVolume;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        document.addEventListener('click', () => {
          audio.play().catch(() => {});
        }, { once: true });
      });
    }
  } catch (e) {
    // silenciar fallos de autoplay
  }
  return audio;
}
