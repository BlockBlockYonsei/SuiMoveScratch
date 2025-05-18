import { SUI_PACKAGE_ALIASES } from "@/Constants";
import {
  ImportDataMap,
  SuiMoveFunction,
  SuiMoveStruct,
  StructDataMap,
  FunctionDataMap,
} from "@/types/move-syntax";

export function formatType(type: any): string {
  console.log(type);
  if (typeof type === "string") return type;
  if ("Struct" in type) {
    const { address, module, name, typeArguments } = type.Struct;
    const args = typeArguments?.length
      ? `<${typeArguments.map(formatType).join(", ")}>`
      : "";
    return `${
      SUI_PACKAGE_ALIASES[address] || address
    }::${module}::${name}${args}`;
  }
  return "Unknown";
}

export function generateImportsCode(imports: ImportDataMap): string {
  return Array.from(imports.entries())
    .map(([_, data]) => {
      const pkgAlias = SUI_PACKAGE_ALIASES[data.address] || data.address;
      const importedStructNames = Object.keys(data.structs);
      const importedNames = data.functions
        ? ["Self", ...importedStructNames].join(", ")
        : importedStructNames.join(", ");

      return `use ${pkgAlias}::${data.moduleName}::{ ${importedNames} };`;
    })
    .join("\n");
}

export function generateStructCode(
  name: string,
  struct: SuiMoveStruct,
): string {
  const abilities =
    struct.abilities.abilities.length > 0
      ? ` has ${struct.abilities.abilities
          .map((ability: string) => ability.toLowerCase())
          .join(", ")}`
      : "";

  const typeParams = (struct.typeParameters || [])
    .map((tp: any, i: number) => {
      const phantom = tp.isPhantom ? "phantom " : "";
      const paramName = struct.typeParameterNames?.[i] ?? `T${i}`;
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

  return `public struct ${name}${generics}${abilities} {\n${fields}\n}`;
}

export function generateFunctionCode(
  name: string,
  func: SuiMoveFunction,
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
  imports: ImportDataMap;
  structs: StructDataMap;
  functions: FunctionDataMap;
  moduleName?: string;
  address?: string;
}): string {
  const moduleHeader = `module ${address}::${moduleName};\n`;
  const importSection = generateImportsCode(imports);
  const structSection = Array.from(structs.entries())
    .map(([name, struct]) => generateStructCode(name, struct))
    .join("\n\n");
  const functionSection = Array.from(functions.entries())
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
  imports: ImportDataMap,
  structs: StructDataMap,
  functions: FunctionDataMap,
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
