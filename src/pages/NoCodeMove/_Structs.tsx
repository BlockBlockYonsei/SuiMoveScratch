import { SuiMoveNormalizedStruct } from "@mysten/sui/client";
import { useState } from "react";

// Define the props interface
interface StructsProps {
  imports: Record<string, Record<string, SuiMoveNormalizedStruct>>;
  structs: Record<string, SuiMoveNormalizedStruct>;
  setStructs: React.Dispatch<
    React.SetStateAction<Record<string, SuiMoveNormalizedStruct>>
  >;
}

// Define field type for struct
interface StructField {
  name: string;
  type: string | { Struct: { name: string } };
}

// Common struct templates for beginners
const structTemplates = [
  {
    name: "Custom Struct",
    template: { name: "", abilities: [], fields: [] },
  },
  {
    name: "Token",
    template: {
      name: "Token",
      abilities: ["key", "store"],
      fields: [
        { name: "id", type: "0x2::object::UID" },
        { name: "balance", type: "u64" },
      ],
    },
  },
  {
    name: "NFT",
    template: {
      name: "NFT",
      abilities: ["key", "store"],
      fields: [
        { name: "id", type: "0x2::object::UID" },
        { name: "name", type: "0x1::string::String" },
        { name: "description", type: "0x1::string::String" },
        { name: "url", type: "0x2::url::Url" },
      ],
    },
  },
  {
    name: "Game Character",
    template: {
      name: "Character",
      abilities: ["key", "store"],
      fields: [
        { name: "id", type: "0x2::object::UID" },
        { name: "name", type: "0x1::string::String" },
        { name: "level", type: "u64" },
        { name: "experience", type: "u64" },
        { name: "health", type: "u64" },
      ],
    },
  },
];

// Common field types in Move
const commonFieldTypes = [
  "u8",
  "u16",
  "u32",
  "u64",
  "u128",
  "u256",
  "bool",
  "address",
  "0x1::string::String",
  "0x2::object::UID",
  "0x2::url::Url",
  "0x2::balance::Balance",
  "0x1::option::Option<T>",
];

