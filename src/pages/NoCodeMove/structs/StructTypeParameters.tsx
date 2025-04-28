import {
  SuiMoveAbility,
  SuiMoveAbilitySet,
  SuiMoveNormalizedStruct,
  SuiMoveStructTypeParameter,
} from "@mysten/sui/client";
import AbilityCard from "../components/AbilityCard";
import AddButton from "../components/AddButton";

interface Props {
  structName: string;
  structData: SuiMoveNormalizedStruct;
  setStructs: React.Dispatch<
    React.SetStateAction<Record<string, SuiMoveNormalizedStruct>>
  >;
  typeParameterNames: string[];
  setTypeParameterNames: React.Dispatch<React.SetStateAction<string[]>>;
}
export default function StructTypeParameters({
  structName,
  structData,
  setStructs,
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
          const newTypeParmeter: SuiMoveStructTypeParameter = {
            constraints: { abilities: [] },
            isPhantom: false,
          };
          const newStructData = {
            ...structData,
            typeParameters: [...structData.typeParameters, newTypeParmeter],
          };
          setStructs((prev) => ({
            ...prev,
            [structName]: newStructData,
          }));
          setTypeParameterNames((prev) => [...prev, name]);
        }}
      />

      {structData.typeParameters.map((t, i) => {
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
            ...structData.typeParameters.slice(0, i),
            newTypeParameter,
            ...structData.typeParameters.slice(i + 1),
          ];
          const newtData = {
            ...structData,
            typeParameters: newTypeParameters,
          };
          setStructs((prev) => ({
            ...prev,
            [structName]: newtData,
          }));
        };
        return (
          <div key={i}>
            <span className="text-lg font-semibold">
              {`T${i}`}(
              <span className="text-blue-500 ">{`${typeParameterNames[i]}`}</span>
              ):
            </span>
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
