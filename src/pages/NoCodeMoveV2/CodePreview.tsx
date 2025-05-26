// import {
//   generateImportsCode,
//   generateStructCode,
//   generateFunctionCode,
// } from "@/lib/generateCode";
import { useContext, useEffect, useState } from "react";
import { SuiMoveModuleContext } from "@/context/SuiMoveModuleContext2";
import { Button } from "@/components/ui/button";

import { createHighlighter } from "shiki";

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

      const code1 = highlighter.codeToHtml(
        `
        module exclusuive::collection;`,
        {
          lang: "move",
          theme: "nord",
        }
      );
      setCode(code1);
    };

    createCode();
  }, [moduleName, imports, structs, functions]);

  return (
    <div>
      {/* <code>{generateImportsCode(imports)}</code> */}
      <code dangerouslySetInnerHTML={{ __html: code }} />
    </div>
  );
}
