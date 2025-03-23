import {
  SuiMoveNormalizedFunction,
  SuiMoveNormalizedStruct,
} from "@mysten/sui/client";
import { formatType, parseSuiMoveNormalizedType, shortAddress } from "./utils";

export const StructCard = ({
  structName,
  structData,
}: {
  structName: string;
  structData: SuiMoveNormalizedStruct;
}) => {
  return (
    <div className="border p-4 rounded-md">
      <div className="mb-2 flex">
        <span className="text-xl font-semibold">{structName}</span>
        {structData.typeParameters.length > 0 && (
          <span className="inline-flex whitespace-nowrap">
            {"<"}
            {structData.typeParameters.map((tp, index) => (
              <span>
                <span className="text-pink-600">
                  {tp.isPhantom && "phantom "}
                </span>
                <span>
                  T{index}:{tp.constraints.abilities.join("+ ")}
                </span>
              </span>
            ))}
            {">"}
          </span>
        )}
        <span className="text-pink-500 px-2">has</span>
        <span className="border-2 rounded">
          {structData.abilities.abilities.join(", ")}
        </span>
      </div>
      <div className="space-y-1">
        {structData.fields.map((field, index) => (
          <div key={index}>
            <span className="text-blue-600 border-2 border-black rounded px-2">
              {field.name}
            </span>
            <span className="px-2">:</span>
            <span className="border-2 border-black rounded px-2">
              {formatType(field.type)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const FunctionCard = ({
  functionName,
  functionData,
}: {
  functionName: string;
  functionData: SuiMoveNormalizedFunction;
}) => {
  return (
    <div key={functionName} className="border p-4 mb-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">
        <span>{functionData.isEntry ? "entry" : ""} </span>
        <span className="text-pink-500">
          {functionData.visibility.toLocaleLowerCase()}{" "}
        </span>
        {functionName}
      </h2>
      <div className="mb-2"></div>
      <div className="mb-2">
        <span className="font-bold">Parameters:</span>
        <div className="flex flex-wrap gap-4">
          {functionData.parameters.length > 0 ? (
            functionData.parameters.map((param, index) => {
              const formatted = parseSuiMoveNormalizedType(param); // ⬅ 아래 함수 참고
              return (
                <div
                  key={index}
                  className="border p-2 rounded-md flex items-center gap-2"
                >
                  <span className="border border-gray-400 rounded px-2 py-0.5 text-sm">
                    {formatted.prefix}
                  </span>
                  {typeof formatted.core === "string" ? (
                    <div>{formatted.core}</div>
                  ) : (
                    <div className="flex flex-col items-center border border-blue-500 rounded px-2 py-0.5 text-sm font-mono">
                      <span>{shortAddress(formatted.core.address)}</span>
                      <span>{formatted.core.module}</span>
                      <span>{formatted.core.name}</span>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <li>None</li>
          )}
        </div>
      </div>
      <div className="mb-2">
        <span className="font-bold">Return:</span>
        <div className="flex flex-wrap gap-4">
          {functionData.return.length > 0 ? (
            functionData.return.map((param, index) => {
              const formatted = parseSuiMoveNormalizedType(param); // ⬅ 아래 함수 참고
              return (
                <div
                  key={index}
                  className="border p-2 rounded-md flex items-center gap-2"
                >
                  <span className="border border-gray-400 rounded px-2 py-0.5 text-sm">
                    {formatted.prefix}
                  </span>
                  {typeof formatted.core === "string" ? (
                    <div>{formatted.core}</div>
                  ) : (
                    <div className="flex flex-col items-center border border-blue-500 rounded px-2 py-0.5 text-sm font-mono">
                      <span>{shortAddress(formatted.core.address)}</span>
                      <span>{formatted.core.module}</span>
                      <span>{formatted.core.name}</span>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <li>None</li>
          )}
        </div>
      </div>
    </div>
  );
};
