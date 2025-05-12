import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AddImportDialog from "./AddImportDialog";
import AddStructDialog from "./AddStructDialog";
import AddFunctionDialog from "./AddFunctionDialog";
import { SuiMoveNormalizedStruct } from "@mysten/sui/client";
import StructListView from "./StructListView";
import FunctionListView from "./FunctionListView";
import { generateImportsCode } from "@/pages/NoCodeMove/utils/generateCode";
import { SuiMoveFunction } from "@/types/move";

export function AppSidebar({
  packages,
  imports,
  structs,
  functions,
  setImports,
  setStructs,
  setFunctions,
}: {
  packages: string[];
  imports: Record<string, Record<string, SuiMoveNormalizedStruct>>;
  structs: Record<string, SuiMoveNormalizedStruct>;
  functions: Record<string, SuiMoveFunction>;
  setImports: React.Dispatch<
    React.SetStateAction<
      Record<string, Record<string, SuiMoveNormalizedStruct>>
    >
  >;
  setStructs: React.Dispatch<
    React.SetStateAction<Record<string, SuiMoveNormalizedStruct>>
  >;
  setFunctions: React.Dispatch<
    React.SetStateAction<Record<string, SuiMoveFunction>>
  >;
}) {
  return (
    <Accordion
      type="multiple"
      className="w-[300px] bg-blue-50 min-h-screen p-5"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>Imports</AccordionTrigger>
        <AccordionContent>{generateImportsCode(imports)}</AccordionContent>
        <AccordionContent>
          <AddImportDialog
            packages={packages}
            imports={imports}
            setImports={setImports}
          />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Structs</AccordionTrigger>
        <AccordionContent>
          <StructListView structs={structs} setStructs={setStructs} />
        </AccordionContent>
        <AccordionContent>
          <AddStructDialog
            create={true}
            imports={imports}
            structs={structs}
            setStructs={setStructs}
          />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Functions</AccordionTrigger>
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
    </Accordion>
  );
}
