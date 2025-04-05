import { SuiMoveNormalizedType } from "@mysten/sui/client";

export function parseSuiMoveNormalizedType(type: SuiMoveNormalizedType): {
  prefix: string;
  core: SuiMoveNormalizedType;
  result:
    | {
        address: string;
        module: string;
        name: string;
        typeArgs: string;
      }
    | string;
} {
  if (typeof type === "string") {
    return { prefix: "primitive", core: type, result: type };
  }

  if ("TypeParameter" in type) {
    return {
      prefix: "typeParameter",
      core: type,
      result: `TypeParam${type.TypeParameter}`,
    };
  }

  if ("Vector" in type) {
    const inner = parseSuiMoveNormalizedType(type.Vector);
    return {
      prefix: "vector",
      core: inner.core,
      result: inner.result,
    };
  }

  if ("Reference" in type) {
    const inner = parseSuiMoveNormalizedType(type.Reference);
    return {
      prefix: "&",
      core: inner.core,
      result: inner.result,
    };
  }

  if ("MutableReference" in type) {
    const inner = parseSuiMoveNormalizedType(type.MutableReference);
    return {
      prefix: "&mut",
      core: inner.core,
      result: inner.result,
    };
  }

  if ("Struct" in type) {
    const { address, module, name, typeArguments } = type.Struct;

    const typeArgs =
      typeArguments.length > 0
        ? `<${typeArguments
            .map((t) => {
              const inner = parseSuiMoveNormalizedType(t);
              return typeof inner.result === "string"
                ? inner.result
                : `${shortAddress(inner.result.address)}::${
                    inner.result.module
                  }::${inner.result.name}${inner.result.typeArgs}`;
            })
            .join(", ")}>`
        : "";

    return {
      prefix: "value",
      core: type,
      result: {
        address: `${shortAddress(address)}`,
        module,
        name,
        typeArgs,
      },
    };
  }

  return {
    prefix: "",
    core: type,
    result: JSON.stringify(type),
  };
}

export const shortAddress = (addr: string) => {
  if (addr.startsWith("0x") && addr.length > 12) {
    return `${addr.slice(0, 7)}...${addr.slice(-5)}`;
  }
  return addr;
};

export const formatType = (type: any): string => {
  if (typeof type === "string") return type;
  if (type.Struct) {
    const {
      address,
      module,
      name,
    }: { address: string; module: string; name: string } = type.Struct;
    return `${shortAddress(address)}::${module}::${name}`;
  }
  if (type.Vector) {
    return formatType(type.Vector);
  }
  return JSON.stringify(type);
};
