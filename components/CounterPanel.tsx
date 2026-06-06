import { addToCupValue, CupInputMode, CupValue } from "@/lib/useCounter";

type CounterPanelProps = {
  cap: number;
  glass: number;
  cupValue: CupValue;
  cupInputMode: CupInputMode;
  onCupValueChange: (value: CupValue) => void;
  onCupInputModeChange: (mode: CupInputMode) => void;
  onAdd: () => void;
  buttonHeightClass?: string;
};

type UnitButtonProps = {
  label: string;
  isSelected: boolean;
  onClick: () => void;
};

const cupChoices = Array.from({ length: 6 }, (_, i) => i + 1);
const quickButtonWidthClass = "w-[calc((min(100vw-3rem,28rem)-2.5rem)/6)]";

export function CounterPanel({
  cap,
  glass,
  cupValue,
  cupInputMode,
  onCupValueChange,
  onCupInputModeChange,
  onAdd,
  buttonHeightClass = "h-16",
}: CounterPanelProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4 mb-6 w-full max-w-md">
        <div className="flex flex-col items-center">
          <label className="mb-1 text-sm text-gray-300">キャップ</label>
          <div className="border border-red-500 h-20 w-full flex items-center justify-center rounded-sm text-3xl font-mono">
            {cap}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <label className="mb-1 text-sm text-gray-300">グラス半分</label>
          <div className="border border-red-500 h-20 w-full flex items-center justify-center rounded-sm text-3xl font-mono">
            {glass}
          </div>
        </div>
      </div>

      <div className="flex items-end justify-between gap-2 mb-6 w-full max-w-md">
        <div className="flex items-end flex-grow min-w-0 gap-2">
          <div className="grid grid-cols-2 gap-2 shrink-0">
            <UnitButton
              label="キャップ"
              isSelected={cupInputMode === "cap"}
              onClick={() => onCupInputModeChange("cap")}
            />
            <UnitButton
              label="半分"
              isSelected={cupInputMode === "glass"}
              onClick={() => onCupInputModeChange("glass")}
            />
          </div>
          <div className="border border-green-500 h-12 flex-grow min-w-0 flex items-center justify-center rounded-sm text-gray-300">
            <input
              type="number"
              value={cupValue}
              onChange={(e) => {
                const value = e.target.value;
                onCupValueChange(value === "" ? "" : Number(value));
              }}
              className="w-full h-full text-center bg-transparent text-gray-200 outline-none"
              placeholder="入力…"
            />
          </div>
          <label className="text-sm mb-1 text-gray-300">杯</label>
        </div>
        <button
          onClick={onAdd}
          className="h-12 px-4 bg-green-900/40 hover:bg-green-800/50 rounded text-gray-200 shrink-0"
        >
          追加
        </button>
      </div>

      <div className="grid grid-cols-6 gap-2 mb-6 w-full max-w-md">
        {cupChoices.map((value) => (
          <button
            key={`plus-${value}`}
            onClick={() => onCupValueChange(addToCupValue(cupValue, value))}
            className={`${buttonHeightClass} flex items-center justify-center bg-blue-900/40 hover:bg-blue-800/50 rounded text-gray-100`}
          >
            ＋{value}
          </button>
        ))}
        {cupChoices.map((value) => (
          <button
            key={`minus-${value}`}
            onClick={() => onCupValueChange(addToCupValue(cupValue, -value))}
            className={`${buttonHeightClass} flex items-center justify-center bg-pink-900/40 hover:bg-pink-800/50 rounded text-gray-100`}
          >
            －{value}
          </button>
        ))}
      </div>
    </>
  );
}

function UnitButton({ label, isSelected, onClick }: UnitButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`h-12 ${quickButtonWidthClass} flex items-center justify-center rounded text-xs ${
        isSelected
          ? "bg-green-700 text-white"
          : "bg-gray-700 text-gray-200 hover:bg-gray-600"
      }`}
      type="button"
    >
      {label}
    </button>
  );
}
