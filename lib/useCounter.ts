"use client";

import { useState } from "react";
import { applyGlassDelta, CounterValue } from "./counter";

export type CupValue = string | number;
export type CupInputMode = "cap" | "glass";

const GLASSES_PER_CAP = 5;

export function parseCupValue(cupValue: CupValue): number {
  return parseInt(String(cupValue)) || 0;
}

export function getCupDelta(
  cupValue: CupValue,
  cupInputMode: CupInputMode
): number {
  const parsedValue = parseCupValue(cupValue);
  return cupInputMode === "cap" ? parsedValue * GLASSES_PER_CAP : parsedValue;
}

export function addToCupValue(cupValue: CupValue, delta: number): number {
  return parseCupValue(cupValue) + delta;
}

export function useCupInput(onApply: (delta: number) => void) {
  const [cupValue, setCupValue] = useState<CupValue>("");
  const [cupInputMode, setCupInputMode] = useState<CupInputMode>("glass");
  const submitCupValue = () => {
    const delta = getCupDelta(cupValue, cupInputMode);
    if (delta === 0) return;

    onApply(delta);
    setCupValue("");
  };

  const clearCupValue = () => {
    setCupValue("");
  };

  return {
    cupValue,
    cupInputMode,
    setCupValue,
    setCupInputMode,
    submitCupValue,
    clearCupValue,
  };
}

export function useCounter(initialValue: CounterValue = { cap: 0, glass: 0 }) {
  const [counter, setCounter] = useState(initialValue);
  const cupInput = useCupInput((delta) => {
    setCounter((current) => applyGlassDelta(current, delta));
  });

  const resetCounter = () => {
    setCounter({ cap: 0, glass: 0 });
    cupInput.clearCupValue();
  };

  return {
    counter,
    resetCounter,
    ...cupInput,
  };
}
