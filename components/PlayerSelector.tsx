import { Player } from "@/lib/player";

type PlayerSelectorProps = {
  players: Player[];
  currentIndex: number;
  onSelect: (index: number) => void;
};

export function PlayerSelector({
  players,
  currentIndex,
  onSelect,
}: PlayerSelectorProps) {
  return (
    <div className="grid grid-cols-5 gap-2 mb-6 w-full max-w-md">
      {players.map((player, index) => (
        <button
          key={`${player.name}-${index}`}
          onClick={() => onSelect(index)}
          className={`h-10 w-full flex items-center justify-center rounded text-gray-100 text-sm font-mono truncate ${
            index === currentIndex
              ? "bg-green-700 text-white"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          {player.name.slice(0, 5)}
        </button>
      ))}
    </div>
  );
}
