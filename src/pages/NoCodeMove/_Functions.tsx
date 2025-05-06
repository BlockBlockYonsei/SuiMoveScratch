import { SuiMoveNormalizedStruct } from "@mysten/sui/client";
import { useState } from "react";

export interface SuiMoveFunction {
  function: {
    visibility: string;
    isEntry: boolean;
    parameters: (string | { Struct: { name: string } })[];
    return: (string | { Struct: { name: string } })[];
  };
}

// Define the props interface
interface FunctionsProps {
  imports: Record<string, Record<string, SuiMoveNormalizedStruct>>;
  structs: Record<string, SuiMoveNormalizedStruct>;
  functions: Record<string, SuiMoveFunction>;
  setFunctions: React.Dispatch<
    React.SetStateAction<Record<string, SuiMoveFunction>>
  >;
}

// Common function templates for beginners
const functionTemplates = [
  {
    name: "Custom Function",
    template: {
      name: "",
      visibility: "public",
      isEntry: false,
      parameters: [],
      returns: [],
    },
  },
  {
    name: "Transfer Token",
    template: {
      name: "transfer_token",
      visibility: "public",
      isEntry: true,
      parameters: ["&mut Coin", "address", "u64"],
      returns: [],
    },
  },
  {
    name: "Mint NFT",
    template: {
      name: "mint_nft",
      visibility: "public",
      isEntry: true,
      parameters: [
        "&mut TxContext",
        "0x1::string::String",
        "0x1::string::String",
        "0x2::url::Url",
      ],
      returns: [],
    },
  },
  {
    name: "Get Balance",
    template: {
      name: "get_balance",
      visibility: "public",
      isEntry: false,
      parameters: ["&Coin"],
      returns: ["u64"],
    },
  },
];

// Common parameter types in Move functions
const commonParamTypes = [
  "u8",
  "u16",
  "u32",
  "u64",
  "u128",
  "u256",
  "bool",
  "address",
  "&mut TxContext",
  "&TxContext",
  "0x1::string::String",
  "&mut Coin",
  "&Coin",
  "&mut NFT",
  "&NFT",
];

