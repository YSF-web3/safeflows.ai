"use client"

import { useGetPools } from "@/components/dashboard/dashboard-data-access"
import NotificationFeature from "@/components/notifications/notification-feature"
import LendingDashboard from "@/components/pools/pool-dashboard"
import LoadingScreen from "@/components/ui/loader"
import { useWallet } from "@solana/wallet-adapter-react"

import { useDashboard } from "@/components/dashboard/dashboard-data-access"
import { useEffect } from "react"

export default function Page() {
    const { publicKey } = useWallet()
    const query = useGetPools({ address: publicKey || undefined })
    const { addLoading } = useDashboard()

    useEffect(() => {
        addLoading(query.isLoading)
    }, [ query.isLoading ])

    return (
        <div className="min-h-[75vh]">
            <LendingDashboard data={query?.data} />
        </div>
        
    )
}