const pptxgen = require("pptxgenjs");
const R = "/home/user/harness-system/launch/rs/";
const L = R + "landing/img/", A = R + "design/fair-print/assets/";
const BG="0D1B14", CARD="14281D", LIME="C6F432", TX="F2F4F2", SUB="9FB3A6", F="Pretendard";
const p = new pptxgen(); p.layout="LAYOUT_WIDE"; // 13.33x7.5
const font = {fontFace:F, color:TX};
function slide(title, en){
  const s=p.addSlide(); s.background={color:BG};
  if(title){
    s.addText(en,{x:0.6,y:0.35,w:8,h:0.3,fontSize:11,color:LIME,fontFace:F,bold:true,charSpacing:2});
    s.addText(title,{x:0.6,y:0.62,w:12,h:0.6,fontSize:26,bold:true,...font});
  }
  s.addImage({path:L+"rs-logo-light.png",x:11.6,y:6.95,w:1.1,h:0.32,sizing:{type:"contain",w:1.1,h:0.32}});
  return s;
}
function img(s,path,x,y,w,h){ s.addShape(p.ShapeType.rect,{x,y,w,h,fill:{color:CARD},line:{color:CARD}}); s.addImage({path,x:x+0.08,y:y+0.08,w:w-0.16,h:h-0.16,sizing:{type:"contain",w:w-0.16,h:h-0.16}}); }
function card(s,x,y,w,h,head,body){
  s.addShape(p.ShapeType.roundRect,{x,y,w,h,fill:{color:CARD},line:{color:"24402F"},rectRadius:0.08});
  s.addText(head,{x:x+0.2,y:y+0.15,w:w-0.4,h:0.4,fontSize:14,bold:true,color:LIME,fontFace:F});
  s.addText(body,{x:x+0.2,y:y+0.55,w:w-0.4,h:h-0.7,fontSize:12,valign:"top",...font,color:TX,paraSpaceAfter:4});
}
function table(s,rows,x,y,w,colW){
  s.addTable(rows.map((r,i)=>r.map((c,j)=>({text:c,options:{fontFace:F,fontSize:12,color:j==0?SUB:TX,bold:j==0,fill:{color:i%2?BG:CARD}}}))),
    {x,y,w,colW,border:{type:"solid",pt:0.5,color:"24402F"},rowH:0.42,valign:"middle"});
}

// 1 cover
let s=p.addSlide(); s.background={color:BG};
s.addImage({path:L+"rs-logo-light.png",x:0.7,y:0.6,w:2.4,h:0.7,sizing:{type:"contain",w:2.4,h:0.7}});
s.addText("제품 소개서",{x:0.7,y:2.3,w:6,h:0.9,fontSize:44,bold:true,...font});
s.addText("Product Introduction",{x:0.7,y:3.15,w:6,h:0.5,fontSize:18,color:LIME,fontFace:F});
s.addText("오래 서서 일하는 사람을 위한 근무화 · 인솔 · 생활용품",{x:0.7,y:3.9,w:6,h:0.5,fontSize:15,color:SUB,fontFace:F});
s.addText("알앤디메이커스 주식회사  |  rndmakers.kr",{x:0.7,y:6.6,w:6,h:0.4,fontSize:12,color:SUB,fontFace:F});
img(s,L+"walking-main.jpg",7.2,0.6,5.5,6.3);

// 2 company
s=slide("회사 소개","COMPANY");
table(s,[["회사명","알앤디메이커스 주식회사"],["대표이사","신동규"],["사업 분야","재활용 소재(폐타이어 고무·벽지 PVC·간벌재) 가공 및 생활용품·신발 제조"],["브랜드","RHARA SHOE (근무화·인솔) / re.feeel (생활용품)"],["생산","국내 협력 공장 생산 (신발: 라파)"],["납품 실적","생활용품 유통 채널 욕실화 납품 실적 보유 (세부 사항은 미팅 시 안내)"],["사업자등록번호","709-81-02967"],["본점","대전광역시 유성구 국제과학7로 8"]],0.6,1.5,7.4,[1.9,5.5]);
card(s,8.4,1.5,4.3,2.4,"RHARA SHOE","Made for Standing.\n발이 편해야, 일이 편하다.\n하루 종일 서서 일하는 사람을 위한 근무화 브랜드");
card(s,8.4,4.1,4.3,2.4,"re.feeel","일상 생활용품 브랜드\n칫솔 · 치실 · 양치컵 · 욕실화 · 볼펜\n(욕실화: 재생 벽지 PVC · 볼펜: 간벌재)");

// 3 walking shoe
s=slide("쿼드그립 종일편한 워킹화","PRODUCT 01 · WORK SHOE");
img(s,L+"walking-pair-real.jpg",0.6,1.5,4.1,2.6);
img(s,L+"walking-sole-real.jpg",0.6,4.25,4.1,2.6);
table(s,[["사이즈","230 ~ 280mm"],["컬러","차콜 · 그레이 · 민트화이트"],["무게","한쪽 257g (270mm 기준 실측)"],["본체·밑창","합성수지 E-실리폴리렌 (EVA·실리콘 배합)"],["그립 패드","재생고무(폐타이어) · 재생 PVC(벽지)"],["출시","2026년 11월"]],5.0,1.5,7.7,[1.8,5.9]);
card(s,5.0,4.25,2.45,2.6,"쿼드그립","밑창 4곳에 그립 패드를 배치한 구조");
card(s,7.62,4.25,2.45,2.6,"일체형 안창","깔창이 따로 없는 한 덩어리 안창 — 세척·관리가 쉬움");
card(s,10.24,4.25,2.46,2.6,"발목 테두리","도톰하게 감싸는 입구 테두리");

