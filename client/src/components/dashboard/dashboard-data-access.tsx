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
    timestamp: string
}

export interface Prices {
    prices: any[],
    timestamp: string
}


export const defaultNotifications: Notification[] = [
    {
        notification: "This is test notification 1", 
        level: "Important",
        timestamp: "2021-01-01T00:00:00.000Z"
    }, 
    {
        notification: "This is test notification 2", 
        level: "Important",
        timestamp: "2021-01-01T00:00:00.000Z"
    }, 
    {
        notification: "This is test notification 3", 
        level: "Critical",
        timestamp: "2021-01-01T00:00:00.000Z"
    }, 
    {
        notification: "AI Notification 01 Lorem ipsum dolor sit amet consectetur.", 
        level: "Critical",
        timestamp: "2021-01-01T00:00:00.000Z"
    }, 
    {
        notification: "This is test notification 5", 
        level: "Important",
        timestamp: "2021-01-01T00:00:00.000Z"
    }, 
    {
        notification: "This is test notification 6", 
        level: "Important",
        timestamp: "2021-01-01T00:00:00.000Z"
    }, 
    {
        notification: "This is test notification 7", 
        level: "Important",
        timestamp: "2021-01-01T00:00:00.000Z"
    }, 
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

            const response = await api.get(`/pools?wallet=${ address.toBase58() ? "HsUwYB9RswS2tzmwrakEhDTGfvxRYLnNGrWoPZ5nTtyC" : address.toBase58() }`);
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