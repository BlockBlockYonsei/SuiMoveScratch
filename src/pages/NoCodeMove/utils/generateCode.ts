import { SuiMoveNormalizedStruct } from "@mysten/sui/client";

const PACKAGE_ALIASES: Record<string, string> = {
  "0x0000000000000000000000000000000000000000000000000000000000000001": "std",
  "0x0000000000000000000000000000000000000000000000000000000000000002": "sui",
};

export function generateImportsCode(
  imports: Record<string, Record<string, any>>
): string {
  return Object.entries(imports)
    .map(([fullModuleName, structs]) => {
      const [pkg, module] = fullModuleName.split("::");
      const alias = PACKAGE_ALIASES[pkg] || pkg;
      const names = Object.keys(structs).join(", ");
      return `use ${alias}::${module}::{ ${names} };`;
    })
    .join("\n");
}

export const renderStructs = (
  structs: Record<string, SuiMoveNormalizedStruct>
) => {
  return Object.entries(structs)
    .map(([name, struct]) => {
      const abilities = struct.abilities.abilities.join(", ");
      const fields =
        struct.fields?.length > 0
          ? struct.fields
              .map((f) => `  ${f.name}: ${formatType(f.type)};`)
              .join("\n")
          : "";
      return `public struct ${name}${
        abilities ? ` has ${abilities}` : ""
      } {\n${fields}\n}`;
    })
    .join("\n\n");
};

export const renderFunctions = (
  functions: Record<
    string,
    {
      function: {
        visibility: string;
        isEntry: boolean;
        typeParameters: { abilities: string[] }[];
        parameters: any[];
        return: any[];
      };
    }
  >
) => {
  return Object.entries(functions)
    .map(([name, fn]) => {
      const f = fn.function;
      const vis = f.visibility.toLowerCase();
      const entry = f.isEntry ? "entry " : "";
      const typeParams = f.typeParameters.length
        ? `<${f.typeParameters.map((_, i) => `T${i}`).join(", ")}>`
        : "";
      const params = f.parameters
        .map((_, i) => `arg${i}: ${formatType(_)}`)
        .join(", ");
      const returns =
        f.return.length > 0
          ? `: ${f.return.map((r) => formatType(r)).join(", ")}`
          : "";
      return `${vis} ${entry}fun ${name}${typeParams}(${params})${returns} {\n  // ...\n}`;
    })
    .join("\n\n");
};

const formatType = (type: any) => {
  if (typeof type === "string") return type;
  if ("Struct" in type) {
    const s = type.Struct;
    return `${s.address}::${s.module}::${s.name}`;
  }
  return "Unknown";
};
