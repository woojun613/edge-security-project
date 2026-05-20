"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import * as THREE from "three";

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
            className="text-zinc-500 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed"
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

    </main>
  );
}