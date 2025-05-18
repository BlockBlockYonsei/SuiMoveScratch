import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { X } from "lucide-react";
import { StructDataMap, SuiMoveStruct } from "@/types/move-syntax";
import { SuiMoveNormalizedType } from "@mysten/sui/client";
import { Button } from "@/components/ui/button";

export default function StructCard({
  structName,
  structData,
  setStructs,
}: {
  structName: string;
  structData: SuiMoveStruct;
  setStructs: React.Dispatch<React.SetStateAction<StructDataMap>>;
}) {
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
    <Card key={structName} className="w-full max-w-xl mx-auto relative">
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

        <CardTitle className="text-xl text-start font-bold text-emerald-600 truncate">
          {structName}
        </CardTitle>
        <CardDescription className="text-start">
          {structData.abilities.abilities.length > 0 && (
            <span>
              {structData.abilities.abilities.map((a) => (
                <Button
                  key={a}
                  variant={"outline"}
                  className="cursor-pointer text-xs px-2 font-semibold border-2 py-1"
                >
                  {a.toUpperCase()}
                </Button>
              ))}
            </span>
          )}
        </CardDescription>
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
                className="text-sm text-gray-800 flex items-center justify-between"
              >
                <span
                  className={`${
                    !param.isPhantom ? "text-purple-500" : ""
                  } font-semibold`}
                >
                  {structData.typeParameterNames[idx]}:
                </span>
                <span className="text-xs text-gray-500">
                  {param.constraints.abilities.map((a) => (
                    <Button
                      key={a}
                      variant={"outline"}
                      className="cursor-pointer text-xs px-1 font-semibold border-2"
                    >
                      {a.toUpperCase().replace(/[aeiouAEIOU]/g, "")}
                    </Button>
                  ))}
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
                className="flex justify-between text-sm text-gray-800"
              >
                <span>{field.name}</span>
                <span className="text-xs text-gray-500">
                  {formatType(field.type)}
                </span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
