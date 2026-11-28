import numpy as np, cv2, sys
IM=sys.argv[1]
im=cv2.imread(IM)[650:1950, 0:1500]
hsv=cv2.cvtColor(im,cv2.COLOR_BGR2HSV); g=im.mean(2)
lime=cv2.inRange(hsv,(28,80,80),(62,255,255))>0
lime=cv2.dilate(lime.astype(np.uint8),np.ones((7,7),np.uint8))>0
shoe=(g<140)&~lime
shoe=cv2.morphologyEx(shoe.astype(np.uint8)*255,cv2.MORPH_CLOSE,np.ones((15,15),np.uint8))
n,l,st,_=cv2.connectedComponentsWithStats(shoe); keep=np.zeros(shoe.shape,np.uint8)
for i in range(1,n):
    if st[i,4]>20000: keep[l==i]=1
# 구멍 메우기(패드 자리 제외)
cnts,_=cv2.findContours(keep,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_NONE); full=np.zeros_like(keep); cv2.drawContours(full,cnts,-1,1,-1)
m=(full>0)&~lime
core=cv2.erode(m.astype(np.uint8),np.ones((3,3),np.uint8))
mf=cv2.GaussianBlur(core.astype(np.float32),(0,0),1.0)[...,None]
lab=cv2.cvtColor(im,cv2.COLOR_BGR2LAB).astype(np.float32)
Lo=cv2.bilateralFilter(lab[...,0],9,18,6)*100/255
vals=Lo[m]; p2,p50,p98=np.percentile(vals,[2,50,98])
p=((Lo-p2)/(p98-p2)).clip(0,1.3)
# 국소 대비(질감) 강조
blur=cv2.GaussianBlur(Lo,(0,0),6); detail=(Lo-blur)
def make(Lt,a,b,rng,spec,det):
    L=Lt+(p-0.5)*rng+detail*det
    hi=np.clip((Lo-np.percentile(vals,96))/(p98-np.percentile(vals,96)+1e-6),0,1)
    L=L+hi*spec
    L=np.clip(L,0,99)
    out=np.stack([L*255/100,np.full_like(L,a+128),np.full_like(L,b+128)],-1)
    # 아주 약한 색 흔들림(재질감)
    out[...,1]+=detail*0.15; out[...,2]+=detail*0.15
    bgr=cv2.cvtColor(np.clip(out,0,255).astype(np.uint8),cv2.COLOR_LAB2BGR).astype(np.float32)
    res=im*(1-mf)+bgr*mf
    # 가장자리 검은 테 제거: 경계 1~3px을 배경과 섞기
    edge=(cv2.dilate(m.astype(np.uint8),np.ones((5,5),np.uint8))>0)&~(core>0)&~lime
    res[edge]=res[edge]*0.35+bgr[edge]*0.65
    return np.clip(res,0,255).astype(np.uint8)
cv2.imwrite('gray2.jpg',make(60,-0.5,-1.5,34,8,1.0),[cv2.IMWRITE_JPEG_QUALITY,93])
cv2.imwrite('mint2.jpg',make(88,-7.5,1.5,20,6,0.7),[cv2.IMWRITE_JPEG_QUALITY,93])
cv2.imwrite('charcoal2.jpg',im,[cv2.IMWRITE_JPEG_QUALITY,93])
print('ok',p2,p50,p98)
