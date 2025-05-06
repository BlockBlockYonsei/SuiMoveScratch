import {
  SuiMoveAbility,
  SuiMoveAbilitySet,
  SuiMoveNormalizedFunction,
} from "@mysten/sui/client";
import AbilityCard from "../components/AbilityCard";
import { SuiMoveFunction } from "@/types/move";
import AddButton from "../components/AddButton";

interface Props {
  functionName: string;
  functionData: SuiMoveFunction;
  setFunctions: React.Dispatch<
    React.SetStateAction<Record<string, SuiMoveFunction>>
  >;
  typeParameterNames: string[];
  setTypeParameterNames: React.Dispatch<React.SetStateAction<string[]>>;
}
export default function FunctionTypeParameters({
  functionName,
  functionData,
  setFunctions,
  typeParameterNames,
  setTypeParameterNames,
}: Props) {
  return (
    <div>
      <AddButton
        buttonClass=""
        inputClass=""
        title="타입 파라미터 추가"
        placeholder="타입 파라미터 이름을 입력하세요"
        callback={(name: string) => {
          const newTypeParmeter: SuiMoveAbilitySet = {
            abilities: [],
          };
          const newFunctionData = {
            ...functionData,
            function: {
              ...functionData.function,
              typeParameters: [
                ...functionData.function.typeParameters,
                newTypeParmeter,
              ],
            },
          };
          setFunctions((prev) => ({
            ...prev,
            [functionName]: newFunctionData,
          }));
          setTypeParameterNames((prev) => [...prev, name]);
        }}
      />

      {functionData.function.typeParameters.map((t, i) => {
        const updateAbilitySet = (
          getNewAbilitySet: (
            abilitySet: SuiMoveAbilitySet,
            ability: SuiMoveAbility,
          ) => SuiMoveAbilitySet,
          ability: SuiMoveAbility,
        ) => {
          const newTypeParameter = getNewAbilitySet(t, ability);

          const newTypeParameters = [
            ...functionData.function.typeParameters.slice(0, i),
            newTypeParameter,
            ...functionData.function.typeParameters.slice(i + 1),
          ];
          const newNormalizedFunctionData: SuiMoveNormalizedFunction = {
            ...functionData.function,
            typeParameters: newTypeParameters,
          };
          const newData = {
            ...functionData,
            function: newNormalizedFunctionData,
          };
          setFunctions((prev) => ({
            ...prev,
            [functionName]: newData,
          }));
        };
        return (
          <div key={i}>
            <span className="text-lg font-semibold">
              {`T${i}`}(
              <span className="text-blue-500 ">{`${typeParameterNames[i]}`}</span>
              ):
            </span>
            <AbilityCard updateAbilitySet={updateAbilitySet} abilitySet={t} />
          </div>
        );
      })}
    </div>
  );
}
