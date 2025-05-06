import { SuiMoveNormalizedFunction } from "@mysten/sui/client";
import FunctionCard from "./functions/FunctionCard";
import AddButton from "./components/AddButton";
import { FunctionsProps, SuiMoveFunction } from "@/pages/NoCodeMove/types";

export default function Functions({
  imports,
  structs,
  functions,
  setFunctions,
}: FunctionsProps) {
  // const addFunction = (name: string) => {
  //   const newFunction: SuiMoveNormalizedFunction = {
  //     isEntry: false,
  //     parameters: [],
  //     return: [],
  //     typeParameters: [],
  //     visibility: "Private",
  //   };
  //   const newSuiMoveFunction: SuiMoveFunction = {
  //     function: newFunction,
  //     insideCode: [],
  //   };

  //   setFunctions((prev) => ({
  //     ...prev,
  //     [name]: newSuiMoveFunction,
  //   }));
  // };

  return (
    <div>
      <div className="bg-white p-4 rounded-xl border-2 border-black">
        {/* Function 제목 및 Function 추가 버튼 */}
        <div className="flex items-center gap-4 py-2">
          <h2 className="inline-block bg-gray-200 text-3xl">Function</h2>
          <AddButton
            buttonClass="bg-blue-500 text-white px-4 py-2 my-2 rounded-xl cursor-pointer hover:bg-blue-600 transition"
            title="Function 추가"
            placeholder="Function Name을 입력하세요"
            callback={(name: string) => {
              const newFunction: SuiMoveNormalizedFunction = {
                isEntry: false,
                parameters: [],
                return: [],
                typeParameters: [],
                visibility: "Private",
              };
              const newSuiMoveFunction: SuiMoveFunction = {
                function: newFunction,
                insideCode: {},
              };

              setFunctions((prev) => ({
                ...prev,
                [name]: newSuiMoveFunction,
              }));
            }}
          />
        </div>

        {/* FunctionCard 하나씩 보여주는 곳 */}
        {Object.entries(functions).map(([functionName, functionData]) => {
          return (
            <div
              key={functionName}
              className="border p-4 mb-6 rounded-lg shadow-md"
            >
              <FunctionCard
                functionName={functionName}
                functionData={functionData}
                imports={imports}
                structs={structs}
                functions={functions}
                setFunctions={setFunctions}
              ></FunctionCard>
            </div>
          );
        })}
      </div>
    </div>
  );
}
