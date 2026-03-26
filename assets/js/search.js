document.addEventListener('DOMContentLoaded', async () => {
  if (window.AnomalyState) window.AnomalyState.set('anomaly-2');
  const params = new URLSearchParams(location.search);
  const q = (params.get('q') || '').trim();
  await fetch(dataUrl('data/search-index.json')).then(r => r.json());

  const target = {
    title: '東雲レジデンス浅草',
    area: '東京 / 東部エリア',
    summary: '診断内容に関わらず、最適条件に合致した宿として優先表示されています。',
    url: './detail.html?id=stay_01&mode=favorite',
    thumb: 'assets/images/stay_01_01_hand_1200x800.png'
  };

  const resultCount = document.getElementById('result-count');
  const resultList = document.getElementById('search-result-list');

  if (resultCount) {
    resultCount.textContent = q ? '検索結果 1件' : 'おすすめ 1件';
  }

  resultList.innerHTML = `
    <article class="search-card is-clickable">
      <a class="search-card-link" href="${target.url}">
        <div class="search-card-thumb">
          <img src="${assetUrl(target.thumb)}" alt="${target.title}">
        </div>
        <div class="search-card-body">
          <p class="search-card-area">${target.area}</p>
          <h3 class="search-card-title">${target.title}</h3>
          <p class="search-card-summary">${target.summary}</p>
        </div>
      </a>
    </article>
  `;

  const link = resultList.querySelector('.search-card-link');
  if (link) {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      runSiteAlteredOverlay(async () => {
        await flashTransition(220);
        location.href = target.url;
      });
    });
  }
});
