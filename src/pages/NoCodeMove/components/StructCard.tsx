import { SuiMoveNormalizedStruct } from "@mysten/sui/client";
import { useEffect, useRef, useState } from "react";
import StructFieldCard from "./StructFieldCard";

interface Props {
  structName: string;
  structData: SuiMoveNormalizedStruct;
  setStructs: React.Dispatch<
    React.SetStateAction<Record<string, SuiMoveNormalizedStruct>>
  >;
  imports: Record<string, Record<string, SuiMoveNormalizedStruct>>;
}

export default function StructCard({
  structName,
  structData,
  setStructs,
  imports,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [fields, setFields] = useState<Record<string, string>>({});
  const inputRef = useRef<HTMLInputElement>(null);

  const ABILITIES = ["Copy", "Drop", "Store", "Key"] as const;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div>
      <div>
        public struct{" "}
        <span className="text-emerald-500 font-semibold">{structName}</span>{" "}
        {
          <span>
            {ABILITIES.map((a) => (
              <button
                key={a}
                onClick={() => {
                  let newStructData = structData;
                  if (structData.abilities.abilities.includes(a)) {
                    newStructData.abilities.abilities =
                      structData.abilities.abilities.filter(
                        (ability) => ability !== a
                      );
                  } else {
                    newStructData.abilities.abilities.push(a);
                  }

                  setStructs((prev) => ({
                    ...prev,
                    [structName]: newStructData,
                  }));
                }}
                className={`border-2 border-black px-1 rounded-md cursor-pointer ${
                  structData.abilities.abilities.includes(a)
                    ? "bg-emerald-300"
                    : ""
                }`}
              >
                {a}
              </button>
            ))}{" "}
          </span>
        }
        &#123;
        {!isEditing && (
          <span>
            <button
              onClick={() => setIsEditing(true)}
              className="border-2 border-blue-500 px-2 rounded-md cursor-pointer hover:bg-blue-600 transition"
            >
              ➕ 필드 추가
            </button>
          </span>
        )}
      </div>
      {/* {Object.entries(fields).map(([name, type]) => ( */}
      {structData.fields.map((field, i) => (
        <div key={field.name}>
          <StructFieldCard
            // name={field.name}
            // type={field.type}
            field={field}
            structName={structName}
            structData={structData}
            imports={imports}
            setStructs={setStructs}
          ></StructFieldCard>
        </div>
      ))}
      {isEditing && (
        <div>
          <input
            ref={inputRef}
            value={inputValue}
            placeholder="Field Name을 입력하세요."
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={() => {
              setInputValue("");
              setIsEditing(false);
            }}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;

              try {
                const trimmed = inputValue.trim();
                if (!trimmed) return;

                if (structData.fields.some((field) => field.name === trimmed))
                  return;

                let newStructData = structData;
                newStructData.fields.push({ name: trimmed, type: "U64" });
                setStructs((prev) => ({
                  ...prev,
                  [structName]: newStructData,
                }));
              } finally {
                setInputValue("");
                setIsEditing(false);
              }
            }}
            className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none"
          />
        </div>
      )}
      <div>&#125;</div>
    </div>
  );
}
