// app/security-news/page.tsx
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import AdminGuard from "@/components/AdminGuard";
import SearchFilterBar from "@/components/SearchFilterBar";
import Pagination from "@/components/Pagination"; // 💡 페이지네이션 컴포넌트 추가

export const revalidate = 60; 

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function SecurityNewsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const resolvedParams = await searchParams;
  const q = typeof resolvedParams.q === 'string' ? resolvedParams.q : '';
  const sort = typeof resolvedParams.sort === 'string' ? resolvedParams.sort : 'latest';
  
  // 현재 페이지 번호 가져오기 (기본값 1)
  const level = typeof resolvedParams.level === 'string' ? resolvedParams.level : 'all';
  const currentPage = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page, 10) : 1;
  const ITEMS_PER_PAGE = 10; // 한 페이지당 10개씩

  // 데이터 가져올 범위(Range) 계산 (예: 1페이지는 0~9, 2페이지는 10~19)
  const from = (currentPage - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  // Supabase 쿼리 생성 (게시글 수 count 속성 추가)
  let query = supabase
    .from("security_alerts")
    .select("*", { count: "exact" }); // 데이터와 함께 전체 개수(count)를 가져옴

  // 선택된 위협 등급(level)이 'all'이 아니면 해당 등급만 필터링하도록 추가
  if (level !== 'all') {
    query = query.eq('level', level);
  }

  if (q) {
    query = query.or(`title.ilike.%${q}%,content.ilike.%${q}%`);
  }

  if (sort === "oldest") {
    query = query.order("created_at", { ascending: true });
  } else if (sort === "title") {
    query = query.order("title", { ascending: true });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  // 페이징 처리 적용 (10개씩 끊어오기)
  query = query.range(from, to);

  // 최종 데이터 및 전체 카운트 가져오기
  const { data: newsList, count } = await query;
  
  // 총 페이지 수 계산
  const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 0;

  return (
    // 모바일 좌우 여백 최적화 (px-6 -> px-4 sm:px-6)
    <main className="min-h-screen bg-black text-white pt-32 pb-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* 상단 헤더 영역 (모바일에서 버튼 글씨 줄바꿈 방지) */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 sm:mb-12 border-b border-zinc-800 pb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">보안 뉴스</h1>
            <p className="text-sm sm:text-base text-zinc-400">최신 보안 동향 및 엣지시큐리티의 보안 권고안을 확인하세요.</p>
          </div>

          <AdminGuard>
            <Link 
              href="/security-news/write" 
              className="bg-[#C273FF]/10 text-[#C273FF] border border-[#C273FF]/20 px-4 py-2 rounded hover:bg-[#C273FF]/20 transition whitespace-nowrap text-sm sm:text-base"
            >
              공지 등록하기
            </Link>
          </AdminGuard>
        </div>

        <SearchFilterBar />

        <div className="grid gap-4">
          {!newsList || newsList.length === 0 ? (
            <div className="text-center py-20 text-zinc-500 bg-zinc-900/30 rounded-lg border border-zinc-800">
              {q ? `'${q}'에 대한 검색 결과가 없습니다.` : "아직 등록된 보안 뉴스가 없습니다."}
            </div>
          ) : (
            newsList.map((news) => (
              <Link 
                href={`/security-news/${news.id}`} 
                key={news.id} 
                className="block p-5 sm:p-6 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-[#C273FF]/30 transition group cursor-pointer"
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-3">
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${
                    news.level === 'Critical' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                    news.level === 'Warning' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 
                    'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  }`}>
                    {news.level || 'Info'}
                  </span>
                  <span className="text-xs sm:text-sm text-zinc-500">
                    {new Date(news.created_at).toLocaleDateString('ko-KR')}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-medium text-zinc-200 group-hover:text-white transition mb-2">
                  {news.title}
                </h2>
                <p className="text-sm sm:text-base text-zinc-400 line-clamp-2">
                  {news.content}
                </p>
              </Link>
            ))
          )}
        </div>

        {/* 페이지네이션 컴포넌트 렌더링 */}
        <Pagination totalPages={totalPages} currentPage={currentPage} />

      </div>
    </main>
  );
}