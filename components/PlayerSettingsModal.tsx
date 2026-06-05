import { useState } from "react";

type PlayerSettingsModalProps = {
  title: string;
  initialNames: string[];
  errorSuffix?: string;
  onConfirm: (names: string[]) => void;
  onCancel: () => void;
};

const playerCounts = Array.from({ length: 9 }, (_, i) => i + 2);

export function PlayerSettingsModal({
  title,
  initialNames,
  errorSuffix = "。",
  onConfirm,
  onCancel,
}: PlayerSettingsModalProps) {
  const [numPlayers, setNumPlayers] = useState(initialNames.length || 2);
  const [names, setNames] = useState(() =>
    normalizeNames(initialNames, initialNames.length || 2)
  );
  const [error, setError] = useState("");

  const handleNumChange = (nextCount: number) => {
    setNumPlayers(nextCount);
    setNames((current) => normalizeNames(current, nextCount));
  };

  const handleNameChange = (index: number, value: string) => {
    setNames((current) => {
      const next = [...current];
      next[index] = value.slice(0, 5);
      return next;
    });
  };

  const handleConfirm = () => {
    const selectedNames = names.slice(0, numPlayers);
    if (selectedNames.some((name) => name.trim() === "")) {
      setError(`全員の名前を入力してください${errorSuffix}`);
      return;
    }

    onConfirm(selectedNames);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 max-w-sm w-full text-center shadow-lg">
        <h2 className="text-2xl font-sans mb-4 text-gray-100">{title}</h2>

        <div className="mb-4">
          <label className="mr-2 text-gray-300">人数：</label>
          <select
            value={numPlayers}
            onChange={(e) => handleNumChange(Number(e.target.value))}
            className="bg-gray-700 text-gray-100 rounded px-2 py-1"
          >
            {playerCounts.map((count) => (
              <option key={count} value={count}>
                {count}人
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2 mb-4">
          {names.slice(0, numPlayers).map((name, index) => (
            <input
              key={index}
              type="text"
              placeholder={`酒クズ${index + 1}`}
              value={name}
              onChange={(e) => handleNameChange(index, e.target.value)}
              className="w-full px-2 py-1 bg-gray-700 text-gray-100 rounded outline-none"
              maxLength={5}
            />
          ))}
        </div>

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <div className="flex justify-center gap-4">
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-green-700 hover:bg-green-600 rounded text-white font-medium"
          >
            完了
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded text-gray-200"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
}

function normalizeNames(names: string[], count: number) {
  return Array.from({ length: count }, (_, index) => names[index] ?? "");
}
