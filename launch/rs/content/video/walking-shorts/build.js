const pptxgen = require('pptxgenjs');
const D = __dirname + '/';
const C = {bg:'0D1B14', card:'14281D', card2:'162C20', line:'23402F', lime:'C6F432', text:'F2F4F2', sub:'9FB3A6', mute:'6F8578'};
const F = 'Malgun Gothic';
const p = new pptxgen(); p.layout = 'LAYOUT_WIDE'; // 13.33 x 7.5
p.title = '쿼드그립 종일편한 워킹화 쇼츠 스토리보드';
const base = (s) => { s.background = {color:C.bg}; s.addImage({path:D+'rs-logo-light.png', x:0.45, y:0.32, w:0.55, h:0.46});
  [0,1,2,3].forEach(i=>s.addShape(p.ShapeType.ellipse,{x:12.45+(i%2)*0.2, y:0.38+Math.floor(i/2)*0.2, w:0.14, h:0.14, fill:{color:C.lime}, line:{color:C.lime}})); };
const title = (s, t, sub) => { s.addText(t,{x:0.45,y:0.9,w:12.4,h:0.6,fontFace:F,fontSize:26,bold:true,color:C.text});
  if (sub) s.addText(sub,{x:0.45,y:1.45,w:12.4,h:0.4,fontFace:F,fontSize:13,color:C.sub}); };

// 1. 표지
let s = p.addSlide(); base(s);
s.addImage({path:D+'c04.jpg', x:8.6, y:0.9, w:3.3, h:5.87, rounding:false});
s.addText('WALKING SHOE · SHORTS STORYBOARD',{x:0.6,y:1.6,w:7.8,h:0.4,fontFace:F,fontSize:13,bold:true,color:C.lime,charSpacing:2});
s.addText([{text:'바닥부터',options:{breakLine:true}},{text:'달라야 한다.',options:{color:C.lime}}],{x:0.6,y:2.1,w:7.8,h:2.0,fontFace:F,fontSize:54,bold:true,color:C.text,valign:'top'});
s.addText('쿼드그립 종일편한 워킹화 · 15초 쇼츠 · 9:16 · 1초 비트컷',{x:0.6,y:4.3,w:7.8,h:0.5,fontFace:F,fontSize:18,color:C.text});
s.addText('인스타 릴스 · 유튜브 쇼츠 · 메타 광고 소재 겸용\n작성 2026-11-09 · 감수 전 초안',{x:0.6,y:5.9,w:7.8,h:0.7,fontFace:F,fontSize:12,color:C.mute});

// 2. 기획 요약
s = p.addSlide(); base(s); title(s,'기획 한 장 요약','훅 1초 → 4점의 정체 → 하루 동선 → 사전예약');
const rows = [['목표','11.24까지 워킹화 사전예약 신청 (오픈 날 15% 쿠폰)'],['타깃','하루 7시간 이상 서서 일하는 사람 — 주방·매장·계산대'],['훅 (0–1초)','신발을 뒤집으면 밑창에 라임 점 4개 → "밑창에 점이 4개?"'],
 ['핵심 메시지 3','① 발이 바닥에 닿는 순서대로 4곳 그립 패드 ② 깔창 없는 일체형 안창 ③ 작업화처럼 안 보이는 디자인'],['증거','실물 클로즈업 · 한쪽 257g(270mm 샘플 실측) · 폐타이어 고무 패드'],
 ['CTA','11.24까지 사전예약 · 오픈 날 15% 쿠폰 → 프로필 링크(go.rharashoe.com/walk)'],['규격·음악','9:16 · 1080×1920 · 30fps · 120BPM 전후 · 2박 = 1컷(1초)']];
s.addTable(rows.map(r=>[{text:r[0],options:{bold:true,color:C.lime,fill:{color:C.card}}},{text:r[1],options:{color:C.text,fill:{color:C.card}}}]),
  {x:0.45,y:2.0,w:12.4,colW:[2.2,10.2],fontFace:F,fontSize:15,border:{type:'solid',color:C.line,pt:1},rowH:0.62,valign:'middle',margin:0.12});

