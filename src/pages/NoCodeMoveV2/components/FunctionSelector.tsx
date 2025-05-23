import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  SuiMoveAbilitySet,
  SuiMoveNormalizedType,
  SuiMoveStructTypeParameter,
} from "@mysten/sui/client";
import { useContext } from "react";
import { SuiMoveModuleContext } from "@/context/SuiMoveModuleContext";
import { SUI_PACKAGE_ALIASES } from "@/Constants";
import { PRIMITIVE_TYPES } from "@/Constants";

export default function FunctionSelector({
  nameKey,
  setNewInsideCodeFunctionName,
}: {
  nameKey: string;
  typeParameters:
    | { name: string; type: SuiMoveStructTypeParameter }[]
    | { name: string; type: SuiMoveAbilitySet }[];
  setNewInsideCodeFunctionName: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { imports, structs, functions, selectedStruct } =
    useContext(SuiMoveModuleContext);

  const convertTypeToSelectValue = (type: SuiMoveNormalizedType): string => {
    if (!selectedStruct) return "primitive:::U64";

    if (typeof type === "string") {
      return `primitive:::${type}`;
    } else if ("TypeParameter" in type) {
      const currentStruct = structs.get(selectedStruct);
      return currentStruct
        ? `typeParameter:::${
            currentStruct.typeParameterNames[type.TypeParameter]
          }`
        : "";
    } else if ("Struct" in type) {
      const { address, module, name } = type.Struct;
      return `moduleStruct:::${name}::${module}::${address}`;
    } else if ("Reference" in type) {
      return `${convertTypeToSelectValue(type.Reference)}::reference`;
    } else if ("MutableReference" in type) {
      return `${convertTypeToSelectValue(type.MutableReference)}::mutReference`;
    } else if ("Vector" in type) {
      return `${convertTypeToSelectValue(type.Vector)}::vector`;
    }
    return "";
  };

  return (
    <Select onValueChange={setNewInsideCodeFunctionName}>
      <SelectTrigger className="cursor-pointer">
        <SelectValue placeholder="Select type..." />
      </SelectTrigger>
      <SelectContent className="max-h-80 max-w-140 overflow-y-auto grid grid-cols-4">
        <Label className="px-2 text-xs text-muted-foreground">
          Primitive Types
        </Label>
        <div className="grid grid-cols-4">
          {PRIMITIVE_TYPES.map((type) => {
            if (typeof type !== "string") return null;
            return (
              <SelectItem
                key={type}
                value={`primitive:::${type}`}
                className="col-span-1 cursor-pointer hover:bg-gray-200"
              >
                {type}
              </SelectItem>
            );
          })}
        </div>

        <Separator className="my-2" />

        <Label className="px-2 text-xs text-muted-foreground">
          Current Module Functions
        </Label>
        <div className="grid grid-cols-2">
          {[...functions.keys()]
            .filter((name) => name !== nameKey)
            .map((name) => (
              <SelectItem
                key={name}
                value={`0x0::currentModule::${name}`}
                className="cursor-pointer hover:bg-gray-200"
              >
                {name}
              </SelectItem>
            ))}
        </div>

        <Separator className="my-2" />

        <Label className="px-2 text-xs text-muted-foreground">
          Imported Module Functions
        </Label>

        {[...imports.entries()].map(([key, module]) => {
          const [pkgAddress, moduleName] = key.split("::");
          const alias = SUI_PACKAGE_ALIASES[pkgAddress] || pkgAddress;
          if (!module.functions) return;

          if (Object.keys(module.functions).length === 0) return;

          return (
            <div key={moduleName}>
              <div>
                {alias}::{moduleName}
              </div>
              <div className="grid grid-cols-2">
                {Object.keys(module.functions).map((functionName) => {
                  return (
                    <SelectItem
                      key={functionName}
                      value={`${pkgAddress}::${moduleName}::${functionName}`}
                      className="cursor-pointer hover:bg-gray-200 break-words whitespace-normal truncate"
                    >
                      {functionName}
                    </SelectItem>
                  );
                })}
              </div>
            </div>
          );
        })}
      </SelectContent>
    </Select>
  );
}
