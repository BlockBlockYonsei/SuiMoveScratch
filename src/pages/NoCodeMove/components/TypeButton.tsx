import {
  SuiMoveAbilitySet,
  SuiMoveNormalizedFunction,
  SuiMoveNormalizedStruct,
  SuiMoveNormalizedType,
  SuiMoveStructTypeParameter,
} from "@mysten/sui/client";
import { useEffect, useRef, useState } from "react";
import TypeModal from "./TypeModal";

export default function TypeButton({
  imports,
  structs,
  typeParameters,
  type,
  setType,
}: {
  imports: Record<
    string,
    Record<
      string,
      SuiMoveNormalizedStruct | Record<string, SuiMoveNormalizedFunction>
    >
  >;
  structs: Record<string, SuiMoveNormalizedStruct>;
  typeParameters: SuiMoveStructTypeParameter[] | SuiMoveAbilitySet[]; // strudt or function
  type: SuiMoveNormalizedType;
  setType: (arg0: SuiMoveNormalizedType) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 바깥 클릭 감지 로직
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // 만약 ref로 감싸진 영역 외부를 클릭하면
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block">
      <button
        onKeyDown={(e) => {
          if (e.key === "Escape") setIsOpen(false);
        }}
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
        className="border-2 border-black cursor-pointer rounded-md"
      >
        {typeof type === "string"
          ? type
          : "Struct" in type
          ? type.Struct.name
          : "Unknown Type"}
      </button>
      <div className={`${isOpen ? "" : "hidden"} `} ref={containerRef}>
        <TypeModal
          imports={imports}
          structs={structs}
          typeParameters={typeParameters}
          setType={setType}
          setIsOpen={setIsOpen}
        />
      </div>
    </div>
  );
}
