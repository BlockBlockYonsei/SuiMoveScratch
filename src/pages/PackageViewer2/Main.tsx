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
      /(\s)*(public|entry)?(\(friend\))?\s*fun\s+\w+[^()]*\([^)]*\)\s*[:]?[^}]*\{[^}]*\}/g
    ) || [];

  const imports = (
    code.match(/0x[a-fA-F0-9]+::[a-zA-Z_][\w]*::[a-zA-Z_][\w]*/g) || []
  )
    .filter(
      (ele, index, arr) => index === 0 || !arr.slice(0, index).includes(ele)
    )
    .sort((a, b) => a.localeCompare(b))
    .reduce((acc, entry) => {
      const match = entry.match(
        /(0x[0-9a-fA-F]+::[a-zA-Z_][\w]*)::([a-zA-Z_][\w]*)/
      );
      if (!match) return acc;

      const [_, key, value] = match;
      if (!acc[key]) acc[key] = [];

      acc[key].push(value);
      return acc;
    }, {} as Record<string, string[]>);

  return (
    <div className="border rounded p-3 mb-6 shadow">
      <h2 className="text-xl font-semibold mb-2">📦 module: {name}</h2>
      <div className="pl-4 mb-2">
        <h3 className="text-lg font-bold">📂 Import</h3>
        {Object.entries(imports).map(([key, values]) => {
          const match = key.match(/(0x[0-9a-fA-F]+)::([a-zA-Z_][\w]*)/);
          if (!match) return null;
          const [_, pack, module] = match;
          return (
            <pre key={key} className="text-sm bg-gray-100 p-2 rounded my-1">
              <span className="text-pink-500">{pack}</span>::
              <span className="text-blue-500">{module}</span>::
              <span className="text-emerald-500">
                &#123;{values.join(", ")} &#125;
              </span>
            </pre>
          );
        })}
      </div>
      <div className="pl-4 mb-2">
        <h3 className="text-lg font-bold">📂 Structs</h3>
        {structs.length > 0 ? (
          structs.map((struct, i) => {
            const match = struct.match(
              /(struct)\s+(\w+)\s+(has)([^{]+)(\{)([^}]+)(\})/
            );
            if (!match) return null;
            const [_, strct, name, has, abilities, open, fields, close] = match;

            const fieldMatch = fields.match(/([a-zA-Z_][\w]*)\s*:\s*([^,]+)/g);

            return (
              <pre key={i} className="text-sm bg-gray-100 p-2 rounded my-1">
                <span className="text-emerald-500">{strct}</span>{" "}
                <span className="font-semibold">{name}</span>{" "}
                <span className="text-pink-500">{has}</span>
                <span className="text-emerald-500">{abilities}</span>
                <span className="font-semibold">{open}</span>
                {/* <span>{fields}</span> */}
                {fieldMatch &&
                  fieldMatch.map((f) => {
                    const matchField = f.match(
                      /([a-zA-Z_][\w]*)\s*:\s*([^,]+)/
                    );
                    if (!matchField) return null;
                    const [_, name, type] = matchField;
                    return (
                      <div key={f}>
                        <span>{"    "}</span>
                        <span className="font-medium">{name}</span>:{" "}
                        <span className="text-blue-500">{type}</span>
                        {/* {f} */}
                      </div>
                    );
                  })}
                <span className="font-semibold">{close}</span>
              </pre>
            );
          })
        ) : (
          <p className="text-gray-500">No structs found</p>
        )}
      </div>
      <div className="pl-4">
        <h3 className="text-lg font-bold">⚙️ Functions</h3>
        {functions.length > 0 ? (
          functions.map((f, i) => {
            const match = f.match(
              /(public|entry)?(\(friend\))?\s*(fun)\s+(\w+)([^(]*)(\([^)]*\))\s*[:]?([^{]*)\{[^}]*\}/
            );

            if (!match) return null;

            const [_, pub_ent, frnd, fun, name, ta, params, returns] = match;

            return (
              <pre
                key={f + i.toString()}
                className="text-sm bg-gray-100 p-2 rounded my-1"
              >
                {/* {match.map((m, i) => {
                  if (i === 0 || !m) return null;
                  return <span className="font-semibold"> {m}</span>;
                })} */}
                <span className="font-semibold">{pub_ent} </span>
                <span>{frnd} </span>
                <span className="text-pink-500 font-semibold">{fun} </span>
                <span className="font-semibold"> {name} </span>
                <span className="text-emerald-500 font-semibold">{ta} </span>
                <span className="font-semibold">{params} </span>
                <span className="text-blue-500 font-semibold">{returns} </span>
              </pre>
            );
          })
        ) : (
          <p className="text-gray-500">No functions found</p>
        )}
      </div>
    </div>
  );
}
