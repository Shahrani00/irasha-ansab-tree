const CORE='irasha-v1', RT='irasha-rt';
const SHELL=['./','./index.html','./mindmap.html','./migrations.html','./manifest.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CORE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CORE&&k!==RT).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  if(u.origin===location.origin){
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{
      const cp=res.clone();caches.open(CORE).then(c=>c.put(e.request,cp));return res;
    }).catch(()=>caches.match('./index.html'))));
  }else{
    e.respondWith(fetch(e.request).then(res=>{
      const cp=res.clone();caches.open(RT).then(c=>c.put(e.request,cp));return res;
    }).catch(()=>caches.match(e.request)));
  }
});
