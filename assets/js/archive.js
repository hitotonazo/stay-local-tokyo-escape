document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('archive-marker').textContent = window.ARGState.completed() ? 'LOG ACCESS GRANTED' : 'PARTIAL RECORD';
  const noise = document.querySelector('.micro-noise');
  const fire = () => {
    noise.classList.remove('glitch-on');
    void noise.offsetWidth;
    noise.classList.add('glitch-on');
  };
  setTimeout(fire, 1200);
  setInterval(fire, 24000);
});
