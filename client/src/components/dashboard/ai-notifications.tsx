import Image from "next/image";

import { useDashboard } from "./dashboard-data-access"
import AlarmIcon from "@/assets/svg/alarm.svg";
import { Pools } from "./dashboard-data-access"


export default function AiNotifications ({ poolsData }: { poolsData: Pools }) {

    const { notifications } = useDashboard()


    return (
        <div className="w-full h-full border rounded-[13px] p-6  bg-opacity-65 border-[#333333]">
            <div 
                className="min-h-[360px] h-[360px] w-full space-y-3 overflow-y-scroll pr-2"
            >
                {
                    ( (!poolsData?.message?.warnings || poolsData?.message?.warnings.length === 0) 
                    && (!poolsData?.message?.suggestions || poolsData?.message?.suggestions.length === 0) )
                    && <div className="lg:h-[50px] w-full bg-[#151B21] rounded-xl flex items-center pl-[18px] pr-2 py-2 justify-center text-white">No message</div>
                }
                {
                    poolsData?.message?.warnings?.map((noti, index) => (
                        <div key={index} className="lg:h-[50px] w-full border border-[#151B21] bg-[black] rounded-xl flex items-center pl-[18px] pr-2 py-2">
                            <div className="flex gap-[14px] h-full">
                                <Image src={ AlarmIcon } alt="Notification" width={18} height={22} />
                                <div className="flex flex-col gap-[6px] justify-center min-w-[71px]">
                                        <div className={`text-sm leading-5 font-normal text-[#FDAA35]  text-left`}>Warning</div>
                                    <div className="text-white font-light text-[10px] leading-3  text-left">
                                        {
                                            new Date(poolsData.message.createdAt).toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' })
                                        }
                                    </div>
                                </div>
                                <div className="border-r border-[#E0E4F5] flex"></div>
                                <div className="text-[#C2C2C2] text-sm font-normal flex items-center  text-left">{ noti }</div>
                            </div>
                        </div>
                    ))
                }
                {
                    poolsData?.message?.suggestions?.map((noti, index) => (
                        <div key={index} className="lg:h-[50px] w-full border border-[#151B21] bg-[black] rounded-xl flex items-center pl-[18px] pr-2 py-2">
                            <div className="flex gap-[14px] h-full">
                                <Image src={ AlarmIcon } alt="Notification" width={18} height={22} />
                                <div className="flex flex-col gap-[6px] justify-center min-w-[71px]">
                                        <div className={`text-sm leading-5 font-normal text-[#3BD32D] w-16`}>Suggestion</div>
                                    <div className="text-white font-light text-[10px] leading-3 text-left">
                                        {
                                            new Date(poolsData.message.createdAt).toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' })
                                        }
                                    </div>
                                </div>
                                <div className="border-r border-[#E0E4F5] flex"></div>
                                <div className="text-[#C2C2C2] text-sm font-normal flex items-center text-left">{ noti }</div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}