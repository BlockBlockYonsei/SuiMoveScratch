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

// export type ModuleFunctionData = SuiMoveFunction[];
export type ModuleFunctionData = Map<string, SuiMoveFunction>;

export interface SuiMoveFunction extends SuiMoveNormalizedFunction {
  address: string;
  moduleName: string;
  functionName: string;
  parameterNames: string[];
  typeParameterNames: string[];
  insideCode: FunctionInsideCodeLine[];
}

export type FunctionInsideCodeLine =
  | (SuiMoveFunction & {
      returnNames: string[];
      typeArguments: SuiMoveNormalizedType[];
    })
  | SuiMoveNormalizedType
  | SuiMoveStruct;
