import {
  SuiMoveNormalizedFunction,
  SuiMoveNormalizedStruct,
  SuiMoveNormalizedType,
} from "@mysten/sui/client";
import { formatType, parseSuiMoveNormalizedType } from "./utils";

interface BlockCardProps {
  text: string;
  bgColor?: string;
  textColor?: string;
  className?: string;
  onClick?: () => void;
}

const BlockCard = ({
  text,
  bgColor = "bg-white",
  textColor = "text-black",
  className = "",
  onClick,
}: BlockCardProps) => {
  return (
    <div
      className={`border-2 border-black rounded px-2 py-1 ${bgColor} ${textColor} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
    >
      {text}
    </div>
  );
};

const AbilityCard = ({ ability }: { ability: string }) => (
  <BlockCard
    text={ability}
    bgColor="bg-yellow-100"
    textColor="text-yellow-600"
    className="mx-1"
  />
);

const TypeParamCard = ({ name }: { name: string }) => (
  <BlockCard
    text={name}
    bgColor="bg-purple-100"
    textColor="text-purple-600"
    className="mx-1"
  />
);

const KeywordCard = ({ keyword }: { keyword: string }) => (
  <BlockCard
    text={keyword}
    bgColor="bg-pink-100"
    textColor="text-pink-500"
    className="mx-1"
  />
);

interface TypeResultProps {
  result:
    | string
    | {
        address: string;
        module: string;
        name: string;
        typeArgs: string;
      };
}

const TypeCard = ({ text }: { text: string }) => (
  <BlockCard
    text={text}
    bgColor="bg-blue-100"
    textColor="text-blue-700"
    className="mb-1 w-full text-center"
  />
);

const TypeResult = ({ result }: TypeResultProps) => {
  if (typeof result === "string") {
    return <BlockCard text={result} bgColor="bg-purple-100" />;
  }

  return (
    <div className="flex flex-col items-center">
      <TypeCard text={result.address} />
      <TypeCard text={result.module} />
      <TypeCard text={result.name} />
      {result.typeArgs && (
        <BlockCard
          text={result.typeArgs}
          bgColor="bg-orange-100"
          textColor="text-orange-600"
          className="w-full text-center"
        />
      )}
    </div>
  );
};

interface TypeParamDefinitionProps {
  typeParam: {
    isPhantom?: boolean;
    constraints: {
      abilities: string[];
    };
  };
  index: number;
}

const TypeParamDefinition = ({
  typeParam,
  index,
}: TypeParamDefinitionProps) => (
  <span className="flex items-center">
    {typeParam.isPhantom && <KeywordCard keyword="phantom" />}
    <TypeParamCard name={`T${index}`} />

    {typeParam.constraints.abilities.length > 0 && (
      <>
        <span className="mx-1">:</span>
        {typeParam.constraints.abilities.map((ability, abilityIndex) => (
          <AbilityCard key={`tp-ability-${abilityIndex}`} ability={ability} />
        ))}
      </>
    )}
  </span>
);

interface ParamVisualizerProps {
  param: SuiMoveNormalizedType;
  index: number;
}

const ParamVisualizer = ({ param, index }: ParamVisualizerProps) => {
  const formatted = parseSuiMoveNormalizedType(param);

  return (
    <div className="border p-2 rounded-md flex items-center gap-2">
      <div className="flex flex-col items-center gap-2">
        <TypeParamCard name={`T${index}`} />

        {formatted.prefix && (
          <BlockCard text={formatted.prefix} bgColor="bg-gray-100" />
        )}
      </div>

      <TypeResult result={formatted.result} />
    </div>
  );
};

export const StructCard = ({
  structName,
  structData,
}: {
  structName: string;
  structData: SuiMoveNormalizedStruct;
}) => {
  return (
    <div key={structName} className="border p-4 rounded-md">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <BlockCard
          text={structName}
          bgColor="bg-emerald-100"
          textColor="text-emerald-700"
          className="text-xl font-semibold"
        />

        {structData.typeParameters.length > 0 && (
          <span className="inline-flex whitespace-nowrap items-center">
            {"<"}
            {structData.typeParameters.map((tp, index) => (
              <TypeParamDefinition key={index} typeParam={tp} index={index} />
            ))}
            {">"}
          </span>
        )}
      </div>

      {structData.abilities.abilities.length > 0 && (
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {structData.abilities.abilities.map((ability, index) => (
            <AbilityCard key={`ability-${index}`} ability={ability} />
          ))}
        </div>
      )}

      <div className="space-y-2">
        {structData.fields.map((field, index) => (
          <div key={index} className="flex items-center flex-wrap gap-2">
            <BlockCard
              text={field.name}
              bgColor="bg-blue-100"
              textColor="text-blue-600"
            />
            <BlockCard text={formatType(field.type)} bgColor="bg-purple-100" />
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
      <h2 className="flex flex-wrap gap-2 items-center mb-4">
        {functionData.isEntry && <KeywordCard keyword="entry" />}
        <KeywordCard keyword={functionData.visibility.toLowerCase()} />
        <BlockCard text="fun" />
        <BlockCard
          text={functionName}
          bgColor="bg-emerald-100"
          textColor="text-emerald-700"
          className="text-xl font-semibold"
        />

        {functionData.typeParameters.length > 0 && (
          <div className="flex items-center">
            <span className="mr-1">{"<"}</span>
            {functionData.typeParameters.map((tp, index) => (
              <TypeParamDefinition
                key={`func-tp-${index}`}
                typeParam={{
                  constraints: { abilities: tp.abilities },
                }}
                index={index}
              />
            ))}
            <span className="ml-1">{">"}</span>
          </div>
        )}
      </h2>

      <div className="mb-4">
        <span className="font-bold block mb-2">Parameters:</span>
        <div className="flex flex-wrap gap-4">
          {functionData.parameters.length > 0 ? (
            functionData.parameters.map((param, index) => (
              <ParamVisualizer
                key={`param-${index}`}
                param={param}
                index={index}
              />
            ))
          ) : (
            <BlockCard
              text="None"
              bgColor="bg-gray-100"
              textColor="text-gray-500"
            />
          )}
        </div>
      </div>

      <div className="mb-2">
        <span className="font-bold block mb-2">Return:</span>
        <div className="flex flex-wrap gap-4">
          {functionData.return.length > 0 ? (
            functionData.return.map((param, index) => (
              <ParamVisualizer
                key={`return-${index}`}
                param={param}
                index={index}
              />
            ))
          ) : (
            <BlockCard
              text="None"
              bgColor="bg-gray-100"
              textColor="text-gray-500"
            />
          )}
        </div>
      </div>
    </div>
  );
};
