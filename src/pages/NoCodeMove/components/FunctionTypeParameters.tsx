import { useEffect, useRef, useState } from "react";
import { SuiMoveFunction } from "../_Functions";
import ErrorBoundary from "./ErrorBoundary";
import { SYNTAX_COLORS } from "../utils/utils";

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
  const [selectedAbilities, setSelectedAbilities] = useState<{
    [key: number]: string[];
  }>({});
  const [showAbilityDropdown, setShowAbilityDropdown] = useState<{
    [key: number]: boolean;
  }>({});

  const ABILITIES = ["Copy", "Drop", "Store", "Key"] as const;

  // Focus the input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  // Initialize ability tracking for existing type parameters
  useEffect(() => {
    const newSelectedAbilities: { [key: number]: string[] } = {};
    functionData.function.typeParameters.forEach((tp, index) => {
      newSelectedAbilities[index] = tp.abilities || [];
    });
    setSelectedAbilities(newSelectedAbilities);
  }, [functionData.function.typeParameters]);

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

      // Update local state
      setSelectedAbilities((prev) => ({
        ...prev,
        [paramIndex]: currentAbilities,
      }));
    } catch (error) {
      console.error("Error toggling ability:", error);
    }
  };

  // Remove a type parameter
  const removeTypeParameter = (paramIndex: number) => {
    try {
      let newFunctionData = { ...functionData };
      newFunctionData.function.typeParameters.splice(paramIndex, 1);

      setFunctions((prev) => ({
        ...prev,
        [functionName]: newFunctionData,
      }));

      setTypeParameterNames((prev) =>
        prev.filter((_, index) => index !== paramIndex)
      );

      // Update local state
      const newSelectedAbilities = { ...selectedAbilities };
      delete newSelectedAbilities[paramIndex];
      // Re-index remaining items
      const reindexed: { [key: number]: string[] } = {};
      Object.entries(newSelectedAbilities).forEach(([key, value]) => {
        const index = parseInt(key);
        if (index > paramIndex) {
          reindexed[index - 1] = value;
        } else if (index < paramIndex) {
          reindexed[index] = value;
        }
      });
      setSelectedAbilities(reindexed);
    } catch (error) {
      console.error("Error removing type parameter:", error);
    }
  };

  return (
    <ErrorBoundary>
      <div className="mb-2">
        <span className="font-bold">Type Parameters:</span>

        {/* Add button */}
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
          <div
            key={i}
            className="font-semibold mt-2 border border-gray-300 p-3 rounded-md bg-gray-50"
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`${SYNTAX_COLORS.TYPE} text-lg`}>
                {`T${i}(${typeParameterNames[i] || `param${i}`})`}
              </span>
              <button
                onClick={() => removeTypeParameter(i)}
                className="text-red-500 hover:text-red-700 px-2 py-1 rounded-md hover:bg-red-50"
                title="Remove type parameter"
              >
                ✕
              </button>
            </div>

            {/* Abilities dropdown */}
            <div className="relative">
              <button
                onClick={() =>
                  setShowAbilityDropdown((prev) => ({
                    ...prev,
                    [i]: !prev[i],
                  }))
                }
                className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span>
                  Select Abilities ({selectedAbilities[i]?.length || 0})
                </span>
                <svg
                  className="ml-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Dropdown menu */}
              {showAbilityDropdown[i] && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {ABILITIES.map((ability) => (
                    <div
                      key={ability}
                      className="relative cursor-pointer select-none py-2 px-3 hover:bg-gray-100"
                      onClick={() => toggleAbility(i, ability)}
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={
                            selectedAbilities[i]?.includes(ability) || false
                          }
                          onChange={() => {}} // Handled by onClick
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">
                          {ability}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Display selected abilities */}
            {selectedAbilities[i] && selectedAbilities[i].length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedAbilities[i].map((ability) => (
                  <span
                    key={ability}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  >
                    {ability}
                  </span>
                ))}
              </div>
            )}
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
                if (e.key === "Escape") {
                  setInputValue("");
                  setIsEditing(false);
                }
              }}
              className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
