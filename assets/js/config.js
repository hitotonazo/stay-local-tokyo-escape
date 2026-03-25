(function(){
  const config = {
    // 例:
    // R2_PUBLIC_BASE: 'https://assets.example.com/site_minpaku_arg'
    // r2.dev を使う場合:
    // R2_PUBLIC_BASE: 'https://pub-xxxxxxxx.r2.dev/site_minpaku_arg'
    R2_PUBLIC_BASE: '',
    // true にすると JSON も R2 から読み込みます。
    // false の場合、JSON は Pages 側、画像だけ R2 から読み込みます。
    USE_R2_FOR_DATA: false
  };

  function normalizePath(input){
    const value = String(input || '').trim();
    if (!value) return '';
    if (/^(https?:)?\/\//.test(value) || value.startsWith('data:') || value.startsWith('blob:')) return value;
    return value
      .replace(/^\.\//, '')
      .replace(/^\//, '');
  }

  function joinUrl(base, path){
    const cleanBase = String(base || '').replace(/\/+$/, '');
    const cleanPath = normalizePath(path);
    return cleanBase ? `${cleanBase}/${cleanPath}` : `./${cleanPath}`;
  }

  function useR2(){
    return !!(config.R2_PUBLIC_BASE && String(config.R2_PUBLIC_BASE).trim());
  }

  function assetUrl(path){
    const cleanPath = normalizePath(path);
    if (!cleanPath) return '';
    return useR2() ? joinUrl(config.R2_PUBLIC_BASE, cleanPath) : `./${cleanPath}`;
  }

  function dataUrl(path){
    const cleanPath = normalizePath(path);
    if (!cleanPath) return '';
    if (useR2() && config.USE_R2_FOR_DATA) return joinUrl(config.R2_PUBLIC_BASE, cleanPath);
    return `./${cleanPath}`;
  }

  function applyR2Assets(root){
    const scope = root || document;
    scope.querySelectorAll('[data-r2-src]').forEach(el => {
      const path = el.getAttribute('data-r2-src');
      if (path) el.setAttribute('src', assetUrl(path));
    });
    scope.querySelectorAll('[data-r2-href]').forEach(el => {
      const path = el.getAttribute('data-r2-href');
      if (path) el.setAttribute('href', assetUrl(path));
    });
    scope.querySelectorAll('[data-r2-bg]').forEach(el => {
      const path = el.getAttribute('data-r2-bg');
      if (path) el.style.backgroundImage = `url("${assetUrl(path)}")`;
    });
  }

  window.SITE_CONFIG = config;
  window.normalizeAssetPath = normalizePath;
  window.assetUrl = assetUrl;
  window.dataUrl = dataUrl;
  window.applyR2Assets = applyR2Assets;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => applyR2Assets(document));
  } else {
    applyR2Assets(document);
  }
})();
