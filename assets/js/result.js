document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(location.search);
  const id = params.get('stay') || 'stay_01';
  const stays = await fetch(dataUrl('data/stays.json')).then(r => r.json());
  const stay = stays.find(s => s.id === id) || stays[0];
  const isTarget = stay.id === 'stay_01';

  document.body.setAttribute('data-current-anomaly', isTarget ? 'anomaly-1' : '');

  document.getElementById('result-title').textContent = stay.name;
  document.getElementById('result-copy').textContent = stay.resultCopy;
  document.getElementById('result-price').textContent = stay.priceText;
  document.getElementById('result-area').textContent = stay.area;
  document.getElementById('result-capacity').textContent = stay.capacity;
  document.getElementById('result-score').textContent = stay.score;
  document.getElementById('gallery').innerHTML = stay.gallery.map(src => `<img src="${assetUrl(src)}" alt="">`).join('');

  const resultImageEl = document.getElementById('result-image');
  resultImageEl.src = assetUrl(isTarget ? 'assets/images/stay_01_01_hand_1200x800.png' : stay.resultImage);

  const imageLink = document.getElementById('result-image-link');
  const detailCta = document.getElementById('detail-cta');

  imageLink.addEventListener('click', (e) => {
    e.preventDefault();
    if (isTarget) {
      window.ARGState.set({ sawHand: true });
      showSiteAlteredThen(async () => {
        await flashTransition(180);
        location.href = './index.html';
      });
      return;
    }
    showSiteAlteredThen(async () => {
      await flashTransition(180);
      location.href = `./detail.html?id=${stay.id}&mode=favorite`;
    });
  });

  detailCta.addEventListener('click', async (e) => {
    e.preventDefault();
    await flashTransition(120);
    location.href = `./detail.html?id=${stay.id}&mode=favorite`;
  });
});
