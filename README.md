# Edge Security - 정보보안 컨설팅 플랫폼
기술부터 사람까지, 보안의 모든 영역을 함께 지키는 엣지시큐리티(Edge Security)의 공식 플랫폼입니다. 
당사의 웹 보안 컨설팅 역량과 실시간 보안 분석 기술을 시각화하여 제공합니다.

### 🚀 [Edge Security 라이브 데모 접속하기](https://edge-security-project.vercel.app/)
*(클릭 시 포트폴리오 사이트로 즉시 이동합니다)*

### 🔐 체험용 관리자 계정 (Admin Access)
관리자 전용 대시보드 및 실시간 칸반 보드 기능을 테스트해 보실 수 있습니다.

| 역할 (Role) | 접속 아이디 (Email) | 비밀번호 (Password) |
| :--- | :--- | :--- |
| 최고 관리자 | `admin@admin.com` | `admin123` |

> 💡 Tip: 로그인 후 상단 헤더 메뉴에 나타나는 🚨 관제실과 📋 칸반 보드 버튼을 확인해 보세요!

## 🌍 Global Threat Radar: 실시간 3D 보안 관제 시각화
대규모 엔터프라이즈 환경의 보안 관제 센터(SOC)를 웹 브라우저에 그대로 구현한 3D 트래픽 시각화 시스템입니다.

- WebGL 3D Rendering: `react-globe.gl` 라이브러리를 활용하여, 클라이언트 환경에서 CPU 오버헤드 없이 초당 60프레임(60fps)의 부드러운 다크 테마 3D 지구본을 렌더링합니다.
- Zero-cost Hybrid Simulation: 무거운 유료 IP 위치 추적 API에 의존하지 않는 프론트엔드 최적화 아키텍처입니다. 글로벌 공격 좌표(Arcs)는 시뮬레이션 데이터로 렌더링하여 유지비를 0원으로 통제하되, Supabase Realtime 구독을 통해 실제 접속 트래픽이 발생하는 정확한 타이밍에 방어 파동(Rings)을 연동시켰습니다.
- Live Firewall Logging: 미들웨어 방화벽이 SQL Injection, XSS 등의 공격을 탐지하고 차단(`BLOCKED`)하는 과정을 실시간 터미널 로그로 스트리밍하여 보안 시스템의 동작을 직관적으로 증명합니다.

## 🛡️ Security Architecture: 실시간 접속 환경 분석
엣지시큐리티는 사용자의 보안을 수동적인 모니터링에 맡기지 않습니다. 접속자의 환경을 실시간으로 분석하여 잠재적인 위협을 선제적으로 감지하는 지능형 보안 검문소(Edge Middleware)를 운영합니다.

## 🎨 UX & User Experience Enhancement
단순한 기능 구현을 넘어, 플랫폼 방문자가 경험하는 모든 접점(Touchpoint)에서 신뢰감을 제공하기 위해 사용자 경험(UX)을 세밀하게 설계했습니다.

- Cinematic Loading Screen: 첫 접속 시 시스템이 방문자의 환경을 분석하는 컨셉의 로딩 스크린을 구현하여 브랜드의 전문성을 강조했습니다. `Framer Motion`의 `AnimatePresence`를 활용해, 로딩 완료 후 콘텐츠가 부드럽게 페이드 아웃(Fade-out) 되도록 설계하여 시네마틱한 몰입감을 제공합니다.
- Custom 404 Error Handling: 브랜드 아이덴티티가 담긴 커스텀 404 페이지를 구현하고, 이탈 방지를 위해 메인 플랫폼으로의 즉시 리다이렉트 기능을 제공하여 일관된 신뢰를 유지합니다.
- Roadmap & 'Under Construction' State: 미완성 기능을 투명하게 공개하여 플랫폼의 지속적인 진화 과정을 로드맵 형태로 직관적으로 전달합니다.
- Scroll Progress Bar: 페이지 최상단에 스크롤 진행도를 실시간으로 표시하여, 사용자가 전체 콘텐츠 중 현재 위치를 직관적으로 파악할 수 있도록 돕습니다.
- One-Click Email Copy: 풋터(Footer)의 이메일 주소를 클릭 한 번으로 클립보드에 복사할 수 있게 하여, 문의 프로세스에서 드래그 및 복사의 번거로움을 제거했습니다.

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

