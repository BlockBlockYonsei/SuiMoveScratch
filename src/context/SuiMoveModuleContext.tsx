import {
  FunctionsType,
  ImportDataMap,
  ImportedSuiMoveModule,
  ImportsType,
  StructDataMap,
  StructsType,
  SuiMoveStruct,
} from "@/types/move-syntax";
import { createContext, useState } from "react";

interface Value {
  // imports: ImportsType;
  // setImports: React.Dispatch<React.SetStateAction<ImportsType>>;
  // structs: StructsType;
  // setStructs: React.Dispatch<React.SetStateAction<StructsType>>;
  // functions: FunctionsType;
  // setFunctions: React.Dispatch<React.SetStateAction<FunctionsType>>;
  imports: ImportDataMap;
  setImports: React.Dispatch<React.SetStateAction<ImportDataMap>>;
  structs: StructDataMap;
  setStructs: React.Dispatch<React.SetStateAction<StructDataMap>>;
  functions: FunctionsType;
  setFunctions: React.Dispatch<React.SetStateAction<FunctionsType>>;
}

export const SuiMoveModuleContext = createContext<Value>({
  imports: new Map(),
  setImports: () => {},
  structs: new Map(),
  setStructs: () => {},
  functions: {},
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
  const [functions, setFunctions] = useState<FunctionsType>({});

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
