import { SuiMoveStruct } from "@/types/move-type";
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

export function parseStructNameFromSuiMoveNomalizedType(
  type: SuiMoveNormalizedType,
  typeParameterNames?: string[]
): string {
  if (typeof type === "string") {
    return `${type}`;
  } else if ("Reference" in type) {
    return `&${parseStructNameFromSuiMoveNomalizedType(
      type.Reference,
      typeParameterNames
    )}`;
  } else if ("MutableReference" in type) {
    return `&mut ${parseStructNameFromSuiMoveNomalizedType(
      type.MutableReference,
      typeParameterNames
    )}`;
  } else if ("Vector" in type) {
    return `vector<${parseStructNameFromSuiMoveNomalizedType(
      type.Vector,
      typeParameterNames
    )}>`;
  } else if ("Struct" in type) {
    const { name } = type.Struct;
    return name;
  } else if ("TypeParameter" in type && typeParameterNames) {
    return typeParameterNames[type.TypeParameter];
  }
  return "";
}
