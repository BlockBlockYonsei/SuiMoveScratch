import { useContext } from "react";
import { X } from "lucide-react";

import { SuiMoveStruct } from "@/types/move-syntax";
import { SuiMoveModuleContext } from "@/context/SuiMoveModuleContext";
import { convertSuiMoveNomalizedTypeToString } from "@/lib/convertType";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NameBox from "../components/NameBox";

export default function StructCard({
  structName,
  structData,
}: {
  structName: string;
  structData: SuiMoveStruct;
}) {
  const { setStructs } = useContext(SuiMoveModuleContext);

  return (
    <Card className="relative">
      <CardHeader>
        <button
          onClick={() => {
            setStructs((prev) => {
              const newStructData = new Map(prev);
              newStructData.delete(structName);
              return newStructData;
            });
          }}
          className="absolute cursor-pointer top-3 right-3 text-gray-400 hover:text-black"
        >
          <X size={20} />
        </button>

        <CardTitle className="flex gap-2 flex-wrap items-center">
          <span className="text-xl text-start font-bold text-emerald-600">
            {structName}
          </span>
          <span>
            {structData.abilities.abilities.length > 0 && (
              <span className="flex gap-1 flex-wrap">
                {structData.abilities.abilities.map((a) => (
                  <NameBox key={a} className="border-pink-300 text-gray-500">
                    {a.toUpperCase()}
                  </NameBox>
                ))}
              </span>
            )}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <CardTitle className="font-semibold text-sm text-start text-muted-foreground mb-1">
            Type Parameters
          </CardTitle>
          {structData.typeParameters.length === 0 ? (
            <p className="text-sm text-gray-500 border rounded-sm">None</p>
          ) : (
            structData.typeParameters.map((param, idx) => (
              <div
                key={idx}
                className="text-sm text-gray-800 flex items-center gap-2"
              >
                <NameBox
                  className={`${
                    param.isPhantom ? "text-purple-500" : ""
                  } border-none`}
                >
                  {structData.typeParameterNames[idx]}
                </NameBox>
                :
                <span className="text-gray-500 flex gap-1 flex-wrap">
                  {param.constraints.abilities.length > 0 ? (
                    param.constraints.abilities.map((a) => (
                      <NameBox key={a} className="border-blue-300">
                        {a.toUpperCase()}
                      </NameBox>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 border rounded-sm w-14">
                      None
                    </p>
                  )}
                </span>
              </div>
            ))
          )}
        </div>

        <div>
          <CardTitle className="font-semibold text-sm text-start text-muted-foreground mb-1">
            Fields
          </CardTitle>

          {structData.fields.length === 0 ? (
            <p className="text-sm text-gray-500 border rounded-sm">None</p>
          ) : (
            structData.fields.map((field) => (
              <div
                key={field.name}
                className="text-gray-800 flex items-center gap-2"
              >
                <NameBox className="border-none">{field.name}</NameBox>:
                <NameBox className="text-gray-500 border-emerald-300">
                  {typeof field.type === "object" &&
                  "TypeParameter" in field.type
                    ? structData.typeParameterNames[
                        Number(convertSuiMoveNomalizedTypeToString(field.type))
                      ]
                    : convertSuiMoveNomalizedTypeToString(field.type)}
                </NameBox>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
