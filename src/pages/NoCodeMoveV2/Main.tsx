import { SideBarEditor } from "@/pages/NoCodeMoveV2/SideBarEditor";
import CodePreview from "@/pages/NoCodeMoveV2/CodePreview";
import { SuiMoveModuleProvider } from "@/context/SuiMoveModuleContext";
import { useEffect, useState } from "react";

export default function Main() {
  const [menu, setMenu] = useState<
    "imports" | "structs" | "functions" | "code"
  >("imports");

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
    <div className="min-h-screen m-auto bg-gray-200">
      <SuiMoveModuleProvider>
        <div className="flex gap-4">
          <SideBarEditor menu={menu} setMenu={setMenu} />
          <CodePreview menu={menu} />
        </div>
      </SuiMoveModuleProvider>
    </div>
  );
}
