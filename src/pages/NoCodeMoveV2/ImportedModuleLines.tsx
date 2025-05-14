import { SUI_PACKAGES } from "@/Constants";
import { SuiMoveNormalizedStruct } from "@mysten/sui/client";

interface Props {
  imports: Record<string, Record<string, SuiMoveNormalizedStruct>>;
}
export default function ImportedModuleLines({ imports }: Props) {
  return (
    <div className="py-4">
      {Object.entries(imports)
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
        .map(([key, values]) => {
          const typedValues = values as Record<string, SuiMoveNormalizedStruct>;

          const pkgName = () => {
            const pkg = key.split("::")[0];
            if (pkg === SUI_PACKAGES[0]) return "std";
            else if (pkg === SUI_PACKAGES[1]) return "sui";
            else return pkg;
          };

          return (
            <div key={key}>
              <span className="text-blue-500">use </span>
              {pkgName()}::{key.split("::")[1]} &#123;{" "}
              <span className="text-emerald-500 font-semibold">
                {Object.keys(typedValues).join(", ")}
              </span>{" "}
              &#125;;
            </div>
          );
        })}{" "}
    </div>
  );
}
