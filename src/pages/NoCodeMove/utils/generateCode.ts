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
  imports: Record<string, Record<string, any>>,
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

export function generateStructCode(name: string, struct: any): string {
  const abilities = struct.abilities.abilities.join(", ");

  const typeParams = struct.typeParameters
    .map((tp: any, i: number) => {
      const phantom = tp.isPhantom ? "phantom " : "";
      const abilities = tp.constraints?.abilities?.join(" + ");
      return `${phantom}T${i}${abilities ? `: ${abilities}` : ""}`;
    })
    .join(", ");

  const generics = typeParams ? `<${typeParams}>` : "";

  const fields = struct.fields
    .map((f: any) => `  ${f.name}: ${formatType(f.type)}`)
    .join("\n");

  return `public struct ${name}${generics} has ${abilities} {\n${fields}\n}`;
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
  {
    /* functionSection */
  }

  return [
    moduleHeader,
    importSection,
    "",
    "// ====== Structs ======",
    structSection,
    "",
    "// ====== Functions ======",
    {
      /* functionSection */
    },
  ].join("\n");
}

export function downloadMoveCode(
  imports: Record<string, any>,
  structs: Record<string, any>,
  functions: Record<string, any>,
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
