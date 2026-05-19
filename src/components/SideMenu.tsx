"use client";

export default function SideMenu() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <aside className="fixed right-8 top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-5">
      {/* 블로그 아이콘 */}
      <SideItem href="https://blog.naver.com/edgesecurity" label="Blog" icon="B" />
      <SideItem href="https://www.instagram.com/p/DROx4nZE8SY/" label="Insta" icon="I" />
      <SideItem href="https://www.youtube.com/@edge.security" label="Youtube" icon="Y" />
      
      {/* TOP 버튼: 디자인 복구 */}
      <button
        onClick={scrollToTop}
        className="cursor-pointer group relative flex items-center justify-center w-12 h-12 bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-full hover:bg-white hover:text-black transition-all duration-500 shadow-2xl active:scale-90"
      >
        <span className="text-[10px] font-bold tracking-tighter">TOP</span>
        <span className="absolute right-16 px-3 py-1.5 bg-white text-black text-[10px] font-bold rounded-sm opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap translate-x-2 group-hover:translate-x-0">
          BACK TO TOP
        </span>
      </button>
    </aside>
  );
}

function SideItem({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="group relative flex items-center justify-center w-12 h-12 bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-full hover:border-[#C273FF]/50 transition-all duration-500"
    >
      <span className="text-zinc-400 text-sm font-bold group-hover:text-white transition-colors">
        {icon}
      </span>
      <span className="absolute right-16 px-3 py-1.5 bg-zinc-900 text-white text-[10px] font-bold rounded-sm opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap translate-x-2 group-hover:translate-x-0 border border-white/10">
        {label}
      </span>
    </a>
  );
}