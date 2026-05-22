# Edge Security - 정보보안 컨설팅 플랫폼
기술부터 사람까지, 보안의 모든 영역을 함께 지키는 엣지시큐리티(Edge Security)의 공식 플랫폼입니다. 
당사의 웹 보안 컨설팅 역량과 실시간 보안 분석 기술을 시각화하여 제공합니다.

## 🌍 Global Threat Radar: 실시간 3D 보안 관제 시각화
대규모 엔터프라이즈 환경의 보안 관제 센터(SOC)를 웹 브라우저에 그대로 구현한 3D 트래픽 시각화 시스템입니다.

- WebGL 3D Rendering: `react-globe.gl` 라이브러리를 활용하여, 클라이언트 환경에서 CPU 오버헤드 없이 초당 60프레임(60fps)의 부드러운 다크 테마 3D 지구본을 렌더링합니다.
- Zero-cost Hybrid Simulation: 무거운 유료 IP 위치 추적 API에 의존하지 않는 프론트엔드 최적화 아키텍처입니다. 글로벌 공격 좌표(Arcs)는 시뮬레이션 데이터로 렌더링하여 유지비를 0원으로 통제하되, Supabase Realtime 구독을 통해 실제 접속 트래픽이 발생하는 정확한 타이밍에 방어 파동(Rings)을 연동시켰습니다.
- Live Firewall Logging: 미들웨어 방화벽이 SQL Injection, XSS 등의 공격을 탐지하고 차단(`BLOCKED`)하는 과정을 실시간 터미널 로그로 스트리밍하여 보안 시스템의 동작을 직관적으로 증명합니다.

## 🛡️ Security Architecture: 실시간 접속 환경 분석
엣지시큐리티는 사용자의 보안을 수동적인 모니터링에 맡기지 않습니다. 접속자의 환경을 실시간으로 분석하여 잠재적인 위협을 선제적으로 감지하는 지능형 보안 검문소(Edge Middleware)를 운영합니다.

## 🎨 UX & User Experience Enhancement
단순한 기능 구현을 넘어, 플랫폼 방문자가 경험하는 모든 접점(Touchpoint)에서 신뢰감을 제공하기 위해 사용자 경험(UX)을 세밀하게 설계했습니다.

- Custom 404 Error Handling:
   - 단순한 서버 에러 메시지가 아닌, 엣지시큐리티의 브랜드 아이덴티티가 담긴 커스텀 404 페이지를 구현했습니다. 
   - 길을 잃은 사용자를 안전한 메인 플랫폼(Threat Radar)으로 즉시 유도하여 이탈률을 방지하고, 보안 전문 서비스로서의 일관된 신뢰를 유지합니다.
- Roadmap & 'Under Construction' State:
   - 미완성된 기능은 투명하게 '준비중(Under Construction)' 상태로 표시하여 플랫폼의 개발 로드맵을 직관적으로 보여줍니다.
   - 이는 플랫폼이 멈춰있는 것이 아니라, 지속적으로 진화하고 있음을 알리는 신호로 활용됩니다.

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

이 기능을 통해 고객은 자신의 취약점과 전문가 권고안이 담긴 리포트를 단 1초 만에 받아볼 수 있으며, 이는 컨설팅 업무의 즉시성과 신뢰도를 극대화합니다.

## 🧪 Interactive Security Lab: 고객 참여형 보안 진단
단순한 텍스트 경고를 넘어, 고객이 직접 보안 취약점을 체감할 수 있는 인터랙티브 컴포넌트를 제공합니다.

- Password Cracking Analyzer: `zxcvbn` 알고리즘을 활용하여 사용자가 입력한 비밀번호가 다크웹 해킹 사전(Dictionary)에 의해 크래킹되는 소요 시간을 실시간으로 계산합니다.
- Local Processing: 보안 원칙에 따라 입력된 비밀번호 데이터는 서버로 전송되지 않으며, 오직 클라이언트 브라우저 내에서만 안전하게 연산 처리됩니다.

## 🔐 Authentication & Access Control: 지능형 권한 관리
Supabase Auth 및 Row Level Security(RLS)를 활용하여 기업 수준의 철저한 접근 제어 시스템을 구축했습니다.

- Middleware Routing: 서버 사이드에서 세션을 검증하여 비정상적인 접근을 렌더링 이전에 원천 차단합니다.
- Database RLS: 데이터베이스 단에서 읽기/쓰기 권한을 엄격하게 분리하여, 클라이언트에서 발생하는 악의적인 쿼리 변조 공격을 방어합니다.

