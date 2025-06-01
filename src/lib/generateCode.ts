import { SUI_PACKAGE_ALIASES } from "@/Constants";
import {
  ImportedModuleData,
  SuiMoveFunction,
  SuiMoveStruct,
} from "@/types/move-type";
import {
  SuiMoveAbilitySet,
  SuiMoveNormalizedType,
  SuiMoveStructTypeParameter,
} from "@mysten/sui/client";
import { parseStructNameFromSuiMoveNomalizedType } from "./convertType";

export function generateModuleDeclaration({
  packageName,
  moduleName,
}: {
  packageName: string;
  moduleName: string;
}): string {
  return `module ${packageName}::${moduleName};\n\n`;
}

export function generateImportsCode(imports: ImportedModuleData): string {
  return (
    Object.entries(imports)
      .sort()
      .map(([packageAddress, data]) => {
        const pkgAlias = SUI_PACKAGE_ALIASES[packageAddress] || packageAddress;

        return [...data.entries()]
          .map(([moduleName, moduleData]) => {
            const importedNames = moduleData.functions
              ? ["Self", ...Object.keys(moduleData.structs)].join(", ")
              : Object.keys(moduleData.structs).join(", ");

            return `use ${pkgAlias}::${moduleName}::{ ${importedNames} };`;
          })
          .join("\n");
      })
      .join("\n\n") + "\n\n"
  );
}

export function generateStructCode(struct: SuiMoveStruct): string {
  const abilities =
    struct.abilities.abilities.length > 0
      ? ` has ${struct.abilities.abilities
          .map((ability: string) => ability.toLowerCase())
          .join(", ")}`
      : "";

  const typeParams = (struct.typeParameters || [])
    .map((tp: SuiMoveStructTypeParameter, i: number) => {
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
    .map(
      (f: { name: string; type: SuiMoveNormalizedType }) =>
        `  ${f.name}: ${parseStructNameFromSuiMoveNomalizedType(
          f.type,
          struct.typeParameterNames
        )},`
    )
    .join("\n");

  return `public struct ${struct.structName}${generics}${abilities} {\n${fields}\n}\n`;
}

export function generateFunctionCode(func: SuiMoveFunction): string {
  const visibility = func.visibility;
  const isEntry = func.isEntry;
  const entryKeyword = isEntry ? "entry " : "";

  const visibilityKeyword =
    visibility === "Public"
      ? `public `
      : visibility === "Friend"
      ? "public (package) "
      : "";

  const typeParams = (func.typeParameters || [])
    .map((tp: SuiMoveAbilitySet, i: number) => {
      const paramName = func.typeParameterNames?.[i] ?? `T${i}`;
      const abilities = tp.abilities
        ?.map((a: string) => a.toLowerCase())
        .join(" + ");
      return `${paramName}${abilities ? `: ${abilities}` : ""}`;
    })
    .join(", ");
  const generics = typeParams ? `<${typeParams}>` : "";

  const parameters = func.parameters
    .map(
      (p: SuiMoveNormalizedType, i: number) =>
        `  ${func.parameterNames[i]}: ${parseStructNameFromSuiMoveNomalizedType(
          p,
          func.typeParameterNames
        )}`
    )
    .join(",\n");

  const returnType =
    func.return.length > 0
      ? `: (${func.return
          .map((r) =>
            parseStructNameFromSuiMoveNomalizedType(r, func.typeParameterNames)
          )
          .join(", ")})`
      : "";

  const insideCodeString = func.insideCodes
    .map((line) => {
      if ("value" in line) {
        if (typeof line.type === "string") {
          return `  let ${line.variableName}: ${line.type.toLowerCase()} = ${
            line.value
          };`;
        }
        return `  let ${line.variableName} = ${line.value};`;
      } else if ("functionName" in line) {
        return `  ${
          line.return.length > 0
            ? "let (" + line.returnNames.join(", ") + ") = "
            : ""
        }${line.functionName}${
          line.typeParameters.length > 0
            ? `<${line.typeParameterNames.join(", ")}>`
            : ``
        }(${line.parameterNames.join(", ")});`;
      } else if ("structName" in line) {
        return `  let ${line.variableName} = ${line.structName} {
${line.fields
  .map((f, i) => `    ${f.name}: ${line.fieldVariableNames[i]},`)
  .join("\n")}
  };`;
      }
    })
    .join("\n");

  return `${entryKeyword}${visibilityKeyword}fun ${
    func.functionName
  }${generics}(${
    parameters.length > 0 ? "\n" + parameters + "\n" : parameters
  })${returnType} {\n${insideCodeString}\n\n${
    func.return.length > 0 ? "  (" + func.returnNames.join(", ") + ")" : ""
  }\n}\n`;
}

// export function generateMoveCode({
//   imports,
//   structs,
//   functions,
//   moduleName,
//   address,
// }: {
//   imports: ImportDataMap;
//   structs: StructDataMap;
//   functions: FunctionDataMap;
//   moduleName?: string;
//   address?: string;
// }): string {
//   const moduleHeader = `module ${address}::${moduleName};\n`;
//   const importSection = generateImportsCode(imports);
//   const structSection = Array.from(structs.entries())
//     .map(([name, struct]) => generateStructCode(name, struct))
//     .join("\n\n");
//   const functionSection = Array.from(functions.entries())
//     .map(([name, func]) => generateFunctionCode(name, func))
//     .join("\n\n");

//   return [
//     moduleHeader,
//     importSection,
//     "",
//     "// ====== Structs ======",
//     structSection,
//     "",
//     "// ====== Functions ======",
//     functionSection,
//   ].join("\n");
// }

// export function downloadMoveCode(
//   imports: ImportDataMap,
//   structs: StructDataMap,
//   functions: FunctionDataMap
// ) {
//   const code = generateMoveCode({ imports, structs, functions });
//   const blob = new Blob([code], { type: "text/plain" });
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = "code.move";
//   a.click();
//   URL.revokeObjectURL(url);
// }
