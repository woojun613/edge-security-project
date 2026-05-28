// src/components/AdminGuard.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; 

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      // 관리자 계정 확인 (차장님의 관리자 이메일로 변경 가능)
      if (user?.email === "admin@admin.com") {
        setIsAdmin(true);
      }
    };
    
    checkUser();
  }, []);

  return isAdmin ? <>{children}</> : null;
}