import { SuiMoveAbility, SuiMoveNormalizedStruct } from "@mysten/sui/client";
import { useState } from "react";
import StructTypeParameters from "./StructTypeParameters";
import StructFields from "./StructFields";
import ErrorBoundary from "./ErrorBoundary";
import { SYNTAX_COLORS } from "../utils/utils";

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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  // Delete struct
  const deleteStruct = () => {
    try {
      setStructs((prev) => {
        const newStructs = { ...prev };
        delete newStructs[structName];
        return newStructs;
      });
    } catch (error) {
      console.error("Error deleting struct:", error);
    }
  };

  // Get type parameter display with abilities and phantom status
  const getTypeParameterDisplay = (index: number) => {
    const typeParam = structData.typeParameters[index];
    if (!typeParam) return `T${index}`;

    const name = typeParameterNames[index] || `T${index}`;
    const phantom = typeParam.isPhantom ? "phantom " : "";
    const abilities =
      typeParam.constraints?.abilities?.length > 0
        ? `: ${typeParam.constraints.abilities.join(" + ")}`
        : "";
    return `${phantom}${name}${abilities}`;
  };

  return (
    <ErrorBoundary>
      <div
        key={key}
        className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-4"
      >
        {/* Header with struct signature */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-gray-500 hover:text-gray-700 p-1 rounded"
              title={isCollapsed ? "Expand" : "Collapse"}
            >
              {isCollapsed ? "▶" : "▼"}
            </button>
            <div className="flex items-center gap-2">
              <span className={SYNTAX_COLORS.KEYWORD}>public struct</span>
              <span className={`${SYNTAX_COLORS.TYPE} text-xl font-semibold`}>
                {structName}
              </span>

              {/* Type parameters display */}
              {structData.typeParameters.length > 0 && (
                <span className="text-purple-500 text-sm">
                  &lt;
                  {structData.typeParameters.map((_, i) => (
                    <span key={i}>
                      {i > 0 && ", "}
                      {getTypeParameterDisplay(i)}
                    </span>
                  ))}
                  &gt;
                </span>
              )}

              <span className="text-pink-500">has</span>

              {/* Abilities display */}
              <div className="flex flex-wrap gap-2">
                {ABILITIES.map((ability) => (
                  <button
                    key={ability}
                    onClick={() => updateAbility(ability)}
                    className={`px-2 py-1 rounded-md text-xs font-medium cursor-pointer transition ${
                      structData.abilities.abilities.includes(ability)
                        ? "bg-green-100 text-green-800 border border-green-300"
                        : "bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200"
                    }`}
                  >
                    {ability}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-md text-sm"
              title="Delete struct"
            >
              🗑️
            </button>
          </div>
        </div>

        {/* Delete confirmation modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
              <h3 className="text-lg font-semibold mb-2">Delete Struct</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete struct "{structName}"? This
                action cannot be undone.
              </p>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    deleteStruct();
                    setShowDeleteConfirm(false);
                  }}
                  className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {!isCollapsed && (
          <>
            <div className="text-2xl">{`{`}</div>

            {/* Type parameters section */}
            <div className="bg-gray-50 rounded-md p-3 ml-4 mb-4">
              <h3 className="font-semibold text-sm text-gray-700 mb-2">
                Type Parameters:
              </h3>
              <StructTypeParameters
                structName={structName}
                structData={structData}
                typeParameterNames={typeParameterNames}
                setStructs={setStructs}
                setTypeParameterNames={setTypeParameterNames}
              />
            </div>

            {/* Fields section */}
            <div className="bg-gray-50 rounded-md p-3 ml-4 mb-4">
              <h3 className="font-semibold text-sm text-gray-700 mb-2">
                Fields:
              </h3>
              <StructFields
                imports={imports}
                structs={structs}
                structName={structName}
                structData={structData}
                setStructs={setStructs}
              />
            </div>

            <div className="text-2xl mt-2">{`}`}</div>
          </>
        )}
      </div>
    </ErrorBoundary>
  );
}
