import {
  SuiMoveAbilitySet,
  SuiMoveNormalizedStruct,
  SuiMoveStructTypeParameter,
} from "@mysten/sui/client";
import { useEffect, useRef, useState } from "react";
import ErrorBoundary from "./ErrorBoundary";
import { SYNTAX_COLORS } from "../utils/utils";

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
  const [selectedAbilities, setSelectedAbilities] = useState<{
    [key: number]: string[];
  }>({});
  const [showAbilityDropdown, setShowAbilityDropdown] = useState<{
    [key: number]: boolean;
  }>({});
  const [isPhantom, setIsPhantom] = useState<{ [key: number]: boolean }>({});

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
    const newIsPhantom: { [key: number]: boolean } = {};

    structData.typeParameters.forEach((tp, index) => {
      const typeParam = tp as SuiMoveStructTypeParameter;
      newSelectedAbilities[index] = typeParam.constraints?.abilities || [];
      newIsPhantom[index] = typeParam.isPhantom || false;
    });

    setSelectedAbilities(newSelectedAbilities);
    setIsPhantom(newIsPhantom);
  }, [structData.typeParameters]);

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

      // Update local state
      setSelectedAbilities((prev) => ({
        ...prev,
        [paramIndex]: newAbilities,
      }));
    } catch (error) {
      console.error("Error toggling ability:", error);
    }
  };

  // Toggle phantom status
  const togglePhantom = (paramIndex: number) => {
    try {
      const typeParam = structData.typeParameters[
        paramIndex
      ] as SuiMoveStructTypeParameter;
      const newIsPhantom = !typeParam.isPhantom;

      const newTypeParameter: SuiMoveStructTypeParameter = {
        ...typeParam,
        isPhantom: newIsPhantom,
      };

      const newTypeParameters = [
        ...structData.typeParameters.slice(0, paramIndex),
        newTypeParameter,
        ...structData.typeParameters.slice(paramIndex + 1),
      ];

      const newStructData = {
        ...structData,
        typeParameters: newTypeParameters,
      };

      setStructs((prev) => ({
        ...prev,
        [structName]: newStructData,
      }));

      // Update local state
      setIsPhantom((prev) => ({
        ...prev,
        [paramIndex]: newIsPhantom,
      }));
    } catch (error) {
      console.error("Error toggling phantom status:", error);
    }
  };

  // Remove a type parameter
  const removeTypeParameter = (paramIndex: number) => {
    try {
      // Remove from struct data
      const newTypeParameters = structData.typeParameters.filter(
        (_, index) => index !== paramIndex
      );
      const newStructData = {
        ...structData,
        typeParameters: newTypeParameters,
      };

      setStructs((prev) => ({
        ...prev,
        [structName]: newStructData,
      }));

      // Remove from names array
      setTypeParameterNames((prev) =>
        prev.filter((_, index) => index !== paramIndex)
      );

      // Update local state
      const newSelectedAbilities = { ...selectedAbilities };
      const newIsPhantom = { ...isPhantom };
      delete newSelectedAbilities[paramIndex];
      delete newIsPhantom[paramIndex];

      // Re-index remaining items
      const reindexedAbilities: { [key: number]: string[] } = {};
      const reindexedPhantom: { [key: number]: boolean } = {};

      Object.entries(newSelectedAbilities).forEach(([key, value]) => {
        const index = parseInt(key);
        if (index > paramIndex) {
          reindexedAbilities[index - 1] = value;
        } else if (index < paramIndex) {
          reindexedAbilities[index] = value;
        }
      });

      Object.entries(newIsPhantom).forEach(([key, value]) => {
        const index = parseInt(key);
        if (index > paramIndex) {
          reindexedPhantom[index - 1] = value;
        } else if (index < paramIndex) {
          reindexedPhantom[index] = value;
        }
      });

      setSelectedAbilities(reindexedAbilities);
      setIsPhantom(reindexedPhantom);
    } catch (error) {
      console.error("Error removing type parameter:", error);
    }
  };

  return (
    <ErrorBoundary>
      <div>
        <button
          onClick={() => setIsEditing(true)}
          className="border-2 border-blue-500 px-2 rounded-md cursor-pointer hover:bg-blue-600 transition text-white hover:text-white"
        >
          ➕ 타입 파라미터 추가
        </button>

        {/* Display existing type parameters */}
        {structData.typeParameters.map((t, i) => {
          const typeParam = t as SuiMoveStructTypeParameter;
          return (
            <div
              key={i}
              className="font-semibold mt-2 border border-gray-300 p-3 rounded-md bg-gray-50"
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`${SYNTAX_COLORS.TYPE} text-lg`}>
                  {isPhantom[i] && (
                    <span className="text-purple-600 mr-1">phantom </span>
                  )}
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

              {/* Phantom toggle */}
              <div className="mb-2">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPhantom[i] || false}
                    onChange={() => togglePhantom(i)}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    Phantom
                  </span>
                </label>
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
              if (e.key === "Escape") {
                setInputValue("");
                setIsEditing(false);
              }
            }}
            className="block mt-2 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
