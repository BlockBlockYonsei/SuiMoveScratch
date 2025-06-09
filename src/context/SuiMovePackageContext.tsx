import {
  ImportedModuleData,
  ImportedSuiMoveModule,
  SuiMoveFunction,
  SuiMoveModuleData,
  SuiMovePackageData,
  SuiMovePackageDataObject,
  SuiMoveStruct,
} from "@/types/move-type";
import { createContext, useEffect, useState } from "react";

interface Value {
  suiMovePackageData: SuiMovePackageData;
  setSuiMovePackageData: React.Dispatch<
    React.SetStateAction<SuiMovePackageData>
  >;
  loadDataTrigger: boolean;
  setLoadDataTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  updateDataTrigger: boolean;
  setUpdateDataTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  isDoneToSaveModule: Record<string, boolean>;
  setIsDoneToSaveModule: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  handleSavePackage: () => void;
  handleLoadPackage: () => void;
}

export const SuiMovePackageContext = createContext<Value>({
  suiMovePackageData: new Map(),
  setSuiMovePackageData: () => {},
  loadDataTrigger: false,
  setLoadDataTrigger: () => {},
  updateDataTrigger: false,
  setUpdateDataTrigger: () => {},
  isDoneToSaveModule: {},
  setIsDoneToSaveModule: () => {},
  handleSavePackage: () => {},
  handleLoadPackage: () => {},
});

export const SuiMovePackageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [updateDataTrigger, setUpdateDataTrigger] = useState(false);
  const [isDoneToSaveModule, setIsDoneToSaveModule] = useState<
    Record<string, boolean>
  >({});
  const [loadDataTrigger, setLoadDataTrigger] = useState(false);

  const [suiMovePackageData, setSuiMovePackageData] =
    useState<SuiMovePackageData>(new Map<string, SuiMoveModuleData>());

  useEffect(() => {
    if (!updateDataTrigger) return;
    if (
      [...suiMovePackageData.keys()].length !==
      Object.keys(isDoneToSaveModule).length
    )
      return;

    if (
      ![...suiMovePackageData.keys()].every((value) =>
        Object.keys(isDoneToSaveModule).includes(value)
      )
    )
      return;

    if (Object.values(isDoneToSaveModule).includes(false)) return;

    setUpdateDataTrigger(false);
  }, [updateDataTrigger, isDoneToSaveModule]);

  function mapToObject(map: any): any {
    if (map instanceof Map) {
      const obj: any = {};
      for (const [key, value] of map.entries()) {
        obj[key] = mapToObject(value);
      }
      return obj;
    } else if (typeof map === "object" && map !== null && !Array.isArray(map)) {
      const result: any = {};
      for (const key in map) {
        result[key] = mapToObject(map[key]);
      }
      return result;
    }
    return map;
  }

  const handleSavePackage = () => {
    try {
      console.log("save package", suiMovePackageData);
      const objFromMap = mapToObject(suiMovePackageData);
      localStorage.setItem("suiMovePackage", JSON.stringify(objFromMap));
      alert("저장 완료!");
    } catch (e) {
      console.error("저장 실패:", e);
      alert("저장 중 오류 발생");
    }
  };

  // const handleLoadPackage = (): SuiMovePackageData | null => {
  const handleLoadPackage = () => {
    const saved = localStorage.getItem("suiMovePackage");
    console.log("load package", saved);
    if (!saved) {
      alert("저장된 데이터가 없습니다.");
      return null;
    }

    try {
      const parsed: SuiMovePackageDataObject = JSON.parse(saved);
      const modulesMap: Map<string, SuiMoveModuleData> = new Map<
        string,
        SuiMoveModuleData
      >();

      Object.entries(parsed).forEach(([moduleName, moduleData]) => {
        const importsData: ImportedModuleData = Object.entries(
          moduleData.imports
        ).reduce((acc, [packageAddress, packageData]) => {
          acc[packageAddress] = new Map<string, ImportedSuiMoveModule>(
            Object.entries(packageData)
          );
          return acc;
        }, {} as Record<string, Map<string, ImportedSuiMoveModule>>);

        const structsMap = new Map<string, SuiMoveStruct>(
          Object.entries(moduleData.structs)
        );
        const functionsMap = new Map<string, SuiMoveFunction>(
          Object.entries(moduleData.functions)
        );

        modulesMap.set(moduleName, {
          imports: importsData,
          structs: structsMap,
          functions: functionsMap,
        });
      });

      setSuiMovePackageData(modulesMap);
      setLoadDataTrigger(true);

      alert("불러오기 완료!");
      // return map;
    } catch (e) {
      console.error("불러오기 실패:", e);
      alert("불러오기 중 오류 발생");
      return null;
    }
  };

  return (
    <SuiMovePackageContext.Provider
      value={{
        // moduleNames,
        // setModuleNames,
        suiMovePackageData,
        setSuiMovePackageData,
        loadDataTrigger,
        setLoadDataTrigger,
        updateDataTrigger,
        setUpdateDataTrigger,
        isDoneToSaveModule,
        setIsDoneToSaveModule,
        handleSavePackage,
        handleLoadPackage,
      }}
    >
      {children}
    </SuiMovePackageContext.Provider>
  );
};
