"use client";
import { useState } from "react";

export default function HomePage() {
  const [capValue, setCapValue] = useState(0);
  const [glassValue, setGlassValue] = useState(0);
  const [cupValue, setCupValue] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // リセット実行
  const resetAll = () => {
    setCapValue(0);
    setGlassValue(0);
    setCupValue(0);
    setInputValue('');
    setShowConfirm(false);
  };

  // 加算／減算処理
  const handleButtonClick = (value: number) => {
    setCupValue((prev) => prev + value);
  };

  // 追加処理（5で割って商と余りを分配）
  const handleAdd = () => {
    const numValue = cupValue || 0; // ← cupValue を使う
    if (numValue === 0) return;

    let newCaps = capValue + Math.floor(numValue / 5);
    let newGlasses = glassValue + (numValue % 5);

    if (newGlasses >= 5) {
      newCaps += Math.floor(newGlasses / 5);
      newGlasses = newGlasses % 5;
    }

    setCapValue(newCaps);
    setGlassValue(newGlasses);
    setCupValue(0); // 入力欄リセット
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-200 p-6">
      {/* タイトル */}
      <h1 className="text-3xl font-serif mb-6 border-y-4 border-double border-gray-500 py-2 w-full text-center max-w-md text-gray-100">
        Cap Counter
      </h1>

      {/* 上段2枠（キャップ・グラス半分） */}
      <div className="grid grid-cols-2 gap-4 mb-6 w-full max-w-md">
        <div className="flex flex-col items-center">
          <label className="mb-1 text-sm text-gray-300">キャップ</label>
          <div className="border border-red-500 h-20 w-full flex items-center justify-center rounded-sm text-gray-300 text-2xl font-mono">
            {capValue}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <label className="mb-1 text-sm text-gray-300">グラス半分</label>
          <div className="border border-red-500 h-20 w-full flex items-center justify-center rounded-sm text-gray-300 text-2xl font-mono">
            {glassValue}
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
              onChange={(e) => setCupValue(Number(e.target.value) || 0)}
              className="w-full h-full text-center bg-transparent text-gray-200 outline-none"
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

      {/* 12マス（6×2） */}
      <div className="grid grid-cols-6 gap-2 mb-6 w-full max-w-md">
        {/* 上段（＋） */}
        {Array.from({ length: 6 }).map((_, i) => (
          <button
            key={`plus-${i}`}
            onClick={() => handleButtonClick(i + 1)}
            className="h-16 flex items-center justify-center bg-blue-900/40 hover:bg-blue-800/50 rounded text-gray-100"
          >
            ＋{i + 1}
          </button>
        ))}

        {/* 下段（－） */}
        {Array.from({ length: 6 }).map((_, i) => (
          <button
            key={`minus-${i}`}
            onClick={() => handleButtonClick(-(i + 1))}
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

      {/* === カスタム確認モーダル === */}
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
    </main>
  );
}