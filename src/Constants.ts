import { SuiMoveNormalizedType } from "@mysten/sui/client";

export const SUI_PACKAGE_ALIASES: Record<string, string> = {
  "0x0000000000000000000000000000000000000000000000000000000000000001": "std",
  "0x0000000000000000000000000000000000000000000000000000000000000002": "sui",
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
