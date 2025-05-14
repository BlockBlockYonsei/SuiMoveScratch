import { useState } from "react";
import {
  SuiMoveNormalizedFunction,
  SuiMoveNormalizedStruct,
} from "@mysten/sui/client";

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
import { SUI_PACKAGES } from "@/Constants";
import ImportPackageModule from "./ImportPackageModule";
import { ImportsType } from "@/types/move";

interface Props {
  setImports: React.Dispatch<React.SetStateAction<ImportsType>>;
}

export default function AddImportDialog({ setImports }: Props) {
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
          {SUI_PACKAGES.map((pkg) => (
            <SelectItem key={pkg} value={pkg}>
              {pkg.slice(0, 8)}...{pkg.slice(-4)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 패키지를 선택한 후만 로딩/오류/리스트 표시 */}
      {SUI_PACKAGES.map((pkg) => (
        <ImportPackageModule
          className={`${selectedPkg === pkg ? "" : "hidden"}`}
          packageId={pkg}
          setImports={setImports}
        />
      ))}
    </DialogContent>
  );
}
