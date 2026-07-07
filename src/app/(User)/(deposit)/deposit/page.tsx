"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDownCircle,
  BadgePercent,
  Building2,
  CheckCircle2,
  ChevronLeft,
  CreditCard,
  Gift,
  IndianRupee,
  QrCode,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { AppDispatch, RootState } from "@/app/store/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchWallet } from "@/app/store/features/walletSlice";
import { toast } from "sonner";

const QUICK_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];
const methods = [
  {
    id: "upi",
    title: "UPI",
    subtitle: "Google Pay • PhonePe • Paytm",
    icon: CreditCard,
  },
  {
    id: "qr",
    title: "QR Scan",
    subtitle: "Scan & Pay",
    icon: QrCode,
  },
  {
    id: "bank",
    title: "Net Banking",
    subtitle: "All Indian Banks",
    icon: Building2,
  },
];


export default function DepositPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { data: walletData } = useSelector((s: RootState) => s.wallet);

  const [amount, setAmount] = useState("");
  const [coupon, setCoupon] = useState("");
  const [method, setMethod] = useState("upi");

  const deposit = Number(amount) || 0;

  useEffect(() => {
    if (walletData) return;
    dispatch(fetchWallet());
  }, [walletData, dispatch]);

  const bonus = useMemo(() => {
    if (deposit >= 5000) return 500;
    if (deposit >= 2000) return 200;
    if (deposit >= 1000) return 100;
    return 0;
  }, [deposit]);

  const total = deposit + bonus;

  function handleSubmit() {
    if (!amount || Number(amount) <= 0) {
      toast.error("Please enter a valid amount.", { position: "top-center" });
      return;
    }

    router.push(`/payment?method=${method}&amount=${amount}&coupon=${coupon}`);
  }

  return (
    <main className="min-h-screen bg-[#090b11] text-white pb-36">
      <header className="sticky top-0 z-50 bg-[#090b11]/95 backdrop-blur-2xl">
        <div className="border-b border-white/5">
          <div className="flex h-16 items-center justify-between px-4">

            <button
              onClick={() => router.back()}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#171b26] border border-white/10 transition hover:border-yellow-400/30"
            >
              <ChevronLeft size={20} />
            </button>

            <div>
              <h1 className="text-center text-lg font-bold">
                Deposit
              </h1>

              <p className="text-center text-[11px] text-white/40">
                Fast • Secure • Instant
              </p>
            </div>

            <div className="rounded-full bg-gradient-to-r from-green-500/15 to-emerald-500/10 border border-green-500/20 px-3 py-1">
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

      <section className="mx-4 mt-4">
        <div className="relative overflow-hidden rounded-3xl border border-yellow-500/15 bg-gradient-to-br from-[#17130d] via-[#0f131b] to-[#090b11] p-5">

          {/* Glow */}
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-yellow-400/10 blur-3xl" />
          <div className="absolute -left-10 bottom-0 h-24 w-24 rounded-full bg-yellow-500/5 blur-2xl" />

          <div className="relative flex items-center justify-between">

            {/* Left */}
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                <p className="text-[11px] uppercase tracking-[3px] text-white/45">
                  Available Balance
                </p>
              </div>

              <h2
                className="mt-2 text-3xl font-black text-yellow-400 leading-none"
                style={{ fontFamily: "Orbitron, sans-serif" }}
              >
                ₹{walletData?.balance?.toLocaleString()}
              </h2>

              <div className="mt-2 flex items-center gap-2 text-xs text-white/45">
                <ShieldCheck size={14} className="text-green-400" />
                Instant Deposit • Zero Fee
              </div>
            </div>

            {/* Right */}
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-yellow-400/20 blur-xl" />

              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-yellow-500/20 bg-yellow-400/10 backdrop-blur">
                <Wallet className="h-8 w-8 text-yellow-400" />
              </div>
            </div>
          </div>

          {/* Bottom Info */}
          <div className="relative mt-5 flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3">

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-500/10">
                <ShieldCheck className="h-5 w-5 text-green-400" />
              </div>

              <div>
                <p className="text-sm font-semibold">
                  100% Secure Payment
                </p>

                <p className="text-[11px] text-white/45">
                  Funds credited instantly after payment
                </p>
              </div>
            </div>

            <div className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-green-400">
              Verified
            </div>

          </div>
        </div>
      </section>

      <section className="mx-4 mt-6 space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold">Deposit Amount</h3>
            <p className="text-xs text-white/45 mt-0.5">
              Minimum deposit ₹100
            </p>
          </div>

          <div className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1">
            <span className="text-[11px] font-medium text-yellow-400">
              Instant Credit
            </span>
          </div>
        </div>

        {/* Amount Input */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#171b26] transition focus-within:border-yellow-400">

          <IndianRupee
            size={22}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-yellow-400"
          />

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter deposit amount"
            className="h-16 w-full bg-transparent pl-12 pr-4 text-xl font-semibold tracking-wide outline-none placeholder:text-white/30"
          />

        </div>

        {/* Quick Amounts */}
        <div className="grid grid-cols-3 gap-3">
          {QUICK_AMOUNTS.map((item) => {
            const active = Number(amount) === item;

            return (
              <button
                key={item}
                onClick={() => setAmount(String(item))}
                className={`
            h-12 rounded-2xl border transition-all duration-200
            ${active
                    ? "border-yellow-400 bg-yellow-400 text-black shadow-lg shadow-yellow-400/20 scale-[1.03]"
                    : "border-white/10 bg-[#171b26] text-white hover:border-yellow-400/30 hover:bg-[#1d2230]"
                  }
          `}
              >
                <div className="font-bold">₹{item}</div>
              </button>
            );
          })}
        </div>

        {/* Bonus Card */}
        <div className="rounded-2xl border border-yellow-500/15 bg-gradient-to-r from-yellow-500/10 to-transparent p-4">

          <div className="flex items-start gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/15">
              <Gift
                size={20}
                className="text-yellow-400"
              />
            </div>

            <div className="flex-1">

              <div className="flex items-center justify-between">

                <h4 className="font-semibold">
                  Deposit Bonus
                </h4>

                {bonus > 0 && (
                  <span className="rounded-full bg-green-500/15 px-3 py-1 text-xs font-semibold text-green-400">
                    +₹{bonus}
                  </span>
                )}

              </div>

              <p className="mt-1 text-sm text-white/55">
                Deposit ₹1000 or more and receive an instant
                ₹100 bonus.
              </p>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">

                <div
                  className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-500"
                  style={{
                    width: `${Math.min((deposit / 1000) * 100, 100)}%`,
                  }}
                />

              </div>

              <div className="mt-2 flex justify-between text-xs text-white/40">
                <span>₹0</span>
                <span>Unlock at ₹1000</span>
              </div>

            </div>

          </div>

        </div>

      </section>
      {/* ================= Payment Method ================= */}
      <section className="mx-4 mt-6">

        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold">Payment Method</h3>
            <p className="text-xs text-white/45 mt-0.5">
              Choose your preferred payment option
            </p>
          </div>

          <div className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-[11px] font-medium text-green-400">
            100% Secure
          </div>
        </div>

        <div className="space-y-3">
          {methods.map((m) => {
            const Icon = m.icon;
            const active = method === m.id;

            return (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`group relative w-full overflow-hidden rounded-2xl border transition-all duration-300 ${active
                  ? "border-yellow-400 bg-gradient-to-r from-yellow-500/15 to-yellow-500/5 shadow-lg shadow-yellow-500/10"
                  : "border-white/8 bg-[#171b26] hover:border-yellow-500/30"
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
                      <h4 className="font-semibold text-sm">{m.title}</h4>

                      <p className="mt-1 text-xs text-white/45">
                        {m.subtitle}
                      </p>
                    </div>
                  </div>

                  <div>
                    {active ? (
                      <CheckCircle2
                        size={22}
                        className="text-green-400"
                      />
                    ) : (
                      <div className="h-5 w-5 rounded-full border border-white/20" />
                    )}
                  </div>

                </div>
              </button>
            );
          })}
        </div>

      </section>



      {/* ================= Promo ================= */}

      <section className="mx-4 mt-6">

        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold">
            Promo Code
          </h3>

          <span className="text-xs text-white/40">
            Optional
          </span>
        </div>

        <div className="flex gap-3">

          <div className="relative flex-1">

            <BadgePercent
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400"
            />

            <input
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="WELCOME100"
              className="h-12 w-full rounded-2xl border border-white/10 bg-[#171b26] pl-11 pr-4 outline-none transition focus:border-yellow-400 placeholder:text-white/30"
            />

          </div>

          <button className="rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 px-6 font-semibold text-black transition hover:brightness-105 active:scale-95">
            Apply
          </button>

        </div>

      </section>



      {/* ================= Summary ================= */}

      <section className="mx-4 mt-6">

        <div className="rounded-3xl border border-yellow-500/15 bg-gradient-to-br from-[#171b26] to-[#10131b] p-5">

          <div className="flex items-center justify-between mb-5">

            <h3 className="font-semibold text-base">
              Payment Summary
            </h3>

            <div className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs text-yellow-400">
              Live
            </div>

          </div>

          <div className="space-y-4">

            <div className="flex justify-between text-sm">
              <span className="text-white/50">
                Deposit Amount
              </span>

              <span className="font-medium">
                ₹{deposit}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-white/50">
                Bonus
              </span>

              <span className="font-medium text-green-400">
                +₹{bonus}
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

            <div className="border-t border-white/10 pt-4">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs text-white/45">
                    Total Credit
                  </p>

                  <p className="text-2xl font-black text-yellow-400">
                    ₹{total}
                  </p>
                </div>

                <div className="rounded-2xl bg-green-500/10 px-3 py-2 text-center">

                  <p className="text-[10px] uppercase tracking-wider text-white/40">
                    You Save
                  </p>

                  <p className="font-bold text-green-400">
                    ₹{bonus}
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>



      {/* ================= Bottom CTA ================= */}

      <div className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-[#090b11]/95 backdrop-blur-2xl">

        <div className="mx-4 py-4">

          <button
            onClick={handleSubmit}
            className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-base font-bold text-black shadow-xl shadow-yellow-500/20 transition hover:brightness-105 active:scale-[0.98]"
          >
            <ArrowDownCircle
              size={20}
              className="transition group-hover:-translate-y-0.5"
            />

            Continue to Payment

          </button>

          <p className="mt-2 text-center text-[11px] text-white/35">
            🔒 Secured by encrypted payment gateway
          </p>

        </div>

      </div>


    </main>
  );
}
