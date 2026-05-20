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

## 🛠️ Tech Stack
- Framework: Next.js (App Router)
- Styling: Tailwind CSS
- Database/Auth: Supabase
- Security Logic: Edge Middleware

## 🚀 Getting Started
```bash
npm install
npm run dev