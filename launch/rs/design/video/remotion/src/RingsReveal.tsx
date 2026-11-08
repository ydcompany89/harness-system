import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';

// 브랜드 토큰 (product-master 2026-11-08 확정)
const C = {bg: '#0D1B14', lime: '#C6F432', text: '#F2F4F2', sub: '#9FB3A6'};
const FONT = "'Noto Sans CJK KR','Noto Sans KR',sans-serif";
const EASE = Easing.bezier(0.22, 1, 0.36, 1); // 템플릿과 같은 이징

const sec = (s: number, fps: number) => Math.round(s * fps);

// 글자가 아래에서 올라오는 효과 (overflow-hidden 클립 리빌)
const Rise: React.FC<{at: number; out?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({at, out, children, style}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const y = interpolate(f, [sec(at, fps), sec(at + 0.7, fps)], [110, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE});
  const o = out === undefined ? 1 : interpolate(f, [sec(out, fps), sec(out + 0.5, fps)], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{overflow: 'hidden', ...style}}>
      <div style={{transform: `translateY(${y}%)`, opacity: o}}>{children}</div>
    </div>
  );
};
const Fade: React.FC<{at: number; out?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({at, out, children, style}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const i = interpolate(f, [sec(at, fps), sec(at + 0.6, fps)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE});
  const o = out === undefined ? 1 : interpolate(f, [sec(out, fps), sec(out + 0.5, fps)], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const y = interpolate(i, [0, 1], [32, 0]);
  return <div style={{opacity: i * o, transform: `translateY(${y}px)`, ...style}}>{children}</div>;
};
// 로고 옆 라임 점 4개: 뒤꿈치→앞코 순서로 톡톡
const Quad: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const order = [2, 3, 1, 0];
  return (
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(2,22px)', gap: 9}}>
      {[0, 1, 2, 3].map((i) => {
        const k = order.indexOf(i);
        const s = interpolate(f, [sec(at + k * 0.15, fps), sec(at + k * 0.15 + 0.45, fps)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(2.2))});
        return <i key={i} style={{width: 22, height: 22, borderRadius: 11, background: C.lime, transform: `scale(${s})`, display: 'block'}} />;
      })}
    </div>
  );
};

export const RingsReveal: React.FC<{format: 'reel' | 'feed'}> = ({format}) => {
  const {width, height} = useVideoConfig();
  const pad = 72; const big = format === 'reel' ? 190 : 150;
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT, color: C.text}}>
      <OffthreadVideo src={staticFile('rings-reveal.mp4')} style={{width, height, objectFit: 'cover'}} muted />
      <Audio src={staticFile('bgm12.wav')} />
      {/* 위·아래 그라데이션 (글자 가독성) */}
      <AbsoluteFill style={{background: 'linear-gradient(rgba(13,27,20,.75) 0%, rgba(13,27,20,0) 24%, rgba(13,27,20,0) 62%, rgba(13,27,20,.92) 100%)'}} />

      {/* 상단 바: 로고 + 점 4개 */}
      <div style={{position: 'absolute', left: pad, right: pad, top: pad, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Fade at={0.1}><Img src={staticFile('rs-logo-light.png')} style={{height: 64}} /></Fade>
        <Quad at={0.3} />
      </div>

      {/* 1막 0~4초: MADE / FOR / STANDING. */}
      <div style={{position: 'absolute', right: pad, bottom: pad * 1.6, textAlign: 'right', fontWeight: 900, fontSize: big, lineHeight: 0.88, letterSpacing: '-0.04em'}}>
        <Rise at={0.4} out={3.6}>MADE</Rise>
        <Rise at={0.54} out={3.62}>FOR</Rise>
        <Rise at={0.68} out={3.64}>STAND<span style={{color: C.lime}}>ING.</span></Rise>
      </div>

      {/* 2막 4.4~7.2초: 약속 */}
      <div style={{position: 'absolute', left: pad, top: pad * 2.6, fontWeight: 800}}>
        <Rise at={4.4} out={7.1} style={{fontSize: 68, lineHeight: 1.18}}>오래 서 있는 하루를 위한,</Rise>
        <Rise at={4.6} out={7.15} style={{fontSize: 68, lineHeight: 1.18}}>약속.</Rise>
        <Fade at={5.1} out={7.2} style={{fontSize: 44, color: C.lime, marginTop: 24}}>쿼드그립 그립 패드</Fade>
      </div>

      {/* 3막 7.8~10.8초: 해석 */}
      <div style={{position: 'absolute', left: pad, top: pad * 2.6}}>
        <Rise at={7.8} out={10.7} style={{fontSize: 74, fontWeight: 900, color: C.lime, letterSpacing: '-0.02em'}}>4 RINGS = 4 GRIP PADS</Rise>
        <Fade at={8.3} out={10.75} style={{fontSize: 44, fontWeight: 500, marginTop: 18}}>발이 바닥에 닿는 순서대로, 4곳.</Fade>
      </div>

      {/* 마무리 10.6~12초: 사전예약 */}
      <div style={{position: 'absolute', left: pad, right: pad, bottom: pad * 1.4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
        <Fade at={10.6} style={{fontSize: 50, fontWeight: 800, lineHeight: 1.35}}>
          <div style={{color: C.sub, fontSize: 38}}>쿼드그립 종일편한 워킹화</div>
          <div>11.24까지 사전예약 · <span style={{color: C.lime}}>오픈 날 15% 쿠폰</span></div>
        </Fade>
      </div>
    </AbsoluteFill>
  );
};
