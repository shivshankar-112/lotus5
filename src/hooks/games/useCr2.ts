"use client";

import { useState, useCallback, useRef } from "react";
import type { GameState, Difficulty, GridCell, RoundRecord } from "@/types/cr2";
import {
  DIFF_CONFIGS, START_BAL, CHICKEN_COL,
  generateGrid, fetchStepResult, laneMult,
} from "@/lib/engines/cr2Engine";

const INITIAL: GameState = {
  phase: "idle",
  lane: 0,
  totalLanes: DIFF_CONFIGS.easy.lanes,
  bet: 3,
  mult: 1.0,
  balance: START_BAL,
  diff: "easy",
  wins: 0, losses: 0, pnl: 0,
  history: [],
};

export interface ToastMsg { id: number; text: string; color: string }
let _tid = 0;

export function useCR2() {
  const [state, setState]   = useState<GameState>(INITIAL);
  const [grid, setGrid]     = useState<GridCell[]>([]);
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const stateRef = useRef<GameState>(INITIAL);
  const gridRef  = useRef<GridCell[]>([]);

  // Canvas callbacks
  const onStartRef   = useRef<(grid: GridCell[]) => void>(() => {});
  const onAdvanceRef = useRef<(lane: number, isBarrier: boolean) => void>(() => {});
  const onDeathRef   = useRef<() => void>(() => {});
  const onWinRef     = useRef<() => void>(() => {});

  const set = useCallback((fn: (s: GameState) => GameState) => {
    setState((prev) => {
      const next = fn(prev);
      stateRef.current = next;
      return next;
    });
  }, []);

  function toast(text: string, color: string) {
    const id = ++_tid;
    setToasts((p) => [...p, { id, text, color }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 2500);
  }

  // ── Start ─────────────────────────────────────────────────────────────
  const startRound = useCallback(() => {
    const s = stateRef.current;
    if (s.phase !== "idle") return;
    if (s.bet < 1 || s.bet > s.balance) { toast("Invalid bet", "#f87171"); return; }

    const seed = Math.floor(Math.random() * 99999);
    const newGrid = generateGrid(DIFF_CONFIGS[s.diff].lanes, s.diff, seed);
    gridRef.current = newGrid;
    setGrid(newGrid);

    set((p) => ({
      ...p,
      phase: "running",
      lane: 0, mult: 1.0,
      balance: +(p.balance - p.bet).toFixed(2),
      totalLanes: DIFF_CONFIGS[p.diff].lanes,
    }));

    onStartRef.current?.(newGrid);
  }, [set]);

  // ── Advance ───────────────────────────────────────────────────────────
  const advanceLane = useCallback(async () => {
    const s = stateRef.current;
    if (s.phase !== "running") return;

    const nextLane = s.lane + 1;
    if (nextLane > s.totalLanes) return;

    const { hit, isBarrier } = await fetchStepResult(
      nextLane, CHICKEN_COL, s.diff, gridRef.current
    );

    const newMult = laneMult(nextLane, s.diff);

    if (hit) {
      const rec: RoundRecord = { mult: s.mult, won: false, lanes: s.lane, payout: 0, bet: s.bet };
      set((p) => ({
        ...p, phase: "dead",
        losses: p.losses + 1,
        pnl: +(p.pnl - p.bet).toFixed(2),
        history: [rec, ...p.history].slice(0, 50),
      }));
      onDeathRef.current?.();
      toast(`💥 Squashed at lane ${s.lane}!`, "#f87171");
      setTimeout(() => set((p) => ({ ...p, phase: "idle", lane: 0, mult: 1.0 })), 2600);
      return;
    }

    set((p) => ({ ...p, lane: nextLane, mult: newMult }));
    onAdvanceRef.current?.(nextLane, isBarrier);

    if (nextLane >= s.totalLanes) {
      const payout = +(s.bet * newMult).toFixed(2);
      const rec: RoundRecord = { mult: newMult, won: true, lanes: nextLane, payout, bet: s.bet };
      set((p) => ({
        ...p, phase: "won",
        balance: +(p.balance + payout).toFixed(2),
        wins: p.wins + 1,
        pnl: +(p.pnl + payout - p.bet).toFixed(2),
        history: [rec, ...p.history].slice(0, 50),
      }));
      onWinRef.current?.();
      toast(`🏆 Crossed all! +₹${payout.toFixed(2)}`, "#fbbf24");
      setTimeout(() => set((p) => ({ ...p, phase: "idle", lane: 0, mult: 1.0 })), 3000);
    }
  }, [set]);

  // ── Cash out ──────────────────────────────────────────────────────────
  const cashOut = useCallback(() => {
    const s = stateRef.current;
    if (s.phase !== "running" || s.lane === 0) return;
    const payout  = +(s.bet * s.mult).toFixed(2);
    const profit  = +(payout - s.bet).toFixed(2);
    const rec: RoundRecord = { mult: s.mult, won: true, lanes: s.lane, payout, bet: s.bet };
    set((p) => ({
      ...p, phase: "idle", lane: 0, mult: 1.0,
      balance: +(p.balance + payout).toFixed(2),
      wins: p.wins + 1,
      pnl: +(p.pnl + profit).toFixed(2),
      history: [rec, ...p.history].slice(0, 50),
    }));
    onWinRef.current?.();
    toast(`💰 Cashed out ${s.mult.toFixed(2)}x → +₹${payout.toFixed(2)}`, "#fbbf24");
  }, [set]);

  const setBet = useCallback((v: number) =>
    set((p) => ({ ...p, bet: Math.max(1, Math.min(p.balance, v)) })), [set]);

  const setDiff = useCallback((d: Difficulty) =>
    set((p) => p.phase !== "idle" ? p : { ...p, diff: d, totalLanes: DIFF_CONFIGS[d].lanes }), [set]);

  const addFunds = useCallback((amt: number) => {
    set((p) => ({ ...p, balance: +(p.balance + amt).toFixed(2) }));
    toast(`+₹${amt.toLocaleString("en-IN")} added`, "#4ade80");
  }, [set]);

  return {
    state, grid, toasts,
    startRound, advanceLane, cashOut,
    setBet, setDiff, addFunds,
    onStartRef, onAdvanceRef, onDeathRef, onWinRef,
  };
}