(function(){
  window.getMode = function(){
    const params = new URLSearchParams(location.search);
    return params.get('mode') || 'favorite';
  };


  window.withModeUrl = function(href, modeOverride){
    const hrefValue = String(href || '').trim();
    if (!hrefValue || hrefValue.startsWith('javascript:') || hrefValue.startsWith('#')) return hrefValue;
    const mode = modeOverride || window.getMode();
    const url = new URL(hrefValue, location.origin);
    url.searchParams.set('mode', mode);
    return url.pathname + '?' + url.searchParams.toString() + (url.hash || '');
  };

  window.applyCurrentModeToLinks = function(rootEl){
    const scope = rootEl || document;
    const mode = window.getMode();
    scope.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      if (!href || href.startsWith('javascript:') || href.startsWith('#')) return;
      if (!href.startsWith('./') && !href.startsWith('/')) return;
      a.setAttribute('href', window.withModeUrl(href, mode));
    });
  };

  const yearEls = document.querySelectorAll('[data-year]');
  yearEls.forEach(el => el.textContent = new Date().getFullYear());

  window.ARGState = {
    get(){
      try{return JSON.parse(sessionStorage.getItem('minpakuArgState') || '{}');}
      catch(e){return {};}
    },
    set(patch){
      const next = Object.assign({sawHand:false,sawRed:false,sawTrap:false}, this.get(), patch);
      sessionStorage.setItem('minpakuArgState', JSON.stringify(next));
      return next;
    },
    reset(){ sessionStorage.removeItem('minpakuArgState'); },
    completed(){
      const s = this.get();
      return !!(s.sawHand && s.sawRed && s.sawTrap);
    }
  };

  window.flashTransition = function(duration = 260){
    const noise = document.querySelector('.noise-flash');
    const fade = document.querySelector('.fade-layer');
    if(!noise || !fade) return Promise.resolve();
    fade.style.opacity = '1';
    noise.style.opacity = '.3';
    return new Promise(resolve => {
      setTimeout(() => {
        noise.style.opacity = '0';
        fade.style.opacity = '0';
        resolve();
      }, duration);
    });
  };



  const noiseOverlay = document.getElementById('noise-overlay');
  let noiseNextAction = null;

  window.runSiteAlteredOverlay = function(nextAction = null){
    if(!noiseOverlay) {
      if (typeof nextAction === 'function') nextAction();
      return;
    }
    noiseNextAction = nextAction;
    noiseOverlay.classList.add('is-active');
    noiseOverlay.setAttribute('aria-hidden', 'false');
  };

  window.closeSiteAlteredOverlay = function(){
    if(!noiseOverlay) return;
    noiseOverlay.classList.remove('is-active');
    noiseOverlay.setAttribute('aria-hidden', 'true');
  };

  function handleNoiseOverlayClick(){
    window.closeSiteAlteredOverlay();
    if(typeof noiseNextAction === 'function'){
      const action = noiseNextAction;
      noiseNextAction = null;
      action();
      return;
    }
    noiseNextAction = null;
  }

  if(noiseOverlay){
    noiseOverlay.addEventListener('click', handleNoiseOverlayClick);
  }

  window.showSiteAlteredThen = function(nextAction){
    runSiteAlteredOverlay(() => {
      Promise.resolve().then(() => typeof nextAction === 'function' ? nextAction() : null);
    });
  };


  document.querySelectorAll('[data-archive-title]').forEach(el => {
    if(window.ARGState.completed()) el.textContent = 'STAY LOCAL TOKYO ESCAPE / ARCHIVE';
  });

  document.querySelectorAll('[data-reset-arg]').forEach(btn => {
    btn.addEventListener('click', () => {
      window.ARGState.reset();
      alert('探索状態をリセットしました。');
      sessionStorage.clear(); location.href = './?mode=favorite';
    });
  });
})();


