import { useEffect, useRef, useState } from "react";
import { SuiMoveFunction } from "../_Functions";

export default function FunctionTypeParameters({
  functionName,
  functionData,
  setFunctions,
  typeParameterNames,
  setTypeParameterNames,
}: {
  functionName: string;
  functionData: SuiMoveFunction;
  setFunctions: React.Dispatch<
    React.SetStateAction<Record<string, SuiMoveFunction>>
  >;
  typeParameterNames: string[];
  setTypeParameterNames: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const ABILITIES = ["Copy", "Drop", "Store", "Key"] as const;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div className="mb-2">
      <span className="font-bold">Type Parameters:</span>
      {!isEditing && (
        <span>
          <button
            onClick={() => setIsEditing(true)}
            className="border-2 border-blue-500 px-2 rounded-md cursor-pointer hover:bg-blue-600 transition"
          >
            ➕ 타입 파라미터 추가
          </button>
        </span>
      )}
      {functionData.function.typeParameters.map((t, i) => (
        <div key={i} className="font-semibold">
          <span>{`T${i}(${typeParameterNames[i]}): `}</span>
          {
            <span>
              {ABILITIES.map((a) => (
                <button
                  key={a}
                  onClick={() => {
                    let newFunctionData = functionData;
                    if (t.abilities.includes(a)) {
                      newFunctionData.function.typeParameters[i].abilities =
                        functionData.function.typeParameters[
                          i
                        ].abilities.filter((ability) => ability !== a);
                    } else {
                      newFunctionData.function.typeParameters[i].abilities.push(
                        a
                      );
                    }
                    setFunctions((prev) => ({
                      ...prev,
                      [functionName]: newFunctionData,
                    }));
                  }}
                  className={`border-2 border-black px-1 rounded-md cursor-pointer ${
                    t.abilities.includes(a) ? "bg-emerald-300" : ""
                  }`}
                >
                  {a}
                </button>
              ))}{" "}
            </span>
          }
        </div>
      ))}
      {isEditing && (
        <div>
          <input
            ref={inputRef}
            value={inputValue}
            placeholder="Type Parameter Name을 입력하세요."
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={() => {
              setInputValue("");
              setIsEditing(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                let newFunctionData = functionData;
                newFunctionData.function.typeParameters.push({ abilities: [] });
                const trimmed = inputValue.trim();
                if (trimmed) {
                  setFunctions((prev) => ({
                    ...prev,
                    [functionName]: newFunctionData,
                  }));
                  setTypeParameterNames((prev) => [...prev, trimmed]);
                }
                setInputValue("");
                setIsEditing(false);
              }
            }}
            className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}
