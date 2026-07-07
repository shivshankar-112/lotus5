
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "@/lib/APIROTES";
import { fetchWallet, updateBalance } from "@/app/store/features/walletSlice";
import type { AppDispatch, RootState } from "@/app/store/store";

export type CoinSide = "heads" | "tails";

export interface FlipRecord {
  result: CoinSide;
  bet: CoinSide;
  amount: number;
  betAmount?: number;
  won: boolean;
  payout: number;
}

export interface GameStats {
  balance: number | undefined;
  wins: number;
  losses: number;
  pnl: number;
  history: FlipRecord[];
}

async function fetchFlipResult(choice: CoinSide, amount: number): Promise<CoinSide> {
  const { data } = await axios.post(
    `${BASE_URL}/coin/flip`,
    { choice, betAmount: amount },
    { withCredentials: true }
  );
  return data.data.result as CoinSide;
}

export function useHeadsTails() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: wallet } = useSelector((s: RootState) => s.wallet);

  const [stats, setStats] = useState<GameStats>({
    balance: undefined,
    wins: 0,
    losses: 0,
    pnl: 0,
    history: [],
  });

  const [flipping, setFlipping] = useState(false);
  const [result, setResult] = useState<CoinSide | null>(null);
  const [isWin, setIsWin] = useState<boolean | null>(null);
  const [showParticles, setShowParticles] = useState(false);
  const roundRef = useRef(0);

  useEffect(() => {
    if (!wallet) dispatch(fetchWallet());
  }, [wallet, dispatch]);

  useEffect(() => {
    if (wallet) {
      setStats(s => ({ ...s, balance: wallet.balance }));
    }
  }, [wallet]);

  const getHistory = useCallback(async () => {
    try {
      const { data: res } = await axios.get(`${BASE_URL}/coin/my-history`, { withCredentials: true });
      const history = Array.isArray(res.data) ? res.data : [];
      const pnl = history.reduce((a:any,b:any)=>a + (b.won ? b.payout-(b.betAmount||0) : -(b.betAmount||0)),0);
      setStats(prev=>({
        ...prev,
        history,
        wins: history.filter((x:any)=>x.won).length,
        losses: history.filter((x:any)=>!x.won).length,
        pnl
      }));
    } catch {
      toast.error("Error in getting history");
    }
  },[]);

  useEffect(()=>{ getHistory(); },[getHistory]);

  const flip = useCallback(async (side:CoinSide, amount:number)=>{
    if(flipping) return;
    if((stats.balance??0)<amount){
      toast.error("Insufficient balance");
      return;
    }

    setFlipping(true);
    setResult(null);
    setIsWin(null);

    dispatch(updateBalance(-amount));

    // setStats(s=>({...s,balance:(s.balance??0)-amount}));
    roundRef.current++;

    try{
      const flipResult=await fetchFlipResult(side,amount);
      const won=flipResult===side;
      const payout=won?amount*2:0;

      setTimeout(()=>{
        setResult(flipResult);
        setIsWin(won);
        setShowParticles(won);

        dispatch(updateBalance(payout));
        
        setStats(prev=>({
          ...prev,
          balance:(prev.balance??0)+payout,
          wins:prev.wins+(won?1:0),
          losses:prev.losses+(won?0:1),
          pnl:prev.pnl+(won?amount:-amount),
          history:[
            {result:flipResult,bet:side,amount,won,payout},
            ...prev.history
          ].slice(0,50)
        }));

        setTimeout(()=>setFlipping(false),2000);
      },1600);

    }catch(e:any){
      setStats(s=>({...s,balance:(s.balance??0)+amount}));
      toast.error(e?.response?.data?.message||e.message||"Flip failed");
      setFlipping(false);
    }
  },[flipping,stats.balance]);

  return {
    stats,
    flipping,
    result,
    isWin,
    showParticles,
    setShowParticles,
    flip,
  };
}
