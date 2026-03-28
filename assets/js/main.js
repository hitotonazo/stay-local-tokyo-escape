(function(){
  window.getMode = function(){
    const params = new URLSearchParams(location.search);
    return params.get('mode') || 'favorite';
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
  const shouldDisturb = mode === 'trap' || !!stage.anomaly2Done;
  if (!shouldDisturb) return;
  if (heroTitle) heroTitle.innerHTML = '都会に消え込むように、<br>静かな一室へ運び込む。';
  if (heroCopy) heroCopy.textContent = '見つかりにくい宿、気づかれにくい導線、声の漏れにくい部屋。条件に合う場所を、目的別に案内します。';
})();

// mode固定ナビゲーション
(function(){
  function getMode(){
    const params=new URLSearchParams(location.search);
    return params.get('mode')||'favorite';
  }
  const mode=getMode();

  document.querySelectorAll('a[href]').forEach(a=>{
    const href=a.getAttribute('href');
    if(!href || href.startsWith('javascript') || href.includes('mode=')) return;

    if(href.startsWith('./') || href.startsWith('/')){
      const url=new URL(href, location.origin);
      url.searchParams.set('mode', mode);
      a.setAttribute('href', url.pathname + '?' + url.searchParams.toString());
    }
  });
})();
