import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';

// 메가쇼 현장 TV — 쿼드그립 아치가득 인솔 CM송 (150초, 1920x1080)
// 구간 경계는 음원 분석값(초): 6.8 16.5 27.2 38.5 55.2 77.5 106.5 133.5 145.5
const C = {bg: '#0D1B14', card: '#14281D', line: '#23402F', lime: '#C6F432', text: '#F2F4F2', sub: '#9FB3A6'};
const FONT = "'Noto Sans CJK KR','Noto Sans KR',sans-serif";
const EASE = Easing.bezier(0.22, 1, 0.36, 1);
const cl = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

const useLocal = () => { const f = useCurrentFrame(); const {fps, durationInFrames} = useVideoConfig(); return {t: f / fps, f, fps, dur: durationInFrames / fps}; };
const In: React.FC<{at?: number; y?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({at = 0, y = 40, children, style}) => {
  const {t} = useLocal(); const k = interpolate(t, [at, at + 0.6], [0, 1], {...cl, easing: EASE});
  return <div style={{opacity: k, transform: `translateY(${(1 - k) * y}px)`, ...style}}>{children}</div>;
};
const Rise: React.FC<{at?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({at = 0, children, style}) => {
  const {t} = useLocal(); const y = interpolate(t, [at, at + 0.7], [110, 0], {...cl, easing: EASE});
  return <div style={{overflow: 'hidden', ...style}}><div style={{transform: `translateY(${y}%)`}}>{children}</div></div>;
};
// 장면 전체 페이드 (앞뒤 0.4초)
const Scene: React.FC<{children: React.ReactNode}> = ({children}) => {
  const {t, dur} = useLocal(); const o = Math.min(interpolate(t, [0, 0.4], [0, 1], cl), interpolate(t, [dur - 0.4, dur], [1, 0], cl));
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};
const Ken: React.FC<{src: string; style?: React.CSSProperties; from?: number; to?: number}> = ({src, style, from = 1.0, to = 1.08}) => {
  const {t, dur} = useLocal(); const s = interpolate(t, [0, dur], [from, to], cl);
  return <div style={{overflow: 'hidden', borderRadius: 28, background: '#F3F3F1', ...style}}><Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${s})`}} /></div>;
};
const Dots: React.FC<{size?: number; at?: number}> = ({size = 22, at = 0}) => {
  const {t} = useLocal(); const order = [2, 3, 1, 0];
  return <div style={{display: 'grid', gridTemplateColumns: `repeat(2,${size}px)`, gap: size * 0.4}}>{[0, 1, 2, 3].map((i) => {
    const k = order.indexOf(i); const s = interpolate(t, [at + k * 0.15, at + k * 0.15 + 0.45], [0, 1], {...cl, easing: Easing.out(Easing.back(2.2))});
    return <i key={i} style={{width: size, height: size, borderRadius: size / 2, background: C.lime, transform: `scale(${s})`, display: 'block'}} />;
  })}</div>;
};
const Label: React.FC<{children: React.ReactNode}> = ({children}) => <div style={{fontSize: 30, fontWeight: 700, color: C.sub, letterSpacing: '0.02em'}}>{children}</div>;
const sec = (a: number, b: number, fps: number) => ({from: Math.round(a * fps), durationInFrames: Math.round((b - a) * fps)});

// ③ 넣는 법 3단계 — 단순 도식 (실물 사진 없을 때)
const HowTo: React.FC = () => {
  const {t} = useLocal();
  const step = t < 3.6 ? 0 : t < 7.2 ? 1 : 2;
  const lift = interpolate(t, [0.6, 2.4], [0, -70], {...cl, easing: EASE}) * (step === 0 ? 1 : step === 1 ? 1 : interpolate(t, [7.4, 9.2], [1, 0], {...cl, easing: EASE}));
  const insX = interpolate(t, [3.8, 6.0], [420, 0], {...cl, easing: EASE});
  const showIns = t > 3.6;
  return (
    <svg viewBox="0 0 800 420" style={{width: 800, height: 420}}>
      {/* 신발 옆모습 */}
      <path d="M60 300 Q60 200 160 190 L420 170 Q520 160 600 120 L700 110 Q740 110 740 170 L740 300 Q740 330 700 330 L100 330 Q60 330 60 300Z" fill="#1E3A2A" stroke={C.line} strokeWidth="4" />
      <rect x="80" y="330" width="660" height="26" rx="13" fill="#0A150F" stroke={C.line} strokeWidth="3" />
      {/* 아치가득 인솔 (뒤꿈치~아치, 반굽) */}
      {showIns && <path transform={`translate(${insX},0)`} d="M100 300 Q100 276 130 272 L330 266 Q380 264 400 286 L400 300 Z" fill={C.lime} opacity={0.95} />}
      {/* 쓰던 깔창 */}
      <g transform={`translate(0,${lift}) rotate(${lift / -12} 100 300)`}>
        <path d="M95 296 L700 290 Q720 290 720 300 L720 304 L95 310 Z" fill="#9FB3A6" />
      </g>
      <text x="400" y="400" textAnchor="middle" fontSize="34" fontWeight="800" fill={C.text} fontFamily="Noto Sans CJK KR">{['① 쓰던 깔창을 들고', '② 뒤꿈치에 맞춰 깔고', '③ 깔창을 다시 덮기'][step]}</text>
    </svg>
  );
};

export const InsoleTV: React.FC = () => {
  const {fps} = useVideoConfig();
  const pad = 120;
  return (
    <AbsoluteFill style={{background: `radial-gradient(1400px 900px at 30% 50%, #162C20, ${C.bg})`, fontFamily: FONT, color: C.text}}>
      <Audio src={staticFile('insole-song.m4a')} />
      {/* 상단 고정 바 */}
      <div style={{position: 'absolute', left: pad, right: pad, top: 64, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 5}}>
        <Img src={staticFile('rs-logo-light.png')} style={{height: 60}} />
        <div style={{display: 'flex', alignItems: 'center', gap: 20, fontSize: 26, fontWeight: 700, color: C.sub}}>쿼드그립 아치가득 인솔 <Dots size={18} /></div>
      </div>
      {/* 하단 고정 고지 (감수 권고) */}
      <div style={{position: 'absolute', right: pad, bottom: 40, fontSize: 22, color: '#6F8578', zIndex: 5}}>의료기기가 아니에요 · 노래 속 인물과 상황은 연출이에요</div>

      {/* 0~6.8 인트로 */}
      <Sequence {...sec(0, 6.8, fps)}><Scene><AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 40}}>
        <Dots size={56} at={0.4} />
        <Rise at={1.4} style={{fontSize: 120, fontWeight: 900, letterSpacing: '-0.03em'}}>오후 4시,</Rise>
        <In at={2.2} style={{fontSize: 48, fontWeight: 700, color: C.sub}}>서서 일하는 하루의 한가운데</In>
      </AbsoluteFill></Scene></Sequence>

      {/* 6.8~16.5 1절 앞: 오후 네 시 짝다리 / 하루 열 시간 */}
      <Sequence {...sec(6.8, 16.5, fps)}><Scene>
        <div style={{position: 'absolute', left: pad, top: 300}}>
          <Label>VERSE 1</Label>
          <Rise at={0.3} style={{fontSize: 104, fontWeight: 900, lineHeight: 1.12, marginTop: 20}}>하루 열 시간,</Rise>
          <Rise at={0.5} style={{fontSize: 104, fontWeight: 900, lineHeight: 1.12}}>서 있는 <span style={{color: C.lime}}>발</span></Rise>
          <In at={1.2} style={{fontSize: 40, color: C.sub, marginTop: 30}}>주방 · 매장 · 계산대 앞</In>
        </div>
        <div style={{position: 'absolute', right: pad, top: 230, width: 620, height: 620, borderRadius: 310, border: `10px solid ${C.line}`, display: 'grid', placeItems: 'center'}}>
          <Clock />
        </div>
      </Scene></Sequence>

      {/* 16.5~27.2 1절 뒤: 신발 그대로 바닥만 */}
      <Sequence {...sec(16.5, 27.2, fps)}><Scene>
        <Ken src="insole-sneaker-model.jpg" style={{position: 'absolute', left: pad, top: 200, width: 900, height: 675}} />
        <div style={{position: 'absolute', left: 1100, right: pad, top: 330}}>
          <Rise at={0.4} style={{fontSize: 96, fontWeight: 900, lineHeight: 1.12}}>신발은 그대로,</Rise>
          <Rise at={0.6} style={{fontSize: 96, fontWeight: 900, lineHeight: 1.12, color: C.lime}}>바닥만 새로.</Rise>
          <In at={1.3} style={{fontSize: 38, color: C.sub, marginTop: 30}}>가지고 계신 운동화·출근화에</In>
        </div>
      </Scene></Sequence>

      {/* 27.2~38.5 프리코러스: 쓰던 깔창 밑에 한 장 */}
      <Sequence {...sec(27.2, 38.5, fps)}><Scene>
        <div style={{position: 'absolute', left: pad, top: 250}}>
          <Rise at={0.2} style={{fontSize: 88, fontWeight: 900, lineHeight: 1.15}}>쓰던 깔창 밑에</Rise>
          <Rise at={0.4} style={{fontSize: 88, fontWeight: 900, lineHeight: 1.15, color: C.lime}}>깔기만 하면 돼요</Rise>
          <In at={1.0} style={{fontSize: 38, color: C.sub, marginTop: 30}}>자르지 않아도 돼요 · 인솔 길이 M 15cm · L 17cm</In>
        </div>
        <div style={{position: 'absolute', right: 80, top: 380}}><HowTo /></div>
      </Scene></Sequence>

      {/* 38.5~55.2 후렴 1: 아치 밑이 꽉 / 뒤꿈치 쏙 */}
      <Sequence {...sec(38.5, 55.2, fps)}><Scene>
        <Ken src="insole-pack-full.jpg" style={{position: 'absolute', left: pad, top: 200, width: 900, height: 675}} />
        <div style={{position: 'absolute', left: 1100, right: pad, top: 280}}>
          <Label>CHORUS</Label>
          <Rise at={0.3} style={{fontSize: 92, fontWeight: 900, lineHeight: 1.12, marginTop: 16}}>아치 밑은</Rise>
          <Rise at={0.5} style={{fontSize: 92, fontWeight: 900, lineHeight: 1.12, color: C.lime}}>가득,</Rise>
          <Rise at={4.0} style={{fontSize: 92, fontWeight: 900, lineHeight: 1.12}}>뒤꿈치는</Rise>
          <Rise at={4.2} style={{fontSize: 92, fontWeight: 900, lineHeight: 1.12, color: C.lime}}>쏙.</Rise>
          <In at={6} style={{display: 'flex', gap: 16, marginTop: 36}}>
            {['아치가득 구조', '뒤꿈치 컵 구조', '우드칩 배합 소재'].map((s) => <span key={s} style={{fontSize: 28, fontWeight: 700, padding: '10px 22px', borderRadius: 999, background: C.card, border: `1px solid ${C.line}`}}>{s}</span>)}
          </In>
        </div>
      </Scene></Sequence>

      {/* 55.2~77.5 2절: 서서 일하는 사람 위해 · 설계 자문 · 와디즈 알림 */}
      <Sequence {...sec(55.2, 77.5, fps)}><Scene>
        <AbsoluteFill style={{alignItems: 'flex-start', justifyContent: 'center', paddingLeft: pad}}>
          <Label>VERSE 2</Label>
          <div style={{fontWeight: 900, fontSize: 190, lineHeight: 0.88, letterSpacing: '-0.04em', marginTop: 24}}>
            <Rise at={0.4}>MADE</Rise><Rise at={0.54}>FOR</Rise><Rise at={0.68}>STAND<span style={{color: C.lime}}>ING.</span></Rise>
          </div>
          <In at={1.6} style={{fontSize: 44, fontWeight: 700, marginTop: 40}}>서서 일하는 사람을 위해 만든 인솔</In>
          <In at={8} style={{fontSize: 30, color: C.sub, marginTop: 24, maxWidth: 1300, lineHeight: 1.5}}>형태와 신는 방식을 정형외과 전문의와 같이 봤어요.<br /><span style={{fontSize: 24}}>정형외과 전문의 이문홍 원장은 ㈜알앤디메이커스의 제품 설계 자문에 참여하고 자문료를 받았습니다.</span></In>
        </AbsoluteFill>
      </Scene></Sequence>

      {/* 77.5~106.5 후렴 2: 컬러·사이즈 */}
      <Sequence {...sec(77.5, 106.5, fps)}><Scene>
        <Ken src="insole-model-hold.jpg" style={{position: 'absolute', left: pad, top: 200, width: 900, height: 675}} from={1.02} to={1.12} />
        <div style={{position: 'absolute', left: 1100, right: pad, top: 260}}>
          <Rise at={0.3} style={{fontSize: 84, fontWeight: 900, lineHeight: 1.15}}>바닥이</Rise>
          <Rise at={0.5} style={{fontSize: 84, fontWeight: 900, lineHeight: 1.15, color: C.lime}}>달라지면</Rise>
          <In at={1.4} style={{marginTop: 44, display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '18px 32px', fontSize: 36}}>
            <span style={{color: C.sub}}>컬러</span><b>그레이 · 모카무스</b>
            <span style={{color: C.sub}}>길이</span><b>M 15cm · L 17cm</b>
            <span style={{color: C.sub}}>쓰는 곳</span><b>쓰던 깔창 밑</b>
          </In>
        </div>
      </Scene></Sequence>

      {/* 106.5~133.5 와디즈 알림 QR */}
      <Sequence {...sec(106.5, 133.5, fps)}><Scene>
        <Ken src="insole-pack-mocha.jpg" style={{position: 'absolute', left: pad, top: 200, width: 900, height: 675}} />
        <div style={{position: 'absolute', left: 1100, right: pad, top: 230}}>
          <Label>WADIZ · 11.26 펀딩 오픈</Label>
          <Rise at={0.3} style={{fontSize: 80, fontWeight: 900, lineHeight: 1.15, marginTop: 16}}>와디즈에서</Rise>
          <Rise at={0.5} style={{fontSize: 80, fontWeight: 900, lineHeight: 1.15, color: C.lime}}>만나요</Rise>
          <In at={1.2} style={{display: 'flex', alignItems: 'center', gap: 32, marginTop: 40}}>
            <div style={{background: C.text, padding: 14, borderRadius: 20}}><Img src={staticFile('qr-landing-kintex.png')} style={{width: 240, height: 240, display: 'block'}} /></div>
            <div style={{fontSize: 34, fontWeight: 700, lineHeight: 1.5}}>오픈 알림 신청<br /><span style={{color: C.sub, fontSize: 28, fontWeight: 500}}>무료 · 결제 없음<br />부스 이벤트 선물도 함께</span></div>
          </In>
        </div>
      </Scene></Sequence>

      {/* 133.5~150 아웃트로 */}
      <Sequence {...sec(133.5, 150, fps)}><Scene><AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 36}}>
        <Rise at={0.3} style={{fontSize: 76, fontWeight: 800}}>일할 때도, 퇴근할 때도,</Rise>
        <Rise at={0.6} style={{fontSize: 140, fontWeight: 900, letterSpacing: '-0.03em'}}>발밑엔 <span style={{color: C.lime}}>라라슈</span></Rise>
        <In at={1.6}><Dots size={40} at={1.6} /></In>
        <In at={2.4} style={{display: 'flex', alignItems: 'center', gap: 28, marginTop: 10}}>
          <div style={{background: C.text, padding: 12, borderRadius: 18}}><Img src={staticFile('qr-landing-kintex.png')} style={{width: 170, height: 170, display: 'block'}} /></div>
          <div style={{fontSize: 32, fontWeight: 700}}>와디즈 오픈 알림 · go.rharashoe.com</div>
        </In>
      </AbsoluteFill></Scene></Sequence>
    </AbsoluteFill>
  );
};

const Clock: React.FC = () => {
  const {t} = useLocal(); const m = interpolate(t, [0, 9.7], [-20, 20], cl);
  return <svg viewBox="-100 -100 200 200" style={{width: 520, height: 520}}>
    {[...Array(12)].map((_, i) => <line key={i} x1="0" y1="-86" x2="0" y2="-76" stroke={C.sub} strokeWidth="3" transform={`rotate(${i * 30})`} />)}
    <line x1="0" y1="0" x2="0" y2="-44" stroke={C.text} strokeWidth="7" strokeLinecap="round" transform={`rotate(${120 + m / 12})`} />
    <line x1="0" y1="0" x2="0" y2="-70" stroke={C.lime} strokeWidth="5" strokeLinecap="round" transform={`rotate(${m * 6})`} />
    <circle r="6" fill={C.lime} />
    <text y="40" textAnchor="middle" fontSize="18" fontWeight="800" fill={C.text} fontFamily="Noto Sans CJK KR">PM 4:00</text>
  </svg>;
};
