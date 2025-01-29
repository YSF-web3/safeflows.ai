'use client'

import { clusterApiUrl, Connection } from '@solana/web3.js'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { createContext, ReactNode, useContext } from 'react'
import toast from 'react-hot-toast'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'

import api from '@/app/api/api'

import {
    PublicKey
} from "@solana/web3.js"


export interface Notification {
    notification: string
    level: string
    timestamp: string
}

export interface Pools {
    pools: any[], 
    message: {
        _id: string, 
        address: string, 
        analysis: string, 
        warnings: string[], 
        suggestions: string[], 
        createdAt: string
    }, 
    timestamp: string
}

export interface Prices {
    prices: any[],
    timestamp: string
}

export type PredictedTrendItem = {
    price: number;
    timestamp: Date;
  };
  
export type PricePrediction = {
    predictedPriceUsd: number;
    predictedTrend: PredictedTrendItem[];
    lastCalculated: Date;
  };
  
export type PricePredictions = {
    [key: string]: PricePrediction;
  };

export interface Predictions {
    predictions: PricePredictions, 
    timestamp: string
}


export const defaultNotifications: Notification[] = [
    
    {
        notification: "🔔 Reminder: Solend Protocol has updated its liquidation threshold for SOL collateral from 80% to 85%. Please adjust your positions.",
        level: "Important",
        timestamp: "2025-01-28T10:30:00.000Z"
    },
    {
        notification: "⚡ Solend: Borrowing rates for USDC have increased to 6.2% due to high utilization. Consider repaying or rebalancing.",
        level: "Important",
        timestamp: "2025-01-27T15:00:00.000Z"
    },
    {
        notification: "🚨 Solend Alert: Wallet Abc789 has been liquidated. $15,000 worth of SOL collateral was sold to cover a USDC debt of $12,000.",
        level: "Critical",
        timestamp: "2025-01-27T14:45:00.000Z"
    },
    {
        notification: "ℹ️ Solend Market Update: SOL collateral ratio is stabilizing after the recent price recovery. Risk levels have decreased.",
        level: "Info",
        timestamp: "2025-01-27T13:00:00.000Z"
    },
    {
        notification: "🔔 Solend Governance Proposal #23 passed: Maximum borrow limits for stablecoins reduced by 10% to mitigate risk.",
        level: "Important",
        timestamp: "2025-01-26T18:00:00.000Z"
    },
    {
        notification: "⚠️ Solend Alert: High liquidation activity detected on SOL markets. Ensure your positions are above the required threshold.",
        level: "Critical",
        timestamp: "2025-01-26T12:00:00.000Z"
    }
    
]

const dashboardAtom = atomWithStorage<Notification[]>('dashboard-notifications', defaultNotifications)


export interface DashboardProviderContext {
    notifications: Notification[]
}

const Context = createContext<DashboardProviderContext>({} as DashboardProviderContext)

export function DashboardProvider({ children }: { children: ReactNode }) {

    const notifications = useAtomValue(dashboardAtom)

    const value: DashboardProviderContext = {
        notifications: notifications
    }


    return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useDashboard() {
    return useContext(Context)
}


export function useGetPools({ address }: { address: PublicKey | undefined }) {
    return useQuery({
        queryKey: ['get-pools', address?.toBase58() || 'no-address'],
        queryFn: async () => {
            if (!address) {
                throw new Error("No address provided");
            }

            const response = await api.get(`/pools?wallet=${ process.env.NEXT_PUBLIC_WALLET_ENV === "dev" && address.toBase58() ? "HsUwYB9RswS2tzmwrakEhDTGfvxRYLnNGrWoPZ5nTtyC" : address.toBase58() }`);
            return response.data;
        },
        enabled: !!address,
    });
}

export function useGetPrices({ symbols }: { symbols: string[] }) {
    return useQuery({
        queryKey: ['get-prices', symbols],
        queryFn: async () => {
            if (symbols.length === 0) {
                throw new Error("No symbols provided");
            }

            const response = await api.get(`/prices?symbols=${symbols.join(',')}`);
            return response.data;
        },
    });
}

export function useGetPredictions({ mints }: { mints: string[] }) {

    

    return useQuery({
        queryKey: ['get-predictions', mints],
        queryFn: async () => {
            if (mints.length === 0) {
                throw new Error("No mints provided");
            }
            
            const response = await api.get(`/predictions?mints=${mints.join(',')}`);
            return response.data;
        },
    });
}