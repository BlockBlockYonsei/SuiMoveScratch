import { SuiMoveNormalizedStruct } from "@mysten/sui/client";

export function newEmptyStruct(): SuiMoveNormalizedStruct {
  return {
    abilities: {
      abilities: [],
    },
    fields: [],
    typeParameters: [],
  };
}
