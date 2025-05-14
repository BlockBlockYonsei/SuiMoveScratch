import { useSuiClientQuery } from "@mysten/dapp-kit";
import { SuiMoveNormalizedModules } from "@mysten/sui/client";

export default function ImportModal({
  pkgAddress,
  addImport,
}: {
  pkgAddress: string;
  addImport: (
    data: SuiMoveNormalizedModules,
    pkgAddress: string,
    moduleName: string,
    structName: string
  ) => void;
}) {
  const { data, isPending, error } = useSuiClientQuery(
    "getNormalizedMoveModulesByPackage",
    {
      package: pkgAddress,
    },
    {
      enabled: true,
    }
  );

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error?.message || "error"}</div>;

  return (
    <div>
      <h2 className="text-2xl">
        {pkgAddress.slice(0, 5)}...{pkgAddress.slice(-4)}
      </h2>
      <ul className="w-48 bg-white border rounded-xl shadow-lg z-10">
        {Object.entries(data).map(([moduleName, moduleData]) => {
          return (
            <div key={moduleName} className="relative group">
              <div className="px-4 py-2 hover:bg-blue-100 cursor-pointer rounded-xl transition">
                {moduleName}
              </div>
              <ul className="absolute left-full top-0 w-40 bg-white border rounded-xl shadow-lg hidden group-hover:block z-20">
                <li
                  onClick={() => {
                    addImport(data, pkgAddress, moduleName, "Self");
                  }}
                  className="px-4 py-2 text-emerald-500 hover:bg-blue-50 cursor-pointer transition"
                >
                  Self
                </li>
                {Object.keys(moduleData.structs).length > 0 &&
                  Object.keys(moduleData.structs).map((structName) => (
                    <li
                      key={structName}
                      onClick={() => {
                        addImport(data, pkgAddress, moduleName, structName);
                      }}
                      className="px-4 py-2 text-emerald-500 hover:bg-blue-50 cursor-pointer transition"
                    >
                      {structName}
                    </li>
                  ))}
              </ul>
            </div>
          );
        })}
      </ul>
    </div>
  );
}
