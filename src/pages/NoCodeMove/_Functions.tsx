import {
  SuiMoveNormalizedFunction,
  SuiMoveNormalizedStruct,
} from "@mysten/sui/client";
import FunctionCard from "./functions/FunctionCard";
import AddButton from "./components/AddButton";

export interface SuiMoveFunction {
  function: SuiMoveNormalizedFunction;
  insideCode: string[];
}

interface Props {
  functions: Record<string, SuiMoveFunction>;
  setFunctions: React.Dispatch<
    React.SetStateAction<Record<string, SuiMoveFunction>>
  >;
  imports: Record<string, Record<string, SuiMoveNormalizedStruct>>;
  structs: Record<string, SuiMoveNormalizedStruct>;
}

export default function Functions({
  functions,
  setFunctions,
  imports,
  structs,
}: Props) {
  const addFunction = (name: string) => {
    const newSuiMoveFunction = newEmptySuiMoveFunction();

    setFunctions((prev) => ({
      ...prev,
      [name]: newSuiMoveFunction,
    }));
  };

  return (
    <div>
      <div className="bg-white p-4 rounded-xl border-2 border-black">
        <div className="flex items-center gap-4 py-2">
          <div className="inline-block bg-gray-200 text-3xl">Function</div>
          <AddButton
            buttonClass="bg-blue-500 text-white px-4 py-2 my-2 rounded-xl cursor-pointer hover:bg-blue-600 transition"
            title="Function 추가"
            placeholder="Function Name을 입력하세요"
            callback={addFunction}
          />
        </div>

        {/* Functions 하나씩 보여주는 곳 */}
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
                setFunctions={setFunctions}
              ></FunctionCard>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function newEmptySuiMoveFunction() {
  const CURRENT_PACKAGE = "0x0";

  const CURRENT_MODULE = "CurrentModule";

  const newFunction: SuiMoveNormalizedFunction = {
    isEntry: false,
    parameters: [],
    return: [],
    typeParameters: [],
    visibility: "Private",
  };
  const newSuiMoveFunction: SuiMoveFunction = {
    function: newFunction,
    insideCode: [],
  };

  return newSuiMoveFunction;
}
