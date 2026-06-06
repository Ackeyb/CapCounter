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
  const cap = Math.trunc(total / GLASSES_PER_CAP);
  const glass = total % GLASSES_PER_CAP;

  return {
    cap: Object.is(cap, -0) ? 0 : cap,
    glass,
  };
}
