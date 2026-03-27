document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(location.search);
  const id = params.get('stay') || params.get('id') || 'stay_01';
  const from = params.get('from') || 'detail';
  const mode = params.get('mode') || 'favorite';
  const stays = await fetch(dataUrl('data/stays.json')).then(r => r.json());
  const reviews = await fetch(dataUrl('data/reviews.json')).then(r => r.json());
  const stay = stays.find(s => s.id === id) || stays[0];
  const isTarget = stay.id === 'stay_01';
  const isTrap = mode === 'trap';
  const fromDiagnosis = from === 'diagnosis';
  document.body.setAttribute('data-current-anomaly', fromDiagnosis ? 'anomaly-1' : (isTrap ? 'anomaly-3' : 'anomaly-2'));
  if (!fromDiagnosis) window.ARGState.set({ sawRed: true });
  if (isTrap) window.ARGState.set({ sawTrap: true });
  const completed = window.ARGState.completed();
  document.getElementById('recommend-banner').classList.toggle('hidden', !fromDiagnosis);
  document.getElementById('mode-label').textContent = fromDiagnosis ? 'Recommended stay' : (isTrap ? 'mode=trap' : 'Stay detail');
  document.getElementById('result-title').textContent = stay.name;
  document.getElementById('result-copy').textContent = isTrap ? stay.trapSummary : stay.summary;
  document.getElementById('result-price').textContent = stay.priceText;
  document.getElementById('result-area').textContent = stay.area;
  document.getElementById('result-capacity').textContent = `${stay.capacity} / ${stay.score}`;
  document.getElementById('detail-meta').innerHTML = `<span>表示元: ${fromDiagnosis ? '診断結果' : (from === 'search' ? '検索結果' : '宿詳細')}</span><span>現在の表示: ${isTrap ? 'mode=trap' : 'mode=favorite'}</span><span>${completed ? '対象地点' : '宿泊施設'} ID: ${stay.id}</span>`;
  const resultImageEl = document.getElementById('result-image');
  resultImageEl.src = assetUrl(fromDiagnosis && isTarget ? 'assets/images/stay_01_01_hand_1200x800.png' : stay.mainImage);
  document.getElementById('gallery').innerHTML = stay.gallery.map(src => `<img src="${assetUrl(src)}" alt="">`).join('');
  const cautionItems = isTrap ? stay.cautionsTrap : stay.cautions;
  document.getElementById('caution-box').innerHTML = `<div class="eyebrow">Caution</div><h2>利用上の注意</h2><ul class="list">${cautionItems.filter(x => !x.isAlert).map(x => `<li>${x.text}</li>`).join('')}</ul><ul class="list alert-list">${cautionItems.filter(x => x.isAlert).map(x => `<li>${x.text}</li>`).join('')}</ul><p class="small muted">※ 赤字の注意事項は、掲載内容の更新状況によって表現が異なる場合があります。</p>`;
  const reviewSource = isTrap ? reviews.trap : reviews.favorite;
  document.getElementById('review-list').innerHTML = reviewSource.map(item => `<article class="review-card"><div class="review-head"><strong>${item.name}</strong><span>${item.date}</span></div><p>${item.text}</p></article>`).join('');
  const archiveLink = document.getElementById('archive-link');
  const modeGuide = document.getElementById('mode-guide');
  archiveLink.classList.add('hidden');
  if (isTrap && completed) {
    archiveLink.classList.remove('hidden');
    modeGuide.innerHTML = '探索が完了しました。<strong>詳細ログを見る</strong> が表示されています。';
  } else if (isTrap) {
    modeGuide.innerHTML = '表示モードが変更されています。注意事項とレビュー内容を確認してください。';
  } else if (fromDiagnosis) {
    modeGuide.innerHTML = '診断結果から到達した表示です。画像クリックで改変演出が発生します。';
  } else {
    modeGuide.innerHTML = '宿詳細ページです。表示モードを切り替えると別の表示になります。';
  }
  document.getElementById('result-image-link').addEventListener('click', async (e) => {
    e.preventDefault();
    if (fromDiagnosis && isTarget) {
      window.ARGState.set({ sawHand: true });
      showSiteAlteredThen(async () => {
        await flashTransition(180);
        location.href = './result.html?stay=stay_01&from=detail&mode=favorite';
      });
      return;
    }
    await flashTransition(120);
  });
  document.getElementById('trap-toggle').addEventListener('click', (e) => {
    e.preventDefault();
    const next = new URLSearchParams();
    next.set('stay', stay.id);
    next.set('from', from === 'diagnosis' ? 'detail' : from);
    next.set('mode', isTrap ? 'favorite' : 'trap');
    if (!isTrap) {
      runSiteAlteredOverlay(async () => {
        await flashTransition(180);
        location.href = `./result.html?${next.toString()}`;
      });
      return;
    }
    flashTransition(120).then(() => { location.href = `./result.html?${next.toString()}`; });
  });
  document.getElementById('back-link').href = from === 'search' ? './search.html' : './index.html';
});