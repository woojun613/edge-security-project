import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-white/5 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* 로고 및 정보 */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-white text-xl font-bold tracking-tighter mb-6">
              EDGE SECURITY
            </h2>
            <div className="space-y-2 text-sm text-zinc-500">
              <p>경기도 화성시 동탄첨단산업2로 43, 동탄 G타워 503호</p>
              <p>대표전화: 031-376-2252</p>
              <p>이메일: edgesec@edgesec.co.kr</p>
            </div>
          </div>

          {/* 메뉴 링크 */}
          <div>
            <h3 className="text-white text-sm font-bold mb-6 uppercase tracking-wider">Menu</h3>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li><Link href="/about" className="hover:text-white transition-colors">소개</Link></li>
              <li><Link href="/projects" className="hover:text-white transition-colors">프로젝트</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">문의하기</Link></li>
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

        {/* 하단 저작권 표시 */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-600">
          <p>© 2026 EDGE SECURITY. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">개인정보처리방침</Link>
            <Link href="/terms" className="hover:text-white transition-colors">이용약관</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}