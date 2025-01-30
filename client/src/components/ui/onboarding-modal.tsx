import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletButton } from "../solana/solana-provider";
import { Shield, Lightbulb, Layout, Bell, ExternalLink } from 'lucide-react';

const FeatureItem = ({ icon: Icon, title, description }:any) => (
  <div className="bg-[#161D26] rounded-xl p-2 flex flex-col gap-2 sm:gap-3 border border-[#333333] hover:border-[#C9F31D] hover:scale-105 cursor-pointer transition-colors">
    <div className="text-[#C9F31D] flex items-center justify-center">
      <Icon size={32} className="sm:w-10 sm:h-10 w-8 h-8" />
    </div>
    <div className="flex flex-col gap-0.5 sm:gap-1">
      <span className="text-white font-bold text-base sm:text-lg">{title}</span>
      <span className="text-gray-400 text-xs sm:text-sm leading-tight">{description}</span>
    </div>
  </div>
);

const ProtocolCard = ({ logo, name, isLive = true }:any) => (
  <div className="bg-[#161D26] rounded-xl p-4 flex flex-col items-center gap-3 border border-[#333333] hover:border-[#C9F31D] transition-colors relative">
    <img src={logo} alt={name} className="h-12 w-12 object-contain" />
    <span className="text-white font-bold text-lg">{name}</span>
    {!isLive && (
      <div className=" right-2 bg-[#1D1D1D] px-2 py-1 rounded-full">
        <span className="text-xs text-gray-400">Coming Soon</span>
      </div>
    )}
  </div>
);

const OnBoardingModal = ({ isOpen, onClose, poolsData }: any) => {
  const { connected, publicKey } = useWallet();

  // Determine if modal should be open based on conditions
  const shouldShowModal = !connected || (connected && poolsData?.length === 0);

  if (!shouldShowModal) return null;
  return (
    <div className="fixed z-10 inset-0 bg-black bg-opacity-50 flex items-center justify-center  max-h-[100vh] ">
      <div className="overflow-y-auto max-h-[100vh] max-w-[697px] w-full border rounded-[13px] border-[#333333] bg-[#0B0E12] h-fit">
        <div className="px-[20px] py-6 flex flex-col gap-2 lg:gap-5 pt-12">
          {!connected ? (
           <>
           <div className="flex flex-col gap-1 sm:gap-2 items-center">
             <h2 className="text-xl sm:text-2xl text-white flex flex-col max-w-[260px] sm:max-w-[300px] gap-1 mb-4 sm:mb-8">
               <span className="font-thin text-xs sm:text-sm lg:w-full">Welcome to</span>
               <img className="w-[200px] sm:w-[240px] lg:w-full" src="/logo.svg" />
             </h2>
             <h2 className="text-sm sm:text-base lg:text-[22px]">
               REVOLUTIONIZING
               <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#C9F31D] to-[#758D11]">
                 {" "}
                 RISK MANAGEMENT
               </span>{" "}
               <br /> IN DECENTRALIZED FINANCE
             </h2>
             <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:gap-6 w-full mt-4 sm:mt-8 mb-3 sm:mb-6">
               <FeatureItem 
                 icon={Shield}
                 title="Built on Solana"
                 description="Leverages Solana's high-speed, low-cost infrastructure."
               />
               <FeatureItem 
                 icon={Lightbulb}
                 title="AI-Driven Insights"
                 description="Personalized recommendations powered by DeepSeek AI."
               />
               <FeatureItem 
                 icon={Layout}
                 title="User-Friendly Interface"
                 description="Simplifies complex DeFi strategies into dashboards."
               />
               <FeatureItem 
                 icon={Bell}
                 title="Real-Time Alerts"
                 description="Stay ahead of market changes with notifications."
               />
             </div>
             <div className="flex flex-col gap-1 sm:gap-2 items-center justify-center">
               <span className="text-[#E4E4E4] text-[10px] sm:text-xs">Powered By</span>
               <img
                 src="/deepseek.png"
                 className="mt-[-10px] sm:mt-[-14px] w-[120px] sm:w-[150px]"
                 alt=""
               />
             </div>
         
             <p className="text-gray-400 mt-2 sm:mt-4 text-xs sm:text-sm">
               Connect your wallet to access all features
             </p>
           </div>
           <div className="flex flex-col gap-1 sm:gap-2 justify-end items-center">
             <WalletButton />
             <button 
               className="hover:text-white active:scale-95 text-sm sm:text-base" 
               onClick={()=>{ onClose() }}
             >
               Connect later
             </button>
           </div>
         </>
          ) : poolsData?.length === 0 ? (
            <>
             <div className="flex flex-col gap-4 items-center">
             <h2 className="text-2xl  text-white flex flex-col max-w-[300px] gap-1 mb-8">
                <img src="/logo.svg" />
                  <span className="font-thin text-sm">Connected Wallet</span>
                  <span className="text-xs text-[#C9F31D]">
                  {
                    publicKey?.toBase58()
                  }
                  </span>

                </h2>
                <div className="text-gray-400 text-center text-sm ">
      It looks like you don’t have any ongoing lendings at the moment.
    </div>
                  <h2 className="text-xl uppercase text-white font-bold mt-2">
                    Get Started
                  </h2>
              </div>

              <div className="grid grid-cols-3 gap-4 my-6 mt-2">
                <ProtocolCard 
                  logo="/solend-logo.png" 
                  name="Solend" 
                  isLive={true}
                />
                <ProtocolCard 
                  logo="/port-logo.png" 
                  name="Port Finance" 
                  isLive={false}
                />
                <ProtocolCard 
                  logo="/hubble-logo.webp" 
                  name="Hubble" 
                  isLive={false}
                />
              </div>

              <div className="flex flex-col gap-4 items-center">
                <button
                  className="w-full max-w-md bg-[#C9F31D] hover:bg-[#d4f542] text-black font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
                  onClick={onClose}
                >
                  Create Pool with Solend
                  <ExternalLink size={18} />
                </button>
                <button 
                  className="text-gray-400 hover:text-white active:scale-95 transition-all text-sm"
                  onClick={onClose}
                >
                  I'll do this later
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default OnBoardingModal;
