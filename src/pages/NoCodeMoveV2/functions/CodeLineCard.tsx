import { parseStructNameFromSuiMoveNomalizedType } from "@/lib/convertType";
import { FunctionInsideCodeLine } from "@/types/move-type";

export default function CodeLineCard({
  line,
  ...props
}: {
  line: FunctionInsideCodeLine;
}) {
  if ("functionName" in line) {
    return (
      <div {...props} className="border-2 rounded-md">
        {line.variableNames.length > 0 &&
          `let (${line.variableNames.join(", ")}) = `}
        {line.functionName}
        {line.typeArguments.length > 0
          ? `<${line.typeArguments.map((t) =>
              parseStructNameFromSuiMoveNomalizedType(
                t,
                line.typeParameterNames
              )
            )}>`
          : ""}
        ({line.argumentNames.join(", ")});
      </div>
    );
  } else if ("structName" in line) {
    return (
      <div {...props} className="border-2 rounded-md flex">
        let {line.variableName} = {line.structName}
        {line.typeArguments.length > 0
          ? `<${line.typeArguments.map((t) =>
              parseStructNameFromSuiMoveNomalizedType(
                t,
                line.typeParameterNames
              )
            )}>`
          : ""}
        {` {
  ${line.fields
    .map((f, i) => `${f.name}: ${line.fieldVariableNames[i]}`)
    .join(",\n  ")}
};`}
      </div>
    );
  } else if ("value" in line && typeof line.type === "string") {
    return (
      <div {...props} className="border-2">
        let {line.variableName}: {line.type.toLowerCase()} = {line.value};
      </div>
    );
  }

  return (
    <div {...props} className="border-2">
      <div>{JSON.stringify(line)}</div>
    </div>
  );
}
