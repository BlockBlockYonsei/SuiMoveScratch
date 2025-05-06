import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  SuiMoveAbility,
  SuiMoveAbilitySet,
  SuiMoveNormalizedFunction,
  SuiMoveNormalizedStruct,
  SuiMoveNormalizedType,
  SuiMoveVisibility,
} from "@mysten/sui/client";
import TypeSelect from "../pages/NoCodeMove/components/TypeSelect";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { generateFunctionCode } from "@/pages/NoCodeMove/utils/generateCode";
import { SuiMoveFunction } from "@/types/move";

export default function ManageFunctionDetail({
  imports,
  structs,
  setFunctions,
}: {
  imports: Record<string, Record<string, SuiMoveNormalizedStruct>>;
  structs: Record<string, SuiMoveNormalizedStruct>;
  setFunctions: React.Dispatch<
    React.SetStateAction<Record<string, SuiMoveFunction>>
  >;
}) {
  const [open, setOpen] = useState(false);

  const [functionName, setFunctionName] = useState("new_function");
  const [visibility, setVisibility] = useState<SuiMoveVisibility>("Private");
  const [isEntry, setIsEntry] = useState(false);
  const [typeParameters, setTypeParameters] = useState<SuiMoveAbilitySet[]>([]);

  const [parameters, setParameters] = useState<SuiMoveNormalizedType[]>([]);
  const [returns, setReturns] = useState<SuiMoveNormalizedType[]>([]);

  const [newParamType, setNewParamType] =
    useState<SuiMoveNormalizedType>("Bool");
  const [newTypeParamAbilities, setNewTypeParamAbilities] = useState<
    SuiMoveAbility[]
  >([]);
  const [newReturnType, setNewReturnType] = useState<SuiMoveNormalizedType>();

  const toggleTypeParamAbility = (ability: SuiMoveAbility) => {
    setNewTypeParamAbilities((prev) =>
      prev.includes(ability)
        ? prev.filter((a) => a !== ability)
        : [...prev, ability],
    );
  };

  // 실제 추가 함수
  const commitTypeParameter = () => {
    if (!newTypeParamAbilities) return;

    setTypeParameters([
      ...typeParameters,
      {
        abilities: newTypeParamAbilities,
      },
    ]);
    // 초기화
    setNewTypeParamAbilities([]);
  };

  const handleAddParam = () => {
    if (!newParamType) return;
    setParameters((prev) => [...prev, newParamType]);
    setNewParamType("Bool");
  };

  const handleAddReturn = () => {
    if (!newReturnType) return;
    setReturns((prev) => [...prev, newReturnType]);
    setNewReturnType("Bool");
  };

  const handleComplete = () => {
    const newFunction: SuiMoveNormalizedFunction = {
      isEntry: isEntry,
      parameters: parameters,
      return: returns,
      typeParameters: typeParameters,
      visibility: "Private",
    };
    const newSuiMoveFunction: SuiMoveFunction = {
      function: newFunction,
      insideCode: {},
    };

    setFunctions((prev) => ({
      ...prev,
      [functionName]: newSuiMoveFunction,
    }));
    setOpen(false);
    // Optionally reset all states
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mx-auto">Manage Function</Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create a New Function</DialogTitle>
          <DialogDescription>
            Define function properties, type parameters, arguments and return
            types.
          </DialogDescription>
        </DialogHeader>

        {/* Name */}
        <div className="mb-2">
          <label className="block mb-1 text-sm font-semibold">
            Function Name
          </label>
          <Input
            value={functionName}
            onChange={(e) => setFunctionName(e.target.value)}
          />
        </div>

        {/* Entry + Visibility */}
        <div className="flex gap-4 mb-4">
          <Select
            onValueChange={(v) => setIsEntry(v === "true")}
            value={String(isEntry)}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Entry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Entry</SelectItem>
              <SelectItem value="false">Non-entry</SelectItem>
            </SelectContent>
          </Select>

          <Select
            onValueChange={(v) => setVisibility(v as SuiMoveVisibility)}
            value={visibility}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Private">Private</SelectItem>
              <SelectItem value="Friend">Friend</SelectItem>
              <SelectItem value="Public">Public</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Type Parameters */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-semibold">
            Type Parameters
          </label>

          <div className="flex place-content-between  gap-2 mb-2 flex-wrap">
            <div className="flex gap-x-2 mb-2 flex-wrap">
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
            <Button onClick={commitTypeParameter}>Add</Button>
          </div>

          {typeParameters.map((typeParameter, index) => (
            <li key={`T${index}`} className="flex gap-x-2">
              <span>T{index}</span>
              {typeParameter.abilities.map((type) => (
                <div>
                  <span>{type}</span>
                </div>
              ))}
            </li>
          ))}
        </div>

        {/* Parameters */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-semibold">Parameters</label>
          <div className="flex gap-2 mb-2">
            <TypeSelect
              imports={imports}
              structs={structs}
              typeParameters={[]}
              setType={setNewParamType}
            />
            <Button onClick={handleAddParam}>Add</Button>
          </div>
          {parameters.map((p, index) => (
            <li key={`arg${index}`} className="flex justify-between">
              {typeof p === "string"
                ? p
                : "Struct" in p
                ? p.Struct.name
                : "Unknown"}
            </li>
          ))}
        </div>

        {/* Returns */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-semibold">
            Return Types
          </label>
          <div className="flex gap-2 mb-2">
            <TypeSelect
              imports={imports}
              structs={structs}
              typeParameters={[]}
              setType={setNewReturnType}
            />
            <Button onClick={handleAddReturn}>Add</Button>
          </div>
          <ul className="text-sm space-y-1">
            {returns.map((ret, idx) => (
              <li key={idx} className="text-gray-700">
                {typeof ret === "string"
                  ? ret
                  : "Struct" in ret
                  ? ret.Struct.name
                  : "Unknown"}
              </li>
            ))}
          </ul>
        </div>

        {/* Preview */}
        <div className="bg-gray-100 p-4 text-sm rounded whitespace-pre-wrap mb-4">
          {generateFunctionCode(functionName, {
            function: {
              visibility,
              isEntry,
              typeParameters,
              parameters: parameters,
              return: returns,
            },
            insideCode: {},
          })}
        </div>

        <Button onClick={handleComplete}>Complete</Button>
      </DialogContent>
    </Dialog>
  );
}
