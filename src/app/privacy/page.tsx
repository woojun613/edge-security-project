// app/privacy/page.tsx
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-black text-zinc-300 pt-32 pb-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-zinc-900/30 border border-zinc-800 rounded-xl p-6 sm:p-10">
        
        <Link href="/" className="inline-flex items-center text-sm text-zinc-500 hover:text-[#C273FF] transition mb-8">
          ← 메인으로 돌아가기
        </Link>

        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">개인정보처리방침</h1>
        <p className="text-xs text-zinc-500 mb-8">시행일자: 2026년 5월 28일</p>

        <div className="space-y-8 text-sm sm:text-base leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-3 border-l-2 border-[#C273FF] pl-3">1. 개인정보의 처리 목적</h2>
            <p className="text-zinc-400">
              엣지시큐리티는 웹 보안 진단 결과 리포트 생성 및 B2B 컨설팅 문의 응대를 목적으로 필요한 최소한의 개인정보를 처리합니다. 수집된 정보는 지정된 목적 외의 용도로는 이용되지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3 border-l-2 border-[#C273FF] pl-3">2. 처리하는 개인정보의 항목</h2>
            <ul className="list-disc list-inside text-zinc-400 space-y-1">
              <li>필수항목: 이름, 이메일 주소, 회사/기관명</li>
              <li>자동수집항목: 접속 IP 주소, 쿠키, 브라우저 및 OS 환경 정보 (보안 무결성 진단용)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3 border-l-2 border-[#C273FF] pl-3">3. 개인정보의 보유 및 이용기간</h2>
            <p className="text-zinc-400">
              이용자의 개인정보는 원칙적으로 개인정보의 수집 및 이용목적이 달성되면 지체 없이 파기합니다. 단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 일정 기간 보존합니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3 border-l-2 border-[#C273FF] pl-3">4. 데이터 보안 조치 사항</h2>
            <p className="text-zinc-400">
              본 플랫폼은 기술적·관리적 보호대책으로 데이터베이스 행 수준 보안(RLS) 정책을 엄격히 적용하고 있으며, 모든 자격 증명 데이터는 암호화 터널을 통해 안전하게 처리됩니다. 또한 사용자가 입력한 비밀번호 분석 데이터는 서버로 전송되지 않고 오직 로컬 브라우저 내에서만 연산됩니다.
            </p>
          </section>
        </div>

      </div>
    </main>
  );
}