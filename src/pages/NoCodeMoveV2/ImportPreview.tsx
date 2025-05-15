import { SUI_PACKAGE_ALIASES } from "@/Constants";
import { SuiMoveModuleContext } from "@/context/SuiMoveModuleContext";
import { useContext } from "react";

export default function ImportPreview() {
  const { imports } = useContext(SuiMoveModuleContext);
  return (
    <div className="pt-4">
      {[...imports.entries()]
        .filter(([_, data]) => data.structs)
        .map(([key, data]) => {
          const alias = SUI_PACKAGE_ALIASES[data.address] || data.address;
          const importedStructNames = Object.keys(data.structs);

          return (
            <div key={key}>
              <span className="text-blue-500">use </span>
              {alias}
              ::{data.moduleName} &#123;{" "}
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
