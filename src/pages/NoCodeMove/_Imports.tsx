import { SuiMoveNormalizedStruct } from "@mysten/sui/client";
import { useState, useEffect } from "react";

// Define the props interface
interface ImportsProps {
  imports: Record<string, Record<string, SuiMoveNormalizedStruct>>;
  setImports: React.Dispatch<
    React.SetStateAction<
      Record<string, Record<string, SuiMoveNormalizedStruct>>
    >
  >;
}

// Define common Sui packages and modules for dropdown selection
const commonPackages = [
  { address: "0x1", name: "Move Standard Library" },
  { address: "0x2", name: "Sui Framework" },
  { address: "0x3", name: "Sui System" },
  { address: "0x4", name: "Custom Package" },
];

const modulesByPackage: Record<string, string[]> = {
  "0x1": [
    "string",
    "vector",
    "option",
    "ascii",
    "bcs",
    "fixed_point32",
    "hash",
    "signer",
    "type_name",
  ],
  "0x2": [
    "coin",
    "balance",
    "object",
    "transfer",
    "tx_context",
    "event",
    "pay",
    "url",
    "dynamic_field",
  ],
  "0x3": ["sui_system", "validator", "stake", "stake_subsidy"],
  "0x4": [], // Custom modules
};

// Define common structs by module
const structsByModule: Record<string, Record<string, string[]>> = {
  "0x1": {
    string: ["String"],
    vector: ["Vector"],
    option: ["Option"],
    ascii: ["Ascii", "String"],
    bcs: [],
    fixed_point32: ["FixedPoint32"],
    hash: [],
    signer: ["Signer"],
    type_name: ["TypeName"],
  },
  "0x2": {
    coin: ["Coin", "CoinMetadata", "TreasuryCap", "DenyCap"],
    balance: ["Balance", "Supply"],
    object: ["UID", "ID"],
    transfer: [],
    tx_context: ["TxContext"],
    event: [],
    pay: [],
    url: ["Url"],
    dynamic_field: ["Field"],
  },
  "0x3": {
    sui_system: ["SuiSystem"],
    validator: ["Validator", "ValidatorSet"],
    stake: ["Stake", "StakedSui"],
    stake_subsidy: ["StakeSubsidy"],
  },
  "0x4": {}, // Custom structs
};

