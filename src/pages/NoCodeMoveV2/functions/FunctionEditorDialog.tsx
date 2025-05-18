import { useContext, useState } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SuiMoveAbility,
  SuiMoveAbilitySet,
  SuiMoveNormalizedFunction,
  SuiMoveNormalizedType,
  SuiMoveVisibility,
} from "@mysten/sui/client";
import TypeSelect from "@/pages/NoCodeMoveV2/structs/StructTypeSelect";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { generateFunctionCode } from "@/pages/NoCodeMoveV2/utils/generateCode";
import { SuiMoveFunction } from "@/types/move-syntax";
import { DialogClose } from "@radix-ui/react-dialog";
import { SuiMoveModuleContext } from "@/context/SuiMoveModuleContext";
import AbilitySelector from "../structs/AbilitySelector";
import { X } from "lucide-react";

export default function FunctionEditorDialog() {
  const [functionName, setFunctionName] = useState("new_function");
  const [visibility, setVisibility] = useState<SuiMoveVisibility>("Private");
  const [isEntry, setIsEntry] = useState(false);
  const [typeParameters, setTypeParameters] = useState<SuiMoveAbilitySet[]>([]);
  const [typeParameterNames, setTypeParameterNames] = useState<string[]>([]);

  const [parameters, setParameters] = useState<SuiMoveNormalizedType[]>([]);
  const [parameterNames, setParameterNames] = useState<string[]>([]);
  const [newTypeParamName, setNewTypeParamName] = useState("");
  const [returns, setReturns] = useState<SuiMoveNormalizedType[]>([]);

  const [newParamType, setNewParamType] = useState<
    SuiMoveNormalizedType | undefined
  >();
  const [newTypeParamAbilities, setNewTypeParamAbilities] = useState<
    SuiMoveAbility[]
  >([]);
  const [newReturnType, setNewReturnType] = useState<
    SuiMoveNormalizedType | undefined
  >();

  const { imports, structs, functions, setFunctions } =
    useContext(SuiMoveModuleContext);

  const resetFunction = () => {
    setFunctionName("new_function");
    setVisibility("Private");
    setIsEntry(false);
    setTypeParameters([]);
    setParameters([]);
    setReturns([]);
    setNewParamType(undefined);
    setNewTypeParamAbilities([]);
    setNewReturnType(undefined);
  };

  const handleComplete = () => {
    const newFunction: SuiMoveNormalizedFunction & {
      typeParameterNames: string[];
    } = {
      isEntry: isEntry,
      parameters: parameters,
      return: returns,
      typeParameters: typeParameters,
      visibility: visibility,
      typeParameterNames: [],
    };
    const newSuiMoveFunction: SuiMoveFunction = {
      function: newFunction,
      insideCode: [],
    };

    setFunctions((prev) => {
      const newFunctionMap = new Map(prev);
      newFunctionMap.set(functionName, newSuiMoveFunction);
      return newFunctionMap;
    });

    resetFunction();
    // Optionally reset all states
  };

  return (
    <DialogContent className="lg:max-w-[900px] max-w-3xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Create a New Function</DialogTitle>
        <DialogDescription>
          Define function properties, type parameters, arguments and return
          types.
        </DialogDescription>
      </DialogHeader>

      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        <section className="col-span-6">
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
              <SelectTrigger className="w-32 cursor-pointer">
                <SelectValue placeholder="Entry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="cursor-pointer" value="true">
                  Entry
                </SelectItem>
                <SelectItem className="cursor-pointer" value="false">
                  Non-entry
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              onValueChange={(v) => setVisibility(v as SuiMoveVisibility)}
              value={visibility}
            >
              <SelectTrigger className="w-32 cursor-pointer">
                <SelectValue placeholder="Visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="cursor-pointer" value="Private">
                  Private
                </SelectItem>
                <SelectItem className="cursor-pointer" value="Friend">
                  Friend
                </SelectItem>
                <SelectItem className="cursor-pointer" value="Public">
                  Public
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Type Parameters */}
          <div className="mb-4">
            <label className="block mb-1 text-sm font-semibold">
              Type Parameters
            </label>

            <div className="flex place-content-between  gap-2 mb-2 flex-wrap">
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
                        abilities: newTypeParamAbilities,
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

            {/* 추가된 타입 파라미터 목록 */}
            {typeParameterNames.map((name, index) => (
              <div key={name} className="flex items-center gap-2 mb-2">
                <span className="text-blue-600 font-semibold min-w-[100px]">
                  {name}
                </span>
                <AbilitySelector
                  abilities={typeParameters[index].abilities}
                  onChange={(newAbilities) => {
                    setTypeParameters((prev) => {
                      const newParams = [...prev];
                      newParams[index] = {
                        ...newParams[index],
                        abilities: newAbilities,
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
            ))}
          </div>

          {/* Parameters */}
          <div className="mb-4">
            <label className="block mb-1 text-sm font-semibold">
              Parameters
            </label>
            <div className="flex gap-2 mb-2">
              {/* <TypeSelect
            imports={imports}
            structs={structs}
            typeParameters={[]}
            setType={setNewParamType}
          /> */}
              <Button
                className="cursor-pointer"
                onClick={() => {
                  if (!newParamType) return;
                  setParameters((prev) => [...prev, newParamType]);
                  setNewParamType("Bool");
                }}
              >
                Add
              </Button>
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
              {/* <TypeSelect
            imports={imports}
            structs={structs}
            typeParameters={[]}
            setType={setNewReturnType}
          /> */}
              <Button
                className="cursor-pointer"
                onClick={() => {
                  if (!newReturnType) return;
                  setReturns((prev) => [...prev, newReturnType]);
                  setNewReturnType("Bool");
                }}
              >
                Add
              </Button>
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
        </section>
        <section className="col-span-6">
          {/* Preview */}
          <div className="bg-gray-100 p-4 text-sm rounded whitespace-pre-wrap mb-4">
            {generateFunctionCode(functionName, {
              function: {
                visibility,
                isEntry,
                typeParameters,
                typeParameterNames,
                parameters: parameters,
                return: returns,
              },
              insideCode: [],
            })}
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
