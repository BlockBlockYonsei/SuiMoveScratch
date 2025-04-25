import { SuiMoveAbility, SuiMoveAbilitySet } from "@mysten/sui/client";

interface Props {
  abilitySet: SuiMoveAbilitySet;
  updateAbilitySet: (
    getNewAbilitySet: (
      abilitySet: SuiMoveAbilitySet,
      ability: SuiMoveAbility
    ) => SuiMoveAbilitySet,
    ...args: any[]
  ) => any;
}
export default function AbilityCard({ abilitySet, updateAbilitySet }: Props) {
  const ABILITIES = ["Copy", "Drop", "Store", "Key"] as const;

  const getNewAbilitySet = (
    abilitySet: SuiMoveAbilitySet,
    ability: SuiMoveAbility
  ) => {
    const index = abilitySet.abilities.indexOf(ability);
    const newAbilitySet: SuiMoveAbilitySet = {
      abilities:
        index >= 0
          ? [
              ...abilitySet.abilities.slice(0, index),
              ...abilitySet.abilities.slice(index + 1),
            ]
          : [...abilitySet.abilities, ability],
    };

    return newAbilitySet;
  };

  return (
    <span>
      {ABILITIES.map((ability) => (
        <button
          key={ability}
          onClick={() => {
            updateAbilitySet(getNewAbilitySet, ability);
          }}
          className={`border-2 border-black px-1 rounded-md cursor-pointer ${
            abilitySet.abilities.includes(ability) ? "bg-emerald-300" : ""
          }`}
        >
          {ability}
        </button>
      ))}
    </span>
  );
}
