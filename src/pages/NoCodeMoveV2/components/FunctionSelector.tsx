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
                value={`primitive::primitive::${type}`}
                className="col-span-1 cursor-pointer hover:bg-gray-200"
              >
                {type}
              </SelectItem>
            );
          })}
        </div>

        <Separator className="my-2" />

        <Label className="px-2 text-xs text-muted-foreground">
          Current Module Structs
        </Label>
        <div className="grid grid-cols-2">
          {[...structs.keys()].map((name) => (
            <SelectItem
              key={name}
              value={`0x0::currentModuleStruct::${name}`}
              className="cursor-pointer hover:bg-gray-200"
            >
              {name}
            </SelectItem>
          ))}
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
                value={`0x0::currentModuleFunction::${name}`}
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

        {Object.entries(imports)
          .flatMap(([packageAddress, modulesMap]) =>
            Array.from(modulesMap.entries()).map(
              ([moduleName, data]) =>
                [packageAddress, moduleName, data] as const
            )
          )
          .map(([packageAddress, moduleName, data]) => {
            // const [pkgAddress, moduleName] = key.split("::");
            const alias = SUI_PACKAGE_ALIASES[packageAddress] || packageAddress;
            if (!data.functions) return;

            if (Object.keys(data.functions).length === 0) return;

            return (
              <div key={moduleName}>
                <div>
                  {alias}::{moduleName}
                </div>
                <div className="grid grid-cols-2">
                  {Object.keys(data.functions).map((functionName) => {
                    return (
                      <SelectItem
                        key={functionName}
                        value={`${packageAddress}::${moduleName}::${functionName}`}
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
