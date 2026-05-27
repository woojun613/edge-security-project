import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SideMenu from "@/components/SideMenu";
import PageViewTracker from "@/components/PageViewTracker";
import SecurityReportBanner from "@/components/SecurityReportBanner";
import SmoothScroll from "@/components/SmoothScroll"; 
import ScrollProgress from "@/components/ScrollProgress"; 

export const metadata: Metadata = {
  title: "Edge Security | 정보보안 컨설팅",
  description: "기술부터 사람까지, 보안의 모든 영역을 함께 지킵니다.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body 
        className="bg-black text-white antialiased flex flex-col min-h-screen relative"
        suppressHydrationWarning
      >
        <ScrollProgress />
        <PageViewTracker />
        
        {/* SmoothScroll로 화면 전체를 감싸줍니다. */}
        <SmoothScroll>
          <div className="relative z-[100]">
            <Header />
          </div>
          
          <main className="flex-1 relative z-10">
            {children}
          </main>
          
          <div className="relative z-10">
            <SecurityReportBanner />
            <Footer />
          </div>
          
          <SideMenu /> 
        </SmoothScroll>

      </body>
    </html>
  );
}