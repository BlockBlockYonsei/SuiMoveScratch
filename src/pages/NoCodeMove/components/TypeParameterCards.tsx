import {
  SuiMoveAbility,
  SuiMoveAbilitySet,
  SuiMoveNormalizedFunction,
  SuiMoveNormalizedStruct,
  SuiMoveStructTypeParameter,
} from "@mysten/sui/client";
import AbilityCard from "./AbilityCard";
import { SuiMoveFunction } from "../_Functions";
import AddButton from "./AddButton";

interface Props {
  name: string;
  data: SuiMoveNormalizedStruct | SuiMoveFunction;
  // setDatas: React.Dispatch<React.SetStateAction<Record<string, SuiMoveNormalizedStruct> | Record<string, SuiMoveFunction>>>;
  setDatas: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  typeParameterNames: string[];
  typeParameters: SuiMoveStructTypeParameter[] | SuiMoveAbilitySet[];
  addTypeParameter: (typeParameterName: string) => void;
}
export default function TypeParameterCards({
  name,
  data,
  setDatas,
  typeParameterNames,
  typeParameters,
  addTypeParameter,
}: Props) {
  return (
    <div>
      <AddButton
        buttonClass=""
        inputClass=""
        title="타입 파라미터 추가"
        placeholder="타입 파라미터 이름을 입력하세요"
        callback={addTypeParameter}
      />
      {typeParameters.map((t, i) => {
        const updateAbilitySet = (
          getNewAbilitySet: (
            abilitySet: SuiMoveAbilitySet,
            ability: SuiMoveAbility
          ) => SuiMoveAbilitySet,
          ability: SuiMoveAbility
        ) => {
          if ("function" in data && !("constraints" in t)) {
            const newAbilitySet = getNewAbilitySet(t, ability);
            const newTypeParameter = newAbilitySet;

            function isAbilitySet(
              item: SuiMoveStructTypeParameter | SuiMoveAbilitySet
            ): item is SuiMoveAbilitySet {
              return "abilities" in item;
            }

            const onlyAbilitySets = typeParameters.filter(isAbilitySet);

            const newTypeParameters = [
              ...onlyAbilitySets.slice(0, i),
              newTypeParameter,
              ...onlyAbilitySets.slice(i + 1),
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
          } else if ("constraints" in t) {
            const newAbilitySet = getNewAbilitySet(t.constraints, ability);
            const newTypeParameter = {
              ...t,
              constraints: newAbilitySet,
            };
            const newTypeParameters = [
              ...typeParameters.slice(0, i),
              newTypeParameter,
              ...typeParameters.slice(i + 1),
            ];

            const newtData = {
              ...data,
              typeParameters: newTypeParameters,
            };

            setDatas((prev) => ({
              ...prev,
              [name]: newtData,
            }));
          }
        };
        return (
          <div key={i} className="font-semibold">
            <span>{`T${i}(${typeParameterNames[i]}): `}</span>
            {"constraints" in t ? (
              <AbilityCard
                updateAbilitySet={updateAbilitySet}
                abilitySet={t.constraints}
              />
            ) : (
              <AbilityCard updateAbilitySet={updateAbilitySet} abilitySet={t} />
            )}
          </div>
        );
      })}
    </div>
  );
}
