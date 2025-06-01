import { useContext, useEffect, useState } from "react";
import { createHighlighter } from "shiki";
import {
  SuiMoveAbilitySet,
  SuiMoveNormalizedType,
  SuiMoveVisibility,
} from "@mysten/sui/client";

import { FunctionInsideCodeLine, SuiMoveFunction } from "@/types/move-type";
import { SuiMoveModuleContext } from "@/context/SuiMoveModuleContext";
import { generateFunctionCode } from "@/lib/generateCode";

export default function useFunctionDataHook() {
  const [previewCode, setPreviewCode] = useState("");

  const [oldFunctionName, setOldFunctionName] = useState("");
  const [functionName, setFunctionName] = useState("new_function");
  const [visibility, setVisibility] = useState<SuiMoveVisibility>("Private");
  const [isEntry, setIsEntry] = useState(false);

  const [parameters, setParameters] = useState<
    { name: string; type: SuiMoveNormalizedType }[]
  >([]);
  const [returns, setReturns] = useState<
    { name: string; type: SuiMoveNormalizedType }[]
  >([]);
  const [typeParameters, setTypeParameters] = useState<
    { name: string; type: SuiMoveAbilitySet }[]
  >([]);

  const [insideCodes, setInsideCodes] = useState<FunctionInsideCodeLine[]>([]);

  const { moduleName, functions, setFunctions, selectedFunction } =
    useContext(SuiMoveModuleContext);

  useEffect(() => {
    const createCode = async () => {
      const highlighter = await createHighlighter({
        langs: ["move"],
        themes: ["nord"],
      });
      const functionsCode = generateFunctionCode({
        functionName: functionName,
        visibility,
        isEntry,
        typeParameters: typeParameters.map((t) => t.type),
        typeParameterNames: typeParameters.map((t) => t.name),
        parameters: parameters.map((p) => p.type),
        parameterNames: parameters.map((p) => p.name),
        return: returns.map((r) => r.type),
        returnNames: returns.map((r) => r.name),
        insideCodes: insideCodes,
      } as SuiMoveFunction);

      const highlightedCode = highlighter.codeToHtml(functionsCode, {
        lang: "move",
        theme: "nord",
      });

      setPreviewCode(highlightedCode);
      highlighter.dispose();
    };

    createCode();
  }, [
    functionName,
    visibility,
    isEntry,
    parameters,
    returns,
    typeParameters,
    insideCodes,
  ]);

  useEffect(() => {
    if (selectedFunction) {
      setFunctionName(selectedFunction.functionName);
      setOldFunctionName(selectedFunction.functionName);
      setIsEntry(selectedFunction.isEntry);
      setVisibility(selectedFunction.visibility);
      setTypeParameters(
        selectedFunction.typeParameters.map((tp, i) => ({
          name: selectedFunction.typeParameterNames[i],
          type: tp,
        }))
      );
      setParameters(
        selectedFunction.parameters.map((p, i) => ({
          name: selectedFunction.parameterNames[i],
          type: p,
        }))
      );
      setReturns(
        selectedFunction.return.map((p, i) => ({
          name: selectedFunction.returnNames[i],
          type: p,
        }))
      );
      setInsideCodes(selectedFunction.insideCodes);
    } else {
      // 새로운 function 생성 시 초기화
      resetFunction();
    }
  }, [selectedFunction, functions]);

  const resetFunction = () => {
    setFunctionName("new_function");
    setVisibility("Private");
    setIsEntry(false);
    setTypeParameters([]);
    setParameters([]);
    setReturns([]);
    setInsideCodes([]);
  };

  const handleComplete = () => {
    if (!functionName) return resetFunction();

    if (!selectedFunction && functions.has(functionName))
      return resetFunction();

    const newFunctionData: SuiMoveFunction = {
      address: "0x0",
      moduleName: moduleName,
      functionName: functionName,
      isEntry: isEntry,
      visibility: visibility,
      parameters: parameters.map((p) => p.type),
      parameterNames: parameters.map((p) => p.name),
      typeParameters: typeParameters.map((t) => t.type),
      typeParameterNames: typeParameters.map((t) => t.name),
      return: returns.map((r) => r.type),
      returnNames: returns.map((r) => r.name),
      insideCodes: insideCodes,
    };

    setFunctions((prev) => {
      const newFunctionMap = new Map();

      if (!selectedFunction) {
        [...prev.entries()].forEach(([funcName, funcData]) => {
          newFunctionMap.set(funcName, funcData);
        });
        newFunctionMap.set(functionName, newFunctionData);
        return newFunctionMap;
      } else {
        // 이전 function 이름이 있고, 새로운 이름과 다른 경우 (이름 변경)
        [...prev.entries()].forEach(([funcName, funcData]) => {
          if (funcName === oldFunctionName) {
            newFunctionMap.set(functionName, newFunctionData);
            return;
          }
          newFunctionMap.set(funcName, funcData);
        });
        return newFunctionMap;
      }
    });

    setFunctions((prev) => {
      const newFunctionMap = new Map<string, SuiMoveFunction>();

      prev.forEach((funcData) => {
        const updatedInsedCodes = funcData.insideCodes.map((line) => {
          if ("functionName" in line && line.functionName === oldFunctionName) {
            return {
              ...newFunctionData,
              typeArguments: line.typeArguments,
              argumentNames: line.argumentNames,
              variableNames: line.variableNames,
            };
            // 귀찮다 일단 대충 해
          }
          return line;
        });
        newFunctionMap.set(funcData.functionName, {
          ...funcData,
          insideCodes: updatedInsedCodes,
        });
      });
      return newFunctionMap;
    });

    // resetFunction();
    // Optionally reset all states
  };

  return {
    previewCode,
    setPreviewCode,
    functionName,
    setFunctionName,
    visibility,
    setVisibility,
    isEntry,
    setIsEntry,
    parameters,
    setParameters,
    returns,
    setReturns,
    typeParameters,
    setTypeParameters,
    insideCodes,
    setInsideCodes,
    handleComplete,
  };
}
