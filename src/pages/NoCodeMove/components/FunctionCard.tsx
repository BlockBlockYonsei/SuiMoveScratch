import { SuiMoveNormalizedStruct } from "@mysten/sui/client";
import { useState } from "react";
import { SuiMoveFunction } from "../_Functions";
import ErrorBoundary from "./ErrorBoundary";
import { SYNTAX_COLORS } from "../utils";
import FunctionParameters from "./FunctionParameters";
import FunctionReturns from "./FunctionReturns";
import FunctionTypeParameters from "./FunctionTypeParameters";

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

  return (
    <ErrorBoundary>
      <div>
        {/* Visibility dropdown and function name */}
        <div className="flex items-center mb-4">
          <div className="relative">
            <select
              value={selectedVisibility}
              onChange={(e) => changeVisibility(e.target.value)}
              className={`px-4 py-2 border rounded-lg cursor-pointer mr-2 ${SYNTAX_COLORS.KEYWORD}`}
            >
              {visibilityOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className={`${SYNTAX_COLORS.FUNCTION} font-bold text-xl`}>
            fun <span className="text-emerald-500">{functionName}</span>
          </div>

          {/* Entry function toggle */}
          <div className="ml-4 flex items-center">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={functionData.function.isEntry}
                onChange={toggleEntry}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                entry
              </span>
            </label>
          </div>
        </div>

        {/* Type parameters section */}
        <div className="mb-4">
          <FunctionTypeParameters
            functionName={functionName}
            functionData={functionData}
            setFunctions={setFunctions}
            typeParameterNames={typeParameterNames}
            setTypeParameterNames={setTypeParameterNames}
          />
        </div>

        {/* Parameters section */}
        <div className="mb-4">
          <div className="font-bold mb-2">Parameters:</div>
          <div className="ml-4">
            <FunctionParameters
              functionName={functionName}
              functionData={functionData}
              imports={imports}
              structs={structs}
              setFunctions={setFunctions}
            />
          </div>
        </div>

        {/* Returns section */}
        <div className="mb-4">
          <div className="font-bold mb-2">Returns:</div>
          <div className="ml-4">
            <FunctionReturns
              functionName={functionName}
              functionData={functionData}
              imports={imports}
              structs={structs}
              setFunctions={setFunctions}
            />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
