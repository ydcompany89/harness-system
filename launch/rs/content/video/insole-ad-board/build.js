// 아치가득 인솔 광고 소재 보드 — 경쟁 레퍼런스 8형식 → 라라슈 버전 (감수 전 초안)
const pptxgen = require("pptxgenjs");
const R = "/home/user/harness-system/launch/rs/";
const L = R+"landing/img/", A = R+"design/fair-print/assets/";
const INK="0D1B14", SUB="66736A", LINE="DADFD9", BG="F6F7F4", LIME="C6F432", RED="B3261E", F="맑은 고딕";
const p = new pptxgen(); p.layout="LAYOUT_WIDE"; const W=13.33, M=0.6;
const T=(s,t,o)=>s.addText(t,Object.assign({fontFace:F,color:INK,margin:0},o));

const boards=[
 {no:"01",ref:"실험 장비 데모",name:"공중에 뜬 인솔 — 구조 해부",img:L+"insole-main.jpg",
  hook:"신던 깔창 밑에 들어가는 한 장, 해부해 봤어요",
  rows:[["0–2","얇은 와이어에 매달린 인솔이 천천히 회전 (흰 배경)","신던 깔창 밑에 들어가는 한 장"],["2–4","카메라 아치 쪽으로 밀착 → 하드컷","아치가득 구조"],["4–6","뒤꿈치 쪽 밀착","뒤꿈치 컵 구조"],["6–8","통기 구멍 클로즈업","통기 구멍"],["8–11","기존 깔창 + 인솔 2장 겹쳐 떠 있음 → '착' 합쳐짐","깔창은 그대로, 밑에 한 장"],["11–15","패키지 + 로고","와디즈 11.26 · 프로필 링크"]],
  note:"구조 이름만 표기. '지지·분산·흡수' 같은 효과 단어 금지"},
 {no:"02",ref:"손가락 누르기 ASMR",name:"꾹 — 손끝으로 보는 모양",img:A+"insole-cut.png",
  hook:"(소리만) 꾹… 꾹…",
  rows:[["0–1","검정 배경, 그레이 인솔 위 검지 클로즈업","—"],["1–3","아치 부분 꾹 누르기 (실제 소리 녹음)","아치 라인을 따라 가득"],["3–5","뒤꿈치 컵 가장자리 꾹","뒤꿈치를 감싸는 컵 모양"],["5–7","모카무스로 하드컷, 같은 동작","그레이 · 모카무스"],["7–10","신던 깔창 들고 밑에 '착' 깔기","자르지 않아도 돼요"],["10–15","로고","신발은 그대로, 안쪽만 튜닝"]],
  note:"누른 뒤 '복원 속도·쿠션' 강조 자막 금지(충격흡수 오인). 소리는 원음, 음악 최소"},
 {no:"03",ref:"소재 비교 (큐브)",name:"우드칩이 들어간 이유",img:L+"insole-main.jpg",
  hook:"인솔에 나무가 들어간다고?",
  rows:[["0–2","나무 톱밥 한 줌이 손바닥에서 떨어짐 (슬로)","인솔에 나무가?"],["2–4","소재 큐브 3개: 합성수지 / 우드칩 / 배합 완성","E-실리폴리렌 + 우드칩"],["4–7","완성 큐브를 반으로 자른 단면 클로즈업","우드칩 배합 소재"],["7–10","인솔 단면(옆모습)으로 매치컷","그 소재로, 한 장"],["10–15","패키지 + 로고","쿼드그립 아치가득 인솔"]],
  note:"소재 출처 표기는 팩트 시트대로(목공소 우드칩). '친환경·항균·탈취' 금지. 타 소재 비하 금지"},
 {no:"04",ref:"공기·연기 연출",name:"빛이 지나가는 구멍",img:A+"insole-cut.png",
  hook:"구멍이 왜 거기 있냐면",
  rows:[["0–2","암전 속 인솔 실루엣","—"],["2–5","뒤에서 조명 → 통기 구멍으로 빛줄기가 통과","통기 구멍"],["5–8","카메라 360° 천천히 회전","모양이 곧 구조"],["8–11","신발 속으로 들어가는 컷","깔창 밑에 한 장"],["11–15","로고","Made for Standing."]],
  note:"연기·바람 연출은 '통기 성능' 주장으로 읽힘 → 빛으로만. '시원·땀·통풍' 금지"},
 {no:"05",ref:"블랙 히어로 포스터",name:"차콜그린 히어로 스틸",img:L+"insole-pack-full.jpg",
  hook:"깔창은 없앴는데, 인솔은 만들었어요.",
  rows:[["정지","차콜그린 배경, 인솔 한 쌍 + 패키지 중앙","깔창은 없앴는데, 인솔은 만들었어요."],["서브","작은 글씨","신던 신발 그대로, 깔창 밑에 한 장"],["하단","RS 로고 + 와디즈 배지","와디즈 슈퍼얼리버드 (가격 합의 후)"]],
  note:"'국내 첫·한정특가' 배지 금지(근거·정가 원칙). 하단 한국어 제품명·날짜 줄 금지(포스터 규칙)"},
 {no:"06",ref:"전문가 토킹헤드 + 가격 인하",name:"대표가 말하는 '깔창을 없앤 이유'",img:L+"insole-model-hold.jpg",
  hook:"신발 회사가 깔창을 없앴습니다. 그런데 인솔을 만들었어요.",
  rows:[["0–3","대표 정면, 손에 인솔","신발 회사가 깔창을 없앴습니다"],["3–8","친구 가게 사진 컷인 (동의분)","\"깔창이 자꾸 딸려 나와요\""],["8–12","대표: 그래서 워킹화는 일체형으로, 다른 신발 신는 날을 위해 이걸","다른 신발 신는 날을 위해"],["12–18","인솔을 깔창 밑에 까는 시연","깔창 밑에 한 장"],["18–24","대표 마무리 + 로고","와디즈 11.26 · 알림 받기"]],
  note:"의사·전문가 출연·'허리·무릎·아치 문제' 훅 금지. '98,000→35,000' 같은 정가 부풀리기 표시 금지(부당 가격 표시)"},
 {no:"07",ref:"퇴근길 워킹",name:"퇴근길에도, 그 스니커즈",img:L+"insole-sneaker-model.jpg",
  hook:"퇴근길에도 좋아하는 그 스니커즈",
  rows:[["0–2","저녁 거리, 스니커즈 로우앵글 걸음 (로고 가림)","퇴근길에도"],["2–4","신호등 앞 정지, 발끝","좋아하는 그 스니커즈"],["4–6","플래시백: 아침, 깔창 밑에 인솔 깔기 3컷","아침에 한 장"],["6–10","다시 저녁 걸음, 비트컷 4컷","신발은 그대로"],["10–15","로고","안쪽만 튜닝"]],
  note:"'안 아픈·덜 피곤한' 금지. 마른 바닥만. 타사 신발 로고 노출 금지"},
 {no:"08",ref:"계단 라이프스타일",name:"주말, 오래 서 있는 날",img:L+"insole-pack-mocha.jpg",
  hook:"스탠딩석 잡았는데… 무슨 신발 신지?",
  rows:[["0–2","신발장 앞 스니커즈 3켤레 고민 (탑뷰)","스탠딩석 잡았는데…"],["2–4","손이 가장 예쁜 한 켤레를 집음","오늘은 이거"],["4–7","깔창 들고 인솔 깔기 → 덮기 '탁'","밑에 한 장"],["7–11","전시·팝업 계단 오르는 발 비트컷","하루 종일 그 신발로? → '그 신발 그대로'"],["11–15","로고","신발은 그대로, 안쪽만 튜닝"]],
  note:"'하루 종일 편하게' 금지 → '그 신발 그대로'까지만. 트리거는 상황만"},
];

