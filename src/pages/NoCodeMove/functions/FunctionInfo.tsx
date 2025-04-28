import { SuiMoveVisibility } from "@mysten/sui/client";
import { SuiMoveFunction } from "../_Functions";

interface Props {
  functionName: string;
  functionData: SuiMoveFunction;
  setFunctions: React.Dispatch<
    React.SetStateAction<Record<string, SuiMoveFunction>>
  >;
}
export default function FunctionInfo({
  functionName,
  functionData,
  setFunctions,
}: Props) {
  return (
    <div className="flex gap-2 text-xl font-semibold">
      <div className="">
        <select
          id="entry"
          name="entry"
          className="border-2 border-black p-1 rounded-md"
          onChange={(e) => {
            const isEntry = e.target.value === "entry";
            let newFunctionData = functionData;
            newFunctionData.function.isEntry = isEntry;
            setFunctions((prev) => ({
              ...prev,
              [functionName]: newFunctionData,
            }));
          }}
        >
          <option value="entry">Entry</option>
          <option value="non-entry">-</option>
        </select>
        <select
          id="visibility"
          name="visibility"
          className="text-pink-500 border-2 border-black p-1 rounded-md"
          onChange={(e) => {
            let newFunctionData = functionData;
            newFunctionData.function.visibility = e.target
              .value as SuiMoveVisibility;
            setFunctions((prev) => ({
              ...prev,
              [functionName]: newFunctionData,
            }));
          }}
        >
          <option value="Private">Private</option>
          <option value="Friend">Friend</option>
          <option value="Public">Public</option>
        </select>
        <span className="text-blue-700 border-2 border-black p-1 rounded-md">
          fun
        </span>
        <span className="border-2 border-black p-1 rounded-md">
          {functionName}
        </span>
      </div>
    </div>
  );
}
