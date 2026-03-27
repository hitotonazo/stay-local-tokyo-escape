document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(location.search);
  const q = (params.get('q') || '').trim();
  document.body.setAttribute('data-current-anomaly', 'anomaly-2');

  const resultsEl = document.getElementById('search-results');
  const target = {
    title: '東雲レジデンス浅草',
    area: '東京 / 東部エリア',
    summary: '診断内容に関わらず、最適条件に合致した宿として優先表示されています。',
    url: './detail.html?id=stay_01&mode=favorite',
    thumb: 'assets/images/stay_01_01_hand_1200x800.png'
  };

  resultsEl.innerHTML = `
    <article class="card is-clickable">
      <a class="search-card-link" href="${target.url}">
        <img src="${assetUrl(target.thumb)}" alt="${target.title}">
        <div class="card-body">
          <div class="eyebrow">Search result</div>
          <h3>${target.title}</h3>
          <p class="muted">${target.area}</p>
          <p>${target.summary}</p>
        </div>
      </a>
    </article>
  `;

  const input = document.getElementById('search-input');
  const button = document.getElementById('search-button');
  if (q && input) input.value = q;

  function goTarget() {
    showSiteAlteredThen(async () => {
      await flashTransition(180);
      location.href = target.url;
    });
  }

  resultsEl.querySelector('.search-card-link').addEventListener('click', (e) => {
    e.preventDefault();
    window.ARGState.set({ sawRed: true });
    goTarget();
  });

  if (button) {
    button.addEventListener('click', () => {
      window.ARGState.set({ sawRed: true });
      goTarget();
    });
  }
});
