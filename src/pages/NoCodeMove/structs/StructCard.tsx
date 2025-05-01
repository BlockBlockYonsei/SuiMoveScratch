import {
  SuiMoveAbility,
  SuiMoveAbilitySet,
  SuiMoveNormalizedFunction,
  SuiMoveNormalizedStruct,
} from "@mysten/sui/client";
import StructFields from "./StructFields";
import AbilityCard from "../components/AbilityCard";
import { useState } from "react";
import StructTypeParameters from "./StructTypeParameters";

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
      <StructTypeParameters
        structName={structName}
        structData={structData}
        setStructs={setStructs}
        typeParameterNames={typeParameterNames}
        setTypeParameterNames={setTypeParameterNames}
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
