import { useState } from "react"

import { Notification } from "./dashboard-data-access"
import { useDashboard } from "./dashboard-data-access"

export default function AiNotifications () {

    const { notifications } = useDashboard()

    return (
        <div className="w-full h-full flex flex-col gap-4 border rounded-md p-4 min-h-[calc(100vh_/_3_*_2)]">
            {
                notifications.map((notification, index) => (
                    <div key={index} className="border rounded-md px-4 py-2">
                        <h3>{notification.level}</h3>
                        <p>{notification.notification}</p>
                    </div>
                ))
            }
        </div>
    )
}