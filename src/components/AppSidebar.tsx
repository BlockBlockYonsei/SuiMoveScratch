import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AddImportDialog from "./AddImportDialog";
import AddStructDialog from "./AddStructDialog";
import EditStructDialog from "./EditStructDialog";
import AddFunctionDialog from "./AddFunctionDialog";
import {
  SuiMoveNormalizedModules,
  SuiMoveNormalizedStruct,
} from "@mysten/sui/client";
import StructListView from "./StructListView";
import FunctionListView from "./FunctionListView";
import { useState } from "react";
import { SUI_PACKAGES } from "@/Constants";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";

export function AppSidebar({
  imports,
  structs,
  functions,
  setImports,
  setStructs,
  setFunctions,
}: any) {
  const [structToEdit, setStructToEdit] = useState<any>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const addImport = (
    data: SuiMoveNormalizedModules,
    pkgAddress: string,
    moduleName: string,
    structName: string
  ) => {
    if (moduleName) {
      const key = pkgAddress + "::" + moduleName;
      setImports((prev: any) => ({
        ...prev,
        [key]: {
          ...(prev[key] || {}),
          [structName]: data[moduleName].structs[structName],
        },
      }));
    }
  };

  return (
    <Accordion
      type="multiple"
      className="w-[350px] bg-blue-50 min-h-screen p-5"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger className="cursor-pointer text-xl">
          Imports
        </AccordionTrigger>
        <AccordionContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="cursor-pointer">Create New Imports</Button>
            </DialogTrigger>
            {Object.entries(imports)
              .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
              .map(([key, values]) => {
                const typedValues = values as Record<
                  string,
                  SuiMoveNormalizedStruct
                >;

                const pkgName = () => {
                  const pkg = key.split("::")[0];
                  if (pkg === SUI_PACKAGES[0]) return "std";
                  else if (pkg === SUI_PACKAGES[1]) return "sui";
                  else return pkg;
                };

                return (
                  <div key={key}>
                    <span className="text-blue-500">use </span>
                    {pkgName()}::{key.split("::")[1]} &#123;{" "}
                    <span className="text-emerald-500 font-semibold">
                      {Object.keys(typedValues).join(", ")}
                    </span>{" "}
                    &#125;;
                  </div>
                );
              })}{" "}
            <AddImportDialog addImport={addImport} />
          </Dialog>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-2">
        <AccordionTrigger className="cursor-pointer text-xl">
          Structs
        </AccordionTrigger>
        <AccordionContent>
          <StructListView
            structs={structs}
            setStructToEdit={setStructToEdit}
            setEditDialogOpen={setEditDialogOpen}
            // onDelete={(nameToDelete) => {
            //   const newStructs = { ...structs };
            //   delete newStructs[nameToDelete];
            //   setStructs(newStructs);
            // }}
          />
        </AccordionContent>
        <AccordionContent>
          <AddStructDialog
            imports={imports}
            structs={structs}
            setStructs={setStructs}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-3">
        <AccordionTrigger className="cursor-pointer text-xl">
          Functions
        </AccordionTrigger>
        <AccordionContent>
          <FunctionListView
            imports={imports}
            structs={structs}
            setFunctions={setFunctions}
            functions={functions}
          />
        </AccordionContent>
        <AccordionContent>
          <AddFunctionDialog
            imports={imports}
            structs={structs}
            setFunctions={setFunctions}
          />
        </AccordionContent>
      </AccordionItem>

      <EditStructDialog
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
        structToEdit={structToEdit}
        imports={imports}
        structs={structs}
        setStructs={setStructs}
      />
    </Accordion>
  );
}