## 📢 Server-Driven Security Feed: 실시간 보안 속보 게시판
Next.js의 서버 컴포넌트(Server Components)와 ISR(Incremental Static Regeneration) 패턴을 결합하여 구축한 고성능 보안 공지 게시판입니다.

- Zero-API Architecture: 별도의 API 라우트 없이 서버 컴포넌트에서 Supabase DB를 직접 호출하여 클라이언트 번들 사이즈를 최소화하고 렌더링 속도를 극대화했습니다.
- URL-Driven State Management: 검색어(`q`), 정렬(`sort`), 페이지네이션(`page`) 상태를 URL 파라미터로 관리하여, SSR의 SEO 이점과 SPA의 쾌적한 UX를 동시에 달성했습니다. (Supabase `.range()` 쿼리를 활용한 백엔드 단 페이징 최적화 적용)
- Role-Based Access Control (RBAC): 프론트엔드의 `AdminGuard` 컴포넌트와 데이터베이스의 RLS(Row Level Security) 정책을 이중으로 적용하여, 최고 관리자 계정만 게시글의 작성/수정/삭제가 가능하도록 엄격하게 통제합니다.
- Secure Commenting & Like System: 사용자 간의 양방향 소통을 위해 로그인 기반의 댓글 및 좋아요 기능을 구현했습니다. 
   - Relational Data Optimization: `news_comments`와 `comment_likes` 테이블을 1:N 관계로 설계하고, Supabase의 Join 쿼리를 활용해 단일 네트워크 요청으로 댓글과 좋아요 매핑 데이터를 동시에 로드하여 렌더링 성능을 최적화했습니다.
   - 2-Tier Security Guard: 프론트엔드의 UI 렌더링 가드(본인 댓글에만 수정/삭제 버튼 노출)와 데이터베이스의 RLS 정책(토큰 검증 및 JWT Admin 판별)을 결합하여, API 엔드포인트 탈취 시도에도 데이터가 위변조되지 않는 무결성을 보장합니다.

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
   - RLS(Row Level Security) 고도화: `SELECT`, `INSERT` 외에 `DELETE` 정책이 누락되었음을 확인하고, 해당 테이블에 관리자 권한(`authenticated`)을 가진 사용자에 대한 `DELETE` 정책을 적용함.
   - PostgreSQL Permission (GRANT): 정책(Policy)이 존재함에도 권한 에러가 지속되는 문제를 확인하여, `GRANT DELETE ON public.profiles TO authenticated;` 명령어를 통해 DB 수준의 삭제 권한을 명시적으로 부여함.
- Key Learnings: 데이터 무결성과 최소 권한 원칙(Principle of Least Privilege)을 시스템 설계에 직접 적용해보는 귀중한 경험을 함.

2. Next.js 15 Sync Dynamic APIs (Promise Params) Migration & Server-Side Pagination
- Challenge: Next.js 최신 버전(15+) 도입 후 동적 라우팅 페이지(`/security-news/[id]`)에서 `params is a Promise and must be unwrapped with await` 서버 에러 발생 및 대용량 게시판의 프론트엔드 페이징 부하 우려.
- Approach:
   - 최신 아키텍처 규격에 맞춰 `params`와 `searchParams` 객체를 `Promise`로 타이핑하고, 데이터를 추출하기 전 `await` 키워드로 비동기 언래핑(Unwrapping)을 수행하도록 SSR 로직을 완벽하게 리팩토링함.
   - 클라이언트 상태(`useState`)에 의존하던 초보적인 페이징 방식에서 벗어나, URL 파라미터를 비동기로 파싱하여 Supabase DB단에서 `.range()` 쿼리로 정확히 10개씩만 슬라이싱해 가져오는 고성능 서버사이드 페이지네이션 시스템을 구축함.
- Key Learnings: 프레임워크의 메이저 업데이트에 따른 파괴적 변경(Breaking Changes)에 기민하게 대응하는 트러블슈팅 역량을 입증했으며, 백엔드와 프론트엔드 간의 데이터 패칭 최적화(Data Fetching Optimization)에 대한 깊은 이해를 얻음.

