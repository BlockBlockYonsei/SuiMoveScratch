import { SuiMoveNormalizedStruct, SuiMoveVisibility } from "@mysten/sui/client";
import { SuiMoveFunction } from "../_Functions";
import { useEffect, useRef, useState } from "react";
import FunctionTypeParameters from "./FunctionTypeParameters";
import FunctionParameters, {
  FunctionParameterCard,
} from "./FunctionParameters";
import FunctionReturns from "./FunctionReturns";

interface Props {
  functionName: string;
  functionData: SuiMoveFunction;
  setFunctions: React.Dispatch<
    React.SetStateAction<Record<string, SuiMoveFunction>>
  >;
  imports: Record<string, Record<string, SuiMoveNormalizedStruct>>;
  structs: Record<string, SuiMoveNormalizedStruct>;
}

export default function FunctionCard({
  functionName,
  functionData,
  setFunctions,
  imports,
  structs,
}: Props) {
  const [typeParameterNames, setTypeParameterNames] = useState<string[]>([]);
  const [parameterNames, setParameterNames] = useState<string[]>([]);
  return (
    <div>
      {/* Function Info */}
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
      <FunctionTypeParameters
        functionName={functionName}
        functionData={functionData}
        setFunctions={setFunctions}
        typeParameterNames={typeParameterNames}
        setTypeParameterNames={setTypeParameterNames}
      />

      {/* Function Parameter */}
      <div className="font-bold">Parameters:</div>
      <FunctionParameters
        functionName={functionName}
        functionData={functionData}
        imports={imports}
        structs={structs}
        setFunctions={setFunctions}
        parameterNames={parameterNames}
        setParameterNames={setParameterNames}
      />

      {/* Return : 이것도 Function Card 에 넣어야 함 */}
      <div className="font-bold">Returns:</div>
      <FunctionReturns
        functionName={functionName}
        functionData={functionData}
        imports={imports}
        structs={structs}
        setFunctions={setFunctions}
      />
      {/* <div>&#125;</div> */}
    </div>
  );
}

// function FunctionReturns({
//   functionName,
//   functionData,
//   imports,
//   structs,
//   setFunctions,
// }: {
//   functionName: string;
//   functionData: SuiMoveFunction;
//   imports: Record<string, Record<string, SuiMoveNormalizedStruct>>;
//   structs: Record<string, SuiMoveNormalizedStruct>;
//   setFunctions: React.Dispatch<
//     React.SetStateAction<Record<string, SuiMoveFunction>>
//   >;
// }) {
//   const [isEditing, setIsEditing] = useState(false);
//   const [inputValue, setInputValue] = useState("");
//   const [params, setParams] = useState<Record<string, string>>({});
//   const inputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (isEditing && inputRef.current) {
//       inputRef.current.focus();
//     }
//   }, [isEditing]);

//   return (
//     <div>
//       <div>
//         <span className="font-bold">Returns:</span>
//         {!isEditing && (
//           <span>
//             <button
//               onClick={() => setIsEditing(true)}
//               className="border-2 border-blue-500 px-2 rounded-md cursor-pointer hover:bg-blue-600 transition"
//             >
//               ➕ 리턴 추가
//             </button>
//           </span>
//         )}
//       </div>
//       {functionData.function.return.map((param, index) => (
//         <div key={param.toString()}>
//           <FunctionParameterCard
//             index={index}
//             param={param}
//             typeParameters={functionData.function.typeParameters}
//             imports={imports}
//             structs={structs}
//             functionName={functionName}
//             functionData={functionData}
//             setFunctions={setFunctions}
//             parameterNames={[]}
//             // setParams={setParams}
//           />
//         </div>
//       ))}
//       {isEditing && (
//         <div>
//           <input
//             ref={inputRef}
//             value={inputValue}
//             placeholder="Return Name을 입력하세요."
//             onChange={(e) => setInputValue(e.target.value)}
//             onBlur={() => {
//               setInputValue("");
//               setIsEditing(false);
//             }}
//             onKeyDown={(e) => {
//               if (e.key === "Enter") {
//                 const trimmed = inputValue.trim();
//                 if (trimmed) {
//                   setParams((prev) => ({
//                     ...prev,
//                     [trimmed]: "U64",
//                   }));
//                 }
//                 setInputValue("");
//                 setIsEditing(false);
//               }
//             }}
//             className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none"
//           />
//         </div>
//       )}
//     </div>
//   );
// }
