import { useEffect, useState } from "react"
import { Pools } from "./dashboard-data-access"

export default function Cards({ poolsData }: { poolsData: Pools }) {

    const [ items, setItems ] = useState([
        {
            key: "collateral_value", 
            label: "Total Collateral Value", 
            value: "$ 1 234 567.89 USD"
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
            value: "100"
        }
    ])

    
    useEffect(() => {

        const totalDepositValue = poolsData?.pools.reduce((total, obligation) => {
            const depositSum = obligation.deposits.reduce((sum: number, deposit: any) => {
                return sum + deposit.pricePerTokenInUSD * deposit.depositedAmount;
            }, 0);
            return total + depositSum;
        }, 0);

        const totalBorrowedValue = poolsData?.pools.reduce((total, obligation) => {
            const borrowedSum = obligation.borrows.reduce((sum: number, borrow: any) => {
                return sum + borrow.pricePerTokenInUSD * borrow.borrowedAmount;
            }, 0);
            return total + borrowedSum;
        }, 0);

        setItems((prevItems) => {
            const updatedItems = [...prevItems];
            updatedItems[0].value = `$${(totalDepositValue || 0).toFixed(2)} USD`;
            updatedItems[1].value = `$${(totalBorrowedValue || 0).toFixed(2)} USD`;
            return updatedItems;
        });

    }, [ poolsData ])

    return (
        <div className="w-full flex gap-2 overflow-x-auto">
            {
                items.map((item) => (
                    <div key={item.key} className="rounded-xl bg-[#12181F] h-[49px] px-5 flex items-center gap-1">
                        <div className="text-[#C2C2C2] text-sm font-normal text-nowrap">{item.label} : </div>
                        <div className="text-white text-sm font-bold">{item.value}</div>
                    </div>
                ))
            }
        </div>
    )
}