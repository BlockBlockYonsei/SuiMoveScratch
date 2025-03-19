import { useSuiClientQuery } from "@mysten/dapp-kit";

export default function Main() {
  const { data, isPending, error } = useSuiClientQuery(
    "getNormalizedMoveModulesByPackage",
    {
      package:
        "0xb84460fd33aaf7f7b7f80856f27c51db6334922f79e326641fb90d40cc698175",
    }
  );

  console.log(data?.blockblock.structs);

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error?.message || "error"}</div>;
  }

  return (
    <div>
      <div className="text-2xl">Blockblock</div>
      <div className="text-lg">여기다 작업해주시면 됩니다.</div>
      {Object.entries(data.blockblock.structs).map(
        ([structName, structData]) => (
          <div
            key={structName}
            className="border p-4 mb-6 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-semibold mb-2">{structName}</h2>
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Field Name</th>
                  <th className="border p-2">Type</th>
                </tr>
              </thead>
              <tbody>
                {structData.fields.map((field) => (
                  <tr key={field.name}>
                    <td className="border p-2">{field.name}</td>
                    <td className="border p-2">
                      {typeof field.type === "string" ? field.type : "Struct"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}
