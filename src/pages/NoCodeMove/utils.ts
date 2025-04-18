import { SuiMoveNormalizedStruct } from "@mysten/sui/client";

export function newEmptyStruct({
  packageAddr,
  module,
  structName,
}: {
  packageAddr: string;
  module: string;
  structName: string;
}): SuiMoveNormalizedStruct {
  return {
    abilities: {
      abilities: [],
    },
    fields: [
      {
        name: structName,
        type: {
          Struct: {
            address: packageAddr,
            module: module,
            name: structName,
            typeArguments: [],
          },
        },
      },
    ],
    typeParameters: [
      {
        constraints: {
          abilities: [],
        },
        isPhantom: false,
      },
    ],
  };
}
