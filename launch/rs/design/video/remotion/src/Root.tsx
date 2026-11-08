import React from 'react';
import {Composition} from 'remotion';
import {RingsReveal} from './RingsReveal';
import {TV} from './TV';
// 라라슈 링 4개 → 밑창 전환 12초 (24fps)
export const Root: React.FC = () => (
  <>
    <Composition id="Reel" component={RingsReveal} durationInFrames={288} fps={24} width={1080} height={1920} defaultProps={{format: 'reel' as const}} />
    <Composition id="Feed" component={RingsReveal} durationInFrames={288} fps={24} width={1080} height={1350} defaultProps={{format: 'feed' as const}} />
    <Composition id="TV" component={TV} durationInFrames={480} fps={24} width={1920} height={1080} />
  </>
);
