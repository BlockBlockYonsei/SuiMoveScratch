import {
  SuiMoveAbilitySet,
  SuiMoveNormalizedStruct,
  SuiMoveStructTypeParameter,
} from "@mysten/sui/client";
import { useEffect, useRef, useState } from "react";
import ErrorBoundary from "./ErrorBoundary";
import { SYNTAX_COLORS } from "../utils";

interface Props {
  structName: string;
  structData: SuiMoveNormalizedStruct;
  typeParameterNames: string[];
  setStructs: React.Dispatch<
    React.SetStateAction<Record<string, SuiMoveNormalizedStruct>>
  >;
  setTypeParameterNames: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function StructTypeParameters({
  structName,
  structData,
  typeParameterNames,
  setStructs,
  setTypeParameterNames,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");
  const ABILITIES = ["Copy", "Drop", "Store", "Key"] as const;

  // Focus the input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  // Add a new type parameter
  const addTypeParameter = () => {
    try {
      const trimmed = inputValue.trim();
      if (!trimmed) return;

      // Add the type parameter name to the names array
      setTypeParameterNames((prev) => [...prev, trimmed]);

      // Create a new type parameter with empty constraints
      const newTypeParameter: SuiMoveStructTypeParameter = {
        constraints: { abilities: [] },
        isPhantom: false,
      };

      // Update the struct data with the new type parameter
      const newStructData = {
        ...structData,
        typeParameters: [...structData.typeParameters, newTypeParameter],
      };

      // Set the updated struct data
      setStructs((prev) => ({
        ...prev,
        [structName]: newStructData,
      }));

      setInputValue("");
      setIsEditing(false);
    } catch (error) {
      console.error("Error adding type parameter:", error);
    }
  };

  // Toggle ability in constraints
  const toggleAbility = (paramIndex: number, ability: string) => {
    try {
      // Get the current type parameter
      const typeParam = structData.typeParameters[
        paramIndex
      ] as SuiMoveStructTypeParameter;

      // Check if ability is already in constraints
      const abilityIndex = typeParam.constraints.abilities.indexOf(ability);

      // Create new abilities array
      let newAbilities: string[];

      if (abilityIndex >= 0) {
        // Remove ability if it exists
        newAbilities = [
          ...typeParam.constraints.abilities.slice(0, abilityIndex),
          ...typeParam.constraints.abilities.slice(abilityIndex + 1),
        ];
      } else {
        // Add ability if it doesn't exist
        newAbilities = [...typeParam.constraints.abilities, ability];
      }

      // Create new constraints
      const newConstraints: SuiMoveAbilitySet = {
        abilities: newAbilities,
      };

      // Create new type parameter with updated constraints
      const newTypeParameter: SuiMoveStructTypeParameter = {
        ...typeParam,
        constraints: newConstraints,
      };

      // Update the type parameters array in the struct
      const newTypeParameters = [
        ...structData.typeParameters.slice(0, paramIndex),
        newTypeParameter,
        ...structData.typeParameters.slice(paramIndex + 1),
      ];

      // Update the struct data with the new type parameters
      const newStructData = {
        ...structData,
        typeParameters: newTypeParameters,
      };

      // Set the updated struct data
      setStructs((prev) => ({
        ...prev,
        [structName]: newStructData,
      }));
    } catch (error) {
      console.error("Error toggling ability:", error);
    }
  };

  return (
    <ErrorBoundary>
      <div>
        <button
          onClick={() => setIsEditing(true)}
          className="border-2 border-blue-500 px-2 rounded-md cursor-pointer hover:bg-blue-600 transition"
        >
          ➕ 타입 파라미터 추가
        </button>

        {/* Display existing type parameters */}
        {structData.typeParameters.map((t, i) => {
          const typeParam = t as SuiMoveStructTypeParameter;
          return (
            <div key={i} className="font-semibold mt-2">
              <span className={SYNTAX_COLORS.TYPE}>{`T${i}(${
                typeParameterNames[i] || `param${i}`
              }): `}</span>
              {ABILITIES.map((ability) => (
                <button
                  key={ability}
                  onClick={() => toggleAbility(i, ability)}
                  className={`border-2 border-black px-1 rounded-md cursor-pointer ${
                    typeParam.constraints.abilities.includes(ability)
                      ? "bg-emerald-300"
                      : ""
                  }`}
                >
                  {ability}
                </button>
              ))}{" "}
            </div>
          );
        })}

        {/* Input field for adding a new type parameter */}
        {isEditing && (
          <input
            ref={inputRef}
            value={inputValue}
            placeholder="Type Parameter Name을 입력하세요."
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={() => {
              setInputValue("");
              setIsEditing(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addTypeParameter();
              }
            }}
            className="block mt-2 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none"
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
