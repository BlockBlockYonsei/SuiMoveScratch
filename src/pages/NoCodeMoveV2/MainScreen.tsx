import StructPreview from "./structs/StructPreview";
import FunctionPreview from "./functions/FunctionPreview";
import ImportPreview from "./imports/ImportPreview";
import CodePreview from "./CodePreview";

export default function MainScreen({
  menu,
}: {
  menu: "imports" | "structs" | "functions" | "code";
}) {
  return (
    <div className="flex-1 space-y-6 text-sm font-mono">
      {/* <button
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => downloadMoveCode(imports, structs, functions)}
      >
        code download
      </button> */}
      <div className="flex justify-start items-center gap-4">
        <h1 className="text-2xl font-bold">{menu}</h1>
      </div>

      <pre className="bg-white p-4 rounded-md shadow whitespace-pre-wrap overflow-auto">
        {menu === "imports" && <ImportPreview />}
        {menu === "structs" && <StructPreview />}
        {menu === "functions" && <FunctionPreview />}

        {menu === "code" && <CodePreview />}
      </pre>
    </div>
  );
}
