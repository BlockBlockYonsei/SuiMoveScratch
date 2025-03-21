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
      <div className="text-2xl font-bold mb-10">Blockblock</div>
      <div className="text-4xl mb-4">Structs</div>

      <div className="grid flex grid-cols-2 gap-6">
        {Object.entries(data.blockblock.structs).map(
          ([structName, structData]) => (
            <div key={structName} className="border p-4">
              <div className="flex gap-4">
                <div className="text-xl font-semibold mb-2">{structName}</div>
                <div className="text-red-600">has {structData.abilities.abilities}</div>
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
                  <div className="pl-4 space-y-1">
                    {structData.fields.map((field, index) => (
                      <div key={index}>
                        <span className="text-blue-600">{field.name} : </span>
                        <span className="text-green-600">
                          {typeof field.type === 'object' ? Object.entries(field.type).map(
                            ([key, value]) => `${key}: ${value}`).join(", ") : field.type}
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
