import { SuiMoveNormalizedStruct } from "@mysten/sui/client";
import {
  generateImportsCode,
  generateStructCode,
  generateFunctionCode,
  downloadMoveCode,
} from "../NoCodeMove/utils/generateCode";
import { ImportsType, SuiMoveFunction } from "@/types/move-syntax";

interface Props {
  imports: ImportsType;
  structs: Record<string, SuiMoveNormalizedStruct>;
  functions: Record<string, SuiMoveFunction>;
}

export default function CodePreview({ imports, structs, functions }: Props) {
  return (
    <div className="flex-1 p-5 space-y-6 text-sm font-mono">
      <button
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => downloadMoveCode(imports, structs, functions)}
      >
        code download
      </button>

      <pre className="bg-white p-4 rounded-md shadow whitespace-pre-wrap overflow-auto">
        <code>{generateImportsCode(imports)}</code>
        <br /> <br />
        <code>
          {Object.entries(structs)
            .map(([name, s]) =>
              generateStructCode(name, s, (s as any).typeParameterNames || [])
            )
            .join("\n\n")}
        </code>
        <br /> <br />
        <code>
          {Object.entries(functions)
            .map(([name, f]) => generateFunctionCode(name, f))
            .join("\n\n")}
        </code>
      </pre>
    </div>
  );
}
