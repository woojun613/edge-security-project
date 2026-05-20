import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SideMenu from "@/components/SideMenu";

export const metadata: Metadata = {
  title: "Edge Security | 정보보안 컨설팅",
  description: "기술부터 사람까지, 보안의 모든 영역을 함께 지킵니다.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-black text-white antialiased flex flex-col min-h-screen relative">
        
        {/* 헤더를 최상단(z-100)으로 올려서 사이드 메뉴가 헤더를 못 가리게 방어! */}
        <div className="relative z-[100]">
          <Header />
        </div>
        
        <main className="flex-1 relative z-10">
          {children}
        </main>
        
        <div className="relative z-10">
          <Footer />
        </div>
        
        {/* 껍데기를 벗기고 본체만 둡니다. 제어는 SideMenu 내부에서 합니다. */}
        <SideMenu /> 
        
      </body>
    </html>
  );
}