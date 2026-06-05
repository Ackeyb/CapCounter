import { CupValue } from "@/lib/useCounter";

type CounterPanelProps = {
  cap: number;
  glass: number;
  cupValue: CupValue;
  onCupValueChange: (value: CupValue) => void;
  onAdd: () => void;
  buttonHeightClass?: string;
};

const cupChoices = Array.from({ length: 6 }, (_, i) => i + 1);

export function CounterPanel({
  cap,
  glass,
  cupValue,
  onCupValueChange,
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

      <div className="flex items-end justify-between mb-6 w-full max-w-md">
        <div className="flex items-end flex-grow mr-4">
          <div className="border border-green-500 h-12 flex-grow flex items-center justify-center rounded-sm text-gray-300">
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
          <label className="text-sm ml-2 mb-1 text-gray-300">杯</label>
        </div>
        <button
          onClick={onAdd}
          className="h-12 px-4 bg-green-900/40 hover:bg-green-800/50 rounded text-gray-200"
        >
          追加
        </button>
      </div>

      <div className="grid grid-cols-6 gap-2 mb-6 w-full max-w-md">
        {cupChoices.map((value) => (
          <button
            key={`plus-${value}`}
            onClick={() => onCupValueChange(value)}
            className={`${buttonHeightClass} flex items-center justify-center bg-blue-900/40 hover:bg-blue-800/50 rounded text-gray-100`}
          >
            ＋{value}
          </button>
        ))}
        {cupChoices.map((value) => (
          <button
            key={`minus-${value}`}
            onClick={() => onCupValueChange(-value)}
            className={`${buttonHeightClass} flex items-center justify-center bg-pink-900/40 hover:bg-pink-800/50 rounded text-gray-100`}
          >
            －{value}
          </button>
        ))}
      </div>
    </>
  );
}
