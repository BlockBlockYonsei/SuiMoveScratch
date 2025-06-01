import { useContext } from "react";
import { SuiMoveModuleContext } from "@/context/SuiMoveModuleContext";
import FunctionCard from "./FunctionCard";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import FunctionCodeEditorDialog from "./FunctionCodeEditorDialog";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NameBox from "../components/NameBox";
import { parseStructNameFromSuiMoveNomalizedType } from "@/lib/convertType";
import { Separator } from "@/components/ui/separator";
import { SuiMoveNormalizedType } from "@mysten/sui/client";

export default function FunctionCodePreview() {
  const { functions, selectedFunction, setSelectedFunction } =
    useContext(SuiMoveModuleContext);

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
          </CardTitle>
          <CardTitle className="text-lg space-x-2">
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
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <CardTitle>Function Parameters</CardTitle>
          <CardTitle className="flex flex-wrap gap-2 text-xl">
            {selectedFunction.parameters.map((p, i) => (
              <NameBox>
                {selectedFunction.parameterNames[i]}:{" "}
                {parseStructNameFromSuiMoveNomalizedType(p)}
              </NameBox>
            ))}
          </CardTitle>
        </CardContent>

        <CardContent className="space-y-2">
          <CardTitle>Function Returns</CardTitle>
          <CardTitle className="flex flex-wrap gap-2 text-xl">
            {selectedFunction.return.map((r, i) => (
              <NameBox>
                {selectedFunction.returnNames[i]}:{" "}
                {parseStructNameFromSuiMoveNomalizedType(r)}
              </NameBox>
            ))}
          </CardTitle>
        </CardContent>
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
