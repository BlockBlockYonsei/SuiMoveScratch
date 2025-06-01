import { useContext, useEffect, useState } from "react";
import { createHighlighter } from "shiki";
import {
  SuiMoveAbility,
  SuiMoveNormalizedField,
  SuiMoveStructTypeParameter,
} from "@mysten/sui/client";

import { SuiMoveStruct } from "@/types/move-type";
import { SuiMoveModuleContext } from "@/context/SuiMoveModuleContext";
import { generateStructCode } from "@/lib/generateCode";

export default function useStructDataHook() {
  const [previewCode, setPreviewCode] = useState("");

  const [oldStructName, setOldStructName] = useState("");
  const [structName, setStructName] = useState("NewStruct");
  const [abilities, setAbilities] = useState<SuiMoveAbility[]>([]);
  const [typeParameters, setTypeParameters] = useState<
    { name: string; type: SuiMoveStructTypeParameter }[]
  >([]);
  const [fields, setFields] = useState<SuiMoveNormalizedField[]>([]);

  const { moduleName, structs, setStructs, selectedStruct } =
    useContext(SuiMoveModuleContext);

  useEffect(() => {
    const createCode = async () => {
      const highlighter = await createHighlighter({
        langs: ["move"],
        themes: ["nord"],
      });
      const structCode = generateStructCode({
        address: "0x0",
        moduleName: moduleName,
        structName: structName,
        abilities: { abilities },
        fields,
        typeParameters: typeParameters.map((t) => t.type),
        typeParameterNames: typeParameters.map((t) => t.name),
      } as SuiMoveStruct);

      const highlightedCode = highlighter.codeToHtml(structCode, {
        lang: "move",
        theme: "nord",
      });

      setPreviewCode(highlightedCode);
      highlighter.dispose();
    };

    createCode();
  }, [structName, abilities, fields, typeParameters]);

  useEffect(() => {
    if (selectedStruct) {
      setStructName(selectedStruct.structName);
      setOldStructName(selectedStruct.structName);
      setAbilities(selectedStruct.abilities.abilities);
      setTypeParameters(
        selectedStruct.typeParameters.map((tp, i) => ({
          name: selectedStruct.typeParameterNames[i],
          type: tp,
        }))
      );
      setFields(selectedStruct.fields);
    } else {
      resetState();
    }
  }, [selectedStruct, structs]);

  const handleComplete = () => {
    if (!structName) return resetState();

    if (!selectedStruct && structs.has(structName)) return resetState();

    const newStructData: SuiMoveStruct = {
      address: "0x0",
      moduleName: moduleName,
      structName: structName,
      abilities: { abilities },
      fields,
      typeParameters: typeParameters.map((t) => t.type),
      typeParameterNames: typeParameters.map((t) => t.name),
    };

    setStructs((prev) => {
      const newStructMap = new Map<string, SuiMoveStruct>();

      if (!selectedStruct) {
        [...prev.entries()].forEach(([strtName, strtData]) => {
          newStructMap.set(strtName, strtData);
        });
        newStructMap.set(structName, newStructData);
        return newStructMap;
      } else {
        // 이전 struct 이름이 있고, 새로운 이름과 다른 경우 (이름 변경)
        [...prev.entries()].forEach(([strtName, strtData]) => {
          if (strtName === oldStructName) {
            newStructMap.set(structName, newStructData);
            return;
          }
          newStructMap.set(strtName, strtData);
        });

        // 다른 Struct Field에 해당 Struct가 쓰였다면 함께 이름 변경해줌
        newStructMap.forEach((structData) => {
          const updatedFields = structData.fields.map((field) => {
            if (
              field.type &&
              typeof field.type === "object" &&
              "Struct" in field.type &&
              field.type.Struct.name === oldStructName
            ) {
              const updatedField: SuiMoveNormalizedField = {
                name: field.name,
                type: {
                  Struct: {
                    ...field.type.Struct,
                    name: structName,
                  },
                },
              };
              return updatedField;
            }

            return field;
          });

          newStructMap.set(structData.structName, {
            ...structData,
            fields: updatedFields,
          } as SuiMoveStruct);
        });

        return newStructMap;
      }
    });

    resetState();
  };

  const resetState = () => {
    setStructName("NewStruct");
    setAbilities([]);
    setTypeParameters([]);
    setFields([]);
  };
  return {
    previewCode,
    setPreviewCode,
    structName,
    setStructName,
    abilities,
    setAbilities,
    fields,
    setFields,
    typeParameters,
    setTypeParameters,
    handleComplete,
  };
}
