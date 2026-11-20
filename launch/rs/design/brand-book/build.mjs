// 브랜드 북 1장 + 인스타 그리드 9장 (프랑스식 1주차 시안) — Playwright 렌더
import { createRequire } from 'module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const fs = require('fs');
const R='/home/user/harness-system/launch/rs/';
const FONT='/tmp/claude-0/-home-user-harness-system/f589f59e-5047-5a0d-9959-068b0d0e969a/scratchpad/kd/package/dist/public/static/';
const OUTB=R+'design/brand-book/', OUTG=R+'content/insta-grid-reset/';
const css=`@font-face{font-family:P;src:url(file://${FONT}Pretendard-Light.otf);font-weight:300}
@font-face{font-family:P;src:url(file://${FONT}Pretendard-Regular.otf);font-weight:400}
@font-face{font-family:P;src:url(file://${FONT}Pretendard-SemiBold.otf);font-weight:600}
@font-face{font-family:P;src:url(file://${FONT}Pretendard-Bold.otf);font-weight:700}
*{margin:0;padding:0;box-sizing:border-box}body{font-family:P;color:#0D1B14;-webkit-font-smoothing:antialiased}`;
const INK='#0D1B14', PAPER='#EFEEE9', LIME='#C6F432', SUB='#6B756E';
const img=p=>'file://'+R+p;

// ---------- 인스타 9장 (1080x1350) ----------
const posts=[
 {t:'text', main:'Made for<br>Standing.', sub:'RHARA SHOE'},
 {t:'photo', src:'landing/img/walking-main.jpg', cap:'Collection 01'},
 {t:'photo', src:'design/fair-print/assets/outsole-studio.jpg', cap:'네 곳의 그립 패드'},
 {t:'photo', src:'qc/photos-2026-09-30/02-pair-angle.jpg', cap:'첫 샘플 · 2026.09.30'},
 {t:'voc', main:'“깔창이 자꾸<br>딸려 나와요.”', sub:'김밥집을 하는 친구', end:'그래서, 깔창을 없앴습니다.'},
 {t:'photo', src:'landing/img/insole-main.jpg', cap:'아치가득 인솔 · 그레이'},
 {t:'photo', src:'landing/img/walking-pair-real.jpg', cap:'쿼드그립 종일편한 워킹화'},
 {t:'photo', src:'landing/img/insole-pack-mocha.jpg', cap:'모카무스'},
 {t:'text', main:'출근부터<br>퇴근까지,<br>한 켤레로.', sub:''},
];
const dot=`<i style="position:absolute;left:96px;bottom:96px;width:14px;height:14px;border-radius:50%;background:${LIME}"></i>`;
const html=po=>{
 if(po.t==='photo') return `<div style="width:1080px;height:1440px;background:${PAPER};position:relative">
   <div style="position:absolute;left:96px;top:160px;width:888px;height:1040px;display:flex;align-items:center;justify-content:center">
     <img src="${img(po.src)}" style="max-width:100%;max-height:100%;object-fit:contain"></div>
   <div style="position:absolute;left:96px;bottom:110px;font-size:30px;font-weight:400;letter-spacing:.02em;color:${SUB}">${po.cap}</div>
   <div style="position:absolute;right:96px;bottom:110px;font-size:24px;font-weight:600;letter-spacing:.3em;color:${INK}">RHARA SHOE</div></div>`;
 if(po.t==='voc') return `<div style="width:1080px;height:1440px;background:${INK};color:#F2F4F2;position:relative;padding:0 96px">
   <div style="position:absolute;left:96px;top:460px;font-size:92px;font-weight:600;line-height:1.25;letter-spacing:-.02em">${po.main}</div>
   <div style="position:absolute;left:96px;top:740px;font-size:32px;font-weight:300;color:#9FB3A6">— ${po.sub}</div>
   <div style="position:absolute;left:96px;bottom:150px;font-size:40px;font-weight:400">${po.end}</div>${dot}</div>`;
 return `<div style="width:1080px;height:1440px;background:${INK};color:#F2F4F2;position:relative">
   <div style="position:absolute;left:96px;top:${po.main.split('<br>').length>2?430:540}px;font-size:120px;font-weight:700;line-height:1.08;letter-spacing:-.03em">${po.main}</div>
   ${po.sub?`<div style="position:absolute;left:96px;bottom:150px;font-size:26px;font-weight:600;letter-spacing:.35em;color:#9FB3A6">${po.sub}</div>`:''}${dot}</div>`;
};

