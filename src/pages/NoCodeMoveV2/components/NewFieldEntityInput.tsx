import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Props {
  title: string;
  onCreate: (name: string) => void;
}

export default function NewFieldEntityInput({ title, onCreate }: Props) {
  const [name, setName] = useState("");

  return (
    <div>
      <label className="block font-semibold mb-1">{title}</label>
      <div className="flex gap-2 mb-2">
        <Input
          value={name}
          placeholder={`${title} Name`}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw.length > 0 && /^[\d_]/.test(raw)) {
              return; // 첫 글자가 숫자거나 _면 무시
            }
            const onlyAlphabet = e.target.value.replace(/[^a-zA-Z0-9_]/g, "");
            setName(onlyAlphabet.toLowerCase());
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (!name) return;

              onCreate(name);
              setName("");
            }
          }}
        />
        <Button
          className="cursor-pointer"
          onClick={() => {
            if (!name) return;

            onCreate(name);
            setName("");
          }}
        >
          Add
        </Button>
      </div>
    </div>
  );
}
