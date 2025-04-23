import {
  SuiMoveAbilitySet,
  SuiMoveNormalizedStruct,
  SuiMoveStructTypeParameter,
} from "@mysten/sui/client";
import { useEffect, useRef, useState } from "react";

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

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div>
      <button
        onClick={() => setIsEditing(true)}
        className="border-2 border-blue-500 px-2 rounded-md cursor-pointer hover:bg-blue-600 transition"
      >
        ➕ 타입 파라미터 추가
      </button>

      {structData.typeParameters.map((t, i) => (
        <div key={i} className="font-semibold">
          <span>{`T${i}(${typeParameterNames[i]}): `}</span>
          {ABILITIES.map((ability) => (
            <button
              key={ability}
              onClick={() => {
                // updateAbility(ability);
                const index = t.constraints.abilities.indexOf(ability);
                const newAbilities: SuiMoveAbilitySet = {
                  abilities:
                    index >= 0
                      ? [
                          ...t.constraints.abilities.slice(0, index),
                          ...t.constraints.abilities.slice(index + 1),
                        ]
                      : [...t.constraints.abilities, ability],
                };
                const newTypeParameter: SuiMoveStructTypeParameter = {
                  ...t,
                  constraints: newAbilities,
                };

                const newTypeParameters = [
                  ...structData.typeParameters.slice(0, i),
                  newTypeParameter,
                  ...structData.typeParameters.slice(i + 1),
                ];

                const newStructData = {
                  ...structData,
                  typeParameters: newTypeParameters,
                };

                setStructs((prev) => ({
                  ...prev,
                  [structName]: newStructData,
                }));
              }}
              className={`border-2 border-black px-1 rounded-md cursor-pointer ${
                t.constraints.abilities.includes(ability)
                  ? "bg-emerald-300"
                  : ""
              }`}
            >
              {ability}
            </button>
          ))}{" "}
        </div>
      ))}
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
            if (e.key !== "Enter") return;

            try {
              const trimmed = inputValue.trim();
              if (!trimmed) return;

              setTypeParameterNames((prev) => [...prev, trimmed]);

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
            } finally {
              setInputValue("");
              setIsEditing(false);
            }
          }}
          className="block px-3 py-2 border border-gray-300 rounded-xl focus:outline-none"
        />
      )}
    </div>
  );
}
