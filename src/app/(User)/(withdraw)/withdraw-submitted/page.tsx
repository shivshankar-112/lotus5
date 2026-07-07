"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Clock3,
  Home,
  Sparkles,
  Wallet,
  CircleCheckBig,
} from "lucide-react";

export default function WithdrawSubmittedPage() {
  const router = useRouter();
  const [count, setCount] = useState(3);

  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCount((prev) => {
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [router]);

  useEffect(() => {
    if (count <= 0) {
      router.replace("/");
      clearInterval(timerRef.current);
    }
  }, [count])


  return (
    <main className="min-h-screen bg-[#090b11] text-white flex items-center justify-center px-5">
      <div className="w-full max-w-sm">

        <div className="rounded-3xl border border-white/10 bg-[#171b26] overflow-hidden">

          <div className="h-1 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500" />

          <div className="p-6">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 border border-green-500/20">
              <CircleCheckBig size={34} className="text-green-400" />
            </div>

            <h1 className="mt-5 text-center text-xl font-semibold tracking-tight">
              Withdrawal Request Submitted
            </h1>

            <p className="mt-2 text-center text-[13px] leading-6 text-white/55">
              We've received your withdrawal request. Your request is now under
              review and will be processed shortly.
            </p>

            <div className="mt-6 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4">

              <div className="flex items-center gap-2">
                <Clock3 size={18} className="text-yellow-400" />
                <span className="font-medium text-yellow-400">
                  Processing
                </span>
              </div>

              <div className="mt-4 space-y-3">

                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Status</span>
                  <span className="text-green-400">
                    Request Received
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-white/50">
                    Estimated Time
                  </span>

                  <span>
                    Within 24 Hours
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-white/50">
                    Destination
                  </span>

                  <span>
                    Your Registered Account
                  </span>
                </div>

              </div>

            </div>

            <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-[#202636] py-3 text-sm text-white/55">
              <Sparkles size={15} />
              Redirecting in
              <span className="font-semibold text-yellow-400">
                {count}s
              </span>
            </div>

          </div>

        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">

          <button
            onClick={() => router.push("/games")}
            className="h-12 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-sm font-semibold text-black transition hover:brightness-105"
          >
            Play Games
          </button>

          <button
            onClick={() => router.push("/wallet")}
            className="h-12 rounded-2xl border border-white/10 bg-[#171b26] text-sm font-medium hover:border-yellow-400/30"
          >
            <div className="flex items-center justify-center gap-2">
              <Wallet size={17} />
              Wallet
            </div>
          </button>

        </div>

        <button
          onClick={() => router.replace("/")}
          className="mt-3 w-full text-center text-xs text-white/45 hover:text-white transition"
        >
          <div className="flex items-center justify-center gap-2">
            <Home size={15} />
            Go to Home
          </div>
        </button>

      </div>
    </main>
  );
}