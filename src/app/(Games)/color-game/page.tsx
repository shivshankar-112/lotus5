"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

import { useColorEngine } from "@/hooks/games/useColor";
import GameTimer from "@/components/games/color-game/GameTimer";
import ResultReveal from "@/components/games/color-game/ResultReveal";
import BettingPanel from "@/components/games/color-game/BettingPanel";
import GameHistory from "@/components/games/color-game/GameHistory";
import MyBets from "@/components/games/color-game/MyBets";
import GameHeader from "@/components/games/shared/Header";

type Tab = "game" | "history" | "mybets";

export default function ColorGamePage() {

  const { state, placeBet, cancelBet, config } = useColorEngine();
  const [tab, setTab] = useState<Tab>("game");

  const isRevealing = state.phase === "result"

  if (state.isLoading) return <PageLoader />
  return (
    <>
      <div className="min-h-screen bg-[#0b0d14] text-white flex flex-col">
        {/* ── Top Bar ─────────────────────────────────────────── */}
        <GameHeader title="Win Go" desc="Colour Prediction" />

        {/* ── Timer + Result Area ─────────────────────────────── */}
        <div className="relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-linear-to-b from-[#13151f] to-[#0b0d14]" />

          {/* Animated background orbs */}
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-violet-700/10 rounded-full blur-3xl" />
          <div className="absolute top-0 right-1/4 w-32 h-32 bg-amber-600/10 rounded-full blur-3xl" />

          <div className="relative px-4 pt-4 pb-5">
            {/* Result or Timer */}
            <div
              className={cn(
                "transition-all duration-500",
                isRevealing ? "opacity-100" : "opacity-100"
              )}
            >
              {isRevealing && state.lastResult ? (
                <ResultReveal
                  result={state.lastResult}
                  isWin={state.isWin}
                  betChoice={state.currentBet?.choice}
                  betAmount={state.currentBet?.amount}
                  payout={
                    state.currentBet && state.lastResult
                      ? state.currentBet.amount * (state.currentBet.multiplier || 0)
                      : undefined
                  }
                />
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <GameTimer
                    timeLeft={state.timeLeft}
                    totalSeconds={state.totalSeconds}
                    phase={state.phase}
                    roundId={state.currentRoundId}
                  />

                  {/* Quick history dots strip */}
                  {state.history.length > 0 && (
                    <div className="flex gap-1.5 items-center">
                      <span className="text-white/30 text-[10px]">Last:{state.history.length}</span>
                      {state.history.slice(0, 8).map((r, i) => (
                        <div
                          key={i}
                          className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center text-white font-black text-[9px] transition-all",
                            i === 0 && "scale-110 ring-2 ring-white/20",
                            r.color === "red" && "bg-red-500",
                            r.color === "green" && "bg-green-500",
                            r.color === "violet" && "bg-violet-500",
                          )}
                        >
                          {r.number}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Tabs ────────────────────────────────────────────── */}
        <div className="flex border-b border-white/5 bg-[#0f1117] sticky top-15.5 z-30">
          {(["game", "history", "mybets"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex-1 py-2.5 text-xs font-bold tracking-widest transition-all relative capitalize",
                tab === t ? "text-amber-400" : "text-white/30 hover:text-white/60"
              )}
            >
              {t === "mybets" ? "My Bets" : t}
              {tab === t && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-amber-400 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* ── Tab Content ─────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto pb-6">
          {tab === "game" && (
            <BettingPanel
              phase={state.phase}
              balance={state.balance}
              currentBet={state.currentBet}
              onPlaceBet={placeBet}
              onCancelBet={cancelBet}
              multipliers={config.multipliers}
            />
          )}
          {tab === "history" && <GameHistory history={state.history} />}
          {tab === "mybets" && <MyBets bets={state.betHistory} />}
        </div>
      </div>
    </>
  );
}

function PageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0f111a]">
      <div className="flex flex-col items-center gap-6">
        {/* Animated Rings */}
        <div className="relative h-24 w-24">
          <div className="absolute inset-0 rounded-full border-4 border-yellow-500/20" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-yellow-400 animate-spin" />
          <div className="absolute inset-3 rounded-full border-4 border-transparent border-b-orange-500 animate-spin [animation-direction:reverse] [animation-duration:1.2s]" />
          <div className="absolute inset-7 rounded-full bg-yellow-400 shadow-[0_0_25px_rgba(251,191,36,0.6)]" />
        </div>

        {/* Title */}
        <div className="text-center">
          <h2
            className="text-xl font-black tracking-widest text-yellow-400"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            COLOR PREDICTION
          </h2>

          <p className="mt-2 text-sm text-white/60">
            Preparing your gaming experience...
          </p>
        </div>

        {/* Animated Dots */}
        <div className="flex gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400 animate-bounce" />
          <span
            className="h-2.5 w-2.5 rounded-full bg-yellow-400 animate-bounce"
            style={{ animationDelay: "0.15s" }}
          />
          <span
            className="h-2.5 w-2.5 rounded-full bg-yellow-400 animate-bounce"
            style={{ animationDelay: "0.3s" }}
          />
        </div>
      </div>
    </div>
  )
}
