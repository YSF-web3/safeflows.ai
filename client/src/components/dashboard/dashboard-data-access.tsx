'use client'

import { clusterApiUrl, Connection } from '@solana/web3.js'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { createContext, ReactNode, useContext } from 'react'
import toast from 'react-hot-toast'

export interface Notification {
    notification: string
    level: string
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