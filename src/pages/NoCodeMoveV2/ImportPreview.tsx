import { SUI_PACKAGE_ALIASES } from "@/Constants";
import { SuiMoveModuleContext } from "@/context/SuiMoveModuleContext";
import { useContext } from "react";

export default function ImportedModuleLines() {
  const { imports } = useContext(SuiMoveModuleContext);
  return (
    <div className="pt-4">
      {Object.entries(imports).map(([key, data]) => {
        if (!data.structs) return;

        console.log("ImportedmoduelLisnel", data);

        const importedStructNames = Object.keys(data.structs);
        const pkg = key.split("::")[0];

        return (
          <div key={key}>
            <span className="text-blue-500">use </span>
            {SUI_PACKAGE_ALIASES[pkg] || pkg}
            ::{key.split("::")[1]} &#123;{" "}
            <span className="text-emerald-500 font-semibold">
              {data.functions
                ? ["Self", ...importedStructNames].join(", ")
                : importedStructNames.join(", ")}
            </span>{" "}
            &#125;;
          </div>
        );
      })}{" "}
    </div>
  );
}
