from PIL import Image, ImageDraw, ImageFont
import qrcode, os
B='/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'; R='/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'; K='/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc'
f=lambda s,w='b': ImageFont.truetype({'b':B,'r':R,'k':K if os.path.exists(K) else B}[w],s,index=1)
W,H=1754,2480; BG=(13,27,20); LIME=(198,244,50); TXT=(242,244,242); SUB=(159,179,166); CARD=(20,40,29); LINE=(35,64,47); MUTE=(111,133,120)
c=Image.new('RGB',(W,H),BG); d=ImageDraw.Draw(c); M=120
logo=Image.open('/home/user/harness-system/launch/rs/landing/img/rs-logo-light.png').convert('RGBA'); logo.thumbnail((140,118)); c.paste(logo,(M,90),logo)
d.text((M+160,110),'RHARA SHOE',font=f(32),fill=TXT); d.text((M+160,152),'라라슈',font=f(28,'r'),fill=SUB)
for i in range(4): d.ellipse((W-M-48+(i%2)*28,96+(i//2)*28,W-M-28+(i%2)*28,116+(i//2)*28),fill=LIME)
d.text((W-M-70,108),'KINTEX MEGASHOW',font=f(30),fill=SUB,anchor='ra'); d.text((W-M-70,148),'부스 R106',font=f(30),fill=LIME,anchor='ra')
y=290; t='현장 사전예약 · ~11.24'; tw=d.textlength(t,font=f(42)); d.rounded_rectangle((M,y,M+tw+60,y+80),40,fill=LIME); d.text((M+30,y+40),t,font=f(42),fill=BG,anchor='lm')
d.text((M,400),'오늘 예약하고',font=f(136,'k'),fill=TXT); d.text((M,565),'오픈 날 15% 쿠폰',font=f(136,'k'),fill=LIME)
d.text((M,755),'쿼드그립 종일편한 워킹화 · 11.25 라라슈 자사몰 오픈',font=f(42),fill=TXT)
ph=Image.open('/tmp/claude-0/-home-user-harness-system/f589f59e-5047-5a0d-9959-068b0d0e969a/images/99.jpg').convert('RGB').crop((60,300,1960,860)); pw=W-2*M; phh=int(ph.height*pw/ph.width); ph=ph.resize((pw,phh),Image.LANCZOS)
py=850; card=Image.new('RGB',(pw,phh+30),(246,246,244)); card.paste(ph,(0,15))
mask=Image.new('L',card.size,0); ImageDraw.Draw(mask).rounded_rectangle((0,0)+card.size,40,fill=255); c.paste(card,(M,py),mask)
ly=py+card.height+26
for i,(n,col) in enumerate([('차콜',(60,64,66)),('민트화이트',(220,234,226)),('그레이',(128,130,130))]):
    cx=M+pw*(i*2+1)//6; d.ellipse((cx-90,ly+6,cx-62,ly+34),fill=col,outline=LINE,width=3); d.text((cx-48,ly+20),n,font=f(38),fill=TXT,anchor='lm')
y=ly+90
d.text((M,y),'판매가 42,500원  →  쿠폰 적용 시',font=f(42,'r'),fill=SUB); d.text((M,y+52),'36,125원',font=f(118,'k'),fill=LIME)
d.text((W-M,y+110),'230~280mm · 한쪽 257g',font=f(34,'r'),fill=SUB,anchor='ra'); d.text((W-M,y+156),'(270mm 샘플 실측)',font=f(26,'r'),fill=MUTE,anchor='ra')
y+=250; ch=560
d.rounded_rectangle((M,y,W-M,y+ch),40,fill=CARD,outline=LINE,width=3)
q=qrcode.QRCode(border=2,box_size=12); q.add_data('https://go.rharashoe.com/walk?src=kintex'); q.make(); qi=q.make_image(fill_color='#0D1B14',back_color='#F2F4F2').convert('RGB').resize((420,420),Image.NEAREST)
qx=W-M-55-420; c.paste(qi,(qx,y+55)); d.text((qx+210,y+510),'휴대폰 카메라로 스캔',font=f(30),fill=TXT,anchor='mm')
sy=y+65
for n,a,b in [('1','QR 스캔','오른쪽 QR을 찍어 주세요'),('2','신청서 작성','이름 · 연락처 · 사이즈 · 컬러 (결제 없음)'),('3','11.25 쿠폰 도착','오픈 날 문자로 15% 쿠폰 → 자사몰에서 구매')]:
    d.ellipse((M+55,sy,M+131,sy+76),fill=LIME); d.text((M+93,sy+38),n,font=f(42),fill=BG,anchor='mm')
    d.text((M+160,sy+2),a,font=f(48),fill=TXT); d.text((M+160,sy+66),b,font=f(28,'r'),fill=SUB); sy+=158
y+=ch+50
for nt in ['· 사전예약은 결제 없이 신청만 받아요. 구매 예약이나 재고 확보가 아니며, 구매는 11.25부터 라라슈 자사몰에서 해요.',
 '· 쿠폰: 1인(휴대폰 번호 기준) 1회 · 워킹화 1켤레 · 11.25~12.7 사용 · 다른 쿠폰과 중복 불가 · 오픈일이 바뀌면 사용 기간도 같은 일수만큼 미뤄요.',
 '· 사이즈·컬러 재고가 떨어지면 구매가 어려울 수 있어요. 이미지 색상은 실제와 다를 수 있어요.']:
    line=''
    for ch_ in nt:
        if d.textlength(line+ch_,font=f(25,'r'))>W-2*M: d.text((M,y),line,font=f(25,'r'),fill=MUTE); y+=38; line=''
        line+=ch_
    d.text((M,y),line,font=f(25,'r'),fill=MUTE); y+=50
c.save('/home/user/harness-system/launch/rs/deploy/메가쇼_워킹화사전예약_안내포스터_미리보기.png'); c.resize((W//2,H//2)).save('poster_s.png')
