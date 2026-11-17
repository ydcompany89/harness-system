// 알앤디메이커스 회사·상품 소개서 (RHARA SHOE + re.feeel) — 국문/영문 동시 생성
const pptxgen = require("pptxgenjs");
const R="/home/user/harness-system/launch/rs/", L=R+"landing/img/", A=R+"design/fair-print/assets/", S=R+"sales/assets/";
const INK="0D1B14", SUB="66736A", LINE="DADFD9", BG="F6F7F4", LIME="C6F432", RF="2E6B4F";
const T={
ko:{font:"맑은 고딕",file:"알앤디메이커스_회사상품소개서_KR.pptx",
 cover:["남은 것을,\n다음 쓰임으로.","공장·목공소에서 남은 자투리 소재를 일부 배합해\n서서 일하는 사람의 신발과 매일 쓰는 생활용품을 만듭니다.","COMPANY & PRODUCT INTRODUCTION 2026","알앤디메이커스 주식회사  ·  rndmakers.kr"],
 about:["회사 소개","자투리 소재 가공부터 완제품까지, 협력 공장과 함께.",
  "알앤디메이커스는 공장·목공소에서 남은 자투리 소재를 일부 배합해, 협력 공장과 함께 신발과 생활용품을 만드는 제조 회사입니다.",
  [["회사명","알앤디메이커스 주식회사"],["대표이사","신동규"],["사업자등록번호","709-81-02967"],["본점","대전광역시 유성구 국제과학7로 8"],["사무실","경기도 고양시 일산서구 중앙로 1542"],["브랜드","RHARA SHOE (근무화·인솔) · re.feeel (생활용품)"]]],
 mat:["소재","다시 가공해 쓰는 소재 4가지",[
  ["폐타이어 고무","워킹화 그립 패드"],["공장 자투리 실크벽지 PVC","욕실화 · 그립 패드"],["간벌재 CXP","볼펜 바디"],["목공소 자투리 우드칩","아치가득 인솔"]]],
 proof:["실적과 근거","숫자와 기록으로 말합니다.",[
  ["다이소","다이소에 욕실화를 납품해 온 제조사 (회사 실적)"],["환경부","새활용 산업 육성 지원사업 수행 기업"],["지식재산","디자인등록 제30-○호 · 특허출원 제10-○호 외 1건 · 상표 출원"],["시험","KS M ISO 13287 미끄럼 저항 시험 (한국소재융합연구원)"],["킨텍스 메가쇼","4일간 현장 판매 인솔 63켤레 (2026.11)"]],"킨텍스 메가쇼 2026 · 알앤디메이커스 부스"],
 rsIntro:["BRAND 01 · RHARA SHOE","Made for Standing.","서서 일하는 사람을 위한 근무화·인솔 브랜드.","\"깔창이 자꾸 딸려 나와요.\" 식당을 하는 친구에게 들은 한마디에서 시작했습니다. 그래서 깔창을 없앤 워킹화를, 다른 신발을 신는 날을 위해 깔창 밑에 까는 인솔을 만들었습니다."],
 walk:["RHARA SHOE · 근무화","쿼드그립 종일편한 워킹화",[["사이즈","230 ~ 280 mm"],["컬러","차콜 · 그레이 · 민트화이트"],["무게","한쪽 257g (270mm 실측)"],["본체·밑창","E-실리폴리렌 (EVA·실리콘 배합)"],["그립 패드","폐타이어 고무 · 자투리 실크벽지 PVC"]],
  [["쿼드그립","밑창 4곳에 그립 패드"],["일체형 안창","깔창 없이 한 덩어리 · 헹구기 쉬움"],["발목 테두리","입구를 도톰하게"]]],
 ins:["RHARA SHOE · 인솔","쿼드그립 아치가득 인솔",[["사이즈","M 15cm (신발 220~255) · L 17cm (신발 260~290)"],["두께","뒤꿈치 3mm · 아치 최고 15mm"],["컬러","그레이 · 모카무스"],["소재","E-실리폴리렌 + 목공소 자투리 우드칩"],["사용법","쓰던 깔창 밑에 깔기 · 자를 필요 없음"]],"반굽 길이라 발가락 쪽 높이는 그대로.","의료기기가 아닙니다."],
 slip:["RHARA SHOE · 시험 결과 · 직원 근무화 제안","매장 직원 근무화로 제안합니다.","미끄럼 저항 시험","마찰계수 · 강철 바닥 + 세제 · 뒤꿈치",[["시험 방법","KS M ISO 13287:2019"],["시료","260mm 좌 1족 · 2026.11"],["시험 기관","한국소재융합연구원 (S-26-0313)"],["글리세롤","강철 바닥 + 글리세롤 · 뒤꿈치: 0.17"]],"시험 결과이며 안전화 인증이 아닙니다. 기름 바닥 시험은 하지 않았습니다. 성적서는 요청 시 제공합니다.","대상: 계산대 · 진열 직원 (기름 없는 바닥 · 안전화 의무 현장 제외)",["밑창 4곳 그립 패드 (쿼드그립)","깔창 없는 일체형 — 헹구기 쉬움","230~280mm · 3색으로 직무 구분","단체 사이즈 구성 · 포장 협의","샘플로 현장 착화 테스트"]],
 rfIntro:["BRAND 02 · re.feeel","남은 것의 다음 모양.","REFILL YOUR DAY — 매일 쓰는 물건을, 남은 소재로.","나무를 솎아 내며 나온 간벌재와 공장에서 나온 자투리 벽지로, 칫솔부터 욕실화까지 매일 손이 가는 물건을 만듭니다."],
 oral:["re.feeel · 구강케어","매일 쓰는 구강케어.",[["DAY2NIGHT 칫솔","아침과 저녁, 목적이 다른 칫솔 2종"],["칫솔형 치실","칫솔처럼 손잡이를 쥐고 쓰는 치실"],["양치컵","40° 기울여 말리는 구조"]],""],
 bath:["re.feeel · 욕실화 · 문구","자투리 벽지, 욕실화에 다시 쓰였습니다.",[["스마일 욕실화 2종","공장 자투리 실크벽지 PVC 배합"],["CXP 볼펜","간벌재 바디 · 노크식"]]],
 moq:["공급 조건","MOQ & 공급 조건","최소 주문 수량",[["워킹화 · 아치가득 인솔 · 스마일 욕실화","600족"],["CXP 볼펜","600개"],["칫솔 · 칫솔형 치실 · 양치컵","2,000개"]],"패키지 변경","MOQ 이상 주문 시 가능합니다.",[["단가","품목·수량별 견적"],["납기","생산 일정 확인 후 협의"],["샘플","품평용 제공 가능"],["수출 서류","요청 시 협의"]],"구강용품의 미국 FDA 등록 등 비용·시간이 큰 인증 절차는 공급 조건에 포함되지 않으며, 범위·비용 분담·일정은 별도로 협의합니다."],
 contact:["문의","샘플·견적·사양서는 요청 시 바로 보내드립니다.",[["담당","신동규 대표이사"],["이메일","rndceo@rndmakers.kr"],["전화","0507-1317-2516"],["홈페이지","rndmakers.kr"]]]},
en:{font:"Arial",file:"RnDMakers_Company_Product_Introduction_EN.pptx",
 cover:["Leftovers,\nmade useful again.","We blend factory and woodshop off-cuts into\nwork footwear and everyday goods.","COMPANY & PRODUCT INTRODUCTION 2026","R&D Makers Co., Ltd.  ·  rndmakers.kr"],
 about:["About us","From off-cut materials to finished goods, with our partner factory.",
  "R&D Makers blends factory and woodshop off-cuts into footwear and daily goods, made with our partner factory.",
  [["Company","R&D Makers Co., Ltd."],["CEO","Dongkyu Shin"],["Business reg. no.","709-81-02967"],["Head office","8, Gukjegwahak 7-ro, Yuseong-gu, Daejeon"],["Office","1542, Jungang-ro, Ilsanseo-gu, Goyang-si, Gyeonggi-do"],["Brands","RHARA SHOE (work shoes · insoles) · re.feeel (daily goods)"]]],
 mat:["Materials","Four reclaimed materials we blend in",[
  ["End-of-life tire rubber","Shoe grip pads"],["Factory off-cut silk-wallpaper PVC","Bath slippers · grip pads"],["Forest-thinning wood (CXP)","Pen body"],["Woodshop off-cut wood chips","Arch-Full insole"]]],
 proof:["Track record","Facts and records.",[
  ["Daiso","Bath-slipper supplier to Daiso (company record)"],["Ministry of Environment","Participant, upcycling industry support program"],["IP","Design Reg. No. 30-○ · Patent Appl. No. 10-○ and 1 other · Trademark filed"],["Testing","KS M ISO 13287 slip resistance (Korea Inst. of Materials Convergence Tech.)"],["KINTEX MegaShow","63 pairs of insoles sold on site in 4 days (Nov 2026)"]],"KINTEX MegaShow 2026 · R&D Makers booth"],
 rsIntro:["BRAND 01 · RHARA SHOE","Made for Standing.","Work shoes and insoles for people who stand all day.","\"My insole keeps slipping out.\" It started with one line from a friend who runs a restaurant. So we made a work shoe with no loose insole — and, for days in other shoes, an insole that goes under the one you already have."],
 walk:["RHARA SHOE · Work shoe","Quad-Grip All-Day Walking Shoe",[["Sizes","230 – 280 mm"],["Colors","Charcoal · Gray · Mint White"],["Weight","257 g per shoe (270 mm)"],["Upper & sole","E-Silipolyrene (EVA + silicone blend)"],["Grip pads","Tire rubber · off-cut silk-wallpaper PVC"]],
  [["Quad-Grip","Four grip pads on the outsole"],["One-piece","No loose insole · easy to rinse"],["Soft collar","Thick, rounded opening"]]],
 ins:["RHARA SHOE · Insole","Quad-Grip Arch-Full Insole",[["Sizes","M 15 cm (shoe 220–255) · L 17 cm (shoe 260–290)"],["Thickness","Heel 3 mm · arch up to 15 mm"],["Colors","Gray · Mocha Mousse"],["Material","E-Silipolyrene + woodshop off-cut wood chips"],["How to use","Place under the existing insole · no cutting"]],"Half-length, so the toe area stays at its original height.","Not a medical device."],
 slip:["RHARA SHOE · Test result · Staff shoe","A work shoe for your store team.","Slip resistance test","Coefficient of friction · steel + detergent · heel",[["Method","KS M ISO 13287:2019"],["Sample","Size 260 mm, left, 1 shoe · Nov 2026"],["Laboratory","Korea Inst. of Materials Convergence Tech. (S-26-0313)"],["Glycerol","Steel floor + glycerol, heel: 0.17"]],"Test result only — not a safety-shoe certification. Not tested on oily floors. Report available on request.","For: checkout · stocking staff (non-oily floors; not for sites requiring safety shoes)",["Four-point grip pad outsole (Quad-Grip)","One-piece footbed — easy to rinse","230–280 mm · 3 colors to separate teams","Bulk size-run packing on request","Samples for on-site wear trials"]],
 rfIntro:["BRAND 02 · re.feeel","The next shape of what's left.","REFILL YOUR DAY — everyday things, from leftover materials.","From forest-thinning wood and factory off-cut wallpaper, we make the things you reach for every day — from toothbrushes to bath slippers."],
 oral:["re.feeel · Oral care","Everyday oral care.",[["DAY2NIGHT toothbrush","Two brushes for morning and night"],["Floss pick","Floss you hold like a toothbrush"],["Rinse cup","Tilted 40° to dry"]],""],
 bath:["re.feeel · Bath & stationery","Off-cut wallpaper, reused in bath slippers.",[["Smile bath slippers (2 types)","With factory off-cut silk-wallpaper PVC"],["CXP ballpoint pen","Thinning-wood body · click type"]]],
 moq:["Supply terms","MOQ & terms","Minimum order quantity",[["Walking shoe · Arch-Full insole · Smile bath slippers","600 pairs"],["CXP ballpoint pen","600 pcs"],["Toothbrush · Floss pick · Rinse cup","2,000 pcs"]],"Custom packaging","Available for orders at or above MOQ.",[["Pricing","Quotation by item and quantity"],["Lead time","Confirmed with production schedule"],["Samples","Available for evaluation"],["Export documents","On request"]],"Oral care: any U.S. FDA registration, testing or other regulatory steps involving significant cost or time are not included and will be agreed separately (scope, cost sharing, schedule)."],
 contact:["Contact","Samples, spec sheets and quotations on request.",[["Contact","Dongkyu Shin, CEO"],["Email","rndceo@rndmakers.kr"],["Phone","+82 507-1317-2516"],["Web","rndmakers.kr"]]]}};