// 3~6. 컷
const cuts = [
 ['0–1','c01','신발을 뒤집어 밑창 "휙" — 라임 패드 4개가 한눈에 (훅)','밑창에 점이 4개?','휙 + 비트 시작'],
 ['1–2','c02','손가락으로 라임 패드 하나를 "톡" 클로즈업','라임색 그립 패드','톡'],
 ['2–3','c02','뒤꿈치 → 앞코 순서로 패드 4곳 톡톡톡톡','발이 바닥에 닿는 순서대로, 4곳','톡톡톡톡'],
 ['3–4','c04','링 4개 그래픽 인서트 0.8초 (브랜드 영상 재사용)','4 RINGS = 4 GRIP PADS','휘익'],
 ['4–5','c05','위에서 본 신발 안 — 일체형 안창','깔창 없는 일체형 안창','비트'],
 ['5–6',null,'손가락으로 발목 테두리를 꾹 눌렀다 떼기','도톰한 발목 테두리','꾹'],
 ['6–7',null,'양말 신은 발이 "쏙" 들어감 (옆에서)','—','쏙'],
 ['7–8',null,'현관 문 열고 나가는 하반신 걷기','출근길','비트'],
 ['8–9',null,'주방·매장 작업대 앞 서 있는 하반신 옆모습 (마른 바닥)','근무 중','비트'],
 ['9–10',null,'저녁 거리 걷는 뒷모습 하반신','퇴근길까지','비트'],
 ['10–11','c11','신발 한 켤레 옆모습 정지 컷','작업화처럼 안 보이게','드롭'],
 ['11–12',null,'차콜 · 그레이 · 민트화이트 3켤레 "착착착" 나란히','차콜 · 그레이 · 민트화이트','착착착'],
 ['12–13',null,'주방 저울 위에 신발 한 짝 → 숫자 클로즈업','한쪽 257g · 270mm 샘플 실측','띵'],
 ['13–15','c12','RS 로고 + 라임 점 4개 + 버튼','11.24까지 사전예약\n오픈 날 15% 쿠폰 · 프로필 링크','마무리'],
];
const per=[4,4,3,3]; let idx=0;
per.forEach((n,pi)=>{
  s = p.addSlide(); base(s); title(s,`스토리보드 ${pi+1}/4`,`컷 ${idx+1}–${idx+n} · 1컷 = 1초 (마지막 컷 2초)`);
  const W=2.75, G=0.4, x0=(13.33-(n*W+(n-1)*G))/2;
  for (let k=0;k<n;k++,idx++){
    const [t,img,scene,cap,snd]=cuts[idx]; const x=x0+k*(W+G), y=2.0;
    s.addShape(p.ShapeType.roundRect,{x,y,w:W,h:5.15,fill:{color:C.card},line:{color:C.line,width:1},rectRadius:0.12});
    const th=2.45, tw=th*9/16, tx=x+(W-tw)/2;
    if (img) s.addImage({path:D+img+'.jpg',x:tx,y:y+0.18,w:tw,h:th});
    else { s.addShape(p.ShapeType.rect,{x:tx,y:y+0.18,w:tw,h:th,fill:{color:C.card2},line:{color:C.line,width:1,dashType:'dash'}});
      s.addText('촬영 필요',{x:tx,y:y+0.18,w:tw,h:th,fontFace:F,fontSize:11,color:C.mute,align:'center',valign:'middle'}); }
    s.addText(`${String(idx+1).padStart(2,'0')}  ·  ${t}초`,{x:x+0.15,y:y+2.72,w:W-0.3,h:0.35,fontFace:F,fontSize:12,bold:true,color:C.lime});
    s.addText(scene,{x:x+0.15,y:y+3.05,w:W-0.3,h:0.9,fontFace:F,fontSize:11.5,color:C.text,valign:'top'});
    s.addText([{text:'자막  ',options:{color:C.mute,bold:true}},{text:cap,options:{color:C.lime,bold:true}}],{x:x+0.15,y:y+3.95,w:W-0.3,h:0.75,fontFace:F,fontSize:12,valign:'top'});
    s.addText([{text:'소리  ',options:{color:C.mute,bold:true}},{text:snd,options:{color:C.sub}}],{x:x+0.15,y:y+4.7,w:W-0.3,h:0.35,fontFace:F,fontSize:11});
  }
});

