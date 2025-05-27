import { SideBarEditor } from "@/pages/NoCodeMoveV2/SideBarEditor";
import MainScreen from "@/pages/NoCodeMoveV2/MainScreen";
import { SuiMoveModuleProvider } from "@/context/SuiMoveModuleContext";
import { useEffect, useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import ModuleTabs from "./ModuleTabs";

export default function Main() {
  // const [packageName, setPackageName] = useState("");

  const [currentModule, setCurrentModule] = useState("");
  const [moduleNames, setModuleNames] = useState<string[]>([]);
  const [moduleCodes, setModuleCodes] = useState<Record<string, string>>({});

  const [menu, setMenu] = useState<
    "Imports" | "Structs" | "Functions" | "CodePreview"
  >("Imports");

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
        <SideBarEditor
          menu={menu}
          setMenu={setMenu}
          moduleCodes={moduleCodes}
        />
        <Tabs
          onValueChange={setCurrentModule}
          value={currentModule}
          className="flex-1 p-4"
        >
          <ModuleTabs
            moduleNames={moduleNames}
            setModuleNames={setModuleNames}
            currentTab={currentModule}
            setCurrentTab={setCurrentModule}
          />
          {moduleNames.map((moduleName) => (
            <div
              key={moduleName}
              hidden={moduleName !== currentModule}
              className="bg-gray-50 rounded-md p-2"
            >
              <SuiMoveModuleProvider>
                <MainScreen
                  moduleName={moduleName}
                  menu={menu}
                  setModuleCodes={setModuleCodes}
                />
              </SuiMoveModuleProvider>
            </div>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
