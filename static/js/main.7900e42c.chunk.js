/*! For license information please see main.7900e42c.chunk.js.LICENSE.txt */
(this.webpackJsonpnotas=this.webpackJsonpnotas||[]).push([[0],{22:function(e,t,n){},24:function(e,t,n){},25:function(e,t,n){"use strict";n.r(t);var o=n(0),r=n(2),a=n.n(r),c=n(8),i=n.n(c),s=(n(22),n(5)),l=n.n(s),d=n(14),u=n(3),h=n(1),f=n(9),g=n(15),v=n(10),p=(n(24),n.p+"static/media/logo512.998b52df.png"),b=n(11),j=n(12),y=n(16),w=n(13),x=function(e){Object(y.a)(n,e);var t=Object(w.a)(n);function n(){return Object(b.a)(this,n),t.apply(this,arguments)}return Object(j.a)(n,[{key:"render",value:function(){return Object(o.jsxs)("svg",{id:"_x31_px",fill:"black",enableBackground:"new 0 0 24 24",height:"20",viewBox:"0 0 24 24",width:"20",xmlns:"http://www.w3.org/2000/svg",children:[Object(o.jsx)("path",{d:"m12 16c-.128 0-.256-.049-.354-.146l-5.5-5.5c-.143-.144-.186-.358-.108-.545.077-.187.26-.309.462-.309h3v-6.5c0-.551.449-1 1-1h3c.551 0 1 .449 1 1v6.5h3c.202 0 .385.122.462.309.078.187.035.402-.108.545l-5.5 5.5c-.098.097-.226.146-.354.146zm-4.293-5.5 4.293 4.293 4.293-4.293h-2.293c-.276 0-.5-.224-.5-.5v-7h-3v7c0 .276-.224.5-.5.5z"}),Object(o.jsx)("path",{d:"m22.5 22h-21c-.827 0-1.5-.673-1.5-1.5v-1c0-.827.673-1.5 1.5-1.5h21c.827 0 1.5.673 1.5 1.5v1c0 .827-.673 1.5-1.5 1.5zm-21-3c-.276 0-.5.224-.5.5v1c0 .276.224.5.5.5h21c.276 0 .5-.224.5-.5v-1c0-.276-.224-.5-.5-.5z"})]})}}]),n}(r.Component);function O(e){return Object(o.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 15000 15000",children:[Object.keys(e.Graph.NodeDictionary).map((function(t){return e.Graph.NodeDictionary[t].LinksTowards.map((function(n){return Object(o.jsx)("line",{x1:e.Graph.NodeDictionary[t].X.toString(),y1:e.Graph.NodeDictionary[t].Y.toString(),x2:e.Graph.NodeDictionary[n].X.toString(),y2:e.Graph.NodeDictionary[n].Y.toString(),style:{stroke:"grey",strokeWidth:4}},t+n)}))})),Object.keys(e.Graph.NodeDictionary).map((function(t){return Object(o.jsx)("circle",{cx:e.Graph.NodeDictionary[t].X.toString(),cy:e.Graph.NodeDictionary[t].Y.toString(),r:"40",stroke:"lightgrey",strokeWidth:"4",fill:"grey"},t)})),Object(o.jsx)("circle",{cx:7500,cy:7500,r:"20",stroke:"lightgrey",strokeWidth:"2",fill:"red"},"center")]})}var k=function(){var e=Object(r.useState)({Energy:1e3,NodeDictionary:{}}),t=Object(g.a)(e,2),n=t[0],a=t[1];function c(){return(c=Object(f.a)(l.a.mark((function e(){var t,o,r,c,i,s,f,g,p;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=n,e.next=3,window.showDirectoryPicker();case 3:o=e.sent,r=!0,c=!1,e.prev=6,s=Object(v.a)(o.values());case 8:return e.next=10,s.next();case 10:return f=e.sent,r=f.done,e.next=14,f.value;case 14:if(g=e.sent,r){e.next=24;break}if(p=g,console.log(p.name),"directory"!==p.kind){e.next=20;break}return e.delegateYield(l.a.mark((function e(){var n,r,a,c,i,s,f,g,v,b,j,y;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,o.getDirectoryHandle(p.name);case 2:return r=e.sent,e.next=5,r.getFileHandle("info.json");case 5:return a=e.sent,e.next=8,a.getFile();case 8:return c=e.sent,e.t0=JSON,e.next=12,c.text();case 12:return e.t1=e.sent,i=e.t0.parse.call(e.t0,e.t1),s=i["net.shinyfrog.bear"].uniqueIdentifier,e.next=17,r.getFileHandle("text.txt");case 17:return f=e.sent,e.next=20,f.getFile();case 20:return g=e.sent,e.next=23,g.text();case 23:v=e.sent,b=v.slice(2,v.indexOf("\n")),j=[],null===(n=v.match(/\[.+\]+\([a-zA-Z\:\/\-\?]+id=+[A-Za-z0-9\-]+\)/g))||void 0===n||n.forEach((function(e){var t;console.log(e),null===(t=e.match(/id=.+\)/g))||void 0===t||t.forEach((function(e){var t=e.slice(3,e.length-1);j.includes(t)||j.push(e.slice(3,e.length-1))}))})),s in t.NodeDictionary||(t=Object(h.a)(Object(h.a)({},t),{},{NodeDictionary:Object(h.a)(Object(h.a)({},t.NodeDictionary),{},Object(u.a)({},s,{ID:s,Name:b,Text:v,X:Math.floor(Math.random()*Math.floor(3e3)),Y:Math.floor(Math.random()*Math.floor(3e3)),LinksTowards:j,LinksFrom:[]}))}));for(y=0;y<j.length;y++)t=j[y]in t.NodeDictionary?Object(h.a)(Object(h.a)({},t),{},{NodeDictionary:Object(h.a)(Object(h.a)({},t.NodeDictionary),{},Object(u.a)({},j[y],Object(h.a)(Object(h.a)({},t.NodeDictionary[j[y]]),{},{LinksFrom:[].concat(Object(d.a)(t.NodeDictionary[j[y]].LinksFrom),[s])})))}):Object(h.a)(Object(h.a)({},t),{},{NodeDictionary:Object(h.a)(Object(h.a)({},t.NodeDictionary),{},Object(u.a)({},j[y],{ID:j[y],Name:"",Text:"",X:Math.floor(Math.random()*Math.floor(3e3)),Y:Math.floor(Math.random()*Math.floor(3e3)),LinksTowards:[],LinksFrom:[s]}))});case 31:case"end":return e.stop()}}),e)}))(),"t0",20);case 20:a(t);case 21:r=!0,e.next=8;break;case 24:e.next=30;break;case 26:e.prev=26,e.t1=e.catch(6),c=!0,i=e.t1;case 30:if(e.prev=30,e.prev=31,r||null==s.return){e.next=35;break}return e.next=35,s.return();case 35:if(e.prev=35,!c){e.next=38;break}throw i;case 38:return e.finish(35);case 39:return e.finish(30);case 40:case"end":return e.stop()}}),e,null,[[6,26,30,40],[31,,35,39]])})))).apply(this,arguments)}return Object(r.useEffect)((function(){var e=setTimeout((function(){a(Object(h.a)({},function(e){var t=e,n=[7500,7500],o=.5;console.log("ForceTransformedBefore:"),console.log(e);var r=0;return Object.keys(e.NodeDictionary).forEach((function(a){var c=e.NodeDictionary[a].X,i=e.NodeDictionary[a].Y,s=0,l=0;Object.keys(e.NodeDictionary).forEach((function(t){if(t!==a){var n=e.NodeDictionary[t].X,o=e.NodeDictionary[t].Y,r=Math.sqrt(Math.pow(c-n,2)+Math.pow(i-o,2));r<Math.pow(10,-3)&&(r=.5),s+=80*-(n-c)/r,l+=80*-(o-i)/r}})),s+=-(c-n[0]),l+=-(i-n[1]),e.NodeDictionary[a].LinksTowards.forEach((function(t){var n=e.NodeDictionary[t].X,r=e.NodeDictionary[t].Y;s+=(n-c)*o,l+=(r-i)*o})),e.NodeDictionary[a].LinksFrom.forEach((function(t){var n=e.NodeDictionary[t].X,r=e.NodeDictionary[t].Y;s+=(n-c)*o,l+=(r-i)*o})),r+=Math.pow(s,2)+Math.pow(l,2);var d=c+.1*s,u=i+.1*l;t.NodeDictionary[a].X=d,t.NodeDictionary[a].Y=u})),t.Energy=r,console.log("ForceTransformedAfter:"),console.log(t),t}(n)))}),40);return function(){return clearTimeout(e)}})),Object(o.jsxs)("div",{className:"App",children:[Object(o.jsxs)("div",{className:"App-header",children:[Object(o.jsx)("div",{onClick:function(){return c.apply(this,arguments)},children:Object(o.jsx)(x,{})}),Object(o.jsx)("img",{className:"notas-logo",src:p,alt:""})]}),Object(o.jsx)(O,{Graph:n})]})},m=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function N(e,t){navigator.serviceWorker.register(e).then((function(e){e.onupdatefound=function(){var n=e.installing;null!=n&&(n.onstatechange=function(){"installed"===n.state&&(navigator.serviceWorker.controller?(console.log("New content is available and will be used when all tabs for this page are closed. See https://cra.link/PWA."),t&&t.onUpdate&&t.onUpdate(e)):(console.log("Content is cached for offline use."),t&&t.onSuccess&&t.onSuccess(e)))})}})).catch((function(e){console.error("Error during service worker registration:",e)}))}var D=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,26)).then((function(t){var n=t.getCLS,o=t.getFID,r=t.getFCP,a=t.getLCP,c=t.getTTFB;n(e),o(e),r(e),a(e),c(e)}))};i.a.render(Object(o.jsx)(a.a.StrictMode,{children:Object(o.jsx)(k,{})}),document.getElementById("root")),function(e){if("serviceWorker"in navigator){if(new URL("/notas",window.location.href).origin!==window.location.origin)return;window.addEventListener("load",(function(){var t="".concat("/notas","/service-worker.js");m?(!function(e,t){fetch(e,{headers:{"Service-Worker":"script"}}).then((function(n){var o=n.headers.get("content-type");404===n.status||null!=o&&-1===o.indexOf("javascript")?navigator.serviceWorker.ready.then((function(e){e.unregister().then((function(){window.location.reload()}))})):N(e,t)})).catch((function(){console.log("No internet connection found. App is running in offline mode.")}))}(t,e),navigator.serviceWorker.ready.then((function(){console.log("This web app is being served cache-first by a service worker. To learn more, visit https://cra.link/PWA")}))):N(t,e)}))}}(),D()}},[[25,1,2]]]);
//# sourceMappingURL=main.7900e42c.chunk.js.map