// 7. 캡컷 편집
s = p.addSlide(); base(s); title(s,'캡컷 편집 가이드','비트컷 = 음악 박자에 맞춰 효과 없이 바로 넘기기');
const ed=[['프로젝트','9:16 · 1080×1920 · 30fps'],['음악','120BPM 전후 무료 음원 · 볼륨 70% · 2박마다 분할(=1초)'],['컷 전환','효과 없음(하드컷) · 컷 1·3·4만 105% 펀치인 0.1초'],
 ['자막','프리텐다드(없으면 캡컷 기본 고딕) Bold · 흰색 + 핵심 단어 라임 #C6F432 · 화면 위 1/3 · 컷당 1줄'],['효과음','휙·톡·꾹·쏙·착착착·띵 — 캡컷 효과음 라이브러리'],
 ['배경색','엔드 카드(13–15초) 차콜그린 #0D1B14 + RS 로고 + 라임 점 4개'],['내보내기','1080p · 30fps · 파일명 RS_walking_shorts_v1']];
s.addTable(ed.map(r=>[{text:r[0],options:{bold:true,color:C.lime,fill:{color:C.card}}},{text:r[1],options:{color:C.text,fill:{color:C.card}}}]),
  {x:0.45,y:2.0,w:12.4,colW:[2.2,10.2],fontFace:F,fontSize:15,border:{type:'solid',color:C.line,pt:1},rowH:0.62,valign:'middle',margin:0.12});

// 8. 촬영 준비 · 금지
s = p.addSlide(); base(s); title(s,'촬영 준비 · 지킬 것','감수 기준(rs-compliance) 반영 · 게시 전 L2 승인');
const box=(x,h,head,items,col)=>{ s.addShape(p.ShapeType.roundRect,{x,y:2.0,w:4.0,h:4.9,fill:{color:C.card},line:{color:C.line,width:1},rectRadius:0.12});
  s.addText(head,{x:x+0.25,y:2.15,w:3.5,h:0.45,fontFace:F,fontSize:16,bold:true,color:col});
  s.addText(items.map(t=>({text:t,options:{bullet:true,breakLine:true}})),{x:x+0.25,y:2.65,w:3.55,h:4.1,fontFace:F,fontSize:12.5,color:C.text,valign:'top',paraSpaceAfter:6}); };
box(0.45,0,'촬영 준비물',['워킹화 차콜·그레이·민트화이트 각 1켤레','검정 양말 · 무지 바지(로고 없는 것)','마른 바닥 매장·주방 1곳 (상호·간판 화면 밖)','주방 저울 1개','삼각대 + 휴대폰 세로 4K/30fps','밝은 낮 자연광 또는 매장 조명'],C.lime);
box(4.67,0,'하지 않을 것',['아픈 표정 · 발 주무르기 · 지친 연출','신기 전후 자세 비교','젖은 바닥 · 물웅덩이 · "미끄럼" 연상','다른 브랜드 로고 크게','교정·편한·안정·지지·논슬립·피로 단어','원장님과 효능 문구를 같은 화면에'],'FF8A80');
box(8.89,0,'확인 필요',['민트화이트 실물 사진 없음 → 컷 12 촬영 필수','257g은 "270mm 샘플 자체 실측" 표기 유지','15% 쿠폰 문구 = 랜딩과 동일(결제 없이 신청)','패드 문구는 "그립 패드"까지만','게시 = L2 대표 승인'],C.sub);

p.writeFile({fileName: process.argv[2]}).then(()=>console.log('saved'));
