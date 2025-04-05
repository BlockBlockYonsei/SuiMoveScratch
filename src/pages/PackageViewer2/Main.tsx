import { useEffect, useState } from "react";

export default function Main() {
  const [sourceCode, setSourceCode] = useState(null);

  useEffect(() => {
    fetch("/move_source_code.json")
      .then((res) => res.json())
      .then((data) => {
        setSourceCode(data);
        console.log(data);
      })
      .catch((err) => {
        console.error("Failed to load JSON:", err);
      });
  }, []);
  return (
    <div>
      <div className="text-3xl">BlockBlock</div>
      <div className="text-3xl">여기다 작업해주시면 됩니다.</div>
    </div>
  );
}
