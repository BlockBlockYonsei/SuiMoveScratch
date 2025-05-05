import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  SuiMoveAbility,
  SuiMoveNormalizedType,
  SuiMoveStructTypeParameter,
} from "@mysten/sui/client";
import TypeSelect from "../pages/NoCodeMove/components/TypeSelect";

export default function EditStructDialog({
  open,
  setOpen,
  structToEdit,
  imports,
  structs,
  setStructs,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  structToEdit: any;
  imports: any;
  structs: any;
  setStructs: any;
}) {
  const [structName, setStructName] = useState("");
  const [abilities, setAbilities] = useState<SuiMoveAbility[]>([]);
  const [typeParameters, setTypeParameters] = useState<
    SuiMoveStructTypeParameter[]
  >([]);
  const [fields, setFields] = useState<
    { name: string; type: SuiMoveNormalizedType }[]
  >([]);
  const [typeParameterNames, setTypeParameterNames] = useState<string[]>([]);

  useEffect(() => {
    console.log("Received structToEdit:", structToEdit);
    if (structToEdit) {
      // structToEdit가 있을 때 데이터를 초기화
      setStructName(structToEdit.name);
      setAbilities(structToEdit.abilities?.abilities || []);
      setFields(structToEdit.fields || []);
      setTypeParameters(structToEdit.typeParameters || []);
      setTypeParameterNames(structToEdit.typeParameterNames || []);
      setOpen(true);
    }
  }, [structToEdit]);

  // 필드 업데이트 함수
  const updateFieldType = (
    fieldName: string,
    newType: SuiMoveNormalizedType,
  ) => {
    setFields((prev) =>
      prev.map((f) => (f.name === fieldName ? { ...f, type: newType } : f)),
    );
  };

  const updateTypeParameterName = (index: number, newName: string) => {
    setTypeParameterNames((prev) => {
      const newNames = [...prev];
      newNames[index] = newName;
      return newNames;
    });
  };

  // 수정한 내용을 저장하는 함수
  const handleSave = () => {
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

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Struct</DialogTitle>
          <DialogDescription>
            Edit the details of your struct.
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
                  abilities.includes(a as SuiMoveAbility)
                    ? "default"
                    : "outline"
                }
                onClick={() =>
                  setAbilities((prev) =>
                    prev.includes(a as SuiMoveAbility)
                      ? prev.filter((ability) => ability !== a)
                      : [...prev, a as SuiMoveAbility],
                  )
                }
              >
                {a}
              </Button>
            ))}
          </div>
        </div>

        {/* Type Parameters */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">Type Parameters</label>
          <div className="flex gap-2 mb-2">
            {typeParameters.map((param, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={typeParameterNames[index] || `T${index}`}
                  onChange={(e) =>
                    updateTypeParameterName(index, e.target.value)
                  }
                  className="w-20"
                />
                <TypeSelect
                  imports={imports}
                  structs={structs}
                  typeParameters={[]}
                  defaultValue={param.constraints}
                  setType={(type) =>
                    updateFieldType(
                      typeParameterNames[index] || `T${index}`,
                      type,
                    )
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {/* Fields */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">Fields</label>
          {fields.map((field) => (
            <div key={field.name} className="flex items-center gap-2 mb-2">
              <span className="text-blue-600 font-semibold">{field.name}</span>
              <TypeSelect
                imports={imports}
                structs={structs}
                typeParameters={[]}
                defaultValue={field.type}
                setType={(type) => updateFieldType(field.name, type)}
              />
            </div>
          ))}
        </div>

        <Button onClick={handleSave}>Save Changes</Button>
      </DialogContent>
    </Dialog>
  );
}
