import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  SuiMoveAbilitySet,
  SuiMoveNormalizedStruct,
  SuiMoveVisibility,
} from "@mysten/sui/client";
import TypeSelect from "../pages/NoCodeMove/components/TypeSelect";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { generateFunctionCode } from "@/pages/NoCodeMove/utils/generateCode";

export default function AddFunctionDialog({
  imports,
  structs,
  setFunctions,
}: {
  imports: Record<string, Record<string, SuiMoveNormalizedStruct>>;
  structs: Record<string, SuiMoveNormalizedStruct>;
  setFunctions: React.Dispatch<any>;
}) {
  const [open, setOpen] = useState(false);
  const [functionName, setFunctionName] = useState("new_function");
  const [visibility, setVisibility] = useState<SuiMoveVisibility>("Private");
  const [isEntry, setIsEntry] = useState(false);
  const [typeParameters, setTypeParameters] = useState<SuiMoveAbilitySet[]>([]);
  const [typeParameterNames, setTypeParameterNames] = useState<string[]>([]);
  const [parameters, setParameters] = useState<{ name: string; type: any }[]>(
    [],
  );
  const [returns, setReturns] = useState<any[]>([]);

  const [newParamName, setNewParamName] = useState("");
  const [newReturnType, setNewReturnType] = useState<any | null>(null);
  const [newParamType, setNewParamType] = useState<any | null>(null);
  const [newTypeParamName, setNewTypeParamName] = useState("");

  const handleAddTypeParam = () => {
    if (!newTypeParamName || typeParameterNames.includes(newTypeParamName))
      return;
    setTypeParameterNames((prev) => [...prev, newTypeParamName]);
    setTypeParameters((prev) => [...prev, { abilities: [] }]);
    setNewTypeParamName("");
  };

  const handleAddParam = () => {
    if (!newParamName || !newParamType) return;
    setParameters((prev) => [
      ...prev,
      { name: newParamName, type: newParamType },
    ]);
    setNewParamName("");
    setNewParamType(null);
  };

  const handleAddReturn = () => {
    if (!newReturnType) return;
    setReturns((prev) => [...prev, newReturnType]);
    setNewReturnType(null);
  };

  const handleComplete = () => {
    setFunctions((prev: any) => ({
      ...prev,
      [functionName]: {
        function: {
          visibility,
          isEntry,
          typeParameters,
          parameters: parameters.map((p) => p.type),
          return: returns,
        },
      },
    }));
    setOpen(false);

    // Optionally reset all states
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mx-auto">Create New Functions</Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create a New Function</DialogTitle>
          <DialogDescription>
            Define function properties, type parameters, arguments and return
            types.
          </DialogDescription>
        </DialogHeader>

        {/* Name */}
        <div className="mb-2">
          <label className="block mb-1 text-sm font-semibold">
            Function Name
          </label>
          <Input
            value={functionName}
            onChange={(e) => setFunctionName(e.target.value)}
          />
        </div>

        {/* Entry + Visibility */}
        <div className="flex gap-4 mb-4">
          <Select
            onValueChange={(v) => setIsEntry(v === "true")}
            value={String(isEntry)}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Entry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Entry</SelectItem>
              <SelectItem value="false">Non-entry</SelectItem>
            </SelectContent>
          </Select>

          <Select
            onValueChange={(v) => setVisibility(v as SuiMoveVisibility)}
            value={visibility}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Private">Private</SelectItem>
              <SelectItem value="Friend">Friend</SelectItem>
              <SelectItem value="Public">Public</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Type Parameters */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-semibold">
            Type Parameters
          </label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newTypeParamName}
              placeholder="T"
              onChange={(e) => setNewTypeParamName(e.target.value)}
            />
            <Button onClick={handleAddTypeParam}>Add</Button>
          </div>
        </div>

        {/* Parameters */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-semibold">Parameters</label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newParamName}
              placeholder="Parameter name"
              onChange={(e) => setNewParamName(e.target.value)}
            />
            <TypeSelect
              imports={imports}
              structs={structs}
              typeParameters={[]}
              setType={setNewParamType}
            />
            <Button onClick={handleAddParam}>Add</Button>
          </div>
          <ul className="text-sm space-y-1">
            {parameters.map((p) => (
              <li key={p.name} className="flex justify-between">
                <span>{p.name}</span>
                <span className="text-gray-500">
                  {typeof p.type === "string"
                    ? p.type
                    : "Struct" in p.type
                    ? p.type.Struct.name
                    : "Unknown"}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Returns */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-semibold">
            Return Types
          </label>
          <div className="flex gap-2 mb-2">
            <TypeSelect
              imports={imports}
              structs={structs}
              typeParameters={[]}
              setType={setNewReturnType}
            />
            <Button onClick={handleAddReturn}>Add</Button>
          </div>
          <ul className="text-sm space-y-1">
            {returns.map((ret, idx) => (
              <li key={idx} className="text-gray-700">
                {typeof ret === "string"
                  ? ret
                  : "Struct" in ret
                  ? ret.Struct.name
                  : "Unknown"}
              </li>
            ))}
          </ul>
        </div>

        {/* Preview */}
        <div className="bg-gray-100 p-4 text-sm rounded whitespace-pre-wrap mb-4">
          {generateFunctionCode(functionName, {
            function: {
              visibility,
              isEntry,
              typeParameters,
              parameters: parameters.map((p) => p.type),
              return: returns,
            },
          })}
        </div>

        <Button onClick={handleComplete}>Complete</Button>
      </DialogContent>
    </Dialog>
  );
}
