import { useState, useRef, useEffect } from "react";

interface Props {
  defaultValue: string;
  onUpdate: (name: string) => boolean;
}

function EditableInput({
  defaultValue,
  onUpdate,
  ...props
}: React.ComponentProps<"input"> & Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof defaultValue === "string") {
      setValue(defaultValue);
    }
  }, [defaultValue]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div>
      {isEditing ? (
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw.length > 0 && /^[\d_]/.test(raw)) {
              return; // 첫 글자가 숫자거나 _면 무시
            }
            const onlyAlphabet = e.target.value.replace(/[^a-zA-Z0-9_]/g, "");
            setValue(onlyAlphabet.toLowerCase());
          }}
          onBlur={() => {
            setIsEditing(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const s = onUpdate(value);
              s ? setIsEditing(false) : setIsEditing(true);
            }
          }}
          className="text-blue-600 font-semibold border px-2 py-1 rounded w-40"
          {...props}
        />
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="cursor-pointer min-w-30 text-start bg-gray-200 px-3 py-1 rounded-md hover:bg-gray-300"
        >
          <span className="text-blue-600 font-semibold">{value}</span>
        </button>
      )}
    </div>
  );
}

export default EditableInput;
