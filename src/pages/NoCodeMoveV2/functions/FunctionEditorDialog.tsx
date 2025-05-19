import { useContext, useEffect, useState } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SuiMoveAbilitySet,
  SuiMoveNormalizedFunction,
  SuiMoveNormalizedType,
  SuiMoveVisibility,
} from "@mysten/sui/client";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { SuiMoveFunction } from "@/types/move-syntax";
import { DialogClose } from "@radix-ui/react-dialog";
import { SuiMoveModuleContext } from "@/context/SuiMoveModuleContext";
import AbilitySelector from "../structs/AbilitySelector";
import { X } from "lucide-react";
import FunctionTypeSelector from "./FunctionTypeSelector";
import { generateFunctionCode } from "../utils/generateCode";

export default function FunctionEditorDialog() {
  const [functionName, setFunctionName] = useState("new_function");
  const [visibility, setVisibility] = useState<SuiMoveVisibility>("Private");
  const [isEntry, setIsEntry] = useState(false);

  const [parameters, setParameters] = useState<
    { name: string; type: SuiMoveNormalizedType }[]
  >([]);
  const [returns, setReturns] = useState<
    { name: string; type: SuiMoveNormalizedType }[]
  >([]);
  const [typeParameters, setTypeParameters] = useState<
    { name: string; type: SuiMoveAbilitySet }[]
  >([]);

  const [newParamName, setNewParamName] = useState("");
  const [newTypeParamName, setNewTypeParamName] = useState("");
  const [newReturnName, setNewReturnName] = useState("");

  const { functions, setFunctions, selectedFunction } =
    useContext(SuiMoveModuleContext);

  useEffect(() => {
    if (selectedFunction) {
      const functionData = functions.get(selectedFunction);
      if (functionData) {
        setFunctionName(selectedFunction);
        setVisibility(functionData.function.visibility);
        setTypeParameters(
          functionData.function.typeParameters.map((tp, i) => ({
            name: functionData.function.typeParameterNames[i],
            type: tp,
          }))
        );
        setParameters(
          functionData.function.parameters.map((p, i) => ({
            name: functionData.function.parameterNames[i],
            type: p,
          }))
        );
        setReturns(
          functionData.function.return.map((r, i) => ({
            name: functionData.function.returnNames[i],
            type: r,
          }))
        );
      }
    } else {
      // 새로운 struct 생성 시 초기화
      setFunctionName("new_function");
      setVisibility("Private");
      setTypeParameters([]);
      setParameters([]);
      setReturns([]);
    }
  }, [selectedFunction, functions]);

  const resetFunction = () => {
    setFunctionName("new_function");
    setVisibility("Private");
    setIsEntry(false);
    setTypeParameters([]);
    setParameters([]);
    setReturns([]);
  };

  const handleComplete = () => {
    const newFunctionData: SuiMoveNormalizedFunction & {
      typeParameterNames: string[];
      parameterNames: string[];
      returnNames: string[];
    } = {
      isEntry: isEntry,
      visibility: visibility,
      typeParameters: typeParameters.map((t) => t.type),
      typeParameterNames: typeParameters.map((t) => t.name),
      parameters: parameters.map((p) => p.type),
      parameterNames: parameters.map((p) => p.name),
      return: returns.map((r) => r.type),
      returnNames: parameters.map((p) => p.name),
    };
    const newSuiMoveFunctionData: SuiMoveFunction = {
      function: newFunctionData,
      insideCode: [],
    };

    setFunctions((prev) => {
      const newFunctionMap = new Map(prev);
      newFunctionMap.set(functionName, newSuiMoveFunctionData);
      // 이전 function 이름이 있고, 새로운 이름과 다른 경우 (이름 변경)
      if (selectedFunction && selectedFunction !== functionName) {
        // 이전 function 데이터 삭제
        newFunctionMap.delete(selectedFunction);
      }

      newFunctionMap.set(functionName, newSuiMoveFunctionData);
      return newFunctionMap;
    });

    resetFunction();
    // Optionally reset all states
  };

  return (
    <DialogContent className="lg:max-w-[900px] max-w-3xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {selectedFunction ? "Update Function" : "Create a New Function"}
        </DialogTitle>

        <DialogDescription>
          Define function properties, type parameters, arguments and return
          types.
        </DialogDescription>
      </DialogHeader>

      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        <section className="col-span-6">
          {/* Name */}
          <div className="mb-2">
            <label className="block mb-1 font-semibold">Function Name</label>
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
            <label className="block mb-1 font-semibold">Type Parameters</label>

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
                    typeParameters.map((t) => t.name).includes(newTypeParamName)
                  )
                    return;

                  setTypeParameters((prev) => [
                    ...prev,
                    {
                      name: newTypeParamName,
                      type: {
                        abilities: [],
                      },
                    },
                  ]);

                  // 초기화
                  setNewTypeParamName("");
                  // setNewTypeParamAbilities([]);
                }}
              >
                Add
              </Button>
            </div>

            {/* 추가된 타입 파라미터 목록 */}
            {typeParameters.map((t, index) => (
              <div key={t.name} className="flex items-center gap-2 mb-2">
                <span className="text-blue-600 font-semibold min-w-[100px]">
                  {t.name}
                </span>
                <AbilitySelector
                  abilities={typeParameters[index].type.abilities}
                  onChange={(newAbilities) => {
                    setTypeParameters((prev) => {
                      const newTypeParams = [...prev];
                      newTypeParams[index] = {
                        ...newTypeParams[index],
                        type: { abilities: newAbilities },
                      };
                      return newTypeParams;
                    });
                  }}
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700 p-1 h-7 w-7 flex-shrink-0 cursor-pointer"
                  onClick={() => {
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
            <label className="block font-semibold mb-1">Parameters</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newParamName}
                placeholder="Parameter name"
                onChange={(e) => setNewParamName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (
                      !newParamName ||
                      parameters.some((p) => p.name === newParamName)
                    )
                      return;
                    setParameters((prev) => [
                      ...prev,
                      { name: newParamName, type: "U64" },
                    ]);
                    setNewParamName("");
                  }
                }}
              />
              <Button
                className="cursor-pointer"
                onClick={() => {
                  if (
                    !newParamName ||
                    parameters.some((p) => p.name === newParamName)
                  )
                    return;
                  setParameters([
                    ...parameters,
                    { name: newParamName, type: "U64" },
                  ]);
                  setNewParamName("");
                }}
              >
                Add
              </Button>
            </div>

            {parameters.map((param, index) => (
              <div key={param.name} className="flex items-center gap-2 mb-2">
                <span className="text-blue-600 font-semibold min-w-[100px]">
                  {param.name}
                </span>
                <FunctionTypeSelector
                  functionName={functionName}
                  typeParameters={typeParameters}
                  defaultValue={param.type}
                  onChange={(type: SuiMoveNormalizedType) => {
                    setParameters((prev) =>
                      prev.map((f, i) => (i === index ? { ...f, type } : f))
                    );
                  }}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700 p-1 h-7 w-7 flex-shrink-0 cursor-pointer"
                  onClick={() => {
                    setParameters((prev) => prev.filter((_, i) => i !== index));
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Returns */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">Returns</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newReturnName}
                placeholder="Returns name"
                onChange={(e) => setNewReturnName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (
                      !newReturnName ||
                      returns.some((p) => p.name === newReturnName)
                    )
                      return;
                    setReturns((prev) => [
                      ...prev,
                      { name: newReturnName, type: "U64" },
                    ]);
                    setNewReturnName("");
                  }
                }}
              />
              <Button
                className="cursor-pointer"
                onClick={() => {
                  if (
                    !newReturnName ||
                    returns.some((p) => p.name === newReturnName)
                  )
                    return;
                  setReturns([
                    ...returns,
                    { name: newReturnName, type: "U64" },
                  ]);
                  setNewReturnName("");
                }}
              >
                Add
              </Button>
            </div>

            {returns.map((r, index) => (
              <div key={r.name} className="flex items-center gap-2 mb-2">
                <span className="text-blue-600 font-semibold min-w-[100px]">
                  {r.name}
                </span>
                <FunctionTypeSelector
                  functionName={functionName}
                  typeParameters={typeParameters}
                  defaultValue={r.type}
                  onChange={(type: SuiMoveNormalizedType) => {
                    setReturns((prev) =>
                      prev.map((f, i) => (i === index ? { ...f, type } : f))
                    );
                  }}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700 p-1 h-7 w-7 flex-shrink-0 cursor-pointer"
                  onClick={() => {
                    setReturns((prev) => prev.filter((_, i) => i !== index));
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </section>

        <section className="col-span-6">
          {/* Preview */}
          <div className="bg-gray-100 p-4 text-sm rounded whitespace-pre-wrap mb-4">
            {generateFunctionCode(functionName, {
              function: {
                visibility,
                isEntry,
                typeParameters: typeParameters.map((t) => t.type),
                typeParameterNames: typeParameters.map((t) => t.name),
                parameters: parameters.map((p) => p.type),
                parameterNames: parameters.map((p) => p.name),
                return: returns.map((r) => r.type),
                returnNames: returns.map((r) => r.name),
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
