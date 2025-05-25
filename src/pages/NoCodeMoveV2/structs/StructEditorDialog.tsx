import { useContext, useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  SuiMoveAbility,
  SuiMoveNormalizedField,
  SuiMoveNormalizedType,
  SuiMoveStructTypeParameter,
} from "@mysten/sui/client";

import { SuiMoveStruct } from "@/types/move-syntax2";
import { SuiMoveModuleContext } from "@/context/SuiMoveModuleContext2";
import { generateStructCode } from "@/pages/NoCodeMoveV2/utils/generateCode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import AbilitySelector from "../components/AbilitySelector";
import TypeSelector from "../components/TypeSelector";

export default function StructEditorDialog() {
  const [structName, setStructName] = useState("NewStruct");
  const [abilities, setAbilities] = useState<SuiMoveAbility[]>([]);
  const [typeParameters, setTypeParameters] = useState<
    SuiMoveStructTypeParameter[]
  >([]);
  const [typeParameterNames, setTypeParameterNames] = useState<string[]>([]);
  const [fields, setFields] = useState<
    { name: string; type: SuiMoveNormalizedType }[]
  >([]);

  const [newFieldName, setNewFieldName] = useState("");
  const [newTypeParamName, setNewTypeParamName] = useState("");
  const [newTypeParamAbilities, setNewTypeParamAbilities] = useState<
    SuiMoveAbility[]
  >([]);

  const { moduleName, structs, setStructs, selectedStruct } =
    useContext(SuiMoveModuleContext);

  useEffect(() => {
    if (selectedStruct) {
      setStructName(selectedStruct.structName);
      setAbilities(selectedStruct.abilities.abilities);
      setTypeParameters(selectedStruct.typeParameters);
      setTypeParameterNames(selectedStruct.typeParameterNames);
      setFields(selectedStruct.fields);
    } else {
      resetState();
    }
  }, [selectedStruct, structs]);

  const handleComplete = () => {
    if (!structName) return;

    setStructs((prev) => {
      const newStructMap = new Map(prev);

      const newStructData: SuiMoveStruct = {
        address: "0x0",
        moduleName: moduleName,
        structName: structName,
        abilities: { abilities },
        fields,
        typeParameters,
        typeParameterNames,
      };

      if (!selectedStruct) {
        newStructMap.set(structName, newStructData);
        return newStructMap;
      }

      if (selectedStruct.structName === structName) {
        newStructMap.delete(selectedStruct.structName);
        newStructMap.set(structName, newStructData);
        return newStructMap;
      }

      newStructMap.delete(selectedStruct.structName);
      newStructMap.set(structName, newStructData);

      // 이전 struct 이름이 있고, 새로운 이름과 다른 경우 (이름 변경)
      newStructMap.forEach((structData) => {
        const updatedFields = structData.fields.map((field) => {
          if (
            field.type &&
            typeof field.type === "object" &&
            "Struct" in field.type &&
            field.type.Struct.name === selectedStruct.structName
          ) {
            const updatedField: SuiMoveNormalizedField = {
              name: field.name,
              type: {
                Struct: {
                  ...field.type.Struct,
                  name: structName,
                },
              },
            };
            return updatedField;
          }

          return field;
        });

        newStructMap.set(structData.structName, {
          ...structData,
          fields: updatedFields,
        } as SuiMoveStruct);
      });

      return newStructMap;
    });

    resetState();
  };

  const resetState = () => {
    setStructName("NewStruct");
    setAbilities([]);
    setFields([]);
    setTypeParameterNames([]);
    setTypeParameters([]);
  };

  return (
    <DialogContent className="lg:max-w-[900px] max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {selectedStruct ? "Update Struct" : "Create a New Struct"}
        </DialogTitle>
        <DialogDescription>
          Add abilities, type parameters, and fields for your struct.
        </DialogDescription>
      </DialogHeader>

      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        <section className="col-span-6">
          {/* Struct Name */}
          <div className="mb-4">
            <p className="block font-semibold mb-1">Struct Name</p>
            <Input
              value={structName}
              onChange={(e) => {
                const raw = e.target.value;
                if (raw.length > 0 && /^\d/.test(raw)) {
                  return; // 첫 글자가 숫자면 무시
                }
                const onlyAlphabet = e.target.value.replace(
                  /[^a-zA-Z0-9]/g,
                  ""
                );
                const firstLetterCapitalized =
                  onlyAlphabet.charAt(0).toUpperCase() + onlyAlphabet.slice(1);
                setStructName(firstLetterCapitalized);
              }}
            />
          </div>

          {/* Abilities */}
          <div className="mb-4">
            <p className="block font-semibold mb-1">Abilities</p>
            <AbilitySelector abilities={abilities} onChange={setAbilities} />
          </div>

          {/* Type Parameters */}
          <div className="mb-4">
            <p className="block font-semibold mb-1">Type Parameters</p>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Type parameter name"
                value={newTypeParamName}
                onChange={(e) => {
                  const raw = e.target.value;
                  if (raw.length > 0 && /^\d/.test(raw)) {
                    return; // 첫 글자가 숫자면 무시
                  }
                  const onlyAlphabet = e.target.value.replace(
                    /[^a-zA-Z0-9]/g,
                    ""
                  );
                  const firstLetterCapitalized =
                    onlyAlphabet.charAt(0).toUpperCase() +
                    onlyAlphabet.slice(1);
                  setNewTypeParamName(firstLetterCapitalized);
                }}
              />
              <Button
                className="cursor-pointer"
                onClick={() => {
                  if (
                    !newTypeParamName ||
                    typeParameterNames.includes(newTypeParamName)
                  )
                    return;

                  setTypeParameterNames([
                    ...typeParameterNames,
                    newTypeParamName,
                  ]);
                  setTypeParameters([
                    ...typeParameters,
                    {
                      isPhantom: false,
                      constraints: { abilities: newTypeParamAbilities },
                    },
                  ]);

                  // 초기화
                  setNewTypeParamName("");
                  setNewTypeParamAbilities([]);
                }}
              >
                Add
              </Button>
            </div>

            {/* 추가된 타입 파라미터 목록 */}
            {typeParameterNames.map((name, index) => (
              <div
                key={name}
                className="flex justify-between items-center gap-2 mb-2"
              >
                <button
                  className={`${
                    typeParameters[index].isPhantom
                      ? "text-purple-500 border-purple-500"
                      : ""
                  } border-2 font-semibold cursor-pointer rounded-md p-1 transition-all`}
                  onClick={() => {
                    setTypeParameters((prev) => {
                      const newParams = [...prev];
                      newParams[index] = {
                        ...newParams[index],
                        isPhantom: !newParams[index].isPhantom,
                      };
                      return newParams;
                    });
                  }}
                >
                  {/* Phantom */}
                  <span className="text-blue-600 font-semibold">{name}</span>
                </button>
                <div className="flex">
                  <AbilitySelector
                    abilities={typeParameters[index].constraints.abilities}
                    onChange={(newAbilities) => {
                      setTypeParameters((prev) => {
                        const newParams = [...prev];
                        newParams[index] = {
                          ...newParams[index],
                          constraints: { abilities: newAbilities },
                        };
                        return newParams;
                      });
                    }}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-gray-700 p-1 h-7 w-7 flex-shrink-0"
                    onClick={() => {
                      setTypeParameterNames((prev) =>
                        prev.filter((_, i) => i !== index)
                      );
                      setTypeParameters((prev) =>
                        prev.filter((_, i) => i !== index)
                      );
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Fields */}
          <div className="mb-4">
            <p className="block font-semibold mb-1">Fields</p>
            <div className="flex gap-2 mb-2">
              <Input
                value={newFieldName}
                placeholder="Field name"
                onChange={(e) => {
                  const raw = e.target.value;
                  if (raw.length > 0 && /^[\d_]/.test(raw)) {
                    return; // 첫 글자가 숫자거나 _면 무시
                  }
                  const onlyAlphabet = e.target.value.replace(
                    /[^a-zA-Z0-9_]/g,
                    ""
                  );
                  setNewFieldName(onlyAlphabet.toLowerCase());
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (
                      !newFieldName ||
                      fields.some((f) => f.name === newFieldName)
                    )
                      return;
                    setFields([...fields, { name: newFieldName, type: "U64" }]);
                    setNewFieldName("");
                  }
                }}
              />
              <Button
                className="cursor-pointer"
                onClick={() => {
                  if (
                    !newFieldName ||
                    fields.some((f) => f.name === newFieldName)
                  )
                    return;
                  setFields([...fields, { name: newFieldName, type: "U64" }]);
                  setNewFieldName("");
                }}
              >
                Add
              </Button>
            </div>

            {fields.map((field, index) => (
              <div key={field.name} className="flex items-center gap-2 mb-2">
                <span className="text-blue-600 font-semibold min-w-[100px]">
                  {field.name}
                </span>
                <TypeSelector
                  nameKey={structName}
                  typeParameters={typeParameters.map((tp, i) => ({
                    name: typeParameterNames[i],
                    type: tp,
                  }))}
                  defaultType={field.type}
                  onChange={(type: SuiMoveNormalizedType) => {
                    setFields((prev) =>
                      prev.map((f, i) => (i === index ? { ...f, type } : f))
                    );
                  }}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700 p-1 h-7 w-7 flex-shrink-0"
                  onClick={() => {
                    setFields((prev) => prev.filter((_, i) => i !== index));
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </section>

        <section className="col-span-6">
          <div className="mt-4">
            <pre className="text-sm bg-gray-100 p-4 rounded whitespace-pre-wrap overflow-y-auto">
              {generateStructCode(structName, {
                abilities: { abilities },
                typeParameters,
                fields,
                typeParameterNames,
              })}
            </pre>
          </div>
        </section>
      </div>

      <DialogClose asChild>
        <Button onClick={handleComplete} className="cursor-pointer w-90">
          Complete
        </Button>
      </DialogClose>
    </DialogContent>
  );
}
