import {
  ImportedModuleData,
  ModuleFunctionData,
  ModuleStructData,
  SuiMoveFunction,
  SuiMoveStruct,
} from "@/types/move-syntax2";
import { createContext, useState } from "react";

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
