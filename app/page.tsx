"use client";

import { ConfirmModal } from "@/components/ConfirmModal";
import { CounterPanel } from "@/components/CounterPanel";
import { PlayerSettingsModal } from "@/components/PlayerSettingsModal";
import { useCounter } from "@/lib/useCounter";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const {
    counter,
    cupValue,
    cupInputMode,
    setCupValue,
    setCupInputMode,
    submitCupValue,
    resetCounter,
  } = useCounter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const resetAll = () => {
    resetCounter();
    setShowConfirm(false);
  };

  const startMultiMode = (playerNames: string[]) => {
    localStorage.setItem("multiPlayerNames", JSON.stringify(playerNames));
    setShowPopup(false);
    router.push("/multi");
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-200 p-6">
      <h1 className="text-3xl font-serif mb-6 border-y-4 border-double border-gray-500 py-2 w-full text-center max-w-md text-gray-100">
        Cap Counter
      </h1>

      {showPopup && (
        <PlayerSettingsModal
          title="複数人モード設定"
          initialNames={Array(2).fill("")}
          onConfirm={startMultiMode}
          onCancel={() => setShowPopup(false)}
        />
      )}

      <CounterPanel
        cap={counter.cap}
        glass={counter.glass}
        cupValue={cupValue}
        cupInputMode={cupInputMode}
        onCupValueChange={setCupValue}
        onCupInputModeChange={setCupInputMode}
        onAdd={submitCupValue}
      />

      <button
        onClick={() => setShowConfirm(true)}
        className="px-8 py-2 w-full max-w-md bg-gray-700 hover:bg-gray-600 rounded text-gray-200"
      >
        リセット
      </button>

      {showConfirm && (
        <ConfirmModal>
          <p className="mb-6 text-gray-200">
            表示中のデータをすべてリセットするぞ。<br />
            本当に良いのか？
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={resetAll}
              className="px-4 py-2 bg-red-700 hover:bg-red-600 rounded text-white font-medium"
            >
              はい
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded text-gray-200"
            >
              いいえ
            </button>
          </div>
        </ConfirmModal>
      )}

      <div className="w-full max-w-md mt-6">
        <button
          onClick={() => setShowPopup(true)}
          className="w-full px-8 py-2 bg-indigo-700 hover:bg-indigo-600 rounded text-gray-200 font-normal transition"
        >
          ひとりぼっちじゃないもん
        </button>
      </div>
    </main>
  );
}
