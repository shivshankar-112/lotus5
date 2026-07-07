// useGameEngine.ts
// Updated version
//
// Changes:
// - updateState helper keeps stateRef in sync.
// - No side effects inside state updater.
// - Named socket handlers with proper cleanup.
// - Optimistic wallet rollback on failed bet.
// - Fixed callback dependencies.
//
// NOTE:
// Replace this file over your existing one if the imported
// types and APIs match your project.

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";

import type { GameState, ColorChoice } from "@/types/colorGame";
import {
  DEFAULT_CONFIG,
  generateRoundId,
  MULTIPLIERS,
} from "@/lib/engines/gameEngine";
import { socket } from "@/lib/socket";
import {
  useGetCurrentRoundQuery,
  useGetMyActiveBetQuery,
  usePlaceBetMutation,
} from "@/app/store/apis/games/colorGameSlice";
import { updateBalance } from "@/app/store/features/walletSlice";
import type { AppDispatch, RootState } from "@/app/store/store";

type BetChoice = {
  color: ColorChoice | null;
  size: "big" | "small" | null;
  number: number | null;
};

const INITIAL_STATE: GameState = {
  isLoading: true,
  error: null,
  phase: "betting",
  currentRoundId: generateRoundId(),
  timeLeft: DEFAULT_CONFIG.roundDuration,
  totalSeconds: DEFAULT_CONFIG.roundDuration,
  balance: DEFAULT_CONFIG.startingBalance,
  currentBet: null,
  lastResult: null,
  history: [],
  betHistory: [],
  isWin: null,
};

function calculateWin(currentBet: any, result: any) {
  if (!currentBet) return { isWin: false, winAmount: 0, multiplier: 0 };

  const selections =
    [
      currentBet.choice.color,
      currentBet.choice.number,
      currentBet.choice.size,
    ].filter(Boolean).length || 1;

  const singleAmount = currentBet.amount / selections;

  let winAmount = 0;
  let multiplier = 0;

  if (currentBet.choice.color === result.color) {
    winAmount += singleAmount * MULTIPLIERS.color;
    multiplier = MULTIPLIERS.color;
  }

  if (currentBet.choice.number === result.number) {
    winAmount += singleAmount * MULTIPLIERS.number;
    multiplier = MULTIPLIERS.number;
  }

  if (currentBet.choice.size === result.size) {
    winAmount += singleAmount * MULTIPLIERS.size;
    multiplier = MULTIPLIERS.size;
  }

  return {
    isWin: winAmount > 0,
    winAmount,
    multiplier,
  };
}

