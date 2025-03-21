/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSuiClientQuery } from "@mysten/dapp-kit";

const StructCard = ({
  name,
  abilities,
  fields,
}: {
  name: string;
  abilities: string[];
  fields: { name: string; type: any }[];
}) => {
  return (
    <div className="border p-4">
      <div className="mb-2">
        <span className="text-xl font-semibold">{name}</span>
        <span className="text-pink-500 px-2">has</span>
        <span className="border-2 rounded">{abilities.join(", ")}</span>
      </div>
      <div className="space-y-1">
        {fields.map((field, index) => (
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

const formatType = (type: any): string => {
  if (typeof type === "string") return type;
  if (type.Struct) {
    const {
      address,
      module,
      name,
    }: { address: string; module: string; name: string } = type.Struct;
    return `${shortAddress(address)}::${module}::${name}`;
  }
  if (type.Vector) {
    return formatType(type.Vector);
  }
  return JSON.stringify(type);
};

const shortAddress = (addr: string) => {
  if (addr.startsWith("0x") && addr.length > 12) {
    return `${addr.slice(0, 7)}...${addr.slice(-5)}`;
  }
  return addr;
};

const FunctionCard = ({
  name,
  parameters,
}: {
  name: string;
  parameters: any[];
}) => {
  return (
    <div className="border p-4">
      <div className="text-xl font-semibold">{name}</div>
      <div className="mt-2">
        <div className="font-bold mb-1">Parameters:</div>
        <div className="space-y-2">
          {parameters.map((param, index) => {
            const { referenceType, formattedType } = formatParameter(param);
            return (
              <div key={index} className="flex gap-2">
                <span className="border-2 border-black rounded px-2">
                  {index}
                </span>
                {referenceType && (<span className="border-2 border-black rounded px-2">
                  {referenceType}
                </span>)}
                <span className="border-2 border-black rounded px-2">
                  {formattedType}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const formatParameter = (param: any) => {
  let referenceType = "";

  if (param.Reference) {
    referenceType = "&";
    param = param.Reference;
  } else if (param.MutableReference) {
    referenceType = "&mut";
    param = param.MutableReference;
  }

  return { referenceType, formattedType: formatType(param) };
};

export default function Main() {
  const { data, isPending, error } = useSuiClientQuery(
    "getNormalizedMoveModulesByPackage",
    {
      package:
        "0xb84460fd33aaf7f7b7f80856f27c51db6334922f79e326641fb90d40cc698175",
    },
  );

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error?.message || "error"}</div>;

  return (
    <div className="p-4">
      <div className="text-2xl font-bold mb-4">Blockblock</div>
      <div className="text-lg mb-6">여기다 작업해주시면 됩니다.</div>

      <div className="space-y-6">
        <div className="text-4xl">Structs</div>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(data.blockblock.structs).map(
            ([structName, structData]: [
              string,
              {
                abilities: { abilities: string[] };
                fields: { name: string; type: any }[];
              },
            ]) => (
              <StructCard
                key={structName}
                name={structName}
                abilities={structData.abilities.abilities}
                fields={structData.fields}
              />
            ),
          )}
        </div>
      </div>

      <div className="mt-10 space-y-6">
        <div className="text-4xl">Exposed Functions</div>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(data.blockblock.exposedFunctions).map(
            ([functionName, functionData]: [string, { parameters: any[] }]) => (
              <FunctionCard
                key={functionName}
                name={functionName}
                parameters={functionData.parameters}
              />
            ),
          )}
        </div>{" "}
      </div>
    </div>
  );
}
