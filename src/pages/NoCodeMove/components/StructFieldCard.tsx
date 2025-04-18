import { SuiMoveNormalizedStruct } from "@mysten/sui/client";
import { useState } from "react";

export default function StructFieldCard({
  name,
  type,
  imports,
  setFields,
}: {
  name: string;
  type: string;
  imports: Record<string, Record<string, SuiMoveNormalizedStruct>>;
  setFields: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) {
  // const [isOpen, setIsOpen] = useState<{ [key: string]: boolean }>({});
  const [isOpen, setIsOpen] = useState(false);

  const PRIMITIVE_TYPES = [
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

  return (
    <div>
      <div className="relative" key={name}>
        <span>{name}</span> :{" "}
        <button
          onClick={() => {
            setIsOpen((prev) => !prev);
          }}
          className="border-2 border-black cursor-pointer rounded-md"
        >
          {type}
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
                      key={type}
                      onClick={() => {
                        setFields((prev) => ({
                          ...prev,
                          [name]: type,
                        }));
                        setIsOpen((prev) => !prev);
                      }}
                      className="px-4 py-2 text-emerald-500 hover:bg-blue-50 cursor-pointer transition"
                    >
                      {type}
                    </li>
                  ))}
                </ul>
              </li>

              {Object.entries(imports).map(([moduleName, structData]) => (
                <li key={moduleName} className="relative group">
                  <div className="px-4 py-2 hover:bg-blue-100 cursor-pointer rounded-xl transition">
                    {moduleName}
                  </div>

                  <ul className="absolute left-full top-0 w-40 bg-white border rounded-xl shadow-lg hidden group-hover:block z-20">
                    {Object.keys(structData).map((structName) => (
                      <li
                        key={structName}
                        onClick={() => {
                          setFields((prev) => ({
                            ...prev,
                            [name]: structName,
                          }));
                          setIsOpen((prev) => !prev);
                        }}
                        className="px-4 py-2 text-emerald-500 hover:bg-blue-50 cursor-pointer transition"
                      >
                        {structName}
                      </li>
                    ))}
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
