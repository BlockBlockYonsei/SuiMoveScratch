import {
  SuiMoveAbility,
  SuiMoveAbilitySet,
  SuiMoveNormalizedFunction,
  SuiMoveNormalizedStruct,
} from "@mysten/sui/client";
import AbilityCard from "./AbilityCard";
import { SuiMoveFunction } from "../_Functions";
import AddButton from "./AddButton";

interface Props<T extends SuiMoveNormalizedStruct | SuiMoveFunction> {
  name: string;
  data: T;
  setDatas: React.Dispatch<React.SetStateAction<Record<string, T>>>;
  typeParameterNames: string[];
  addTypeParameter: (typeParameterName: string) => void;
}
export default function TypeParameters<
  T extends SuiMoveNormalizedStruct | SuiMoveFunction
>({ name, data, setDatas, typeParameterNames, addTypeParameter }: Props<T>) {
  return (
    <div>
      <AddButton
        buttonClass=""
        inputClass=""
        title="타입 파라미터 추가"
        placeholder="타입 파라미터 이름을 입력하세요"
        callback={addTypeParameter}
      />

      {"function" in data
        ? data.function.typeParameters.map((t, i) => {
            const updateAbilitySet = (
              getNewAbilitySet: (
                abilitySet: SuiMoveAbilitySet,
                ability: SuiMoveAbility
              ) => SuiMoveAbilitySet,
              ability: SuiMoveAbility
            ) => {
              const newTypeParameter = getNewAbilitySet(t, ability);

              const newTypeParameters = [
                ...data.function.typeParameters.slice(0, i),
                newTypeParameter,
                ...data.function.typeParameters.slice(i + 1),
              ];
              const newNormalizedFunctionData: SuiMoveNormalizedFunction = {
                ...data.function,
                typeParameters: newTypeParameters,
              };
              const newData = {
                ...data,
                function: newNormalizedFunctionData,
              };
              setDatas((prev) => ({
                ...prev,
                [name]: newData,
              }));
            };
            return (
              <div key={i} className="font-semibold">
                <span>{`T${i}(${typeParameterNames[i]}): `}</span>
                <AbilityCard
                  updateAbilitySet={updateAbilitySet}
                  abilitySet={t}
                />
              </div>
            );
          })
        : data.typeParameters.map((t, i) => {
            const updateAbilitySet = (
              getNewAbilitySet: (
                abilitySet: SuiMoveAbilitySet,
                ability: SuiMoveAbility
              ) => SuiMoveAbilitySet,
              ability: SuiMoveAbility
            ) => {
              const newAbilitySet = getNewAbilitySet(t.constraints, ability);
              const newTypeParameter = {
                ...t,
                constraints: newAbilitySet,
              };
              const newTypeParameters = [
                ...data.typeParameters.slice(0, i),
                newTypeParameter,
                ...data.typeParameters.slice(i + 1),
              ];
              const newtData = {
                ...data,
                typeParameters: newTypeParameters,
              };
              setDatas((prev) => ({
                ...prev,
                [name]: newtData,
              }));
            };
            return (
              <div key={i} className="font-semibold">
                <span>{`T${i}(${typeParameterNames[i]}): `}</span>
                <AbilityCard
                  updateAbilitySet={updateAbilitySet}
                  abilitySet={t.constraints}
                />
              </div>
            );
          })}
    </div>
  );
}
