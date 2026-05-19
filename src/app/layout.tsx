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
        <Header />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
        
        {/* 가장 나중에 선언해서 무조건 맨 위로 올립니다 */}
        <SideMenu /> 
      </body>
    </html>
  );
}