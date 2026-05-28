// src/components/Pagination.tsx
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

export default function Pagination({ totalPages, currentPage }: PaginationProps) {
  const searchParams = useSearchParams();

  // 전체 페이지가 1장이면 페이지네이션을 숨깁니다.
  if (totalPages <= 1) return null;

  // 기존 검색어(q)와 정렬(sort) 조건을 유지하면서 페이지(page) 번호만 변경하는 함수
  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `/security-news?${params.toString()}`;
  };

  // 화면에 보여줄 페이지 번호 배열 (예: 1, 2, 3, 4, 5)
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center gap-2 mt-12">
      {/* ⬅️ 이전 버튼 */}
      {currentPage > 1 && (
        <Link 
          href={createPageUrl(currentPage - 1)}
          className="px-3 py-2 md:px-4 md:py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition text-sm"
        >
          이전
        </Link>
      )}

      {/* 🔢 번호 버튼들 */}
      <div className="flex gap-1 md:gap-2">
        {pageNumbers.map((pageNum) => (
          <Link
            key={pageNum}
            href={createPageUrl(pageNum)}
            className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg text-sm font-medium transition ${
              currentPage === pageNum
                ? "bg-[#C273FF] text-black border border-[#C273FF]"
                : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600"
            }`}
          >
            {pageNum}
          </Link>
        ))}
      </div>

      {/* ➡️ 다음 버튼 */}
      {currentPage < totalPages && (
        <Link 
          href={createPageUrl(currentPage + 1)}
          className="px-3 py-2 md:px-4 md:py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition text-sm"
        >
          다음
        </Link>
      )}
    </div>
  );
}