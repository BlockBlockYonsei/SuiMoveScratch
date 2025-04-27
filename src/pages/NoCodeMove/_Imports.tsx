import { SuiMoveNormalizedStruct } from "@mysten/sui/client";
import ImportButton from "./imports/ImportButton";

interface Props {
  imports: Record<string, Record<string, SuiMoveNormalizedStruct>>;
  setImports: React.Dispatch<
    React.SetStateAction<
      Record<string, Record<string, SuiMoveNormalizedStruct>>
    >
  >;
}

export default function Imports({ imports, setImports }: Props) {
  const packages = [
    "0x0000000000000000000000000000000000000000000000000000000000000001",
    "0x0000000000000000000000000000000000000000000000000000000000000002",
  ];

  return (
    <section className="bg-white p-4 rounded-xl border-2 border-black">
      {/* Import 제목 및 Import 추가 버튼 */}
      <div className="flex items-center gap-4">
        <h2 className="inline-block bg-gray-200 text-3xl">Imports</h2>
        <ImportButton packages={packages} setImports={setImports} />
      </div>

      {/* imort 한 module 보여주는 코드 */}
      {Object.entries(imports)
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
        .map(([key, values]) => {
          const pkgName = () => {
            const pkg = key.split("::")[0];
            if (pkg === packages[0]) return "std";
            else if (pkg === packages[1]) return "sui";
            // 나중에 Move.toml 파일의 [addresses] 읽어서 반영
            else return pkg;
          };
          return (
            <div key={key}>
              <span className="text-blue-500">use </span>
              {pkgName()}::{key.split("::")[1]} &#123;{" "}
              <span className="text-emerald-500 font-semibold">
                {Object.keys(values).join(", ")}
              </span>{" "}
              &#125;;
            </div>
          );
        })}
    </section>
  );
}
