"use client"
import { Bell, AlertCircle, Trash, StopCircle } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useGetNotifications } from "./alert-data-access";
const getThresholdColor = (value: number) => {
  if (value >= 75) return "text-green-400";
  if (value >= 50) return "text-orange-400";
  return "text-red-400";
};
export default function ActiveAlerts({notifications}:any) {
  return (
    <div className="w-full max-h-[700px]  rounded-[13px] border-[#333333] border flex flex-col gap-4 py-5 pl-5 pr-2">
      <div className="flex items-center gap-3 px-3">
        <Bell className="text-[#C9F31D] w-6 h-6" />
        <div className="text-white text-[22px] font-normal leading-8 w-full text-left">
          Active Alerts
        </div>
      </div>
      
      <div className="overflow-y-auto pr-3 space-y-2">
      {notifications?.map((notification:any) => (
        <div
          className="w-full lg:h-[80px] rounded-xl bg-[black] border border-[#151B21] flex flex-row justify-between items-center px-[21px] pb-3 pt-[14px] hover:bg-[#1a2128] transition-colors duration-200"
          key={notification._id}
        >
          <div className="flex gap-3">
            <AlertCircle className="text-[#C2C2C2] w-5 h-5 mt-1" />
            <div className="flex flex-col gap-2 flex-grow h-full">
            <div className="text-[#C2C2C2] text-sm font-normal text-left">
                Notification Setting: {notification.description} - 
                <span className="ml-1">
                  Collateral Threshold:{' '}
                  <span className={`font-bold ${getThresholdColor(notification.collateralThreshold)}`}>
                    {notification.collateralThreshold}%
                  </span>
                </span>
                <span className="ml-1">
                  Health Threshold:{' '}
                  <span className={`font-bold ${getThresholdColor(notification.healthThreshold)}`}>
                    {notification.healthThreshold}%
                  </span>
                </span>
              </div>
              <div className="text-[#C2C2C2] text-xs flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-[#C9F31D]"></span>
                {notification.email}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-[14px] h-full">
            <div className="rounded-[13px] border border-[#333333] bg-[#0B0E129E] text-white text-xs font-semibold  px-[21px] flex items-center hover:bg-[#0f131799] transition-colors duration-200">
              {notification.notifications.length} alerts
            </div>
            <div className="text-[#C9F31D] text-xs font-semibold">
              {new Date(notification.createdAt).toLocaleDateString('en-US', {
                weekday: 'short',
                day: '2-digit',
                month: 'short'
              })}
            </div>
          </div>
          <div className="flex flex-col p-2 gap-2 h-full">
           <button className="active:scale-95">
            <Trash size={20} color="#C2C2C2"/>
           </button>
           <button className="active:scale-95">
            <StopCircle size={20} color="#C2C2C2" />
           </button>
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}