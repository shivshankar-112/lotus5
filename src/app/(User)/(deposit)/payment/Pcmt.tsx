
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeft, QrCode, CreditCard, Building2,
  Copy, Check, Upload, ShieldCheck, Wallet, ArrowDownCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BASE_URL, DEPOSIT } from "@/lib/APIROTES";
import axios from "axios";
import { toast } from "sonner";



interface PaymentConfig {
  upi: {
    upiId: string;
    upiName: string;
    qrImage: string;
  };
  bank: {
    accountName: string;
    accountNumber: string;
    ifsc: string;
    bankName: string;
    branchName: string;
  };
}

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const amount = Number(searchParams.get("amount") || 500);
  const method = searchParams.get("method") || "upi"; // Default to QR if not specified
  const coupon = searchParams.get("coupon") || null; // Optional coupon code

  const [loading, setLoading] = useState(true);

  const [paymentConfig, setPaymentConfig] =
    useState<PaymentConfig | null>(null);

  const [tab, setTab] = useState<"qr" | "upi" | "bank">('qr');
  const [utr, setUtr] = useState("");

  const [copied, setCopied] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const copy = async (v: string, k: string) => {
    await navigator.clipboard.writeText(v);
    setCopied(k);
    setTimeout(() => setCopied(""), 1200);
  }

  const fetchPaymentConfig = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/admin/payment-details`
      );

      console.log("Payment config fetched:", data.data);
      setPaymentConfig(data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load payment details");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPaymentConfig();
  }, []);

  function handleSubmit() {
    if (!utr) {
      toast.error("Please provide UTR ");
      return;
    }
    setLoading(true);
    handleDeposit(amount, utr, "upi", paymentConfig?.bank)
      .then(() => {
        setLoading(false);
        toast.success("Deposit request submitted successfully!", {position: "top-center", });
        router.push("/deposit-submitted");
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        toast.error(error.message || "Failed to submit deposit request.", {position: "top-center"});
      });

  }


  async function handleDeposit(amount: number, utr: string, method: any, accountDetails?: any): Promise<void> {
    try {
      return await axios.post(DEPOSIT, { amount, method, utr, accountDetails }, { withCredentials: true })
    } catch (error: any) {
      console.log("Deposit failed:", error);
      throw new Error(error.response?.data?.message || "Deposit failed. Please try again."); // re-throw to let the DepositPanel know about the failure
    }
  }

  return (
    <main className="min-h-screen bg-[#090b11] text-white pb-32">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#090b11]/90 backdrop-blur-xl">
        <div className="flex h-14 items-center justify-between px-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ChevronLeft size={20} />
            <span className="text-sm font-medium">
              Deposit
            </span>
          </button>
          <div className="text-right">
            <h1 className="text-sm font-semibold">
              Complete Payment
            </h1>
            <p className="text-[11px] text-white/40">
              Secure Checkout
            </p>
          </div>
        </div>
      </header>

      <div className="px-4 pt-4 space-y-5">

        {/* Amount */}
        <Card className="relative overflow-hidden border border-yellow-500/15 bg-gradient-to-br from-[#1b140b] via-[#131720] to-[#090b11]">
          <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-yellow-400/10 blur-3xl" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[3px] text-white/40">Amount to Pay</p>
              <h2 className="mt-1 text-3xl font-black text-yellow-400">₹{amount.toFixed(2)}</h2>
              <p className="mt-1 text-xs text-white/45">Wallet will be credited instantly</p>
            </div>

            <div className="rounded-2xl border border-yellow-500/20 bg-yellow-400/10 p-3">
              <Wallet className="text-yellow-400" size={28} />
            </div>
          </div>
        </Card>

        {/* Payment Tabs */}
        <div className="rounded-2xl bg-[#171b26] p-1 flex">
          {[
            ["qr", "QR", QrCode],
            ["upi", "UPI", CreditCard],
            ["bank", "Bank", Building2]
          ].map(([id, label, Icon]: any) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 h-12 rounded-xl flex items-center justify-center gap-2 transition ${tab === id
                ? "bg-yellow-400 text-black font-semibold shadow-lg shadow-yellow-500/20"
                : "text-white/60 hover:text-white"
                }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>

        {/* QR */}
        {tab === "qr" && (
          <Card className="border border-white/5">
            <div className="flex justify-center">
              <div className="rounded-3xl bg-white p-4 shadow-xl">
                <img src={paymentConfig?.upi?.qrImage || "/qr.png"} alt="QR" width={210} height={210} />
              </div>
            </div>

            <div className="mt-4 flex justify-center gap-3 text-xs text-white/50">
              <span>PhonePe</span>
              <span>•</span>
              <span>Google Pay</span>
              <span>•</span>
              <span>Paytm</span>
            </div>
          </Card>
        )}

        {/* UPI */}
        {tab === "upi" && (
          <Card className="border border-white/5">
            <p className="text-xs uppercase tracking-wider text-white/40">UPI ID</p>

            <div className="mt-3 rounded-2xl border border-white/10 bg-[#202636] p-4 flex items-center justify-between">
              <span className="font-semibold">{paymentConfig?.upi?.upiId || "lotus24@ibl"}</span>

              <button
                onClick={() => copy(paymentConfig?.upi?.upiId || "lotus24@ibl", "upi")}
                className="rounded-xl bg-yellow-400/10 px-3 py-2 text-yellow-400 flex items-center gap-2"
              >
                {copied === "upi" ? <Check size={16} /> : <Copy size={16} />}
                Copy
              </button>
            </div>
          </Card>
        )}

        {/* Bank */}
        {tab === "bank" && (
          <Card className="border border-white/5">
            {[
              ["Account", paymentConfig?.bank?.accountNumber || "123456789012"],
              ["IFSC", paymentConfig?.bank?.ifsc || "SBIN0001234"],
              ["Bank", paymentConfig?.bank?.bankName || "State Bank of India"]
            ].map(([k, v]) => (
              <div
                key={k}
                className="flex items-center justify-between py-3 border-b last:border-0 border-white/10"
              >
                <div>
                  <p className="text-[11px] uppercase text-white/40">{k}</p>
                  <p className="font-medium">{v}</p>
                </div>

                <button
                  onClick={() => copy(v, k)}
                  className="rounded-lg bg-yellow-400/10 p-2 text-yellow-400"
                >
                  {copied === k ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            ))}
          </Card>
        )}

        {/* ===== Quick Pay ===== */}
        <Card className="border border-yellow-500/20 bg-gradient-to-br from-[#17130d] to-[#10131b]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Pay Instantly</h3>
              <p className="mt-1 text-sm text-white/50">
                Open any UPI app and complete your payment.
              </p>
            </div>

            <div className="rounded-2xl bg-yellow-400/10 p-3">
              <CreditCard className="text-yellow-400" size={22} />
            </div>
          </div>

          <button
            onClick={() =>
              window.location.href =
              `upi://pay?pa={paymentConfig?.upi?.upiId || "lotus24@ibl"}&pn=Lotus24&am=${amount}&cu=INR&tn=Wallet Deposit`
            }
            className="mt-5 flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 font-semibold text-black shadow-lg shadow-yellow-500/20 transition hover:brightness-105 active:scale-[0.98]"
          >
            <CreditCard size={20} />
            Pay ₹{amount || 500} with UPI
          </button>

          {/* <div className="mt-4 grid grid-cols-4 gap-3">
            {[
              { name: "PhonePe", logo: "/payments/phonepe.png" },
              { name: "GPay", logo: "/payments/gpay.png" },
              { name: "Paytm", logo: "/payments/paytm.png" },
              { name: "BHIM", logo: "/payments/bhim.png" },
            ].map((app) => (
              <button
                key={app.name}
                onClick={() =>
                  window.location.href =
                  `upi://pay?pa=lotus24@ibl&pn=Lotus24&am=${amount}&cu=INR&tn=Wallet Deposit`
                }
                className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-[#202636] p-3 transition hover:border-yellow-400/40"
              >
                <img
                  src={app.logo}
                  alt={app.name}
                  className="h-9 w-9 object-contain"
                />
                <span className="text-[11px]">{app.name}</span>
              </button>
            ))}
          </div> */}

          <div className="mt-5 rounded-2xl border border-white/10 bg-[#202636] p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-white/40">UPI ID</p>
              <p className="font-semibold">lotus24@ibl</p>
            </div>

            <button
              onClick={() => copy("lotus24@ibl", "upi")}
              className="rounded-xl bg-yellow-400/10 px-3 py-2 text-yellow-400 flex items-center gap-2"
            >
              {copied === "upi" ? <Check size={16} /> : <Copy size={16} />}
              Copy
            </button>
          </div>
        </Card>

        {/* Proof */}
        <Card className="border border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Payment Proof</h3>
              <p className="text-xs text-white/45">Enter UTI( Unique Transaction Id)</p>
            </div>

            <div className="rounded-full bg-green-500/10 px-3 py-1 text-[10px] text-green-400">
              Required
            </div>
          </div>

          <input
            value={utr}
            onChange={e => setUtr(e.target.value)}
            placeholder="Transaction / UTI ID"
            className="mt-4 h-12 w-full rounded-xl border border-white/10 bg-[#202636] px-4 outline-none focus:border-yellow-400"
          />

          {/* <label className="mt-4 flex h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-yellow-500/20 bg-[#171b26] hover:border-yellow-400 transition">
            <Upload className="text-yellow-400" />
            <span className="mt-3 font-medium">
              {file ? file.name : "Upload Payment Screenshot"}
            </span>
            <span className="mt-1 text-xs text-white/45">
              PNG • JPG • JPEG
            </span>

            <input
              hidden
              type="file"
              accept="image/*"
              onChange={e => setFile(e.target.files?.[0] || null)}
            />
          </label> */}
        </Card>

        {/* Verification */}
        <Card className="border border-green-500/20 bg-green-500/10">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-green-500/20 p-2">
              <ShieldCheck className="text-green-400" size={20} />
            </div>

            <div>
              <p className="font-semibold">Automatic Verification</p>
              <p className="text-xs text-white/50">
                Payment is usually verified within 1–5 minutes.
              </p>
            </div>
          </div>
        </Card>

      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-[#090b11]/95 backdrop-blur-2xl">
        <div className="px-4 py-3">
          {/* <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-white/40">
                Total Payment
              </p>
              <p className="text-2xl font-black text-yellow-400">
                ₹500
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5">
              <ShieldCheck size={14} className="text-green-400" />
              <span className="text-xs font-medium text-green-400">
                Secure
              </span>
            </div>
          </div> */}

          <button
            disabled={loading}
            onClick={handleSubmit}
            className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 font-bold text-black shadow-lg shadow-yellow-500/20 transition-all duration-300 hover:brightness-105 active:scale-[0.98]"
          >
            <ArrowDownCircle
              size={20}
              className="transition-transform duration-300 group-hover:-translate-y-0.5"
            />
            {loading ? "Submitting..." : "Submit Payment"}
          </button>

          <p className="mt-2 text-center text-[11px] text-white/35">
            🔒 End-to-end encrypted • Funds verified automatically
          </p>
        </div>
      </div>

    </main>
  )
}

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("rounded-3xl border border-white/10 bg-[#151b26] p-5", className)}>{children}</div>
);
