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
  SuiMoveNormalizedType,
  SuiMoveStructTypeParameter,
} from "@mysten/sui/client";
import { useContext } from "react";
import { SuiMoveModuleContext } from "@/context/SuiMoveModuleContext";
import { SUI_PACKAGE_ALIASES } from "@/Constants";
import { PRIMITIVE_TYPES } from "@/Constants";

export default function StructTypeSelector({
  structName,
  fieldType,
  onChange,
  typeParameters,
}: {
  structName: string;
  typeParameters: { name: string; type: SuiMoveStructTypeParameter }[];
  fieldType?: SuiMoveNormalizedType;
  onChange?: (type: SuiMoveNormalizedType) => void;
}) {
  const { imports, structs, selectedStruct } = useContext(SuiMoveModuleContext);

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

  const convertSelectValueToType = (value: string): SuiMoveNormalizedType => {
    const [typeBoundary, rest] = value.split(":::");
    const [name, module, address, accessSymantic] = rest.split("::");

    if (typeBoundary === "primitive") {
      return name as SuiMoveNormalizedType;
    } else if (typeBoundary === "typeParameter") {
      return {
        TypeParameter: typeParameters.findIndex((tp) => tp.name === name),
      };
    } else if (typeBoundary === "moduleStruct") {
      if (!accessSymantic) {
        return {
          Struct: { address, module, name, typeArguments: [] },
        };
      } else if (accessSymantic === "reference") {
        return {
          Reference: {
            Struct: { address, module, name, typeArguments: [] },
          },
        };
      } else if (accessSymantic === "mutReference") {
        return {
          MutableReference: {
            Struct: { address, module, name, typeArguments: [] },
          },
        };
      } else if (accessSymantic === "vector") {
        return {
          Vector: {
            Struct: { address, module, name, typeArguments: [] },
          },
        };
      }
    }
    return {
      Struct: { address: "", module: "", name: "unknown", typeArguments: [] },
    };
  };

  return (
    <Select
      onValueChange={(value: string) => {
        if (!onChange) return;

        const convertedType = convertSelectValueToType(value);
        onChange(convertedType);
      }}
      defaultValue={
        fieldType ? convertTypeToSelectValue(fieldType) : "primitive:::U64"
      }
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
          Type Parameters
        </Label>
        <div className="grid grid-cols-2">
          {typeParameters.map((tp) => (
            <SelectItem
              key={tp.name}
              value={`typeParameter:::${tp.name}`}
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
          {[...structs.keys()]
            .filter((name) => name !== structName)
            .map((name) => (
              <SelectItem
                key={name}
                value={`moduleStruct:::${name}::currentModule::0x0`}
                className="cursor-pointer hover:bg-gray-200"
              >
                {name}
              </SelectItem>
            ))}
        </div>

        <Separator className="my-2" />

        <Label className="px-2 text-xs text-muted-foreground">
          Imported Module Structs
        </Label>

        {[...imports.entries()].map(([key, module]) => {
          const [pkgAddress, moduleName] = key.split("::");
          const alias = SUI_PACKAGE_ALIASES[pkgAddress] || pkgAddress;

          if (Object.keys(module.structs).length === 0) return;

          return (
            <div key={moduleName}>
              <div>
                {alias}::{moduleName}
              </div>
              <div className="grid grid-cols-2">
                {Object.keys(module.structs).map((structName) => {
                  return (
                    <SelectItem
                      key={structName}
                      value={`moduleStruct:::${structName}::${moduleName}::${pkgAddress}`}
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
