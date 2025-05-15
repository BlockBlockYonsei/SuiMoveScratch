import {
  SuiMoveNormalizedFunction,
  SuiMoveNormalizedStruct,
} from "@mysten/sui/client";

export type ImportsType = {
  [pkgModuleName: string]: {
    functions?: Record<string, SuiMoveNormalizedFunction>;
    structs: {
      [structName: string]: SuiMoveNormalizedStruct;
    };
  };
};

export type StructsType = Record<string, SuiMoveNormalizedStruct>;

export type FunctionsType = Record<string, SuiMoveFunction>;

export type SuiMoveFunction = {
  function: SuiMoveNormalizedFunction;
  insideCode: {
    functionName: string;
    parameters: string[];
    return: string[];
    typeParameters: string[];
  }[];
};

// export interface BaseProps {
//   imports: ImportsType;
//   structs: StructsType;
// }

// export interface StructsProps extends BaseProps {
//   setStructs: React.Dispatch<React.SetStateAction<StructsType>>;
// }

// export interface FunctionsProps extends BaseProps {
//   functions: FunctionsType;
//   setFunctions: React.Dispatch<React.SetStateAction<FunctionsType>>;
// }

// export interface ImportsProps {
//   imports: ImportsType;
//   setImports: React.Dispatch<React.SetStateAction<ImportsType>>;
// }
