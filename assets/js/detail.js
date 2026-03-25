document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(location.search);
  const id = params.get('id') || 'stay_01';
  const mode = params.get('mode') || 'favorite';

  const stays = await fetch(dataUrl('data/stays.json')).then(r => r.json());
  const reviews = await fetch(dataUrl('data/reviews.json')).then(r => r.json());
  const stay = stays.find(s => s.id === id) || stays[0];
  const isTrap = mode === 'trap';

  window.ARGState.set(Object.assign({ sawRed: true }, isTrap ? { sawTrap: true } : {}));
  const completed = window.ARGState.completed();

  if (isTrap) document.body.classList.add('page-trap');

  document.querySelector('[data-page-label]').textContent = completed ? '適合順' : 'おすすめ';
  document.querySelector('[data-mode-badge]').textContent = isTrap ? 'mode=trap' : 'mode=favorite';
  document.getElementById('detail-title').textContent = stay.name;
  document.getElementById('detail-copy').textContent = isTrap ? stay.trapSummary : stay.summary;
  document.getElementById('detail-price').textContent = stay.priceText;
  document.getElementById('detail-meta').innerHTML = `
    <span>エリア: ${stay.area}</span>
    <span>定員: ${stay.capacity}</span>
    <span>${completed ? '対象地点' : '宿泊施設'} ID: ${stay.id}</span>
  `;
  document.getElementById('detail-gallery').innerHTML = stay.gallery.map(src => `<img src="${assetUrl(src)}" alt="">`).join('');

  const cautionItems = isTrap ? stay.cautionsTrap : stay.cautions;
  document.getElementById('caution-box').innerHTML = `
    <div class="eyebrow">滞在前にご確認ください</div>
    <h2>利用上の注意</h2>
    <ul class="list">${cautionItems.filter(x => !x.isAlert).map(x => `<li>${x.text}</li>`).join('')}</ul>
    <ul class="alert-list">${cautionItems.filter(x => x.isAlert).map(x => `<li>${x.text}</li>`).join('')}</ul>
    <p class="small muted">※ 赤字の注意事項は、掲載内容の更新状況によって表現が異なる場合があります。</p>
  `;

  const reviewSource = isTrap ? reviews.trap : reviews.favorite;
  document.getElementById('review-list').innerHTML = reviewSource.map(item => `
    <article class="review-card">
      <div class="review-head"><strong>${item.name}</strong><span>${item.date}</span></div>
      <p>${item.text}</p>
    </article>
  `).join('');

  const archiveLink = document.getElementById('archive-link');
  const modeGuide = document.getElementById('mode-guide');
  if (completed) {
    archiveLink.classList.remove('hidden');
    modeGuide.innerHTML = '探索が完了しました。<strong>詳細ログを見る</strong> が表示されています。';
  } else if (isTrap) {
    modeGuide.innerHTML = 'URL の <code>mode=trap</code> を確認中です。ほかの違和感も見ていると、表示が変わる場合があります。';
  } else {
    modeGuide.innerHTML = 'レビュー欄の文言をヒントに、URL の <code>mode=favorite</code> を別の値に変えてみてください。';
  }

  document.getElementById('trap-toggle').addEventListener('click', () => {
    params.set('mode', isTrap ? 'favorite' : 'trap');
    params.set('id', id);

    if (!isTrap) {
      runSiteAlteredOverlay(async () => {
        await flashTransition(180);
        location.search = params.toString();
      });
      return;
    }

    flashTransition(120).then(() => {
      location.search = params.toString();
    });
  });
});
