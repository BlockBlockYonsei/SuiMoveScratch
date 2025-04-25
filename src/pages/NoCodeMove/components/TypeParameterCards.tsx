import {
  SuiMoveAbility,
  SuiMoveAbilitySet,
  SuiMoveNormalizedFunction,
  SuiMoveNormalizedStruct,
  SuiMoveStructTypeParameter,
} from "@mysten/sui/client";
import { useEffect, useRef, useState } from "react";
import AbilityCard from "./AbilityCard";
import { SuiMoveFunction } from "../_Functions";

interface Props {
  name: string;
  data: SuiMoveNormalizedStruct | SuiMoveFunction;
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
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");

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

      {typeParameters.map((t, i) => {
        const updateAbilitySet = (
          getNewAbilitySet: (
            abilitySet: SuiMoveAbilitySet,
            ability: SuiMoveAbility
          ) => SuiMoveAbilitySet,
          ability: SuiMoveAbility
        ) => {
          if ("constraints" in t) {
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
          } else {
            if ("function" in data) {
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
            }
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

              addTypeParameter(trimmed);
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