3. UX Optimization: Chat Interface Scroll Control (레이아웃 스크롤 튐 현상 해결)
- Challenge: AI 모의 테스트 샌드박스에서 새 메시지가 추가될 때, `scrollIntoView()` 함수가 브라우저 전체 뷰포트를 강제로 끌고 내려가 웹페이지 레이아웃이 무너지고 사용자 흐름이 깨지는 현상 발생.
- Approach:
   - 브라우저 전체 스크롤에 영향을 주는 `scrollIntoView` 방식을 과감히 제거함.
   - 채팅창 내부에 독립적인 `useRef` 컨테이너를 지정하고, 메시지 상태(`messages`)가 변경될 때마다 엘리먼트의 `scrollHeight`를 계산하여 채팅창 내부에서만 부드럽게 스크롤되도록(`scrollTo({ top: ... , behavior: 'smooth' })`) 로직을 고도화함.
- Key Learnings: 글로벌 레이아웃에 영향을 주지 않고 컴포넌트 스코프 내에서만 DOM 이벤트를 제어하는 자바스크립트 최적화 기법을 학습함.

4. Authentication Lifecycle & Security Policy (인증 생명주기 및 엄격한 보안 통제)
- Challenge: 사용자 정보(닉네임, 비밀번호) 변경 시 발생할 수 있는 데이터 무결성 훼손 및 세션 탈취 위험 방지.
- Approach:
   - 중복 검사 및 무결성 확보: 닉네임 변경 시 클라이언트 측에서 즉각적인 DB 조회를 통해 중복 여부를 검증하고, 반영 완료 후 `window.location.reload()`를 통해 헤더 등 전역 UI 상태를 즉시 동기화함.
   - 이메일 기반 패스워드 복구 (Password Recovery): Supabase의 `onAuthStateChange` 리스너를 활용하여 복구 링크 진입 이벤트를 감지하고, 독립된 비밀번호 재설정 뷰를 렌더링함.
   - Strict Mode 세션 파기: 비밀번호가 성공적으로 변경된 직후, 기존에 유지되던 세션을 즉시 강제 파기(`supabase.auth.signOut()`)하고 로그인 페이지로 리다이렉트시키는 엄격한 인증 통제(Strict Control) 로직을 구현하여 잠재적 보안 위협을 차단함.
- Key Learnings: 편의성(UX)을 제공하면서도, 자격 증명(Credential) 변경과 같은 민감한 이벤트에서는 단호하게 세션을 끊어내는 보안 컨설턴트 관점의 아키텍처 설계의 중요성을 확인함.

5. Cross-Platform UX Flow & Database Authorization Control (크로스 플랫폼 UX 및 DB 권한 통제)
- Challenge: - HTML5 Native Drag & Drop API는 데스크톱 마우스 환경에서 최적의 퍼포먼스를 발휘하지만, 모바일 및 터치 디바이스에서는 드래그 동작이 브라우저 스크롤 이벤트와 충돌하여 인터랙션이 완전히 차단되는 접근성(Accessibility) 문제가 발생함.
   - 대중에게 노출되는 전면 웹사이트와 달리 사내 자산 및 프로젝트 기밀을 다루는 관리자 기능 특성상, 테이블 레벨의 철저한 접근 권한 통제(Database Privilege Separation)가 요구됨.
- Approach:
   - Adaptive Responsive UI (접근성 대체 뷰 설계): 무거운 외부 드래그 라이브러리를 추가하여 번들 크기를 키우는 대신, Tailwind CSS의 미디어 쿼리를 활용해 기기별 모드를 완전 분리함. 데스크톱(`md:`) 환경에서는 직관적인 드래그 앤 드롭을 유지하고, 터치 환경에서는 상태 제어 모바일 셀렉터(Select Element)를 레이아웃에 조건부 렌더링(Conditional Rendering)하여 크로스 플랫폼 접근성을 확보함.
   - PostgreSQL GRANT & RLS 연동: 무분별한 API 호출을 막기 위해 외부 익명 역할(`anon`)의 테이블 접근 권한을 엄격히 박탈(`REVOKE ALL`)하고, 로그인된 신뢰할 수 있는 관리자 그룹(`authenticated`)에게만 명시적 자격(`GRANT SELECT, INSERT, UPDATE, DELETE`)을 부여함. 이를 Next.js의 라우트 그룹 `(admin)` 보안 레이아웃 문지기(Gatekeeper) 로직과 결합하여 2중 방어 아키텍처를 구축함.
   - Full-Stack Persistent CRUD: 프로젝트의 실시간 생성, 드롭/터치 기반의 상태 변화 업데이트, 마우스 오버 시 활성화되는 복구 불가능한 즉각 삭제 로직을 완벽한 낙관적 업데이트(Optimistic UI) 기법과 매핑하여, 새로고침이나 로그아웃 후에도 완벽히 데이터가 유지되는 영속성(Persistence)을 달동함.
