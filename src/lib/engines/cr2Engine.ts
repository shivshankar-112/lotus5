import type { DiffConfig, Difficulty, CellType, GridCell } from "@/types/cr2";

export const DIFF_CONFIGS: Record<Difficulty, DiffConfig> = {
  easy:     { lanes: 20, hitBase: 0.10, step: 1.06,  label: "EASY"     },
  medium:   { lanes: 18, hitBase: 0.18, step: 1.10,  label: "MEDIUM"   },
  hard:     { lanes: 15, hitBase: 0.28, step: 1.16,  label: "HARD"     },
  hardcore: { lanes: 12, hitBase: 0.38, step: 1.24,  label: "HARDCORE" },
};

export const NUM_COLS   = 3;
export const LANE_H_PX  = 110; // px per lane on canvas
export const START_BAL  = 999_997;
export const CHICKEN_COL = 0;  // chicken always starts in left column

export const VEHICLE_COLORS = [
  "#e74c3c", "#c0392b", // reds
  "#3498db", "#2980b9", // blues
  "#27ae60", "#16a085", // greens
  "#e67e22", "#d35400", // oranges
  "#8e44ad",            // purple
];

// ── Seeded pseudo-random ──────────────────────────────────────────────────────
function sr(s: number): number {
  const x = Math.sin(s + 1) * 9999;
  return x - Math.floor(x);
}

// ── Multiplier for a lane ─────────────────────────────────────────────────────
export function laneMult(lane: number, diff: Difficulty): number {
  return parseFloat(Math.pow(DIFF_CONFIGS[diff].step, lane).toFixed(2));
}

// ── Generate the grid for a round ────────────────────────────────────────────
// Returns a flat array of GridCell, one per (lane, col) that has an object.
// Lane 0 = start row (always empty except chicken).
export function generateGrid(totalLanes: number, diff: Difficulty, seed: number): GridCell[] {
  const cells: GridCell[] = [];
  const vehicleTypes: CellType[] = ["car", "car", "truck", "bus", "firetruck"];

  for (let lane = 1; lane <= totalLanes; lane++) {
    const laneR = sr(lane * 137 + seed);
    const mult  = laneMult(lane, diff);

    // Decide how many obstacles per lane (1 or 2)
    const isBarrierLane = laneR < 0.16;
    const isManholeOnly = !isBarrierLane && laneR > 0.75;
    const numObstacles  = isBarrierLane ? 1 : isManholeOnly ? 2 : 1 + Math.floor(sr(lane * 71 + seed) * 2);

    // Which columns get obstacles — never CHICKEN_COL on current lane (chicken might be there)
    const availCols = [0, 1, 2];
    const usedCols  = new Set<number>();
    for (let i = 0; i < numObstacles; i++) {
      const candidates = availCols.filter((c) => !usedCols.has(c));
      if (!candidates.length) break;
      const chosen = candidates[Math.floor(sr(lane * 53 + i * 17 + seed) * candidates.length)];
      usedCols.add(chosen);

      if (isBarrierLane) {
        cells.push({ lane, col: chosen, type: "barrier" });
      } else if (isManholeOnly) {
        cells.push({ lane, col: chosen, type: "manhole", mult });
      } else {
        const vType = vehicleTypes[Math.floor(sr(lane * 89 + i + seed) * vehicleTypes.length)];
        const color = VEHICLE_COLORS[Math.floor(sr(lane * 61 + i + seed) * VEHICLE_COLORS.length)];
        cells.push({ lane, col: chosen, type: vType, color, mult });
      }
    }

    // Always put a manhole with multiplier in remaining cols for reference
    availCols.forEach((c) => {
      if (!usedCols.has(c) && sr(lane * 43 + c + seed) > 0.5) {
        cells.push({ lane, col: c, type: "manhole", mult });
      }
    });
  }

  return cells;
}

// ── Hit detection ─────────────────────────────────────────────────────────────
export function isHit(lane: number, col: number, diff: Difficulty, grid: GridCell[]): boolean {
  const cellsInLane = grid.filter((c) => c.lane === lane);
  // If chicken's col has a non-barrier obstacle → potential hit
  const chickenCell = cellsInLane.find((c) => c.col === col);
  if (!chickenCell) return false;
  if (chickenCell.type === "barrier") return false; // barriers are safe

  // Probabilistic hit
  const prob = DIFF_CONFIGS[diff].hitBase + lane * 0.01;
  return Math.random() < prob;
}

// ── API adapter ───────────────────────────────────────────────────────────────
export async function fetchStepResult(
  lane: number,
  col: number,
  diff: Difficulty,
  grid: GridCell[]
): Promise<{ hit: boolean; isBarrier: boolean }> {
  // DEMO MODE
  await new Promise((r) => setTimeout(r, 40));
  const cellsInLane = grid.filter((c) => c.lane === lane && c.col === col);
  const isBarrier = cellsInLane.some((c) => c.type === "barrier");
  if (isBarrier) return { hit: false, isBarrier: true };
  const prob = DIFF_CONFIGS[diff].hitBase + lane * 0.01;
  const hit = Math.random() < prob;
  return { hit, isBarrier: false };

  // REAL API:
  // const res = await fetch("/api/cr2/step", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ lane, col, diff }),
  // });
  // return res.json();
}