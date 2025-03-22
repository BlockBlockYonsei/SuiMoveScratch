import { SuiMoveNormalizedType } from "@mysten/sui/client";

export function parseSuiMoveNormalizedType(type: SuiMoveNormalizedType): {
  prefix: string;
  core: string;
} {
  if (typeof type === "string") {
    return { prefix: "", core: type };
  }

  if ("Reference" in type) {
    const inner = parseSuiMoveNormalizedType(type.Reference);
    return { prefix: "&", core: inner.core };
  }

  if ("MutableReference" in type) {
    const inner = parseSuiMoveNormalizedType(type.MutableReference);
    return { prefix: "&mut", core: inner.core };
  }

  if ("Vector" in type) {
    const inner = parseSuiMoveNormalizedType(type.Vector);
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
            .map((t) => parseSuiMoveNormalizedType(t).core)
            .join(", ")}>`
        : "";
    return {
      prefix: "",
      core: `${shortAddress(address)}::${module}::${name}${typeArgs}`,
    };
  }

  return { prefix: "", core: JSON.stringify(type) };
}

const shortAddress = (addr: string) => {
  if (addr.startsWith("0x") && addr.length > 12) {
    return `${addr.slice(0, 7)}...${addr.slice(-5)}`;
  }
  return addr;
};
