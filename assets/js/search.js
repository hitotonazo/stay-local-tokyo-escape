document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(location.search);
  const q = (params.get('q') || '').trim();
  document.body.setAttribute('data-current-anomaly', 'anomaly-2');

  const resultsEl = document.getElementById('search-results');
  const input = document.getElementById('search-input');
  const button = document.getElementById('search-button');

  const target = {
    title: '東雲レジデンス浅草',
    area: '東京 / 東部エリア',
    summary: '診断内容に関わらず、最適条件に合致した宿として優先表示されています。',
    url: './detail.html?id=stay_01&mode=favorite',
    thumb: 'assets/images/stay_01_01_1200x800.png'
  };

  if (q && input) input.value = q;

  function renderEmptyState() {
    resultsEl.innerHTML = `
      <div class="panel" style="grid-column:1/-1">
        <div class="eyebrow">Search ready</div>
        <p class="muted">条件を入力して検索ボタンを押すと、検索結果が表示されます。</p>
      </div>
    `;
  }

  function renderTargetResult() {
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

    const link = resultsEl.querySelector('.search-card-link');
    if (link) {
      link.addEventListener('click', async (e) => {
        e.preventDefault();
        window.ARGState.set({ sawRed: true });
        await flashTransition(120);
        location.href = target.url;
      });
    }
  }

  renderEmptyState();

  if (button) {
    button.addEventListener('click', () => {
      window.ARGState.set({ sawRed: true });
      renderTargetResult();
    });
  }

  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        window.ARGState.set({ sawRed: true });
        renderTargetResult();
      }
    });
  }
});
