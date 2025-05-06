import { useEffect, useRef, useState } from "react";
import { SuiMoveFunction } from "../_Functions";
import ErrorBoundary from "./ErrorBoundary";
import { SYNTAX_COLORS } from "../utils";

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
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
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

      let newFunctionData = { ...functionData };
      newFunctionData.function.typeParameters.push({ abilities: [] });

      setFunctions((prev) => ({
        ...prev,
        [functionName]: newFunctionData,
      }));

      setTypeParameterNames((prev) => [...prev, trimmed]);
      setInputValue("");
      setIsEditing(false);
    } catch (error) {
      console.error("Error adding type parameter:", error);
    }
  };

  // Toggle ability for a type parameter
  const toggleAbility = (paramIndex: number, ability: string) => {
    try {
      let newFunctionData = { ...functionData };
      const currentAbilities = [
        ...newFunctionData.function.typeParameters[paramIndex].abilities,
      ];

      // Check if ability is already in the list
      const abilityIndex = currentAbilities.indexOf(ability);

      if (abilityIndex >= 0) {
        // Remove ability if it exists
        currentAbilities.splice(abilityIndex, 1);
      } else {
        // Add ability if it doesn't exist
        currentAbilities.push(ability);
      }

      newFunctionData.function.typeParameters[paramIndex].abilities =
        currentAbilities;

      setFunctions((prev) => ({
        ...prev,
        [functionName]: newFunctionData,
      }));
    } catch (error) {
      console.error("Error toggling ability:", error);
    }
  };

  return (
    <ErrorBoundary>
      <div className="mb-2">
        <span className="font-bold">Type Parameters:</span>
        {!isEditing && (
          <span>
            <button
              onClick={() => setIsEditing(true)}
              className="ml-2 border-2 border-blue-500 px-2 rounded-md cursor-pointer hover:bg-blue-600 transition"
            >
              ➕ 타입 파라미터 추가
            </button>
          </span>
        )}

        {/* Display existing type parameters */}
        {functionData.function.typeParameters.map((t, i) => (
          <div key={i} className="font-semibold mt-2">
            <span className={SYNTAX_COLORS.TYPE}>{`T${i}(${
              typeParameterNames[i] || `param${i}`
            }): `}</span>
            {
              <span>
                {ABILITIES.map((a) => (
                  <button
                    key={a}
                    onClick={() => toggleAbility(i, a)}
                    className={`border-2 border-black px-1 rounded-md cursor-pointer ${
                      t.abilities.includes(a) ? "bg-emerald-300" : ""
                    }`}
                  >
                    {a}
                  </button>
                ))}{" "}
              </span>
            }
          </div>
        ))}

        {/* Input field for adding a new type parameter */}
        {isEditing && (
          <div className="mt-2">
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
              className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none"
            />
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
