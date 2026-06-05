import assert from "node:assert/strict";
import test from "node:test";
import { applyGlassDelta } from "./counter";

test("increments a cap when glasses reach five", () => {
  assert.deepEqual(applyGlassDelta({ cap: 0, glass: 4 }, 1), {
    cap: 1,
    glass: 0,
  });
});

test("borrows from cap when subtracting from zero glass", () => {
  assert.deepEqual(applyGlassDelta({ cap: 1, glass: 0 }, -1), {
    cap: 0,
    glass: 4,
  });
});

test("keeps the mathematical representation for negative totals", () => {
  assert.deepEqual(applyGlassDelta({ cap: 0, glass: 3 }, -4), {
    cap: -1,
    glass: 4,
  });
});

test("normalizes larger positive and negative deltas", () => {
  assert.deepEqual(applyGlassDelta({ cap: 2, glass: 2 }, 8), {
    cap: 4,
    glass: 0,
  });
  assert.deepEqual(applyGlassDelta({ cap: 2, glass: 2 }, -3), {
    cap: 1,
    glass: 4,
  });
});
