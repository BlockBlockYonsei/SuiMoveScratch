import { useSuiClientQuery } from "@mysten/dapp-kit";

export default function Main() {
  const { data, isPending, error } = useSuiClientQuery(
    "getNormalizedMoveModulesByPackage",
    {
      package:
        "0xb84460fd33aaf7f7b7f80856f27c51db6334922f79e326641fb90d40cc698175",
    }
  );

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error?.message || "Error"}</div>;

  const getRefType = (param: any) => {
    if (typeof param === "object") {
      if ("MutableReference" in param)
        return { ref: "&mut", type: param.MutableReference };
      if ("Reference" in param)
        return { ref: "&", type: param.Reference };
    }
    return { ref: "Value", type: param };
  };

  const renderAbilities = (abilitiesObj: Record<string, boolean>) => {
    return Object.entries(abilitiesObj)
      .filter(([_, value]) => value)
      .map(([name]) => name)
      .join(", ");
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">📦 Move Modules</h1>

      {Object.entries(data || {}).map(([moduleName, module]) => (
        <div key={moduleName} className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">
            🧩 Module: {moduleName}
          </h2>

          {/* Structs */}
          <h3 className="text-xl font-semibold mb-2 text-green-700">
            🧱 Structs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {Object.entries(module.structs || {}).map(
              ([structName, structData]) => (
                <div
                  key={structName}
                  className="border rounded-lg p-4 shadow bg-white"
                >
                  <div className="text-md font-semibold mb-1">{structName}</div>
                  <div className="text-sm mb-2 text-gray-600">
                  Abilities: {renderAbilities(structData.abilities as any)}
                  </div>
                  <table className="w-full text-sm border-collapse border">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-1 text-left">Field</th>
                        <th className="border p-1 text-left">Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {structData.fields.map((field) => (
                        <tr key={field.name}>
                          <td className="border p-1">{field.name}</td>
                          <td className="border p-1">
                            {typeof field.type === "string"
                              ? field.type
                              : JSON.stringify(field.type)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </div>

          {/* Functions */}
          <h3 className="text-xl font-semibold mb-2 text-purple-700">
            ⚙️ Exposed Functions
          </h3>
          <div className="flex flex-wrap gap-6">
            {Object.entries(module.exposedFunctions || {}).map(
              ([funcName, funcData]) => (
                <div
                  key={funcName}
                  className="border rounded-lg p-4 w-[45%] shadow bg-white"
                >
                  <div className="text-md font-semibold mb-2">{funcName}</div>
                  <div className="text-sm font-medium mb-1">Parameters:</div>
                  <div className="space-y-2">
                    {funcData.parameters.map((param, index) => {
                      const { ref, type } = getRefType(param);
                      const displayType =
                        typeof type === "string"
                          ? type
                          : JSON.stringify(type).slice(0, 60) + "...";
                      return (
                        <div
                          key={index}
                          className="flex items-center space-x-2 text-sm"
                        >
                          <div className="bg-gray-200 px-2 py-1 rounded border font-mono">
                            {ref === "Value" ? index : ref}
                          </div>
                          <div className="bg-gray-100 px-2 py-1 rounded border font-mono break-all">
                            {displayType}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
