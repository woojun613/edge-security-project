export function calculateSecurityScore(headers: Headers) {
  let score = 50; // 기본 점수

  // 1. HTTPS 연결 확인
  const isHttps = headers.get('x-forwarded-proto') === 'https';
  if (isHttps) score += 30;

  // 2. 브라우저 보안 (간이 체크)
  const userAgent = headers.get('user-agent') || '';
  if (userAgent.includes('Windows NT 10.0') || userAgent.includes('Mac OS X')) {
    score += 10; // OS 업데이트 상태가 좋다고 가정
  }

  // 3. 보안 헤더 확인 (X-Content-Type-Options 등)
  if (headers.get('x-content-type-options') === 'nosniff') score += 10;

  return {
    score,
    status: score > 80 ? 'EXCELLENT' : score > 60 ? 'GOOD' : 'WARNING',
    details: isHttps ? '보안 통신 사용 중' : '보안 통신 미사용 (취약)'
  };
}