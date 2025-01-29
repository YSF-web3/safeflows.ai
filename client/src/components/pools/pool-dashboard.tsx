import React from 'react';
import { Shield, AlertTriangle, TrendingUp, Activity } from 'lucide-react';

const LendingDashboard = ({ data }:any) => {
  const getHealthColor = (health:any) => {
    if (health > 2) return 'text-[#C9F31D]';
    if (health > 1.5) return 'text-yellow-400';
    return 'text-red-500';
  };

  if(!data) return null

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Warnings */}
        <div className="p-4 border text-white border-[#333333] bg-red-800 bg-opacity-15 rounded-xl">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <h2 className="font-semibold text-white">Warnings</h2>
          </div>
          <ul className="list-disc pl-4 mt-2 text-white">
            {data?.message.warnings.map((warning:any, index:any) => (
              <li key={index} className="text-sm text-left mb-2">{warning}</li>
            ))}
          </ul>
        </div>

        {/* Suggestions */}
        <div className="p-4 border border-[#333333] bg-blue-800 bg-opacity-15 rounded-xl">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            <h2 className="font-semibold text-white">Suggestions</h2>
          </div>
          <ul className="list-disc pl-4 mt-2 text-white">
            {data?.message.suggestions.map((suggestion:any, index:number) => (
              <li key={index} className="text-sm text-left mb-2">{suggestion}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Pools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {data.pools.map((pool:any) => (
          <div key={pool.obligationID} className="border border-[#333333] bg-[#161D26] rounded-xl overflow-hidden">
            <div className="border-b border-[#333333] p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold capitalize text-[white]">
                  {pool.lendingMarketName} Pool
                </h2>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-[#808195]" />
                  <span className={`font-mono ${getHealthColor(pool.healthFactor)}`}>
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
                  {pool.deposits.map((deposit:any) => (
                    <div key={deposit.mint} className="flex items-center justify-between bg-[#1A2026] p-3 rounded-xl border border-[#333333]">
                      <div className="flex items-center space-x-3">
                        <img src={deposit.logo} alt={deposit.symbol} className="w-6 h-6 rounded-full" />
                        <span className="font-medium text-[#808195]">{deposit.symbol}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-[#808195]">{deposit.depositedAmount.toFixed(6)}</div>
                        <div className="text-xs text-[#808195]">${deposit.valueUSD.toFixed(2)}</div>
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
                  {pool.borrows.map((borrow:any) => (
                    <div key={borrow.mint} className="flex items-center justify-between bg-[#1A2026] p-3 rounded-xl border border-[#333333]">
                      <div className="flex items-center space-x-3">
                        <img src={borrow.logo} alt={borrow.symbol} className="w-6 h-6 rounded-full" />
                        <span className="font-medium text-[#808195]">{borrow.symbol}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-[#808195]">{borrow.borrowedAmount.toFixed(6)}</div>
                        <div className="text-xs text-[#808195]">${borrow.valueUSD.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LendingDashboard;