import {
  ImportedModuleData,
  ModuleFunctionData,
  ModuleStructData,
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
  selectedStruct: string | null;
  setSelectedStruct: React.Dispatch<React.SetStateAction<string | null>>;
  selectedFunction: string | null;
  setSelectedFunction: React.Dispatch<React.SetStateAction<string | null>>;
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
  selectedStruct: null,
  setSelectedStruct: () => {},
  selectedFunction: null,
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

  const [selectedStruct, setSelectedStruct] = useState<string | null>(null);
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null);

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
