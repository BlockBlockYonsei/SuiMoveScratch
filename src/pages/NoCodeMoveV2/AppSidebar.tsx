import { useState } from "react";
import {
  SuiMoveNormalizedModules,
  SuiMoveNormalizedStruct,
} from "@mysten/sui/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import AddImportDialog from "./AddImportDialog";
import AddStructDialog from "./AddStructDialog";
import EditStructDialog from "./EditStructDialog";
import AddFunctionDialog from "./AddFunctionDialog";
import StructListView from "./StructListView";
import FunctionListView from "./FunctionListView";

import { SUI_PACKAGES } from "@/Constants";
import ImportedModuleLines from "./ImportedModuleLines";

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
            <AddImportDialog addImport={addImport} />
          </Dialog>
          <ImportedModuleLines imports={imports} />
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
