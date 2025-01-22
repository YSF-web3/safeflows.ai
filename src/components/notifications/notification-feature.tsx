
import SettingPage from "./setting"
import History from "./history"
import ActiveAlerts from "./alerts"

export default function NotificationFeature () {
    return (
        <div className="w-full h-full flex flex-col items-center pt-12 gap-20">
            <SettingPage />
            <div className="w-full grid grid-cols-2 gap-6">
                <History />
                <ActiveAlerts />
            </div>
        </div>
    )
}