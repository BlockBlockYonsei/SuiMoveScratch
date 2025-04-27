import {
  SuiMoveNormalizedFunction,
  SuiMoveNormalizedStruct,
} from "@mysten/sui/client";
import StructCard from "./structs/StructCard";
import AddButton from "./components/AddButton";

interface Props {
  imports: Record<
    string,
    Record<
      string,
      SuiMoveNormalizedStruct | Record<string, SuiMoveNormalizedFunction>
    >
  >;
  structs: Record<string, SuiMoveNormalizedStruct>;
  setStructs: React.Dispatch<
    React.SetStateAction<Record<string, SuiMoveNormalizedStruct>>
  >;
}

export default function Structs({ structs, setStructs, imports }: Props) {
  return (
    <div>
      <div className="bg-white p-4 rounded-xl border-2 border-black">
        {/* Struct 제목 및 Struct 추가 버튼 */}
        <div className="flex items-center gap-4 py-2">
          <h2 className="inline-block bg-gray-200 text-3xl">Struct</h2>
          <AddButton
            buttonClass="bg-blue-500 text-white px-4 py-2 my-2 rounded-xl cursor-pointer hover:bg-blue-600 transition"
            title="Struct 추가"
            placeholder="Struct Name을 입력하세요."
            callback={(name: string) => {
              const newStruct: SuiMoveNormalizedStruct = {
                abilities: {
                  abilities: [],
                },
                fields: [],
                typeParameters: [],
              };

              setStructs((prev) => ({
                ...prev,
                [name]: newStruct,
              }));
            }}
          />
        </div>

        {/* StructCard 하나씩 보여주는 곳 */}
        {Object.entries(structs).map(([key, value]) => {
          return (
            <StructCard
              key={key}
              structName={key}
              structData={value}
              structs={structs}
              setStructs={setStructs}
              imports={imports}
            ></StructCard>
          );
        })}
      </div>
    </div>
  );
}
