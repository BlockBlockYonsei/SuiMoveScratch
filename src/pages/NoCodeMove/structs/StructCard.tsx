import {
  SuiMoveAbility,
  SuiMoveAbilitySet,
  SuiMoveNormalizedFunction,
  SuiMoveNormalizedStruct,
  SuiMoveStructTypeParameter,
} from "@mysten/sui/client";
import { useState } from "react";
import StructFields from "./StructFields";
import TypeParameterCards from "../components/TypeParameterCards";
import AbilityCard from "../components/AbilityCard";

interface Props {
  key?: React.Key | null | undefined;
  imports: Record<
    string,
    Record<
      string,
      SuiMoveNormalizedStruct | Record<string, SuiMoveNormalizedFunction>
    >
  >;
  structs: Record<string, SuiMoveNormalizedStruct>; // 여기에선 필요 없는데 StructFields 에서 필요
  structName: string;
  structData: SuiMoveNormalizedStruct;
  setStructs: React.Dispatch<
    React.SetStateAction<Record<string, SuiMoveNormalizedStruct>>
  >;
}

export default function StructCard({
  key,
  imports,
  structs,
  structName,
  structData,
  setStructs,
}: Props) {
  const [typeParameterNames, setTypeParameterNames] = useState<string[]>([]);

  const updateAbilitySet = (
    getNewAbilitySet: (
      abilitySet: SuiMoveAbilitySet,
      ability: SuiMoveAbility
    ) => SuiMoveAbilitySet,
    ability: SuiMoveAbility
  ) => {
    const newAbilitySet = getNewAbilitySet(structData.abilities, ability);
    const newStructData = {
      ...structData,
      abilities: newAbilitySet,
    };

    setStructs((prev) => ({
      ...prev,
      [structName]: newStructData,
    }));
  };

  const addTypeParameter = (typeParameterName: string) => {
    setTypeParameterNames((prev) => [...prev, typeParameterName]);

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
  };

  return (
    <div key={key}>
      {/* Struct 이름 및 Abilities */}
      <div>
        <span>{"public struct "}</span>
        <span className="text-emerald-500 text-xl font-semibold">
          {structName}{" "}
        </span>
        <AbilityCard
          updateAbilitySet={updateAbilitySet}
          abilitySet={structData.abilities}
        />
        &#123;
      </div>
      <div className="font-bold">Type Parameters:</div>
      <TypeParameterCards
        name={structName}
        data={structData}
        setDatas={setStructs}
        typeParameterNames={typeParameterNames}
        addTypeParameter={addTypeParameter}
      />

      <div className="font-bold">Fields:</div>
      <StructFields
        imports={imports}
        structs={structs}
        structName={structName}
        structData={structData}
        setStructs={setStructs}
      />
      <div>&#125;</div>
    </div>
  );
}
