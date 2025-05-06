import { SuiMoveAbility, SuiMoveNormalizedStruct } from "@mysten/sui/client";
import { useState } from "react";
import StructTypeParameters from "./StructTypeParameters";
import StructFields from "./StructFields";
import ErrorBoundary from "./ErrorBoundary";
import { SYNTAX_COLORS } from "../utils";

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

  // Function to update struct abilities
  const updateAbility = (ability: SuiMoveAbility) => {
    try {
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
    } catch (error) {
      console.error("Error updating struct ability:", error);
    }
  };

  return (
    <ErrorBoundary>
      <div key={key}>
        {/* Struct name and abilities */}
        <div>
          <span className={SYNTAX_COLORS.KEYWORD}>public struct </span>
          <span className={`${SYNTAX_COLORS.TYPE} text-xl font-semibold`}>
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

        {/* Type parameters section */}
        <div className="font-bold mt-4 ml-4">Type Parameters:</div>
        <div className="ml-8">
          <StructTypeParameters
            structName={structName}
            structData={structData}
            typeParameterNames={typeParameterNames}
            setStructs={setStructs}
            setTypeParameterNames={setTypeParameterNames}
          />
        </div>

        {/* Fields section */}
        <div className="font-bold mt-4 ml-4">Fields:</div>
        <div className="ml-8">
          <StructFields
            imports={imports}
            structs={structs}
            structName={structName}
            structData={structData}
            setStructs={setStructs}
          />
        </div>

        <div className="mt-2">&#125;</div>
      </div>
    </ErrorBoundary>
  );
}
