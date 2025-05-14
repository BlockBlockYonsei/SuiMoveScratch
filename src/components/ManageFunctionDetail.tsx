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
import {
  SuiMoveNormalizedFunction,
  SuiMoveNormalizedStruct,
} from "@mysten/sui/client";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { SuiMoveFunction } from "@/types/move";
import { Label } from "./ui/label";
import FunctionParameterSelect from "./FunctionParameterSelect";

interface InsideCode {
  functionName: string;
  parameters: string[];
  return: string[];
  typeParameters: string[];
}

export default function ManageFunctionDetail({
  imports,
  structs,
  functions,
  selectedFunction,
  setFunctions,
}: {
  imports: Record<
    string,
    {
      functions: Record<string, Record<string, SuiMoveNormalizedFunction>>;
      structs: Record<string, SuiMoveNormalizedStruct>;
    }
  >;
  structs: Record<string, SuiMoveNormalizedStruct>;
  selectedFunction: [string, SuiMoveFunction];
  functions: Record<string, SuiMoveFunction>;
  setFunctions: React.Dispatch<
    React.SetStateAction<Record<string, SuiMoveFunction>>
  >;
}) {
  const [open, setOpen] = useState(false);
  const [insideCodes, setInsideCodes] = useState<InsideCode[]>([]);
  const [currentInsideCode, setCurrentInsideCode] = useState<InsideCode | null>(
    null
  );
  const [selectedImportFn, setSelectedImportFn] = useState<
    SuiMoveNormalizedFunction | SuiMoveFunction | null
  >(null);
  const [selectedParams, setSelectedParams] = useState<string[]>([]);
  const [selectedReturns, setSelectedReturns] = useState<string[]>([]);
  const [selectedTypeArgs, setSelectedTypeArgs] = useState<string[]>([]);

  const handleSelect = (functionName: string) => {
    let selectedFn;
    if (functionName.includes("::")) {
      const [importName, moduleName, fnName] = functionName.split("::");
      console.log(importName, moduleName, fnName);
      selectedFn =
        imports[`${importName}::${moduleName}`].functions[moduleName][fnName];
    } else {
      selectedFn = functions[functionName];
    }
    setSelectedImportFn(selectedFn);

    if (!selectedFn) return;
    setCurrentInsideCode({
      functionName: functionName,
      parameters: [],
      return: [],
      typeParameters: [],
    });
  };

  const handleParameterSelect = (value: string, index: number) => {
    setSelectedParams((prev) => {
      const newParams = [...prev];
      newParams[index] = value;
      return newParams;
    });
  };

  const handleReturnSelect = (value: string, index: number) => {
    setSelectedReturns((prev) => {
      const newReturns = [...prev];
      newReturns[index] = value;
      return newReturns;
    });
  };

  const handleTypeArgSelect = (value: string, index: number) => {
    setSelectedTypeArgs((prev) => {
      const newTypeArgs = [...prev];
      newTypeArgs[index] = value;
      return newTypeArgs;
    });
  };

  const handleConfirm = () => {
    if (!currentInsideCode) return;

    const updatedInsideCode = {
      ...currentInsideCode,
      parameters: selectedParams,
      return: selectedReturns,
      typeParameters: selectedTypeArgs,
    };

    setInsideCodes((prev) => [...prev, updatedInsideCode]);
    setCurrentInsideCode(null);
    setSelectedParams([]);
    setSelectedReturns([]);
    setSelectedTypeArgs([]);
  };

  const handleComplete = () => {
    if (insideCodes.length === 0) return;

    setFunctions((prev) => {
      const updatedFunction = {
        ...prev[selectedFunction[0]],
        insideCode: insideCodes,
      };
      return {
        ...prev,
        [selectedFunction[0]]: updatedFunction,
      };
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mx-auto">Manage Function</Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage a New Function</DialogTitle>
          <DialogDescription>
            You can add codelines in your function.
          </DialogDescription>
        </DialogHeader>
        {/* Name */}
        <div className="mb-2">
          <label className="block mb-1 text-sm font-semibold">
            Function Name : {selectedFunction[0]}
          </label>
        </div>
        {/* Entry + Visibility */}
        <div className="flex gap-4 mb-4">
          <p>Entry :{String(selectedFunction[1].function.isEntry)}</p>
          <p>Visibility : {selectedFunction[1].function.visibility}</p>
        </div>
        <Label>Add Functions</Label>
        <Select onValueChange={handleSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Select type..." />
          </SelectTrigger>
          <SelectContent>
            <Label className="px-2 text-xs text-muted-foreground">
              Current Module Functions
            </Label>
            {Object.keys(functions).map((functionName, idx) => {
              return (
                <SelectItem key={`${functionName}${idx}`} value={functionName}>
                  {functionName}
                </SelectItem>
              );
            })}

            {Object.entries(imports).map(([importName, moduleContent]) => {
              const functionModule = moduleContent.functions;
              return (
                <div key={importName}>
                  <Label className="px-2 text-xs text-muted-foreground">
                    {importName.split("::")[1]}
                  </Label>
                  {Object.keys(functionModule).map((moduleName) => {
                    return Object.keys(functionModule[moduleName]).map(
                      (functionName) => {
                        return (
                          <SelectItem
                            key={`${functionName}`}
                            value={`${importName}::${functionName}`}
                          >
                            {functionName}
                          </SelectItem>
                        );
                      }
                    );
                  })}
                </div>
              );
            })}
          </SelectContent>
        </Select>

        <div className="mt-4 space-y-2">
          <Label>Code Preview</Label>
          <div className="bg-gray-100 p-4 rounded space-y-2">
            {insideCodes.map((funcObj, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-gray-500">{idx + 1}.</span>
                <FunctionParameterSelect
                  function={
                    functions[funcObj.functionName]?.function ??
                    selectedImportFn
                  }
                  functionName={funcObj.functionName}
                  onParameterSelect={(value) =>
                    handleParameterSelect(value, idx)
                  }
                  onReturnSelect={(value) => handleReturnSelect(value, idx)}
                  onTypeArgSelect={(value) => handleTypeArgSelect(value, idx)}
                  selectedParams={funcObj.parameters}
                  selectedReturns={funcObj.return}
                  selectedTypeArgs={funcObj.typeParameters}
                  args={selectedFunction[1].function.parameters.length}
                  structs={structs}
                />
              </div>
            ))}
            {currentInsideCode && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500">{insideCodes.length + 1}.</span>
                <FunctionParameterSelect
                  function={
                    functions[currentInsideCode.functionName]?.function ??
                    selectedImportFn
                  }
                  functionName={currentInsideCode.functionName}
                  onParameterSelect={(value) =>
                    handleParameterSelect(value, selectedParams.length)
                  }
                  onReturnSelect={(value) =>
                    handleReturnSelect(value, selectedReturns.length)
                  }
                  onTypeArgSelect={(value) =>
                    handleTypeArgSelect(value, selectedTypeArgs.length)
                  }
                  selectedParams={selectedParams}
                  selectedReturns={selectedReturns}
                  selectedTypeArgs={selectedTypeArgs}
                  args={selectedFunction[1].function.parameters.length}
                  structs={structs}
                />
                <Button onClick={handleConfirm} size="sm">
                  Confirm
                </Button>
              </div>
            )}
          </div>
        </div>
        <Button onClick={handleComplete}>Complete</Button>
      </DialogContent>
    </Dialog>
  );
}
