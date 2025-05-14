import {
  SuiMoveAbilitySet,
  SuiMoveNormalizedStruct,
  SuiMoveNormalizedType,
} from "@mysten/sui/client";
import { useState } from "react";
import { SuiMoveFunction } from "../_Functions";
import ErrorBoundary from "./ErrorBoundary";
import { SYNTAX_COLORS } from "../utils/utils";
import FunctionParameters from "./FunctionParameters";
import FunctionReturns from "./FunctionReturns";
import FunctionTypeParameters from "./FunctionTypeParameters";
import FunctionCodes from "./FunctionCodes";

interface Props {
  functionName: string;
  functionData: SuiMoveFunction;
  imports: Record<string, Record<string, SuiMoveNormalizedStruct>>;
  structs: Record<string, SuiMoveNormalizedStruct>;
  setFunctions: React.Dispatch<
    React.SetStateAction<Record<string, SuiMoveFunction>>
  >;
}

export default function FunctionCard({
  functionName,
  functionData,
  imports,
  structs,
  setFunctions,
}: Props) {
  const [typeParameterNames, setTypeParameterNames] = useState<string[]>([]);
  const [selectedVisibility, setSelectedVisibility] = useState<string>(
    functionData.function.visibility || "Private"
  );
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const visibilityOptions = ["Public", "Private", "Friend"];

  // Toggle entry function property
  const toggleEntry = () => {
    try {
      const newFunctionData = { ...functionData };
      newFunctionData.function.isEntry = !functionData.function.isEntry;
      setFunctions((prev) => ({
        ...prev,
        [functionName]: newFunctionData,
      }));
    } catch (error) {
      console.error("Error toggling entry function:", error);
    }
  };

  // Change function visibility
  const changeVisibility = (newVisibility: string) => {
    try {
      const newFunctionData = { ...functionData };
      newFunctionData.function.visibility = newVisibility;
      setFunctions((prev) => ({
        ...prev,
        [functionName]: newFunctionData,
      }));
      setSelectedVisibility(newVisibility);
    } catch (error) {
      console.error("Error changing function visibility:", error);
    }
  };

  // Delete function
  const deleteFunction = () => {
    try {
      setFunctions((prev) => {
        const newFunctions = { ...prev };
        delete newFunctions[functionName];
        return newFunctions;
      });
    } catch (error) {
      console.error("Error deleting function:", error);
    }
  };

  // Get type parameter display with abilities
  const getTypeParameterDisplay = (index: number) => {
    const typeParam = functionData.function.typeParameters[index];
    const name = typeParameterNames[index] || `T${index}`;
    const abilities =
      typeParam.abilities?.length > 0
        ? `: ${typeParam.abilities.join(" + ")}`
        : "";
    return `${name}${abilities}`;
  };

  return (
    <ErrorBoundary>
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-4">
        {/* Header with function signature */}
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
              {/* Visibility dropdown */}
              <select
                value={selectedVisibility}
                onChange={(e) => changeVisibility(e.target.value)}
                className={`px-3 py-1 border border-gray-300 rounded-md cursor-pointer text-sm ${SYNTAX_COLORS.KEYWORD}`}
              >
                {visibilityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option.toLowerCase()}
                  </option>
                ))}
              </select>

              {/* Entry toggle */}
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={functionData.function.isEntry}
                  onChange={toggleEntry}
                  className="sr-only peer"
                />
                <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ml-2 text-xs text-gray-600">entry</span>
              </label>

              <span className={`${SYNTAX_COLORS.FUNCTION} font-bold text-lg`}>
                fun
              </span>
              <span className="text-emerald-500 font-bold text-lg">
                {functionName}
              </span>

              {/* Type parameters display */}
              {functionData.function.typeParameters.length > 0 && (
                <span className="text-purple-500 text-sm">
                  &lt;
                  {functionData.function.typeParameters.map((_, i) => (
                    <span key={i}>
                      {i > 0 && ", "}
                      {getTypeParameterDisplay(i)}
                    </span>
                  ))}
                  &gt;
                </span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-md text-sm"
              title="Delete function"
            >
              🗑️
            </button>
          </div>
        </div>

        {/* Delete confirmation modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
              <h3 className="text-lg font-semibold mb-2">Delete Function</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete function "{functionName}"? This
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
                    deleteFunction();
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

        {/* Collapsible content */}
        {!isCollapsed && (
          <div className="space-y-4">
            {/* Type parameters section */}
            <div className="bg-gray-50 rounded-md p-3">
              <h3 className="font-semibold text-sm text-gray-700 mb-2">
                Type Parameters
              </h3>
              <FunctionTypeParameters
                functionName={functionName}
                functionData={functionData}
                setFunctions={setFunctions}
                typeParameterNames={typeParameterNames}
                setTypeParameterNames={setTypeParameterNames}
              />
            </div>

            {/* Parameters section */}
            <div className="bg-gray-50 rounded-md p-3">
              <h3 className="font-semibold text-sm text-gray-700 mb-2">
                Parameters
              </h3>
              <FunctionParameters
                functionName={functionName}
                functionData={functionData}
                imports={imports}
                structs={structs}
                setFunctions={setFunctions}
              />
            </div>

            {/* Returns section */}
            <div className="bg-gray-50 rounded-md p-3">
              <h3 className="font-semibold text-sm text-gray-700 mb-2">
                Returns
              </h3>
              <FunctionReturns
                functionName={functionName}
                functionData={functionData}
                imports={imports}
                structs={structs}
                setFunctions={setFunctions}
              />
            </div>

            {/* Function Implementation Code section */}
            <div className="bg-gray-50 rounded-md p-3">
              <h3 className="font-semibold text-sm text-gray-700 mb-2">
                Implementation
              </h3>
              <FunctionCodes
                imports={imports}
                structs={structs}
                functions={functionData}
                functionName={functionName}
                functionData={functionData}
                setFunctions={setFunctions}
              />
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
