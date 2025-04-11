import { useSuiClientQuery } from "@mysten/dapp-kit";
import { useState } from "react";

export default function Imports() {
  const [imports, setImports] = useState<Record<string, string[]>>({});
  const [isOpen, setIsOpen] = useState(false);

  const packages = [
    "0x0000000000000000000000000000000000000000000000000000000000000001",
    "0x0000000000000000000000000000000000000000000000000000000000000002",
  ];

  const PACKAGE =
    // "0x31323c09dee186fae0b38e0dace096140f5765713e64d10d95f2537b4b699ab4";
    "0x0000000000000000000000000000000000000000000000000000000000000002";
  const { data, isPending, error } = useSuiClientQuery(
    "getNormalizedMoveModulesByPackage",
    {
      package: PACKAGE,
    },
    {
      enabled: true,
    }
  );

  const addImportBlock = (module: string, i: string) => {
    console.log(imports[module]);
    if (imports[module]) {
      const newImports = [...imports[module], i];
      setImports((prev) => ({
        ...prev,
        [module]: newImports,
      }));
    } else {
      setImports((prev) => ({
        ...prev,
        [module]: [i],
      }));
    }
  };
  const handleConfirm = (module: string, i: string) => {
    if (module) {
      console.log(module);
      addImportBlock(module, i);
      setIsOpen(false);
    }
  };

  if (isPending) return <div>Loading...</div>;

  if (error) return <div>Error: {error?.message || "error"}</div>;

  return (
    <div>
      <div className="bg-white p-4 rounded-xl border-2 border-black">
        <div className="inline-block bg-gray-200 text-2xl">Imports</div>
        {Object.entries(imports).map(([key, values]) => {
          return (
            <div key={key}>
              <span className="text-blue-500">use</span> sui::{key}:: &#123;{" "}
              <span className="text-emerald-500 font-semibold">
                {values.join(", ")}
              </span>{" "}
              &#125;;
            </div>
          );
        })}
      </div>
      <br></br>
      <Button onClick={() => setIsOpen((prev) => !prev)}>➕ Import 추가</Button>
      <div className="relative">
        {isOpen && (
          <div className="apsolute left-0 p-4 mt-2 bg-white rounded-xl shadow overflow-auto max-h-64">
            <ul className="w-48 bg-white border rounded-xl shadow-lg z-10">
              {Object.entries(data).map(([moduleName, moduleData]) => (
                <li key={moduleName} className="relative group">
                  <div className="px-4 py-2 hover:bg-blue-100 cursor-pointer rounded-xl transition">
                    {moduleName}
                  </div>

                  <ul className="absolute left-full top-0 w-40 bg-white border rounded-xl shadow-lg hidden group-hover:block z-20">
                    {Object.keys(moduleData.structs).map((k) => (
                      <li
                        key={k}
                        onClick={() => {
                          handleConfirm(moduleName, k);
                          setIsOpen(false);
                        }}
                        className="px-4 py-2 text-emerald-500 hover:bg-blue-50 cursor-pointer transition"
                      >
                        {k}
                      </li>
                    ))}
                    {/* {Object.keys(moduleData.exposedFunctions).map((k) => (
                      <li
                        key={k}
                        onClick={() => {
                          handleConfirm(moduleName, k);
                          setIsOpen(false);
                        }}
                        className="px-4 py-2 text-pink-500 hover:bg-blue-50 cursor-pointer transition"
                      >
                        {k}()
                      </li>
                    ))} */}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// ✅ Button 컴포넌트
function Button({ children, onClick }: { children: any; onClick: any }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition"
    >
      {children}
    </button>
  );
}
