export type CounterValue = {
  cap: number;
  glass: number;
};

const GLASSES_PER_CAP = 5;

export function applyGlassDelta(
  current: CounterValue,
  delta: number
): CounterValue {
  const total = current.cap * GLASSES_PER_CAP + current.glass + delta;
  const glass =
    ((total % GLASSES_PER_CAP) + GLASSES_PER_CAP) % GLASSES_PER_CAP;

  return {
    cap: Math.floor(total / GLASSES_PER_CAP),
    glass,
  };
}
