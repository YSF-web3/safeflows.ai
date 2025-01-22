
export default function PoolsHeatmap({ onItemClicked }: { onItemClicked: (item: any) => void }) {

    const xLabels = new Array(7).fill(0).map((_, i) => `${i}`)
    const yLabels = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon']
    const data = new Array(yLabels.length)
      .fill(0)
      .map(() =>
        new Array(xLabels.length).fill(0).map(() => Math.floor(Math.random() * 50 + 50))
    )

    const getColor = (ratio : number) => {
        if (ratio <= 0.5) {
            // Interpolate between red (1, 0, 0) and yellow (1, 1, 0)
            const green = Math.round(255 * (ratio / 0.5)); // Green increas               es
            return `rgb(255, ${green}, 0)`;
        } else {
            // Interpolate between yellow (1, 1, 0) and green (0, 1, 0)
            const red = Math.round(255 * (1 - (ratio - 0.5) / 0.5)); // Red decreases
            return `rgb(${red}, 255, 0)`;
        }
    }

    return (
        <div className="w-full h-full flex flex-col gap-3 border p-[18px] rounded-[13px] border-[#333333]">
            <div className="flex justify-between items-center w-full">
                <div className="text-base font-semibold text-white pl-8">Real Time Risk Scoring (RTRS)</div>
                <div className="flex gap-2">
                    <button className="h-7 border border-[#8081954D] px-2 rounded-md text-[10px] font-normal leading-4 text-[#C2C2C2]">Weekly</button>
                    <button className="h-7 border border-[#8081954D] px-2 rounded-md text-[10px] font-normal leading-4 text-black bg-[#C9F31D]">Daily</button>
                </div>
            </div>
            <div className="grid grid-cols-9 gap-4">
                {
                    new Array(54).fill(0).map((_, i) => 
                        i % 9  === 0 ? 
                        <div className="text-[#A4A8AB] text-[10px] leading-4 font-normal h-full flex items-center pl-4" key={i}>$840</div>
                        :
                        <div className="size-[38px] border border-[#333333] rounded-[6px] text-[#0B0E129E] cursor-pointer" key={i} onClick={() => onItemClicked(i)}></div>
                    )
                }
                {
                    yLabels.map((label, i) => (
                        <div className="text-[#A4A8AB] text-xs leading-5 font-semibold h-full flex items-center w-full pl-2" key={i}>{label}</div>
                    ))
                }
            </div>
        </div>
    )
}