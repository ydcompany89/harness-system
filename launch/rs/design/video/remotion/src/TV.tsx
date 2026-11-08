import React from 'react';
import {AbsoluteFill, Audio, Img, Loop, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';

// 메가쇼 현장 TV (가로 1920x1080) · 20초 반복: 12초 전환 영상 + 8초 사전예약 QR 카드
const C = {bg: '#0D1B14', card: '#14281D', lime: '#C6F432', text: '#F2F4F2', sub: '#9FB3A6'};
const FONT = "'Noto Sans CJK KR','Noto Sans KR',sans-serif";
const EASE = Easing.bezier(0.22, 1, 0.36, 1);
const s2f = (s: number, fps: number) => Math.round(s * fps);
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

const Rise: React.FC<{at: number; out?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({at, out, children, style}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const y = interpolate(f, [s2f(at, fps), s2f(at + 0.7, fps)], [110, 0], {...clamp, easing: EASE});
  const o = out === undefined ? 1 : interpolate(f, [s2f(out, fps), s2f(out + 0.5, fps)], [1, 0], clamp);
  return <div style={{overflow: 'hidden', ...style}}><div style={{transform: `translateY(${y}%)`, opacity: o}}>{children}</div></div>;
};
const Fade: React.FC<{at: number; out?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({at, out, children, style}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const i = interpolate(f, [s2f(at, fps), s2f(at + 0.6, fps)], [0, 1], {...clamp, easing: EASE});
  const o = out === undefined ? 1 : interpolate(f, [s2f(out, fps), s2f(out + 0.5, fps)], [1, 0], clamp);
  return <div style={{opacity: i * o, transform: `translateY(${interpolate(i, [0, 1], [32, 0])}px)`, ...style}}>{children}</div>;
};
const Quad: React.FC = () => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig(); const order = [2, 3, 1, 0];
  return <div style={{display: 'grid', gridTemplateColumns: 'repeat(2,20px)', gap: 8}}>{[0, 1, 2, 3].map((i) => {
    const k = order.indexOf(i); const t = (f / fps) % 20;
    const s = interpolate(t, [0.3 + k * 0.15, 0.75 + k * 0.15], [0, 1], {...clamp, easing: Easing.out(Easing.back(2.2))});
    return <i key={i} style={{width: 20, height: 20, borderRadius: 10, background: C.lime, transform: `scale(${s})`, display: 'block'}} />;
  })}</div>;
};

export const TV: React.FC = () => {
  const {fps} = useVideoConfig();
  const vidW = 640, vidX = 150;
  const right: React.CSSProperties = {position: 'absolute', left: 920, right: 120};
  return (
    <AbsoluteFill style={{background: `radial-gradient(1200px 900px at 25% 50%, #162C20, ${C.bg})`, fontFamily: FONT, color: C.text}}>
      {/* 왼쪽: 링 → 밑창 전환 영상 (세로 원본을 그대로) */}
      <Loop durationInFrames={s2f(12, fps)}>
        <AbsoluteFill>
          <OffthreadVideo src={staticFile('rings-reveal.mp4')} muted style={{position: 'absolute', left: vidX, top: 0, width: vidW, height: 1080 * 1.0, objectFit: 'cover', WebkitMaskImage: 'linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)'}} />
        </AbsoluteFill>
      </Loop>
      <Audio src={staticFile('bgm12.wav')} loop />

      {/* 상단 바 */}
      <div style={{position: 'absolute', left: 120, right: 120, top: 70, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Img src={staticFile('rs-logo-light.png')} style={{height: 64}} />
        <div style={{display: 'flex', alignItems: 'center', gap: 22, fontSize: 26, fontWeight: 700, letterSpacing: '0.14em', color: C.sub}}>QUAD GRIP WORKING SHOE <Quad /></div>
      </div>

      {/* 0~12초: 영상과 같은 이야기 */}
      <Sequence durationInFrames={s2f(12, fps)}>
        <div style={{...right, top: 330, fontWeight: 900, fontSize: 168, lineHeight: 0.88, letterSpacing: '-0.04em'}}>
          <Rise at={0.4} out={3.6}>MADE</Rise><Rise at={0.54} out={3.62}>FOR</Rise>
          <Rise at={0.68} out={3.64}>STAND<span style={{color: C.lime}}>ING.</span></Rise>
        </div>
        <div style={{...right, top: 380, fontWeight: 800}}>
          <Rise at={4.4} out={7.1} style={{fontSize: 68, lineHeight: 1.2, whiteSpace: 'nowrap'}}>오래 서 있는 하루를 위한,</Rise>
          <Rise at={4.6} out={7.15} style={{fontSize: 68, lineHeight: 1.2}}>약속.</Rise>
          <Fade at={5.1} out={7.2} style={{fontSize: 52, color: C.lime, marginTop: 30}}>쿼드그립 그립 패드</Fade>
        </div>
        <div style={{...right, top: 400}}>
          <Rise at={7.8} out={11.4} style={{fontSize: 74, fontWeight: 900, color: C.lime, letterSpacing: '-0.02em', whiteSpace: 'nowrap'}}>4 RINGS = 4 GRIP PADS</Rise>
          <Fade at={8.3} out={11.45} style={{fontSize: 52, fontWeight: 500, marginTop: 24}}>발이 바닥에 닿는 순서대로, 4곳.</Fade>
        </div>
      </Sequence>

      {/* 12~20초: 사전예약 QR 카드 */}
      <Sequence from={s2f(12, fps)} durationInFrames={s2f(8, fps)}>
        <div style={{...right, top: 250}}>
          <Fade at={0.1} style={{fontSize: 34, fontWeight: 700, color: C.sub, letterSpacing: '0.04em'}}>쿼드그립 종일편한 워킹화 · 11.25 오픈</Fade>
          <Rise at={0.3} style={{fontSize: 96, fontWeight: 900, lineHeight: 1.12, marginTop: 14}}>지금 사전예약하면</Rise>
          <Rise at={0.45} style={{fontSize: 96, fontWeight: 900, lineHeight: 1.12, color: C.lime}}>오픈 날 15% 쿠폰</Rise>
          <Fade at={0.9} style={{display: 'flex', alignItems: 'center', gap: 44, marginTop: 56}}>
            <div style={{background: C.text, padding: 18, borderRadius: 24}}><Img src={staticFile('qr-walk-kintex.png')} style={{width: 300, height: 300, display: 'block'}} /></div>
            <div style={{fontSize: 40, fontWeight: 700, lineHeight: 1.45}}>
              <div>휴대폰 카메라로 스캔</div>
              <div style={{color: C.sub, fontSize: 32, fontWeight: 500}}>11.24까지 · 결제 없이 신청만</div>
              <div style={{color: C.sub, fontSize: 32, fontWeight: 500}}>go.rharashoe.com/walk</div>
            </div>
          </Fade>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
