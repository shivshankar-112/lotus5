"use client";
// Page: User Profile
// File: app/profile/page.tsx  (or drop into any Next.js route)
// Styling: Tailwind CSS v4  (no config needed – uses @import "tailwindcss")

import { useState } from "react";
import {
    Wallet,
    Bell,
    ArrowUpDown,
    Gift,
    Tag,
    Crown,
    Ticket,
    Settings,
    MessageSquare,
    ChevronRight,
    LogOut,
} from "lucide-react";

const menuItems = [
    { icon: Wallet, label: "Account Balance" },
    { icon: Bell, label: "Notifications" },
    { icon: ArrowUpDown, label: "Transaction History" },
    { icon: Gift, label: "Bonuses" },
    { icon: Tag, label: "Promocode" },
    { icon: Crown, label: "VIP Club" },
    { icon: Ticket, label: "My Bets" },
    { icon: Settings, label: "Settings" },
];

export default function UserProfilePage() {
    const [copied, setCopied] = useState(false);

    function copyId() {
        navigator.clipboard.writeText("4644466831").catch(() => { });
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    }

    return (
        <div className="min-h-screen bg-[#0d0f14] text-white flex flex-col">
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-5 pt-6 pb-4">
                <h1 className="text-2xl font-bold tracking-tight">User Profile</h1>
                <button className="text-gray-400 hover:text-white text-2xl leading-none">×</button>
            </div>

            {/* ── Avatar + info ── */}
            <div className="flex items-center gap-4 px-5 pb-6">
                <div className="w-14 h-14 rounded-full border-2 border-[#2a2d38] flex items-center justify-center bg-[#1a1d26] shrink-0">
                    {/* Person icon */}
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8a8fa8" strokeWidth="1.8">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                </div>
                <div className="flex flex-col gap-0.5">
                    <p className="text-[15px] font-medium text-white">+919241033110</p>
                    <p className="text-[14px] text-gray-400">
                        My Rank:{" "}
                        <span className="text-[#f5a623] font-semibold">Novice</span>
                    </p>
                    <button
                        onClick={copyId}
                        className="flex items-center gap-1.5 text-[13px] text-gray-400 hover:text-white transition-colors"
                    >
                        User ID: 4644466831
                        <span className="text-base">{copied ? "✅" : "📋"}</span>
                    </button>
                </div>
            </div>

            {/* ── Balance + Deposit ── */}
            <div className="flex gap-3 px-5 pb-6">
                <div className="flex-1 bg-[#1e2130] rounded-xl flex items-center justify-center py-3.5">
                    <span className="text-white text-[17px] font-semibold">₹ 0.00</span>
                </div>
                <button className="flex-1 bg-[#f5a623] hover:bg-[#e8962a] active:bg-[#d4871a] text-black font-bold text-[17px] rounded-xl py-3.5 transition-colors">
                    Deposit
                </button>
            </div>

            {/* ── Menu Items ── */}
            <div className="flex-1 px-5 flex flex-col divide-y divide-[#1e2130]">
                {menuItems.map(({ icon: Icon, label }) => (
                    <button
                        key={label}
                        className="flex items-center justify-between py-4 hover:bg-[#ffffff08] transition-colors -mx-5 px-5"
                    >
                        <div className="flex items-center gap-4">
                            <Icon size={20} className="text-gray-400 w-7" />
                            <span className="text-[16px] font-medium text-white">{label}</span>
                        </div>
                        <ChevronRight size={16} className="text-[#5a5f75]" />
                    </button>
                ))}

                {/* Live Support */}
                <button className="flex items-center gap-4 py-4 -mx-5 px-5">
                    <MessageSquare size={20} className="text-[#f5a623] w-7" />
                    <span className="text-[16px] font-semibold text-[#f5a623]">Live Support</span>
                </button>

                {/* Log Out */}
                <button className="flex items-center gap-4 py-4 -mx-5 px-5">
                    <LogOut size={20} className="text-gray-400 w-7" />
                    <span className="text-[16px] font-medium text-white">Log Out</span>
                </button>
            </div>

            <div className="h-8" />
        </div>
    );
}