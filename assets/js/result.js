document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(location.search);
  const id = params.get('stay') || 'stay_01';
  const stays = await fetch(dataUrl('data/stays.json')).then(r => r.json());
  const stay = stays.find(s => s.id === id) || stays[0];
  const isTarget = stay.id === 'stay_01';

  document.getElementById('result-title').textContent = stay.name;
  document.getElementById('result-copy').textContent = stay.resultCopy;
  document.getElementById('result-image').src = isTarget
    assetUrl(stay.resultImage);
  document.getElementById('result-price').textContent = stay.priceText;
  document.getElementById('result-area').textContent = stay.area;
  document.getElementById('result-capacity').textContent = stay.capacity;
  document.getElementById('result-score').textContent = stay.score;
  document.getElementById('gallery').innerHTML = stay.gallery.map(src => `<img src="${assetUrl(src)}" alt="">`).join('');
  document.querySelector('.result-visual').classList.add('is-clickable');

  const jump = (e) => {
    e.preventDefault();
    window.ARGState.set({ sawHand: true });
    runSiteAlteredOverlay(async () => {
      await flashTransition(240);
      location.href = `./detail.html?id=${stay.id}&mode=favorite`;
    });
  };

  document.getElementById('result-image-link').addEventListener('click', jump);
  document.getElementById('detail-cta').addEventListener('click', jump);
});
