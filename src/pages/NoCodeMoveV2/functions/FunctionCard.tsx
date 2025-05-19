import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SuiMoveModuleContext } from "@/context/SuiMoveModuleContext";
import { SuiMoveFunction } from "@/types/move-syntax";
import { X } from "lucide-react";
import { useContext } from "react";
import { SuiMoveNormalizedType } from "@mysten/sui/client";

export default function FunctionCard({
  functionName,
  functionData,
}: {
  functionName: string;
  functionData: SuiMoveFunction;
}) {
  const fn = functionData.function;
  const { setFunctions } = useContext(SuiMoveModuleContext);

  const formatType = (type: SuiMoveNormalizedType): string => {
    if (typeof type === "string") return type;
    if ("Struct" in type && type.Struct) {
      const { name, typeArguments } = type.Struct;
      if (typeArguments && typeArguments.length > 0) {
        return `${name}<${typeArguments
          .map((t: any) => formatType(t))
          .join(", ")}>`;
      }
      return name;
    }
    return JSON.stringify(type);
  };
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
        <div className="flex ">
          <Button
            disabled={!fn.isEntry}
            variant={"outline"}
            className={`${
              fn.isEntry ? "text-pink-600" : "text-black"
            } cursor-pointer text-xs px-1 font-semibold border-2 mr-2`}
          >
            {"[entry]"}
          </Button>
          <Button
            variant={"outline"}
            className={`${
              fn.visibility === "Public"
                ? "text-blue-500"
                : fn.visibility === "Friend"
                ? "text-yellow-400"
                : ""
            } text-start text-xs font-semibold cursor-pointer`}
          >
            {fn.visibility === "Public"
              ? "public"
              : fn.visibility === "Friend"
              ? "public (package)"
              : "private"}{" "}
          </Button>
        </div>
        <CardTitle className="text-lg text-start font-bold text-pink-600 truncate">
          {functionName}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 text-sm">
        {/* Type Parameters */}
        <div>
          <CardTitle className="font-semibold text-sm text-start text-muted-foreground mb-1">
            Type Parameters
          </CardTitle>
          {functionData.function.typeParameters.length === 0 ? (
            <p className="text-sm text-gray-500 border rounded-sm">None</p>
          ) : (
            functionData.function.typeParameters.map((param, idx) => (
              <div
                key={idx}
                className="text-sm text-gray-800 flex items-center justify-between"
              >
                <span className="font-semibold">
                  {functionData.function.typeParameterNames[idx]}:
                </span>
                <span className="text-xs text-gray-500">
                  {param.abilities.map((a) => (
                    <Button
                      key={a}
                      variant={"outline"}
                      className="cursor-pointer text-xs px-1 font-semibold border-2"
                    >
                      {a.toUpperCase()}
                    </Button>
                  ))}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Parameters */}
        <div>
          <CardTitle className="font-semibold text-sm text-start text-muted-foreground mb-1">
            Parameters
          </CardTitle>

          {functionData.function.parameters.length === 0 ? (
            <p className="text-sm text-gray-500 border rounded-sm">None</p>
          ) : (
            functionData.function.parameters.map((param, i) => (
              <div
                key={functionData.function.parameterNames[i]}
                className="flex justify-between text-sm text-gray-800"
              >
                <span>{functionData.function.parameterNames[i]}</span>
                <span className="text-xs text-gray-500">
                  {formatType(param)}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Returns */}
        <div>
          <CardTitle className="font-semibold text-sm text-start text-muted-foreground mb-1">
            Returns
          </CardTitle>

          {functionData.function.return.length === 0 ? (
            <p className="text-sm text-gray-500 border rounded-sm">None</p>
          ) : (
            functionData.function.return.map((r, i) => (
              <div
                key={functionData.function.returnNames[i]}
                className="flex justify-between text-sm text-gray-800"
              >
                <span>{functionData.function.returnNames[i]}</span>
                <span className="text-xs text-gray-500">{formatType(r)}</span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
