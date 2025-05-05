import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { SuiMoveFunction } from "@/pages/NoCodeMove/_Functions";
import ManageFunctionDetail from "./ManageFunctionDetail";
import { SuiMoveNormalizedStruct } from "@mysten/sui/client";

export default function FunctionListView({
  imports,
  structs,
  setFunctions,
  functions,
}: {
  imports: Record<string, Record<string, SuiMoveNormalizedStruct>>;
  structs: Record<string, SuiMoveNormalizedStruct>;
  setFunctions: React.Dispatch<
    React.SetStateAction<Record<string, SuiMoveFunction>>
  >;
  functions: Record<string, SuiMoveFunction>;
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
              <ManageFunctionDetail
                imports={imports}
                structs={structs}
                setFunctions={setFunctions}
              ></ManageFunctionDetail>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
