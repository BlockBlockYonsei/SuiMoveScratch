import {
  SuiMoveNormalizedFunction,
  SuiMoveNormalizedStruct,
} from "@mysten/sui/client";
import { SuiMoveFunction } from "../_Functions";
import { useEffect, useRef } from "react";

interface Props {
  imports: Record<string, Record<string, SuiMoveNormalizedStruct>>;
  functions: Record<string, SuiMoveFunction>;
  addCode: (funcName: string, funcData: SuiMoveNormalizedFunction) => void;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FunctionModal({
  imports,
  functions,
  addCode,
  setIsOpen,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Handle outside clicks to close modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsOpen]);
  
  // Group imports by package
  const groupedByPackage = Object.entries(imports).reduce(
    (acc, [fullModuleName, importedStruct]) => {
      const [packageAddress, moduleName] = fullModuleName.split("::");
      if (!acc[packageAddress]) acc[packageAddress] = {};
      acc[packageAddress][moduleName] = importedStruct;
      return acc;
    },
    {} as Record
      string,
      Record
        string,
        Record
          string,
          SuiMoveNormalizedStruct | Record<string, SuiMoveNormalizedFunction>
        >
      >
    >
  );
  
  return (
    <div
      ref={containerRef}
      className="absolute left-0 p-4 mt-2 w-96 z-50 bg-white rounded-xl shadow overflow-auto min-h-48 max-h-64"
    >
      {/* Current module functions section */}
      <div className="w-48 bg-white border rounded-xl shadow-lg z-10 relative group">
        <div className="px-4 py-2 hover:bg-blue-100 cursor-pointer rounded-xl transition">
          Current Module Functions
        </div>
        <ul className="absolute left-full top-0 w-40 bg-white border rounded-xl shadow-lg hidden group-hover:block z-20">
          {Object.entries(functions).map(([functionName, functionData]) => (
            <li
              key={functionName}
              className="px-4 py-2 text-emerald-500 hover:bg-blue-50 cursor-pointer transition"
              onClick={() => {
                addCode(functionName, functionData.function);
                setIsOpen(false);
              }}
            >
              {functionName}
            </li>
          ))}
        </ul>
      </div>
      
      {/* Import modules section */}
      {Object.entries(groupedByPackage).map(([packageAddress, modules]) => {
        return (
          <div key={packageAddress}>
            <h3 className="text-lg font-bold mb-1">
              {packageAddress.slice(0, 4)}...{packageAddress.slice(-3)} Package
            </h3>
            <div className="w-48 bg-white border rounded-xl shadow-lg z-10">
              {Object.entries(modules).map(([moduleName, moduleData]) => {
                const selfModule = moduleData["Self"];
                if (
                  selfModule &&
                  typeof selfModule === "object" &&
                  !("fields" in selfModule)
                ) {
                  return (
                    <div key={moduleName} className="relative group">
                      <div className="px-4 py-2 hover:bg-blue-100 cursor-pointer rounded-xl transition">
                        {moduleName}
                      </div>
                      <ul className="absolute left-full top-0 w-40 bg-white border rounded-xl shadow-lg hidden group-hover:block z-20">
                        {Object.entries(selfModule).map(([functionName, functionData]) => {
                          if (
                            functionData.isEntry === true ||
                            functionData.visibility !== "Public"
                          )
                            return null;
                          return (
                            <li
                              key={functionName}
                              onClick={() => {
                                addCode(functionName, functionData);
                                setIsOpen(false);
                              }}
                              className="px-4 py-2 text-emerald-500 hover:bg-blue-50 cursor-pointer transition"
                            >
                              {functionName}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}