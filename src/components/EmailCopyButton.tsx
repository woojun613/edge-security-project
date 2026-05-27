"use client";

export default function EmailCopyButton() {
  const handleCopy = () => {
    navigator.clipboard.writeText("edgesec@edgesec.co.kr");
    alert("이메일이 복사되었습니다! 👏");
  };

  return (
    <button 
      onClick={handleCopy}
      className="hover:text-white transition-colors cursor-pointer text-left"
    >
      이메일: edgesec@edgesec.co.kr
    </button>
  );
}