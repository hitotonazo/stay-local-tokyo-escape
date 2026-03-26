document.addEventListener('DOMContentLoaded', async () => {
  const input = document.getElementById('search-input');
  const button = document.getElementById('search-button');
  const list = document.getElementById('search-results');
  const idx = await fetch(dataUrl('data/search-index.json')).then(r => r.json());

  const render = (items) => {
    list.innerHTML = items.map(item => `
      <article class="card">
        <img src="${assetUrl('assets/images/stay_01_01_hand_1200x800.png')}" alt="">
        <div class="card-body">
          <div class="eyebrow">${item.area}</div>
          <h3>${item.title}</h3>
          <p class="muted small">${item.summary}</p>
          <a class="inline-link" href="${'./detail.html?id=stay_01&mode=favorite'}">詳細を見る</a>
        </div>
      </article>
    `).join('');
  };

  render(idx.items);

  const run = async () => {
    const q = input.value.trim().toLowerCase();
    await flashTransition(140);
    if (!q) return render(idx.items);
    const items = idx.items.filter(item =>
      [item.title, item.area, item.summary, ...(item.keywords || [])].join(' ').toLowerCase().includes(q)
    );
    render(items.length ? items : [{
      title:'該当する宿が見つかりませんでした',
      area:'Search',
      summary:'診断結果ページやおすすめ宿一覧からご確認ください。',
      url:'./index.html',
      thumb:'assets/images/img_thumb_stay01_600x400.png'
    }]);
  };

  button.addEventListener('click', run);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') run(); });
});
