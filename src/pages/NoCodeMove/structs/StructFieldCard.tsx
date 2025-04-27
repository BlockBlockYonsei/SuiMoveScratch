import {
  SuiMoveNormalizedField,
  SuiMoveNormalizedFunction,
  SuiMoveNormalizedStruct,
  SuiMoveNormalizedType,
} from "@mysten/sui/client";
import { useState } from "react";
import TypeButton from "../components/TypeButton";

interface Props {
  key?: React.Key | null | undefined;
  imports: Record<
    string,
    Record<
      string,
      SuiMoveNormalizedStruct | Record<string, SuiMoveNormalizedFunction>
    >
  >;
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
      <span className="text-lg text-blue-500 font-semibold">
        {field.name}:{" "}
      </span>
      <TypeButton
        imports={imports}
        structs={structs}
        typeParameters={[]}
        setType={setType}
        type={field.type}
      />
    </div>
  );
}