// cover / overview
let s=p.addSlide(); s.background={color:BG};
s.addShape(p.ShapeType.rect,{x:M,y:0.55,w:0.28,h:0.06,fill:{color:LIME},line:{color:LIME}});
T(s,"아치가득 인솔 광고 소재 보드",{x:M,y:0.7,w:9,h:0.6,fontSize:26,bold:true});
T(s,"레퍼런스 8형식 → 라라슈 버전 · 9:16 · 비트컷(1초 단위) · 감수 전 초안",{x:M,y:1.3,w:11,h:0.35,fontSize:12,color:SUB});
const gw=(W-2*M-3*0.25)/4;
boards.forEach((b,i)=>{const x=M+(i%4)*(gw+0.25), y=1.95+Math.floor(i/4)*2.65;
  s.addShape(p.ShapeType.rect,{x,y,w:gw,h:1.55,fill:{color:"FFFFFF"},line:{color:LINE}});
  s.addImage({path:b.img,x:x+0.08,y:y+0.08,w:gw-0.16,h:1.39,sizing:{type:"contain",w:gw-0.16,h:1.39}});
  T(s,b.no+"  "+b.name,{x,y:y+1.62,w:gw,h:0.3,fontSize:11.5,bold:true});
  T(s,"참고: "+b.ref,{x,y:y+1.92,w:gw,h:0.25,fontSize:9.5,color:SUB});});
