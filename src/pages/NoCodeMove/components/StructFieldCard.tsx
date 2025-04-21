import {
  SuiMoveNormalizedField,
  SuiMoveNormalizedStruct,
  SuiMoveNormalizedType,
} from "@mysten/sui/client";
import { useState } from "react";

interface Props {
  key?: React.Key | null | undefined;
  imports: Record<string, Record<string, SuiMoveNormalizedStruct>>;
  structName: string;
  structData: SuiMoveNormalizedStruct;
  field: SuiMoveNormalizedField;
  setStructs: React.Dispatch<
    React.SetStateAction<Record<string, SuiMoveNormalizedStruct>>
  >;
}

export default function StructFieldCard({
  key,
  imports,
  structName,
  structData,
  field,
  setStructs,
}: Props) {
  // const [isOpen, setIsOpen] = useState<{ [key: string]: boolean }>({});
  const [isOpen, setIsOpen] = useState(false);

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

  // const parsedType = parseSuiMoveNormalizedType(field.type);

  return (
    <div key={key}>
      <div className="relative">
        <span>{field.name}</span> :{" "}
        <button
          onClick={() => {
            setIsOpen((prev) => !prev);
          }}
          className="border-2 border-black cursor-pointer rounded-md"
        >
          {/* {typeof field.type === "string" ? field.type : field.type.Struct.name} */}
          {typeof field.type === "string"
            ? field.type
            : "Struct" in field.type
            ? field.type.Struct.name
            : "Unknown Type"}
        </button>
        {isOpen && (
          <div className="absolute left-0 p-4 mt-2 w-96 z-50 bg-white rounded-xl shadow overflow-auto min-h-48 max-h-64">
            <ul className="w-48 bg-white border rounded-xl shadow-lg z-10">
              <li className="relative group">
                <div className="px-4 py-2 hover:bg-blue-100 cursor-pointer rounded-xl transition">
                  Primitive Type
                </div>
                <ul className="absolute left-full top-0 w-40 bg-white border rounded-xl shadow-lg hidden group-hover:block z-20">
                  {PRIMITIVE_TYPES.map((type) => (
                    <li
                      key={type.toString()}
                      onClick={() => {
                        setIsOpen((prev) => !prev);

                        let newStructData = structData;
                        const targetField = newStructData.fields.find(
                          (f) => f.name === field.name
                        );
                        if (!targetField) return;

                        targetField.type = type;

                        setStructs((prev) => ({
                          ...prev,
                          [structName]: newStructData,
                        }));
                      }}
                      className="px-4 py-2 text-emerald-500 hover:bg-blue-50 cursor-pointer transition"
                    >
                      {type.toString()}
                      {/* {type.toString()} */}
                      {/* {JSON.stringify(type)} */}
                    </li>
                  ))}
                </ul>
              </li>

              {Object.entries(imports).map(([moduleName, importedStruct]) => (
                <li key={moduleName} className="relative group">
                  <div className="px-4 py-2 hover:bg-blue-100 cursor-pointer rounded-xl transition">
                    {moduleName.split("::")[1]}
                  </div>

                  <ul className="absolute left-full top-0 w-40 bg-white border rounded-xl shadow-lg hidden group-hover:block z-20">
                    {Object.entries(importedStruct).map(
                      ([importedStructName, importedStructData]) => (
                        <li
                          key={importedStructName}
                          onClick={() => {
                            // setIsOpen((prev) => !prev);

                            let newStructData = structData;
                            const targetField = newStructData.fields.find(
                              (f) => f.name === field.name
                            );
                            if (!targetField) return;

                            const [pkg, module] = moduleName.split("::");

                            targetField.type = {
                              Struct: {
                                address: pkg,
                                module: module,
                                name: importedStructName,
                                typeArguments: [],
                              },
                            };

                            setStructs((prev) => ({
                              ...prev,
                              [structName]: newStructData,
                            }));
                            setIsOpen((prev) => !prev);
                          }}
                          className="px-4 py-2 text-emerald-500 hover:bg-blue-50 cursor-pointer transition"
                        >
                          {importedStructName}
                          {/* {JSON.stringify(importedStructData)} */}
                        </li>
                      )
                    )}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
