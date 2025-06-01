import { useContext } from "react";
import { SuiMoveModuleContext } from "@/context/SuiMoveModuleContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NameBox from "../components/NameBox";
import { parseTypeStringFromSuiMoveNomalizedType } from "@/lib/convertType";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import { SUI_PACKAGE_ALIASES, PRIMITIVE_TYPES } from "@/Constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FunctionInsideCodeLine, SuiMoveStruct } from "@/types/move-type";
import { SuiMoveNormalizedType } from "@mysten/sui/client";
import { convertSuiMoveStructToSuiMoveNomalizedType } from "@/lib/convertType";
import FunctionSelector from "../components/FunctionSelector";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AssignVariableDialog from "./AssignVariableDialog";
import useFunctionDataHook from "./useFunctionDataHook";

export default function FunctionCodePreview() {
  const { structs, functions, selectedFunction } =
    useContext(SuiMoveModuleContext);

  const { insideCodes, setInsideCodes } = useFunctionDataHook();

  if ([...functions.keys()].length === 0) return <div>Add Function</div>;

  if (!selectedFunction) return <div>No Selected Function</div>;

  return (
    <div className="space-y-2">
      <Card className="w-full">
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl space-x-2">
            <NameBox
              className={`${
                selectedFunction.isEntry ? "border-purple-500" : ""
              }`}
            >
              Entry
            </NameBox>
            <NameBox>
              {selectedFunction.visibility === "Public"
                ? `public `
                : selectedFunction.visibility === "Friend"
                ? "public (package) "
                : "private"}
            </NameBox>
            <NameBox>{selectedFunction.functionName}</NameBox>
            {selectedFunction.typeParameters.length > 0 && (
              <span className="text-lg space-x-2">
                &lt;
                {selectedFunction.typeParameters.map((tp, i) => (
                  <NameBox>
                    <span>{selectedFunction.typeParameterNames[i]}</span>
                    <span>
                      {tp.abilities.length > 0
                        ? ": " + tp.abilities.join(" + ")
                        : ""}
                    </span>
                  </NameBox>
                ))}
                &gt;
              </span>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          <CardTitle className="flex flex-wrap gap-2 text-xl items-center">
            <span>(</span>
            {selectedFunction.parameters.map((p, i) => (
              <NameBox>
                {selectedFunction.parameterNames[i]}:{" "}
                {parseTypeStringFromSuiMoveNomalizedType(p)}
              </NameBox>
            ))}
            <span>)</span>
          </CardTitle>
        </CardContent>

        <Separator />
        <CardContent className="space-x-2 ">
          <Dialog>
            <DialogTrigger
              asChild
              // onClick={() => setSelectedFunction(undefined)}
            >
              <Button variant="outline" className="cursor-pointer h-full">
                Assign Variable
              </Button>
            </DialogTrigger>
            <AssignVariableDialog
              insideCodes={insideCodes}
              addFunction={(line) => {
                setInsideCodes((prev) => [...prev, line]);
              }}
            />
          </Dialog>
          {/* <FunctionSelector addFunction={() => {}} /> */}
          {/* <Select
            onValueChange={(value: string) => {
              const convertedType: FunctionInsideCodeLine = JSON.parse(value);
              // addFunction(convertedType);
            }}
          >
            <SelectTrigger className="cursor-pointer">
              <SelectValue placeholder="Assign Variable">
                Assign Variable
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-80 max-w-140 overflow-y-auto grid grid-cols-4">
              <Label className="px-2 text-xs text-muted-foreground">
                Primitive Types
              </Label>
              <div className="grid grid-cols-4">
                {PRIMITIVE_TYPES.map((type) => {
                  if (typeof type !== "string") return null;

                  const value =
                    type === "Address" || type === "Signer"
                      ? `"0x0"`
                      : type === "Bool"
                      ? "false"
                      : "0";
                  return (
                    <SelectItem
                      key={type}
                      value={JSON.stringify({
                        type: type as SuiMoveNormalizedType,
                        variableName: "variable",
                        value: value,
                      })}
                      className="col-span-1 cursor-pointer hover:bg-gray-200"
                    >
                      {type}
                    </SelectItem>
                  );
                })}
              </div>
              <Label className="px-2 text-xs text-muted-foreground">
                Current Module Structs
              </Label>
              <div className="grid grid-cols-2">
                {[...structs.values()].map((struct) => {
                  return (
                    <SelectItem
                      key={struct.structName}
                      value={JSON.stringify({
                        type: convertSuiMoveStructToSuiMoveNomalizedType(
                          struct
                        ) as SuiMoveNormalizedType,
                        variableName: struct.structName,
                        value: `${struct.structName}${
                          struct.typeParameters.length > 0
                            ? `<${struct.typeParameterNames.join(", ")}>`
                            : ""
                        } {\n${struct.fields
                          .map((f, i) => `    ${f.name}: field${i}`)
                          .join("\n")}\n   }`,
                      })}
                      className="cursor-pointer hover:bg-gray-200"
                    >
                      {struct.structName}
                    </SelectItem>
                  );
                })}
              </div>
            </SelectContent>
          </Select> */}

          <Button
            variant={"outline"}
            className="cursor-pointer active:bg-black active:text-white"
          >
            Execute Function
          </Button>
          <Button
            variant={"outline"}
            className="cursor-pointer active:bg-black active:text-white"
          >
            Assert
          </Button>
          <Button
            variant={"outline"}
            className="cursor-pointer active:bg-black active:text-white"
          >
            if / while
          </Button>
        </CardContent>

        <CardContent className="border-2 border-black rounded-md min-h-30">
          <div>
            {insideCodes.map((line) => (
              <div>{JSON.stringify(line)}</div>
            ))}
          </div>
        </CardContent>

        <Separator />

        {selectedFunction.return.length > 0 && (
          <CardContent className="space-y-2">
            <CardTitle className="flex flex-wrap gap-2 text-xl items-center">
              <span>: (</span>
              {selectedFunction.return.map((r, i) => (
                <NameBox>
                  <span>{selectedFunction.returnNames[i]}: </span>
                  <span>{parseTypeStringFromSuiMoveNomalizedType(r)}</span>
                </NameBox>
              ))}
              <span>)</span>
            </CardTitle>
          </CardContent>
        )}
      </Card>
      {/* <Dialog key={selectedFunction.functionName}>
        <DialogTrigger className="cursor-pointer rounded-md">
          <FunctionCard
            functionName={selectedFunction.functionName}
            functionData={selectedFunction}
          />
        </DialogTrigger>
        <FunctionCodeEditorDialog />
      </Dialog> */}
    </div>
  );
}
