import {
  ImportedModuleData,
  ModuleFunctionData,
  ModuleStructData,
  SuiMoveFunction,
  SuiMoveStruct,
} from "@/types/move-type";
import { createContext, useContext, useEffect, useState } from "react";
import { SuiMovePackageContext } from "./SuiMovePackageContext";

interface Value {
  moduleName: string;
  setModuleName: React.Dispatch<React.SetStateAction<string>>;
  imports: ImportedModuleData;
  setImports: React.Dispatch<React.SetStateAction<ImportedModuleData>>;
  structs: ModuleStructData;
  setStructs: React.Dispatch<React.SetStateAction<ModuleStructData>>;
  functions: ModuleFunctionData;
  setFunctions: React.Dispatch<React.SetStateAction<ModuleFunctionData>>;
  selectedStruct: SuiMoveStruct | undefined;
  setSelectedStruct: React.Dispatch<
    React.SetStateAction<SuiMoveStruct | undefined>
  >;
  selectedFunction: SuiMoveFunction | undefined;
  setSelectedFunction: React.Dispatch<
    React.SetStateAction<SuiMoveFunction | undefined>
  >;
}

export const SuiMoveModuleContext = createContext<Value>({
  moduleName: "",
  setModuleName: () => {},
  imports: {},
  setImports: () => {},
  structs: new Map(),
  setStructs: () => {},
  functions: new Map(),
  setFunctions: () => {},
  selectedStruct: undefined,
  setSelectedStruct: () => {},
  selectedFunction: undefined,
  setSelectedFunction: () => {},
});

export const SuiMoveModuleProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [moduleName, setModuleName] = useState("");

  const [imports, setImports] = useState<ImportedModuleData>({});
  const [structs, setStructs] = useState<ModuleStructData>(new Map());
  const [functions, setFunctions] = useState<ModuleFunctionData>(new Map());

  const [selectedStruct, setSelectedStruct] = useState<SuiMoveStruct>();
  const [selectedFunction, setSelectedFunction] = useState<SuiMoveFunction>();

  const {
    updateDataTrigger,
    setUpdateDataTrigger,
    setIsDoneToSaveModule,
    suiMovePackageData,
    setSuiMovePackageData,
  } = useContext(SuiMovePackageContext);

  useEffect(() => {
    if (!moduleName) return;

    const moduleData = suiMovePackageData.get(moduleName);

    if (moduleData) {
      setImports(moduleData.imports);
      setStructs(moduleData.structs);
      setFunctions(moduleData.functions);
      // setLoadDataTrigger(false);
    }
  }, [moduleName, suiMovePackageData]);

  useEffect(() => {
    console.log("imports", imports);
    console.log("structs", structs);
    console.log("function", functions);
    setUpdateDataTrigger((prev) => !prev);
  }, [imports, structs, functions]);

  useEffect(() => {
    if (!moduleName) return;

    setSuiMovePackageData((prev) => {
      const newMap = new Map(prev);
      newMap.set(moduleName, { imports, structs, functions });
      return newMap;
    });

    setIsDoneToSaveModule((prev) => ({ ...prev, [moduleName]: true }));
  }, [updateDataTrigger]);

  return (
    <SuiMoveModuleContext.Provider
      value={{
        moduleName,
        setModuleName,
        imports,
        setImports,
        structs,
        setStructs,
        functions,
        setFunctions,
        selectedStruct,
        setSelectedStruct,
        selectedFunction,
        setSelectedFunction,
      }}
    >
      {children}
    </SuiMoveModuleContext.Provider>
  );
};
