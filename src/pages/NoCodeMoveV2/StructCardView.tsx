import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { SuiMoveNormalizedStruct } from "@mysten/sui/client";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import EditStructDialog from "./EditStructDialog";

export default function StructCardView({
  structName,
  structValue,
  // onEdit,
  structs,
  imports,
  setStructs,
}: any) {
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
          {structValue.abilities.abilities.length > 0
            ? `has ${structValue.abilities.abilities.join(", ")}`
            : "No abilities"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm text-muted-foreground mb-1">
            Type Parameters
          </h4>
          {structValue.typeParameters.length === 0 ? (
            <p className="text-sm text-gray-500">None</p>
          ) : (
            structValue.typeParameters.map((param, idx) => (
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
          {structValue.fields.length === 0 ? (
            <p className="text-sm text-gray-500">None</p>
          ) : (
            structValue.fields.map((field) => (
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
        <Dialog>
          <DialogTrigger>
            <button
              // onClick={onEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Edit
            </button>
          </DialogTrigger>
          <EditStructDialog
            // open={editDialogOpen}
            // setOpen={setEditDialogOpen}
            // structToEdit={structToEdit}
            imports={imports}
            structs={structs}
            setStructs={setStructs}
          />
        </Dialog>
      </CardContent>
    </Card>
  );
}