function build(lang){
 const t=T[lang], F=t.font; const p=new pptxgen(); p.layout="LAYOUT_WIDE"; const W=13.33,M=0.75; let n=0;
 const tx=(s,v,o)=>s.addText(v,Object.assign({fontFace:F,color:INK,margin:0},o));
 function base(ey,title,accent=LIME){const s=p.addSlide();s.background={color:BG};n++;
  if(ey){s.addShape(p.ShapeType.rect,{x:M,y:0.72,w:0.28,h:0.06,fill:{color:accent},line:{color:accent}});
   tx(s,ey.toUpperCase(),{x:M,y:0.82,w:10,h:0.3,fontSize:10,color:SUB,bold:true,charSpacing:2});
   tx(s,title,{x:M,y:1.12,w:11.8,h:0.75,fontSize:28,bold:true});}
  tx(s,"R&D MAKERS  ·  RHARA SHOE  ·  re.feeel",{x:M,y:6.95,w:6,h:0.3,fontSize:8.5,bold:true,color:SUB,charSpacing:2});
  tx(s,String(n).padStart(2,"0"),{x:W-M-1,y:6.95,w:1,h:0.3,fontSize:9,color:SUB,align:"right"});return s;}
 const photo=(s,path,x,y,w,h)=>{s.addShape(p.ShapeType.rect,{x,y,w,h,fill:{color:"FFFFFF"},line:{color:"FFFFFF"}});const d=0.12;s.addImage({path,x:x+d,y:y+d,w:w-2*d,h:h-2*d,sizing:{type:"contain",w:w-2*d,h:h-2*d}});};
 function specs(s,rows,x,y,w,lw=1.8,rh=0.47,fs=12){rows.forEach(([k,v],i)=>{const yy=y+i*rh;s.addShape(p.ShapeType.line,{x,y:yy,w,h:0,line:{color:LINE,width:0.75}});
  tx(s,k,{x,y:yy,w:lw,h:rh,fontSize:fs-1,color:SUB,valign:"middle"});tx(s,v,{x:x+lw,y:yy,w:w-lw,h:rh,fontSize:fs,valign:"middle"});});
  s.addShape(p.ShapeType.line,{x,y:y+rows.length*rh,w,h:0,line:{color:LINE,width:0.75}});}
 // 1 cover
 let s=p.addSlide();s.background={color:BG};n++;
 s.addImage({path:A+"rs-logo-ink.png",x:M,y:0.75,w:0.8,h:0.67,sizing:{type:"contain",w:0.8,h:0.67}});
 s.addImage({path:A+"refeeel-logo.png",x:M+1.05,y:0.7,w:0.55,h:0.78,sizing:{type:"contain",w:0.55,h:0.78}});
 tx(s,t.cover[0],{x:M,y:2.0,w:6.2,h:2.0,fontSize:44,bold:true,lineSpacingMultiple:0.95});
 tx(s,t.cover[1],{x:M,y:4.15,w:6.2,h:0.9,fontSize:15,color:SUB});
 s.addShape(p.ShapeType.rect,{x:M,y:5.35,w:0.28,h:0.06,fill:{color:LIME},line:{color:LIME}});
 tx(s,t.cover[2],{x:M,y:5.5,w:6.2,h:0.3,fontSize:10,bold:true,charSpacing:2});
 tx(s,t.cover[3],{x:M,y:6.85,w:6.2,h:0.3,fontSize:10,color:SUB});
 photo(s,L+"walking-main.jpg",7.0,0,3.17,3.75); photo(s,S+"refeeel-brush-cup.jpg",10.17,0,3.16,3.75);
 photo(s,L+"insole-pack-full.jpg",7.0,3.75,3.17,3.75); photo(s,A+"slipper-quilt.jpg",10.17,3.75,3.16,3.75);
 // 2 about
 s=base(t.about[0],t.about[1]); tx(s,t.about[2],{x:M,y:2.1,w:11.8,h:0.7,fontSize:14});
 specs(s,t.about[3],M,3.0,7.2,2.0,0.5,12.5);
 s.addShape(p.ShapeType.rect,{x:8.5,y:3.0,w:4.1,h:1.4,fill:{color:INK},line:{color:INK}});
 s.addImage({path:A+"rs-logo-white.png",x:8.75,y:3.25,w:0.9,h:0.9,sizing:{type:"contain",w:0.9,h:0.9}});
 tx(s,"RHARA SHOE",{x:9.85,y:3.3,w:2.6,h:0.4,fontSize:16,bold:true,color:"F2F4F2"});tx(s,"Made for Standing.",{x:9.85,y:3.7,w:2.6,h:0.4,fontSize:12,color:"9FB3A6"});
 s.addShape(p.ShapeType.rect,{x:8.5,y:4.6,w:4.1,h:1.4,fill:{color:"FFFFFF"},line:{color:LINE}});
 s.addImage({path:A+"refeeel-logo.png",x:8.8,y:4.75,w:0.8,h:1.1,sizing:{type:"contain",w:0.8,h:1.1}});
 tx(s,"re.feeel",{x:9.85,y:4.9,w:2.6,h:0.4,fontSize:16,bold:true,color:RF});tx(s,"REFILL YOUR DAY",{x:9.85,y:5.3,w:2.6,h:0.4,fontSize:12,color:SUB});
 // 3 materials
 s=base(t.mat[0],t.mat[1]); const mw=(W-2*M-3*0.3)/4;
 t.mat[2].forEach(([a,b],i)=>{const x=M+i*(mw+0.3);s.addShape(p.ShapeType.line,{x,y:2.4,w:mw,h:0,line:{color:INK,width:1.5}});
  tx(s,"0"+(i+1),{x,y:2.55,w:mw,h:0.3,fontSize:11,bold:true,color:SUB});tx(s,a,{x,y:2.9,w:mw,h:0.9,fontSize:17,bold:true,valign:"top"});tx(s,"→ "+b,{x,y:3.85,w:mw,h:0.6,fontSize:12.5,color:SUB,valign:"top"});});
 photo(s,A+"outsole-studio.jpg",M,4.75,3.7,1.95);photo(s,A+"slipper-low.jpg",M+3.95,4.75,3.7,1.95);photo(s,A+"cxp.jpg",M+7.9,4.75,3.93,1.95);
 // 4 proof
 s=base(t.proof[0],t.proof[1]); specs(s,t.proof[2],M,2.1,6.6,1.9,0.66,12);
 photo(s,S+"kintex-booth.jpg",7.6,2.1,5.0,3.75); tx(s,t.proof[3],{x:7.6,y:5.95,w:5,h:0.3,fontSize:9.5,color:SUB});
 // 5 RS intro
 s=p.addSlide();s.background={color:INK};n++;
 s.addImage({path:A+"rs-logo-white.png",x:M,y:0.75,w:0.9,h:0.76,sizing:{type:"contain",w:0.9,h:0.76}});
 tx(s,t.rsIntro[0],{x:M,y:2.0,w:6,h:0.3,fontSize:10,bold:true,color:LIME,charSpacing:2});
 tx(s,t.rsIntro[1],{x:M,y:2.4,w:6.2,h:1.0,fontSize:44,bold:true,color:"F2F4F2"});
 tx(s,t.rsIntro[2],{x:M,y:3.5,w:6.2,h:0.5,fontSize:16,color:"9FB3A6"});
 tx(s,t.rsIntro[3],{x:M,y:4.3,w:6.0,h:2.0,fontSize:13,color:"F2F4F2",valign:"top"});
 photo(s,L+"walking-main.jpg",7.2,0.75,5.4,6.0);
 // 6 walking
 s=base(t.walk[0],t.walk[1]); photo(s,L+"walking-pair-real.jpg",M,2.1,3.0,4.6); photo(s,L+"walking-sole-real.jpg",M+3.15,2.1,3.0,4.6);
 specs(s,t.walk[2],7.3,2.1,5.3); t.walk[3].forEach(([h,b],i)=>{const x=7.3+i*1.8;tx(s,"0"+(i+1),{x,y:4.75,w:1.7,h:0.3,fontSize:10,bold:true,color:SUB});tx(s,h,{x,y:5.05,w:1.7,h:0.4,fontSize:14,bold:true});tx(s,b,{x,y:5.47,w:1.7,h:0.8,fontSize:10.5,color:SUB,valign:"top"});});
 // 7 insole
 s=base(t.ins[0],t.ins[1]); photo(s,L+"insole-pack-full.jpg",M,2.1,3.0,4.6); photo(s,L+"insole-pack-mocha.jpg",M+3.15,2.1,3.0,4.6);
 specs(s,t.ins[2],7.3,2.1,5.3,1.4); tx(s,t.ins[3],{x:7.3,y:4.75,w:5.3,h:0.6,fontSize:14,bold:true});tx(s,t.ins[4],{x:7.3,y:6.3,w:5.3,h:0.3,fontSize:9.5,color:SUB});
 // 8 slip
 s=base(t.slip[0],t.slip[1]); tx(s,t.slip[2],{x:M,y:2.1,w:5.6,h:0.4,fontSize:15,bold:true});
 tx(s,"0.36",{x:M,y:2.55,w:2.6,h:1.1,fontSize:60,bold:true});tx(s,t.slip[3],{x:M+2.6,y:2.8,w:3.3,h:0.8,fontSize:12,color:SUB});
 specs(s,t.slip[4],M,3.85,5.8,1.5,0.44,11);tx(s,t.slip[5],{x:M,y:5.75,w:5.8,h:0.6,fontSize:9.5,color:SUB});
 s.addShape(p.ShapeType.rect,{x:7.1,y:2.1,w:5.5,h:4.5,fill:{color:INK},line:{color:INK}});
 tx(s,t.slip[6],{x:7.45,y:2.4,w:4.8,h:0.8,fontSize:16,bold:true,color:"F2F4F2"});
 s.addText(t.slip[7].map(x=>({text:x,options:{bullet:true}})),{x:7.45,y:3.4,w:4.9,h:2.9,fontFace:F,fontSize:13,color:"F2F4F2",valign:"top",paraSpaceAfter:8,margin:0});
 // 9 re.feeel intro
 s=p.addSlide();s.background={color:"FFFFFF"};n++;
 s.addImage({path:A+"refeeel-logo.png",x:M,y:0.6,w:0.7,h:1.0,sizing:{type:"contain",w:0.7,h:1.0}});
 tx(s,t.rfIntro[0],{x:M,y:2.0,w:6,h:0.3,fontSize:10,bold:true,color:RF,charSpacing:2});
 tx(s,t.rfIntro[1],{x:M,y:2.4,w:6.2,h:1.0,fontSize:38,bold:true});
 tx(s,t.rfIntro[2],{x:M,y:3.5,w:6.2,h:0.5,fontSize:14,color:SUB});
 tx(s,t.rfIntro[3],{x:M,y:4.3,w:6.0,h:1.8,fontSize:13,valign:"top"});
 photo(s,A+"slipper-quilt.jpg",7.2,0.75,5.4,6.0);
 // 10 oral
 s=base(t.oral[0],t.oral[1],RF); const ow=(W-2*M-2*0.3)/3; const oi=[S+"refeeel-brush-cup.jpg",A+"floss-hand.jpg",A+"cup-tilt.jpg"];
 t.oral[2].forEach(([h,b],i)=>{const x=M+i*(ow+0.3);photo(s,oi[i],x,2.1,ow,3.3);tx(s,h,{x,y:5.55,w:ow,h:0.4,fontSize:15,bold:true});tx(s,b,{x,y:5.95,w:ow,h:0.5,fontSize:11.5,color:SUB,valign:"top"});});
 tx(s,t.oral[3],{x:M,y:6.55,w:6,h:0.3,fontSize:10,bold:true,color:RF});
 // 11 bath
 s=base(t.bath[0],t.bath[1],RF); photo(s,A+"slipper-wide.jpg",M,2.1,4.3,3.4);photo(s,A+"slipper-quilt.jpg",M+4.45,2.1,4.3,3.4);photo(s,A+"prize-pen-v.png",M+8.9,2.1,2.93,3.4);
 t.bath[2].forEach(([h,b],i)=>{const x=i==0?M:M+8.9, w=i==0?8.75:2.93;tx(s,h,{x,y:5.65,w,h:0.4,fontSize:15,bold:true});tx(s,b,{x,y:6.05,w,h:0.6,fontSize:11.5,color:SUB,valign:"top"});});
 // 12 moq
 s=base(t.moq[0],t.moq[1]); tx(s,t.moq[2],{x:M,y:2.1,w:6,h:0.35,fontSize:13,bold:true}); specs(s,t.moq[3],M,2.55,6.4,4.3,0.55,12.5);
 s.addShape(p.ShapeType.rect,{x:7.6,y:2.1,w:5.0,h:1.4,fill:{color:LIME},line:{color:LIME}});
 tx(s,t.moq[4],{x:7.9,y:2.3,w:4.5,h:0.4,fontSize:16,bold:true});tx(s,t.moq[5],{x:7.9,y:2.75,w:4.5,h:0.6,fontSize:12.5});
 specs(s,t.moq[6],7.6,3.8,5.0,1.5,0.47,12);
 tx(s,t.moq[7],{x:M,y:4.6,w:6.4,h:1.0,fontSize:10,color:SUB,valign:"top"});
 // 13 contact
 s=base("",""); tx(s,t.contact[0],{x:M,y:1.5,w:8,h:1.2,fontSize:48,bold:true}); tx(s,t.contact[1],{x:M,y:2.75,w:9,h:0.5,fontSize:16,color:SUB});
 specs(s,t.contact[2],M,3.8,7.0,1.6,0.52,14);
 s.addImage({path:A+"rs-logo-ink.png",x:9.6,y:3.9,w:1.4,h:1.18,sizing:{type:"contain",w:1.4,h:1.18}});
 s.addImage({path:A+"refeeel-logo.png",x:11.3,y:3.75,w:1.0,h:1.42,sizing:{type:"contain",w:1.0,h:1.42}});
 return p.writeFile({fileName:R+"sales/"+t.file});
}
Promise.all([build("ko"),build("en")]).then(f=>console.log(f.join("\n")));
