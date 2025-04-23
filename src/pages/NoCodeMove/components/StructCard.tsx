import { SuiMoveAbility, SuiMoveNormalizedStruct } from "@mysten/sui/client";
import { useState } from "react";
import StructTypeParameters from "./StructTypeParameters";
import StructFields from "./StructFields";

interface Props {
  key?: React.Key | null | undefined;
  imports: Record<string, Record<string, SuiMoveNormalizedStruct>>;
  structs: Record<string, SuiMoveNormalizedStruct>;
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

  const ABILITIES = ["Copy", "Drop", "Store", "Key"] as const;

  const updateAbility = (ability: SuiMoveAbility) => {
    const index = structData.abilities.abilities.indexOf(ability);
    const newAbilities = {
      abilities:
        index >= 0
          ? [
              ...structData.abilities.abilities.slice(0, index),
              ...structData.abilities.abilities.slice(index + 1),
            ]
          : [...structData.abilities.abilities, ability],
    };
    const newStructData = {
      ...structData,
      abilities: newAbilities,
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
        {ABILITIES.map((ability) => (
          <button
            key={ability}
            onClick={() => {
              updateAbility(ability);
            }}
            className={`border-2 border-black px-1 rounded-md cursor-pointer ${
              structData.abilities.abilities.includes(ability)
                ? "bg-emerald-300"
                : ""
            }`}
          >
            {ability}
          </button>
        ))}{" "}
        &#123;
      </div>
      <div className="font-bold">Type Parameters:</div>
      <StructTypeParameters
        structName={structName}
        structData={structData}
        typeParameterNames={typeParameterNames}
        setStructs={setStructs}
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
