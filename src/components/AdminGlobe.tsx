"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
// Next.js 환경에서 서버/클라이언트 렌더링 충돌을 막기 위해 dynamic import를 사용합니다 (핵심!)
import dynamic from 'next/dynamic';

// react-globe.gl을 클라이언트에서만 렌더링하도록 강제 설정
const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

const attackerPoints = [
  { lat: 55.75, lng: 37.61, name: 'RU (Russia)', color: '#FF0055' },
  { lat: 39.90, lng: 116.40, name: 'CN (China)', color: '#FF0055' },
  { lat: 40.71, lng: -74.00, name: 'US (New York)', color: '#FF0055' },
  { lat: -23.55, lng: -46.63, name: 'BR (São Paulo)', color: '#FF0055' },
  { lat: 52.36, lng: 4.89, name: 'NL (Amsterdam)', color: '#FF0055' },
];

const seoulPoint = { lat: 37.24, lng: 127.07, name: 'EDGE SECURITY (KR)', color: '#C273FF' };

export default function AdminGlobe({ lastViewTime = 0 }: { lastViewTime?: number }) {
  const globeRef = useRef<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  // 컴포넌트가 마운트된 후에만 렌더링 시작
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const arcsData = useMemo(() => {
    return attackerPoints.map(point => ({
      startLat: point.lat,
      startLng: point.lng,
      endLat: seoulPoint.lat,
      endLng: seoulPoint.lng,
      color: ['rgba(255, 0, 85, 0.1)', 'rgba(194, 115, 255, 0.9)'],
      name: `${point.name} ➡️ ${seoulPoint.name}`
    }));
  }, []);

  const [ringsData, setRingsData] = useState<any[]>([]);

  useEffect(() => {
    if (lastViewTime > 0) {
      setRingsData([{ lat: seoulPoint.lat, lng: seoulPoint.lng, color: seoulPoint.color }]);
      const timer = setTimeout(() => {
        setRingsData([]);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [lastViewTime]);

  if (!isMounted) return <div className="w-full h-[400px] bg-black/20 rounded-2xl animate-pulse" />;

  return (
    <div className="w-full h-full min-h-[320px] relative flex items-center justify-center overflow-hidden">
      
      {/* 백그라운드 보라색 빛 반사 오라 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#C273FF]/15 blur-[80px] rounded-full pointer-events-none z-0"/>
      
      {/* 💡 에러의 주범이었던 주석들을 속성 리스트 밖으로 전부 빼냈습니다! */}
      <Globe
        ref={globeRef}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundColor="rgba(0,0,0,0)"
        width={600}
        height={380}
        atmosphereColor="#C273FF"
        atmosphereAltitude={0.15}
        pointsData={[...attackerPoints, seoulPoint]}
        pointColor={(d: any) => d.color}
        pointAltitude={0.02}
        pointRadius={0.3}
        pointsMerge={false}
        pointLabel={(d: any) => d.name}
        arcsData={arcsData}
        arcColor={(d: any) => d.color}
        arcAltitude={0.15}
        arcStroke={0.5}
        arcCurveResolution={64}
        arcDashLength={0.9}
        arcDashGap={4}
        arcDashAnimateTime={2000}
        ringsData={ringsData}
        ringColor={(d: any) => d.color}
        ringAltitude={0.025}
        ringMaxRadius={8}
        ringPropagationSpeed={3}
        // ringRepeat={2}
      />
    </div>
  );
}