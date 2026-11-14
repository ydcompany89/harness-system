// RHARA SHOE / re.feeel — B2B Product Introduction (English, minimal light layout)
const pptxgen = require("pptxgenjs");
const R = "/home/user/harness-system/launch/rs/";
const L = R + "landing/img/", A = R + "design/fair-print/assets/";
const INK="0D1B14", SUB="66736A", LINE="DADFD9", BG="F6F7F4", PANEL="FFFFFF", LIME="C6F432", F="Arial";
const p = new pptxgen(); p.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
const W = 13.33, M = 0.75;
let n = 0;
function base(eyebrow, title){
  const s = p.addSlide(); s.background = {color:BG}; n++;
  if (eyebrow){
    s.addShape(p.ShapeType.rect,{x:M,y:0.72,w:0.28,h:0.06,fill:{color:LIME},line:{color:LIME}});
    s.addText(eyebrow.toUpperCase(),{x:M,y:0.82,w:8,h:0.3,fontFace:F,fontSize:10,color:SUB,bold:true,charSpacing:3,margin:0});
    s.addText(title,{x:M,y:1.12,w:11.8,h:0.75,fontFace:F,fontSize:30,bold:true,color:INK,margin:0});
  }
  s.addText("RHARA SHOE",{x:M,y:6.93,w:3,h:0.3,fontFace:F,fontSize:9,bold:true,color:INK,charSpacing:3,margin:0});
  s.addText(String(n).padStart(2,"0"),{x:W-M-1,y:6.93,w:1,h:0.3,fontFace:F,fontSize:9,color:SUB,align:"right",margin:0});
  return s;
}
function photo(s,path,x,y,w,h,bg=PANEL){
  s.addShape(p.ShapeType.rect,{x,y,w,h,fill:{color:bg},line:{color:bg}});
  const pad=0.15; s.addImage({path,x:x+pad,y:y+pad,w:w-2*pad,h:h-2*pad,sizing:{type:"contain",w:w-2*pad,h:h-2*pad}});
}
// spec list: label / value rows with hairlines
function specs(s,rows,x,y,w,lw=1.7,rh=0.48,fs=12){
  rows.forEach(([k,v],i)=>{
    const yy=y+i*rh;
    s.addShape(p.ShapeType.line,{x,y:yy,w,h:0,line:{color:LINE,width:0.75}});
    s.addText(k,{x,y:yy,w:lw,h:rh,fontFace:F,fontSize:fs-1,color:SUB,valign:"middle",margin:0});
    s.addText(v,{x:x+lw,y:yy,w:w-lw,h:rh,fontFace:F,fontSize:fs,color:INK,valign:"middle",margin:0});
  });
  s.addShape(p.ShapeType.line,{x,y:y+rows.length*rh,w,h:0,line:{color:LINE,width:0.75}});
}
function feature(s,x,y,w,num,head,body){
  s.addText(num,{x,y,w,h:0.3,fontFace:F,fontSize:10,bold:true,color:SUB,margin:0});
  s.addText(head,{x,y:y+0.3,w,h:0.4,fontFace:F,fontSize:15,bold:true,color:INK,margin:0});
  s.addText(body,{x,y:y+0.72,w,h:0.8,fontFace:F,fontSize:11,color:SUB,valign:"top",margin:0});
}
function note(s,t,y){ s.addText(t,{x:M,y,w:W-2*M,h:0.4,fontFace:F,fontSize:9.5,color:SUB,margin:0}); }

// 01 Cover
let s = p.addSlide(); s.background={color:BG}; n++;
s.addImage({path:A+"rs-logo-ink.png",x:M,y:0.75,w:0.9,h:0.76,sizing:{type:"contain",w:0.9,h:0.76}});
s.addText("Made for\nStanding.",{x:M,y:2.2,w:6,h:1.9,fontFace:F,fontSize:52,bold:true,color:INK,margin:0,lineSpacingMultiple:0.95});
s.addText("Work footwear, insoles and daily goods\nfor people who stand all day.",{x:M,y:4.25,w:6,h:0.8,fontFace:F,fontSize:16,color:SUB,margin:0});
s.addShape(p.ShapeType.rect,{x:M,y:5.35,w:0.28,h:0.06,fill:{color:LIME},line:{color:LIME}});
s.addText("PRODUCT INTRODUCTION 2026",{x:M,y:5.5,w:6,h:0.3,fontFace:F,fontSize:10,bold:true,color:INK,charSpacing:3,margin:0});
s.addText("R&D Makers Co., Ltd.  ·  rndmakers.kr",{x:M,y:6.85,w:6,h:0.3,fontFace:F,fontSize:10,color:SUB,margin:0});
photo(s,L+"walking-main.jpg",7.0,0,6.33,7.5);

