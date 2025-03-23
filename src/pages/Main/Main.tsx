import { useSuiClientQuery } from "@mysten/dapp-kit";

export default function Main() {
  const { data, isPending, error } = useSuiClientQuery(
    "getNormalizedMoveModulesByPackage",
    {
      package:
        "0xb84460fd33aaf7f7b7f80856f27c51db6334922f79e326641fb90d40cc698175",
    }
  );

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error?.message || "error"}</div>;
  }

  return (
    <div>
      <div className="text-2xl font-bold mb-4">Move Package Modules</div>
      {Object.entries(data || {}).map(([moduleName, moduleContent]) => (
        <div key={moduleName} className="mb-8">
          <h2 className="text-xl font-semibold mb-2">{moduleName}</h2>

          {moduleContent.structs && Object.entries(moduleContent.structs).length > 0 ? (
            Object.entries(moduleContent.structs).map(
              ([structName, structData]) => (
                <div
                  key={structName}
                  className="border p-4 mb-4 rounded-lg shadow"
                >
                  <h3 className="text-lg font-medium mb-2">{structName}</h3>
                  <table className="w-full border-collapse border">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-2">Field Name</th>
                        <th className="border p-2">Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {structData.fields.map((field) => (
                        <tr key={field.name}>
                          <td className="border p-2">{field.name}</td>
                          <td className="border p-2">
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
            )
          ) : (
            <p className="text-sm text-gray-500">No structs found in this module.</p>
          )}
        </div>
      ))}
    </div>
  );
}
