if(!self.define){let e,i={};const s=(s,n)=>(s=new URL(s+".js",n).href,i[s]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=i,document.head.appendChild(e)}else e=s,importScripts(s),i()})).then((()=>{let e=i[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(n,r)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(i[o])return;let l={};const t=e=>s(e,o),c={module:{uri:o},exports:l,require:t};i[o]=Promise.all(n.map((e=>c[e]||t(e)))).then((e=>(r(...e),l)))}}define(["./workbox-5ffe50d4"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-BQWQwnrr.js",revision:null},{url:"assets/index-D8JtDjF6.css",revision:null},{url:"assets/ui-DEXr-bS5.js",revision:null},{url:"assets/vendor-CYNZuFbr.js",revision:null},{url:"assets/workbox-window.prod.es5-p40uij6f.js",revision:null},{url:"index.html",revision:"a334fc9f21b27815634a819ae6ed7ae4"},{url:"offline.html",revision:"481c00282da3d094159b416f52f353cb"},{url:"favicon.ico",revision:"3875941ed5231985dbb59b024298cc46"},{url:"apple-touch-icon.png",revision:"c384f16547c8413dc582053f8a81589a"},{url:"masked-icon.svg",revision:"823e48165c26a412c32d1809b593fe05"},{url:"pwa-192x192.png",revision:"b83fcb2494b7e763bc1211d5f27c796b"},{url:"pwa-512x512.png",revision:"3a6b18fbc2773d9ba7e9d5e53b7dbc31"},{url:"manifest.webmanifest",revision:"4fa3a8aa060a33853c24785457df2f3b"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
//# sourceMappingURL=sw.js.map
