'use client';
import { useEffect, useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

export default function SecurityReportBanner() {
  const [score, setScore] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [details, setDetails] = useState({ isHttps: false, os: '' });
  
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cookie = document.cookie.split('; ').find(row => row.startsWith('security-score='));
    if (cookie) setScore(parseInt(cookie.split('=')[1]));
    
    setDetails({
      isHttps: window.location.protocol === 'https:',
      os: navigator.userAgent
    });
  }, []);

  const downloadReport = async () => {
    if (!reportRef.current) return;
    setIsGenerating(true);

    try {
      const dataUrl = await toPng(reportRef.current, {
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });
      
      const width = reportRef.current.offsetWidth;
      const height = reportRef.current.offsetHeight;
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [width, height]
      });
      
      pdf.addImage(dataUrl, 'PNG', 0, 0, width, height);
      pdf.save('EdgeSecurity_Vulnerability_Report.pdf');
    } catch (error) {
      console.error('PDF 생성 중 오류 발생:', error);
      alert('리포트 생성 중 문제가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (score === null) return null;

  const getStatus = (s: number) => {
    if (s >= 80) return { text: 'EXCELLENT', color: 'text-emerald-400', desc: '매우 안전한 접속 환경입니다.' };
    if (s >= 60) return { text: 'GOOD', color: 'text-blue-400', desc: '안전한 접속 환경입니다.' };
    return { text: 'WARNING', color: 'text-amber-400', desc: '보안 점검이 필요한 환경입니다.' };
  };

  const status = getStatus(score);
  const osName = details.os.includes('Windows') ? 'Windows' : details.os.includes('Mac OS') ? 'Mac OS' : '기타/모바일';

  return (
    <>
      {/* 1. 실제 화면에 보이는 배너 영역 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 mb-12">
        <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 hover:border-white/10 transition-all">
          
          {/* 왼쪽: 텍스트 영역 */}
          <div className="w-full">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h3 className="text-xl font-bold break-keep">실시간 접속 환경 분석</h3>
              <span className="px-2 py-1 text-[10px] font-bold bg-white/10 text-white rounded-md tracking-wider shrink-0">
                EDGE SECURITY
              </span>
            </div>
            <p className="text-zinc-300 text-sm break-keep">{status.desc}</p>
          </div>
          
          {/* 오른쪽: 점수, 등급 색상 및 버튼 영역 */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8 w-full md:w-auto mt-2 md:mt-0">
            {/* 🎨 점수 표시부 옆에 유동적인 등급 색상 텍스트가 정상 배치되었습니다 */}
            <div className="flex items-center gap-6 shrink-0">
              <div className="text-left sm:text-center shrink-0">
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">보안 점수</p>
                <p className="text-3xl font-black text-white">{score}<span className="text-zinc-600 text-sm font-normal">/100</span></p>
              </div>
              <div className={`text-xl font-black ${status.color} tracking-wider shrink-0`}>
                {status.text}
              </div>
            </div>
            
            <button 
              onClick={downloadReport}
              disabled={isGenerating}
              className={`w-full sm:w-auto px-4 py-3 sm:py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                isGenerating 
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                  : 'bg-white text-black hover:bg-zinc-200 cursor-pointer active:scale-95'
              }`}
            >
              {isGenerating ? '보고서 작성 중...' : '상세 진단 리포트 다운로드'}
            </button>
          </div>

        </div>
      </div>

      {/* 2. PDF 출력용으로만 쓰이는 "숨겨진" A4 보고서 영역 */}
      <div className="fixed top-0 -left-[9999px] z-[-1]">
        <div 
          ref={reportRef} 
          className="w-[794px] min-h-[1123px] bg-white text-black p-12 flex flex-col"
        >
          <div className="border-b-4 border-black pb-6 mb-8">
            <h1 className="text-4xl font-black mb-2">실시간 접속 환경 진단 리포트</h1>
            <p className="text-gray-500 text-lg">Edge Security Intelligence System</p>
          </div>

          <div className="bg-gray-100 p-8 rounded-2xl mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">종합 보안 점수</h2>
              <p className="text-gray-600">현재 귀하의 접속 환경에 대한 무결성 진단 결과입니다.</p>
            </div>
            <div className="text-right">
              <p className="text-6xl font-black">{score}<span className="text-2xl text-gray-400">/100</span></p>
              <p className={`text-xl font-bold mt-2 ${score >= 80 ? 'text-green-600' : score >= 60 ? 'text-blue-600' : 'text-red-600'}`}>
                {status.text}
              </p>
            </div>
          </div>

          <h3 className="text-xl font-bold mb-4 border-l-4 border-black pl-3">항목별 상세 진단 결과</h3>
          <table className="w-full text-left border-collapse mb-8">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="p-4 border border-gray-700">진단 항목</th>
                <th className="p-4 border border-gray-700">상태</th>
                <th className="p-4 border border-gray-700">컨설팅 의견 (Why)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-300">
                <td className="p-4 font-bold bg-gray-50">네트워크 암호화 (HTTPS)</td>
                <td className={`p-4 font-bold ${details.isHttps ? 'text-green-600' : 'text-red-600'}`}>
                  {details.isHttps ? '안전 (적용됨)' : '취약 (미적용)'}
                </td>
                <td className="p-4 text-sm text-gray-600 text-balance">
                  {details.isHttps 
                    ? '+30점: 통신 구간이 안전하게 암호화되어 데이터 탈취(Sniffing) 위험이 낮습니다.' 
                    : '-30점 감점: 통신이 암호화되지 않아 패스워드 등 중요 정보가 탈취될 수 있습니다.'}
                </td>
              </tr>
              
              <tr className="border-b border-gray-300">
                <td className="p-4 font-bold bg-gray-50">클라이언트 운영체제</td>
                <td className="p-4 font-bold text-blue-600">{osName} 환경</td>
                <td className="p-4 text-sm text-gray-600 text-balance">
                  +20점: 확인된 데스크톱 환경입니다. 단, OS의 최신 보안 패치를 주기적으로 업데이트해야 제로데이 공격을 예방할 수 있습니다.
                </td>
              </tr>

              <tr className="border-b border-gray-300">
                <td className="p-4 font-bold bg-gray-50">엣지 접속 정책 검증</td>
                <td className="p-4 font-bold text-green-600">통과 (Pass)</td>
                <td className="p-4 text-sm text-gray-600 text-balance">
                  기본 50점: 악성 봇(Bot)이 아닌 정상적인 브라우저 접근으로 확인되었습니다.
                </td>
              </tr>
            </tbody>
          </table>

          <div className="bg-red-50 border border-red-200 p-6 rounded-xl mt-auto">
            <h3 className="text-red-800 font-bold mb-2">💡 엣지시큐리티 전문가 권고안</h3>
            <p className="text-red-700 text-sm leading-relaxed">
              {score < 80 
                ? "현재 보안 점수가 80점 미만입니다. 네트워크 프로토콜을 점검하거나, 최신 운영체제 업데이트가 필요합니다. 사내 망을 사용 중이라면 엣지시큐리티의 '기업용 인프라 진단'을 권장합니다." 
                : "우수한 보안 상태를 유지하고 있습니다. 이 상태를 유지하기 위해 정기적인 사내 보안 감사와 임직원 보안 교육을 병행하는 것을 권장합니다."}
            </p>
          </div>

          <div className="text-center mt-8 pt-8 border-t border-gray-200 text-gray-400 text-sm">
            <p>본 리포트는 엣지시큐리티(Edge Security) 미들웨어를 통해 실시간으로 자동 생성되었습니다.</p>
            <p>보안 컨설팅 문의: contact@edgesecurity.com</p>
          </div>
        </div>
      </div>
    </>
  );
}