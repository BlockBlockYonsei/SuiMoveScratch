import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SuiMoveModuleContext } from "@/context/SuiMoveModuleContext";
import { SuiMoveFunction } from "@/types/move-syntax";
import { X } from "lucide-react";
import { useContext } from "react";
import { convertTypeToString } from "../../../lib/generateCode";
import NameBox from "../components/NameBox";

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
        <div className="flex">
          {fn.isEntry && (
            <NameBox className="text-pink-500 font-semibold mr-2">
              {"[entry]"}
            </NameBox>
          )}
          {fn.visibility !== "Private" && (
            <NameBox
              className={`${
                fn.visibility === "Public"
                  ? "text-blue-500"
                  : fn.visibility === "Friend"
                  ? "text-yellow-400"
                  : ""
              } font-semibold`}
            >
              {fn.visibility === "Public"
                ? "public"
                : fn.visibility === "Friend"
                ? "public (package)"
                : ""}{" "}
            </NameBox>
          )}
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
                className="text-sm text-gray-800 flex items-center gap-2"
              >
                <span className="font-semibold">
                  {functionData.function.typeParameterNames[idx]}:
                </span>
                <span className="text-gray-500 flex gap-1 flex-wrap">
                  {param.abilities.map((a) => (
                    <NameBox key={a} className="border-blue-300">
                      {a.toUpperCase()}
                    </NameBox>
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
                className="text-gray-800 flex items-center gap-2"
              >
                <NameBox className="border-none">
                  {functionData.function.parameterNames[i]}:
                </NameBox>
                :
                <span className="text-gray-500 flex gap-1 flex-wrap">
                  <NameBox className="border-pink-300">
                    {typeof param === "object" && "TypeParameter" in param
                      ? functionData.function.typeParameterNames[
                          Number(convertTypeToString(param))
                        ]
                      : convertTypeToString(param)}
                  </NameBox>
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
            <div className="flex gap-2 flex-wrap">
              {functionData.function.return.map((r, i) => (
                <NameBox key={i} className="border-emerald-300">
                  {typeof r === "object" && "TypeParameter" in r
                    ? functionData.function.typeParameterNames[
                        Number(convertTypeToString(r))
                      ]
                    : convertTypeToString(r)}
                </NameBox>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
