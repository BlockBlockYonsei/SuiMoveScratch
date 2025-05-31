import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Props {
  create: (name: string) => void;
}

export default function NewTypeParameterInput({ create }: Props) {
  const [name, setName] = useState("");

  return (
    <div>
      <label className="block font-semibold mb-1">Type Parameters</label>
      <div className="flex gap-2 mb-2">
        <Input
          value={name}
          placeholder="Type Parameter Name"
          onChange={(e) => {
            const raw = e.target.value;
            if (raw.length > 0 && /^\d/.test(raw)) {
              return; // 첫 글자가 숫자면 무시
            }
            const onlyAlphabet = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
            const firstLetterCapitalized =
              onlyAlphabet.charAt(0).toUpperCase() + onlyAlphabet.slice(1);
            setName(firstLetterCapitalized);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (!name) return;

              create(name);
              setName("");
            }
          }}
        />
        <Button
          className="cursor-pointer"
          onClick={() => {
            if (!name) return;

            create(name);
            setName("");
          }}
        >
          Add
        </Button>
      </div>
    </div>
  );
}
