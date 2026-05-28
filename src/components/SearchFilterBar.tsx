// src/components/SearchFilterBar.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL에서 현재 검색어와 정렬 상태를 읽어옵니다.
  const currentQ = searchParams.get("q") || "";
  const currentSort = searchParams.get("sort") || "latest";

  const [query, setQuery] = useState(currentQ);

  // 검색 버튼 클릭 또는 엔터 입력 시 URL 업데이트
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl(query, currentSort);
  };

  // 셀렉트 박스 변경 시 URL 업데이트
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    updateUrl(query, newSort);
  };

  // URL 쿼리 파라미터를 조작하는 함수
  const updateUrl = (q: string, sort: string) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (sort && sort !== "latest") params.set("sort", sort);
    
    // URL을 변경하면 Next.js가 알아서 서버 컴포넌트를 다시 렌더링합니다.
    router.push(`/security-news?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      {/* 🔍 검색 폼 */}
      <form onSubmit={handleSearch} className="flex-1 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="공지 제목 또는 내용 검색..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-[#C273FF] transition"
        />
        <button type="submit" className="bg-zinc-800 hover:bg-zinc-700 text-white px-5 py-2 rounded-lg transition border border-zinc-700 whitespace-nowrap">
          검색
        </button>
      </form>

      {/* 📊 정렬 셀렉트 박스 */}
      <select
        value={currentSort}
        onChange={handleSortChange}
        className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#C273FF] transition cursor-pointer min-w-[120px]"
      >
        <option value="latest">최신순</option>
        <option value="oldest">과거순</option>
        <option value="title">가나다순</option>
      </select>
    </div>
  );
}