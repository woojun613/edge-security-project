// src/components/AdminActionButtons.tsx
"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; 
import AdminGuard from "@/components/AdminGuard";
import Link from "next/link";

export default function AdminActionButtons({ newsId }: { newsId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmDelete = window.confirm("정말로 이 보안 공지를 삭제하시겠습니까?");
    if (!confirmDelete) return;

    // 💡 Supabase에서 해당 ID의 데이터를 삭제합니다.
    const { error } = await supabase
      .from("security_alerts")
      .delete()
      .eq("id", newsId);

    if (error) {
      alert(`삭제 실패: ${error.message}`);
    } else {
      alert("공지가 안전하게 삭제되었습니다.");
      router.push("/security-news");
      router.refresh(); // 삭제 후 목록 페이지 강제 새로고침
    }
  };

  return (
    // 💡 최고 관리자(admin@admin.com)에게만 이 영역이 렌더링됩니다.
    <AdminGuard>
      <div className="flex gap-3 mt-12 pt-6 border-t border-zinc-800">
        <Link 
          href={`/security-news/edit/${newsId}`}
          className="px-6 py-2 bg-zinc-800 text-zinc-300 rounded hover:bg-zinc-700 transition text-sm font-medium"
        >
          수정하기
        </Link>
        <button 
          onClick={handleDelete}
          className="px-6 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded hover:bg-red-500/20 transition text-sm font-medium"
        >
          삭제하기
        </button>
      </div>
    </AdminGuard>
  );
}