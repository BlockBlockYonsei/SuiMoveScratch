import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SuiMoveAbilitySet, SuiMoveNormalizedType } from "@mysten/sui/client";
import { useContext } from "react";
import { SuiMoveModuleContext } from "@/context/SuiMoveModuleContext";
import { SUI_PACKAGE_ALIASES } from "@/Constants";

export default function FunctionTypeSelect({
  defaultValue,
  onChange,
}: {
  typeParameters: SuiMoveAbilitySet[];
  defaultValue?: SuiMoveNormalizedType | { abilities: string[] };
  onChange?: (type: SuiMoveNormalizedType) => void;
}) {
  const { imports, structs } = useContext(SuiMoveModuleContext);

  const PRIMITIVE_TYPES: SuiMoveNormalizedType[] = [
    "Bool",
    "U8",
    "U16",
    "U32",
    "U64",
    "U128",
    "U256",
    "Address",
    "Signer",
  ];

  const getDefaultValue = () => {
    if (!defaultValue) return undefined;
    if (typeof defaultValue === "string") {
      return `primitive::${defaultValue}`;
    }
    if ("abilities" in defaultValue) {
      return `typeParam::${defaultValue.abilities.join(" + ")}`;
    }
    if ("Struct" in defaultValue) {
      const { address, module, name } = defaultValue.Struct;
      if (address === "0x0" && module === "currentModule") {
        return `local::${name}`;
      }
      return `external::${address}::${module}::${name}`;
    }
    return undefined;
  };

  const handleSelect = (value: string) => {
    if (!onChange) return;

    const [kind, ...rest] = value.split("::");
    const name = rest[rest.length - 1];

    if (kind === "primitive") {
      onChange(name as SuiMoveNormalizedType);
    } else if (kind === "local") {
      onChange({
        Struct: {
          address: "0x0",
          module: "currentModule",
          name,
          typeArguments: [],
        },
      });
    } else if (kind === "external") {
      const [pkg, module, name] = rest;
      onChange({
        Struct: {
          address: pkg,
          module: module,
          name,
          typeArguments: [],
        },
      });
    }
  };

  return (
    <Select onValueChange={handleSelect} defaultValue={getDefaultValue()}>
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
                value={`primitive::${type}`}
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
        {/* {typeParameters.map((_, i) => (
          <SelectItem key={`T${i}`} value={`typeParam::${i}`}>
            T{i}
          </SelectItem>
        ))} */}

        <Separator className="my-2" />

        <Label className="px-2 text-xs text-muted-foreground">
          Current Structs
        </Label>
        <div className="grid grid-cols-4">
          {[...structs.keys()].map((name) => (
            <SelectItem
              key={name}
              value={`local::${name}`}
              className="cursor-pointer hover:bg-gray-200"
            >
              {name}
            </SelectItem>
          ))}
        </div>
        <Separator className="my-2" />

        <Label className="px-2 text-xs text-muted-foreground">
          Imported Structs
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
                      value={`external::${pkgAddress}::${moduleName}::${structName}`}
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
