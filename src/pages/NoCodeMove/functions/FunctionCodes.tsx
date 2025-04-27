import {
  SuiMoveNormalizedFunction,
  SuiMoveNormalizedStruct,
} from "@mysten/sui/client";
import { SuiMoveFunction } from "../_Functions";

interface Props {
  imports: Record<
    string,
    Record<
      string,
      SuiMoveNormalizedStruct | Record<string, SuiMoveNormalizedFunction>
    >
  >;
  structs: Record<string, SuiMoveNormalizedStruct>;
  functionName: string;
  functionData: SuiMoveFunction;
  setFunctions: React.Dispatch<
    React.SetStateAction<Record<string, SuiMoveFunction>>
  >;
}

export default function FunctionCodes({ functionData }: Props) {
  return (
    <div className="border-2 border-black rounded-md p-2">
      <div>let value = 30;</div>
      <input value={"let value = 30;"} />
      {functionData.insideCode.map((c) => (
        <div>{c}</div>
      ))}
    </div>
  );
}
