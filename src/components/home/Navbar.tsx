"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { Bell, ChevronDown, Wallet } from "lucide-react";

export default function Navbar() {
  const route = useRouter();
  const [user, setUser] = useState<any>();
  const [authorised, setAuthorised] = useState<boolean>();

  const { verifyUser } = useAuth();

  const checkUser = async () => {
    const { user, authorised } = await verifyUser();
    if (!authorised) return setAuthorised(false);

    setAuthorised(true);
    setUser(user);
  }

  useEffect(() => {
    checkUser();
  }, [verifyUser])

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-xl bg-[#0f1117]/90">
      <div className="h-16 px-5 flex items-center justify-between">

        {/* Logo */}
        <button
          onClick={() => route.push("/")}
          className="text-2xl font-black tracking-wider"
        >
          <span className="text-[#f5a623]">LOTUS</span>
          <span className="text-white">24</span>
        </button>

        {/* Logged In */}
        {authorised ? (
          <div className="flex items-center gap-3">

            {/* Wallet */}

            <button
              onClick={() => route.push("/wallet")}
              className="hidden sm:flex items-center gap-2 rounded-full bg-[#1a1d27] border border-white/10 px-4 py-2 hover:border-[#f5a623]/50 transition"
            >
              <Wallet className="w-4 h-4 text-[#f5a623]" />

              <div className="text-left leading-tight">
                <p className="text-[10px] uppercase text-white/40">
                  Wallet
                </p>

                <p className="text-sm font-bold text-white">
                  ₹ {user?.wallet ?? 0}
                </p>
              </div>
            </button>

            {/* Notification */}

            <button className="relative w-10 h-10 rounded-full border border-white/10 bg-[#1a1d27] flex items-center justify-center hover:border-[#f5a623]/50 transition">
              <Bell className="w-5 h-5 text-white" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
            </button>

            {/* Profile */}

            <button
              onClick={() => route.push("/profile")}
              className="flex items-center gap-3 rounded-full bg-[#1a1d27] border border-white/10 px-2 py-1 hover:border-[#f5a623]/50 transition"
            >
              <div className="w-10 h-10 rounded-full bg-[#f5a623] text-black flex items-center justify-center font-bold">
                {user?.name?.charAt(0)}
              </div>

              <div className="hidden md:block text-left">
                <p className="text-xs text-white/50">
                  Welcome
                </p>

                <p className="text-sm font-semibold text-white">
                  {user?.name}
                </p>
              </div>

              <ChevronDown className="w-4 h-4 text-white/50" />
            </button>

          </div>
        ) : (
          <div className="flex items-center gap-3">

            <Button
              variant="outline"
              onClick={() => route.push("/auth/login")}
              className="rounded-full border-[#f5a623] text-[#f5a623] hover:bg-[#f5a623] hover:text-black"
            >
              Log In
            </Button>

            <Button
              onClick={() => route.push("/auth")}
              className="rounded-full bg-[#f5a623] hover:bg-[#e09410] text-black"
            >
              Join Now
            </Button>

          </div>
        )}
      </div>
    </header>
  );
}
