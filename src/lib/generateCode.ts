import { SUI_PACKAGE_ALIASES } from "@/Constants";
import { ImportedModuleData, SuiMoveStruct } from "@/types/move-type";
import {
  SuiMoveNormalizedType,
  SuiMoveStructTypeParameter,
} from "@mysten/sui/client";
import {
  convertSuiMoveNomalizedTypeToString,
  parseStructNameFromSuiMoveNomalizedType,
} from "./convertType";

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
        `  ${f.name}: ${
          typeof f.type === "object" && "TypeParameter" in f.type
            ? struct.typeParameterNames[
                Number(convertSuiMoveNomalizedTypeToString(f.type))
              ]
            : parseStructNameFromSuiMoveNomalizedType(f.type)
        },`
    )
    .join("\n");

  return `public struct ${struct.structName}${generics}${abilities} {\n${fields}\n}`;
}
// export function generateStructCode2(
//   name: string,
//   struct: SuiMoveStruct
// ): string {
//   const abilities =
//     struct.abilities.abilities.length > 0
//       ? ` has ${struct.abilities.abilities
//           .map((ability: string) => ability.toLowerCase())
//           .join(", ")}`
//       : "";

//   const typeParams = (struct.typeParameters || [])
//     .map((tp: SuiMoveStructTypeParameter, i: number) => {
//       const phantom = tp.isPhantom ? "phantom " : "";
//       const paramName = struct.typeParameters?.[i] ?? `T${i}`;
//       const abilities = tp.constraints?.abilities
//         ?.map((a: string) => a.toLowerCase())
//         .join(" + ");
//       return `${phantom}${paramName}${abilities ? `: ${abilities}` : ""}`;
//     })
//     .join(", ");

//   const generics = typeParams ? `<${typeParams}>` : "";

//   const fields = (struct.fields || [])
//     .map(
//       (f: { name: string; type: SuiMoveNormalizedType }) =>
//         `  ${f.name}: ${
//           typeof f.type === "object" && "TypeParameter" in f.type
//             ? `T${struct.typeParameters[Number(convertTypeToString(f.type))]}`
//             : convertTypeToString(f.type).toLowerCase()
//         },`
//     )
//     .join("\n");

//   return `${name}${generics}${abilities} {\n${fields}\n}`;
// }

// export function generateFunctionCode(
//   name: string,
//   func: SuiMoveFunction
// ): string {
//   const visibility = func.function.visibility;
//   const isEntry = func.function.isEntry;
//   const entryKeyword = isEntry ? "entry " : "";

//   const visibilityKeyword =
//     visibility === "Public"
//       ? `public `
//       : visibility === "Friend"
//       ? "public (package) "
//       : "";

//   const typeParams = (func.function.typeParameters || [])
//     .map((tp: SuiMoveAbilitySet, i: number) => {
//       const paramName = func.function.typeParameterNames?.[i] ?? `T${i}`;
//       const abilities = tp.abilities
//         ?.map((a: string) => a.toLowerCase())
//         .join(" + ");
//       return `${paramName}${abilities ? `: ${abilities}` : ""}`;
//     })
//     .join(", ");
//   const generics = typeParams ? `<${typeParams}>` : "";

//   const parameters = func.function.parameters
//     .map(
//       (p: any, i: number) =>
//         `${func.function.parameterNames[i]}: ${
//           typeof p === "object" && "TypeParameter" in p
//             ? func.function.typeParameterNames[Number(convertTypeToString(p))]
//             : convertTypeToString(p)
//         }`
//     )
//     .join(", ");

//   const returnType =
//     func.function.return.length > 0
//       ? `: (${func.function.return
//           .map((r) =>
//             typeof r === "object" && "TypeParameter" in r
//               ? func.function.typeParameterNames[Number(convertTypeToString(r))]
//               : convertTypeToString(r)
//           )
//           .join(", ")})`
//       : "";

//   const insideCodeString = func.insideCode
//     .map((code) => {
//       if (
//         typeof code === "object" &&
//         "functionName" in code &&
//         typeof code.functionName === "string" &&
//         Array.isArray(code.return) &&
//         Array.isArray(code.returnVariableNames) &&
//         Array.isArray(code.typeParameters) &&
//         Array.isArray(code.typeArgumentNames) &&
//         Array.isArray(code.parameters) &&
//         Array.isArray(code.argumentNames)
//       ) {
//         if (code.return.length > 0) {
//           return `  let (${code.returnVariableNames.join(", ")})${
//             code.return.length === 1 ? "" : ")"
//           } = ${code.functionName}${
//             code.typeParameters.length === 0
//               ? ""
//               : `<${code.typeParameters.map((_, i) => `T${i}`).join(", ")}>`
//           }(${code.parameters
//             .map(
//               (p, i) =>
//                 `${
//                   Array.isArray(code.argumentNames) && code.argumentNames[i]
//                 }: ${convertTypeToString(p)}`
//             )
//             .join(", ")});`;
//         } else {
//           return `  ${code.functionName}(${code.parameters
//             .map(
//               (p, i) =>
//                 `${
//                   Array.isArray(code.argumentNames) && code.argumentNames[i]
//                 }: ${convertTypeToString(p)}`
//             )
//             .join(", ")});`;
//         }
//       } else if (typeof code === "object" && "struct" in code) {
//         return `  let var = ${generateStructCode2(
//           code.struct.structName,
//           code.struct
//         )}`;
//       } else if (typeof code === "string") {
//         return `  let var = ${code};`;
//       }
//     })
//     .join("\n");

//   return `${entryKeyword}${visibilityKeyword}fun ${name}${generics}(${parameters})${returnType} {\n${insideCodeString}\n}`;
// }

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