T(s,"먼저 찍을 3개 (비용 적고 바로 가능): 02 손가락 ASMR · 06 대표 토킹헤드 · 07 퇴근길 워킹",{x:M,y:7.0,w:12,h:0.3,fontSize:11,bold:true});

boards.forEach(b=>{
  const s=p.addSlide(); s.background={color:BG};
  s.addShape(p.ShapeType.rect,{x:M,y:0.5,w:0.28,h:0.06,fill:{color:LIME},line:{color:LIME}});
  T(s,"BOARD "+b.no+"  ·  참고 형식: "+b.ref,{x:M,y:0.62,w:10,h:0.3,fontSize:10,bold:true,color:SUB,charSpacing:1});
  T(s,b.name,{x:M,y:0.92,w:12,h:0.55,fontSize:24,bold:true});
  // phone frame
  s.addShape(p.ShapeType.roundRect,{x:M,y:1.7,w:3.0,h:5.33,fill:{color:INK},line:{color:INK},rectRadius:0.15});
  s.addImage({path:b.img,x:M+0.12,y:2.4,w:2.76,h:3.9,sizing:{type:"contain",w:2.76,h:3.9}});
  T(s,b.hook,{x:M+0.15,y:1.85,w:2.7,h:0.5,fontSize:10.5,bold:true,color:"FFFFFF",align:"center",valign:"middle"});
  // conti table
  const rows=[[{text:"초",options:{bold:true,color:SUB}},{text:"화면 (촬영)",options:{bold:true,color:SUB}},{text:"화면 글자",options:{bold:true,color:SUB}}]]
    .concat(b.rows.map(r=>r.map(c=>({text:c}))));
  s.addTable(rows,{x:4.0,y:1.7,w:8.73,colW:[0.8,4.6,3.33],fontFace:F,fontSize:11,color:INK,border:{type:"solid",pt:0.5,color:LINE},fill:{color:"FFFFFF"},valign:"middle",rowH:0.5});
  s.addShape(p.ShapeType.rect,{x:4.0,y:6.15,w:8.73,h:0.88,fill:{color:"FBEDEC"},line:{color:"FBEDEC"}});
  T(s,"감수 주의  "+b.note,{x:4.15,y:6.2,w:8.45,h:0.78,fontSize:10.5,color:RED,valign:"middle"});
});

// rules
s=p.addSlide(); s.background={color:BG};
T(s,"공통 규칙 · 캡컷 편집",{x:M,y:0.7,w:9,h:0.6,fontSize:24,bold:true});
const rules=[["프로젝트","9:16 · 1080×1920 · 30fps · 음원 120BPM 전후 → 컷은 2박(1초) 하드컷"],["글자","한 컷 한 줄 · 흰색 + 핵심 단어 라임 · 화면 위 1/3 · 억지 자막 없음"],["소리","02·04는 원음(꾹·빛) 중심, 음악 30% 이하"],["필수 표기","캡션: 의료기기가 아니에요 · 협찬 출연 시 [협찬]"],["금지 단어","아치 서포트·받쳐준다·충격 흡수·통증·피로·교정·기능성·친환경·국내 첫·한정특가"],["금지 연출","의사·전문가 출연, 아픈 표정, 젖은 바닥, 타사 로고, 정가 부풀린 가격 인하"],["촬영 소품","그레이·모카무스 인솔, 패키지, 로고 가린 스니커즈 3켤레, 와이어 스탠드, 조명 1개, 우드칩 한 줌"]];
s.addTable(rules.map(r=>[{text:r[0],options:{bold:true,color:SUB}},{text:r[1]}]),{x:M,y:1.6,w:12.1,colW:[2.0,10.1],fontFace:F,fontSize:12.5,color:INK,border:{type:"solid",pt:0.5,color:LINE},fill:{color:"FFFFFF"},rowH:0.62,valign:"middle"});

p.writeFile({fileName:R+"content/video/insole-ad-board/아치가득인솔_광고소재보드.pptx"}).then(f=>console.log(f));
