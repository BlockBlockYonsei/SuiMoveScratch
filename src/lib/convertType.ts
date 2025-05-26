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
  if (typeof type === "string") {
    return `${type}`;
  } else if ("Reference" in type) {
    return `&${convertSuiMoveNomalizedTypeToString(type.Reference)}`;
  } else if ("MutableReference" in type) {
    return `&mut ${convertSuiMoveNomalizedTypeToString(type.MutableReference)}`;
  } else if ("Vector" in type) {
    return `vector<${convertSuiMoveNomalizedTypeToString(type.Vector)}>`;
  } else if ("Struct" in type) {
    const { address, module, name, typeArguments } = type.Struct;
    const typeArgsString = typeArguments?.length
      ? `<${typeArguments
          .map((t) => convertSuiMoveNomalizedTypeToString(t))
          .join(", ")}>`
      : "";
    return `${address}::${module}::${name}${typeArgsString}`;
  } else if ("TypeParameter" in type) {
    return type.TypeParameter.toString();
  }
  return "";
}
