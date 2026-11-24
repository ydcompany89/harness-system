if (location.search.includes('static')) document.documentElement.classList.add('static');
// 단어 단위 태그라인
(function(){const p=document.getElementById('tl');const out=[];p.childNodes.forEach(n=>{if(n.nodeName==='BR'){out.push('<br>');return}const hl=n.nodeType===1;(n.textContent).split(/(\s+)/).forEach(t=>{if(!t.trim()){out.push(t);return}out.push('<span class="w'+(hl?' hl':'')+'">'+t+'</span>')})});p.innerHTML=out.join('');
const ws=[...p.querySelectorAll('.w')];
const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){ws.forEach((w,i)=>setTimeout(()=>w.classList.add('on'),i*90));io.disconnect()}})},{rootMargin:'0px 0px -30% 0px'});io.observe(p)})();
// 섹션 등장
const ro=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');ro.unobserve(e.target)}}),{threshold:.15});
document.querySelectorAll('.rv').forEach(el=>ro.observe(el));
// 숫자 카운트업
const co=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target,to=+el.dataset.count,unit=el.querySelector('small').outerHTML;let t0=null;
const step=ts=>{t0??=ts;const k=Math.min(1,(ts-t0)/1200),v=Math.round(to*(1-Math.pow(1-k,3)));el.innerHTML=v+unit;if(k<1)requestAnimationFrame(step)};requestAnimationFrame(step);co.unobserve(el)}),{threshold:.6});
if(!document.documentElement.classList.contains('static'))document.querySelectorAll('[data-count]').forEach(el=>co.observe(el));
