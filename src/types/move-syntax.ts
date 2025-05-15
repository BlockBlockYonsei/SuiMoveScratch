import {
  SuiMoveNormalizedFunction,
  SuiMoveNormalizedStruct,
} from "@mysten/sui/client";

export type ImportDataMap = Map<string, ImportedSuiMoveModule>;

export interface ImportedSuiMoveModule {
  address: string;
  moduleName: string;
  functions?: Record<string, SuiMoveNormalizedFunction>;
  structs: {
    [structName: string]: SuiMoveNormalizedStruct;
  };
}

export type StructDataMap = Map<string, SuiMoveStruct>;

export interface SuiMoveStruct extends SuiMoveNormalizedStruct {
  typeParameterNames: string[];
}

export type FunctionDataMap = Map<string, SuiMoveFunction>;

export type SuiMoveFunction = {
  function: SuiMoveNormalizedFunction;
  insideCode: {
    functionName: string;
    parameters: string[];
    return: string[];
    typeParameters: string[];
  }[];
};

export type ImportsType = {
  [pkgModuleName: string]: {
    functions?: Record<string, SuiMoveNormalizedFunction>;
    structs: {
      [structName: string]: SuiMoveNormalizedStruct;
    };
  };
};

export interface StructsType {
  [structName: string]: SuiMoveStruct;
}

export type FunctionsType = {
  [functionName: string]: SuiMoveFunction;
};
