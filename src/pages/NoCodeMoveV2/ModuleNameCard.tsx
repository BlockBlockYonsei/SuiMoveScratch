import { TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useContext, useEffect, useRef, useState } from "react";
import { SuiMovePackageContext } from "@/context/SuiMovePackageContext";
import { Button } from "@/components/ui/button";

interface Props {
  moduleName: string;
  index: number;
  setCurrentTab: React.Dispatch<React.SetStateAction<string>>;
}

export default function ModuleNameCard({
  moduleName,
  index,
  setCurrentTab,
}: Props) {
  const [inputValue, setInputValue] = useState("");
  // const [inputValue2, setInputValue2] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // const [moduleNames, setModuleNames] = useState<string[]>([]);

  const { suiMovePackageData, setSuiMovePackageData } = useContext(
    SuiMovePackageContext
  );

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div className="min-w-20 h-full flex">
      <TabsTrigger
        className="w-full relative group bg-pink-300 rounded-sm cursor-pointer"
        value={moduleName}
      >
        <div>{moduleName}</div>
        <Button
          className="cursor-pointer hidden group-hover:block absolute top-8"
          onClick={() => {
            setIsEditing(true);
          }}
        >
          Edit
        </Button>
        {isEditing && (
          <Input
            className="absolute top-12 left-0 w-50 h-10 bg-white border-2 border-black rounded-sm"
            ref={inputRef}
            value={inputValue}
            onChange={(e) => {
              const raw = e.target.value;
              if (raw.length > 0 && /^[\d_]/.test(raw)) {
                return; // 첫 글자가 숫자거나 _면 무시
              }
              const onlyAlphabet = e.target.value.replace(/[^a-zA-Z0-9_]/g, "");
              setInputValue(onlyAlphabet.toLowerCase());
            }}
            onBlur={() => {
              setIsEditing(false);
              setInputValue("");
            }}
            placeholder="Type New Module Name"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSuiMovePackageData((prev) => {
                  const newMap = new Map();
                  if (
                    [...prev.keys()].includes(inputValue) ||
                    !inputValue.trim()
                  )
                    return prev;

                  [...prev.entries()].forEach(([name, data], i) => {
                    if (index === i) {
                      newMap.set(inputValue, data);
                    } else {
                      newMap.set(name, data);
                    }
                  });
                  return newMap;
                });

                setCurrentTab(inputValue);
                setIsEditing(false);
              } else if (e.key === "Escape") {
                setIsEditing(false);
                setInputValue("");
              }
            }}
          />
        )}
      </TabsTrigger>
    </div>
  );
}
