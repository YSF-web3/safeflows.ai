import { useEffect, useState } from "react"
import { Pools, Predictions, PricePredictions } from "./dashboard-data-access"

const defaultItems = [
    {
        key: "collateral_value", 
        label: "Total Collateral Value", 
        value: "$ 0.00 USD"
    }, 
    {
        key: "borrowed_value",
        label: "Total Borrowed Value",
        value: "$ 0.00 USD"
    }, 
    {
        key: "hf",
        label: "Current Health Factor (HF)",
        value: "1"
    }, 
    {
        key: "average_lending_pool_risk_score", 
        label: "Average Lending Pool Risk Score",
        value: "1.00"
    }
];

export default function Cards({ poolsData, predictionsData }: { poolsData: Pools, predictionsData: Predictions }) {

    const [ items, setItems ] = useState(defaultItems)

    
    useEffect(() => {

        if( poolsData && predictionsData ) {
            const totalDepositValue = poolsData?.pools.reduce((total, obligation) => {
                const depositSum = obligation.depositValueUSD;
                return total + depositSum;
            }, 0);
    
            const totalBorrowedValue = poolsData?.pools.reduce((total, obligation) => {
                const borrowedSum = obligation.borrowValueUSD
                return total + borrowedSum;
            }, 0);
    
            const totalHF = poolsData?.pools.reduce((total, obligation) => {
                const sum = obligation.healthFactor;
                return total + sum;
            }, 0);
            
            const predictions: PricePredictions = { ...predictionsData?.predictions };

            const data = poolsData?.pools?.flatMap((pool: any) =>
                pool.deposits.map((deposit: any) => predictions[deposit.mint].predictedPriceUsd / deposit.pricePerTokenInUSD)
            );

            const average_LPRC = data.reduce((acc, val) => acc + val, 0) / data.length;
    
    
            setItems((prevItems) => {
                const updatedItems = [...prevItems];
                updatedItems[0].value = `$${(totalDepositValue || 0).toFixed(2)} USD`;
                updatedItems[1].value = `$${(totalBorrowedValue || 0).toFixed(2)} USD`;
                updatedItems[2].value = (totalHF || 1).toFixed(2);
                updatedItems[3].value = (average_LPRC || 1).toFixed(2);
                return updatedItems;
            });
        } else {
            setItems(defaultItems)
        }

    }, [ poolsData, predictionsData ])

    return (
        <div className="w-full flex gap-2 overflow-x-auto">
            {
                items.map((item, index) => (
                    <div key={item.key} className="rounded-xl bg-[#12181F] h-[49px] px-5 flex items-center gap-1">
                        <div className="text-[#C2C2C2] text-sm font-normal text-nowrap">{item.label} : </div>
                        <div className={`font-bold text-nowrap ${ ( index === 3 && Number(item.value) < 1 ) ? "animate-pulse-custom text-red-600 text-base": `${index === 3 ? "text-green-500": "text-white"} text-sm` }`}>
                            {
                                index === 3 ? 
                                Number(item.value)
                                :
                                item.value
                            }
                        </div>
                    </div>
                ))
            }
        </div>
    )
}