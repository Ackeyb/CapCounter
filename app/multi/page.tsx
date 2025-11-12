"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Player = { name: string; cap: number; glass: number };

export default function MultiPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cupValue, setCupValue] = useState<string | number>("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [tempNames, setTempNames] = useState<string[]>([]);
  const [numPlayers, setNumPlayers] = useState(0);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("multiPlayerNames");
    if (saved) {
      const names: string[] = JSON.parse(saved);
      setPlayers(names.map((n) => ({ name: n, cap: 0, glass: 0 })));
      setNumPlayers(names.length);
    }
  }, []);

  if (players.length === 0) return null; // 名前未設定時は何も表示しない

  const currentPlayer = players[currentIndex];

  const switchPlayer = (index: number) => {
    setCurrentIndex(index);
    setCupValue("");
  };

  const handleAdd = () => {
    const numValue = parseInt(String(cupValue)) || 0;
    if (numValue === 0) return;

    let total = currentPlayer.cap * 5 + currentPlayer.glass + numValue;
    const newCap = Math.floor(total / 5);
    const newGlass = total % 5;

    const newPlayers = [...players];
    newPlayers[currentIndex] = { ...currentPlayer, cap: newCap, glass: newGlass };
    setPlayers(newPlayers);
    setCupValue("");
  };

    // 現在のプレイヤーだけリセット
    const handleResetCurrent = () => {
    const newPlayers = [...players];
    newPlayers[currentIndex] = { ...currentPlayer, cap: 0, glass: 0 };
    setPlayers(newPlayers);
    setCupValue("");
    setShowConfirm(false);
    };

    // 全員リセット
    const handleResetAll = () => {
    const newPlayers = players.map(p => ({ ...p, cap: 0, glass: 0 }));
    setPlayers(newPlayers);
    setCupValue("");
    setShowConfirm(false);
    };

  const goAlone = () => {
    // ひとりモードトップページに戻る
    router.push("/");
  };


  const openPopup = () => {
    setTempNames(players.map((p) => p.name));
    setNumPlayers(players.length);
    setError("");
    setShowPopup(true);
  };

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...tempNames];
    newNames[index] = value;
    setTempNames(newNames);
  };

  const handleNumChange = (n: number) => {
    setNumPlayers(n);
    if (n > tempNames.length) {
      setTempNames([...tempNames, ...Array(n - tempNames.length).fill("")]);
    } else {
      setTempNames(tempNames.slice(0, n));
    }
  };

  const handleConfirm = () => {
    if (tempNames.slice(0, numPlayers).some((n) => n.trim() === "")) {
      setError("全員の名前を入力してください");
      return;
    }
    setPlayers(tempNames.slice(0, numPlayers).map((n) => ({ name: n, cap: 0, glass: 0 })));
    setCurrentIndex(0);
    setShowPopup(false);
  };

  const handleCancel = () => {
    setTempNames(players.map((p) => p.name));
    setNumPlayers(players.length);
    setError("");
    setShowPopup(false);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-200 p-6">
      <h1 className="text-3xl font-sans mb-6 border-y-4 border-double border-gray-500 py-2 w-full text-center max-w-md text-gray-100">
        Cap Counter
      </h1>

      {/* ユーザー切替ボタン */}
<div className="grid grid-cols-5 gap-2 mb-6 w-full max-w-md">
  {players.map((p, i) => (
    <button
      key={i}
      onClick={() => switchPlayer(i)}
      className={`h-12 w-full flex items-center justify-center rounded text-gray-100 text-sm font-mono truncate
        ${i === currentIndex ? "bg-green-700 text-white" : "bg-gray-700 hover:bg-gray-600"}`}
    >
      {p.name.slice(0, 5)}
    </button>
  ))}
</div>

      {/* キャップ／グラス表示 */}
      <div className="grid grid-cols-2 gap-4 mb-6 w-full max-w-md">
        <div className="flex flex-col items-center">
          <label className="mb-1 text-sm text-gray-300">キャップ</label>
          <div className="border border-red-500 h-20 w-full flex items-center justify-center rounded-sm text-2xl font-mono">
            {currentPlayer.cap}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <label className="mb-1 text-sm text-gray-300">グラス半分</label>
          <div className="border border-red-500 h-20 w-full flex items-center justify-center rounded-sm text-2xl font-mono">
            {currentPlayer.glass}
          </div>
        </div>
      </div>

      {/* 杯入力＋追加ボタン */}
      <div className="flex items-end justify-between mb-6 w-full max-w-md">
        <div className="flex items-end flex-grow mr-4">
          <div className="border border-green-500 h-12 flex-grow flex items-center justify-center rounded-sm text-gray-300">
            <input
              type="number"
              value={cupValue}
              onChange={(e) => setCupValue(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full h-full text-center bg-transparent text-gray-200 outline-none"
              placeholder="入力…"
            />
          </div>
          <label className="text-sm ml-2 mb-1 text-gray-300">杯</label>
        </div>
        <button
          onClick={handleAdd}
          className="h-12 px-4 bg-green-900/40 hover:bg-green-800/50 rounded text-gray-200"
        >
          追加
        </button>
      </div>

      {/* ＋／－ボタン群 */}
      <div className="grid grid-cols-6 gap-2 mb-6 w-full max-w-md">
        {Array.from({ length: 6 }).map((_, i) => (
          <button
            key={`plus-${i}`}
            onClick={() => setCupValue(i + 1)}
            className="h-16 flex items-center justify-center bg-blue-900/40 hover:bg-blue-800/50 rounded text-gray-100"
          >
            ＋{i + 1}
          </button>
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <button
            key={`minus-${i}`}
            onClick={() => setCupValue(-(i + 1))}
            className="h-16 flex items-center justify-center bg-pink-900/40 hover:bg-pink-800/50 rounded text-gray-100"
          >
            －{i + 1}
          </button>
        ))}
      </div>

    {/* リセットボタン */}
    <div className="flex flex-col items-center w-full max-w-md gap-4">
        <div className="w-full">
            <button
            onClick={() => setShowConfirm(true)}
            className="px-8 py-2 w-full bg-gray-700 hover:bg-gray-600 rounded text-gray-200"
            >
            リセット
            </button>
        </div>

        {/* 確認モーダル */}
        {showConfirm && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 max-w-sm w-full text-center shadow-lg">
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
            </div>
        </div>
        )}


    {/* 人数変更ボタン */}
    <div className="w-full">
        <button
        onClick={openPopup}
        className="px-8 py-2 w-full bg-yellow-700 hover:bg-yellow-600 rounded text-white"
        >
        人数を変更する
        </button>
    </div>
  
    {/* ぼっちに戻るボタン */}
    <div className="w-full">
        <button
        onClick={goAlone}  
        className="px-8 py-2 w-full bg-indigo-700 hover:bg-indigo-600 rounded text-white"
        >
        ぼっちに戻る
        </button>
    </div>
    </div>


      {/* === ポップアップ === */}
      {showPopup && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 max-w-sm w-full text-center shadow-lg">
            <h2 className="text-lg font-sans mb-4 text-gray-100">人数変更</h2>

            <div className="mb-4">
              <label className="mr-2 text-gray-300">人数：</label>
              <select
                value={numPlayers}
                onChange={(e) => handleNumChange(Number(e.target.value))}
                className="bg-gray-700 text-gray-100 rounded px-2 py-1"
              >
                {Array.from({ length: 10 }).map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}人
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2 mb-4">
              {tempNames.slice(0, numPlayers).map((name, i) => (
                <input
                  key={i}
                  type="text"
                  placeholder={`プレイヤー${i + 1}の名前`}
                  value={name}
                  onChange={(e) => handleNameChange(i, e.target.value)}
                  className="w-full px-2 py-1 bg-gray-700 text-gray-100 rounded outline-none"
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
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded text-gray-200"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}