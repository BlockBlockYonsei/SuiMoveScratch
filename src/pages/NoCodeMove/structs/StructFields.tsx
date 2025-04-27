import {
  SuiMoveNormalizedField,
  SuiMoveNormalizedFunction,
  SuiMoveNormalizedStruct,
  SuiMoveNormalizedType,
} from "@mysten/sui/client";
import AddButton from "../components/AddButton";
import TypeButton from "../components/TypeButton";

interface Props {
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
      {structData.fields.map((field, _) => {
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
        };
        return (
          <div key={field.name}>
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
      })}
    </div>
  );
}
