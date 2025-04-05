import { useEffect, useState } from "react";

export default function Main() {
  const [sourceCode, setSourceCode] = useState<Record<string, string> | null>(
    null
  );

  useEffect(() => {
    fetch("/move_source_code.json")
      .then((res) => res.json())
      .then((data) => {
        setSourceCode(data);
      })
      .catch((err) => {
        console.error("Failed to load JSON:", err);
      });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">📦 Move Modules</h1>
      {sourceCode ? (
        Object.entries(sourceCode).map(([key, value]) => {
          return <ModuleViewer key={key} name={key} code={value} />;
        })
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

function ModuleViewer({ name, code }: { name: string; code: string }) {
  const structs = code.match(/struct\s+\w+\s+has[^{]+\{[^}]+\}/g) || [];
  const functions =
    code.match(
      /(?:public|entry)?(\(friend\))?\s*fun\s+\w+\([^)]*\)\s*[:]?[^}]*\{[^}]*\}/g
    ) || [];

  const imports = (
    code.match(/0x[a-fA-F0-9]+::[a-zA-Z_][\w]*::[a-zA-Z_][\w]*/g) || []
  ).reduce((acc, entry) => {
    const match = entry.match(
      /(0x[0-9a-fA-F]+::[a-zA-Z_][\w]*)::([a-zA-Z_][\w]*)/
    );
    if (!match) return acc;

    const [_, key, value] = match;

    if (!acc[key]) acc[key] = [];

    // 중복 방지 (Set 없이 배열에서 확인)
    if (!acc[key].includes(value)) {
      acc[key].push(value);
    }

    return acc;
  }, {} as Record<string, string[]>);

  const sortedImports = Object.entries(imports).sort(([a], [b]) => {
    return a.localeCompare(b);
  });

  return (
    <div className="border rounded p-3 mb-6 shadow">
      <h2 className="text-xl font-semibold mb-2">📦 module: {name}</h2>
      <div className="pl-4 mb-2">
        <h3 className="text-lg font-bold">📂 Import</h3>
        {sortedImports.map(([key, value]) => {
          return (
            <pre key={key} className="text-sm bg-gray-100 p-2 rounded my-1">
              {key}::&#123;{value.join(", ")}&#125;
            </pre>
          );
        })}
      </div>
      <div className="pl-4 mb-2">
        <h3 className="text-lg font-bold">📂 Structs</h3>
        {structs.length > 0 ? (
          structs.map((s, i) => (
            <pre key={i} className="text-sm bg-gray-100 p-2 rounded my-1">
              {s}
            </pre>
          ))
        ) : (
          <p className="text-gray-500">No structs found</p>
        )}
      </div>
      <div className="pl-4">
        <h3 className="text-lg font-bold">⚙️ Functions</h3>
        {functions.length > 0 ? (
          functions.map((f, i) => (
            <pre key={i} className="text-sm bg-gray-100 p-2 rounded my-1">
              {f}
            </pre>
          ))
        ) : (
          <p className="text-gray-500">No functions found</p>
        )}
      </div>
    </div>
  );
}