export default function Structs({
  imports,
  structs,
  setStructs,
}: StructsProps) {
  const [isAddingStruct, setIsAddingStruct] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [structName, setStructName] = useState("");
  const [fields, setFields] = useState<StructField[]>([]);
  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] = useState("");
  const [customFieldType, setCustomFieldType] = useState("");
  const [isCustomFieldType, setIsCustomFieldType] = useState(false);
  const [abilities, setAbilities] = useState<string[]>([]);

  // Available abilities in Move
  const availableAbilities = ["copy", "drop", "store", "key"];

  // Apply template
  const applyTemplate = (templateIndex: number) => {
    const template = structTemplates[templateIndex].template;
    if (templateIndex === 0) {
      // Custom struct - reset all fields
      setStructName("");
      setFields([]);
      setAbilities([]);
    } else {
      setStructName(template.name);
      setAbilities(template.abilities);

      // Convert template fields to the correct format
      const templateFields: StructField[] = template.fields.map((field) => {
        const fieldType =
          typeof field.type === "string"
            ? field.type
            : { Struct: { name: field.type } };
        return { name: field.name, type: fieldType };
      });

      setFields(templateFields);
    }
  };

  // Handle form submission for adding a struct
  const handleAddStruct = (e: React.FormEvent) => {
    e.preventDefault();
    if (structName) {
      // Create a new struct entry
      const newStructs = { ...structs };
      newStructs[structName] = {
        abilities: { abilities: [...abilities] },
        fields: [...fields],
        typeParameters: [],
      };
      setStructs(newStructs);
      // Reset form
      setStructName("");
      setFields([]);
      setAbilities([]);
      setIsAddingStruct(false);
    }
  };

  // Handle adding a field to the struct
  const handleAddField = () => {
    const actualFieldType = isCustomFieldType ? customFieldType : fieldType;

    if (fieldName && actualFieldType) {
      // Determine field type format
      let parsedType: string | { Struct: { name: string } } = actualFieldType;

      // Check if field type refers to an imported struct
      Object.entries(imports).forEach(([pkgModulePath, moduleStructs]) => {
        Object.keys(moduleStructs).forEach((importedStructName) => {
          if (actualFieldType === importedStructName) {
            parsedType = {
              Struct: {
                name: `${pkgModulePath}::${importedStructName}`,
              },
            };
          }
        });
      });

      // Check if field type refers to a local struct
      Object.keys(structs).forEach((existingStructName) => {
        if (actualFieldType === existingStructName) {
          parsedType = {
            Struct: {
              name: existingStructName,
            },
          };
        }
      });

      // Add the new field
      setFields([...fields, { name: fieldName, type: parsedType }]);
      setFieldName("");
      setFieldType("");
      setCustomFieldType("");
      setIsCustomFieldType(false);
    }
  };

  // Handle removing a field
  const handleRemoveField = (index: number) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
  };

  // Toggle an ability
  const handleToggleAbility = (ability: string) => {
    if (abilities.includes(ability)) {
      setAbilities(abilities.filter((a) => a !== ability));
    } else {
      setAbilities([...abilities, ability]);
    }
  };

  // Handle struct removal
  const handleRemoveStruct = (structToRemove: string) => {
    const newStructs = { ...structs };
    if (newStructs[structToRemove]) {
      delete newStructs[structToRemove];
      setStructs(newStructs);
    }
  };

  return (
    <div className="mt-4">
      {/* Struct list - only show if there are structs */}
      {Object.keys(structs).length > 0 ? (
        <div className="mb-4 space-y-2">
          {Object.entries(structs).map(([name, struct]) => (
            <div key={name} className="bg-gray-700 rounded-md p-3 text-sm">
              <div className="flex justify-between items-center mb-2">
                <div className="font-mono font-semibold">
                  {name}
                  {struct.abilities.abilities.length > 0 && (
                    <span className="text-gray-300 text-xs ml-2">
                      has {struct.abilities.abilities.join(", ")}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveStruct(name)}
                  className="text-red-400 hover:text-red-300"
                >
                  ×
                </button>
              </div>
              {struct.fields.length > 0 && (
                <div className="ml-4 space-y-1">
                  {struct.fields.map((field, idx) => (
                    <div key={idx} className="text-gray-300 font-mono text-xs">
                      {field.name}:{" "}
                      {typeof field.type === "string"
                        ? field.type
                        : "Struct" in field.type
                        ? field.type.Struct.name
                        : "Unknown"}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="mb-4 text-gray-400 italic text-center py-2 bg-gray-700 rounded-md">
          No structs added yet
        </div>
      )}

      {/* Struct add button */}
      {!isAddingStruct ? (
        <div className="flex justify-center mt-2">
          <button
            onClick={() => setIsAddingStruct(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center justify-center w-full"
          >
            <span className="text-xl mr-1">+</span> Struct 추가
          </button>
        </div>
      ) : (
        <div className="mt-2 bg-gray-700 rounded-md p-3">
          <form onSubmit={handleAddStruct}>
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
                  {structTemplates.map((template, index) => (
                    <option key={index} value={index}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-300">Struct Name</label>
                <input
                  type="text"
                  value={structName}
                  onChange={(e) => setStructName(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 mt-1 text-white"
                  placeholder="MyStruct"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-300">Abilities</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {availableAbilities.map((ability) => (
                    <label
                      key={ability}
                      className={`flex items-center space-x-1 px-2 py-1 rounded-md cursor-pointer ${
                        abilities.includes(ability)
                          ? "bg-purple-700 text-white"
                          : "bg-gray-800 text-gray-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={abilities.includes(ability)}
                        onChange={() => handleToggleAbility(ability)}
                        className="hidden"
                      />
                      <span>{ability}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-300">Fields</label>

                {fields.length > 0 && (
                  <div className="mt-2 mb-3 space-y-2">
                    {fields.map((field, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-gray-800 rounded-md p-2"
                      >
                        <div className="font-mono text-xs">
                          {field.name}:{" "}
                          {typeof field.type === "string"
                            ? field.type
                            : "Struct" in field.type
                            ? field.type.Struct.name
                            : "Unknown"}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveField(idx)}
                          className="text-red-400 hover:text-red-300"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={fieldName}
                    onChange={(e) => setFieldName(e.target.value)}
                    className="flex-1 bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white"
                    placeholder="Field name"
                  />

                  {isCustomFieldType ? (
                    <input
                      type="text"
                      value={customFieldType}
                      onChange={(e) => setCustomFieldType(e.target.value)}
                      className="flex-1 bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white"
                      placeholder="Custom type"
                    />
                  ) : (
                    <select
                      value={fieldType}
                      onChange={(e) => {
                        if (e.target.value === "custom") {
                          setIsCustomFieldType(true);
                        } else {
                          setFieldType(e.target.value);
                        }
                      }}
                      className="flex-1 bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white"
                    >
                      <option value="">Select type</option>
                      {commonFieldTypes.map((type) => (
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
                    onClick={handleAddField}
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
                  Add Struct
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingStruct(false);
                    setSelectedTemplate(0);
                    setStructName("");
                    setFields([]);
                    setAbilities([]);
                    setFieldName("");
                    setFieldType("");
                    setCustomFieldType("");
                    setIsCustomFieldType(false);
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
