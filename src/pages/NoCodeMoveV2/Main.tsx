import { SideBarEditor } from "@/pages/NoCodeMoveV2/SideBarEditor";
import MainScreen from "@/pages/NoCodeMoveV2/MainScreen";
import { SuiMoveModuleProvider } from "@/context/SuiMoveModuleContext";
import { useEffect, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Main() {
  const [currentTab, setCurrentTab] = useState("");
  const [moduleNames, setModuleNames] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [menu, setMenu] = useState<
    "imports" | "structs" | "functions" | "code"
  >("imports");

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    if (moduleNames.length > 0) {
      setCurrentTab(moduleNames[moduleNames.length - 1]);
    }
  }, [moduleNames]);

  useEffect(() => {
    const handleBeforeUnload = (e: any) => {
      e.preventDefault();
      e.returnValue = ""; // 일부 브라우저에서는 이 설정이 필수
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-200">
      <div className="flex ">
        <SideBarEditor menu={menu} setMenu={setMenu} />
        <Tabs
          onValueChange={setCurrentTab}
          value={currentTab}
          className="flex-1 p-4"
        >
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
              moduleNames.map((moduleName) => (
                <div className="min-w-20 h-full">
                  <TabsTrigger
                    className="w-full bg-pink-300 rounded-sm cursor-pointer"
                    value={moduleName}
                  >
                    {moduleName}
                  </TabsTrigger>
                </div>
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
                    const onlyAlphabet = e.target.value.replace(
                      /[^a-zA-Z0-9_]/g,
                      ""
                    );
                    setInputValue(onlyAlphabet.toLowerCase());
                  }}
                  onBlur={() => {
                    setIsEditing(false);
                    setInputValue("");
                  }}
                  placeholder="Type New Module Name"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setModuleNames((prev) => {
                        if (prev.includes(inputValue) || !inputValue.trim())
                          return prev;
                        return [...prev, inputValue];
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

          {moduleNames.map((m) => (
            <div
              key={m}
              hidden={m !== currentTab}
              className="bg-gray-50 rounded-md p-2"
            >
              <SuiMoveModuleProvider>
                <MainScreen menu={menu} />
              </SuiMoveModuleProvider>
            </div>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
