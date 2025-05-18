import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import StructEditorDialog from "./StructEditorDialog";
import { useContext } from "react";
import { SuiMoveModuleContext } from "@/context/SuiMoveModuleContext";

export default function StructCard() {
  const { structs, setStructs } = useContext(SuiMoveModuleContext);

  return (
    <div className="space-y-6">
      {Array.from(structs.entries()).map(([structName, structData]) => (
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
                      {JSON.stringify(field.type)}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Edit Button */}
            <Dialog>
              <DialogTrigger>
                <button className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-md">
                  Edit
                </button>
              </DialogTrigger>
              <StructEditorDialog defaultStructName={structName} />
            </Dialog>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
