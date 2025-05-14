import {
  SuiMoveAbilitySet,
  SuiMoveNormalizedStruct,
  SuiMoveNormalizedType,
  SuiMoveStructTypeParameter,
} from "@mysten/sui/client";
import { useRef, useEffect } from "react";

interface TypeModalProps {
  imports: Record<string, Record<string, SuiMoveNormalizedStruct>>;
  structs: Record<string, SuiMoveNormalizedStruct>;
  typeParameters: SuiMoveStructTypeParameter[] | SuiMoveAbilitySet[];
  setType: (arg0: SuiMoveNormalizedType) => void;
}

export default function TypeModal({
  imports,
  structs,
  typeParameters,
  setType,
}: TypeModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        // We don't directly close the modal here because that would need to be controlled by parent
        // Instead, we can set type to the same value to trigger the toggle in the parent
        if (typeParameters.length > 0) {
          const currentType = {
            Struct: {
              address: "0x0",
              module: "currentModule",
              name: "T0",
              typeArguments: [],
            },
          };
          setType(currentType);
        } else {
          setType("U64");
        }
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setType, typeParameters]);
  
  // Define primitive types for selection
  const PRIMITIVE_TYPES: SuiMoveNormalizedType[] = [
    "Bool",
    "U8",
    "U16",
    "U32",
    "U64",
    "U128",
    "U256",
    "Address",
    "Signer",
  ];
  
  // Group imports by package for easier navigation
  const groupedByPackage = Object.entries(imports).reduce(
    (acc, [fullModuleName, importedStruct]) => {
      const [packageAddress, moduleName] = fullModuleName.split("::");
      if (!acc[packageAddress]) acc[packageAddress] = {};
      acc[packageAddress][moduleName] = importedStruct;
      return acc;
    },
    {} as Record
      string,
      Record<string, Record<string, SuiMoveNormalizedStruct>>
    >
  );
  
  const handleTypeSelect = (
    e: React.MouseEvent,
    type: SuiMoveNormalizedType
  ) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setType(type);
    } catch (error) {
      console.error("Error setting type:", error);
    }
  };
  
  return (
    <div
      ref={modalRef}
      className="absolute left-0 p-4 mt-2 w-96 z-50 bg-white rounded-xl shadow overflow-auto min-h-48 max-h-64"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Primitive Types Section */}
      <div className="w-48 bg-white border rounded-xl shadow-lg z-10 relative group">
        <h3 className="px-4 py-2 hover:bg-blue-100 cursor-pointer rounded-xl transition">
          Primitive Type
        </h3>
        <ul className="absolute left-full top-0 w-40 bg-white border rounded-xl shadow-lg hidden group-hover:block z-20">
          {PRIMITIVE_TYPES.map((type) => (
            <li
              key={type.toString()}
              onClick={(e) => handleTypeSelect(e, type)}
              className="px-4 py-2 text-emerald-500 hover:bg-blue-50 cursor-pointer transition"
            >
              {type.toString()}
            </li>
          ))}
        </ul>
      </div>
      
      {/* Type Parameters Section */}
      {typeParameters.length > 0 && (
        <div className="w-48 bg-white border rounded-xl shadow-lg z-10 relative group mt-2">
          <div className="px-4 py-2 hover:bg-blue-100 cursor-pointer rounded-xl transition">
            Type Parameters
          </div>
          <ul className="absolute left-full top-0 w-40 bg-white border rounded-xl shadow-lg hidden group-hover:block z-20">
            {typeParameters.map((type, i) => (
              <li
                key={i}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const typeParam = {
                    Struct: {
                      address: "0x0",
                      module: "currentModule",
                      name: "T" + i,
                      typeArguments: [],
                    },
                  };
                  setType(typeParam);
                }}
                className="px-4 py-2 text-emerald-500 hover:bg-blue-50 cursor-pointer transition"
              >
                {`T${i}`}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Current Module Structs Section */}
      {Object.keys(structs).length > 0 && (
        <div className="w-48 bg-white border rounded-xl shadow-lg z-10 relative group mt-2">
          <div className="px-4 py-2 hover:bg-blue-100 cursor-pointer rounded-xl transition">
            Current Module Structs
          </div>
          <ul className="absolute left-full top-0 w-40 bg-white border rounded-xl shadow-lg hidden group-hover:block z-20">
            {Object.keys(structs).map((structName) => (
              <li
                key={structName}
                className="px-4 py-2 text-emerald-500 hover:bg-blue-50 cursor-pointer transition"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const type = {
                    Struct: {
                      address: "0x0",
                      module: "currentModule",
                      name: structName,
                      typeArguments: [],
                    },
                  };
                  setType(type);
                }}
              >
                {structName}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Imported Modules Section */}
      {Object.entries(groupedByPackage).map(([packageAddress, modules]) => {
        return (
          <div key={packageAddress}>
            <h3 className="text-lg font-bold mb-1 mt-2">
              {packageAddress.slice(0, 4)}...{packageAddress.slice(-3)} Package
            </h3>
            <div className="w-48 bg-white border rounded-xl shadow-lg z-10">
              {Object.entries(modules).map(([moduleName, importedTypes]) => (
                <div key={moduleName} className="relative group">
                  <div className="px-4 py-2 hover:bg-blue-100 cursor-pointer rounded-xl transition">
                    {moduleName}
                  </div>
                  <ul className="absolute left-full top-0 w-40 bg-white border rounded-xl shadow-lg hidden group-hover:block z-20">
                    {Object.keys(importedTypes).map((typeName) => (
                      <li
                        key={typeName}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          try {
                            const type = {
                              Struct: {
                                address: packageAddress,
                                module: moduleName,
                                name: typeName,
                                typeArguments: [],
                              },
                            };
                            setType(type);
                          } catch (error) {
                            console.error("Error setting imported type:", error);
                          }
                        }}
                        className="px-4 py-2 text-emerald-500 hover:bg-blue-50 cursor-pointer transition"
                      >
                        {typeName}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}