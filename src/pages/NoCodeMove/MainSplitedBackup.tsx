import { useEffect } from "react";
import Imports from "./_Imports";

export default function Main() {
  // 새로 고침 시 확인 알림
  useEffect(() => {
    const handleBeforeUnload = (e: any) => {
      e.preventDefault();
      e.returnValue = ""; // 일부 브라우저에서는 이 설정이 필수
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div className="min-h-screen p-6 max-w-xl mx-auto bg-gray-100">
      <h1 className="text-2xl font-bold">🛠️ No Code 텍스트 에디터</h1>
      <br></br>
      <Imports></Imports>
    </div>
  );
}
