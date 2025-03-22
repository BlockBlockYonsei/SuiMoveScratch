import { SuiMoveNormalizedType } from "@mysten/sui/client";

export function splitFormattedSuiType(type: SuiMoveNormalizedType): {
  prefix: string;
  core: string;
} {
  if (typeof type === "string") {
    return { prefix: "", core: type };
  }

  if ("Reference" in type) {
    const inner = splitFormattedSuiType(type.Reference);
    return { prefix: "&", core: inner.core };
  }

  if ("MutableReference" in type) {
    const inner = splitFormattedSuiType(type.MutableReference);
    return { prefix: "&mut", core: inner.core };
  }

  if ("Vector" in type) {
    const inner = splitFormattedSuiType(type.Vector);
    return { prefix: "", core: `vector<${inner.core}>` };
  }

  if ("TypeParameter" in type) {
    return { prefix: "", core: `T${type.TypeParameter}` };
  }

  if ("Struct" in type) {
    const { address, module, name, typeArguments } = type.Struct;
    const typeArgs =
      typeArguments.length > 0
        ? `<${typeArguments
            .map((t) => splitFormattedSuiType(t).core)
            .join(", ")}>`
        : "";
    return { prefix: "", core: `${address}::${module}::${name}${typeArgs}` };
  }

  return { prefix: "", core: JSON.stringify(type) };
}
