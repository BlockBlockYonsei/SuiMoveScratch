import { Label } from "@/components/ui/label";
import { SuiMoveNormalizedType } from "@mysten/sui/client";
import {
  convertSuiMoveStructToSuiMoveNomalizedType,
  parseStructNameFromSuiMoveNomalizedType,
} from "@/lib/convertType";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SUI_PACKAGE_ALIASES } from "@/Constants";
import { Button } from "@/components/ui/button";
import { SuiMoveModuleContext } from "@/context/SuiMoveModuleContext";
import { useContext, useState } from "react";
import { FunctionInsideCodeLine } from "@/types/move-type";

export default function ExecuteFunctionDialog({
  addFunction,
}: {
  addFunction: (line: FunctionInsideCodeLine) => void;
}) {
  const [filterString, setFilterString] = useState<"Return" | "Parameter">(
    "Return"
  );
  const [selectedType, setSelectedType] = useState<SuiMoveNormalizedType>();

  const { imports, functions } = useContext(SuiMoveModuleContext);

  return (
    <DialogContent className="sm:max-w-[600px] lg:max-w-[1000px] max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Execute Function</DialogTitle>
        <DialogDescription>Add Function Line</DialogDescription>
      </DialogHeader>

      <Label className="px-2 text-xs text-muted-foreground">
        Current Module Functions
      </Label>
      <div className="flex flex-wrap gap-4">
        {[...functions.values()]
          .filter((functionData) => functionData.return.length === 0)
          .map((func) => (
            <DialogClose key={func.functionName} asChild>
              <Button
                key={func.functionName}
                // value={JSON.stringify(f)}
                className="cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  const line = {
                    ...func,
                    typeArguments: func.typeParameters.map(
                      (_) => "U64" as SuiMoveNormalizedType
                    ),
                    argumentNames: func.parameterNames.map((pn) => pn),
                    variableNames: func.returnNames.map((rn) => rn),
                  };
                  addFunction(line);
                }}
              >
                {func.functionName}
              </Button>
            </DialogClose>
          ))}
      </div>

      <Label className="px-2 text-xs text-muted-foreground">
        Imported Module Functions
      </Label>
      <div className="border-2 rounded-md space-y-2">
        <Label className="px-2 text-xs text-muted-foreground">
          Filter by Imported Module Structs ({filterString})
        </Label>

        <div className="space-x-2">
          <Button
            className="cursor-pointer hover:bg-gray-200 break-words whitespace-normal"
            onClick={() => {
              setSelectedType(undefined);
            }}
          >
            Reset Button
          </Button>
          <Button
            className="cursor-pointer hover:bg-gray-200 break-words whitespace-normal"
            onClick={() => {
              setFilterString((prev) =>
                prev === "Return" ? "Parameter" : "Return"
              );
            }}
          >
            switch to {filterString === "Return" ? "Parameter" : "Return"}
          </Button>
        </div>
        <div className="flex flex-wrap gap-4">
          {Object.entries(imports)
            .flatMap(([packageAddress, modulesMap]) =>
              Array.from(modulesMap.entries()).map(
                ([moduleName, data]) =>
                  [packageAddress, moduleName, data] as const
              )
            )
            .map(([packageAddress, moduleName, data]) => {
              // const alias =
              //   SUI_PACKAGE_ALIASES[packageAddress] || packageAddress;

              if (Object.keys(data.structs).length === 0) return;

              return (
                <div key={moduleName}>
                  {/* <div>
                  {alias}::{moduleName}
                </div> */}
                  <div className="flex flex-wrap gap-4">
                    {Object.entries(data.structs).map(
                      ([structName, struct]) => {
                        return (
                          <Button
                            key={structName}
                            className="cursor-pointer hover:bg-gray-200 break-words whitespace-normal"
                            variant={
                              selectedType
                                ? structName ===
                                  parseStructNameFromSuiMoveNomalizedType(
                                    selectedType
                                  )
                                  ? "default"
                                  : "outline"
                                : "outline"
                            }
                            onClick={() => {
                              setSelectedType(
                                convertSuiMoveStructToSuiMoveNomalizedType({
                                  ...struct,
                                  address: packageAddress,
                                  moduleName,
                                  structName,
                                  typeParameterNames: struct.typeParameters.map(
                                    (_, i) => `type_param${i}`
                                  ),
                                })
                              );
                            }}
                          >
                            {structName}
                          </Button>
                        );
                      }
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {Object.entries(imports)
        .flatMap(([packageAddress, modulesMap]) =>
          Array.from(modulesMap.entries()).map(
            ([moduleName, data]) => [packageAddress, moduleName, data] as const
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
              <div className="flex flex-wrap gap-4">
                {Object.entries(data.functions)
                  .filter(
                    ([_, functionData]) => functionData.return.length === 0
                  )
                  .filter(([_, functionData]) =>
                    selectedType
                      ? filterString === "Return"
                        ? functionData.return.findIndex((r) =>
                            typeof r !== "object"
                              ? false
                              : "Vector" in r
                              ? JSON.stringify(r.Vector) ===
                                JSON.stringify(selectedType)
                              : "Reference" in r
                              ? JSON.stringify(r.Reference) ===
                                JSON.stringify(selectedType)
                              : "MutableReference" in r
                              ? JSON.stringify(r.MutableReference) ===
                                JSON.stringify(selectedType)
                              : JSON.stringify(r) ===
                                JSON.stringify(selectedType)
                          ) > -1
                        : functionData.parameters.findIndex((p) =>
                            typeof p !== "object"
                              ? false
                              : "Vector" in p
                              ? JSON.stringify(p.Vector) ===
                                JSON.stringify(selectedType)
                              : "Reference" in p
                              ? JSON.stringify(p.Reference) ===
                                JSON.stringify(selectedType)
                              : "MutableReference" in p
                              ? JSON.stringify(p.MutableReference) ===
                                JSON.stringify(selectedType)
                              : JSON.stringify(p) ===
                                JSON.stringify(selectedType)
                          ) > -1
                      : true
                  )
                  .map(([functionName, functionData]) => {
                    return (
                      <DialogClose key={functionName} asChild>
                        <Button
                          key={functionName}
                          className="cursor-pointer hover:bg-gray-200 break-words whitespace-normal truncate"
                          onClick={() => {
                            const line = {
                              ...functionData,
                              address: packageAddress,
                              moduleName,
                              functionName,
                              parameterNames: functionData.parameters.map(
                                (_, i) => `param${i}`
                              ),
                              typeParameterNames:
                                functionData.typeParameters.map(
                                  (_, i) => `T${i}`
                                ),
                              returnNames: functionData.return.map(
                                (_, i) => `return${i}`
                              ),
                              insideCodes: [],
                              typeArguments: functionData.typeParameters.map(
                                (_) => "U64" as SuiMoveNormalizedType
                              ),
                              argumentNames: functionData.parameters.map(
                                (_, i) => `args${i}`
                              ),
                              variableNames: functionData.return.map(
                                (_, i) => `return${i}`
                              ),
                            };
                            addFunction(line);
                          }}
                        >
                          {functionName}
                        </Button>
                      </DialogClose>
                    );
                  })}
              </div>
            </div>
          );
        })}
    </DialogContent>
  );
}
