import { SideBarEditor } from "@/pages/NoCodeMoveV2/SideBarEditor";
import MainScreen from "@/pages/NoCodeMoveV2/MainScreen";
import { SuiMoveModuleProvider } from "@/context/SuiMoveModuleContext";
import { useContext, useEffect, useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import ModuleTabs from "./ModuleTabs";
import { SuiMovePackageContext } from "@/context/SuiMovePackageContext";

export default function Main() {
  // const [packageName, setPackageName] = useState("");

  const [currentModule, setCurrentModule] = useState("");

  const [menu, setMenu] = useState<
    "Import" | "Struct" | "Function" | "FunctionCode" | "CodePreview"
  >("Import");

  const { suiMovePackageData } = useContext(SuiMovePackageContext);

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
    <div className="min-h-screen bg-gray-200">
      <div className="flex ">
        <SideBarEditor menu={menu} setMenu={setMenu} />
        <Tabs
          onValueChange={setCurrentModule}
          value={currentModule}
          className="flex-1 p-4"
        >
          <ModuleTabs
            currentTab={currentModule}
            setCurrentTab={setCurrentModule}
          />
          {[...suiMovePackageData.keys()].map((moduleName, index) => (
            <div
              key={index}
              hidden={moduleName !== currentModule}
              className="bg-gray-50 rounded-md p-2"
            >
              <SuiMoveModuleProvider>
                <MainScreen
                  moduleName={moduleName}
                  menu={menu}
                  // setSuiMovePackageData={setSuiMovePackageData}
                />
              </SuiMoveModuleProvider>
            </div>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