(function(){
  function getStage(){
    try { return JSON.parse(sessionStorage.getItem('minpakuArgStage') || '{}'); }
    catch(e){ return {}; }
  }
  const stage = getStage();
  const heroTitle = document.getElementById('hero-title-main');
  const heroCopy = document.getElementById('hero-copy-main');
  if (heroTitle && stage.anomaly2Done) {
    heroTitle.innerHTML = '都会に消え込むように、<br>静かな一室へ運び込む。';
  }
  if (heroCopy && stage.anomaly2Done) {
    heroCopy.textContent = '見つかりにくい宿、気づかれにくい導線、声の漏れにくい部屋。条件に合う場所を、目的別に案内します。';
  }
})();


(function(){
  function getStage(){
    try { return JSON.parse(sessionStorage.getItem('minpakuArgStage') || '{}'); }
    catch(e){ return {}; }
  }
  const stage = getStage();
  const mode = (typeof window.getMode === 'function') ? window.getMode() : 'favorite';
  const heroTitle = document.getElementById('hero-title-main');
  const heroCopy = document.getElementById('hero-copy-main');
  if (!heroTitle && !heroCopy) return;
  const shouldDisturb = mode === 'trap';
  if (!shouldDisturb) return;
  if (heroTitle) heroTitle.innerHTML = '都会に消え込むように、<br>静かな一室へ運び込む。';
  if (heroCopy) heroCopy.textContent = '見つかりにくい宿、気づかれにくい導線、声の漏れにくい部屋。条件に合う場所を、目的別に案内します。';
})();



(function(){
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function(){
      if (window.applyCurrentModeToLinks) window.applyCurrentModeToLinks(document);
    });
  } else {
    if (window.applyCurrentModeToLinks) window.applyCurrentModeToLinks(document);
  }
})();


// mode=trap 直アクセス時の改変演出
(function(){
  function shouldTriggerTrapOverlayOnLoad(){
    const mode = (typeof window.getMode === 'function') ? window.getMode() : 'favorite';
    if (mode !== 'trap') return false;

    const key = 'trapOverlayShown:' + location.pathname + location.search;
    try {
      if (sessionStorage.getItem(key) === '1') return false;
      sessionStorage.setItem(key, '1');
      return true;
    } catch (e) {
      return true;
    }
  }

  function triggerTrapOverlayOnLoad(){
    if (!shouldTriggerTrapOverlayOnLoad()) return;

    const run = function(){
      if (typeof window.runSiteAlteredOverlay === 'function') {
        window.runSiteAlteredOverlay(function(){});
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function(){
        setTimeout(run, 80);
      }, { once: true });
    } else {
      setTimeout(run, 80);
    }
  }

  triggerTrapOverlayOnLoad();
})();


(function(){
  function getStageForShare(){
    try { return JSON.parse(sessionStorage.getItem('minpakuArgStage') || '{}'); }
    catch(e){ return {}; }
  }
  const shareBox = document.getElementById('trap-share-box');
  const shareLink = document.getElementById('trap-share-link');
  if (!shareBox || !shareLink) return;

  const mode = (typeof window.getMode === 'function') ? window.getMode() : 'favorite';
  const stage = getStageForShare();
  const shouldShow = mode === 'trap' || !!stage.anomaly3Done || (window.ARGState && window.ARGState.get && window.ARGState.get().sawTrap);

  if (shouldShow) {
    shareBox.classList.remove('hidden');
  } else {
    shareBox.classList.add('hidden');
  }
})();


(function(){
  const shareLink = document.getElementById('trap-share-link');
  if (!shareLink) return;

  const sourceUrl = 'https://x.com/arg_observerx?s=21&t=n9hS9eUFPNMQIQ1S4aDaOw';
  const pageUrl = window.location.href;
  const text = `このホームページを見てほしい\n${sourceUrl}\n${pageUrl}`;
  const intent = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text);
  shareLink.setAttribute('href', intent);
})();



(function(){
 const mode = window.getMode?window.getMode():'favorite';
 if(mode!=='trap') return;
 document.querySelectorAll('*').forEach(el=>{
  if(el.textContent && el.textContent.trim()==='宿'){
    el.classList.add('crayon-mask');
  }
 });
})();
