import { FunctionsType, ImportsType, StructsType } from "@/types/move-syntax";
import { createContext, useState } from "react";

interface Value {
  imports: ImportsType;
  setImports: React.Dispatch<React.SetStateAction<ImportsType>>;
  structs: StructsType;
  setStructs: React.Dispatch<React.SetStateAction<StructsType>>;
  functions: FunctionsType;
  setFunctions: React.Dispatch<React.SetStateAction<FunctionsType>>;
}

export const SuiMoveModuleContext = createContext<Value>({
  imports: {},
  setImports: () => {},
  structs: {},
  setStructs: () => {},
  functions: {},
  setFunctions: () => {},
});

export const SuiMoveModuleProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [imports, setImports] = useState<ImportsType>({});
  const [structs, setStructs] = useState<StructsType>({});
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
