import { useEffect, useState } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // 추가된 input이 있다면
import {
  SuiMoveAbility,
  SuiMoveNormalizedType,
  SuiMoveStructTypeParameter,
} from "@mysten/sui/client";
import TypeSelect from "@/pages/NoCodeMove/components/TypeSelect";
import { generateStructCode } from "@/pages/NoCodeMove/utils/generateCode";
import { DialogClose } from "@radix-ui/react-dialog";
import { ImportsType, StructsType, SuiMoveStruct } from "@/types/move-syntax";

export default function AddStructDialog({
  defaultStructName,
  defaultStruct,
  imports,
  structs,
  setStructs,
}: {
  defaultStructName: string | null;
  defaultStruct: SuiMoveStruct | null;
  imports: ImportsType;
  structs: StructsType;
  setStructs: React.Dispatch<React.SetStateAction<StructsType>>;
}) {
  const [structName, setStructName] = useState("MyStruct");
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

  useEffect(() => {
    if (defaultStruct && defaultStructName) {
      setStructName(defaultStructName);
      setAbilities(defaultStruct.abilities.abilities);
      setTypeParameters(defaultStruct.typeParameters);
      setTypeParameterNames(defaultStruct.typeParameterNames);
      setFields(defaultStruct.fields);
    }
  }, []);

  const handleComplete = () => {
    if (!structName) return;

    if (defaultStruct && defaultStructName) {
      setStructs((prev: StructsType) => {
        const { [defaultStructName]: _, ...rest } = prev;
        return rest;
      });

      setStructs((prev: StructsType) => ({
        ...prev,
        [structName]: {
          abilities: { abilities },
          fields,
          typeParameters,
          typeParameterNames,
        },
      }));
    }

    // 초기화 (Create 시에만)
    if (!defaultStruct || !structName) {
      setStructs((prev: any) => ({
        ...prev,
        [structName]: {
          abilities: { abilities },
          fields,
          typeParameters,
          typeParameterNames,
        },
      }));

      setStructName("MyStruct");
      setAbilities([]);
      setFields([]);
      setTypeParameterNames([]);
      setTypeParameters([]);
    }
  };

  return (
    <DialogContent className="lg:max-w-[800px] max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {defaultStruct ? "Update Struct" : "Create a New Struct"}
        </DialogTitle>
        <DialogDescription>
          Add abilities, type parameters, and fields for your struct.
        </DialogDescription>
      </DialogHeader>

      <div className="lg:grid lg:grid-cols-9 lg:gap-10">
        <section className="col-span-4">
          {/* Struct 이름 */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">Struct Name</label>
            <Input
              value={structName}
              onChange={(e) => setStructName(e.target.value)}
            />
          </div>

          {/* Abilities */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">Abilities</label>
            <div className="flex gap-2 flex-wrap">
              {(
                ["copy", "drop", "store", "key"] as unknown as SuiMoveAbility[]
              ).map((ability) => (
                <Button
                  key={ability}
                  className="cursor-pointer"
                  variant={abilities.includes(ability) ? "default" : "outline"}
                  onClick={() => {
                    setAbilities((prev) =>
                      prev.includes(ability)
                        ? prev.filter((a) => a !== ability)
                        : [...prev, ability]
                    );
                  }}
                >
                  {ability}
                </Button>
              ))}
            </div>
          </div>

          {/* Type Parameters */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">Type Parameters</label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {(
                ["copy", "drop", "store", "key"] as unknown as SuiMoveAbility[]
              ).map((ability) => (
                <Button
                  key={ability}
                  className="cursor-pointer"
                  size="sm"
                  variant={
                    newTypeParamAbilities.includes(ability)
                      ? "default"
                      : "outline"
                  }
                  onClick={() => {
                    setNewTypeParamAbilities((prev) =>
                      prev.includes(ability)
                        ? prev.filter((a) => a !== ability)
                        : [...prev, ability]
                    );
                  }}
                >
                  {ability}
                </Button>
              ))}
            </div>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Type parameter name"
                value={newTypeParamName}
                onChange={(e) => setNewTypeParamName(e.target.value)}
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
          </div>

          {/* Fields */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">Fields</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newFieldName}
                placeholder="Field name"
                onChange={(e) => setNewFieldName(e.target.value)}
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

            {fields.map((field) => (
              <div key={field.name} className="flex items-center gap-2 mb-2">
                <span className="text-blue-600 font-semibold">
                  {field.name}
                </span>
                <TypeSelect
                  imports={imports}
                  structs={structs}
                  typeParameters={[]}
                  setType={(type) => {
                    setFields((prev) =>
                      prev.map((f) =>
                        f.name === field.name ? { ...f, type } : f
                      )
                    );
                  }}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="col-span-5">
          <div className="mt-4">
            <pre className="text-sm bg-gray-100 p-4 rounded whitespace-pre-wrap">
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

      <DialogClose>
        <Button className="cursor-pointer w-90" onClick={handleComplete}>
          Complete
        </Button>
      </DialogClose>
    </DialogContent>
  );
}
