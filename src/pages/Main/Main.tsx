import { useSuiClientQuery } from "@mysten/dapp-kit";

export default function Main() {
  const { data, isPending, error } = useSuiClientQuery(
    "getNormalizedMoveModulesByPackage",
    {
      package:
        "0xb84460fd33aaf7f7b7f80856f27c51db6334922f79e326641fb90d40cc698175",
    },
  );

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error?.message || "error"}</div>;
  }

  return (
    <div className="p-4">
      <div className="text-2xl font-bold mb-4">Blockblock</div>
      <div className="text-lg mb-6">여기다 작업해주시면 됩니다.</div>

      <div className="space-y-6">
        {Object.entries(data.blockblock.structs).map(
          ([structName, structData]) => (
            <div key={structName} className="border p-4">
              <div className="text-xl font-semibold mb-2">{structName}</div>

              {/* abilities */}
              <div className="mb-2">
                <span className="font-medium">abilities: </span>
                <span className="px-1 rounded">
                  {structData.abilities.abilities}
                </span>
              </div>

              {/* type parameters */}
              {structData.typeParameters.length > 0 && (
                <div className="mb-2">
                  <span className="font-medium">type parameters: </span>
                  <div>{JSON.stringify(structData.typeParameters)}</div>
                </div>
              )}

              {/* fields */}
              {structData.fields.length > 0 && (
                <div>
                  <span className="font-medium">fields: </span>
                  <div className="pl-4 space-y-1">
                    {structData.fields.map((field, index) => (
                      <div key={index}>
                        <span className="text-blue-600">{field.name}:</span>
                        <span className="text-green-600">
                          {JSON.stringify(field.type)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ),
        )}
      </div>
    </div>
  );
}
