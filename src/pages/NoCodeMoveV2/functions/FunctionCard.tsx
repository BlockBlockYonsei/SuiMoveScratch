import { useContext } from "react";
import { X } from "lucide-react";

import { SuiMoveFunction } from "@/types/move-type";
import { SuiMoveModuleContext } from "@/context/SuiMoveModuleContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import NameBox from "../components/NameBox";
import { convertSuiMoveNomalizedTypeToString } from "@/lib/convertType";

export default function FunctionCard({
  functionName,
  functionData,
}: {
  functionName: string;
  functionData: SuiMoveFunction;
}) {
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
          {functionData.isEntry && (
            <NameBox className="text-pink-500 font-semibold mr-2">
              {"[entry]"}
            </NameBox>
          )}
          {functionData.visibility !== "Private" && (
            <NameBox
              className={`${
                functionData.visibility === "Public"
                  ? "text-blue-500"
                  : functionData.visibility === "Friend"
                  ? "text-yellow-400"
                  : ""
              } font-semibold`}
            >
              {functionData.visibility === "Public"
                ? "public"
                : functionData.visibility === "Friend"
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
          {functionData.typeParameters.length === 0 ? (
            <p className="text-sm text-gray-500 border rounded-sm">None</p>
          ) : (
            functionData.typeParameters.map((param, idx) => (
              <div
                key={idx}
                className="text-sm text-gray-800 flex items-center gap-2"
              >
                <span className="font-semibold">
                  {functionData.typeParameterNames[idx]}:
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

          {functionData.parameters.length === 0 ? (
            <p className="text-sm text-gray-500 border rounded-sm">None</p>
          ) : (
            functionData.parameters.map((param, i) => (
              <div
                key={functionData.parameterNames[i]}
                className="text-gray-800 flex items-center gap-2"
              >
                <NameBox className="border-none">
                  {functionData.parameterNames[i]}:
                </NameBox>
                :
                <span className="text-gray-500 flex gap-1 flex-wrap">
                  <NameBox className="border-pink-300">
                    {/* {convertSuiMoveNomalizedTypeToString(param)} */}
                    {typeof param === "object" && "TypeParameter" in param
                      ? functionData.typeParameterNames[
                          Number(convertSuiMoveNomalizedTypeToString(param))
                        ]
                      : convertSuiMoveNomalizedTypeToString(param)}
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

          {functionData.return.length === 0 ? (
            <p className="text-sm text-gray-500 border rounded-sm">None</p>
          ) : (
            <div className="flex gap-2 flex-wrap">
              {functionData.return.map((r, i) => (
                <NameBox key={i} className="border-emerald-300">
                  {typeof r === "object" && "TypeParameter" in r
                    ? functionData.typeParameterNames[
                        Number(convertSuiMoveNomalizedTypeToString(r))
                      ]
                    : convertSuiMoveNomalizedTypeToString(r)}
                </NameBox>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
