import { useContext } from "react";

import { SuiMoveModuleContext } from "@/context/SuiMoveModuleContext";
import { SUI_PACKAGE_ALIASES, PRIMITIVE_TYPES } from "@/Constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FunctionInsideCodeLine, SuiMoveStruct } from "@/types/move-type";
import { SuiMoveNormalizedType } from "@mysten/sui/client";
import { convertSuiMoveStructToSuiMoveNomalizedType } from "@/lib/convertType";

export default function FunctionSelector({
  addFunction,
}: {
  addFunction: (type: FunctionInsideCodeLine) => void;
}) {
  const { imports, structs, functions } = useContext(SuiMoveModuleContext);

  return (
    <Select
      onValueChange={(value: string) => {
        const convertedType: FunctionInsideCodeLine = JSON.parse(value);
        addFunction(convertedType);
      }}
    >
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

            const value =
              type === "Address" || type === "Signer"
                ? `"0x0"`
                : type === "Bool"
                ? "false"
                : "0";
            return (
              <SelectItem
                key={type}
                value={JSON.stringify({
                  type: type as SuiMoveNormalizedType,
                  variableName: "variable",
                  value: value,
                })}
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
          {[...structs.values()].map((struct) => {
            return (
              <SelectItem
                key={struct.structName}
                value={JSON.stringify({
                  type: convertSuiMoveStructToSuiMoveNomalizedType(
                    struct
                  ) as SuiMoveNormalizedType,
                  variableName: struct.structName,
                  value: `${struct.structName}${
                    struct.typeParameters.length > 0
                      ? `<${struct.typeParameterNames.join(", ")}>`
                      : ""
                  } {\n${struct.fields
                    .map((f, i) => `    ${f.name}: field${i}`)
                    .join("\n")}\n   }`,
                })}
                className="cursor-pointer hover:bg-gray-200"
              >
                {struct.structName}
              </SelectItem>
            );
          })}
        </div>

        <Label className="px-2 text-xs text-muted-foreground">
          Imported Module Structs
        </Label>

        {Object.entries(imports)
          .flatMap(([packageAddress, modulesMap]) =>
            Array.from(modulesMap.entries()).map(
              ([moduleName, data]) =>
                [packageAddress, moduleName, data] as const
            )
          )
          .map(([packageAddress, moduleName, data]) => {
            const alias = SUI_PACKAGE_ALIASES[packageAddress] || packageAddress;

            if (Object.keys(data.structs).length === 0) return;

            return (
              <div key={moduleName}>
                <div>
                  {alias}::{moduleName}
                </div>
                <div className="grid grid-cols-2">
                  {Object.entries(data.structs).map(([structName, struct]) => {
                    return (
                      <SelectItem
                        key={structName}
                        value={JSON.stringify({
                          type: convertSuiMoveStructToSuiMoveNomalizedType({
                            ...struct,
                            address: packageAddress,
                            moduleName,
                            structName,
                            typeParameterNames: [],
                          } as SuiMoveStruct) as SuiMoveNormalizedType,
                          variableName: structName,
                          value: `${structName}${
                            struct.typeParameters.length > 0
                              ? `<${struct.typeParameters
                                  .map((_, i) => `T${i}`)
                                  .join(", ")}>`
                              : ""
                          } {\n${struct.fields
                            .map((f, i) => `    ${f.name}: field${i}`)
                            .join("\n")}\n   }`,
                        })}
                        className="cursor-pointer hover:bg-gray-200 break-words whitespace-normal"
                      >
                        {structName}
                      </SelectItem>
                    );
                  })}
                </div>
              </div>
            );
          })}

        <Separator className="my-2" />

        <Label className="px-2 text-xs text-muted-foreground">
          Current Module Functions
        </Label>
        <div className="grid grid-cols-2">
          {[...functions.values()].map((f) => (
            <SelectItem
              key={f.functionName}
              value={JSON.stringify(f)}
              className="cursor-pointer hover:bg-gray-200"
            >
              {f.functionName}
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
            const alias = SUI_PACKAGE_ALIASES[packageAddress] || packageAddress;
            if (!data.functions) return;

            if (Object.keys(data.functions).length === 0) return;

            return (
              <div key={moduleName}>
                <div>
                  {alias}::{moduleName}
                </div>
                <div className="grid grid-cols-2">
                  {Object.entries(data.functions).map(
                    ([functionName, functionData]) => {
                      return (
                        <SelectItem
                          key={functionName}
                          value=""
                          // value={JSON.stringify({
                          //   ...functionData,
                          //   address: packageAddress,
                          //   moduleName,
                          //   functionName,
                          //   parameterNames: functionData.parameters.map(
                          //     (_, i) => `arg${i}`
                          //   ),
                          //   returnNames: functionData.parameters.map(
                          //     (_, i) => `var${i}`
                          //   ),
                          //   typeParameterNames: functionData.parameters.map(
                          //     (_, i) => `T${i}`
                          //   ),
                          //   typeArguments: functionData.typeParameters.map(
                          //     (_) => "U64"
                          //   ),
                          //   insideCode: [],
                          // } as FunctionInsideCodeLine)}
                          className="cursor-pointer hover:bg-gray-200 break-words whitespace-normal truncate"
                        >
                          {functionName}
                        </SelectItem>
                      );
                    }
                  )}
                </div>
              </div>
            );
          })}
      </SelectContent>
    </Select>
  );
}
