"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Copy,
  Landmark,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useGetMyWithdrawlsQuery } from "@/app/store/apis/withdrawlsSlice";

type WithdrawStatus =
  | "pending"
  | "processing"
  | "approved"
  | "completed"
  | "rejected";

type WithdrawFilter = WithdrawStatus | "all";

const STATUS_CONFIG = {
  pending: {
    text: "#fbbf24",
    bg: "rgba(251,191,36,.12)",
    border: "rgba(251,191,36,.25)",
    label: "Pending",
  },
  processing: {
    text: "#60a5fa",
    bg: "rgba(96,165,250,.12)",
    border: "rgba(96,165,250,.25)",
    label: "Processing",
  },
  approved: {
    text: "#22c55e",
    bg: "rgba(34,197,94,.12)",
    border: "rgba(34,197,94,.25)",
    label: "Approved",
  },
  completed: {
    text: "#22c55e",
    bg: "rgba(34,197,94,.12)",
    border: "rgba(34,197,94,.25)",
    label: "Completed",
  },
  rejected: {
    text: "#ef4444",
    bg: "rgba(239,68,68,.12)",
    border: "rgba(239,68,68,.25)",
    label: "Rejected",
  },
} as const;

const FILTERS: WithdrawFilter[] = [
  "all",
  "pending",
  "processing",
  "approved",
  "completed",
  "rejected",
];

export default function WithdrawHistory() {
  const [filter, setFilter] = useState<WithdrawFilter>("all");

  const {
    data: withdrawHistory,
    isLoading: withdrawHistoryLoading,
  } = useGetMyWithdrawlsQuery({});

  const withdraws = useMemo(() => {
    if (!withdrawHistory?.data) return [];

    if (filter === "all") return withdrawHistory.data;

    return withdrawHistory.data.filter(
      (item: any) => item.status === filter
    );
  }, [withdrawHistory, filter]);

  return (
    <div
      className="rounded-2xl overflow-hidden mx-4"
      style={{
        border: "1px solid rgba(255,255,255,.07)",
        background: "#11151d",
      }}
    >
      {/* Header */}

      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <h3 className="font-bold text-white">
          Withdrawal History
        </h3>

        <span className="text-xs text-gray-400">
          {withdraws.length} Records
        </span>
      </div>

      {/* Filters */}

      <div className="flex gap-2 overflow-x-auto px-4 py-3 border-b border-white/5 scrollbar-hide">
        {FILTERS.map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition whitespace-nowrap ${
              filter === item
                ? "bg-cyan-500 text-white"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
            }`}
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </button>
        ))}
      </div>

      {/* Loading */}

      {withdrawHistoryLoading ? (
        <div className="py-12 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
        </div>
      ) : withdraws.length === 0 ? (
        <div className="py-14 text-center">
          <Landmark className="w-12 h-12 mx-auto text-white/20" />

          <p className="mt-4 text-white font-semibold">
            No Withdrawals Found
          </p>

          <p className="text-xs text-white/40 mt-1">
            Your withdrawal history will appear here.
          </p>
        </div>
      ) : (
        withdraws.map((withdraw: any, index: number) => {
          const status =
            STATUS_CONFIG[
              withdraw.status as keyof typeof STATUS_CONFIG
            ];

          return (
            <div
              key={withdraw._id}
              className="flex items-center gap-3 px-4 py-4 hover:bg-white/[0.03] transition"
              style={{
                borderBottom:
                  index !== withdraws.length - 1
                    ? "1px solid rgba(255,255,255,.05)"
                    : "none",
              }}
            >
              {/* Icon */}

              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{
                  color: status.text,
                  background: status.bg,
                  border: `1px solid ${status.border}`,
                }}
              >
                <ArrowUpRight className="w-5 h-5" />
              </div>

              {/* Content */}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-white">
                    ₹{withdraw.amount.toLocaleString("en-IN")}
                  </p>

                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                    style={{
                      color: status.text,
                      background: status.bg,
                      border: `1px solid ${status.border}`,
                    }}
                  >
                    {status.label}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-1 text-xs text-white/45 flex-wrap">
                  <span>{withdraw.method.toUpperCase()}</span>

                  <span>•</span>

                  <span>
                    {new Date(
                      withdraw.createdAt
                    ).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {withdraw.transactionId && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[11px] text-white/35 truncate">
                      TXN: {withdraw.transactionId}
                    </span>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          withdraw.transactionId
                        );

                        toast.success(
                          "Transaction ID copied"
                        );
                      }}
                    >
                      <Copy className="w-3.5 h-3.5 text-cyan-400" />
                    </button>
                  </div>
                )}

                {withdraw.utr && (
                  <div className="mt-1 text-[11px] text-white/35">
                    UTR : {withdraw.utr}
                  </div>
                )}

                {withdraw.remark && (
                  <div className="mt-2 text-xs text-red-300">
                    {withdraw.remark}
                  </div>
                )}
              </div>

              {/* Amount */}

              <div className="text-right">
                <p
                  className="font-black"
                  style={{
                    color:
                      withdraw.status === "completed"
                        ? "#ef4444"
                        : status.text,
                    fontFamily: "Orbitron",
                  }}
                >
                  -₹{withdraw.amount.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}