// 4 slip test + MRO
s=slide("미끄럼 저항 시험 결과 · 직원 근무화 제안","TEST RESULT · STAFF SHOE PROPOSAL");
table(s,[["시험 방법","KS M ISO 13287:2019 · 260mm 좌 1족 · 2026.11"],["시험 기관","한국소재융합연구원 (성적서 S-26-0313)"],["시험 바닥","강철 바닥, 뒤꿈치 기준"],["세제 바닥","마찰계수 0.36"],["글리세롤 바닥","마찰계수 0.17"]],0.6,1.5,6.2,[1.8,4.4]);
s.addText("※ 위 값은 시험 성적이며 안전화 인증이 아니며, 기름 바닥에서의 미끄럼 성능을 보증하지 않습니다. 성적서 사본은 요청 시 제공합니다.",{x:0.6,y:4.2,w:6.2,h:0.5,fontSize:11,color:SUB,fontFace:F});
card(s,7.2,1.5,5.5,5.3,"매장 직원 근무화로 제안합니다",
"• 대상: 델리·주방, 계산대, 창고·진열 등 종일 서서 일하는 직원\n• 밑창 4곳에 그립 패드를 배치한 쿼드그립 구조\n• 깔창 없는 일체형이라 물세척 후 관리가 간편\n• 사이즈 230~280mm, 3가지 컬러로 직무별 구분 가능\n• 단체 구매 시 사이즈 구성·포장 단위 협의\n• 샘플 제공 후 현장 착화 테스트 가능");

// 5 insole
s=slide("쿼드그립 아치가득 인솔","PRODUCT 02 · INSOLE");
img(s,L+"insole-pack-full.jpg",0.6,1.5,5.4,5.3);
table(s,[["사이즈","M 15cm · L 17cm (반굽형)"],["컬러","그레이 · 모카무스"],["소재","합성수지(E-실리폴리렌) + 목분(우드칩) 배합"],["구조","아치가득 구조 · 뒤꿈치 컵 구조 · 통기 구멍"],["사용법","신발 안 기존 깔창 밑에 깔아서 사용 — 자를 필요 없음"],["공급 시기","협의"]],6.4,1.5,6.3,[1.6,4.7]);
card(s,6.4,4.3,6.3,2.5,"이런 분께","새 신발을 사지 않고도 지금 신는 운동화·근무화 안에\n한 장 더 깔아 쓰는 방식이라, 직원 근무화와 함께\n매장 판매 상품으로도 구성할 수 있습니다.");
s.addText("※ 의료기기가 아닙니다.",{x:6.4,y:6.85,w:6,h:0.3,fontSize:11,color:SUB,fontFace:F});

// 6 re.feeel
s=slide("re.feeel 생활용품 라인","PRODUCT 03 · DAILY GOODS");
const items=[[A+"toothbrush.jpg","칫솔"],[A+"floss.jpg","칫솔형 치실"],[A+"cup-life.jpg","양치컵"],[A+"slipper-wide.jpg","스마일 욕실화 (2종)"],[A+"prize-pen-v.png","CXP 볼펜 (간벌재)"]];
items.forEach(([pth,t],i)=>{const x=0.6+i*2.48; img(s,pth,x,1.5,2.32,3.4); s.addText(t,{x,y:5.0,w:2.32,h:0.45,fontSize:14,bold:true,align:"center",...font});});
s.addText("※ 욕실화는 기존 유통 계약 조건을 확인한 뒤 공급 가능 여부를 안내드립니다.\n※ 품목별 소재·규격은 상세 스펙 시트로 별도 제공합니다.",{x:0.6,y:5.7,w:12,h:0.8,fontSize:12,color:SUB,fontFace:F});

// 7 terms
s=slide("공급 조건 · 문의","SUPPLY TERMS · CONTACT");
table(s,[["공급 단가","품목·수량 확인 후 별도 견적"],["최소 주문 수량","협의"],["납기","발주 확정 후 협의 (생산 일정 기준)"],["수출 서류","구매확인서 · 영세율 세금계산서 등 협의"],["샘플","품평용 샘플 제공 가능"]],0.6,1.5,7.4,[2.2,5.2]);
card(s,8.4,1.5,4.3,5.0,"문의","알앤디메이커스 주식회사\n대표이사 신동규\n\n전화 0507-1317-2516\n이메일 rndceo@rndmakers.kr\n홈페이지 rndmakers.kr\n\n사무실\n경기도 고양시 일산서구\n중앙로 1542");
p.writeFile({fileName:"/home/user/harness-system/launch/rs/sales/RHARA_SHOE_제품소개서_Hmart.pptx"}).then(f=>console.log(f));
