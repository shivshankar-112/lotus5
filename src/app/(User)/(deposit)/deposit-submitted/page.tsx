"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowRight,
    CheckCircle2,
    Clock3,
    Home,
    Wallet,
    Sparkles,
} from "lucide-react";

export default function DepositSubmittedPage() {
    const router = useRouter();

    //   useEffect(() => {
    //     const timer = setTimeout(() => {
    //       router.replace("/");
    //     }, 3000);

    //     return () => clearTimeout(timer);
    //   }, [router]);

    return (
        <main className="min-h-screen bg-[#090b11] text-white flex items-center justify-center px-5">

            <div className="w-full max-w-md">

                {/* Card */}
                <div className="relative overflow-hidden rounded-3xl border border-green-500/20 bg-gradient-to-br from-[#12161e] via-[#11151c] to-[#090b11] p-7 text-center">

                    {/* Glow */}
                    <div className="absolute -top-20 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-green-500/10 blur-3xl" />

                    <div className="relative">

                        {/* Icon */}
                        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-500/10 border border-green-500/20">
                            <CheckCircle2
                                size={54}
                                className="text-green-400"
                            />
                        </div>

                        <h1 className="mt-6 text-3xl font-black">
                            Request Submitted
                        </h1>

                        <p className="mt-3 text-sm leading-6 text-white/60">
                            We've received your payment request.
                            <br />
                            Your deposit will be verified and credited to your wallet.
                        </p>

                        {/* Status */}
                        <div className="mt-6 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4">

                            <div className="flex items-center justify-center gap-2">

                                <Clock3
                                    size={18}
                                    className="text-yellow-400"
                                />

                                <span className="font-semibold text-yellow-400">
                                    Verification Pending
                                </span>

                            </div>

                            <p className="mt-2 text-xs text-white/55">
                                Usually completed within
                                <span className="font-semibold text-white">
                                    {" "}1–5 minutes
                                </span>.
                                <br />
                                In rare cases it may take up to
                                <span className="font-semibold text-white">
                                    {" "}24 hours.
                                </span>
                            </p>

                        </div>

                        {/* Auto redirect */}
                        <div className="mt-5 flex items-center justify-center gap-2 text-sm text-white/45">
                            <Sparkles size={16} />
                            Redirecting to Home in 3 seconds...
                        </div>

                    </div>

                </div>

                {/* Buttons */}

                <div className="mt-6 grid grid-cols-2 gap-3">

                    <button
                        onClick={() => router.push("/")}
                        className="flex h-13 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 font-semibold text-black transition hover:brightness-105"
                    >
                        <ArrowRight size={18} />
                        Play Games
                    </button>

                    <button
                        onClick={() => router.push("/wallet")}
                        className="flex h-13 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#171b26] font-semibold transition hover:border-yellow-400/30"
                    >
                        <Wallet size={18} />
                        Wallet
                    </button>

                </div>

                {/* Home */}

                <button
                    onClick={() => router.push("/")}
                    className="mt-3 flex w-full items-center justify-center gap-2 text-sm text-white/45 hover:text-white"
                >
                    <Home size={16} />
                    Go to Home
                </button>

            </div>

        </main>
    );
}