// app/security-news/edit/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AdminGuard from "@/components/AdminGuard";
import Link from "next/link";

export default function SecurityNewsEditPage() {
  const router = useRouter();
  const params = useParams(); // 클라이언트 컴포넌트에서 params를 가져오는 최신 방식
  const newsId = params.id as string;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [level, setLevel] = useState("Info");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 1. 기존 데이터 불러오기
  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase
        .from("security_alerts")
        .select("*")
        .eq("id", newsId)
        .single();

      if (data) {
        setTitle(data.title);
        setContent(data.content);
        setLevel(data.level);
      } else {
        alert("데이터를 불러오지 못했습니다.");
        router.push("/security-news");
      }
      setIsLoading(false);
    };
    fetchNews();
  }, [newsId, router]);

  // 2. 수정 데이터 저장 로직 (.update 사용)
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return alert("제목과 내용을 모두 입력해주세요.");

    setIsSubmitting(true);

    const { error } = await supabase
      .from("security_alerts")
      .update({ title, content, level }) // 💡 insert가 아닌 update
      .eq("id", newsId); // 💡 누구를 수정할지 id 지정

    if (error) {
      alert(`수정 실패: ${error.message}`);
      setIsSubmitting(false);
    } else {
      router.push(`/security-news/${newsId}`); // 완료 후 상세 페이지로 복귀
      router.refresh();
    }
  };

  if (isLoading) return <div className="min-h-screen bg-black pt-32 text-center text-zinc-500">데이터 불러오는 중...</div>;

  return (
    <AdminGuard>
      <main className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          
          <div className="mb-10 border-b border-zinc-800 pb-6">
            <h1 className="text-3xl font-bold tracking-tight mb-2">보안 공지 수정</h1>
            <p className="text-zinc-400">등록된 공지사항의 내용을 수정합니다.</p>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6 bg-zinc-900/50 p-8 rounded-xl border border-zinc-800">
            {/* 위협 등급 선택 */}
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">위협 등급 (Level)</label>
              <div className="flex gap-3">
                {['Info', 'Warning', 'Critical'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setLevel(lvl)}
                    className={`flex-1 py-3 rounded-lg text-sm font-semibold transition border ${
                      level === lvl
                        ? lvl === 'Critical' ? 'bg-red-500/20 text-red-400 border-red-500/50'
                        : lvl === 'Warning' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                        : 'bg-blue-500/20 text-blue-400 border-blue-500/50'
                        : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:bg-zinc-800'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* 제목 입력 */}
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">공지 제목</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C273FF] transition"
                required
              />
            </div>

            {/* 내용 입력 */}
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">상세 내용</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C273FF] transition resize-none"
                required
              />
            </div>

            {/* 액션 버튼 */}
            <div className="flex gap-4 pt-4 border-t border-zinc-800">
              <Link href={`/security-news/${newsId}`} className="flex-1 text-center py-3 rounded-lg bg-zinc-800 text-zinc-300 font-medium hover:bg-zinc-700 transition">
                취소
              </Link>
              <button type="submit" disabled={isSubmitting} className="flex-1 py-3 rounded-lg bg-[#C273FF] text-black font-bold hover:bg-[#a855f7] transition disabled:opacity-50">
                {isSubmitting ? "수정 중..." : "수정 완료하기"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </AdminGuard>
  );
}