import { SuiMoveNormalizedStruct } from "@mysten/sui/client";
import StructCard from "./structs/StructCard";
import { newEmptyStruct } from "./utils";
import AddButton from "./components/AddButton";

interface Props {
  structs: Record<string, SuiMoveNormalizedStruct>;
  setStructs: React.Dispatch<
    React.SetStateAction<Record<string, SuiMoveNormalizedStruct>>
  >;
  imports: Record<string, Record<string, SuiMoveNormalizedStruct>>;
}

export default function Structs({ structs, setStructs, imports }: Props) {
  const CURRENT_PACKAGE = "0x0";
  const CURRENT_MODULE = "CurrentModule";

  const addStruct = (name: string) => {
    const newStruct = newEmptyStruct();
    setStructs((prev) => ({
      ...prev,
      [name]: newStruct,
    }));
  };

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
            callback={addStruct}
          ></AddButton>
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
