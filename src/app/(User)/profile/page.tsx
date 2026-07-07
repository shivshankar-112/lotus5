'use client';

import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProfilePage, { WalletProfileSection } from '@/components/auth/profile-page';
import { fetchUserProfile } from '@/app/store/features/userSlice';
import type { RootState, AppDispatch } from '@/app/store/store';
import { fetchWallet } from '@/app/store/features/walletSlice';
import { useAuth } from '@/hooks/useAuth';



const Page = () => {

  const dispatch = useDispatch<AppDispatch>();

  const {
    data: user,
    loading: userLoading,
    error: userError,
  } = useSelector((state: RootState) => state.user);

  const {
    data: wallet,
    loading: walletLoading,
    error: walletError
  } = useSelector((state: RootState) => state.wallet);

  const { logout } = useAuth();

  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(fetchWallet());
  }, [dispatch]);

  const profileUser = useMemo(() => {
    if (!user) return null;

    return {
      ...user,
      balance: wallet?.balance ?? 0,
    };
  }, [user, wallet]);


  function fetchData(){
    dispatch(fetchUserProfile());
    dispatch(fetchWallet());
  }

  if (userLoading || walletLoading || !wallet || !profileUser) return <Loader />
  if (userError) <DisplayError error={userError} retry={fetchData}/>
  if (walletError) <DisplayError error={walletError} retry={fetchData}/>


  return (
    <div
      className="min-h-screen flex flex-col max-w-md mx-auto pb-8"
      style={{ background: "#080b12", fontFamily: "'DM Sans', sans-serif", color: "#fff" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      <ProfilePage user={profileUser!} onLogout={logout} wallet={wallet} />

      {/* {
        walletData && <WalletProfileSection wallet={walletData} />
      } */}

    </div>
  );
};


function Loader() {
  return (
    <div className="min-h-screen bg-[#080b12] flex items-center justify-center">
      <div className="flex flex-col items-center">

        {/* Animated Logo */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20"></div>

          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-400 animate-spin"></div>

          <div className="absolute inset-3 rounded-full border-4 border-transparent border-b-blue-500 animate-spin [animation-duration:1.5s]"></div>

          <div className="absolute inset-6 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_25px_#22d3ee]" />
        </div>

        <h2 className="mt-8 text-white text-xl font-bold tracking-wide">
          Loading Profile
        </h2>

        <p className="text-gray-400 mt-2 text-sm">
          Fetching your latest account details...
        </p>

        {/* Progress */}
        <div className="w-64 h-1.5 bg-white/10 rounded-full mt-8 overflow-hidden">
          <div className="h-full w-1/2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-[loading_1.5s_ease-in-out_infinite]" />
        </div>

      </div>
    </div>
  );
}

function DisplayError({error, retry}:{error:any, retry:any}){
  return (
    <div className="min-h-screen bg-[#080b12] flex items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-3xl border border-red-500/20 bg-[#11151d] p-8 text-center shadow-2xl">

        {/* Error Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            />
          </svg>
        </div>

        <h1 className="mt-6 text-2xl font-bold text-white">
          Something went wrong
        </h1>

        <p className="mt-3 text-sm text-gray-400 leading-6">
          {error || "Unable to load your profile at the moment. Please try again."}
        </p>

        <button
          onClick={() => retry()}
          className="mt-8 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/30 active:scale-95"
        >
          Retry
        </button>

        <button
          onClick={() => window.location.reload()}
          className="mt-3 w-full rounded-xl border border-white/10 py-3 text-gray-300 transition hover:bg-white/5"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}

export default Page;