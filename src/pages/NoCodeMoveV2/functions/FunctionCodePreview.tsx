import { useContext } from "react";
import { SuiMoveModuleContext } from "@/context/SuiMoveModuleContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NameBox from "../components/NameBox";
import {
  parseStructNameFromSuiMoveNomalizedType,
  parseTypeStringFromSuiMoveNomalizedType,
} from "@/lib/convertType";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import AssignVariableDialog from "./AssignVariableDialog";
import useFunctionDataHook from "./useFunctionDataHook";

export default function FunctionCodePreview() {
  const { functions, selectedFunction } = useContext(SuiMoveModuleContext);

  const { insideCodes, setInsideCodes, handleComplete } = useFunctionDataHook();

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
                  <NameBox key={i}>
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
            <span>Parameters: (</span>
            {selectedFunction.parameters.map((p, i) => (
              <NameBox key={i}>
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
            <DialogTrigger asChild>
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
            if / while
          </Button>
        </CardContent>

        <CardContent>
          <Button
            variant={"default"}
            className="w-1/2 cursor-pointer active:bg-black active:text-white"
            onClick={handleComplete}
          >
            Complete
          </Button>
        </CardContent>

        <CardContent>
          <div className="border-2 border-black rounded-md min-h-30">
            {insideCodes.map((line, index) => {
              if ("functionName" in line) {
                return (
                  <div key={index}>
                    {line.variableNames.length > 0 &&
                      `let (${line.variableNames.join(", ")}) = `}
                    {line.functionName}
                    {line.typeArguments.length > 0
                      ? `<${line.typeArguments.map((t) =>
                          parseStructNameFromSuiMoveNomalizedType(
                            t,
                            line.typeParameterNames
                          )
                        )}>`
                      : ""}
                    ({line.argumentNames.join(", ")});
                  </div>
                );
              } else if ("structName" in line) {
                return (
                  <div key={index}>
                    let {line.variableName} = {line.structName}
                    {line.typeArguments.length > 0
                      ? `<${line.typeArguments.map((t) =>
                          parseStructNameFromSuiMoveNomalizedType(
                            t,
                            line.typeParameterNames
                          )
                        )}>`
                      : ""}
                    {` {
  ${line.fields
    .map((f, i) => `${f.name}: ${line.fieldVariableNames[i]}`)
    .join(",\n  ")}
};`}
                  </div>
                );
              } else if ("value" in line && typeof line.type === "string") {
                return (
                  <div key={index}>
                    let {line.variableName}: {line.type.toLowerCase()} ={" "}
                    {line.value};
                  </div>
                );
              }

              return (
                <div key={index}>
                  <div>{JSON.stringify(line)}</div>
                </div>
              );
            })}
          </div>
        </CardContent>

        <Separator />

        <CardContent className="space-y-2">
          <CardTitle className="flex flex-wrap gap-2 text-xl items-center">
            <span>Returns: (</span>
            {selectedFunction.return.map((r, i) => (
              <NameBox key={i}>
                <span>{selectedFunction.returnNames[i]}: </span>
                <span>{parseTypeStringFromSuiMoveNomalizedType(r)}</span>
              </NameBox>
            ))}
            <span>)</span>
          </CardTitle>
        </CardContent>
      </Card>
    </div>
  );
}
