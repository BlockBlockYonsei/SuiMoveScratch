import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { SUI_PACKAGE_ALIASES } from "@/Constants";
import { SuiMoveModuleContext } from "@/context/SuiMoveModuleContext";
import { PlusIcon } from "lucide-react";
import { useContext } from "react";
import ImportEditorDialog from "./ImportEditorDialog";

export default function ImportPreview() {
  const { imports } = useContext(SuiMoveModuleContext);

  return (
    <div>
      <div className="space-y-1">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="cursor-pointer w-1/2">
              <PlusIcon />
            </Button>
          </DialogTrigger>
          <ImportEditorDialog />
        </Dialog>
        {[...imports.entries()]
          .filter(([_, data]) => data.structs)
          .map(([key, data]) => {
            const alias = SUI_PACKAGE_ALIASES[data.address] || data.address;
            const importedStructNames = Object.keys(data.structs);

            return (
              <Card key={key} className="border flex py-3">
                <CardHeader>
                  <CardTitle>
                    <span className="text-blue-500">use </span>
                    <span>
                      {alias}
                      ::{data.moduleName} &#123;{" "}
                    </span>
                    <span className="text-emerald-500 font-semibold cursor-pointer">
                      {data.functions
                        ? ["Self", ...importedStructNames].join(", ")
                        : importedStructNames.join(", ")}
                    </span>{" "}
                    &#125;;
                  </CardTitle>
                </CardHeader>
              </Card>
            );
          })}{" "}
      </div>
    </div>
  );
}
