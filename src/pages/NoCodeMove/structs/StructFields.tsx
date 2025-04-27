import {
  SuiMoveNormalizedField,
  SuiMoveNormalizedStruct,
} from "@mysten/sui/client";
import StructFieldCard from "./StructFieldCard";
import AddButton from "../components/AddButton";

interface Props {
  imports: Record<string, Record<string, SuiMoveNormalizedStruct>>;
  structs: Record<string, SuiMoveNormalizedStruct>; // 여긴 필요 없고, StructFieldCards에서 필요
  structName: string;
  structData: SuiMoveNormalizedStruct;
  setStructs: React.Dispatch<
    React.SetStateAction<Record<string, SuiMoveNormalizedStruct>>
  >;
}

export default function StructFields({
  imports,
  structs,
  structName,
  structData,
  setStructs,
}: Props) {
  const addStructField = (name: string) => {
    if (structData.fields.some((field) => field.name === name)) return;

    const newField: SuiMoveNormalizedField = {
      name: name,
      type: "U64",
    };
    const newStructData = {
      ...structData,
      fields: [...structData.fields, newField],
    };
    setStructs((prev) => ({
      ...prev,
      [structName]: newStructData,
    }));
  };

  return (
    <div>
      <AddButton
        title="필드 추가"
        placeholder="Filed Name을 입력하세요"
        callback={addStructField}
      />

      {/* 필드 보여주는 곳 */}
      {structData.fields.map((field, _) => (
        <StructFieldCard
          key={field.name}
          imports={imports}
          structs={structs}
          structName={structName}
          structData={structData}
          setStructs={setStructs}
          field={field}
        ></StructFieldCard>
      ))}
    </div>
  );
}