## 📊 Integrated Admin Dashboard: 통합 중앙 제어 시스템
관리자가 플랫폼의 상태를 한눈에 파악하고 제어할 수 있는 모바일 최적화 대시보드를 제공합니다.

- Traffic Analytics: 고유 IP(Unique IP)를 추적하여 일일 및 주간 누적 트래픽을 차트로 시각화합니다.
- Client-Side Optimization: `useMemo` 훅을 활용하여 수많은 문의 내역과 회원 데이터를 서버 재요청 없이 브라우저 내에서 즉각적으로 필터링, 정렬, 페이지네이션(Pagination) 처리합니다. 

## 🛡️ Technical Challenges & Solutions
1. Database Security & Authorization (RLS & Grant)
- Challenge: 관리자 대시보드 내 데이터 삭제/수정 기능 구현 시, DB 레벨의 보안 정책으로 인한 `42501 (Permission Denied)` 에러 발생.
- Approach:
   -RLS(Row Level Security) 고도화: `SELECT`, `INSERT` 외에 `DELETE` 정책이 누락되었음을 확인하고, 해당 테이블에 관리자 권한(`authenticated`)을 가진 사용자에 대한 `DELETE` 정책을 적용함.
   -PostgreSQL Permission (GRANT): 정책(Policy)이 존재함에도 권한 에러가 지속되는 문제를 확인하여, `GRANT DELETE ON public.profiles TO authenticated;` 명령어를 통해 DB 수준의 삭제 권한을 명시적으로 부여함.
- Key Learnings: 데이터 무결성과 최소 권한 원칙(Principle of Least Privilege)을 시스템 설계에 직접 적용해보는 귀중한 경험을 함.

2. UX Optimization: Chat Interface Scroll Control (레이아웃 스크롤 튐 현상 해결)
- Challenge: AI 모의 테스트 샌드박스에서 새 메시지가 추가될 때, `scrollIntoView()` 함수가 브라우저 전체 뷰포트를 강제로 끌고 내려가 웹페이지 레이아웃이 무너지고 사용자 흐름이 깨지는 현상 발생.
- Approach:
   -브라우저 전체 스크롤에 영향을 주는 `scrollIntoView` 방식을 과감히 제거함.
   -채팅창 내부에 독립적인 `useRef` 컨테이너를 지정하고, 메시지 상태(`messages`)가 변경될 때마다 엘리먼트의 `scrollHeight`를 계산하여 채팅창 내부에서만 부드럽게 스크롤되도록(`scrollTo({ top: ... , behavior: 'smooth' })`) 로직을 고도화함.
- Key Learnings: 글로벌 레이아웃에 영향을 주지 않고 컴포넌트 스코프 내에서만 DOM 이벤트를 제어하는 자바스크립트 최적화 기법을 학습함.

## ☁️ Infrastructure & Deployment
본 플랫폼은 고가용성과 최신 보안 표준을 준수하기 위해 현대적인 서버리스 아키텍처를 채택했습니다.

- Global Edge Deployment (Vercel):
   - 전 세계 Edge Network에 최적화된 Vercel 플랫폼을 통해 배포하여, 어느 지역에서든 빠른 응답 속도를 보장합니다.
   - GitHub 연동 CI/CD 파이프라인을 구축하여 코드 푸시와 동시에 테스트 및 빌드가 자동으로 수행되는 배포 자동화를 구현했습니다.
   - 서버리스 환경(Serverless Functions)을 통해 요청량에 따른 유연한 스케일링을 지원합니다.

- Backend-as-a-Service (Supabase):
   - Managed PostgreSQL(포스트그레스): 안정적인 RDBMS를 직접 관리할 필요 없이, Supabase를 통해 데이터 무결성을 보장하는 고성능 PostgreSQL 환경을 구축했습니다.
   - Realtime Sync: 대시보드의 실시간성(로그 스트리밍 등)을 위해 Supabase의 Realtime 기능을 연동하여, 서버-클라이언트 간 데이터 동기화 지연을 최소화했습니다.
   - Edge Security Integration: 단순 DB를 넘어, RLS(Row Level Security)를 통한 행 단위 보안 정책으로 애플리케이션 보안 계층을 다중화했습니다.

## 🛠️ Tech Stack
- Framework: Next.js (App Router)
- Styling & UI: Tailwind CSS, Framer Motion
- Database/Auth: Supabase (Auth, RLS, Realtime)
- Security Logic: Edge Middleware
- Security Analysis: zxcvbn
- Data Visualization: react-globe.gl (WebGL 3D)
- Report Engine: html-to-image, jsPDF

# 관리자 계정 로그인
- 아이디 : admin@admin.com
- 비밀번호 : admin123

## 🚀 Getting Started
```bash
npm install
npm run dev