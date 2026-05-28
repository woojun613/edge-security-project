// src/components/SearchFilterBar.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentQ = searchParams.get("q") || "";
  const currentSort = searchParams.get("sort") || "latest";
  // 💡 URL에서 현재 선택된 등급(level) 상태를 읽어옵니다. (기본값: all)
  const currentLevel = searchParams.get("level") || "all"; 

  const [query, setQuery] = useState(currentQ);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl(query, currentSort, currentLevel);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    updateUrl(query, newSort, currentLevel);
  };

  // 💡 위협 등급 변경 시 URL 업데이트
  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLevel = e.target.value;
    updateUrl(query, currentSort, newLevel);
  };

  // 💡 파라미터에 level 추가
  const updateUrl = (q: string, sort: string, level: string) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (sort && sort !== "latest") params.set("sort", sort);
    if (level && level !== "all") params.set("level", level); 
    
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

      {/* 💡 필터 및 정렬 컨트롤 영역 (모바일 반응형 적용) */}
      <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">
        {/* 🛡️ 위협 등급 셀렉트 박스 (NEW) */}
        <select
          value={currentLevel}
          onChange={handleLevelChange}
          className="flex-1 sm:flex-none bg-zinc-900 border border-zinc-800 rounded-lg px-2 sm:px-4 py-2 text-white text-sm focus:outline-none focus:border-[#C273FF] transition cursor-pointer min-w-[110px]"
        >
          <option value="all">모든 등급</option>
          <option value="Critical">🔴 Critical</option>
          <option value="Warning">🟡 Warning</option>
          <option value="Info">🔵 Info</option>
        </select>

        {/* 📊 정렬 셀렉트 박스 */}
        <select
          value={currentSort}
          onChange={handleSortChange}
          className="flex-1 sm:flex-none bg-zinc-900 border border-zinc-800 rounded-lg px-2 sm:px-4 py-2 text-white text-sm focus:outline-none focus:border-[#C273FF] transition cursor-pointer min-w-[100px]"
        >
          <option value="latest">최신순</option>
          <option value="oldest">과거순</option>
          <option value="title">가나다순</option>
        </select>
      </div>
    </div>
  );
}