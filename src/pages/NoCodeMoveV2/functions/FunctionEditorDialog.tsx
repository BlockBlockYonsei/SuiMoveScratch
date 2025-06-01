import { useContext } from "react";
import { DialogClose } from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { SuiMoveNormalizedType, SuiMoveVisibility } from "@mysten/sui/client";

import { SuiMoveModuleContext } from "@/context/SuiMoveModuleContext";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import AbilitySelector from "../components/AbilitySelector";
import TypeSelector from "../components/TypeSelector";
import FunctionSelector from "../components/FunctionSelector";
import NewFieldEntityInput from "../components/NewFieldEntityInput";
import EditableInput from "../components/EditableInput";
import useFunctionDataHook from "./useFunctionDataHook";

export default function FunctionEditorDialog() {
  const {
    previewCode,
    functionName,
    setFunctionName,
    visibility,
    setVisibility,
    isEntry,
    setIsEntry,
    parameters,
    setParameters,
    returns,
    setReturns,
    typeParameters,
    setTypeParameters,
    insideCodes,
    setInsideCodes,
    handleComplete,
  } = useFunctionDataHook();

  const { selectedFunction } = useContext(SuiMoveModuleContext);

  return (
    <DialogContent className="sm:max-w-[600px] lg:max-w-[1000px] max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {selectedFunction ? "Update Function" : "onCreate a New Function"}
        </DialogTitle>

        <DialogDescription>
          Define function properties, type parameters, arguments and return
          types.
        </DialogDescription>
      </DialogHeader>

      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        <section className="col-span-6 ">
          {/* Name */}
          <div className="mb-2">
            <label className="block mb-1 font-semibold">Function Name</label>
            <Input
              value={functionName}
              onChange={(e) => {
                const raw = e.target.value;
                if (raw.length > 0 && /^[\d_]/.test(raw)) {
                  return; // 첫 글자가 숫자거나 _면 무시
                }
                const onlyAlphabet = e.target.value.replace(
                  /[^a-zA-Z0-9_]/g,
                  ""
                );
                setFunctionName(onlyAlphabet.toLocaleLowerCase());
              }}
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
            <NewFieldEntityInput
              title="Type Parameter"
              filter={(value: string) => {
                if (value.length > 0 && /^\d/.test(value)) {
                  return ""; // 첫 글자가 숫자면 무시
                }
                const onlyAlphabet = value.replace(/[^a-zA-Z0-9]/g, "");
                const firstLetterCapitalized =
                  onlyAlphabet.charAt(0).toUpperCase() + onlyAlphabet.slice(1);

                return firstLetterCapitalized;
              }}
              onCreate={(name) => {
                if (typeParameters.map((t) => t.name).includes(name)) return;

                setTypeParameters((prev) => [
                  ...prev,
                  { name, type: { abilities: [] } },
                ]);
              }}
            />

            {/* 추가된 타입 파라미터 목록 */}
            {typeParameters.map((t, index) => (
              <div key={t.name} className="flex items-center gap-2 mb-2">
                <EditableInput
                  defaultValue={t.name}
                  filter={(value: string) => {
                    if (value.length > 0 && /^\d/.test(value)) {
                      return ""; // 첫 글자가 숫자면 무시
                    }
                    const onlyAlphabet = value.replace(/[^a-zA-Z0-9]/g, "");
                    const firstLetterCapitalized =
                      onlyAlphabet.charAt(0).toUpperCase() +
                      onlyAlphabet.slice(1);

                    return firstLetterCapitalized;
                  }}
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
                <AbilitySelector
                  abilities={typeParameters[index].type.abilities}
                  onChange={(newAbilities) => {
                    setTypeParameters((prev) =>
                      prev.map((tp, i) =>
                        i === index
                          ? { ...tp, type: { abilities: newAbilities } }
                          : tp
                      )
                    );
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
            <NewFieldEntityInput
              title="Parameter"
              filter={(value: string) => {
                if (value.length > 0 && /^[\d_]/.test(value)) {
                  return ""; // 첫 글자가 숫자거나 _면 무시
                }
                const onlyAlphabet = value.replace(/[^a-zA-Z0-9_]/g, "");
                return onlyAlphabet;
              }}
              onCreate={(name: string) => {
                if (parameters.some((p) => p.name === name)) return;
                setParameters((prev) => [...prev, { name: name, type: "U64" }]);
              }}
            />

            {parameters.map((param, index) => (
              <div key={param.name} className="flex items-center gap-2 mb-2">
                <EditableInput
                  defaultValue={param.name}
                  filter={(value: string) => {
                    if (value.length > 0 && /^[\d_]/.test(value)) {
                      return ""; // 첫 글자가 숫자거나 _면 무시
                    }
                    const onlyAlphabet = value.replace(/[^a-zA-Z0-9_]/g, "");
                    return onlyAlphabet;
                  }}
                  onUpdate={(name: string) => {
                    if (param.name === name) return true;
                    if (parameters.some((p) => p.name === name)) return false;

                    setParameters((prev) =>
                      prev.map((r, i) => (i === index ? { ...r, name } : r))
                    );

                    return true;
                  }}
                />
                <TypeSelector
                  typeParameters={typeParameters}
                  suiMoveType={param.type}
                  onSelect={(type: SuiMoveNormalizedType) => {
                    setParameters((prev) =>
                      prev.map((f, i) => (i === index ? { ...f, type } : f))
                    );
                  }}
                  st="function"
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
            <NewFieldEntityInput
              title="Return"
              filter={(value: string) => {
                if (value.length > 0 && /^[\d_]/.test(value)) {
                  return ""; // 첫 글자가 숫자거나 _면 무시
                }
                const onlyAlphabet = value.replace(/[^a-zA-Z0-9_]/g, "");
                return onlyAlphabet;
              }}
              onCreate={(name: string) => {
                if (returns.some((r) => r.name === name)) return;
                setReturns([...returns, { name: name, type: "U64" }]);
              }}
            />

            {returns.map((r, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <EditableInput
                  defaultValue={r.name}
                  filter={(value: string) => {
                    if (value.length > 0 && /^[\d_]/.test(value)) {
                      return ""; // 첫 글자가 숫자거나 _면 무시
                    }
                    const onlyAlphabet = value.replace(/[^a-zA-Z0-9_]/g, "");
                    return onlyAlphabet;
                  }}
                  onUpdate={(name: string) => {
                    if (r.name === name) return true;
                    if (returns.some((r) => r.name === name)) return false;
                    setReturns((prev) =>
                      prev.map((r, i) => (i === index ? { ...r, name } : r))
                    );

                    return true;
                  }}
                />
                <TypeSelector
                  typeParameters={typeParameters}
                  suiMoveType={r.type}
                  onSelect={(type: SuiMoveNormalizedType) => {
                    setReturns((prev) =>
                      prev.map((r, i) => (i === index ? { ...r, type } : r))
                    );
                  }}
                  st="function"
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
          <pre className="shiki max-w-[550px] overflow-x-auto rounded p-4 bg-[#2e3440ff] text-white text-sm">
            <code dangerouslySetInnerHTML={{ __html: previewCode }} />
          </pre>
          <FunctionSelector
            // func={
            //   {
            //     functionName: functionName,
            //     visibility,
            //     isEntry,
            //     typeParameters: typeParameters.map((t) => t.type),
            //     typeParameterNames: typeParameters.map((t) => t.name),
            //     parameters: parameters.map((p) => p.type),
            //     parameterNames: parameters.map((p) => p.name),
            //     return: returns.map((r) => r.type),
            //     insideCode: insideCodes,
            //   } as SuiMoveFunction
            // }
            addFunction={(line) => {
              setInsideCodes((prev) => [...prev, line]);
            }}
          />
          <Button
            className="cursor-pointer w-90"
            onClick={() => {
              // setInsideCodes((prev) => {
              //   const [pkg, module, name] =
              //     newInsideCodeFunctionName.split("::");
              //   if (pkg === "primitive") {
              //     return [...prev, name as SuiMoveNormalizedType];
              //   }
              //   if (pkg === "0x0" && module === "currentModuleStruct") {
              //     const selectedStruct = structs.get(name);
              //     if (!selectedStruct) return prev;
              //     return [
              //       ...prev,
              //       {
              //         struct: { ...selectedStruct, structName: name },
              //       },
              //     ];
              //   }
              //   const importedModule = imports.get(`${pkg}::${module}`);
              //   if (pkg === "0x0" && module === "currentModuleFunction") {
              //     const selectedFunction = functions.get(name);
              //     if (!selectedFunction) return prev;
              //     return [
              //       ...prev,
              //       {
              //         functionName: name,
              //         visibility: selectedFunction.function.visibility,
              //         isEntry: selectedFunction.function.isEntry,
              //         typeParameters: selectedFunction.function.typeParameters,
              //         typeArgumentNames:
              //           selectedFunction.function.typeParameters.map(
              //             (_, i) => `T${i}`
              //           ),
              //         parameters: selectedFunction.function.parameters,
              //         argumentNames: selectedFunction.function.parameters.map(
              //           (_, i) => `P${i}`
              //         ),
              //         return: selectedFunction.function.return,
              //         returnVariableNames:
              //           selectedFunction.function.parameters.map(
              //             (_, i) => `R${i}`
              //           ),
              //       } as FunctionInsideCodeLine,
              //     ];
              //   }
              //   if (importedModule && importedModule.functions) {
              //     const selectedFunction = importedModule.functions[name];
              //     return [
              //       ...prev,
              //       {
              //         functionName: `${module}::${name}`,
              //         visibility: selectedFunction.visibility,
              //         isEntry: selectedFunction.isEntry,
              //         typeParameters: selectedFunction.typeParameters,
              //         typeArgumentNames: selectedFunction.typeParameters.map(
              //           (_, i) => `T${i}`
              //         ),
              //         parameters: selectedFunction.parameters,
              //         argumentNames: selectedFunction.parameters.map(
              //           (_, i) => `P${i}`
              //         ),
              //         return: selectedFunction.return,
              //         returnVariableNames: selectedFunction.parameters.map(
              //           (_, i) => `R${i}`
              //         ),
              //       } as FunctionInsideCodeLine,
              //     ];
              //   }
              //   return prev;
              // });
            }}
          >
            Add Function Logic
          </Button>
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
