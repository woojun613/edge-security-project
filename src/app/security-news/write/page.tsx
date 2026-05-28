// app/security-news/write/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AdminGuard from "@/components/AdminGuard";
import Link from "next/link";

export default function SecurityNewsWritePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [level, setLevel] = useState("Info");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase
      .from("security_alerts")
      .insert([{ title, content, level }]); // DB에 데이터 삽입

    if (error) {
      alert(`등록 실패: ${error.message}`);
      setIsSubmitting(false);
    } else {
      // 💡 성공 시 뉴스 목록으로 이동 후 새로고침 (최신 데이터 반영)
      router.push("/security-news");
      router.refresh(); 
    }
  };

  return (
    // 💡 URL을 직접 치고 들어오는 악성 유저를 막기 위해 전체를 AdminGuard로 감쌉니다.
    <AdminGuard>
      <main className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          
          {/* 헤더 영역 */}
          <div className="mb-10 border-b border-zinc-800 pb-6">
            <h1 className="text-3xl font-bold tracking-tight mb-2">보안 공지 작성</h1>
            <p className="text-zinc-400">새로운 보안 위협이나 권고안을 등록합니다.</p>
          </div>

          {/* 작성 폼 영역 */}
          <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900/50 p-8 rounded-xl border border-zinc-800">
            
            {/* 1. 위협 등급 선택 */}
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                위협 등급 (Level)
              </label>
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

            {/* 2. 제목 입력 */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-zinc-400 mb-2">
                공지 제목
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: [긴급] 특정 라이브러리 제로데이 취약점 안내"
                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#C273FF] focus:ring-1 focus:ring-[#C273FF] transition"
                required
              />
            </div>

            {/* 3. 내용 입력 */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-zinc-400 mb-2">
                상세 내용
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="취약점 상세 내용 및 대응 방안을 작성해주세요."
                rows={10}
                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#C273FF] focus:ring-1 focus:ring-[#C273FF] transition resize-none"
                required
              />
            </div>

            {/* 4. 액션 버튼 (취소 / 등록) */}
            <div className="flex gap-4 pt-4 border-t border-zinc-800">
              <Link 
                href="/security-news"
                className="flex-1 text-center py-3 rounded-lg bg-zinc-800 text-zinc-300 font-medium hover:bg-zinc-700 transition"
              >
                취소
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-lg bg-[#C273FF] text-black font-bold hover:bg-[#a855f7] transition disabled:opacity-50"
              >
                {isSubmitting ? "등록 중..." : "공지 등록하기"}
              </button>
            </div>

          </form>
        </div>
      </main>
    </AdminGuard>
  );
}