
const items = [
    {
        key: "collateral_value", 
        label: "Total Collateral Value", 
        value: "$ 1 234 567.89 USD"
    }, 
    {
        key: "borrowed_value",
        label: "Total Borrowed Value",
        value: "$ 234 567.89 USD"
    }, 
    {
        key: "hf",
        label: "Current Health Factor (HF)",
        value: "1.8"
    }, 
    {
        key: "average_lending_pool_risk_score", 
        label: "Average Lending Pool Risk Score",
        value: "71"
    }
]

export default function Cards() {
    return (
        <div className="w-full flex gap-2">
            {
                items.map((item) => (
                    <div key={item.key} className="rounded-xl bg-[#12181F] h-[49px] px-5 flex items-center">
                        <div className="text-[#C2C2C2] text-sm font-normal">{item.label}</div>
                        {/* <div className="text-white text-2xl font-bold">{item.value}</div> */}
                    </div>
                ))
            }
        </div>
    )
}