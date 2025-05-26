// import {
//   generateImportsCode,
//   generateStructCode,
//   generateFunctionCode,
// } from "@/lib/generateCode";
import { useContext, useEffect, useState } from "react";
import { SuiMoveModuleContext } from "@/context/SuiMoveModuleContext";

import { createHighlighter } from "shiki";
import {
  generateFunctionCode,
  generateImportsCode,
  generateModuleDeclaration,
  generateStructCode,
} from "@/lib/generateCode";

export default function CodePreview() {
  const { moduleName, imports, structs, functions } =
    useContext(SuiMoveModuleContext);

  const [code, setCode] = useState("");

  useEffect(() => {
    const createCode = async () => {
      const highlighter = await createHighlighter({
        langs: ["move"],
        themes: ["nord"],
      });

      const moduleDeclaration = generateModuleDeclaration({
        packageName: "0x0",
        moduleName,
      });

      const importsCode = generateImportsCode(imports);

      const structsCode =
        Array.from(structs.values())
          .map((struct) => generateStructCode(struct))
          .join("\n") + "\n";

      const functionsCode =
        Array.from(functions.values())
          .map((func) => generateFunctionCode(func))
          .join("\n") + "\n";

      const code =
        moduleDeclaration + importsCode + structsCode + functionsCode;

      const highlightedCode = highlighter.codeToHtml(code, {
        lang: "move",
        theme: "nord",
      });

      setCode(highlightedCode);
    };

    createCode();
  }, [moduleName, imports, structs, functions]);

  return (
    <div className="min-h-100">
      <pre className="shiki overflow-x-auto rounded p-4 bg-[#2e3440ff] text-white text-sm">
        <code dangerouslySetInnerHTML={{ __html: code }} />
      </pre>
    </div>
  );
}
