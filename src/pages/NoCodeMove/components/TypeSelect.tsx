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
  SuiMoveNormalizedStruct,
  SuiMoveNormalizedType,
  SuiMoveStructTypeParameter,
} from "@mysten/sui/client";

export default function TypeSelect({
  imports,
  structs,
  typeParameters,
  setType,
  defaultValue,
}: {
  imports: Record<string, Record<string, SuiMoveNormalizedStruct>>;
  structs: Record<string, SuiMoveNormalizedStruct>;
  typeParameters: SuiMoveStructTypeParameter[];
  setType: (type: SuiMoveNormalizedType) => void;
  defaultValue?: SuiMoveNormalizedType | { abilities: string[] };
}) {
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

  const groupedByPackage = Object.entries(imports).reduce(
    (acc, [fullModuleName, importedStruct]) => {
      const [packageAddress, moduleName] = fullModuleName.split("::");
      if (!acc[packageAddress]) acc[packageAddress] = {};
      acc[packageAddress][moduleName] = importedStruct;
      return acc;
    },
    {} as Record<
      string,
      Record<string, Record<string, SuiMoveNormalizedStruct>>
    >,
  );

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
    const [kind, ...rest] = value.split("::");

    if (kind === "primitive") {
      setType(rest[0] as SuiMoveNormalizedType);
    } else if (kind === "typeParam") {
      const abilities = rest[0].split(" + ");
      setType({
        Struct: {
          address: "0x0",
          module: "currentModule",
          name: "T",
          typeArguments: [],
        },
      });
    } else if (kind === "local") {
      const [name] = rest;
      setType({
        Struct: {
          address: "0x0",
          module: "currentModule",
          name,
          typeArguments: [],
        },
      });
    } else if (kind === "external") {
      const [packageAddress, module, name] = rest;
      setType({
        Struct: {
          address: packageAddress,
          module,
          name,
          typeArguments: [],
        },
      });
    }
  };

  return (
    <Select onValueChange={handleSelect} defaultValue={getDefaultValue()}>
      <SelectTrigger>
        <SelectValue placeholder="Select type..." />
      </SelectTrigger>
      <SelectContent className="max-h-80 overflow-y-auto">
        <Label className="px-2 text-xs text-muted-foreground">
          Type Parameters
        </Label>
        {typeParameters.map((_, i) => (
          <SelectItem key={`T${i}`} value={`typeParam::${i}`}>
            T{i}
          </SelectItem>
        ))}

        <Separator className="my-2" />
        <Label className="px-2 text-xs text-muted-foreground">
          Primitive Types
        </Label>
        {PRIMITIVE_TYPES.map((type) => {
          if (typeof type !== "string") return null;
          return (
            <SelectItem key={type} value={`primitive::${type}`}>
              {type}
            </SelectItem>
          );
        })}

        <Separator className="my-2" />
        <Label className="px-2 text-xs text-muted-foreground">
          Current Structs
        </Label>
        {Object.keys(structs).map((name) => (
          <SelectItem key={name} value={`local::${name}`}>
            {name}
          </SelectItem>
        ))}

        {Object.entries(groupedByPackage).map(([packageAddress, modules]) => (
          <div key={packageAddress}>
            <Separator className="my-2" />
            <Label className="px-2 text-xs text-muted-foreground">
              {packageAddress.slice(0, 6)}... External
            </Label>
            {Object.entries(modules).flatMap(([moduleName, structs]) =>
              Object.keys(structs).map((typeName) => (
                <SelectItem
                  key={`${packageAddress}::${moduleName}::${typeName}`}
                  value={`external::${packageAddress}::${moduleName}::${typeName}`}
                >
                  {moduleName}::{typeName}
                </SelectItem>
              )),
            )}
          </div>
        ))}
      </SelectContent>
    </Select>
  );
}
