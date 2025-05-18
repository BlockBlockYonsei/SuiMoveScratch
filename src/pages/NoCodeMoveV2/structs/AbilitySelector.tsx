import { Button } from "@/components/ui/button";
import { SuiMoveAbility } from "@mysten/sui/client";

interface AbilitySelectorProps {
  abilities: SuiMoveAbility[];
  onChange: (abilities: SuiMoveAbility[]) => void;
  className?: string;
}

export default function AbilitySelector({
  abilities,
  onChange,
  className = "",
}: AbilitySelectorProps) {
  const allAbilities: SuiMoveAbility[] = [
    "copy",
    "drop",
    "store",
    "key",
  ] as unknown as SuiMoveAbility[];

  return (
    <div className={`flex gap-2 flex-wrap ${className}`}>
      {allAbilities.map((ability) => (
        <Button
          key={ability}
          className="cursor-pointer h-7 px-3 text-sm"
          size="sm"
          variant={abilities.includes(ability) ? "default" : "outline"}
          onClick={() => {
            onChange(
              abilities.includes(ability)
                ? abilities.filter((a) => a !== ability)
                : [...abilities, ability],
            );
          }}
        >
          {ability}
        </Button>
      ))}
    </div>
  );
}
