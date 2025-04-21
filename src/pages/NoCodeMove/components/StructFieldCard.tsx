import {
  SuiMoveNormalizedField,
  SuiMoveNormalizedStruct,
  SuiMoveNormalizedType,
} from "@mysten/sui/client";
import { useState } from "react";
import TypeModal from "./TypeModal";

interface Props {
  key?: React.Key | null | undefined;
  imports: Record<string, Record<string, SuiMoveNormalizedStruct>>;
  structs: Record<string, SuiMoveNormalizedStruct>;
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
  structs,
  structName,
  structData,
  setStructs,
  field,
}: Props) {
  // const [isOpen, setIsOpen] = useState<{ [key: string]: boolean }>({});
  const [isOpen, setIsOpen] = useState(false);

  const setType = (type: SuiMoveNormalizedType) => {
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
  };

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
        <div className={`${isOpen ? "" : "hidden"} `}>
          <TypeModal
            imports={imports}
            structs={structs}
            // typeParameters={[{ abilities: ["Copy"] }]}
            typeParameters={[]}
            setType={setType}
          ></TypeModal>
        </div>
      </div>
    </div>
  );
}
