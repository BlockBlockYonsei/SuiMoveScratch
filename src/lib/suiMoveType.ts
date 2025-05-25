import { PRIMITIVE_TYPES } from "@/Constants";
import { SuiMoveStruct } from "@/types/move-syntax2";
import { SuiMoveNormalizedType } from "@mysten/sui/client";

export function convertSuiMoveStructToSuiMoveNomalizedType(
  struct: SuiMoveStruct
): SuiMoveNormalizedType {
  return {
    Struct: {
      address: struct.address,
      module: struct.moduleName,
      name: struct.structName,
      typeArguments: [],
    },
  };
}

export function convertSuiMoveNomalizedTypeToString(
  type: SuiMoveNormalizedType
): string {
  if (typeof type === "string") return type;
  if ("Struct" in type) {
    const { address, module, name, typeArguments } = type.Struct;
    const typeArgsString = typeArguments?.length
      ? `<${typeArguments
          .map((t) => `T${convertSuiMoveNomalizedTypeToString(t)}`)
          .join(", ")}>`
      : "";
    return `${address}::${module}::${name}${typeArgsString}`;
  } else if ("TypeParameter" in type) {
    return `TP${type.TypeParameter.toString()}`;
  } else if ("Reference" in type) {
    return `&${convertSuiMoveNomalizedTypeToString(type.Reference)}`;
  } else if ("MutableReference" in type) {
    return `&mut ${convertSuiMoveNomalizedTypeToString(type.MutableReference)}`;
  } else if ("Vector" in type) {
    return `vector<${convertSuiMoveNomalizedTypeToString(type.Vector)}>`;
  }

  return "";
}

export function convertSuiMoveNomalizedTypeStringToType(
  type: string
): SuiMoveNormalizedType {
  if (PRIMITIVE_TYPES.includes(type as SuiMoveNormalizedType)) {
    return type as SuiMoveNormalizedType;
  } else if (type.includes("TP")) {
    const [index] = type.split("TP");
    return { TypeParameter: Number(index) };
  } else if (type[0] === "&") {
    const [address, module, name] = type.split("&")[0].split("::");
    return {
      Reference: {
        Struct: {
          address,
          module,
          name,
          typeArguments: [],
        },
      },
    };
  } else if (type.includes("&mut")) {
    const [address, module, name] = type.split("&mut ")[0].split("::");
    return {
      MutableReference: {
        Struct: {
          address,
          module,
          name,
          typeArguments: [],
        },
      },
    };
  } else if (type.includes("vector")) {
    const match = type.match("/<([^<:]+::[^<:]+::[^<:>]+)</");

    const [address, module, name] = match
      ? match[0].split("::")
      : "add::mod::nam";
    return {
      MutableReference: {
        Struct: {
          address,
          module,
          name,
          typeArguments: [],
        },
      },
    };
  }

  return type as SuiMoveNormalizedType;
}
