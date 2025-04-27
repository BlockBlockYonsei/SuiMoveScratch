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