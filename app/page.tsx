"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [capValue, setCapValue] = useState(0);
  const [glassValue, setGlassValue] = useState(0);
  const [cupValue, setCupValue] = useState<string | number>(''); // 空文字OK
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [numPlayers, setNumPlayers] = useState(2);
  const [playerNames, setPlayerNames] = useState<string[]>(Array(2).fill(""));
  const [error, setError] = useState("");

  // 人数変更時に名前入力欄を調整
  const handleNumChange = (num: number) => {
    setNumPlayers(num);

    const newNames = [...playerNames];
    while (newNames.length < num) newNames.push("");  // 足りない分を追加
    while (newNames.length > num) newNames.pop();     // 多すぎた分を削除
    setPlayerNames(newNames);
  };

  // 名前入力変更
  const handleNameChange = (index: number, value: string) => {
    const newNames = [...playerNames];
    newNames[index] = value.slice(0, 5);
    setPlayerNames(newNames);
  };

  // ポップアップを開く
  const openPopup = () => {
    const newNames = [...playerNames];
    while (newNames.length < numPlayers) newNames.push(""); // 足りない分を追加
    while (newNames.length > numPlayers) newNames.pop();    // 多すぎた分を削除
    setPlayerNames(newNames);

    setError("");
    setShowPopup(true);
  };

  // 完了ボタン押下
  const handleConfirm = () => {
    // 入力チェック
    if (playerNames.some((n) => n.trim() === "")) {
      setError("全員の名前を入力してください。");
      return;
    }

    localStorage.setItem(
      "multiPlayerNames",
      JSON.stringify(playerNames.slice(0, numPlayers))
    );

    setError("");
    setShowPopup(false);
    router.push("/multi");  
  };

  // キャンセル
  const handleCancel = () => {
    setShowPopup(false);
    setError("");
  };

  // リセット処理
  const resetAll = () => {
    setCapValue(0);
    setGlassValue(0);
    setCupValue('');
    setShowConfirm(false);
  };

  // 追加処理（総量方式）
  const handleAdd = () => {
    const numValue = parseInt(String(cupValue)) || 0;
    if (numValue === 0) return;

    // 現在の総量から計算
    let total = capValue * 5 + glassValue + numValue;

    let newCaps = Math.floor(total / 5);
    let newGlasses = total % 5;

    // グラスが負になった場合の補正
    if (newGlasses < 0) {
      newGlasses += 5;
    }

    setCapValue(newCaps);
    setGlassValue(newGlasses);
    setCupValue(''); // 入力欄をリセット（空）
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-200 p-6">
      {/* タイトル */}
      <h1 className="text-3xl font-serif mb-6 border-y-4 border-double border-gray-500 py-2 w-full text-center max-w-md text-gray-100">
        Cap Counter
      </h1>

      {/* === ポップアップ === */}
      {showPopup && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 max-w-sm w-full text-center shadow-lg">
            <h2 className="text-2xl font-sans mb-4 text-gray-100">
              複数人モード設定
            </h2>

            {/* 人数選択 */}
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

            {/* 名前入力欄 */}
            <div className="space-y-2 mb-4">
              {playerNames.slice(0, numPlayers).map((name, i) => (
                <input
                  key={i}
                  type="text"
                  placeholder={`酒クズ${i + 1}`}
                  value={name}
                  onChange={(e) => handleNameChange(i, e.target.value)}
                  className="w-full px-2 py-1 bg-gray-700 text-gray-100 rounded outline-none"
                  maxLength={5}
                />
              ))}
            </div>

            {/* エラーメッセージ */}
            {error && (
              <p className="text-red-400 text-sm mb-3">{error}</p>
            )}

            {/* ボタン群 */}
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

      {/* キャップ／グラス表示 */}
      <div className="grid grid-cols-2 gap-4 mb-6 w-full max-w-md">
        <div className="flex flex-col items-center">
          <label className="mb-1 text-sm text-gray-300">キャップ</label>
          <div className="border border-red-500 h-20 w-full flex items-center justify-center rounded-sm text-2xl font-mono">
            {capValue}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <label className="mb-1 text-sm text-gray-300">グラス半分</label>
          <div className="border border-red-500 h-20 w-full flex items-center justify-center rounded-sm text-2xl font-mono">
            {glassValue}
          </div>
        </div>
      </div>

      {/* 杯入力欄＋追加ボタン */}
      <div className="flex items-end justify-between mb-6 w-full max-w-md">
        <div className="flex items-end flex-grow mr-4">
          <div className="border border-green-500 h-12 flex-grow flex items-center justify-center rounded-sm text-gray-300">
            <input
              type="number"
              value={cupValue}
              onChange={(e) => {
                const val = e.target.value;
                setCupValue(val === '' ? '' : Number(val));
              }}
              className="w-full h-full text-center bg-transparent text-gray-200 outline-none"
              placeholder="入力…" // ← 空時の表示
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
        {/* 上段（＋） */}
        {Array.from({ length: 6 }).map((_, i) => (
          <button
            key={`plus-${i}`}
            onClick={() => setCupValue(i + 1)}
            className="h-16 flex items-center justify-center bg-blue-900/40 hover:bg-blue-800/50 rounded text-gray-100"
          >
            ＋{i + 1}
          </button>
        ))}
        {/* 下段（－） */}
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
      <button
        onClick={() => setShowConfirm(true)}
        className="px-8 py-2 w-full max-w-md bg-gray-700 hover:bg-gray-600 rounded text-gray-200"
      >
        リセット
      </button>

      {/* 確認モーダル */}
      {showConfirm && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 max-w-sm w-full text-center shadow-lg">
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
          </div>
        </div>
      )}

      <div className="w-full max-w-md mt-6">
        <button
          onClick={openPopup}
          className="w-full px-4 py-2 bg-indigo-700 hover:bg-indigo-600 rounded text-gray-100 text-sm transition"
        >
          ひとりぼっちじゃないもん
        </button>
      </div>
    </main>
  );
}
