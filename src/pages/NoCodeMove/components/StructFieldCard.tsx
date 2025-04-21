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
  setStructs: React.Dispatch<
    React.SetStateAction<Record<string, SuiMoveNormalizedStruct>>
  >;
  field: SuiMoveNormalizedField;
}

export default function StructFieldCard({
  key,
  imports,
  structName,
  structData,
  setStructs,
  field,
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
    <div key={key}>
      <div className="relative">
        <span className="text-lg text-blue-500 font-semibold">
          {field.name}:{" "}
        </span>
        <button
          onKeyDown={(e) => {
            if (e.key === "Escape") setIsOpen(false);
          }}
          onClick={() => {
            setIsOpen((prev) => !prev);
          }}
          className="border-2 border-black cursor-pointer rounded-md"
        >
          {typeof field.type === "string"
            ? field.type
            : "Struct" in field.type
            ? field.type.Struct.name
            : "Unknown Type"}
        </button>

        {/* 클릭시 나오는 모달 */}
        <div
          className={`${
            isOpen ? "" : "hidden"
          } absolute left-0 p-4 mt-2 w-96 z-50 bg-white rounded-xl shadow overflow-auto min-h-48 max-h-64`}
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
                    const updatedFields = structData.fields.map((f) =>
                      f.name === field.name ? { name: field.name, type } : f
                    );
                    const newStructData = {
                      ...structData,
                      fields: updatedFields,
                    };
                    setStructs((prev) => ({
                      ...prev,
                      [structName]: newStructData,
                    }));
                    setIsOpen((prev) => !prev);
                  }}
                  className="px-4 py-2 text-emerald-500 hover:bg-blue-50 cursor-pointer transition"
                >
                  {type.toString()}
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
                  {Object.entries(modules).map(
                    ([moduleName, importedTypes]) => (
                      <div key={moduleName} className="relative group">
                        <div className="px-4 py-2 hover:bg-blue-100 cursor-pointer rounded-xl transition">
                          {moduleName}
                        </div>
                        <ul className="absolute left-full top-0 w-40 bg-white border rounded-xl shadow-lg hidden group-hover:block z-20">
                          {Object.keys(importedTypes).map((typeName) => (
                            <li
                              key={typeName}
                              onClick={() => {
                                const updatedFields = structData.fields.map(
                                  (f) =>
                                    f.name === field.name
                                      ? {
                                          name: field.name,
                                          type: {
                                            Struct: {
                                              address: packageAddress,
                                              module: moduleName,
                                              name: typeName,
                                              typeArguments: [],
                                            },
                                          },
                                        }
                                      : f
                                );
                                const newStructData = {
                                  ...structData,
                                  fields: updatedFields,
                                };

                                setStructs((prev) => ({
                                  ...prev,
                                  [structName]: newStructData,
                                }));
                                setIsOpen((prev) => !prev);
                              }}
                              className="px-4 py-2 text-emerald-500 hover:bg-blue-50 cursor-pointer transition"
                            >
                              {typeName}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
