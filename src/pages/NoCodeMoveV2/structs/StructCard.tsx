import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { X } from "lucide-react";
import { StructDataMap, SuiMoveStruct } from "@/types/move-syntax";

export default function StructCard({
  structName,
  structData,
  setStructs,
}: {
  structName: string;
  structData: SuiMoveStruct;
  setStructs: React.Dispatch<React.SetStateAction<StructDataMap>>;
}) {
  const formatType = (type: any): string => {
    if (typeof type === "string") return type;
    if (type.Struct) {
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

        <CardTitle className="text-xl font-bold text-emerald-600">
          {structName}
        </CardTitle>
        <CardDescription>
          {structData.abilities.abilities.length > 0
            ? `has ${structData.abilities.abilities.join(", ")}`
            : "No abilities"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm text-muted-foreground mb-1">
            Type Parameters
          </h4>
          {structData.typeParameters.length === 0 ? (
            <p className="text-sm text-gray-500">None</p>
          ) : (
            structData.typeParameters.map((param, idx) => (
              <div
                key={idx}
                className="text-sm text-gray-800 flex items-center justify-between"
              >
                <span>
                  {structData.typeParameterNames[idx]}
                  {param.isPhantom && " (phantom)"}
                </span>
                <span className="text-xs text-gray-500">
                  {param.constraints.abilities.join(", ")}
                </span>
              </div>
            ))
          )}
        </div>
        <div>
          <h4 className="font-semibold text-sm text-muted-foreground mb-1">
            Fields
          </h4>
          {structData.fields.length === 0 ? (
            <p className="text-sm text-gray-500">None</p>
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
