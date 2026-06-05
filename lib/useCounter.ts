"use client";

import { useState } from "react";
import { applyGlassDelta, CounterValue } from "./counter";

export type CupValue = string | number;

function parseCupValue(cupValue: CupValue): number {
  return parseInt(String(cupValue)) || 0;
}

export function useCupInput(onApply: (delta: number) => void) {
  const [cupValue, setCupValue] = useState<CupValue>("");

  const submitCupValue = () => {
    const delta = parseCupValue(cupValue);
    if (delta === 0) return;

    onApply(delta);
    setCupValue("");
  };

  const clearCupValue = () => {
    setCupValue("");
  };

  return {
    cupValue,
    setCupValue,
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
