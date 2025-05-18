import { useContext } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import ImportEditorDialog from "./ImportEditorDialog";
import StructEditorDialog from "./StructEditorDialog";
import FunctionEditorDialog from "./FunctionEditorDialog";

import ImportPreview from "./ImportPreview";
import StructCard from "./StructCard";
import FunctionListView from "./FunctionListView";

import { SuiMoveModuleContext } from "@/context/SuiMoveModuleContext";

export function SideBarEditor() {
  const { structs } = useContext(SuiMoveModuleContext);
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
            <ImportEditorDialog />
          </Dialog>
          <ImportPreview />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-2">
        <AccordionTrigger className="cursor-pointer text-xl">
          Structs
        </AccordionTrigger>
        <AccordionContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="cursor-pointer">Create New Structures</Button>
            </DialogTrigger>
            <StructEditorDialog defaultStructName={null} />
          </Dialog>
          <div className="pt-4">
            {[...structs.keys()].map((structName) => {
              return <StructCard key={structName} structName={structName} />;
            })}
          </div>
        </AccordionContent>
        <AccordionContent></AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-3">
        <AccordionTrigger className="cursor-pointer text-xl">
          Functions
        </AccordionTrigger>
        <AccordionContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="cursor-pointer">Create New Functions</Button>
            </DialogTrigger>
            <FunctionEditorDialog />
          </Dialog>
          <FunctionListView />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
