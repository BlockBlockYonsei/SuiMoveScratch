// import {
//   generateImportsCode,
//   generateStructCode,
//   generateFunctionCode,
// } from "@/lib/generateCode";
import { useContext, useEffect, useState } from "react";
import { SuiMoveModuleContext } from "@/context/SuiMoveModuleContext";
import { Button } from "@/components/ui/button";

import { createHighlighter } from "shiki";
import {
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

      const structsCode = Array.from(structs.values())
        .map((struct) => generateStructCode(struct))
        .join("\n");

      const code = moduleDeclaration + importsCode + structsCode;

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
      <code className="" dangerouslySetInnerHTML={{ __html: code }} />
    </div>
  );
}
