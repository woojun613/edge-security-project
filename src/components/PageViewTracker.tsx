"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    // 페이지가 변경될 때마다 1단계에서 만든 API 라우트로 데이터 전송
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: pathname }),
    }).catch((err) => console.error("통계 전송 에러:", err));
  }, [pathname]);

  return null;
}