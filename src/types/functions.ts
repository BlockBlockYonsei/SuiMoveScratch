import {
  SuiMoveNormalizedFunction,
  SuiMoveNormalizedStruct,
} from "@mysten/sui/client";
import { SuiMoveFunction } from "./move";

// 공통으로 사용되는 기본 타입들
export type ImportsType = Record<
  string,
  Record<
    string,
    SuiMoveNormalizedStruct | Record<string, SuiMoveNormalizedFunction>
  >
>;

export type FunctionsType = Record<string, SuiMoveFunction>;
export type SetFunctionsType = React.Dispatch<
  React.SetStateAction<FunctionsType>
>;
export type SetStringArrayType = React.Dispatch<React.SetStateAction<string[]>>;

// 공통으로 사용되는 기본 Props 인터페이스
interface BaseFunctionProps {
  functionName: string;
  functionData: SuiMoveFunction;
  setFunctions: SetFunctionsType;
}

interface BaseFunctionWithImportsProps extends BaseFunctionProps {
  imports: ImportsType;
  structs: Record<string, SuiMoveNormalizedStruct>;
}

// 각 컴포넌트별 Props 인터페이스
export interface FunctionInfoProps extends BaseFunctionProps {}

export interface FunctionModalProps {
  imports: ImportsType;
  functions: FunctionsType;
  addCode: (funcName: string, funcData: SuiMoveNormalizedFunction) => void;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface FunctionReturnsProps extends BaseFunctionWithImportsProps {}

export interface FunctionTypeParametersProps extends BaseFunctionProps {
  typeParameterNames: string[];
  setTypeParameterNames: SetStringArrayType;
}

export interface FunctionParametersProps extends BaseFunctionWithImportsProps {
  parameterNames: string[];
  setParameterNames: SetStringArrayType;
}

export interface FunctionCodesProps extends BaseFunctionWithImportsProps {
  functions: FunctionsType;
}

export interface FunctionCardProps extends BaseFunctionWithImportsProps {
  functions: FunctionsType;
}
