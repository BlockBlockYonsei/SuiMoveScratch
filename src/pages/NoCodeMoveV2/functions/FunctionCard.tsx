import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { SuiMoveModuleContext } from "@/context/SuiMoveModuleContext";
import { SuiMoveFunction } from "@/types/move-syntax";
import { X } from "lucide-react";
import { useContext } from "react";

export default function FunctionCard({
  functionName,
  functionData,
}: {
  functionName: string;
  functionData: SuiMoveFunction;
}) {
  const fn = functionData.function;
  const { setFunctions } = useContext(SuiMoveModuleContext);
  return (
    <Card className="relative">
      <CardHeader>
        <button
          onClick={() => {
            setFunctions((prev) => {
              const newFunctionData = new Map(prev);
              newFunctionData.delete(functionName);
              return newFunctionData;
            });
          }}
          className="absolute cursor-pointer top-3 right-3 text-gray-400 hover:text-black"
        >
          <X size={20} />
        </button>
        <CardTitle className="text-blue-600 font-bold">
          {fn.isEntry ? "[entry] " : ""}
          fun {functionName}
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
          <div className="font-semibold text-muted-foreground">Parameters</div>
          {fn.parameters.length === 0 ? (
            <div className="text-gray-500">None</div>
          ) : (
            <ul className="ml-4 list-disc">
              {fn.parameters.map((p, idx) => (
                <li key={idx}>
                  {typeof p === "string"
                    ? p
                    : "Struct" in p
                    ? p.Struct.name
                    : "Unknown"}
                </li>
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
                <li key={idx}>
                  {typeof r === "string"
                    ? r
                    : "Struct" in r
                    ? r.Struct.name
                    : "Unknown"}
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* <ManageFunctionDetail functionName={name} /> */}
      </CardContent>
    </Card>
  );
}
