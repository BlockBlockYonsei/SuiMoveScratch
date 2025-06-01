import { useContext } from "react";
import { X } from "lucide-react";
import { SuiMoveNormalizedType } from "@mysten/sui/client";

import { SuiMoveModuleContext } from "@/context/SuiMoveModuleContext";
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
import NewFieldEntityInput from "../components/NewFieldEntityInput";
import EditableInput from "../components/EditableInput";
import useStructDataHook from "./useStructDataHook";
import { camelCaseFilter, snakeCaseFilter } from "@/utils/filter";

export default function StructEditorDialog() {
  const {
    previewCode,
    structName,
    setStructName,
    abilities,
    setAbilities,
    fields,
    setFields,
    typeParameters,
    setTypeParameters,
    handleComplete,
  } = useStructDataHook();

  const { selectedStruct } = useContext(SuiMoveModuleContext);

  return (
    <DialogContent className="sm:max-w-[600px] lg:max-w-[1000px] max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {selectedStruct ? "Update Struct" : "onCreate a New Struct"}
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
                const firstLetterCapitalized = camelCaseFilter(raw);
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
            <NewFieldEntityInput
              title="Type Parameter"
              filter={camelCaseFilter}
              onCreate={(name) => {
                if (typeParameters.map((t) => t.name).includes(name)) return;

                setTypeParameters((prev) => [
                  ...prev,
                  {
                    name,
                    type: { isPhantom: false, constraints: { abilities: [] } },
                  },
                ]);
              }}
            />

            {/* 추가된 타입 파라미터 목록 */}
            {typeParameters.map((t, index) => (
              <div
                key={t.name}
                className="flex justify-between items-center gap-2 mb-2"
              >
                <EditableInput
                  defaultValue={t.name}
                  filter={camelCaseFilter}
                  onUpdate={(name: string) => {
                    if (t.name === name) return true;
                    if (typeParameters.some((t) => t.name === name))
                      return false;

                    setTypeParameters((prev) =>
                      prev.map((tp, i) => (i === index ? { ...tp, name } : tp))
                    );

                    return true;
                  }}
                />
                <button
                  className={`${
                    t.type.isPhantom ? "text-purple-500 border-purple-500" : ""
                  } border-2 font-semibold cursor-pointer rounded-md p-1 transition-all`}
                  onClick={() => {
                    setTypeParameters((prev) => {
                      const newTypeParam = {
                        ...t,
                        type: {
                          ...t.type,
                          isPhantom: !t.type.isPhantom,
                        },
                      };

                      return prev.map((tp, i) =>
                        i === index ? newTypeParam : tp
                      );
                    });
                  }}
                >
                  {/* Phantom */}
                  <span className="text-xs text-blue-600 font-semibold">
                    phantom
                  </span>
                </button>
                <div className="flex">
                  <AbilitySelector
                    abilities={t.type.constraints.abilities}
                    onChange={(newAbilities) => {
                      setTypeParameters((prev) => {
                        const newTypeParam = {
                          ...t,
                          type: {
                            ...t.type,
                            constraints: { abilities: newAbilities },
                          },
                        };

                        return prev.map((tp, i) =>
                          i === index ? newTypeParam : tp
                        );
                      });
                    }}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="cursor-pointer text-gray-500 hover:text-gray-700 p-1 h-7 w-7 flex-shrink-0"
                    onClick={() => {
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
            <NewFieldEntityInput
              title="Field"
              filter={snakeCaseFilter}
              onCreate={(name: string) => {
                if (fields.some((r) => r.name === name)) return;
                setFields([...fields, { name: name, type: "U64" }]);
              }}
            />

            {fields.map((field, index) => (
              <div key={field.name} className="flex items-center gap-2 mb-2">
                <EditableInput
                  defaultValue={field.name}
                  filter={snakeCaseFilter}
                  onUpdate={(name: string) => {
                    if (field.name === name) return true;
                    if (fields.some((field) => field.name === name))
                      return false;
                    setFields((prev) =>
                      prev.map((f, i) => (i === index ? { ...f, name } : f))
                    );

                    return true;
                  }}
                />
                <TypeSelector
                  typeParameters={typeParameters}
                  suiMoveType={field.type}
                  onSelect={(type: SuiMoveNormalizedType) => {
                    setFields((prev) =>
                      prev.map((f, i) => (i === index ? { ...f, type } : f))
                    );
                  }}
                  st="struct"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="cursor-pointer text-gray-500 hover:text-gray-700 p-1 h-7 w-7 flex-shrink-0"
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
            <pre className="shiki overflow-x-auto rounded p-4 bg-[#2e3440ff] text-white text-sm">
              <code dangerouslySetInnerHTML={{ __html: previewCode }} />
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
