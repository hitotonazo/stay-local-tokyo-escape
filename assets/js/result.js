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
  const fromSearch = from === 'search';

  const state = window.ARGState.get();
  const anomaly1Active = isTarget && (fromDiagnosis || fromSearch) && !state.sawHand && !isTrap;
  const anomaly2Active = isTarget && state.sawHand && !state.sawRed && !isTrap;
  const anomaly3Active = isTarget && state.sawRed && !isTrap;

  const anomalyName = anomaly1Active ? 'anomaly-1' : (isTrap ? 'anomaly-3' : (anomaly2Active ? 'anomaly-2' : (anomaly3Active ? 'anomaly-3' : '')));
  document.body.setAttribute('data-current-anomaly', anomalyName);

  if (isTrap) window.ARGState.set({ sawTrap: true });

  const completed = window.ARGState.completed();

  document.getElementById('recommend-banner').classList.toggle('hidden', !fromDiagnosis);
  document.getElementById('mode-label').textContent = fromDiagnosis ? 'Recommended stay' : (isTrap ? 'mode=trap' : 'Stay detail');
  document.getElementById('result-title').textContent = stay.name;
  document.getElementById('result-copy').textContent = isTrap ? stay.trapSummary : stay.summary;
  document.getElementById('result-price').textContent = stay.priceText;
  document.getElementById('result-area').textContent = stay.area;
  document.getElementById('result-capacity').textContent = `${stay.capacity} / ${stay.score}`;
  document.getElementById('detail-meta').innerHTML = `
    <span>表示元: ${fromDiagnosis ? '診断結果' : (fromSearch ? '検索結果' : '宿詳細')}</span>
    <span>現在の表示: ${isTrap ? 'mode=trap' : 'mode=favorite'}</span>
    <span>${completed ? '対象地点' : '宿泊施設'} ID: ${stay.id}</span>
  `;

  const resultImageEl = document.getElementById('result-image');
  resultImageEl.src = assetUrl(anomaly1Active ? 'assets/images/stay_01_01_hand_1200x800.png' : stay.mainImage);

  document.getElementById('gallery').innerHTML = stay.gallery.map(src => `<img src="${assetUrl(src)}" alt="">`).join('');

  const cautionItems = isTrap ? stay.cautionsTrap : stay.cautions;
  const bloodNote = anomaly2Active
    ? `<div id="blood-warning" class="blood-warning" role="button" tabindex="0">※ 退出には管理側の承認が必要です。表示がおかしい場合はこの注意書きを確認してください。</div>`
    : '';

  document.getElementById('caution-box').innerHTML = `
    <div class="eyebrow">Caution</div>
    <h2>利用上の注意</h2>
    ${bloodNote}
    <ul class="list">${cautionItems.filter(x => !x.isAlert).map(x => `<li>${x.text}</li>`).join('')}</ul>
    <ul class="list alert-list">${cautionItems.filter(x => x.isAlert).map(x => `<li>${x.text}</li>`).join('')}</ul>
    <p class="small muted">※ 赤字の注意事項は、掲載内容の更新状況によって表現が異なる場合があります。</p>
  `;

  const reviewSource = isTrap ? reviews.trap : (anomaly3Active ? (reviews.favoriteAfterAlter || reviews.favorite) : reviews.favorite);
  document.getElementById('review-list').innerHTML = reviewSource.map(item => `
    <article class="review-card">
      <div class="review-head"><strong>${item.name}</strong><span>${item.date}</span></div>
      <p>${item.text}</p>
    </article>
  `).join('');

  const archiveLink = document.getElementById('archive-link');
  const modeGuide = document.getElementById('mode-guide');
  archiveLink.classList.add('hidden');

  if (isTrap && completed) {
    archiveLink.classList.remove('hidden');
    modeGuide.innerHTML = '探索が完了しました。<strong>詳細ログを見る</strong> が表示されています。';
  } else if (isTrap) {
    modeGuide.innerHTML = '表示モードが変更されています。すべての宿のレビューが監禁・犯罪記録に置き換わっています。';
  } else if (anomaly1Active) {
    modeGuide.innerHTML = 'この画像には違和感があります。クリックすると表示が改変されます。';
  } else if (anomaly2Active) {
    modeGuide.innerHTML = '血文字の注意書きだけが不自然に残っています。クリックすると表示が改変されます。';
  } else if (anomaly3Active) {
    modeGuide.innerHTML = 'レビュー欄に trap mode を示す不穏な記載が混ざっています。URL の mode を trap に変更するとさらに表示が変化します。';
  } else {
    modeGuide.innerHTML = '宿詳細ページです。表示モードを切り替えると別の表示になります。';
  }

  const imageLink = document.getElementById('result-image-link');
  const trapToggle = document.getElementById('trap-toggle');
  const backLink = document.getElementById('back-link');

  imageLink.addEventListener('click', async (e) => {
    e.preventDefault();

    if (anomaly1Active) {
      window.ARGState.set({ sawHand: true });
      showSiteAlteredThen(async () => {
        await flashTransition(180);
        location.href = './index.html';
      });
      return;
    }

    await flashTransition(120);
  });

  const bloodWarning = document.getElementById('blood-warning');
  if (bloodWarning) {
    const handleBlood = (e) => {
      e.preventDefault();
      window.ARGState.set({ sawRed: true });
      showSiteAlteredThen(async () => {
        await flashTransition(180);
        location.href = './index.html';
      });
    };
    bloodWarning.addEventListener('click', handleBlood);
    bloodWarning.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') handleBlood(e);
    });
  }

  trapToggle.addEventListener('click', (e) => {
    e.preventDefault();
    const next = new URLSearchParams();
    next.set('stay', stay.id);
    next.set('from', fromDiagnosis ? 'detail' : from);
    next.set('mode', isTrap ? 'favorite' : 'trap');

    if (!isTrap) {
      runSiteAlteredOverlay(async () => {
        await flashTransition(180);
        location.href = `./result.html?${next.toString()}`;
      });
      return;
    }

    flashTransition(120).then(() => {
      location.href = `./result.html?${next.toString()}`;
    });
  });

  backLink.href = fromSearch ? './search.html' : './index.html';
});