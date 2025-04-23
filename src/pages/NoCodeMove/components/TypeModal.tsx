import {
  SuiMoveAbilitySet,
  SuiMoveNormalizedStruct,
  SuiMoveNormalizedType,
  SuiMoveStructTypeParameter,
} from "@mysten/sui/client";

export default function TypeModal({
  imports,
  structs,
  typeParameters,
  setType,
}: {
  imports: Record<string, Record<string, SuiMoveNormalizedStruct>>;
  structs: Record<string, SuiMoveNormalizedStruct>;
  typeParameters: SuiMoveStructTypeParameter[] | SuiMoveAbilitySet[]; // strudt or function
  setType: (arg0: SuiMoveNormalizedType) => void;
}) {
  const PRIMITIVE_TYPES: SuiMoveNormalizedType[] = [
    "Bool",
    "U8",
    "U16",
    "U32",
    "U64",
    "U128",
    "U256",
    "Address",
    "Signer",
  ];

  const groupedByPackage = Object.entries(imports).reduce(
    (acc, [fullModuleName, importedStruct]) => {
      const [packageAddress, moduleName] = fullModuleName.split("::");
      if (!acc[packageAddress]) acc[packageAddress] = {};
      acc[packageAddress][moduleName] = importedStruct;

      return acc;
    },
    {} as Record<
      string,
      Record<string, Record<string, SuiMoveNormalizedStruct>>
    >
  );

  return (
    <div
      className={`absolute left-0 p-4 mt-2 w-96 z-50 bg-white rounded-xl shadow overflow-auto min-h-48 max-h-64`}
    >
      <div className="w-48 bg-white border rounded-xl shadow-lg z-10 relative group">
        <h3 className="px-4 py-2 hover:bg-blue-100 cursor-pointer rounded-xl transition">
          Primitive Type
        </h3>
        <ul className="absolute left-full top-0 w-40 bg-white border rounded-xl shadow-lg hidden group-hover:block z-20">
          {PRIMITIVE_TYPES.map((type) => (
            <li
              key={type.toString()}
              onClick={() => {
                setType(type);
              }}
              className="px-4 py-2 text-emerald-500 hover:bg-blue-50 cursor-pointer transition"
            >
              {type.toString()}
            </li>
          ))}
        </ul>
      </div>
      <div className="w-48 bg-white border rounded-xl shadow-lg z-10 relative group ">
        <div className="px-4 py-2 hover:bg-blue-100 cursor-pointer rounded-xl transition">
          Type Parameters
        </div>
        <ul className="absolute left-full top-0 w-40 bg-white border rounded-xl shadow-lg hidden group-hover:block z-20">
          {typeParameters.map((type, i) => (
            <li
              key={i}
              onClick={() => {
                const type = {
                  Struct: {
                    address: "0x0",
                    module: "currentModule",
                    name: "T" + i,
                    typeArguments: [],
                  },
                };
                setType(type);
              }}
              className="px-4 py-2 text-emerald-500 hover:bg-blue-50 cursor-pointer transition"
            >
              {`T${i}`}
            </li>
          ))}
        </ul>
      </div>
      <div className="w-48 bg-white border rounded-xl shadow-lg z-10 relative group ">
        <div className="px-4 py-2 hover:bg-blue-100 cursor-pointer rounded-xl transition">
          Current Module Structs
        </div>
        <ul className="absolute left-full top-0 w-40 bg-white border rounded-xl shadow-lg hidden group-hover:block z-20">
          {Object.keys(structs).map((structName) => (
            <li
              key={structName}
              className="px-4 py-2 text-emerald-500 hover:bg-blue-50 cursor-pointer transition"
              onClick={() => {
                const type = {
                  Struct: {
                    address: "0x0",
                    module: "currentModule",
                    name: structName,
                    typeArguments: [],
                  },
                };
                setType(type);
              }}
            >
              {structName}
            </li>
          ))}
        </ul>
      </div>
      {Object.entries(groupedByPackage).map(([packageAddress, modules]) => {
        return (
          <div key={packageAddress}>
            <h3 className="text-lg font-bold mb-1">
              {packageAddress.slice(0, 4)}
              ...
              {packageAddress.slice(-3)} Package
            </h3>
            <div className="w-48 bg-white border rounded-xl shadow-lg z-10 ">
              {Object.entries(modules).map(([moduleName, importedTypes]) => (
                <div key={moduleName} className="relative group">
                  <div className="px-4 py-2 hover:bg-blue-100 cursor-pointer rounded-xl transition">
                    {moduleName}
                  </div>
                  <ul className="absolute left-full top-0 w-40 bg-white border rounded-xl shadow-lg hidden group-hover:block z-20">
                    {Object.keys(importedTypes).map((typeName) => (
                      <li
                        key={typeName}
                        onClick={() => {
                          const type = {
                            Struct: {
                              address: packageAddress,
                              module: moduleName,
                              name: typeName,
                              typeArguments: [],
                            },
                          };
                          setType(type);
                        }}
                        className="px-4 py-2 text-emerald-500 hover:bg-blue-50 cursor-pointer transition"
                      >
                        {typeName}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
