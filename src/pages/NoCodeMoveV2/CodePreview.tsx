import {
  generateImportsCode,
  generateStructCode,
  generateFunctionCode,
} from "@/pages/NoCodeMoveV2/utils/generateCode";
import { useContext } from "react";
import { SuiMoveModuleContext } from "@/context/SuiMoveModuleContext";
export default function CodePreview() {
  const { imports, structs, functions } = useContext(SuiMoveModuleContext);
  return (
    <div>
      <code>{generateImportsCode(imports)}</code>
      <br /> <br />
      <code>
        {Array.from(structs.entries())
          .map(([structName, structData]) =>
            generateStructCode(structName, structData)
          )
          .join("\n\n")}
      </code>
      <br /> <br />
      <code>
        {Array.from(functions.entries())
          .map(([name, f]) => generateFunctionCode(name, f))
          .join("\n\n")}
      </code>
    </div>
  );
}
