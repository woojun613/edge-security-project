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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
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
      <section className="h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
        <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none opacity-80" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#484AF7]/10 blur-[80px] md:blur-[120px] rounded-full pointer-events-none z-0" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 text-center pointer-events-none w-full"
        >
          <motion.p 
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={{ opacity: 1, letterSpacing: "0.4em" }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="text-[#C273FF] text-[10px] md:text-sm font-medium mb-4 md:mb-6 uppercase"
          >
            Technology to People
          </motion.p>

          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black leading-[1.2] md:leading-[1.1] tracking-tighter mb-6 md:mb-8 text-white pointer-events-auto break-keep">
            우리는 <br />
            <span className="bg-gradient-to-r from-[#C273FF] via-[#484AF7] to-[#C273FF] bg-clip-text text-transparent">
              문제를 해결합니다
            </span>
          </h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-zinc-300 text-sm md:text-xl font-light max-w-2xl mx-auto leading-relaxed break-keep px-4"
          >
            엣지시큐리티는 단순한 기술을 넘어 <br className="hidden md:block" />
            사람을 향한 보안 솔루션을 설계하고 구축합니다.
          </motion.p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-[9px] md:text-[10px] tracking-[0.2em] text-zinc-600 uppercase">Scroll</span>
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-[1px] h-8 md:h-12 bg-gradient-to-b from-white/0 via-white/50 to-white/0" 
            />
          </div>
        </motion.div>
      </section>

      {/* 2. 프로젝트 미리보기 섹션 */}
      <section className="py-20 md:py-32 px-6 max-w-7xl mx-auto relative z-20 bg-black">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 md:mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Selected Projects</h2>
          <div className="w-8 md:w-12 h-[2px] bg-[#C273FF]" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
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
                className="relative h-[350px] md:h-[500px] bg-zinc-900/30 border border-white/5 rounded-2xl overflow-hidden group cursor-pointer"
              >
                <Image 
                  src={`/images/main/sub-hero-bg${project.id}.png`} 
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-6 md:p-10">
                  <p className="text-[#C273FF] text-[10px] md:text-xs font-bold mb-1 md:mb-2 tracking-[0.2em] translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {project.subtitle}
                  </p>
                  <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-[#C273FF] transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    {project.title}
                  </h3>
                  
                  <div className="mt-3 md:mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center gap-2 text-[10px] md:text-xs text-zinc-400">
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
      <section className="py-20 md:py-32 px-6 max-w-7xl mx-auto relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 md:mb-16 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Core Expertise</h2>
          <p className="text-zinc-500 text-sm md:text-base">끊임없는 연구와 출판으로 검증된 보안 전문성</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-auto md:auto-rows-[250px]">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2 bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 relative overflow-hidden group min-h-[280px] md:min-h-0" 
          >
            <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-[#C273FF]/10 blur-[80px] rounded-full group-hover:bg-[#C273FF]/20 transition-colors duration-700" />
            
            <div className="relative z-10 max-w-[85%] md:max-w-md">
              <span className="px-3 py-1 bg-white/10 text-white text-[9px] md:text-[10px] font-bold rounded-full uppercase tracking-wider">Publications</span>
              <h3 className="text-xl md:text-2xl font-bold mt-4 mb-2 break-keep">전문 지식의 깊이,<br/>저서로 증명합니다</h3>
              <p className="text-zinc-400 text-xs md:text-sm leading-relaxed break-keep">다년간의 실무 경험을 바탕으로 집필된 전문 서적과 최신 AI 보안 가이드북을 통해 업계의 표준을 제시합니다.</p>
            </div>

            <div className="absolute -bottom-4 md:-bottom-6 right-2 md:right-10 flex gap-1 md:gap-2 rotate-[10deg] group-hover:rotate-0 transition-transform duration-500 origin-bottom-right group-hover:bottom-0">
              <div className="w-12 h-16 md:w-16 md:h-24 bg-zinc-800 rounded shadow-lg border border-white/5 -rotate-6 transform group-hover:-translate-y-4 md:group-hover:-translate-y-8 transition-transform duration-700"></div>
              <div className="w-12 h-16 md:w-16 md:h-24 bg-zinc-700 rounded shadow-lg border border-white/5 z-10 group-hover:-translate-y-6 md:group-hover:-translate-y-12 transition-transform duration-700 delay-75"></div>
              <div className="w-12 h-16 md:w-16 md:h-24 bg-zinc-800 rounded shadow-lg border border-white/5 rotate-6 transform group-hover:-translate-y-4 md:group-hover:-translate-y-8 transition-transform duration-700 delay-150"></div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="group bg-zinc-900/80 backdrop-blur-lg border border-white/5 rounded-2xl md:rounded-3xl p-6 md:p-8 flex flex-col justify-between overflow-hidden relative transition-all duration-300 hover:border-[#484AF7]/30 hover:shadow-[0_0_30px_rgba(72,74,247,0.15)] min-h-[160px] md:min-h-0"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0 bg-[radial-gradient(circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(72,74,247,0.15),transparent_60%)]" />
            
            <div className="relative z-10 w-10 h-10 rounded-full bg-[#484AF7]/10 border border-[#484AF7]/20 flex items-center justify-center text-[#484AF7] text-sm md:text-base">🛡️</div>
            <div className="relative z-10 mt-4 md:mt-0">
              <h3 className="text-base md:text-lg font-bold mb-1 group-hover:text-white transition-colors">Zero-Trust</h3>
              <p className="text-zinc-500 text-[11px] md:text-xs group-hover:text-zinc-300 transition-colors">아무것도 신뢰하지 않는 완벽한 통제 환경 구축</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="group bg-zinc-900/80 backdrop-blur-lg border border-white/5 rounded-2xl md:rounded-3xl p-6 md:p-8 flex flex-col justify-between overflow-hidden relative transition-all duration-300 hover:border-[#C273FF]/30 hover:shadow-[0_0_30px_rgba(194,115,255,0.15)] min-h-[160px] md:min-h-0"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0 bg-[radial-gradient(circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(194,115,255,0.15),transparent_60%)]" />

            <div className="relative z-10 w-10 h-10 rounded-full bg-[#C273FF]/20 flex items-center justify-center text-[#C273FF] text-sm md:text-base">🤖</div>
            <div className="relative z-10 mt-4 md:mt-0">
              <h3 className="text-base md:text-lg font-bold mb-1 group-hover:text-white transition-colors">AI Security</h3>
              <p className="text-zinc-500 text-[11px] md:text-xs group-hover:text-zinc-300 transition-colors">자율형 AI 에이전트 및 프롬프트 인젝션 방어</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-2 group relative overflow-hidden bg-zinc-900/80 backdrop-blur-lg border border-white/5 rounded-2xl md:rounded-3xl p-8 md:p-10 flex flex-col justify-center items-center text-center transition-all duration-500 hover:border-[#484AF7]/40 hover:shadow-[0_0_40px_rgba(72,74,247,0.1)] min-h-[200px] md:min-h-0"
          >
            <div 
              className="absolute inset-0 opacity-5 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none z-0" 
              style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)', backgroundSize: '24px 24px' }} 
            />

            <div className="relative z-10 w-12 h-12 md:w-14 md:h-14 mb-4 md:mb-5 rounded-xl md:rounded-2xl bg-gradient-to-br from-[#484AF7]/20 to-[#C273FF]/20 border border-white/10 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
              <span className="text-xl md:text-2xl">🌐</span>
            </div>
            <h3 className="relative z-10 text-lg md:text-xl font-bold mb-2 md:mb-3 group-hover:text-white transition-colors duration-300">
              Web Vulnerability Assessment
            </h3>
            <p className="relative z-10 text-zinc-400 text-xs md:text-sm max-w-md group-hover:text-zinc-300 transition-colors duration-300 leading-relaxed break-keep">
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