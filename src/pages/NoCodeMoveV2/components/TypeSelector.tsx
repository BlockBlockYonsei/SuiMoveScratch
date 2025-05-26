import { useContext } from "react";
import {
  SuiMoveAbilitySet,
  SuiMoveNormalizedType,
  SuiMoveStructTypeParameter,
} from "@mysten/sui/client";

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
import { convertSuiMoveStructToSuiMoveNomalizedType } from "@/lib/convertType";
import { SuiMoveStruct } from "@/types/move-type";

export default function TypeSelector({
  nameKey,
  defaultType,
  typeParameters,
  onChange,
}: {
  nameKey: string;
  defaultType?: SuiMoveNormalizedType;
  typeParameters:
    | { name: string; type: SuiMoveStructTypeParameter }[]
    | { name: string; type: SuiMoveAbilitySet }[];
  onChange?: (type: SuiMoveNormalizedType) => void;
}) {
  const { imports, structs } = useContext(SuiMoveModuleContext);

  return (
    <Select
      onValueChange={(value: string) => {
        if (!onChange) return;

        const convertedType = JSON.parse(value);
        onChange(convertedType);
      }}
      defaultValue={defaultType ? JSON.stringify(defaultType) : "U64"}
    >
      <SelectTrigger className="cursor-pointer">
        <SelectValue placeholder="Select type..." />
      </SelectTrigger>
      <SelectContent className="max-h-80 max-w-98 overflow-y-auto grid grid-cols-4">
        <Label className="px-2 text-xs text-muted-foreground">
          Primitive Types
        </Label>
        <div className="grid grid-cols-4">
          {PRIMITIVE_TYPES.map((type) => {
            if (typeof type !== "string") return null;
            return (
              <SelectItem
                key={type}
                value={JSON.stringify(type as SuiMoveNormalizedType)}
                className="col-span-1 cursor-pointer hover:bg-gray-200"
              >
                {type}
              </SelectItem>
            );
          })}
        </div>

        <Separator className="my-2" />

        <Label className="px-2 text-xs text-muted-foreground">
          Type Parameters
        </Label>
        <div className="grid grid-cols-2">
          {typeParameters.map((tp, index) => (
            <SelectItem
              key={tp.name}
              value={JSON.stringify({
                TypeParameter: index,
              } as SuiMoveNormalizedType)}
              className="cursor-pointer hover:bg-gray-200"
            >
              {tp.name}
            </SelectItem>
          ))}
        </div>

        <Separator className="my-2" />

        <Label className="px-2 text-xs text-muted-foreground">
          Current Module Structs
        </Label>
        <div className="grid grid-cols-2">
          {[...structs.values()]
            .filter((struct) => struct.structName !== nameKey)
            .map((struct) => (
              <SelectItem
                key={struct.structName}
                value={JSON.stringify(
                  convertSuiMoveStructToSuiMoveNomalizedType(
                    struct
                  ) as SuiMoveNormalizedType
                )}
                className="cursor-pointer hover:bg-gray-200"
              >
                {struct.structName}
              </SelectItem>
            ))}
        </div>

        <Separator className="my-2" />

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
                        value={JSON.stringify(
                          convertSuiMoveStructToSuiMoveNomalizedType({
                            ...struct,
                            address: packageAddress,
                            moduleName,
                            structName,
                            typeParameterNames: [],
                          } as SuiMoveStruct) as SuiMoveNormalizedType
                        )}
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
      </SelectContent>
    </Select>
  );
}