export function useColorEngine() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: walletData } = useSelector((s: RootState) => s.wallet);

  const [placeBetApi] = usePlaceBetMutation();

  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const stateRef = useRef(INITIAL_STATE);

  const updateState = useCallback(
    (updater: (prev: GameState) => GameState) => {
      setState((prev) => {
        const next = updater(prev);
        stateRef.current = next;
        return next;
      });
    },
    []
  );

  const bootstrapped = useRef(false);

  const { data: currentRoundData, isLoading: roundLoading } =
    useGetCurrentRoundQuery({});

  const { data: currentBet, isLoading: betLoading } =
    useGetMyActiveBetQuery({});

  useEffect(() => {
    if (bootstrapped.current) return;
    if (roundLoading || betLoading || !currentRoundData?.data) return;

    const end = new Date(currentRoundData.data.endTime).getTime();

    const bet = currentBet?.data;

    const formattedBet = bet
      ? {
          amount: bet.amount,
          choice: {
            color: bet.color ?? null,
            size: bet.size ?? null,
            number: bet.number ?? null,
          },
          multiplier: bet.color
            ? MULTIPLIERS.color
            : bet.number
            ? MULTIPLIERS.number
            : bet.size
            ? MULTIPLIERS.size
            : 0,
        }
      : null;

    updateState((prev) => ({
      ...prev,
      isLoading: false,
      currentRoundId: currentRoundData.data._id,
      currentRoundNumber: currentRoundData.data.roundNumber,
      currentBet: formattedBet,
      timeLeft: Math.max(0, Math.floor((end - Date.now()) / 1000)),
    }));

    bootstrapped.current = true
  }, [roundLoading, betLoading, currentRoundData, currentBet, updateState]);

  useEffect(() => {
    const handleNewRound = (round: any) => {
      updateState((prev) => ({
        ...prev,
        isLoading: false,
        phase: "betting",
        currentRoundId: round.id,
        currentRoundNumber: round.roundNumber,
        currentBet: null,
        isWin: null,
        timeLeft: Math.max(
          0,
          Math.floor((new Date(round.endTime).getTime() - Date.now()) / 1000)
        ),
      }));
    };

    const handleTimer = (payload: any) => {
      updateState((prev) => ({ ...prev, timeLeft: payload.timeLeft }));
    };

    const handleLocked = () => {
      updateState((prev) => ({ ...prev, phase: "locked" }));
    };

    const handleRevealing = () => {
      updateState((prev) => ({ ...prev, phase: "revealing" }));
    };

    const handleResult = (payload: any) => {
      const outcome = calculateWin(stateRef.current.currentBet, payload.result);

      if (outcome.winAmount > 0) {
        dispatch(updateBalance(outcome.winAmount));
      }

      updateState((prev) => ({
        ...prev,
        phase: "result",
        isWin: outcome.isWin,
        balance: prev.balance + outcome.winAmount,
        lastResult: {
          roundId: payload.roundId,
          roundNumber: payload.roundNumber,
          number: payload.result.number,
          color: payload.result.color,
          bigSmall: payload.result.size,
          timestamp: Date.now(),
        },
        history: [
          {
            roundId: payload.roundId,
            roundNumber: payload.roundNumber,
            number: payload.result.number,
            color: payload.result.color,
            bigSmall: payload.result.size,
            timestamp: Date.now(),
          },
          ...prev.history,
        ].slice(0, 50),
      }));
    };

    socket.on("color:new-round", handleNewRound);
    socket.on("color:timer", handleTimer);
    socket.on("color:locked", handleLocked);
    socket.on("color:revealing", handleRevealing);
    socket.on("color:result", handleResult);

    return () => {
      socket.off("color:new-round", handleNewRound);
      socket.off("color:timer", handleTimer);
      socket.off("color:locked", handleLocked);
      socket.off("color:revealing", handleRevealing);
      socket.off("color:result", handleResult);
    };
  }, [dispatch, updateState]);

  const placeBet = useCallback(async (choice: BetChoice, amount: number) => {
    const count = [choice.color, choice.number, choice.size].filter(Boolean).length;

    if (!count) {
      toast.error("Select at least one option.");
      return;
    }

    const multiplier = choice.color
      ? MULTIPLIERS.color
      : choice.number
      ? MULTIPLIERS.number
      : MULTIPLIERS.size;

    const total = amount * count;

    if (!walletData || walletData.balance < total) {
      toast.error("Insufficient balance.");
      return;
    }

    dispatch(updateBalance(-total));

    try {
      await placeBetApi({ amount, choice }).unwrap();

      toast.success("Bet placed !", {position: "top-right"})

      updateState((prev) => ({
        ...prev,
        currentBet: {
          amount: total,
          choice,
          multiplier,
        },
        balance: prev.balance - total,
      }));
    } catch (e: any) {
      dispatch(updateBalance(total));
      toast.error(e?.data?.message || "Failed to place bet");
    }
  }, [dispatch, walletData, placeBetApi, updateState]);


  useEffect(()=>{
    updateState(prev=>({
      ...prev,
      balance: walletData?.balance || 0
    }) )
  }, [walletData])
  return {
    state,
    placeBet,
    cancelBet: () => toast.error("Coming soon"),
    addFunds: (amount: number) =>
      updateState((prev) => ({
        ...prev,
        balance: prev.balance + amount,
      })),
    config: DEFAULT_CONFIG,
  };
}