// 02 Company
s = base("About us","Everyday products that use recycled materials.");
s.addText("R&D Makers processes recycled materials — end-of-life tire rubber, wallpaper PVC and forest-thinning wood — and manufactures footwear and daily goods in Korea.",
  {x:M,y:2.1,w:7.4,h:0.9,fontFace:F,fontSize:14,color:INK,margin:0});
const cols=[["RHARA SHOE","Work footwear & insoles","Shoes and insoles for people who stand all day — stores, warehouses, service counters."],
            ["re.feeel","Daily goods","Toothbrush, floss, cup, bath slippers and pens."],
            ["Track record","Retail supply","Bath slippers supplied through a Korean household goods retail channel."]];
cols.forEach(([h,sub,b],i)=>{const x=M+i*3.95; s.addShape(p.ShapeType.line,{x,y:3.55,w:3.6,h:0,line:{color:INK,width:1.25}});
  s.addText(h,{x,y:3.7,w:3.6,h:0.45,fontFace:F,fontSize:18,bold:true,color:INK,margin:0});
  s.addText(sub,{x,y:4.15,w:3.6,h:0.3,fontFace:F,fontSize:11,color:SUB,margin:0});
  s.addText(b,{x,y:4.6,w:3.4,h:1.0,fontFace:F,fontSize:12,color:INK,valign:"top",margin:0});});
specs(s,[["Company","R&D Makers Co., Ltd.  ·  CEO Dongkyu Shin"],["Business reg. no.","709-81-02967"],["Production","Partner factories in Korea"]],M,5.75,11.8,2.0,0.36,11);

// 03 Walking shoe
s = base("Product 01 · Work shoe","Quad-Grip All-Day Walking Shoe");
photo(s,L+"walking-pair-real.jpg",M,2.1,3.0,4.6);
photo(s,L+"walking-sole-real.jpg",M+3.15,2.1,3.0,4.6);
specs(s,[["Sizes","230 – 280 mm"],["Colors","Charcoal · Gray · Mint White"],["Weight","257 g per shoe (270 mm)"],["Upper & sole","E-Silipolyrene (EVA + silicone blend)"],["Grip pads","Recycled tire rubber · recycled wallpaper PVC"]],7.3,2.1,5.3);
feature(s,7.3,4.75,1.7,"01","Quad-Grip","Four grip pads placed on the outsole.");
feature(s,9.1,4.75,1.7,"02","One-piece","No separate insole. Easy to rinse.");
feature(s,10.9,4.75,1.7,"03","Soft collar","Thick, rounded opening.");

// 04 Slip test & staff shoe
s = base("Test result · Staff shoe proposal","A work shoe for your store team.");
s.addText("Slip resistance test",{x:M,y:2.1,w:5.6,h:0.4,fontFace:F,fontSize:15,bold:true,color:INK,margin:0});
s.addText("0.36",{x:M,y:2.55,w:2.6,h:1.1,fontFace:F,fontSize:60,bold:true,color:INK,margin:0});
s.addText("Coefficient of friction\nsteel floor + detergent, heel",{x:M+2.6,y:2.75,w:3.2,h:0.8,fontFace:F,fontSize:12,color:SUB,margin:0});
specs(s,[["Method","KS M ISO 13287:2019"],["Sample","Size 260 mm, left, 1 shoe · Nov 2026"],["Laboratory","Korea Institute of Materials Convergence Tech. (S-26-0313)"],["Glycerol","Steel floor + glycerol, heel: 0.17"]],M,3.85,5.8,1.6,0.44,11);
s.addText("Test result only — not a safety-shoe certification. Not rated for oily floors. Test report available on request.",{x:M,y:5.75,w:5.8,h:0.6,fontFace:F,fontSize:9.5,color:SUB,margin:0});
s.addShape(p.ShapeType.rect,{x:7.1,y:2.1,w:5.5,h:4.5,fill:{color:INK},line:{color:INK}});
s.addText("Proposed for",{x:7.45,y:2.4,w:4.8,h:0.3,fontFace:F,fontSize:11,color:"9FB3A6",margin:0});
s.addText("Checkout · Stocking · Warehouse staff\n(non-oily floors)",{x:7.45,y:2.7,w:4.8,h:0.8,fontFace:F,fontSize:18,bold:true,color:"F2F4F2",margin:0});
s.addText([
 {text:"Four-point grip pad outsole (Quad-Grip)",options:{bullet:true}},
 {text:"One-piece footbed — easy to rinse",options:{bullet:true}},
 {text:"Sizes 230–280 mm; 3 colors to separate teams",options:{bullet:true}},
 {text:"Bulk size-run packing on request",options:{bullet:true}},
 {text:"Samples available for on-site wear trials",options:{bullet:true}}],
 {x:7.45,y:3.65,w:4.9,h:2.7,fontFace:F,fontSize:13,color:"F2F4F2",valign:"top",paraSpaceAfter:8,margin:0});

