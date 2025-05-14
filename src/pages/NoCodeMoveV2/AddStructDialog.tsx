import { useState } from "react";
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

export default function AddStructDialog({ imports, structs, setStructs }: any) {
  const [structName, setStructName] = useState("MyStruct");
  const [abilities, setAbilities] = useState<SuiMoveAbility[]>([]);
  const [typeParameterNames, setTypeParameterNames] = useState<string[]>([]);
  const [typeParameters, setTypeParameters] = useState<
    SuiMoveStructTypeParameter[]
  >([]);
  const [fields, setFields] = useState<
    { name: string; type: SuiMoveNormalizedType }[]
  >([]);
  const [newFieldName, setNewFieldName] = useState("");
  const [newTypeParamName, setNewTypeParamName] = useState("");
  const [newTypeParamAbilities, setNewTypeParamAbilities] = useState<
    SuiMoveAbility[]
  >([]);

  // toggle 함수
  const toggleTypeParamAbility = (ability: SuiMoveAbility) => {
    setNewTypeParamAbilities((prev) =>
      prev.includes(ability)
        ? prev.filter((a) => a !== ability)
        : [...prev, ability]
    );
  };

  // 실제 추가 함수
  const commitTypeParameter = () => {
    if (!newTypeParamName || typeParameterNames.includes(newTypeParamName))
      return;

    setTypeParameterNames([...typeParameterNames, newTypeParamName]);
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
  };

  const toggleAbility = (ability: SuiMoveAbility) => {
    setAbilities((prev) =>
      prev.includes(ability)
        ? prev.filter((a) => a !== ability)
        : [...prev, ability]
    );
  };

  const addField = () => {
    if (!newFieldName || fields.some((f) => f.name === newFieldName)) return;
    setFields([...fields, { name: newFieldName, type: "U64" }]);
    setNewFieldName("");
  };

  const updateFieldType = (
    fieldName: string,
    newType: SuiMoveNormalizedType
  ) => {
    setFields((prev) =>
      prev.map((f) => (f.name === fieldName ? { ...f, type: newType } : f))
    );
  };

  const handleComplete = () => {
    if (!structName) return;

    setStructs((prev: any) => ({
      ...prev,
      [structName]: {
        abilities: { abilities },
        fields,
        typeParameters,
        typeParameterNames,
      },
    }));

    // dialog 닫기

    // 초기화 (선택사항)
    setStructName("MyStruct");
    setAbilities([]);
    setFields([]);
    setTypeParameterNames([]);
    setTypeParameters([]);
  };

  return (
    <DialogContent className="max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Create a New Struct</DialogTitle>
        <DialogDescription>
          Add abilities, type parameters, and fields for your struct.
        </DialogDescription>
      </DialogHeader>

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
          {["copy", "drop", "store", "key"].map((a) => (
            <Button
              key={a}
              variant={
                abilities.includes(a as SuiMoveAbility) ? "default" : "outline"
              }
              onClick={() => toggleAbility(a as SuiMoveAbility)}
            >
              {a}
            </Button>
          ))}
        </div>
      </div>

      {/* Type Parameters */}
      <div className="mb-4">
        <div className="flex gap-2 mb-2">
          <Input
            placeholder="Type parameter name"
            value={newTypeParamName}
            onChange={(e) => setNewTypeParamName(e.target.value)}
          />
          <Button className="cursor-pointer" onClick={commitTypeParameter}>
            Add
          </Button>
        </div>

        <div className="flex gap-2 mb-2 flex-wrap">
          {["copy", "drop", "store", "key"].map((a) => (
            <Button
              key={a}
              variant={
                newTypeParamAbilities.includes(a as SuiMoveAbility)
                  ? "default"
                  : "outline"
              }
              onClick={() => toggleTypeParamAbility(a as SuiMoveAbility)}
              size="sm"
            >
              {a}
            </Button>
          ))}
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
              if (e.key === "Enter") addField();
            }}
          />
          <Button className="cursor-pointer" onClick={addField}>
            Add
          </Button>
        </div>

        {fields.map((field) => (
          <div key={field.name} className="flex items-center gap-2 mb-2">
            <span className="text-blue-600 font-semibold">{field.name}</span>
            <TypeSelect
              imports={imports}
              structs={structs}
              typeParameters={[]}
              setType={(type) => updateFieldType(field.name, type)}
            />
          </div>
        ))}
      </div>

      <div className="mt-4">
        <pre className="text-sm bg-gray-100 p-4 rounded whitespace-pre-wrap">
          {generateStructCode(
            structName,
            {
              abilities: { abilities },
              typeParameters,
              fields,
            },
            typeParameterNames
          )}
        </pre>
      </div>

      <DialogClose>
        <Button className="cursor-pointer" onClick={handleComplete}>
          Complete
        </Button>
      </DialogClose>
    </DialogContent>
  );
}
