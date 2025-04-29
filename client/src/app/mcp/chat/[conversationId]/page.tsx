'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { IconSend, IconBrain, IconRobot, IconChartBar, IconAlertTriangle, IconActivity, IconWallet, IconArrowUpRight, IconShield } from '@tabler/icons-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import Image from 'next/image';
import { useGetPools } from '@/components/dashboard/dashboard-data-access';
import { PublicKey } from '@solana/web3.js';

interface TokenData {
  mint: string;
  symbol: string;
  logo: string;
  depositedAmount?: number;
  borrowedAmount?: number;
  valueUSD: number;
}

interface PoolData {
  obligationID: string;
  lendingMarketName: string;
  healthFactor: number;
  depositValueUSD: number;
  borrowValueUSD: number;
  deposits: TokenData[];
  borrows: TokenData[];
}

interface AIResponse {
  warnings: string[];
  suggestions: string[];
}

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  poolData?: PoolData;
  aiResponse?: AIResponse;
}

const getHealthColor = (health: number) => {
  if (health > 2) return "text-[#C9F31D]";
  if (health > 1.5) return "text-yellow-400";
  return "text-red-500";
};

export default function MCPChat() {
  const { conversationId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { connected, publicKey } = useWallet();

  // Use the dashboard's pool data query
  const { data: poolsResponse, isLoading: isLoadingPools } = useGetPools({
    address: publicKey ? new PublicKey(publicKey) : undefined
  });

  useEffect(() => {
    if (poolsResponse?.pools?.length > 0 && !messages.length) {
      // Add initial greeting with pool data
      setMessages([{
        id: 'initial',
        content: `Hello! I notice you have ${poolsResponse.pools.length} active positions in Solend. Would you like me to analyze your current risk profile?`,
        role: 'assistant',
        timestamp: new Date(),
        poolData: poolsResponse.pools[0],
        aiResponse: {
          warnings: poolsResponse.message?.warnings || [],
          suggestions: poolsResponse.message?.suggestions || []
        }
      }]);
    }
  }, [poolsResponse]);

  const generateAIResponse = async (userInput: string): Promise<Message> => {
    if (!poolsResponse?.pools?.length) {
      return {
        id: `assistant-${Date.now()}`,
        content: "I don't see any active positions in your wallet. Would you like to learn about available lending opportunities?",
        role: 'assistant',
        timestamp: new Date()
      };
    }

    const pool = poolsResponse.pools[0]; // Using first pool for simplicity
    const responses = [
      {
        trigger: /risk|health|safety/i,
        response: `Your current health factor is ${pool.healthFactor.toFixed(2)} which indicates a ${
          pool.healthFactor > 2 ? 'safe' : pool.healthFactor > 1.5 ? 'moderate' : 'high'
        } risk level. ${
          pool.healthFactor < 1.5 
            ? 'I strongly recommend increasing your collateral to improve position safety.' 
            : 'Your position is relatively stable, but continue monitoring market conditions.'
        }`,
        poolData: pool
      },
      {
        trigger: /borrow|loan|debt/i,
        response: `You have borrowed assets worth $${pool.borrowValueUSD.toFixed(2)} against $${pool.depositValueUSD.toFixed(2)} in deposits. Your utilization rate is ${((pool.borrowValueUSD / pool.depositValueUSD) * 100).toFixed(1)}%. ${
          pool.borrowValueUSD / pool.depositValueUSD > 0.7 
            ? 'Consider reducing your borrow amount to decrease risk exposure.' 
            : 'Your utilization rate is within safe parameters.'
        }`,
        poolData: pool
      },
      {
        trigger: /deposit|collateral|asset/i,
        response: `Your deposits consist of:\n${pool.deposits.map((d: TokenData) => 
          `• ${d.symbol}: ${d.depositedAmount?.toFixed(6)} ($${d.valueUSD.toFixed(2)})`
        ).join('\n')}`,
        poolData: pool
      }
    ];

    const matchedResponse = responses.find(r => r.trigger.test(userInput)) || {
      response: "I can provide insights about your risk levels, borrowing capacity, or deposited assets. What would you like to know?",
      poolData: pool
    };

    return {
      id: `assistant-${Date.now()}`,
      content: matchedResponse.response,
      role: 'assistant',
      timestamp: new Date(),
      poolData: matchedResponse.poolData
    };
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: input,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(input);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const MetricsDisplay = ({ poolData, aiResponse }: { poolData: PoolData, aiResponse?: AIResponse }) => (
    <div className="mt-4 space-y-4">
      {/* Pool Metrics */}
      <div className="bg-[#1A2026]/40 p-4 rounded-xl border border-[#333333]">
        <div className="flex items-center gap-2 mb-4">
          <IconChartBar className="w-5 h-5 text-[#C9F31D]" />
          <span className="text-sm font-semibold text-white">{poolData.lendingMarketName} Pool Metrics</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#808195]">Health Factor</span>
              <span className={`text-sm font-medium ${getHealthColor(poolData.healthFactor)}`}>
                {poolData.healthFactor.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#808195]">Total Deposited</span>
              <span className="text-sm font-medium text-white">
                ${poolData.depositValueUSD.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#808195]">Total Borrowed</span>
              <span className="text-sm font-medium text-white">
                ${poolData.borrowValueUSD.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Deposits */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <IconActivity className="w-4 h-4 text-[#C9F31D]" />
              <span className="text-sm text-[#808195]">Top Deposits</span>
            </div>
            {poolData.deposits.slice(0, 2).map((deposit: TokenData) => (
              <div key={deposit.mint} className="flex items-center gap-2">
                <img
                  src={deposit.logo}
                  alt={deposit.symbol}
                  className="w-5 h-5 rounded-full"
                />
                <span className="text-xs text-[#808195]">{deposit.symbol}</span>
                <span className="text-xs text-white ml-auto">
                  ${deposit.valueUSD.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      {aiResponse && (aiResponse.warnings.length > 0 || aiResponse.suggestions.length > 0) && (
        <div className="grid grid-cols-2 gap-4">
          {aiResponse.warnings.length > 0 && (
            <div className="p-3 bg-red-800/15 rounded-xl border border-[#333333]">
              <div className="flex items-center gap-2 mb-2">
                <IconAlertTriangle className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium text-white">Warnings</span>
              </div>
              <ul className="list-disc pl-4 space-y-1">
                {aiResponse.warnings.map((warning, i) => (
                  <li key={i} className="text-xs text-[#808195]">{warning}</li>
                ))}
              </ul>
            </div>
          )}
          
          {aiResponse.suggestions.length > 0 && (
            <div className="p-3 bg-blue-800/15 rounded-xl border border-[#333333]">
              <div className="flex items-center gap-2 mb-2">
                <IconChartBar className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-white">Suggestions</span>
              </div>
              <ul className="list-disc pl-4 space-y-1">
                {aiResponse.suggestions.map((suggestion, i) => (
                  <li key={i} className="text-xs text-[#808195]">{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-[90rem]">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Positions Overview */}
        <div className="lg:col-span-1 space-y-6">
          {/* Wallet Overview */}
          <div className="card bg-[#1a2128] shadow-2xl border border-[#333333] overflow-hidden">
            <div className="p-6 border-b border-[#333333]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C9F31D]/10 flex items-center justify-center">
                  <IconWallet className="w-6 h-6 text-[#C9F31D]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Your Positions</h2>
                  <p className="text-sm text-[#808195]">
                    {isLoadingPools ? (
                      "Loading positions..."
                    ) : poolsResponse?.pools?.length ? (
                      `${poolsResponse.pools.length} Active Lending Markets`
                    ) : (
                      "No active positions"
                    )}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              {isLoadingPools ? (
                <div className="flex justify-center items-center py-8">
                  <LoadingSpinner />
                </div>
              ) : poolsResponse?.pools?.map((pool: PoolData) => (
                <div 
                  key={pool.obligationID}
                  className="bg-[#1A2026]/40 p-4 rounded-xl border border-[#333333] mb-4 hover:border-[#C9F31D]/30 transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-white font-medium">{pool.lendingMarketName}</h3>
                    <div className="flex items-center gap-2">
                      <IconShield className="w-4 h-4 text-[#808195]" />
                      <span className={`text-sm ${getHealthColor(pool.healthFactor)}`}>
                        {pool.healthFactor.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Deposits */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <IconActivity className="w-4 h-4 text-[#C9F31D]" />
                      <span className="text-sm text-[#C9F31D]">
                        Deposits (${pool.depositValueUSD.toFixed(2)})
                      </span>
                    </div>
                    {pool.deposits.map((deposit: TokenData) => (
                      <div key={deposit.mint} className="flex items-center gap-2 pl-6">
                        <img
                          src={deposit.logo}
                          alt={deposit.symbol}
                          className="w-4 h-4 rounded-full"
                        />
                        <span className="text-xs text-[#808195]">{deposit.symbol}</span>
                        <span className="text-xs text-white ml-auto">
                          ${deposit.valueUSD.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Borrows */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <IconActivity className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-red-500">
                        Borrows (${pool.borrowValueUSD.toFixed(2)})
                      </span>
                    </div>
                    {pool.borrows.map((borrow: TokenData) => (
                      <div key={borrow.mint} className="flex items-center gap-2 pl-6">
                        <img
                          src={borrow.logo}
                          alt={borrow.symbol}
                          className="w-4 h-4 rounded-full"
                        />
                        <span className="text-xs text-[#808195]">{borrow.symbol}</span>
                        <span className="text-xs text-white ml-auto">
                          ${borrow.valueUSD.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {!isLoadingPools && !poolsResponse?.pools?.length && (
                <div className="text-center py-8">
                  <p className="text-[#808195]">No active lending positions found</p>
                  <p className="text-xs text-[#808195] mt-2">Connect your wallet to view positions</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card bg-[#1a2128] shadow-2xl border border-[#333333] p-6">
            <h3 className="text-white font-medium mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setInput("What's my current risk level?")}
                className="p-4 bg-[#1A2026]/40 rounded-xl border border-[#333333] hover:border-[#C9F31D]/30 transition-all group"
                disabled={!poolsResponse?.pools?.length}
              >
                <div className="flex items-center justify-between mb-2">
                  <IconShield className="w-5 h-5 text-[#C9F31D]" />
                  <IconArrowUpRight className="w-4 h-4 text-[#808195] group-hover:text-[#C9F31D] transition-colors" />
                </div>
                <h4 className="text-sm text-white font-medium">Check Risk Level</h4>
                <p className="text-xs text-[#808195] mt-1">Analyze your position safety</p>
              </button>

              <button 
                onClick={() => setInput("Show me my deposits and their values")}
                className="p-4 bg-[#1A2026]/40 rounded-xl border border-[#333333] hover:border-[#C9F31D]/30 transition-all group"
                disabled={!poolsResponse?.pools?.length}
              >
                <div className="flex items-center justify-between mb-2">
                  <IconActivity className="w-5 h-5 text-[#C9F31D]" />
                  <IconArrowUpRight className="w-4 h-4 text-[#808195] group-hover:text-[#C9F31D] transition-colors" />
                </div>
                <h4 className="text-sm text-white font-medium">View Deposits</h4>
                <p className="text-xs text-[#808195] mt-1">Check your deposited assets</p>
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Chat Interface */}
        <div className="lg:col-span-2">
          <div className="card bg-[#1a2128] shadow-2xl backdrop-blur-xl border border-[#C9F31D]/10">
            <div className="card-body p-0">
              {/* Chat Header */}
              <div className="p-6 border-b border-[#C9F31D]/10 flex items-center gap-3 bg-[#1a2128]">
                <div className="w-10 h-10 rounded-xl bg-[#C9F31D]/10 flex items-center justify-center">
                  <IconBrain className="w-6 h-6 text-[#C9F31D]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">MCP Risk Analysis Assistant</h2>
                  <p className="text-sm text-gray-400">Powered by SafeFlows AI</p>
                </div>
              </div>

              {/* Messages */}
              <div className="p-6 space-y-6 min-h-[500px] max-h-[700px] overflow-y-auto bg-[#141a20]">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-end gap-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        {message.role === 'assistant' && (
                          <div className="w-8 h-8 rounded-lg bg-[#C9F31D]/10 flex items-center justify-center flex-shrink-0">
                            <IconRobot className="w-5 h-5 text-[#C9F31D]" />
                          </div>
                        )}
                        <div className="space-y-4">
                          <div
                            className={`px-4 py-3 rounded-2xl ${
                              message.role === 'user' 
                                ? 'bg-[#C9F31D] text-black' 
                                : 'bg-[#1E2A35] border border-[#C9F31D]/10 text-white'
                            }`}
                          >
                            {message.content}
                          </div>
                          {message.role === 'assistant' && message.poolData && (
                            <MetricsDisplay poolData={message.poolData} aiResponse={message.aiResponse} />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-end gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#C9F31D]/10 flex items-center justify-center">
                        <IconRobot className="w-5 h-5 text-[#C9F31D]" />
                      </div>
                      <div className="px-4 py-3 rounded-2xl bg-[#1E2A35] border border-[#C9F31D]/10">
                        <LoadingSpinner />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-6 border-t border-[#C9F31D]/10 bg-[#1a2128]">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Ask about your position risks, metrics, or recommendations..."
                    className="flex-1 px-4 py-3 bg-[#141a20] border border-[#C9F31D]/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#C9F31D]/30 transition-colors"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={isLoading}
                  />
                  <button
                    className="px-6 py-3 bg-[#C9F31D] hover:bg-[#d4f542] text-black font-bold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    onClick={handleSendMessage}
                    disabled={isLoading || !input.trim()}
                  >
                    <IconSend className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 