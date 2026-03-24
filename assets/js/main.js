(function(){
  const yearEls = document.querySelectorAll('[data-year]');
  yearEls.forEach(el => el.textContent = new Date().getFullYear());

  window.ARGState = {
    get(){
      try{return JSON.parse(localStorage.getItem('minpakuArgState') || '{}');}
      catch(e){return {};}
    },
    set(patch){
      const next = Object.assign({sawHand:false,sawRed:false,sawTrap:false}, this.get(), patch);
      localStorage.setItem('minpakuArgState', JSON.stringify(next));
      return next;
    },
    reset(){ localStorage.removeItem('minpakuArgState'); },
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

  document.querySelectorAll('[data-archive-title]').forEach(el => {
    if(window.ARGState.completed()) el.textContent = 'STAY LOCAL TOKYO ESCAPE / ARCHIVE';
  });

  document.querySelectorAll('[data-reset-arg]').forEach(btn => {
    btn.addEventListener('click', () => {
      window.ARGState.reset();
      alert('探索状態をリセットしました。');
      location.reload();
    });
  });
})();