// 05 Insole
s = base("Product 02 · Insole","Quad-Grip Arch-Full Insole");
photo(s,L+"insole-pack-full.jpg",M,2.1,6.1,4.6);
specs(s,[["Sizes","M 15 cm · L 17 cm (half-length)"],["Colors","Gray · Mocha Mousse"],["Material","E-Silipolyrene + wood-chip blend"],["Structure","Arch-full shape · heel cup · air holes"],["How to use","Place under the existing insole. No cutting needed."]],7.3,2.1,5.3);
s.addText("Add it to the shoes your team already wears — or stock it as an add-on item.",{x:7.3,y:4.75,w:5.3,h:0.9,fontFace:F,fontSize:14,color:INK,margin:0});
s.addText("Not a medical device.",{x:7.3,y:6.3,w:5.3,h:0.3,fontFace:F,fontSize:9.5,color:SUB,margin:0});

// 06 re.feeel
s = base("Product 03 · Daily goods","re.feeel daily goods");
const items=[[A+"toothbrush.jpg","Toothbrush"],[A+"floss.jpg","Floss pick"],[A+"cup-life.jpg","Rinse cup"],[A+"slipper-wide.jpg","Smile bath slippers","Recycled wallpaper PVC · 2 types"],[A+"prize-pen-v.png","CXP ballpoint pen","Forest-thinning wood"]];
const gw=(W-2*M-4*0.2)/5;
items.forEach(([pth,t,sub],i)=>{const x=M+i*(gw+0.2); photo(s,pth,x,2.1,gw,3.3);
  s.addText(t,{x,y:5.55,w:gw,h:0.35,fontFace:F,fontSize:14,bold:true,color:INK,margin:0});
  if(sub) s.addText(sub,{x,y:5.9,w:gw,h:0.5,fontFace:F,fontSize:10,color:SUB,valign:"top",margin:0});});
note(s,"Detailed spec sheets per item available on request.",6.5);

// 07 MOQ & terms
s = base("Supply terms","MOQ & terms");
const moq=[["Quad-Grip All-Day Walking Shoe","600 pairs"],["Quad-Grip Arch-Full Insole","600 pairs"],["Smile bath slippers","600 pairs"],["CXP ballpoint pen","600 pcs"],["Toothbrush","2,000 pcs"],["Floss pick","2,000 pcs"],["Rinse cup","2,000 pcs"]];
s.addText("Minimum order quantity",{x:M,y:2.1,w:6,h:0.35,fontFace:F,fontSize:13,bold:true,color:INK,margin:0});
specs(s,moq,M,2.55,6.4,4.2,0.47,12.5);
s.addShape(p.ShapeType.rect,{x:7.6,y:2.1,w:5.0,h:1.6,fill:{color:LIME},line:{color:LIME}});
s.addText("Custom packaging",{x:7.9,y:2.3,w:4.5,h:0.4,fontFace:F,fontSize:16,bold:true,color:INK,margin:0});
s.addText("Available for orders at or above MOQ.",{x:7.9,y:2.75,w:4.5,h:0.7,fontFace:F,fontSize:12.5,color:INK,margin:0});
specs(s,[["Pricing","Quotation by item and quantity"],["Lead time","Confirmed with production schedule"],["Samples","Available for evaluation"],["Documents","Export documents on request"]],7.6,4.0,5.0,1.4,0.47,12);
s.addText([{text:"Oral care products (toothbrush, floss pick, rinse cup): ",options:{bold:true}},{text:"any U.S. FDA registration, testing or other regulatory steps involving significant cost or time are not included and will be agreed separately (scope, cost sharing, schedule)."}],{x:7.6,y:6.05,w:5.0,h:0.75,fontFace:F,fontSize:9.5,color:INK,valign:"top",margin:0});

// 08 Contact
s = base("","");
s.addText("Let’s talk.",{x:M,y:1.6,w:8,h:1.2,fontFace:F,fontSize:52,bold:true,color:INK,margin:0});
s.addText("Samples, spec sheets and quotations are available on request.",{x:M,y:2.85,w:8,h:0.5,fontFace:F,fontSize:16,color:SUB,margin:0});
specs(s,[["Contact","Dongkyu Shin, CEO"],["Email","rndceo@rndmakers.kr"],["Phone","+82 507-1317-2516"],["Web","rndmakers.kr"],["Company","R&D Makers Co., Ltd."]],M,3.9,7.0,1.6,0.5,14);
s.addImage({path:A+"rs-logo-ink.png",x:10.3,y:3.9,w:2.3,h:1.94,sizing:{type:"contain",w:2.3,h:1.94}});

p.writeFile({fileName:R+"sales/RHARA_SHOE_Product_Introduction_EN.pptx"}).then(f=>console.log(f));
