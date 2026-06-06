"use client";

import { ConfirmModal } from "@/components/ConfirmModal";
import { CounterPanel } from "@/components/CounterPanel";
import { PlayerSelector } from "@/components/PlayerSelector";
import { PlayerSettingsModal } from "@/components/PlayerSettingsModal";
import { applyGlassDelta } from "@/lib/counter";
import { createPlayers, Player, updatePlayersFromNames } from "@/lib/player";
import { useCupInput } from "@/lib/useCounter";
import { useRouter } from "next/navigation";
import { useState } from "react";

function loadPlayers(): Player[] {
  if (typeof window === "undefined") return [];

  const saved = localStorage.getItem("multiPlayerNames");
  if (!saved) return [];

  try {
    const names = JSON.parse(saved);
    return Array.isArray(names) ? createPlayers(names) : [];
  } catch {
    return [];
  }
}

export default function MultiPage() {
  const [players, setPlayers] = useState<Player[]>(loadPlayers);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showBackConfirm, setShowBackConfirm] = useState(false);
  const router = useRouter();
  const currentPlayer = players[currentIndex];
  const {
    cupValue,
    cupInputMode,
    setCupValue,
    setCupInputMode,
    submitCupValue,
    clearCupValue,
  } = useCupInput((delta) => {
      setPlayers((currentPlayers) => {
        const player = currentPlayers[currentIndex];
        if (!player) return currentPlayers;

        const nextPlayers = [...currentPlayers];
        nextPlayers[currentIndex] = {
          ...player,
          ...applyGlassDelta(player, delta),
        };
        return nextPlayers;
      });
    });

  if (!currentPlayer) return null;

  const switchPlayer = (index: number) => {
    setCurrentIndex(index);
    clearCupValue();
  };

  const handleResetCurrent = () => {
    setPlayers((currentPlayers) =>
      currentPlayers.map((player, index) =>
        index === currentIndex ? { ...player, cap: 0, glass: 0 } : player
      )
    );
    clearCupValue();
    setShowConfirm(false);
  };

  const handleResetAll = () => {
    setPlayers((currentPlayers) =>
      currentPlayers.map((player) => ({ ...player, cap: 0, glass: 0 }))
    );
    clearCupValue();
    setShowConfirm(false);
  };

  const handlePlayerSettingsConfirm = (names: string[]) => {
    setPlayers((currentPlayers) => updatePlayersFromNames(currentPlayers, names));
    setCurrentIndex(0);
    setShowPopup(false);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-200 p-6">
      <h1 className="text-3xl font-sans mb-6 border-y-4 border-double border-gray-500 py-2 w-full text-center max-w-md text-gray-100">
        Cap Counter
      </h1>

      <PlayerSelector
        players={players}
        currentIndex={currentIndex}
        onSelect={switchPlayer}
      />

      <CounterPanel
        cap={currentPlayer.cap}
        glass={currentPlayer.glass}
        cupValue={cupValue}
        cupInputMode={cupInputMode}
        onCupValueChange={setCupValue}
        onCupInputModeChange={setCupInputMode}
        onAdd={submitCupValue}
        buttonHeightClass="h-12"
      />

      <div className="flex flex-col items-center w-full max-w-md gap-4">
        <div className="w-full">
          <button
            onClick={() => setShowConfirm(true)}
            className="px-8 py-2 w-full bg-gray-700 hover:bg-gray-600 rounded text-gray-200"
          >
            リセット
          </button>
        </div>

        <div className="w-full">
          <button
            onClick={() => setShowPopup(true)}
            className="px-8 py-2 w-full bg-yellow-700 hover:bg-yellow-600 rounded text-white"
          >
            人数を変更する
          </button>
        </div>

        <div className="w-full">
          <button
            onClick={() => setShowBackConfirm(true)}
            className="px-8 py-2 w-full bg-indigo-700 hover:bg-indigo-600 rounded text-white"
          >
            ぼっちに戻る
          </button>
        </div>
      </div>

      {showConfirm && (
        <ConfirmModal>
          <p className="mb-6 text-gray-200">
            リセットする内容を選んでください。
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleResetCurrent}
              className="px-4 py-2 bg-yellow-700 hover:bg-yellow-600 rounded text-white font-medium"
            >
              この酒クズだけリセット
            </button>
            <button
              onClick={handleResetAll}
              className="px-4 py-2 bg-red-700 hover:bg-red-600 rounded text-white font-medium"
            >
              全員リセット
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded text-gray-200"
            >
              キャンセル
            </button>
          </div>
        </ConfirmModal>
      )}

      {showBackConfirm && (
        <ConfirmModal>
          <p className="mb-6 text-gray-200">
            本当にぼっちに戻るの？<br />
            さみしくない？
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 bg-red-700 hover:bg-red-600 rounded text-white font-medium"
            >
              さみしくない
            </button>
            <button
              onClick={() => setShowBackConfirm(false)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded text-gray-200"
            >
              やっぱりさみしい
            </button>
          </div>
        </ConfirmModal>
      )}

      {showPopup && (
        <PlayerSettingsModal
          key={players.map((player) => player.name).join("|")}
          title="人数変更"
          initialNames={players.map((player) => player.name)}
          errorSuffix=""
          onConfirm={handlePlayerSettingsConfirm}
          onCancel={() => setShowPopup(false)}
        />
      )}
    </main>
  );
}
