"use client";

import { ReactLenis } from '@studio-freight/react-lenis';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.08, duration: 1.5, smoothWheel: true }}>
      {/* 💡 React 19와의 타입 충돌을 우회하기 위해 as any 를 덧붙여줍니다. */}
      {children as any}
    </ReactLenis>
  );
}