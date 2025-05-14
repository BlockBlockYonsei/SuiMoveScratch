import { SuiMoveFunction } from "@/types/move";

const PACKAGE_ALIASES: Record<string, string> = {
  "0x0000000000000000000000000000000000000000000000000000000000000001": "std",
  "0x0000000000000000000000000000000000000000000000000000000000000002": "sui",
};

export function formatType(type: any): string {
  if (typeof type === "string") return type;
  if ("Struct" in type) {
    const { address, module, name, typeArguments } = type.Struct;
    const args = typeArguments?.length
      ? `<${typeArguments.map(formatType).join(", ")}>`
      : "";
    return `${PACKAGE_ALIASES[address] || address}::${module}::${name}${args}`;
  }
  return "Unknown";
}

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

export function generateStructCode(
  name: string,
  struct: any,
  typeParameterNames?: string[]
): string {
  const abilities = (struct.abilities?.abilities || [])
    .map((a: string) => a.toLowerCase())
    .join(", ");

  const typeParams = (struct.typeParameters || [])
    .map((tp: any, i: number) => {
      const phantom = tp.isPhantom ? "phantom " : "";
      const paramName =
        typeParameterNames?.[i] ??
        (struct.typeParameters.length === 1 ? "T" : `T${i}`);
      const abilities = tp.constraints?.abilities
        ?.map((a: string) => a.toLowerCase())
        .join(" + ");
      return `${phantom}${paramName}${abilities ? `: ${abilities}` : ""}`;
    })
    .join(", ");

  const generics = typeParams ? `<${typeParams}>` : "";

  const fields = (struct.fields || [])
    .map((f: any) => `  ${f.name}: ${formatType(f.type)},`)
    .join("\n");

  return `public struct ${name}${generics} has ${abilities} {\n${fields}\n}`;
}

export function generateFunctionCode(
  name: string,
  func: SuiMoveFunction
): string {
  const visibility = func.function.visibility.toLowerCase();
  const isEntry = func.function.isEntry;
  const entryKeyword = isEntry ? "entry " : "";
  const visKeyword = visibility !== "private" ? `${visibility} ` : "";
  const typeParams = func.function.typeParameters
    .map((tp: any, i: number) => {
      const name = func.function.typeParameters.length === 1 ? "T" : `T${i}`;
      const abilities = tp.abilities
        ?.map((a: string) => a.toLowerCase())
        .join(" + ");
      return `${name}${abilities ? `: ${abilities}` : ""}`;
    })
    .join(", ");
  const generics = typeParams ? `<${typeParams}>` : "";
  const parameters = func.function.parameters
    .map((p: any, i: number) => `arg${i}: ${formatType(p)}`)
    .join(", ");
  const returnType =
    func.function.return.length === 0
      ? ""
      : `: ${
          func.function.return.length === 1
            ? formatType(func.function.return[0])
            : `(${func.function.return.map(formatType).join(", ")})`
        }`;

  const insideCodeString = func.insideCode
    .map((code) => {
      if (code.return.length > 0) {
        return `  let ${
          code.return.length === 1
            ? `${code.parameters.map((p) => p).join(", ")}`
            : `(${code.parameters.map((p) => p).join(", ")}`
        }${code.return.length === 1 ? "" : ")"} = ${
          code.functionName
        }(${code.parameters.map((p) => p).join(", ")})`;
      } else {
        return `  ${code.functionName}(${code.parameters
          .map((p) => p)
          .join(", ")})`;
      }
    })
    .join("\n");

  return `${entryKeyword}${visKeyword}fun ${name}${generics}(${parameters})${returnType} {\n${insideCodeString}\n}`;
}

export function generateMoveCode({
  imports,
  structs,
  functions,
  moduleName,
  address,
}: {
  imports: Record<string, Record<string, any>>;
  structs: Record<string, any>;
  functions: Record<string, any>;
  moduleName?: string;
  address?: string;
}): string {
  const moduleHeader = `module ${address}::${moduleName};\n`;
  const importSection = generateImportsCode(imports);
  const structSection = Object.entries(structs)
    .map(([name, struct]) => generateStructCode(name, struct))
    .join("\n\n");
  const functionSection = Object.entries(functions)
    .map(([name, func]) => generateFunctionCode(name, func))
    .join("\n\n");

  return [
    moduleHeader,
    importSection,
    "",
    "// ====== Structs ======",
    structSection,
    "",
    "// ====== Functions ======",
    functionSection,
  ].join("\n");
}

export function downloadMoveCode(
  imports: Record<string, any>,
  structs: Record<string, any>,
  functions: Record<string, any>
) {
  const code = generateMoveCode({ imports, structs, functions });
  const blob = new Blob([code], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "code.move";
  a.click();
  URL.revokeObjectURL(url);
}
