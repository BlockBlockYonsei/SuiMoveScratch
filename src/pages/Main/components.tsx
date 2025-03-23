import { SuiMoveNormalizedStruct } from "@mysten/sui/client";

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

export const FunctionCard = ({
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
                {referenceType && (
                  <span className="border-2 border-black rounded px-2">
                    {referenceType}
                  </span>
                )}
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

export const formatParameter = (param: any) => {
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
