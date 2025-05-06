import {
  SuiMoveAbility,
  SuiMoveAbilitySet,
  SuiMoveNormalizedStruct,
  SuiMoveNormalizedType,
  SuiMoveStructTypeParameter,
} from "@mysten/sui/client";
import { ImportsType, StructsType } from "./move";

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

export interface AbilityCardProps {
  abilitySet: SuiMoveAbilitySet;
  updateAbilitySet: (
    getNewAbilitySet: (
      abilitySet: SuiMoveAbilitySet,
      ability: SuiMoveAbility,
    ) => SuiMoveAbilitySet,
    ...args: any[]
  ) => any;
}

export interface TypeButtonProps {
  imports: ImportsType;
  structs: StructsType;
  typeParameters: SuiMoveStructTypeParameter[] | SuiMoveAbilitySet[];
  type: SuiMoveNormalizedType;
  setType: (arg0: SuiMoveNormalizedType) => void;
}
