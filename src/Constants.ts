import { SuiMoveAbility, SuiMoveNormalizedType } from "@mysten/sui/client";

export const SUI_PACKAGE_ALIASES: Record<string, string> = {
  // "0x0000000000000000000000000000000000000000000000000000000000000001": "std",
  // "0x0000000000000000000000000000000000000000000000000000000000000002": "sui",
  "0x1": "std",
  "0x2": "sui",
};

export const PRIMITIVE_TYPES: SuiMoveNormalizedType[] = [
  "Bool",
  "U8",
  "U16",
  "U32",
  "U64",
  "U128",
  "U256",
  "Address",
  "Signer",
];

export const allAbilities: SuiMoveAbility[] = ["Key", "Store", "Copy", "Drop"];
