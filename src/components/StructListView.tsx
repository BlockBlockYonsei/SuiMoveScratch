import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { SuiMoveNormalizedStruct } from "@mysten/sui/client";
import { X } from "lucide-react";
import EditStructDialog from "./EditStructDialog";
import { useState } from "react";
import AddStructDialog from "./AddStructDialog";

function StructCardView({
  structName,
  struct,
  structs,
  setStructs,
}: {
  structName: string;
  struct: SuiMoveNormalizedStruct;
  structs: Record<string, SuiMoveNormalizedStruct>;
  setStructs: React.Dispatch<
    React.SetStateAction<Record<string, SuiMoveNormalizedStruct>>
  >;
}) {
  const imports: string[] = [];

  const onDelete = () => {
    setStructs((prev: any) => {
      const newStructs = { ...prev };
      delete newStructs[structName];
      return newStructs;
    });
  };

  return (
    <Card className="w-full max-w-xl mx-auto mb-6 relative">
      <CardHeader>
        <button
          onClick={onDelete}
          className="absolute top-3 right-3 text-gray-400 hover:text-black"
        >
          <X size={20} />
        </button>

        <CardTitle className="text-xl font-bold text-emerald-600">
          {structName}
        </CardTitle>
        <CardDescription>
          {struct.abilities.abilities.length > 0
            ? `has ${struct.abilities.abilities.join(", ")}`
            : "No abilities"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm text-muted-foreground mb-1">
            Type Parameters
          </h4>
          {struct.typeParameters.length === 0 ? (
            <p className="text-sm text-gray-500">None</p>
          ) : (
            struct.typeParameters.map((param, idx) => (
              <div
                key={idx}
                className="text-sm text-gray-800 flex items-center justify-between"
              >
                <span>
                  T{idx}
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
          {struct.fields.length === 0 ? (
            <p className="text-sm text-gray-500">None</p>
          ) : (
            struct.fields.map((field) => (
              <div
                key={field.name}
                className="flex justify-between text-sm text-gray-800"
              >
                <span>{field.name}</span>
                <span className="text-xs text-gray-500">
                  {JSON.stringify(field.type)}
                </span>
              </div>
            ))
          )}
        </div>
        <AddStructDialog
          create={false}
          imports={imports}
          structs={structs}
          setStructs={setStructs}
        />
      </CardContent>
    </Card>
  );
}

export default function StructListView({
  structs,
  setStructs,
}: {
  structs: Record<string, SuiMoveNormalizedStruct>;
  setStructs: React.Dispatch<
    React.SetStateAction<Record<string, SuiMoveNormalizedStruct>>
  >;
}) {
  return (
    <div className="space-y-4">
      {Object.entries(structs).map(([name, struct]) => (
        <StructCardView
          key={name}
          structName={name}
          struct={struct}
          structs={structs}
          setStructs={setStructs}
        />
      ))}
    </div>
  );
}
