// app/terms/page.tsx
import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-black text-zinc-300 pt-32 pb-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-zinc-900/30 border border-zinc-800 rounded-xl p-6 sm:p-10">
        
        <Link href="/" className="inline-flex items-center text-sm text-zinc-500 hover:text-[#C273FF] transition mb-8">
          ← 메인으로 돌아가기
        </Link>

        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">이용약관</h1>
        <p className="text-xs text-zinc-500 mb-8">공고일자: 2026년 5월 28일</p>

        <div className="space-y-8 text-sm sm:text-base leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-3 border-l-2 border-[#C273FF] pl-3">제 1 조 (목적)</h2>
            <p className="text-zinc-400">
              본 약관은 엣지시큐리티가 제공하는 모의 보안 진단 샌드박스, 자동화 리포트 및 정보보안 컨설팅 관련 서비스의 이용 조건 및 절차에 관한 기본적인 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3 border-l-2 border-[#C273FF] pl-3">제 2 조 (이용자의 의무)</h2>
            <p className="text-zinc-400">
              이용자는 본 플랫폼이 제공하는 인터랙티브 보안 진단 툴을 악의적인 시스템 무력화나 취약점 공격 등 본래의 목적(보안 성숙도 평가) 이외의 용도로 사용할 수 없으며, 플랫폼의 정상적인 운영을 방해하는 행위를 해서는 안 됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3 border-l-2 border-[#C273FF] pl-3">제 3 조 (서비스의 책임 한계)</h2>
            <p className="text-zinc-400">
              본 플랫폼에서 제공하는 모의 테스트 및 자동 생성 리포트는 사용자의 접속 환경을 바탕으로 산출된 참고용 진단 결과입니다. 공식적인 법적 보안 무결성을 완전히 보증하는 것은 아니며, 최종적인 엔터프라이즈 보안 체계 구축은 당사 컨설팅 팀과의 별도 정식 계약 및 정밀 정밀 진단을 통해 진행하는 것을 권장합니다.
            </p>
          </section>
        </div>

      </div>
    </main>
  );
}