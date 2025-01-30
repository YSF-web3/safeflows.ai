import React from "react";
import {
  Shield,
  AlertTriangle,
  TrendingUp,
  Activity,
  ExternalLink,
} from "lucide-react";
import { ProtocolCard } from "../ui/onboarding-modal";
import { useWallet } from "@solana/wallet-adapter-react";

const LendingDashboard = ({ data }: any) => {
  const getHealthColor = (health: any) => {
    if (health > 2) return "text-[#C9F31D]";
    if (health > 1.5) return "text-yellow-400";
    return "text-red-500";
  };
  const { connected, publicKey } = useWallet();

  

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Warnings */}
        <div className="p-4 border text-white border-[#333333] bg-red-800 bg-opacity-15 rounded-xl">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <h2 className="font-semibold text-white">AI Warnings Found</h2>
          </div>
          <ul className="list-disc pl-4 mt-2 text-white">
            {data?.message?.warnings
              ? data?.message.warnings.map((warning: any, index: any) => (
                  <li key={index} className="text-sm text-left mb-2">
                    {warning}
                  </li>
                ))
              : "No Warnings found "}
          </ul>
        </div>

        {/* Suggestions */}
        <div className="p-4 border border-[#333333] bg-blue-800 bg-opacity-15 rounded-xl">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            <h2 className="font-semibold text-white">AI Suggestions Found</h2>
          </div>
          <ul className="list-disc pl-4 mt-2 text-white">
            {data?.message?.suggestions
              ? data?.message.suggestions.map(
                  (suggestion: any, index: number) => (
                    <li key={index} className="text-sm text-left mb-2">
                      {suggestion}
                    </li>
                  )
                )
              : "No suggestions found"}
          </ul>
        </div>
      </div>


        <pre>
          
        </pre>
      {/* Pools */}
      {data?.pools?.length  > 1 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {data.pools.map((pool: any) => (
            <div
              key={pool.obligationID}
              className="border border-[#333333] bg-black rounded-xl overflow-hidden"
            >
              <div className="border-b border-[#333333] p-4 ">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold capitalize text-[white]">
                    {pool.lendingMarketName} Pool
                  </h2>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-[#808195]" />
                    <span
                      className={`font-mono ${getHealthColor(
                        pool.healthFactor
                      )}`}
                    >
                      {pool.healthFactor.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-6">
                {/* Deposits Section */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center text-[#C9F31D]">
                    <Activity className="h-4 w-4 mr-2 text-[#C9F31D]" />
                    Deposits (${pool.depositValueUSD.toFixed(2)})
                  </h3>
                  <div className="space-y-2">
                    {pool.deposits.map((deposit: any) => (
                      <div
                        key={deposit.mint}
                        className="flex items-center justify-between bg-[#1A2026]/40 p-3 rounded-xl border border-[#333333]"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={deposit.logo}
                            alt={deposit.symbol}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="font-medium text-[#808195]">
                            {deposit.symbol}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-[#808195]">
                            {deposit.depositedAmount.toFixed(6)}
                          </div>
                          <div className="text-xs text-[#808195]">
                            ${deposit.valueUSD.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Borrows Section */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center text-red-600">
                    <Activity className="h-4 w-4 mr-2 text-red-600" />
                    Borrows (${pool.borrowValueUSD.toFixed(2)})
                  </h3>
                  <div className="space-y-2">
                    {pool.borrows.map((borrow: any) => (
                      <div
                        key={borrow.mint}
                        className="flex items-center justify-between bg-[#1A2026]/40 p-3 rounded-xl border border-[#333333]"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={borrow.logo}
                            alt={borrow.symbol}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="font-medium text-[#808195]">
                            {borrow.symbol}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-[#808195]">
                            {borrow.borrowedAmount.toFixed(6)}
                          </div>
                          <div className="text-xs text-[#808195]">
                            ${borrow.valueUSD.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4 items-center">
          <h2 className="text-xl uppercase text-white font-bold mt-2">
              No Lendings Found
            </h2>
            <h2 className="text-2xl  text-white flex flex-col max-w-[300px] gap-1 mb-2">
              <span className="text-xs text-[#C9F31D]">
                {publicKey?.toBase58()}
              </span>
            </h2>
            
            <div className="text-gray-400 text-center text-md mb-4">
              It looks like you don’t have any ongoing lendings at the moment.
            </div>
            
          </div>

          <div className="grid grid-cols-3 gap-4 my-6 mt-2">
            <ProtocolCard logo="/solend-logo.png" name="Solend" isLive={true} />
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
            <a
              href="https://solend.fi/"
              target="_blank"
              className="w-full max-w-md bg-[#C9F31D] hover:bg-[#d4f542] text-black font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              Create Pool with Solend
              <ExternalLink size={18} />
            </a>
          </div>
        </>
      )}
    </div>
  );
};

export default LendingDashboard;
