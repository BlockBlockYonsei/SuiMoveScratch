import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { SuiMoveNormalizedStruct } from "@mysten/sui/client";
import { X } from "lucide-react";

function StructCardView({
  structName,
  struct,
  onEdit,
}: {
  structName: string;
  struct: SuiMoveNormalizedStruct;
  onEdit: () => void;
}) {
  return (
    <Card className="w-full max-w-xl mx-auto mb-6 relative">
      <CardHeader>
        <button
          // onClick={() => onDelete(structName)}
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

        {/* Edit Button */}
        <div className="mt-4">
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Edit
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function StructListView({
  structs,
  setStructToEdit,
  setEditDialogOpen,
}: {
  structs: Record<string, SuiMoveNormalizedStruct>;
  setStructToEdit: (s: any) => void;
  setEditDialogOpen: (open: boolean) => void;
}) {
  return (
    <div className="space-y-4">
      {Object.entries(structs).map(([name, struct]) => (
        <StructCardView
          key={name}
          structName={name}
          struct={struct}
          onEdit={() => {
            setStructToEdit({ name, ...struct });
            setEditDialogOpen(true);
          }}
        />
      ))}
    </div>
  );
}
