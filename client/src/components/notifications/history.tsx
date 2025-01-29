
"use client"

export default function History({notifications}:any) {
    const historyRender = notifications.map((_:any, i:number) => 
    <div className="w-full lg:h-[80px] border-none rounded-xl bg-[#151B21] flex flex-row justify-between items-center px-[21px] pb-3 pt-[14px]" key={i}>
        <div className="flex flex-col gap-2 flex-grow h-full">
            <div className="text-[#C2C2C2] text-sm font-normal text-left"></div>
            {
                i < 2 && 
                <div className="h-[23px] rounded-[3px] bg-[#C9F31D] text-black px-[21px] text-xs font-semibold flex items-center w-fit">View More</div>
            }
  ch      </div>
        <div className="flex flex-col gap-[14px] h-full">
            <div className="rounded-[13px] border border-[#333333] bg-[#0B0E129E] text-white text-xs font-semibold h-[23px] px-[21px] flex items-center">Chat</div>
            <div className="text-[#C9F31D] text-xs font-semibold">Mon 20 Jan</div>
        </div>
    </div>
)
    return (
        <div className="w-full h-[470px] rounded-[13px] border-[#333333] border flex flex-col gap-4 py-5 pl-5 pr-2">
            <div className="text-white text-[22px] font-normal leading-8 w-full text-left">History</div>
            <div className="overflow-y-auto pr-3 space-y-2">
                {
                 historyRender.length ? historyRender : <div className="text-gray-400 p-12"> No alerts yet   </div>
                }
            </div>
        </div>
    )
}