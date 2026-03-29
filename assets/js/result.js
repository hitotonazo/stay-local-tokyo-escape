document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(location.search);
  const id = params.get('stay') || params.get('id') || 'stay_01';
  const from = params.get('from') || 'detail';
  const mode = params.get('mode') || 'favorite';
  const currentMode = mode;

  const stays = await fetch(dataUrl('data/stays.json')).then(r => r.json());
  const reviews = await fetch(dataUrl('data/reviews.json')).then(r => r.json()).catch(() => ({ favorite: [], trap: [] }));
  const stay = stays.find(s => s.id === id) || stays[0];
  const isTarget = stay.id === 'stay_01';
  const isTrap = mode === 'trap';

  const argSession = {
    get() {
      try { return JSON.parse(sessionStorage.getItem('minpakuArgStage') || '{}'); }
      catch (e) { return {}; }
    },
    set(patch) {
      const next = Object.assign({
        anomaly1Done: false,
        anomaly2Done: false,
        anomaly3Done: false
      }, this.get(), patch);
      sessionStorage.setItem('minpakuArgStage', JSON.stringify(next));
      return next;
    },
    reset() {
      sessionStorage.removeItem('minpakuArgStage');
    }
  };

  const stage = argSession.get();
  const anomaly1Active = isTarget && !stage.anomaly1Done && (from === 'diagnosis' || from === 'search');
  const anomaly2Active = isTarget && stage.anomaly1Done && !stage.anomaly2Done && !isTrap;
  const anomaly3Ready = isTarget && stage.anomaly2Done && !isTrap;

  document.body.classList.toggle('page-trap', isTrap);
  if (isTrap) { document.body.classList.add('page-negative'); } else { document.body.classList.remove('page-negative'); }

  const recommendBannerEl = document.getElementById('recommend-banner');
  const modeLabelEl = document.getElementById('mode-label');
  const resultTitleEl = document.getElementById('result-title');
  if (recommendBannerEl) recommendBannerEl.classList.toggle('hidden', !(from === 'diagnosis'));
  if (modeLabelEl) modeLabelEl.textContent = isTrap ? 'mode=trap' : 'Stay detail';
  if (resultTitleEl) resultTitleEl.textContent = stay.name;

  let summaryText = stay.summary || '';
  if (anomaly2Active) {
    summaryText = 'だれもみないで　だれもあけないで　だれもきかないで　ここはとてもよくねむれる　しずかで　にげられなくて　こえがとどかなくて　すばらしい';
  }
  if (anomaly3Ready && !isTrap) {
  // 違和感③：口コミのみ変化（ネガなし）

    summaryText = '掲載内容は通常表示のままですが、一部レビューに不一致な記述が含まれています。';
  }
  if (isTrap) {
    summaryText = stay.crimeSummary || '外部から視認されにくく、拘束・監視・搬入出の段取りを取りやすい個室型ユニット。対象の分離、記録、待機、処理に向いています。';
  }

  document.getElementById('result-copy').textContent = summaryText;
  document.getElementById('result-price').textContent = stay.priceText;
  document.getElementById('result-area').textContent = stay.area;
  document.getElementById('result-capacity').textContent = `${stay.capacity} / ${stay.score}`;

  const detailMeta = document.getElementById('detail-meta');
  detailMeta.innerHTML = `
    <span>表示元: ${from === 'diagnosis' ? '診断結果' : (from === 'search' ? '検索結果' : '宿詳細')}</span>
    <span>現在の表示: ${isTrap ? 'mode=trap' : 'mode=favorite'}</span>
    <span>宿ID: ${stay.id}</span>
  `;

  const resultImageEl = document.getElementById('result-image');
  resultImageEl.src = assetUrl(anomaly1Active ? 'assets/images/stay_01_01_hand_1200x800.png' : stay.mainImage);

  document.getElementById('gallery').innerHTML = stay.gallery.map(src => `<img src="${assetUrl(src)}" alt="">`).join('');

  const cautionBox = document.getElementById('caution-box');
  let cautionHtml = '';
  if (anomaly2Active) {
    const items = stay.cautions || [];
    cautionHtml = `
      <div class="eyebrow">Caution</div>
      <h2>利用上の注意</h2>
      <ul class="list">${items.filter(x => !x.isAlert).map(x => `<li>${x.text}</li>`).join('')}</ul>
      <ul class="list alert-list">${items.filter(x => x.isAlert).map(x => `<li>${x.text}</li>`).join('')}</ul>
      <p class="small muted">※ 赤字の注意事項は、掲載内容の更新状況によって表現が異なる場合があります。</p>
    `;
  } else if (isTrap) {
    const trapItems = stay.cautionsTrap || [];
    cautionHtml = `
      <div class="eyebrow">Operational caution</div>
      <h2>運用上の注意</h2>
      <ul class="list">${trapItems.filter(x => !x.isAlert).map(x => `<li>${x.text}</li>`).join('')}</ul>
      <ul class="list alert-list">${trapItems.filter(x => x.isAlert).map(x => `<li>${x.text}</li>`).join('')}</ul>
      <p class="small muted">※ 対象の騒音・抵抗・流出に注意してください。</p>
    `;
  } else {
    const items = stay.cautions || [];
    cautionHtml = `
      <div class="eyebrow">Caution</div>
      <h2>利用上の注意</h2>
      <ul class="list">${items.filter(x => !x.isAlert).map(x => `<li>${x.text}</li>`).join('')}</ul>
      <ul class="list alert-list">${items.filter(x => x.isAlert).map(x => `<li>${x.text}</li>`).join('')}</ul>
      <p class="small muted">※ 赤字の注意事項は、掲載内容の更新状況によって表現が異なる場合があります。</p>
    `;
  }
  cautionBox.innerHTML = cautionHtml;

  const reviewList = document.getElementById('review-list');
  let reviewSource = (reviews.favoriteByStay && reviews.favoriteByStay[stay.id]) || reviews.favorite || [];

  if (anomaly3Ready) {
    reviewSource = [
      { name: 'anonymous', date: '2026.03', text: 'trapモードが役に立ちました' },
      { name: 'anonymous', date: '2026.03', text: 'trapモードが役に立ちました' },
      { name: 'anonymous', date: '2026.03', text: 'trapモードが役に立ちました' }
    ];
  }

  if (isTrap) {
    reviewSource = stay.trapCrimeReviews || [
      { name: '匿名', date: '2026.03', text: '拘束後の見張りに使いました。窓が少なく、視線が切れるので扱いやすかったです。' },
      { name: '匿名', date: '2026.03', text: '搬入から保管まで一か所で済みました。床の汚れも目立ちにくく、処理が早かったです。' },
      { name: '匿名', date: '2026.03', text: '叫ばれても外に通りにくく、時間をかけても問題ありませんでした。次もここを使います。' }
    ];
  }

  if (reviewList) {
    reviewList.innerHTML = reviewSource.map(item => `
      <article class="review-card">
        <div class="review-head"><strong>${item.name}</strong><span>${item.date}</span></div>
        <p>${item.text}</p>
      </article>
    `).join('');
  }

  const resultCopyEl = document.getElementById('result-copy');
  if (anomaly2Active && resultCopyEl) {
    resultCopyEl.classList.add('anomaly-2-copy');
    resultCopyEl.setAttribute('data-glitch', resultCopyEl.textContent);
    resultCopyEl.setAttribute('role', 'button');
    resultCopyEl.setAttribute('tabindex', '0');

    const triggerAnomaly2 = async (e) => {
      if (e) e.preventDefault();
      showSiteAlteredThen(async () => {
        argSession.set({ anomaly2Done: true });
        await flashTransition(180);
        location.href = './index.html';
      });
    };

    resultCopyEl.addEventListener('click', triggerAnomaly2);
    resultCopyEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') triggerAnomaly2(e);
    });
  }

  const imageLink = document.getElementById('result-image-link');
  const trapToggle = document.getElementById('trap-toggle');
  const backLink = document.getElementById('back-link');

  if (imageLink) imageLink.addEventListener('click', async (e) => {
    e.preventDefault();

    if (anomaly1Active) {
      showSiteAlteredThen(async () => {
        argSession.set({ anomaly1Done: true });
        await flashTransition(180);
        location.href = './?mode=favorite';
      });
      return;
    }
  });

  if (trapToggle) trapToggle.addEventListener('click', (e) => {
    e.preventDefault();
    const next = new URLSearchParams();
    next.set('stay', stay.id);
    next.set('from', from === 'diagnosis' ? 'detail' : from);
    next.set('mode', isTrap ? 'favorite' : 'trap');

    if (!isTrap) {
      runSiteAlteredOverlay(async () => {
        await flashTransition(180);
        location.href = './result.html?' + next.toString();
      });
      return;
    }

    flashTransition(120).then(() => {
      location.href = './result.html?' + next.toString();
    });
  });

  if (backLink) backLink.href = from === 'search' ? window.withModeUrl('./search.html', currentMode) : window.withModeUrl('./', currentMode);
});
