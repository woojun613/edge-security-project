import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdminActionButtons from "@/components/AdminActionButtons";
import CommentSection from "@/components/CommentSection";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function SecurityNewsDetailPage({ params }: { params: Promise<{ id: string }> }) {

  const resolvedParams = await params;
  const newsId = resolvedParams.id;

  const { data: news, error } = await supabase
    .from("security_alerts")
    .select("*")
    .eq("id", newsId)
    .single();

  if (error || !news) {
    console.log("DB 에러 원인:", error);
    return <div className="min-h-screen bg-black text-zinc-500 flex items-center justify-center">데이터를 불러오지 못했습니다.</div>;
  }

  return (
    <main className="min-h-screen bg-black text-white pt-24 md:pt-32 pb-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto bg-zinc-900/30 border border-zinc-800 rounded-xl p-5 sm:p-8 md:p-12">
        
        {/* 상단: 뒤로가기 버튼 (모바일 마진 축소) */}
        <Link 
          href="/security-news" 
          className="inline-flex items-center text-sm text-zinc-400 hover:text-[#C273FF] transition mb-6 md:mb-8"
        >
          ← 목록으로 돌아가기
        </Link>

        {/* 헤더: 뱃지 및 날짜 (모바일에서는 글씨 크기나 간격 조정) */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 md:mb-6">
          <span className={`px-2.5 py-0.5 md:px-3 md:py-1 text-xs md:text-sm font-semibold rounded ${
            news.level === 'Critical' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
            news.level === 'Warning' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 
            'bg-blue-500/10 text-blue-400 border border-blue-500/20'
          }`}>
            {news.level || 'Info'}
          </span>
          <span className="text-xs md:text-sm text-zinc-500">
            {new Date(news.created_at).toLocaleDateString('ko-KR', {
              year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
            })}
          </span>
        </div>

        {/* 제목: 모바일에서는 2xl, 데스크톱에서는 4xl까지 유연하게 확장 */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-zinc-100 mb-6 pb-6 md:mb-10 md:pb-10 border-b border-zinc-800 leading-snug">
          {news.title}
        </h1>

        {/* 본문 내용: 모바일 16px(text-base), 데스크톱 18px(md:text-lg)로 가독성 극대화 */}
        <div className="text-zinc-300 leading-relaxed text-base md:text-lg whitespace-pre-wrap">
          {news.content}
        </div>

        <AdminActionButtons newsId={newsId} />
        <CommentSection newsId={newsId} />

      </div>
    </main>
  );
}