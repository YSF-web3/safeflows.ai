"use client"

import { useGetPools } from "@/components/dashboard/dashboard-data-access"
import NotificationFeature from "@/components/notifications/notification-feature"
import LendingDashboard from "@/components/pools/pool-dashboard"
import { useWallet } from "@solana/wallet-adapter-react"

export default function Page() {
    const { publicKey } = useWallet()
    const query = useGetPools({ address: publicKey || undefined })
    if(!query.data) {
        return <>
        "Loading..."
        
        </>
    }
    return (
        <LendingDashboard data={query?.data} />
    )
}