// ---------- 브랜드 북 (A4 1240x1754) ----------
const sw=(c,n,v,dark)=>`<div style="flex:1"><div style="height:120px;background:${c};border:${c==='#FFFFFF'||c===PAPER?'1px solid #D9DCD6':'none'}"></div><div style="margin-top:12px;font-size:20px;font-weight:600">${n}</div><div style="font-size:17px;color:${SUB}">${v}</div></div>`;
const sec=(no,t,body)=>`<div style="display:grid;grid-template-columns:170px 1fr;padding:30px 0;border-top:1px solid #D9DCD6"><div style="font-size:16px;font-weight:600;letter-spacing:.25em;color:${SUB}">${no}<br><span style="letter-spacing:0;font-size:22px;color:${INK}">${t}</span></div><div>${body}</div></div>`;
const two=(a,b)=>`<div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;font-size:20px;line-height:1.75"><div><b style="font-size:16px;letter-spacing:.2em">남긴다</b><br>${a.join('<br>')}</div><div style="color:${SUB}"><b style="font-size:16px;letter-spacing:.2em;color:#B3261E">뺀다</b><br>${b.join('<br>')}</div></div>`;
const book=`<div style="width:1240px;height:1754px;background:#F7F7F4;padding:90px 100px;position:relative">
 <div style="display:flex;justify-content:space-between;align-items:flex-start">
   <div><div style="font-size:16px;font-weight:600;letter-spacing:.35em;color:${SUB}">RHARA SHOE · BRAND BOOK 01</div>
   <div style="margin-top:26px;font-size:76px;font-weight:700;line-height:1.05;letter-spacing:-.03em">Made for<br>Standing.</div></div>
   <img src="${img('design/fair-print/assets/rs-logo-ink.png')}" style="width:120px"></div>
 <div style="margin:38px 0 34px;font-size:27px;font-weight:400;line-height:1.6">서서 일하는 사람의 신발이, 스타일이 되는 브랜드.<br><span style="color:${SUB}">더 많이 알리지 않고, 더 갖고 싶게.</span></div>
 ${sec('01','취향 원칙',`<div style="font-size:21px;line-height:1.8"><b>절제</b> — 하나를 더하기 전에 둘을 뺀다.<br><b>실물</b> — 진짜 신발, 진짜 손, 진짜 가게만 보여준다.<br><b>품위</b> — 일하는 하루를 우습게도, 불쌍하게도 그리지 않는다.</div>`)}
 ${sec('02','색',`<div style="display:flex;gap:18px">${sw(INK,'차콜그린','#0D1B14 · 배경·글자')}${sw(LIME,'라임','#C6F432 · 점 하나만')}${sw(PAPER,'페이퍼','#EFEEE9 · 사진 바탕')}${sw('#9FB3A6','세이지','#9FB3A6 · 보조 글자')}</div><div style="margin-top:14px;font-size:17px;color:${SUB}">라임은 한 화면에 한 곳. 면적 5% 이하.</div>`)}
 ${sec('03','글자',`<div style="font-size:21px;line-height:1.8">Pretendard 한 가지. 제목 Bold · 본문 Regular · 보조 Light<br>한 화면 한 문장. 마침표로 끝낸다. 느낌표는 쓰지 않는다.</div>`)}
 ${sec('04','사진',two(['페이퍼 바탕 위 실물, 자르지 않고 여백','만드는 과정 (샘플·금형·수정)','동의 받은 실제 사람의 손과 발'],['AI 연출 위주 컷, 과한 합성','사진 위 글자 3줄 이상','타 브랜드 로고, 젖은 바닥']))}
 ${sec('05','말',two(['출근부터 퇴근까지, 한 켤레로.','깔창은 없앴는데, 인솔은 만들었어요.','“깔창이 자꾸 딸려 나와요.”'],['최저가 · 파격 · 역대급 · 1+1','편안함 보장 · 통증 · 피로 · 교정','의사 추천 · 친환경 · 국내 최초']))}
 ${sec('06','판매',two(['정가','선착순 넘버링 카드 (No. 001/300)','사이즈 교환 1회'],['상시 쿠폰 · 타임세일','부풀린 정가의 할인 표시','레오 사장 B급 콘텐츠 (월 1회 이하)']))}
 <div style="position:absolute;left:100px;bottom:70px;font-size:15px;color:${SUB}">시안 v1 · 2026.11 · 공동대표 합의 전 · 알앤디메이커스 주식회사</div>
 <i style="position:absolute;right:100px;bottom:74px;width:12px;height:12px;border-radius:50%;background:${LIME}"></i></div>`;

const b=await chromium.launch(); const pg=await b.newPage({deviceScaleFactor:1});
await pg.setViewportSize({width:1240,height:1754});
fs.writeFileSync('/tmp/claude-0/-home-user-harness-system/f589f59e-5047-5a0d-9959-068b0d0e969a/scratchpad/bb.html',`<style>${css}</style>${book}`); await pg.goto('file:///tmp/claude-0/-home-user-harness-system/f589f59e-5047-5a0d-9959-068b0d0e969a/scratchpad/bb.html',{waitUntil:'load'}); await pg.evaluate(()=>document.fonts.ready);
await pg.screenshot({path:OUTB+'브랜드북_1장_시안v1.png'});
await pg.setViewportSize({width:1080,height:1440});
for(let i=0;i<posts.length;i++){ fs.writeFileSync('/tmp/claude-0/-home-user-harness-system/f589f59e-5047-5a0d-9959-068b0d0e969a/scratchpad/post.html',`<style>${css}</style>${html(posts[i])}`); await pg.goto('file:///tmp/claude-0/-home-user-harness-system/f589f59e-5047-5a0d-9959-068b0d0e969a/scratchpad/post.html',{waitUntil:'load'}); await pg.evaluate(()=>document.fonts.ready);
  await pg.screenshot({path:OUTG+`post_${String(i+1).padStart(2,'0')}.png`}); }
await b.close(); console.log('ok');
