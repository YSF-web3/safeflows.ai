"use client"

import SettingPage from "./setting"
import History from "./history"
import ActiveAlerts from "./alerts"
import { useGetNotifications } from "./alert-data-access"
import { useWallet } from "@solana/wallet-adapter-react"

export default function NotificationFeature () {
    const { connected, publicKey } = useWallet();
    const query = useGetNotifications({address:publicKey!})

    return (
        <div className="w-full h-full flex flex-col items-center pt-12 gap-6 lg:gap-20">
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                <SettingPage />
                <ActiveAlerts notifications={query?.data?.notifiactions}/>
            </div>
            <History notifications={[]}/>
        </div>
    )
}