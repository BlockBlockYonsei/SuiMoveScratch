import {
  FunctionDataMap,
  ImportDataMap,
  ImportedSuiMoveModule,
  StructDataMap,
  SuiMoveFunction,
  SuiMoveStruct,
} from "@/types/move-syntax";
import { createContext, useState } from "react";

interface Value {
  imports: ImportDataMap;
  setImports: React.Dispatch<React.SetStateAction<ImportDataMap>>;
  structs: StructDataMap;
  setStructs: React.Dispatch<React.SetStateAction<StructDataMap>>;
  functions: FunctionDataMap;
  setFunctions: React.Dispatch<React.SetStateAction<FunctionDataMap>>;
  selectedStruct: string | null;
  setSelectedStruct: React.Dispatch<React.SetStateAction<string | null>>;
}

export const SuiMoveModuleContext = createContext<Value>({
  imports: new Map(),
  setImports: () => {},
  structs: new Map(),
  setStructs: () => {},
  functions: new Map(),
  setFunctions: () => {},
  selectedStruct: null,
  setSelectedStruct: () => {},
});

export const SuiMoveModuleProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [imports, setImports] = useState<ImportDataMap>(
    new Map<string, ImportedSuiMoveModule>(),
  );
  const [structs, setStructs] = useState<StructDataMap>(
    new Map<string, SuiMoveStruct>(),
  );
  const [functions, setFunctions] = useState<FunctionDataMap>(
    new Map<string, SuiMoveFunction>(),
  );
  const [selectedStruct, setSelectedStruct] = useState<string | null>(null);

  return (
    <SuiMoveModuleContext.Provider
      value={{
        imports,
        setImports,
        structs,
        setStructs,
        functions,
        setFunctions,
        selectedStruct,
        setSelectedStruct,
      }}
    >
      {children}
    </SuiMoveModuleContext.Provider>
  );
};
