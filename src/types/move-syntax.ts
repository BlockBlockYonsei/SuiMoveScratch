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
  function: SuiMoveNormalizedFunction & {
    parameterNames: string[];
    typeParameterNames: string[];
  };
  // insideCode: Map<string, FunctionInsideCodeLine>;
  insideCode: FunctionInsideCodeLine[];
};

export interface FunctionInsideCodeLine extends SuiMoveNormalizedFunction {
  functionName: string;
  argumentNames: string[];
  typeArgumentNames: string[];
  returnVariableNames: string[];
}
