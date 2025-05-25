import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { SUI_PACKAGE_ALIASES } from "@/Constants";
import { SuiMoveModuleContext } from "@/context/SuiMoveModuleContext2";
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
        {Object.entries(imports)
          .sort()
          .map(([packageAddress, data]) => {
            const alias = SUI_PACKAGE_ALIASES[packageAddress] || packageAddress;

            return (
              <Card key={packageAddress} className="border flex py-3">
                <CardHeader>
                  {[...data.entries()].map(([moduleName, moduleData]) => {
                    return (
                      <CardTitle key={moduleName}>
                        <span className="text-blue-500">use </span>
                        <span>
                          {alias}
                          ::{moduleName} &#123;{" "}
                        </span>
                        <span className="text-emerald-500 font-semibold cursor-pointer">
                          {moduleData.functions
                            ? ["Self", ...Object.keys(moduleData.structs)].join(
                                ", "
                              )
                            : Object.keys(moduleData.structs).join(", ")}
                        </span>{" "}
                        &#125;;
                      </CardTitle>
                    );
                  })}
                </CardHeader>
              </Card>
            );
          })}{" "}
      </div>
    </div>
  );
}