export default function Functions({
  imports,
  structs,
  functions,
  setFunctions,
}: FunctionsProps) {
  const [isAddingFunction, setIsAddingFunction] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [functionName, setFunctionName] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [isEntry, setIsEntry] = useState(false);
  const [parameters, setParameters] = useState<
    (string | { Struct: { name: string } })[]
  >([]);
  const [paramType, setParamType] = useState("");
  const [customParamType, setCustomParamType] = useState("");
  const [isCustomParamType, setIsCustomParamType] = useState(false);
  const [returnTypes, setReturnTypes] = useState<
    (string | { Struct: { name: string } })[]
  >([]);
  const [returnType, setReturnType] = useState("");
  const [customReturnType, setCustomReturnType] = useState("");
  const [isCustomReturnType, setIsCustomReturnType] = useState(false);

  // Apply template
  const applyTemplate = (templateIndex: number) => {
    const template = functionTemplates[templateIndex].template;
    if (templateIndex === 0) {
      // Custom function - reset all fields
      setFunctionName("");
      setVisibility("public");
      setIsEntry(false);
      setParameters([]);
      setReturnTypes([]);
    } else {
      setFunctionName(template.name);
      setVisibility(template.visibility);
      setIsEntry(template.isEntry);

      // Convert template parameters to the correct format
      const templateParams: (string | { Struct: { name: string } })[] =
        template.parameters.map((param) => {
          return param;
        });

      setParameters(templateParams);

      // Convert template return types to the correct format
      const templateReturns: (string | { Struct: { name: string } })[] =
        template.returns.map((ret) => {
          return ret;
        });

      setReturnTypes(templateReturns);
    }
  };

  // Handle form submission for adding a function
  const handleAddFunction = (e: React.FormEvent) => {
    e.preventDefault();
    if (functionName) {
      // Create a new function entry
      const newFunctions = { ...functions };
      newFunctions[functionName] = {
        function: {
          visibility,
          isEntry,
          parameters: [...parameters],
          return: [...returnTypes],
        },
      };
      setFunctions(newFunctions);
      // Reset form
      setFunctionName("");
      setVisibility("public");
      setIsEntry(false);
      setParameters([]);
      setReturnTypes([]);
      setIsAddingFunction(false);
    }
  };

  // Handle adding a parameter to the function
  const handleAddParameter = () => {
    const actualParamType = isCustomParamType ? customParamType : paramType;

    if (actualParamType) {
      // Determine parameter type format
      let parsedType: string | { Struct: { name: string } } = actualParamType;

      // Check if parameter type refers to an imported struct
      Object.entries(imports).forEach(([pkgModulePath, moduleStructs]) => {
        Object.keys(moduleStructs).forEach((importedStructName) => {
          if (actualParamType === importedStructName) {
            parsedType = {
              Struct: {
                name: `${pkgModulePath}::${importedStructName}`,
              },
            };
          }
        });
      });

      // Check if parameter type refers to a local struct
      Object.keys(structs).forEach((existingStructName) => {
        if (actualParamType === existingStructName) {
          parsedType = {
            Struct: {
              name: existingStructName,
            },
          };
        }
      });

      // Add the new parameter
      setParameters([...parameters, parsedType]);
      setParamType("");
      setCustomParamType("");
      setIsCustomParamType(false);
    }
  };

  // Handle adding a return type to the function
  const handleAddReturnType = () => {
    const actualReturnType = isCustomReturnType ? customReturnType : returnType;

    if (actualReturnType) {
      // Determine return type format
      let parsedType: string | { Struct: { name: string } } = actualReturnType;

      // Check if return type refers to an imported struct
      Object.entries(imports).forEach(([pkgModulePath, moduleStructs]) => {
        Object.keys(moduleStructs).forEach((importedStructName) => {
          if (actualReturnType === importedStructName) {
            parsedType = {
              Struct: {
                name: `${pkgModulePath}::${importedStructName}`,
              },
            };
          }
        });
      });

      // Check if return type refers to a local struct
      Object.keys(structs).forEach((existingStructName) => {
        if (actualReturnType === existingStructName) {
          parsedType = {
            Struct: {
              name: existingStructName,
            },
          };
        }
      });

      // Add the new return type
      setReturnTypes([...returnTypes, parsedType]);
      setReturnType("");
      setCustomReturnType("");
      setIsCustomReturnType(false);
    }
  };

  // Handle removing a parameter
  const handleRemoveParameter = (index: number) => {
    const newParameters = [...parameters];
    newParameters.splice(index, 1);
    setParameters(newParameters);
  };

  // Handle removing a return type
  const handleRemoveReturnType = (index: number) => {
    const newReturnTypes = [...returnTypes];
    newReturnTypes.splice(index, 1);
    setReturnTypes(newReturnTypes);
  };

  // Handle function removal
  const handleRemoveFunction = (functionToRemove: string) => {
    const newFunctions = { ...functions };
    if (newFunctions[functionToRemove]) {
      delete newFunctions[functionToRemove];
      setFunctions(newFunctions);
    }
  };

  return (
    <div className="mt-4">
      {/* Function list - only show if there are functions */}
      {Object.keys(functions).length > 0 ? (
        <div className="mb-4 space-y-2">
          {Object.entries(functions).map(([name, func]) => (
            <div key={name} className="bg-gray-700 rounded-md p-3 text-sm">
              <div className="flex justify-between items-center mb-2">
                <div className="font-mono font-semibold">
                  <span className="text-gray-300">
                    {func.function.visibility.toLowerCase()}
                  </span>
                  {func.function.isEntry && (
                    <span className="text-yellow-300 ml-1">entry</span>
                  )}
                  <span className="ml-1">{name}</span>
                </div>
                <button
                  onClick={() => handleRemoveFunction(name)}
                  className="text-red-400 hover:text-red-300"
                >
                  ×
                </button>
              </div>
              <div className="ml-4 space-y-2">
                <div className="text-gray-300 font-mono text-xs">
                  parameters: [
                  {func.function.parameters.map((param, idx) => (
                    <span key={idx}>
                      {idx > 0 && ", "}
                      {typeof param === "string"
                        ? param
                        : "Struct" in param
                        ? param.Struct.name
                        : "Unknown"}
                    </span>
                  ))}
                  ]
                </div>
                {func.function.return.length > 0 && (
                  <div className="text-gray-300 font-mono text-xs">
                    returns: [
                    {func.function.return.map((ret, idx) => (
                      <span key={idx}>
                        {idx > 0 && ", "}
                        {typeof ret === "string"
                          ? ret
                          : "Struct" in ret
                          ? ret.Struct.name
                          : "Unknown"}
                      </span>
                    ))}
                    ]
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mb-4 text-gray-400 italic text-center py-2 bg-gray-700 rounded-md">
          No functions added yet
        </div>
      )}

      {/* Function add button */}
      {!isAddingFunction ? (
        <div className="flex justify-center mt-2">
          <button
            onClick={() => setIsAddingFunction(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center justify-center w-full"
          >
            <span className="text-xl mr-1">+</span> Function 추가
          </button>
        </div>
      ) : (
        <div className="mt-2 bg-gray-700 rounded-md p-3">
          <form onSubmit={handleAddFunction}>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-300">Template</label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => {
                    const index = parseInt(e.target.value);
                    setSelectedTemplate(index);
                    applyTemplate(index);
                  }}
                  className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 mt-1 text-white"
                >
                  {functionTemplates.map((template, index) => (
                    <option key={index} value={index}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-300">Function Name</label>
                <input
                  type="text"
                  value={functionName}
                  onChange={(e) => setFunctionName(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 mt-1 text-white"
                  placeholder="my_function"
                  required
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-sm text-gray-300">Visibility</label>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 mt-1 text-white"
                  >
                    <option value="public">public</option>
                    <option value="public(friend)">public(friend)</option>
                    <option value="private">private</option>
                  </select>
                </div>
                <div className="flex items-end mb-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isEntry}
                      onChange={(e) => setIsEntry(e.target.checked)}
                      className="rounded bg-gray-800 border-gray-600 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-300">
                      Entry Function
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-300">Parameters</label>

                {parameters.length > 0 && (
                  <div className="mt-2 mb-3 space-y-2">
                    {parameters.map((param, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-gray-800 rounded-md p-2"
                      >
                        <div className="font-mono text-xs">
                          param{idx}:{" "}
                          {typeof param === "string"
                            ? param
                            : "Struct" in param
                            ? param.Struct.name
                            : "Unknown"}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveParameter(idx)}
                          className="text-red-400 hover:text-red-300"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 mt-2">
                  {isCustomParamType ? (
                    <input
                      type="text"
                      value={customParamType}
                      onChange={(e) => setCustomParamType(e.target.value)}
                      className="flex-1 bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white"
                      placeholder="Custom parameter type"
                    />
                  ) : (
                    <select
                      value={paramType}
                      onChange={(e) => {
                        if (e.target.value === "custom") {
                          setIsCustomParamType(true);
                        } else {
                          setParamType(e.target.value);
                        }
                      }}
                      className="flex-1 bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white"
                    >
                      <option value="">Select parameter type</option>
                      {commonParamTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                      {/* Add struct types from imports */}
                      {Object.entries(imports).map(([pkgModulePath, structs]) =>
                        Object.keys(structs).map((structName) => (
                          <option
                            key={`${pkgModulePath}::${structName}`}
                            value={structName}
                          >
                            {structName} (imported)
                          </option>
                        ))
                      )}
                      {/* Add custom struct types */}
                      {Object.keys(structs).map((structName) => (
                        <option key={structName} value={structName}>
                          {structName} (struct)
                        </option>
                      ))}
                      <option value="custom">Custom type...</option>
                    </select>
                  )}

                  <button
                    type="button"
                    onClick={handleAddParameter}
                    className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-2 rounded-md"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-300">Return Types</label>

                {returnTypes.length > 0 && (
                  <div className="mt-2 mb-3 space-y-2">
                    {returnTypes.map((ret, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-gray-800 rounded-md p-2"
                      >
                        <div className="font-mono text-xs">
                          {typeof ret === "string"
                            ? ret
                            : "Struct" in ret
                            ? ret.Struct.name
                            : "Unknown"}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveReturnType(idx)}
                          className="text-red-400 hover:text-red-300"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 mt-2">
                  {isCustomReturnType ? (
                    <input
                      type="text"
                      value={customReturnType}
                      onChange={(e) => setCustomReturnType(e.target.value)}
                      className="flex-1 bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white"
                      placeholder="Custom return type"
                    />
                  ) : (
                    <select
                      value={returnType}
                      onChange={(e) => {
                        if (e.target.value === "custom") {
                          setIsCustomReturnType(true);
                        } else {
                          setReturnType(e.target.value);
                        }
                      }}
                      className="flex-1 bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white"
                    >
                      <option value="">Select return type</option>
                      {commonParamTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                      {/* Add struct types from imports */}
                      {Object.entries(imports).map(([pkgModulePath, structs]) =>
                        Object.keys(structs).map((structName) => (
                          <option
                            key={`${pkgModulePath}::${structName}`}
                            value={structName}
                          >
                            {structName} (imported)
                          </option>
                        ))
                      )}
                      {/* Add custom struct types */}
                      {Object.keys(structs).map((structName) => (
                        <option key={structName} value={structName}>
                          {structName} (struct)
                        </option>
                      ))}
                      <option value="custom">Custom type...</option>
                    </select>
                  )}

                  <button
                    type="button"
                    onClick={handleAddReturnType}
                    className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-2 rounded-md"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                >
                  Add Function
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingFunction(false);
                    setSelectedTemplate(0);
                    setFunctionName("");
                    setVisibility("public");
                    setIsEntry(false);
                    setParameters([]);
                    setReturnTypes([]);
                    setParamType("");
                    setCustomParamType("");
                    setIsCustomParamType(false);
                    setReturnType("");
                    setCustomReturnType("");
                    setIsCustomReturnType(false);
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
