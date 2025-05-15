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
}

export const SuiMoveModuleContext = createContext<Value>({
  imports: new Map(),
  setImports: () => {},
  structs: new Map(),
  setStructs: () => {},
  functions: new Map(),
  setFunctions: () => {},
});

export const SuiMoveModuleProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [imports, setImports] = useState<ImportDataMap>(
    new Map<string, ImportedSuiMoveModule>()
  );
  const [structs, setStructs] = useState<StructDataMap>(
    new Map<string, SuiMoveStruct>()
  );
  const [functions, setFunctions] = useState<FunctionDataMap>(
    new Map<string, SuiMoveFunction>()
  );

  return (
    <SuiMoveModuleContext.Provider
      value={{
        imports,
        setImports,
        structs,
        setStructs,
        functions,
        setFunctions,
      }}
    >
      {children}
    </SuiMoveModuleContext.Provider>
  );
};
