import { useState } from "react"
import Image from "next/image";

import { Notification } from "./dashboard-data-access"
import { useDashboard } from "./dashboard-data-access"

import AlarmIcon from "@/assets/svg/alarm.svg";

export default function AiNotifications () {

    const { notifications } = useDashboard()

    return (
        <div className="w-full h-full border rounded-[13px] p-6 bg-[#0B0E12] bg-opacity-65 border-[#333333]">
            <div 
                className="min-h-[360px] h-[360px] w-full space-y-3 overflow-y-scroll pr-2 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent custom-scrollbar "
            >
                {
                    notifications.map((notification, index) => (
                        <div key={index} className="h-[50px] w-full bg-[#151B21] rounded-xl flex items-center pl-[18px] pr-2">
                            <div className="flex gap-[14px]">
                                <Image src={ AlarmIcon } alt="Notification" width={18} height={22} />
                                <div className="flex flex-col gap-[6px] justify-center w-[71px]">
                                    <div className={`text-sm leading-5 font-normal ${notification.level === "Critical" ? "text-[#E73F28]": "text-[#2C9B2E]"}`}>{ notification.level }</div>
                                    <div className="text-white font-light text-[8px] leading-3">Mon 20 Jan</div>
                                </div>
                                <span className="h-8 border-r border-[#E0E4F5]"></span>
                                <div className="text-[#C2C2C2] text-sm font-normal flex items-center">{ notification.notification }</div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}