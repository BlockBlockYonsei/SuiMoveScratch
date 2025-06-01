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

// export function convertSuiMoveNomalizedTypeToSuiMoveStruct(
//   type: SuiMoveNormalizedType
// ): SuiMoveStruct {
//   return {
//     // Struct: {
//     //   address: struct.address,
//     //   module: struct.moduleName,
//     //   name: struct.structName,
//     //   typeArguments: [],
//     // },
//     address: type.
//   };
// }

export function parseStructNameFromSuiMoveNomalizedType(
  type: SuiMoveNormalizedType,
  typeParameterNames?: string[]
): string {
  if (typeof type === "string") {
    // return `${type.toLowerCase()}`;
    return type;
  } else if ("Reference" in type) {
    return parseStructNameFromSuiMoveNomalizedType(
      type.Reference,
      typeParameterNames
    );
  } else if ("MutableReference" in type) {
    return parseStructNameFromSuiMoveNomalizedType(
      type.MutableReference,
      typeParameterNames
    );
  } else if ("Vector" in type) {
    return parseStructNameFromSuiMoveNomalizedType(
      type.Vector,
      typeParameterNames
    );
  } else if ("Struct" in type) {
    const { name } = type.Struct;
    return name;
  } else if ("TypeParameter" in type && typeParameterNames) {
    return typeParameterNames[type.TypeParameter];
  }
  return "";
}

export function parseTypeStringFromSuiMoveNomalizedType(
  type: SuiMoveNormalizedType,
  typeParameterNames?: string[]
): string {
  if (typeof type === "string") {
    return `${type.toLowerCase()}`;
  } else if ("Reference" in type) {
    return `&${parseTypeStringFromSuiMoveNomalizedType(
      type.Reference,
      typeParameterNames
    )}`;
  } else if ("MutableReference" in type) {
    return `&mut ${parseTypeStringFromSuiMoveNomalizedType(
      type.MutableReference,
      typeParameterNames
    )}`;
  } else if ("Vector" in type) {
    return `vector<${parseTypeStringFromSuiMoveNomalizedType(
      type.Vector,
      typeParameterNames
    )}>`;
  } else if ("Struct" in type) {
    const { name, typeArguments } = type.Struct;
    return `${name}${
      typeArguments.length > 0
        ? `<${typeArguments
            .map((t) =>
              parseTypeStringFromSuiMoveNomalizedType(t, typeParameterNames)
            )
            .join(", ")}>`
        : ""
    }`;
  } else if ("TypeParameter" in type && typeParameterNames) {
    return typeParameterNames[type.TypeParameter];
  }
  return "";
}
