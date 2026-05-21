# Edge Security - 정보보안 컨설팅 플랫폼

기술부터 사람까지, 보안의 모든 영역을 함께 지키는 엣지시큐리티(Edge Security)의 공식 플랫폼입니다. 
당사의 웹 보안 컨설팅 역량과 실시간 보안 분석 기술을 시각화하여 제공합니다.

## 🛡️ Security Architecture: 실시간 접속 환경 분석

엣지시큐리티는 사용자의 보안을 수동적인 모니터링에 맡기지 않습니다. 접속자의 환경을 실시간으로 분석하여 잠재적인 위협을 선제적으로 감지하는 지능형 보안 검문소(Edge Middleware)를 운영합니다.



### 🔍 분석 메커니즘
모든 접속은 서버 진입 전, 미들웨어 레이어에서 아래 3가지 지표를 기반으로 즉각적인 보안 무결성 평가를 거칩니다.

1. 통신 경로 안전성 (Network Layer)
   - HTTPS 프로토콜 사용 여부를 확인하여 데이터 암호화 터널의 완성도를 평가합니다.
2. 사용자 환경 무결성 (Client-Side Layer)
   - 접속자의 OS 및 브라우저 환경이 보안 패치가 적용된 최신 상태인지 진단합니다.
3. 보안 정책 준수 (Policy Layer)
   - 웹 보안 표준 헤더 및 스니핑 방지 정책 준수 여부를 종합적으로 검증합니다.

### 💡 철학 (Philosophy)
보안은 '해킹 당한 후' 대응하는 것이 아닙니다. 엣지시큐리티의 실시간 분석 시스템은 "공격자가 틈을 노릴 수 있는 모든 환경적 위험 요소를 제거하는 것"에서 시작합니다.

## 📄 Automated Security Reporting: 실시간 진단 리포트 자동화

플랫폼 방문자의 접속 환경 분석 결과를 바탕으로, 즉각적인 B2B 보안 컨설팅이 가능하도록 'A4 규격의 상세 진단 리포트 자동 생성 기능'을 제공합니다.

### 🖨️ 동작 원리 (Hidden Template Rendering)
단순히 화면을 캡처하는 방식이 아닌, 프론트엔드 환경에서 '보고서 전용 템플릿'을 백그라운드 렌더링하는 기법을 적용했습니다.

1. 상태 기반 데이터 바인딩: 미들웨어와 쿠키를 통해 수집된 접속자의 보안 점수 및 환경 데이터(HTTPS, OS 정보 등)를 보고서 템플릿에 실시간으로 매핑합니다.
2. Hidden DOM 렌더링: 다크 모드 기반의 웹 UI 레이아웃을 훼손하지 않기 위해, 사용자 시야 밖(Off-screen)에 A4 규격(`794px` x `1123px`)의 화이트 테마 보고서 DOM을 독립적으로 유지합니다.
3. Client-Side PDF 굽기: `html-to-image`와 `jsPDF` 라이브러리를 활용하여, 서버 자원 소모 없이 사용자의 브라우저 내에서 고해상도(Scale: 2x) PDF 렌더링 및 다운로드를 즉시 수행합니다.

이 기능을 통해 고객은 자신의 취약점과 엣지시큐리티의 전문가 권고안이 담긴 리포트를 단 1초 만에 받아볼 수 있으며, 이는 컨설팅 업무의 즉시성과 신뢰도를 극대화합니다.

## 🛠️ Tech Stack
- Framework: Next.js (App Router)
- Styling: Tailwind CSS
- Database/Auth: Supabase
- Security Logic: Edge Middleware
- Report Engine: html-to-image, jsPDF

## 🚀 Getting Started
```bash
npm install
npm run dev