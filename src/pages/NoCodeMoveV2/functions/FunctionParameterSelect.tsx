import {
  SuiMoveAbilitySet,
  SuiMoveNormalizedFunction,
  SuiMoveNormalizedStruct,
  SuiMoveNormalizedType,
} from "@mysten/sui/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface FunctionParameterSelectProps {
  function: SuiMoveNormalizedFunction;
  functionName: string;
  onParameterSelect: (value: string) => void;
  onReturnSelect: (value: string) => void;
  onTypeArgSelect: (value: string) => void;
  selectedParams: string[];
  selectedReturns: string[];
  selectedTypeArgs: string[];
  args: number;
  structs: Record<string, SuiMoveNormalizedStruct>;
}

export default function FunctionParameterSelect({
  function: func,
  functionName,
  onParameterSelect,
  onReturnSelect,
  onTypeArgSelect,
  selectedParams,
  selectedReturns,
  selectedTypeArgs,
  args,
  structs,
}: FunctionParameterSelectProps) {
  return (
    <div className="font-mono text-sm">
      {func.return.length > 0 ? (
        <>
          <span>let (</span>
          {func.return.map((returnType, index) => (
            <span key={`return-${index}`} className="inline-flex items-center">
              <span className="text-gray-400">[</span>
              <Select
                onValueChange={(value) => onReturnSelect(value)}
                defaultValue={selectedReturns[index]}
              >
                <SelectTrigger className="w-[100px] h-6 px-2 py-0 text-sm border-0 bg-transparent hover:bg-gray-100 rounded-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: args }, (_, i) => (
                    <SelectItem key={`return-args-${i}`} value={`args${i}`}>
                      args{i}
                    </SelectItem>
                  ))}
                  <Label className="px-2 text-xs text-muted-foreground">
                    Current Structs
                  </Label>
                  {Object.keys(structs).map((name) => (
                    <SelectItem key={name} value={`local::${name}`}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-gray-400">]</span>
              {index < func.return.length - 1 && <span>, </span>}
            </span>
          ))}
          <span>) = </span>
        </>
      ) : null}
      <span>{functionName}</span>
      {func.typeParameters.length > 0 && (
        <>
          <span className="text-gray-400">&lt;</span>
          {func.typeParameters.map((_, index) => (
            <span key={`type-${index}`} className="inline-flex items-center">
              <span className="text-gray-400">[</span>
              <Select
                onValueChange={(value) => onTypeArgSelect(value)}
                defaultValue={selectedTypeArgs[index]}
              >
                <SelectTrigger className="w-[60px] h-6 px-2 py-0 text-sm border-0 bg-transparent hover:bg-gray-100 rounded-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: args }, (_, i) => (
                    <SelectItem key={`type-args-${i}`} value={`args${i}`}>
                      args{i}
                    </SelectItem>
                  ))}
                  <Label className="px-2 text-xs text-muted-foreground">
                    Current Structs
                  </Label>
                  {Object.keys(structs).map((name) => (
                    <SelectItem key={name} value={`local::${name}`}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-gray-400">]</span>
              {index < func.typeParameters.length - 1 && <span>, </span>}
            </span>
          ))}
          <span className="text-gray-400">&gt;</span>
        </>
      )}
      <span>(</span>
      {func.parameters.map((param, index) => (
        <span key={`param-${index}`} className="inline-flex items-center">
          <span className="text-gray-400">[</span>
          <Select
            onValueChange={(value) => onParameterSelect(value)}
            defaultValue={selectedParams[index]}
          >
            <SelectTrigger className="w-[100px] h-6 px-2 py-0 text-sm border-0 bg-transparent hover:bg-gray-100 rounded-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: args }, (_, i) => (
                <SelectItem key={`param-args-${i}`} value={`args${i}`}>
                  args{i}
                </SelectItem>
              ))}
              <Label className="px-2 text-xs text-muted-foreground">
                Current Structs
              </Label>
              {Object.keys(structs).map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-gray-400">]</span>
          {index < func.parameters.length - 1 && <span>, </span>}
        </span>
      ))}
      <span>)</span>
    </div>
  );
}
