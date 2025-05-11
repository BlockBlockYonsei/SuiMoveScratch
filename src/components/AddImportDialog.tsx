import { useState } from "react";
import { useSuiClientQuery } from "@mysten/dapp-kit";
import { SuiMoveNormalizedModules } from "@mysten/sui/client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogClose } from "@radix-ui/react-dialog";

export default function AddImportDialog({
  packages,
  addImport,
}: {
  packages: string[];
  addImport: (
    data: SuiMoveNormalizedModules,
    pkgAddress: string,
    moduleName: string,
    structName: string
  ) => void;
}) {
  const [selectedPkg, setSelectedPkg] = useState<string | null>(null);

  const { data, isPending, error } = useSuiClientQuery(
    "getNormalizedMoveModulesByPackage",
    {
      package: selectedPkg || "", // default to empty string
    },
    {
      enabled: !!selectedPkg, // only run when selectedPkg is truthy
    }
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">Create New Imports</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Modules and Structs</DialogTitle>
          <DialogDescription>
            Select a package, then choose a module and struct to import.
          </DialogDescription>
        </DialogHeader>

        {/* 패키지 선택 */}
        <Select onValueChange={(value: any) => setSelectedPkg(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a package" />
          </SelectTrigger>
          <SelectContent>
            {packages.map((pkg) => (
              <SelectItem key={pkg} value={pkg}>
                {pkg.slice(0, 8)}...{pkg.slice(-4)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 패키지를 선택한 후만 로딩/오류/리스트 표시 */}
        {selectedPkg && (
          <>
            {isPending ? (
              <div className="text-center py-4">Loading...</div>
            ) : error ? (
              <div className="text-center text-red-500 py-4">
                Error: {error?.message || "Failed to load modules"}
              </div>
            ) : (
              <div className="w-full bg-white border rounded-xl shadow-lg p-2 space-y-2 max-h-96 overflow-y-auto">
                {Object.entries(data).map(([moduleName, moduleData]) => (
                  <div key={moduleName} className="relative group">
                    <div className="px-4 py-2 hover:bg-blue-100 cursor-pointer rounded-xl transition font-semibold">
                      {moduleName}
                    </div>

                    <ul className="ml-4 mt-2 space-y-1">
                      <DialogClose>
                        <li
                          onClick={() => {
                            addImport(data, selectedPkg, moduleName, "Self");
                          }}
                          className="px-4 py-1 text-emerald-600 hover:bg-blue-50 cursor-pointer rounded transition"
                        >
                          Self
                        </li>
                      </DialogClose>
                      {Object.keys(moduleData.structs).map((structName) => (
                        <DialogClose>
                          <li
                            key={structName}
                            onClick={() => {
                              addImport(
                                data,
                                selectedPkg,
                                moduleName,
                                structName
                              );
                            }}
                            className="px-4 py-1 text-emerald-600 hover:bg-blue-50 cursor-pointer rounded transition"
                          >
                            {structName}
                          </li>
                        </DialogClose>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
