import { DialogClose } from "@radix-ui/react-dialog";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FunctionSelector from "../components/FunctionSelector";
import useFunctionDataHook from "./useFunctionDataHook";

export default function FunctionCodeEditorDialog() {
  const { previewCode, setInsideCodes, handleComplete } = useFunctionDataHook();

  return (
    <DialogContent className="sm:max-w-[600px] lg:max-w-[1000px] max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Update Function Code</DialogTitle>

        <DialogDescription>Add function codes</DialogDescription>
      </DialogHeader>

      <div className="lg:grid lg:grid-cols-12 lg:gap-8 min-h-100">
        <section className="col-span-6">
          <FunctionSelector
            // func={
            //   {
            //     functionName: functionName,
            //     visibility,
            //     isEntry,
            //     typeParameters: typeParameters.map((t) => t.type),
            //     typeParameterNames: typeParameters.map((t) => t.name),
            //     parameters: parameters.map((p) => p.type),
            //     parameterNames: parameters.map((p) => p.name),
            //     return: returns.map((r) => r.type),
            //     insideCode: insideCodes,
            //   } as SuiMoveFunction
            // }
            addFunction={(line) => {
              setInsideCodes((prev) => [...prev, line]);
            }}
          />
          <Button
            className="cursor-pointer w-90"
            onClick={() => {
              // setInsideCodes((prev) => {
              //   const [pkg, module, name] =
              //     newInsideCodeFunctionName.split("::");
              //   if (pkg === "primitive") {
              //     return [...prev, name as SuiMoveNormalizedType];
              //   }
              //   if (pkg === "0x0" && module === "currentModuleStruct") {
              //     const selectedStruct = structs.get(name);
              //     if (!selectedStruct) return prev;
              //     return [
              //       ...prev,
              //       {
              //         struct: { ...selectedStruct, structName: name },
              //       },
              //     ];
              //   }
              //   const importedModule = imports.get(`${pkg}::${module}`);
              //   if (pkg === "0x0" && module === "currentModuleFunction") {
              //     const selectedFunction = functions.get(name);
              //     if (!selectedFunction) return prev;
              //     return [
              //       ...prev,
              //       {
              //         functionName: name,
              //         visibility: selectedFunction.function.visibility,
              //         isEntry: selectedFunction.function.isEntry,
              //         typeParameters: selectedFunction.function.typeParameters,
              //         typeArgumentNames:
              //           selectedFunction.function.typeParameters.map(
              //             (_, i) => `T${i}`
              //           ),
              //         parameters: selectedFunction.function.parameters,
              //         argumentNames: selectedFunction.function.parameters.map(
              //           (_, i) => `P${i}`
              //         ),
              //         return: selectedFunction.function.return,
              //         returnVariableNames:
              //           selectedFunction.function.parameters.map(
              //             (_, i) => `R${i}`
              //           ),
              //       } as FunctionInsideCodeLine,
              //     ];
              //   }
              //   if (importedModule && importedModule.functions) {
              //     const selectedFunction = importedModule.functions[name];
              //     return [
              //       ...prev,
              //       {
              //         functionName: `${module}::${name}`,
              //         visibility: selectedFunction.visibility,
              //         isEntry: selectedFunction.isEntry,
              //         typeParameters: selectedFunction.typeParameters,
              //         typeArgumentNames: selectedFunction.typeParameters.map(
              //           (_, i) => `T${i}`
              //         ),
              //         parameters: selectedFunction.parameters,
              //         argumentNames: selectedFunction.parameters.map(
              //           (_, i) => `P${i}`
              //         ),
              //         return: selectedFunction.return,
              //         returnVariableNames: selectedFunction.parameters.map(
              //           (_, i) => `R${i}`
              //         ),
              //       } as FunctionInsideCodeLine,
              //     ];
              //   }
              //   return prev;
              // });
            }}
          >
            Add Function Logic
          </Button>
        </section>
        <section className="col-span-6">
          {/* Preview */}
          <pre className="shiki max-w-[550px] overflow-x-auto rounded p-4 bg-[#2e3440ff] text-white text-sm">
            <code dangerouslySetInnerHTML={{ __html: previewCode }} />
          </pre>
        </section>
      </div>

      <DialogClose>
        <Button className="cursor-pointer w-90" onClick={handleComplete}>
          Complete
        </Button>
      </DialogClose>
    </DialogContent>
  );
}