- Key Learnings: 마우스 환경에만 갇히기 쉬운 프론트엔드 기능을 모바일/터치 스크린 관점까지 확장하여 주도적으로 문제를 해결하는 UX 감각을 기르고, 데이터베이스 최소 권한의 원칙(Principle of Least Privilege)을 백엔드 코드와 인프라 단에 직접 이식해 보는 가치 있는 경험을 축적함.

6. Conversion-Oriented Visual Hierarchy & CTA Optimization (전환율 최적화 및 시각적 위계 설계)
- Challenge: 'AI 샌드박스', '1분 보안 진단' 등 역동적인 인터랙티브 메뉴가 추가됨에 따라, 헤더 네비게이션 내에서 시선이 분산되는 현상이 발생함. 플랫폼의 궁극적인 비즈니스 목표인 '고객 문의 확보(Lead Generation)'를 달성하기 위해서는 가장 유기적인 유저 흐름([서비스 소개] -> [보안 성숙도 진단] -> [최종 컨설팅 문의])을 유도할 수 있는 시각적 위계(Visual Hierarchy) 재설계가 필요했음.
- Approach:
   - UI Refinement & Context Balance: 시선을 과도하게 앗아 가던 '보안 진단' 메뉴의 뱃지 컬러를 일반 메뉴와 동일한 톤(`text-zinc-400`)으로 다운그레이드하여 네비게이션의 밸런스를 맞춤.
   - Strategic CTA Button Design: 최종 목적지인 '문의하기' 링크를 단순 텍스트가 아닌, 엣지시큐리티 브랜드 시그니처 컬러를 반영한 명시적 버튼 형태(`bg-[#C273FF]/10 text-[#C273FF] border border-[#C273FF]/20`)로 커스텀 디자인하여 유저의 최종 행동(Call To Action)을 강력하게 유도함.
- Key Learnings: UI/UX 설계 시 심미적인 화려함에만 매몰되지 않고, 서비스가 지닌 비즈니스 목적과 유저의 유입 파이프라인을 다각도로 분석하여 프론트엔드 아키텍처에 반영하는 기획자적 관점의 엔지니어링 역량을 확보함.

7. Premium UX Implementation & React 19 Compatibility Resolution (프리미엄 UX 구현 및 버전 호환성 해결)
이 섹션은 '기능 도입'에서 시작해 '배포 성공'으로 끝나는 전체 개발 라이프사이클을 보여줍니다.
- Challenge: 사이트의 시네마틱한 감성을 위해 react-lenis 스무스 스크롤을 도입했으나, React 19 환경과의 버전 충돌(Peer Dependency) 및 프로덕션 빌드 파이프라인에서 의존성 해결 에러(ERESOLVE)가 발생함.
- Approach:
   - Local Resolution: TypeScript 타입 정의 불일치 문제를 {children as any} 캐스팅으로 우회하여 런타임 안정성 확보.
   - Pipeline Optimization: Vercel 빌드 환경의 엄격한 의존성 검사 정책을 고려하여, 프로젝트 설정(Install Command)에 --legacy-peer-deps를 명시적으로 적용함으로써 빌드 파이프라인의 유연성을 확보함.
- Key Learnings: 최신 프레임워크 도입 시 발생하는 라이브러리 간 호환성 문제를 근본적으로 파악하고, 로컬 개발과 실제 배포 환경(CI/CD)의 차이를 인지하여 빌드 인프라를 직접 커스텀하는 DevOps적 문제 해결 역량을 기름.

## 💎 UX/UI Details & Micro-interactions
단순한 정보 전달을 넘어, 사용자가 플랫폼을 이용하는 모든 순간에 쾌적함을 느낄 수 있도록 세밀한 UX 디테일을 설계했습니다.

- Scroll Progress Bar: 페이지 최상단에 스크롤 진행도를 실시간으로 표시하여, 사용자가 전체 콘텐츠 중 현재 위치를 직관적으로 파악할 수 있도록 돕습니다.
- One-Click Email Copy: 풋터(Footer)의 이메일 주소를 클릭 한 번으로 클립보드에 복사할 수 있도록 설계하여, 고객 문의 프로세스에서 드래그 및 복사의 번거로움을 제거했습니다.

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

### Framework & UI
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

### Backend & Database
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

### Deployment & Tools
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)


## 🚀 Getting Started
```bash
npm install
npm run dev