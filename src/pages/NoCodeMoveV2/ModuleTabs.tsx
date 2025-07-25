import { TabsList } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { SuiMovePackageContext } from "@/context/SuiMovePackageContext";
import ModuleNameCard from "./ModuleNameCard";

interface Props {
  currentTab: string;
  setCurrentTab: React.Dispatch<React.SetStateAction<string>>;
}

export default function ModuleTabs({ currentTab, setCurrentTab }: Props) {
  const [inputValue, setInputValue] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [moduleNames, setModuleNames] = useState<string[]>([]);

  const { suiMovePackageData, setSuiMovePackageData } = useContext(
    SuiMovePackageContext
  );

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    // 일단 보류
    if (moduleNames.length > 0) {
      setCurrentTab(moduleNames[moduleNames.length - 1]);
    }
  }, [moduleNames]);

  useEffect(() => {
    setModuleNames([...suiMovePackageData.keys()]);
  }, [suiMovePackageData]);

  return (
    <TabsList
      className="p-2 h-14 gap-2 bg-neutral-500 rounded-sm"
      defaultValue={currentTab}
    >
      {moduleNames.length === 0 ? (
        <div
          className=" cursor-pointer text-white text-2xl min-w-80 rounded-md text-center"
          onClick={() => {
            setIsEditing((prev) => !prev);
          }}
        >
          Create New Module
        </div>
      ) : (
        moduleNames.map((moduleName, index) => (
          <ModuleNameCard
            moduleName={moduleName}
            index={index}
            setCurrentTab={setCurrentTab}
          />
        ))
      )}

      {/* Add New Module Button & Input */}
      <div className="relative ">
        <Button
          className="cursor-pointer"
          variant={"default"}
          onClick={() => {
            setIsEditing((prev) => !prev);
          }}
        >
          <Plus />
        </Button>
        {isEditing && (
          <Input
            className="absolute w-50 h-10 bg-white border-2 border-black rounded-sm"
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
                  if (
                    [...prev.keys()].includes(inputValue) ||
                    !inputValue.trim()
                  )
                    return prev;

                  const newMap = new Map(prev);
                  newMap.set(inputValue, {
                    imports: {},
                    structs: new Map(),
                    functions: new Map(),
                  });
                  return newMap;
                });

                setInputValue("");
                setIsEditing(false);
              } else if (e.key === "Escape") {
                setIsEditing(false);
                setInputValue("");
              }
            }}
          />
        )}
      </div>
    </TabsList>
  );
}