export default function Imports({ imports, setImports }: ImportsProps) {
  const [isAddingImport, setIsAddingImport] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState("0x1");
  const [packageAddress, setPackageAddress] = useState("0x1");
  const [moduleName, setModuleName] = useState("");
  const [availableModules, setAvailableModules] = useState<string[]>([]);
  const [structName, setStructName] = useState("");
  const [availableStructs, setAvailableStructs] = useState<string[]>([]);
  const [isCustomPackage, setIsCustomPackage] = useState(false);

  // Update available modules when package changes
  useEffect(() => {
    if (selectedPackage === "0x4") {
      setIsCustomPackage(true);
      setPackageAddress("");
    } else {
      setIsCustomPackage(false);
      setPackageAddress(selectedPackage);
      setAvailableModules(modulesByPackage[selectedPackage] || []);
      if (modulesByPackage[selectedPackage]?.length > 0) {
        setModuleName(modulesByPackage[selectedPackage][0]);
      } else {
        setModuleName("");
      }
    }
  }, [selectedPackage]);

  // Update available structs when module changes
  useEffect(() => {
    if (!isCustomPackage && moduleName) {
      setAvailableStructs(structsByModule[selectedPackage]?.[moduleName] || []);
      if (structsByModule[selectedPackage]?.[moduleName]?.length > 0) {
        setStructName(structsByModule[selectedPackage][moduleName][0]);
      } else {
        setStructName("");
      }
    } else {
      setAvailableStructs([]);
      setStructName("");
    }
  }, [moduleName, selectedPackage, isCustomPackage]);

  // Handle form submission for adding an import
  const handleAddImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (packageAddress && moduleName && structName) {
      const pkgModulePath = `${packageAddress}::${moduleName}`;
      // Create a new import entry
      const newImports = { ...imports };
      if (!newImports[pkgModulePath]) {
        newImports[pkgModulePath] = {};
      }
      // Add a placeholder struct for now
      newImports[pkgModulePath][structName] = {
        abilities: { abilities: [] },
        fields: [],
        typeParameters: [],
      };
      setImports(newImports);
      // Reset form
      if (isCustomPackage) {
        setPackageAddress("");
        setModuleName("");
        setStructName("");
      }
      setIsAddingImport(false);
    }
  };

  // Handle import removal
  const handleRemoveImport = (
    pkgModulePath: string,
    structToRemove: string
  ) => {
    const newImports = { ...imports };
    if (newImports[pkgModulePath]) {
      // Remove the struct from the module
      if (newImports[pkgModulePath][structToRemove]) {
        delete newImports[pkgModulePath][structToRemove];
      }
      // If no more structs in the module, remove the module
      if (Object.keys(newImports[pkgModulePath]).length === 0) {
        delete newImports[pkgModulePath];
      }
      setImports(newImports);
    }
  };

  return (
    <div className="mt-4">
      {/* Import list - only show if there are imports */}
      {Object.keys(imports).length > 0 ? (
        <div className="mb-4 space-y-2">
          {Object.entries(imports).map(([pkgModulePath, structs]) =>
            Object.keys(structs).map((structName) => (
              <div
                key={`${pkgModulePath}::${structName}`}
                className="flex items-center justify-between bg-gray-700 rounded-md p-2 text-sm"
              >
                <div className="font-mono">
                  {pkgModulePath}::{structName}
                </div>
                <button
                  onClick={() => handleRemoveImport(pkgModulePath, structName)}
                  className="text-red-400 hover:text-red-300"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="mb-4 text-gray-400 italic text-center py-2 bg-gray-700 rounded-md">
          No imports added yet
        </div>
      )}

      {/* Import add button */}
      {!isAddingImport ? (
        <div className="flex justify-center mt-2">
          <button
            onClick={() => setIsAddingImport(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center justify-center w-full"
          >
            <span className="text-xl mr-1">+</span> Import 추가
          </button>
        </div>
      ) : (
        <div className="mt-2 bg-gray-700 rounded-md p-3">
          <form onSubmit={handleAddImport}>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-300">Package</label>
                <select
                  value={selectedPackage}
                  onChange={(e) => setSelectedPackage(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 mt-1 text-white"
                  required
                >
                  {commonPackages.map((pkg) => (
                    <option key={pkg.address} value={pkg.address}>
                      {pkg.name} ({pkg.address})
                    </option>
                  ))}
                </select>
              </div>
              {isCustomPackage ? (
                <div>
                  <label className="text-sm text-gray-300">
                    Custom Package Address
                  </label>
                  <input
                    type="text"
                    value={packageAddress}
                    onChange={(e) => setPackageAddress(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 mt-1 text-white"
                    placeholder="0x..."
                    required
                  />
                </div>
              ) : null}
              <div>
                <label className="text-sm text-gray-300">Module</label>
                {!isCustomPackage && availableModules.length > 0 ? (
                  <select
                    value={moduleName}
                    onChange={(e) => setModuleName(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 mt-1 text-white"
                    required
                  >
                    {availableModules.map((mod) => (
                      <option key={mod} value={mod}>
                        {mod}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={moduleName}
                    onChange={(e) => setModuleName(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 mt-1 text-white"
                    placeholder="module_name"
                    required
                  />
                )}
              </div>
              <div>
                <label className="text-sm text-gray-300">Struct</label>
                {!isCustomPackage && availableStructs.length > 0 ? (
                  <select
                    value={structName}
                    onChange={(e) => setStructName(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 mt-1 text-white"
                    required
                  >
                    {availableStructs.map((struct) => (
                      <option key={struct} value={struct}>
                        {struct}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={structName}
                    onChange={(e) => setStructName(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 mt-1 text-white"
                    placeholder="StructName"
                    required
                  />
                )}
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingImport(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
