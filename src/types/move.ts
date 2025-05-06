import {
  SuiMoveAbilitySet,
  SuiMoveNormalizedFunction,
  SuiMoveNormalizedStruct,
  SuiMoveNormalizedType,
  SuiMoveStructTypeParameter,
} from "@mysten/sui/client";

export type SuiMoveFunction = {
  function: SuiMoveNormalizedFunction;
  insideCode: Record<string, SuiMoveNormalizedFunction>;
};

export type ImportsType = Record<
  string,
  Record<
    string,
    SuiMoveNormalizedStruct | Record<string, SuiMoveNormalizedFunction>
  >
>;

export type StructsType = Record<string, SuiMoveNormalizedStruct>;

export type FunctionsType = Record<string, SuiMoveFunction>;

export interface BaseProps {
  imports: ImportsType;
  structs: StructsType;
}

export interface StructsProps extends BaseProps {
  setStructs: React.Dispatch<React.SetStateAction<StructsType>>;
}

export interface FunctionsProps extends BaseProps {
  functions: FunctionsType;
  setFunctions: React.Dispatch<React.SetStateAction<FunctionsType>>;
}

export interface ImportsProps {
  imports: ImportsType;
  setImports: React.Dispatch<React.SetStateAction<ImportsType>>;
}

// Component Props Types
export interface AddButtonProps {
  buttonClass?: string;
  inputClass?: string;
  title: string;
  placeholder: string;
  callback: (name: string) => void;
}

export interface TypeModalProps {
  imports: ImportsType;
  structs: StructsType;
  typeParameters: SuiMoveStructTypeParameter[] | SuiMoveAbilitySet[];
  setType: (type: SuiMoveNormalizedType) => void;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface TypeSelectProps {
  imports: Record<string, Record<string, SuiMoveNormalizedStruct>>;
  structs: StructsType;
  typeParameters: SuiMoveStructTypeParameter[];
  setType: (type: SuiMoveNormalizedType) => void;
}
