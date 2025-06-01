import {
  SuiMoveNormalizedFunction,
  SuiMoveNormalizedStruct,
  SuiMoveNormalizedType,
} from "@mysten/sui/client";

// key : packageAddress
export type ImportedModuleData = {
  [packageAddress: string]: Map<string, ImportedSuiMoveModule>;
};

export interface ImportedSuiMoveModule {
  address: string;
  moduleName: string;
  functions?: {
    [functionName: string]: SuiMoveNormalizedFunction;
  };
  structs: {
    [structName: string]: SuiMoveNormalizedStruct;
  };
}

// key : structName
export type ModuleStructData = Map<string, SuiMoveStruct>;

export interface SuiMoveStruct extends SuiMoveNormalizedStruct {
  address: string;
  moduleName: string;
  structName: string;
  typeParameterNames: string[];
}

// key : functionName
export type ModuleFunctionData = Map<string, SuiMoveFunction>;

export interface SuiMoveFunction extends SuiMoveNormalizedFunction {
  address: string;
  moduleName: string;
  functionName: string;
  parameterNames: string[];
  typeParameterNames: string[];
  returnNames: string[];
  insideCodes: FunctionInsideCodeLine[];
}

export type FunctionInsideCodeLine =
  | { type: SuiMoveNormalizedType; variableName: string; value: string } // primitive type?
  | (SuiMoveFunction & {
      typeArguments: SuiMoveNormalizedType[];
      variableNames: string[];
    })
  | (SuiMoveStruct & {
      variableName: string;
      typeArguments: SuiMoveNormalizedType[];
      fieldVariableNames: string[];
    });
