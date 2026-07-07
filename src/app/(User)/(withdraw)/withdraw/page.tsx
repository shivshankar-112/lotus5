"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowDownCircle,
    Building2,
    CheckCircle2,
    ChevronLeft,
    CreditCard,
    IndianRupee,
    Landmark,
    ShieldCheck,
    Wallet,
    Lock,
    BadgeCheck,
} from "lucide-react";

import { AppDispatch, RootState } from "@/app/store/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchWallet } from "@/app/store/features/walletSlice";
import { toast } from "sonner";
import { useRequestWithdrawMutation } from "@/app/store/apis/withdrawlsSlice";

const QUICK_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];

const methods = [
    {
        id: "upi",
        title: "UPI",
        subtitle: "Google Pay • PhonePe • Paytm",
        icon: CreditCard,
    },
    {
        id: "bank",
        title: "Bank Account",
        subtitle: "Withdraw directly to bank",
        icon: Building2,
    },
];

export default function WithdrawPage() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    const { data: walletData } = useSelector(
        (state: RootState) => state.wallet
    );

    const [loading, setLoading] = useState(false);

    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState("upi");
    const [upiId, setUpiId] = useState("");
    const [accountHolder, setAccountHolder] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [ifsc, setIfsc] = useState("");
    // const [transactionPassword, setTransactionPassword] = useState("");

    const withdrawAmount = Number(amount) || 0;
    const fee = 0;
    const receiveAmount = Math.max(withdrawAmount - fee, 0);

    useEffect(() => {
        if (walletData) return;
        dispatch(fetchWallet());
    }, [walletData, dispatch]);

    function handleSubmit() {
        if (!amount || withdrawAmount <= 0) {
            toast.error("Please enter a valid withdrawal amount.", {
                position: "top-center",
            });
            return;
        }

        if (withdrawAmount > (walletData?.balance || 0)) {
            toast.error("Insufficient wallet balance.", {
                position: "top-center",
            });
            return;
        }

        if (method === "upi" && !upiId) {
            toast.error("Please enter your UPI ID.", {
                position: "top-center",
            });
            return;
        }

        if (
            method === "bank" &&
            (!accountHolder || !accountNumber || !ifsc)
        ) {
            toast.error("Please complete bank details.", {
                position: "top-center",
            });
            return;
        }

        // if (!transactionPassword) {
        //     toast.error("Please enter transaction password.", {
        //         position: "top-center",
        //     });
        //     return;
        // }

        setLoading(true);
        handleWithdraw(withdrawAmount, method as "bank" | "upi", {
            upiId,
            accountHolder,
            accountNumber,
            ifsc
        }).then(() => {
            setLoading(false);
            router.push(
                `/withdraw-submitted?amount=${withdrawAmount}&method=${method}`
            );
        }).catch((error) => {
            setLoading(false);
            console.log("Withdrawal failed:", error);
            toast.error(error.message || "Withdrawal failed. Please try again.", {
                position: "top-center",
            });
        });
    }


    const [requestWithdraw] = useRequestWithdrawMutation();

    async function handleWithdraw(amount: number, method: "bank" | "upi", accountDetails?: any) {
        try {
            console.log("Initiating withdraw request with data:", { amount, method, accountDetails });

            const res = await requestWithdraw({ amount, method, accountDetails }).unwrap();

            console.log("Withdraw request sent, awaiting response...", res);
        } catch (error: any) {
            console.log("Withdrawl failed", error);
            throw new Error(error.data?.message || "Withdrawl failed. Please try again.");
        }
    }

    return (
        <main className="min-h-screen bg-[#090b11] text-white pb-36">
            {/* ================= Header ================= */}

            <header className="sticky top-0 z-50 bg-[#090b11]/95 backdrop-blur-2xl">
                <div className="border-b border-white/5">
                    <div className="flex h-16 items-center justify-between px-4">
                        <button
                            onClick={() => router.back()}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#171b26] transition hover:border-yellow-400/30"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-center text-lg font-bold">
                                Withdraw
                            </h1>
                            <p className="text-center text-[11px] text-white/40">
                                Fast • Secure • Instant
                            </p>
                        </div>
                        <div className="rounded-full border border-green-500/20 bg-gradient-to-r from-green-500/15 to-emerald-500/10 px-3 py-1">
                            <div className="flex items-center gap-1.5">
                                <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                                <span className="text-[11px] font-semibold text-green-400">
                                    Live
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent" />
            </header>

            {/* ================= Wallet Card ================= */}

            <section className="mx-4 mt-4">
                <div className="relative overflow-hidden rounded-3xl border border-yellow-500/15 bg-gradient-to-br from-[#17130d] via-[#0f131b] to-[#090b11] p-5">
                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-yellow-400/10 blur-3xl" />
                    <div className="absolute -left-10 bottom-0 h-24 w-24 rounded-full bg-yellow-500/5 blur-2xl" />
                    <div className="relative flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                                <p className="text-[11px] uppercase tracking-[3px] text-white/45">
                                    Available Balance
                                </p>
                            </div>
                            <h2
                                className="mt-2 text-3xl font-black leading-none text-yellow-400"
                                style={{ fontFamily: "Orbitron, sans-serif" }}
                            >
                                ₹{walletData?.balance?.toLocaleString() ?? 0}
                            </h2>
                            <div className="mt-2 flex items-center gap-2 text-xs text-white/45">
                                <ShieldCheck size={14} className="text-green-400" />
                                Instant Withdrawal • Zero Fee
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 rounded-2xl bg-yellow-400/20 blur-xl" />
                            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-yellow-500/20 bg-yellow-400/10 backdrop-blur">
                                <Wallet className="h-8 w-8 text-yellow-400" />
                            </div>
                        </div>
                    </div>
                    <div className="relative mt-5 flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-500/10">
                                <ShieldCheck className="h-5 w-5 text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold">
                                    Secure Withdrawal
                                </p>
                                <p className="text-[11px] text-white/45">
                                    Funds are usually transferred within 24 hours
                                </p>
                            </div>
                        </div>
                        <div className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-green-400">
                            Verified
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= Withdraw Amount ================= */}

            <section className="mx-4 mt-6 space-y-5">

                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-semibold">Withdraw Amount</h3>
                        <p className="mt-0.5 text-xs text-white/45">
                            Minimum withdrawal ₹100
                        </p>
                    </div>

                    <div className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1">
                        <span className="text-[11px] font-medium text-yellow-400">
                            Instant
                        </span>
                    </div>
                </div>
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#171b26] transition focus-within:border-yellow-400">
                    <IndianRupee
                        size={22}
                        className="absolute left-5 top-1/2 -translate-y-1/2 text-yellow-400"
                    />
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter withdrawal amount"
                        className="h-16 w-full bg-transparent pl-12 pr-4 text-xl font-semibold tracking-wide outline-none placeholder:text-white/30"
                    />
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {QUICK_AMOUNTS.map((item) => {
                        const active = Number(amount) === item;
                        return (
                            <button
                                key={item}
                                onClick={() => setAmount(String(item))}
                                className={`h-12 rounded-2xl border transition-all duration-200 ${active
                                    ? "border-yellow-400 bg-yellow-400 text-black shadow-lg shadow-yellow-400/20 scale-[1.03]"
                                    : "border-white/10 bg-[#171b26] text-white hover:border-yellow-400/30 hover:bg-[#1d2230]"
                                    }`}
                            >
                                <span className="font-bold">₹{item}</span>
                            </button>
                        );
                    })}
                </div>
                <div className="rounded-2xl border border-yellow-500/15 bg-gradient-to-r from-yellow-500/10 to-transparent p-4">
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/15">
                            <Wallet size={20} className="text-yellow-400" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <h4 className="font-semibold">
                                    Withdrawal Information
                                </h4>
                                <span className="rounded-full bg-green-500/15 px-3 py-1 text-xs font-semibold text-green-400">
                                    FREE
                                </span>
                            </div>
                            <p className="mt-1 text-sm text-white/55">
                                Withdrawals are processed within 24 hours after approval.
                            </p>
                            <div className="mt-4 space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-white/45">
                                        Processing Fee
                                    </span>
                                    <span className="font-medium text-green-400">
                                        ₹0
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-white/45">
                                        Minimum Amount
                                    </span>
                                    <span className="font-medium">
                                        ₹100
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-white/45">
                                        Maximum Amount
                                    </span>
                                    <span className="font-medium">
                                        ₹50,000
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= Withdrawal Method ================= */}

            <section className="mx-4 mt-6">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-semibold">
                            Withdrawal Method
                        </h3>

                        <p className="mt-0.5 text-xs text-white/45">
                            Select where you want to receive funds
                        </p>
                    </div>
                    <div className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-[11px] font-medium text-green-400">
                        Verified
                    </div>
                </div>

                <div className="space-y-3">

                    {methods.map((m) => {

                        const Icon = m.icon;
                        const active = method === m.id;

                        return (

                            <button
                                key={m.id}
                                type="button"
                                onClick={() => setMethod(m.id)}
                                className={`group relative w-full overflow-hidden rounded-2xl border transition-all duration-300 ${active
                                    ? "border-yellow-400 bg-gradient-to-r from-yellow-500/15 to-yellow-500/5 shadow-lg shadow-yellow-500/10"
                                    : "border-white/10 bg-[#171b26] hover:border-yellow-500/30"
                                    }`}
                            >

                                <div className="flex items-center justify-between px-4 py-4">

                                    <div className="flex items-center gap-4">

                                        <div
                                            className={`flex h-11 w-11 items-center justify-center rounded-xl ${active
                                                ? "bg-yellow-400 text-black"
                                                : "bg-yellow-400/10 text-yellow-400"
                                                }`}
                                        >
                                            <Icon size={20} />
                                        </div>

                                        <div className="text-left">

                                            <h4 className="text-sm font-semibold">
                                                {m.title}
                                            </h4>

                                            <p className="mt-1 text-xs text-white/45">
                                                {m.subtitle}
                                            </p>

                                        </div>

                                    </div>

                                    {active ? (
                                        <CheckCircle2
                                            size={22}
                                            className="text-green-400"
                                        />
                                    ) : (
                                        <div className="h-5 w-5 rounded-full border border-white/20" />
                                    )}

                                </div>

                            </button>

                        );

                    })}

                </div>

            </section>

            {/* ================= UPI Details ================= */}

            {method === "upi" && (

                <section className="mx-4 mt-6">

                    <div className="rounded-3xl border border-yellow-500/15 bg-gradient-to-br from-[#171b26] to-[#10131b] p-5">

                        <h3 className="mb-4 font-semibold">
                            UPI Details
                        </h3>

                        <div className="relative">

                            <CreditCard
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400"
                            />

                            <input
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                placeholder="example@upi"
                                className="h-12 w-full rounded-2xl border border-white/10 bg-[#171b26] pl-11 pr-4 outline-none transition focus:border-yellow-400 placeholder:text-white/30"
                            />

                        </div>

                    </div>

                </section>

            )}

            {/* ================= Bank Details ================= */}

            {method === "bank" && (

                <section className="mx-4 mt-6">

                    <div className="rounded-3xl border border-yellow-500/15 bg-gradient-to-br from-[#171b26] to-[#10131b] p-5">

                        <h3 className="mb-5 font-semibold">
                            Bank Details
                        </h3>

                        <div className="space-y-4">

                            <input
                                value={accountHolder}
                                onChange={(e) => setAccountHolder(e.target.value)}
                                placeholder="Account Holder Name"
                                className="h-12 w-full rounded-2xl border border-white/10 bg-[#171b26] px-4 outline-none transition focus:border-yellow-400 placeholder:text-white/30"
                            />

                            <input
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
                                placeholder="Account Number"
                                className="h-12 w-full rounded-2xl border border-white/10 bg-[#171b26] px-4 outline-none transition focus:border-yellow-400 placeholder:text-white/30"
                            />

                            <input
                                value={ifsc}
                                onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                                placeholder="IFSC Code"
                                className="h-12 w-full rounded-2xl border border-white/10 bg-[#171b26] px-4 uppercase outline-none transition focus:border-yellow-400 placeholder:text-white/30"
                            />

                        </div>

                    </div>

                </section>

            )}

            {/* ================= Transaction Password ================= */}

            {/* <section className="mx-4 mt-6">

                <div className="rounded-3xl border border-yellow-500/15 bg-gradient-to-br from-[#171b26] to-[#10131b] p-5">

                    <h3 className="mb-4 font-semibold">
                        Transaction Password
                    </h3>

                    <div className="relative">

                        <Lock
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400"
                        />

                        <input
                            type="password"
                            value={transactionPassword}
                            onChange={(e) => setTransactionPassword(e.target.value)}
                            placeholder="Enter transaction password"
                            className="h-12 w-full rounded-2xl border border-white/10 bg-[#171b26] pl-11 pr-4 outline-none transition focus:border-yellow-400 placeholder:text-white/30"
                        />

                    </div>

                </div>

            </section> */}

            {/* ================= Withdrawal Summary ================= */}

            <section className="mx-4 mt-6">

                <div className="rounded-3xl border border-yellow-500/15 bg-gradient-to-br from-[#171b26] to-[#10131b] p-5">

                    <div className="mb-5 flex items-center justify-between">

                        <h3 className="text-base font-semibold">
                            Withdrawal Summary
                        </h3>

                        <div className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs text-yellow-400">
                            Live
                        </div>

                    </div>

                    <div className="space-y-4">

                        <div className="flex justify-between text-sm">

                            <span className="text-white/50">
                                Withdrawal Amount
                            </span>

                            <span className="font-medium">
                                ₹{withdrawAmount}
                            </span>

                        </div>

                        <div className="flex justify-between text-sm">

                            <span className="text-white/50">
                                Processing Fee
                            </span>

                            <span className="text-green-400">
                                FREE
                            </span>

                        </div>

                        <div className="flex justify-between text-sm">

                            <span className="text-white/50">
                                Payment Method
                            </span>

                            <span className="capitalize">
                                {method === "upi" ? "UPI" : "Bank"}
                            </span>

                        </div>

                        <div className="border-t border-white/10 pt-4">

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-xs text-white/45">
                                        You Will Receive
                                    </p>

                                    <p className="text-2xl font-black text-yellow-400">
                                        ₹{receiveAmount}
                                    </p>

                                </div>

                                <div className="rounded-2xl bg-green-500/10 px-3 py-2 text-center">

                                    <p className="text-[10px] uppercase tracking-wider text-white/40">
                                        Fee
                                    </p>

                                    <p className="font-bold text-green-400">
                                        ₹0
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {/* ================= Important Notes ================= */}

            <section className="mx-4 mt-6">

                <div className="rounded-2xl border border-white/10 bg-[#171b26] p-5">

                    <div className="mb-4 flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10">
                            <ShieldCheck className="text-yellow-400" size={20} />
                        </div>

                        <div>

                            <h3 className="font-semibold">
                                Withdrawal Policy
                            </h3>

                            <p className="text-xs text-white/40">
                                Please review before submitting.
                            </p>

                        </div>

                    </div>

                    <div className="space-y-3 text-sm text-white/60">

                        <div className="flex gap-2">
                            <BadgeCheck size={16} className="mt-0.5 shrink-0 text-green-400" />
                            <p>Withdrawals are usually processed within 24 hours.</p>
                        </div>

                        <div className="flex gap-2">
                            <BadgeCheck size={16} className="mt-0.5 shrink-0 text-green-400" />
                            <p>Please ensure your UPI ID or bank details are correct.</p>
                        </div>

                        <div className="flex gap-2">
                            <BadgeCheck size={16} className="mt-0.5 shrink-0 text-green-400" />
                            <p>Incorrect details may delay your withdrawal request.</p>
                        </div>

                        <div className="flex gap-2">
                            <BadgeCheck size={16} className="mt-0.5 shrink-0 text-green-400" />
                            <p>Your transaction password is required for security.</p>
                        </div>

                    </div>

                </div>

            </section>

            {/* ================= Bottom CTA ================= */}

            <div className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-[#090b11]/95 backdrop-blur-2xl">

                <div className="mx-4 py-4">

                    <button
                    disabled={loading}
                        onClick={handleSubmit}
                        className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-base font-bold text-black shadow-xl shadow-yellow-500/20 transition hover:brightness-105 active:scale-[0.98]"
                    >

                        <ArrowDownCircle
                            size={20}
                            className="transition group-hover:-translate-y-0.5"
                        />

                        {loading ? "Processing..." : "Request Withdrawal"}

                    </button>

                    <p className="mt-2 text-center text-[11px] text-white/35">
                        🔒 Secured with encrypted withdrawal system
                    </p>

                </div>

            </div>

        </main>

    );

}