import Link from "next/link";
import EmailCopyButton from "./EmailCopyButton";

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-white/5 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-12 mb-12">
          
          {/* 로고 및 정보 (PC에서 2칸 차지) */}
          <div className="col-span-1 sm:col-span-2 md:col-span-2">
            <h2 className="text-white text-xl font-bold tracking-tighter mb-6">
              EDGE SECURITY
            </h2>
            <div className="space-y-2 text-sm text-zinc-500">
              <p>경기도 화성시 동탄첨단산업2로 43, 동탄 G타워 503호</p>
              <p>대표전화: 031-376-2252</p>
              <EmailCopyButton />
            </div>
          </div>

          {/* 카테고리 1: Company (회사 관련) */}
          <div>
            <h3 className="text-white text-sm font-bold mb-6 uppercase tracking-wider">Company</h3>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li><Link href="/about" className="hover:text-white transition-colors">소개</Link></li>
              <li><Link href="/security-news" className="hover:text-white transition-colors">보안 뉴스</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">문의하기</Link></li>
            </ul>
          </div>

          {/* 카테고리 2: Services (서비스 및 진단) */}
          <div>
            <h3 className="text-white text-sm font-bold mb-6 uppercase tracking-wider">Services</h3>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li><Link href="/projects" className="hover:text-white transition-colors">프로젝트</Link></li>
              <li><Link href="/sandbox" className="hover:text-white transition-colors">AI 샌드박스</Link></li>
              <li><Link href="/self-audit" className="hover:text-white transition-colors">보안 진단</Link></li>
            </ul>
          </div>

          {/* 소셜 링크 */}
          <div>
            <h3 className="text-white text-sm font-bold mb-6 uppercase tracking-wider">Social</h3>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li><a href="https://blog.naver.com/edgesecurity" target="_blank" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="https://www.instagram.com/p/DROx4nZE8SY/" target="_blank" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="https://www.youtube.com/@edge.security" target="_blank" className="hover:text-white transition-colors">YouTube</a></li>
            </ul>
          </div>
        </div>

        {/* 하단 저작권 표시 & 시스템 상태 & 약관 링크 (레이아웃 수정됨) */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-zinc-600">
          
          {/* 좌측: 저작권 텍스트 + 라이브 상태 펄스 그룹화 */}
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p>© 2026 EDGE SECURITY. All rights reserved.</p>
            
            {/* 🟢 라이브 상태 펄스 */}
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-400 text-[10px] font-bold tracking-widest uppercase">
                All Systems Online
              </span>
            </div>
          </div>

          {/* 우측: 약관 링크 */}
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">개인정보처리방침</Link>
            <Link href="/terms" className="hover:text-white transition-colors">이용약관</Link>
          </div>

        </div>
      </div>
    </footer>
  );
}