import { useEffect, useRef, useState } from "react";

interface Props {
  buttonClass?: string;
  inputClass?: string;
  title: string;
  placeholder: string;
  callback: (name: string) => void;
}

export default function AddButton({
  buttonClass,
  inputClass,
  title,
  placeholder,
  callback,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsEditing(true)}
        className={`border-2 border-blue-500 px-2 my-2 rounded-md cursor-pointer hover:bg-blue-600 transition ${buttonClass}`}
      >
        ➕ {title}
      </button>
      <div
        className={`${
          isEditing ? "" : "hidden"
        } absolute px-3 py-2 bg-gray-200 rounded-md z-10 ${inputClass}`}
      >
        <input
          className={`focus:outline-none`}
          ref={inputRef}
          value={inputValue}
          placeholder={placeholder}
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
              callback(trimmed);
            } finally {
              setInputValue("");
              setIsEditing(false);
            }
          }}
        />
      </div>
    </div>
  );
}
