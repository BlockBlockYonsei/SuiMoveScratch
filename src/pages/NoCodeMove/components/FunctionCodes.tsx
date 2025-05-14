import {
  SuiMoveNormalizedStruct,
  SuiMoveNormalizedType,
} from "@mysten/sui/client";

// Create a new empty struct
export function newEmptyStruct(): SuiMoveNormalizedStruct {
  return {
    abilities: {
      abilities: [],
    },
    fields: [],
    typeParameters: [],
  };
}

// Helper to safely update nested state
export function updateNestedState<T>(obj: T, path: string[], value: any): T {
  try {
    const copy = { ...obj } as any;
    let current = copy;
    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i];
      current[key] = { ...current[key] };
      current = current[key];
    }
    current[path[path.length - 1]] = value;
    return copy;
  } catch (error) {
    console.error("Error updating nested state:", error);
    return obj; // Return original object if update fails
  }
}

// Helper to prevent default on events
export function preventDefault(e: React.SyntheticEvent) {
  if (e && e.preventDefault) {
    e.preventDefault();
  }
  if (e && e.stopPropagation) {
    e.stopPropagation();
  }
  return false;
}

// Create deep clone of an object
export function deepClone<T>(obj: T): T {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (error) {
    console.error("Error deep cloning object:", error);
    return obj; // Return original object if clone fails
  }
}

// Check if two objects are equal
export function isEqual(obj1: any, obj2: any): boolean {
  try {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  } catch (error) {
    console.error("Error comparing objects:", error);
    return false; // Return false by default if comparison fails
  }
}

// Format Move code for display
export function formatMoveCode(code: string): string {
  return code.trim();
}

// Apply consistent syntax highlighting classes
export const SYNTAX_COLORS = {
  KEYWORD: "text-blue-500",
  TYPE: "text-emerald-500",
  FUNCTION: "text-purple-500",
  VARIABLE: "text-amber-500",
  STRING: "text-red-500",
  OPERATOR: "text-gray-400",
  COMMENT: "text-gray-400 italic",
};

// Parse SuiMoveNormalizedType to display format
export function parseSuiMoveNormalizedType(type: SuiMoveNormalizedType) {
  // Default return structure
  const result = {
    prefix: "",
    core: type,
  };

  if (typeof type === "string") {
    // Simple type like "u64", "bool", etc.
    return result;
  }

  // Handle reference types and other complex types
  if (typeof type === "object") {
    if ("Reference" in type) {
      result.prefix = "&";
      result.core = type.Reference;
      return result;
    }

    if ("MutableReference" in type) {
      result.prefix = "&mut ";
      result.core = type.MutableReference;
      return result;
    }

    if ("Vector" in type) {
      result.prefix = "vector<";
      result.core = type.Vector;
      return result;
    }
  }

  return result;
}
