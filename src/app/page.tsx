"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import PasswordAnalyzer from '@/components/PasswordAnalyzer';

export default function Home() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    
    // --- 1. 씬, 카메라, 렌더러 세팅 ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 고해상도 모니터 최적화
    container.appendChild(renderer.domElement);

    // --- 2. 파티클 생성 로직 ---
    const particleCount = 1500;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const colorTool = new THREE.Color();
    const RADIUS = 2.3;

    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = RADIUS * Math.pow(Math.random(), 1 / 3);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const isGold = Math.random() < 0.2;
      colorTool.set(isGold ? "#4144F3" : "#65A7FF");
      colors[i * 3] = colorTool.r;
      colors[i * 3 + 1] = colorTool.g;
      colors[i * 3 + 2] = colorTool.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.02, 
      vertexColors: true, 
      transparent: true, 
      blending: THREE.AdditiveBlending, 
      depthWrite: false
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // --- 3. 마우스/터치 인터랙션 ---
    let mouseX = 0, mouseY = 0;

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('mousemove', handleMouseMove);

    // --- 4. 반응형 리사이즈 ---
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // --- 5. 애니메이션 루프 ---
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      points.rotation.y += (mouseX * 0.3 - points.rotation.y) * 0.05;
      points.rotation.x += (-mouseY * 0.3 - points.rotation.x) * 0.05;
      points.rotation.z += 0.001;

      const posArray = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3] += (Math.random() - 0.5) * 0.002;
        posArray[i * 3 + 1] += (Math.random() - 0.5) * 0.002;
        posArray[i * 3 + 2] += (Math.random() - 0.5) * 0.002;
        const dist = Math.sqrt(posArray[i * 3] ** 2 + posArray[i * 3 + 1] ** 2 + posArray[i * 3 + 2] ** 2);
        if (dist > RADIUS) {
          posArray[i * 3] *= 0.99; 
          posArray[i * 3 + 1] *= 0.99; 
          posArray[i * 3 + 2] *= 0.99;
        }
      }
      geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    // --- 6. 클린업 (메모리 누수 방지) ---
    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  const projectList = [
    { id: 1, title: "웹 취약점 진단 가이드", subtitle: "Web Security Audit", link: "/projects/web-security" },
    { id: 2, title: "제로트러스트 아키텍처", subtitle: "Zero-Trust Design", link: "/projects/zero-trust" },
    { id: 3, title: "인공지능 보안 가이드북", subtitle: "AI Security Guide", link: "/projects/ai-security" },
    { id: 4, title: "개인 정보보호 컨설팅", subtitle: "Privacy Consulting", link: "/projects/privacy-consulting" },
  ];

  return (
    <main className="bg-black text-white selection:bg-[#C273FF]/30">
      
      {/* 1. 히어로 섹션 */}
      <section className="h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
        
        {/* Three.js 캔버스 */}
        <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none opacity-80" />
        
        {/* 기존 배경 조명 효과 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#484AF7]/10 blur-[120px] rounded-full pointer-events-none z-0" />
        
        {/* z-10을 주어 3D 배경 위로 글씨가 선명하게 올라오도록 설정 */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 text-center pointer-events-none"
        >
          {/* 서브 타이틀 */}
          <motion.p 
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={{ opacity: 1, letterSpacing: "0.4em" }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="text-[#C273FF] text-xs md:text-sm font-medium mb-6 uppercase"
          >
            Technology to People
          </motion.p>

          {/* 메인 타이틀 */}
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black leading-[1.1] tracking-tighter mb-8 text-white pointer-events-auto">
            우리는 <br />
            <span className="bg-gradient-to-r from-[#C273FF] via-[#484AF7] to-[#C273FF] bg-clip-text text-transparent">
              문제를 해결합니다
            </span>
          </h1>

          {/* 설명 문구 */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-zinc-300 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed"
          >
            엣지시큐리티는 단순한 기술을 넘어 <br className="hidden md:block" />
            사람을 향한 보안 솔루션을 설계하고 구축합니다.
          </motion.p>
        </motion.div>

        {/* 스크롤 유도 아이콘 */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] tracking-[0.2em] text-zinc-600 uppercase">Scroll</span>
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-[1px] h-12 bg-gradient-to-b from-white/0 via-white/50 to-white/0" 
            />
          </div>
        </motion.div>
      </section>

      {/* 2. 프로젝트 미리보기 섹션 */}
      <section className="py-32 px-6 max-w-7xl mx-auto relative z-20 bg-black">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">Selected Projects</h2>
          <div className="w-12 h-[2px] bg-[#C273FF]" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {projectList.map((project) => (
            <Link 
              href={project.link}
              key={project.id}
              className="block"
            >
              <motion.div  
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: project.id * 0.1 }}
                whileHover={{ y: -10 }} 
                className="relative h-[500px] bg-zinc-900/30 border border-white/5 rounded-2xl overflow-hidden group cursor-pointer"
              >
                <Image 
                  src={`/images/main/sub-hero-bg${project.id}.png`} 
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-10">
                  <p className="text-[#C273FF] text-xs font-bold mb-2 tracking-[0.2em] translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {project.subtitle}
                  </p>
                  <h3 className="text-2xl font-bold text-white group-hover:text-[#C273FF] transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    {project.title}
                  </h3>
                  
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center gap-2 text-xs text-zinc-400">
                    <span>VIEW PROJECT</span>
                    <div className="w-4 h-[1px] bg-zinc-400" />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. 핵심 역량 & 인사이트 (Bento Box 섹션) */}
      <section className="py-32 px-6 max-w-7xl mx-auto relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Core Expertise</h2>
          <p className="text-zinc-500">끊임없는 연구와 출판으로 검증된 보안 전문성</p>
        </motion.div>

        {/* 벤토 박스 그리드 */}
        {/* grid 클래스를 아래처럼 수정 (모바일 높이 자동 설정) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto md:auto-rows-[250px]">
          
          {/* 큰 박스 1: 출판 및 저서 하이라이트 (2칸 차지) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2 bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-3xl p-8 relative overflow-hidden group min-h-[300px] md:min-h-0" // md:min-h-0으로 PC에선 그리드 높이 따름
          >
            {/* 배경 조명 효과 */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C273FF]/10 blur-[80px] rounded-full group-hover:bg-[#C273FF]/20 transition-colors duration-700" />
            
            {/* 글씨 영역: 이제 다른 요소와 겹치지 않고 본분에 충실합니다. */}
            <div className="relative z-10 max-w-lg md:max-w-md">
              <span className="px-3 py-1 bg-white/10 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">Publications</span>
              <h3 className="text-2xl font-bold mt-4 mb-2">전문 지식의 깊이,<br/>저서로 증명합니다</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">다년간의 실무 경험을 바탕으로 집필된 전문 서적과 최신 AI 보안 가이드북을 통해 업계의 표준을 제시합니다.</p>
            </div>

            {/* 저서 아이콘 영역: 오른쪽 하단 구석으로 이동 & 평소엔 숨김 처리 */}
            <div className="absolute -bottom-6 right-10 flex gap-2 rotate-[10deg] group-hover:rotate-0 transition-transform duration-500 origin-bottom-right group-hover:bottom-0">
              {/* 책 표지 느낌의 플레이스홀더 */}
              <div className="w-16 h-24 bg-zinc-800 rounded shadow-lg border border-white/5 -rotate-6 transform group-hover:-translate-y-8 transition-transform duration-700"></div>
              <div className="w-16 h-24 bg-zinc-700 rounded shadow-lg border border-white/5 z-10 group-hover:-translate-y-12 transition-transform duration-700 delay-75"></div>
              <div className="w-16 h-24 bg-zinc-800 rounded shadow-lg border border-white/5 rotate-6 transform group-hover:-translate-y-8 transition-transform duration-700 delay-150"></div>
            </div>
          </motion.div>

          {/* 작은 박스 1: 제로트러스트 - 수정본 */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="group bg-zinc-900/80 backdrop-blur-lg border border-white/5 rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative transition-all duration-300 hover:border-[#484AF7]/30 hover:shadow-[0_0_30px_rgba(72,74,247,0.15)]" // backdrop-blur, hover 효과 추가
          >
            {/* 배경 효과: 마우스 올렸을 때 나타나는 몽환적인 그라데이션 조명 */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0 bg-[radial-gradient(circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(72,74,247,0.15),transparent_60%)]" />
            
            {/* z-10을 주어 조명 위로 올림 */}
            <div className="relative z-10 w-10 h-10 rounded-full bg-[#484AF7]/10 border border-[#484AF7]/20 flex items-center justify-center text-[#484AF7]">🛡️</div>
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-1 group-hover:text-white transition-colors">Zero-Trust</h3>
              <p className="text-zinc-500 text-xs group-hover:text-zinc-300 transition-colors">아무것도 신뢰하지 않는 완벽한 통제 환경 구축</p>
            </div>
          </motion.div>

          {/* 작은 박스 2: AI 모의해킹 - 수정본 (색상만 다름) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="group bg-zinc-900/80 backdrop-blur-lg border border-white/5 rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative transition-all duration-300 hover:border-[#C273FF]/30 hover:shadow-[0_0_30px_rgba(194,115,255,0.15)]"
          >
            {/* 보라색 그라데이션 */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0 bg-[radial-gradient(circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(194,115,255,0.15),transparent_60%)]" />

            <div className="relative z-10 w-10 h-10 rounded-full bg-[#C273FF]/20 flex items-center justify-center text-[#C273FF]">🤖</div>
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-1 group-hover:text-white transition-colors">AI Security</h3>
              <p className="text-zinc-500 text-xs group-hover:text-zinc-300 transition-colors">자율형 AI 에이전트 및 프롬프트 인젝션 방어</p>
            </div>
          </motion.div>

          {/* 가로로 긴 박스: 웹 취약점 진단 - 스캔 효과 적용 */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-2 group relative overflow-hidden bg-zinc-900/80 backdrop-blur-lg border border-white/5 rounded-3xl p-10 flex flex-col justify-center items-center text-center transition-all duration-500 hover:border-[#484AF7]/40 hover:shadow-[0_0_40px_rgba(72,74,247,0.1)]"
          >
            {/* 보안 스캔 격자 무늬 배경 (평소엔 희미하다가 마우스 올리면 선명해짐) */}
            <div 
              className="absolute inset-0 opacity-5 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none z-0" 
              style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)', backgroundSize: '24px 24px' }} 
            />

            {/* 아이콘과 텍스트 영역 */}
            <div className="relative z-10 w-14 h-14 mb-5 rounded-2xl bg-gradient-to-br from-[#484AF7]/20 to-[#C273FF]/20 border border-white/10 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
              <span className="text-2xl">🌐</span>
            </div>
            <h3 className="relative z-10 text-xl font-bold mb-3 group-hover:text-white transition-colors duration-300">
              Web Vulnerability Assessment
            </h3>
            <p className="relative z-10 text-zinc-400 text-sm max-w-md group-hover:text-zinc-300 transition-colors duration-300 leading-relaxed">
              최신 해킹 기법을 적용한 심층적인 웹 서비스 보안 진단 및 조치 가이드
            </p>
          </motion.div>

        </div>
      </section>

      {/* 4. 비밀번호 분석기 섹션 */}
      <PasswordAnalyzer />
    </main>
  );
}