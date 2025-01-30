"use client"

import { useGetPools } from "@/components/dashboard/dashboard-data-access"
import NotificationFeature from "@/components/notifications/notification-feature"
import LendingDashboard from "@/components/pools/pool-dashboard"
import LoadingScreen from "@/components/ui/loader"
import { useWallet } from "@solana/wallet-adapter-react"

export default function Page() {
    const { publicKey } = useWallet()
    const query = useGetPools({ address: publicKey || undefined })
  
    if(query.isLoading){
        return <div className="h-80 min-h-[75vh]">
            <LoadingScreen />
        </div>
    }

    return (
        <div className="min-h-[75vh]">
            
            <LendingDashboard data={query?.data} />
        </div>
        
    )
}