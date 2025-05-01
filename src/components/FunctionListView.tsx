import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function FunctionListView({
  functions,
}: {
  functions: Record<
    string,
    {
      function: {
        visibility: string;
        isEntry: boolean;
        typeParameters: { abilities: string[] }[];
        parameters: string[];
        return: string[];
      };
    }
  >;
}) {
  return (
    <div className="space-y-4 max-w-xl mx-auto">
      {Object.entries(functions).map(([name, data]) => {
        const fn = data.function;

        return (
          <Card key={name}>
            <CardHeader>
              <CardTitle className="text-blue-600 font-bold">
                {fn.isEntry ? "[entry] " : ""}
                fun {name}
              </CardTitle>
              <CardDescription className="text-sm text-gray-500">
                visibility: {fn.visibility}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 text-sm">
              {/* Type Parameters */}
              <div>
                <div className="font-semibold text-muted-foreground">
                  Type Parameters
                </div>
                {fn.typeParameters.length === 0 ? (
                  <div className="text-gray-500">None</div>
                ) : (
                  <ul className="ml-4 list-disc">
                    {fn.typeParameters.map((tp, idx) => (
                      <li key={idx}>
                        T{idx}
                        {tp.abilities.length > 0 && (
                          <span className="text-gray-500 ml-1">
                            (has {tp.abilities.join(", ")})
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Parameters */}
              <div>
                <div className="font-semibold text-muted-foreground">
                  Parameters
                </div>
                {fn.parameters.length === 0 ? (
                  <div className="text-gray-500">None</div>
                ) : (
                  <ul className="ml-4 list-disc">
                    {fn.parameters.map((p, idx) => (
                      <li key={idx}>{p}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Returns */}
              <div>
                <div className="font-semibold text-muted-foreground">
                  Return Types
                </div>
                {fn.return.length === 0 ? (
                  <div className="text-gray-500">None</div>
                ) : (
                  <ul className="ml-4 list-disc">
                    {fn.return.map((r, idx) => (
                      <li key={idx}>{r}</li>
                    ))}
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
