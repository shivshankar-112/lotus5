
"use client";

import { cn } from "@/lib/utils";
import Header from "@/components/games/shared/Header";
import Coin3D from "@/components/games/heads-tails/Coin3D";
import { BetPanel, ParticlesBurst } from "@/components/games/heads-tails/components";
import { useHeadsTails } from "@/hooks/games/useHeadsTails";

export default function HeadsTailsPage() {
  const {
    stats,
    flipping,
    result,
    isWin,
    showParticles,
    setShowParticles,
    flip,
  } = useHeadsTails();

  return (
    <div
      className="min-h-screen flex flex-col fixed inset-0 overflow-y-auto"
      style={{ background: "#080b12", fontFamily: "'DM Sans', sans-serif", color: "#fff" }}
    >
      <Header
        balance={stats.balance}
        title="Heads & Tails"
        desc="Evoplay · RTP: 96%"
      />

      {showParticles && (
        <ParticlesBurst onDone={() => setShowParticles(false)} />
      )}

      <div className="flex flex-col items-center py-8">
        <Coin3D flipping={flipping} result={result} />

        <div
          className={cn(
            "mt-4 px-5 py-2 rounded-full text-sm font-bold transition-all duration-500",
            isWin === null ? "opacity-0" : "opacity-100"
          )}
        >
          {isWin === null
            ? ""
            : isWin
              ? `🎉 YOU WON +₹${stats.history[0]?.amount ?? 0}`
              : `💫 ${result?.toUpperCase()} — Better luck!`}
        </div>
      </div>

      <BetPanel
        balance={stats.balance ?? 0}
        flipping={flipping}
        onFlip={flip}
      />

      {/* Stats */}
      {/* <StatsBar wins={stats.wins} losses={stats.losses} pnl={stats.pnl} /> */}

      {/* History */}
      {/* <FlipHistory history={stats.history} /> */}

    </div>
  );
}
