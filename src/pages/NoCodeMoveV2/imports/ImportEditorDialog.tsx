import { useState } from "react";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SUI_PACKAGE_ALIASES } from "@/Constants";
import ImportModuleSelector from "@/pages/NoCodeMoveV2/imports/ImportModuleSelector";

export default function ImportEditorDialog() {
  const [selectedPkg, setSelectedPkg] = useState<string | null>(null);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Import Modules and Structs</DialogTitle>
        <DialogDescription>
          Select a package, then choose a module and struct to import.
        </DialogDescription>
      </DialogHeader>

      {/* 패키지 선택 */}
      <Select
        onValueChange={(value: string) => setSelectedPkg(value)}
        defaultValue={selectedPkg ? selectedPkg : ""}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a package" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(SUI_PACKAGE_ALIASES).map(([pkg, alias]) => (
            <SelectItem key={pkg} value={pkg} className="cursor-pointer">
              {pkg.slice(0, 8)}...{pkg.slice(-4)} ({alias})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 패키지를 선택한 후만 로딩/오류/리스트 표시 */}
      {Object.keys(SUI_PACKAGE_ALIASES).map((pkg) => (
        <ImportModuleSelector
          key={pkg}
          className={`${selectedPkg === pkg ? "" : "hidden"}`}
          packageId={pkg}
        />
      ))}
    </DialogContent>
  );
}
