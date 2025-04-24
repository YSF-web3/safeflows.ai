import { useEffect, useState } from "react"
import { motion } from "framer-motion"
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

const StatCard = ({ item, index }:any) => {
    const getValueColor = (index: number, value: string) => {
        if (index === 2) { // Health Factor
            const numValue = Number(value);
            if (numValue >= 1.5) return "text-[#3BD32D]"; // Good
            if (numValue >= 1.2) return "text-[#FDAA35]"; // Ordinary
            return "text-[#B52C24]"; // Critical
        } else if (index === 3) { // Risk Score
            const numValue = Number(value);
            if (numValue > 1) return "text-[#3BD32D]"; // Good
            return "text-[#B52C24]"; // Critical
        }
        return "text-white"; // Default
    };

    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className="glass-container rounded-xl border border-white/10 px-4 py-3 flex flex-col min-w-[180px]"
      >
        <div className="text-text-secondary text-xs mb-1">
          {item.label}
        </div>
        <div className={`text-lg font-semibold ${getValueColor(index, item.value)}`}>
          {item.value}
        </div>
      </motion.div>
    );
};

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
                pool.deposits.map((deposit: any) => predictions[deposit.mint]?.predictedPriceUsd / deposit.pricePerTokenInUSD)
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

            setItems((prevItems) => {
                const updatedItems = [...prevItems];
                updatedItems[0].value = `$0.00 USD`;
                updatedItems[1].value = `$0.00 USD`;
                updatedItems[2].value = `1.00`;
                updatedItems[3].value = `1.00`;
                return updatedItems;
            });
        }

    }, [ poolsData, predictionsData ])

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full glass-container rounded-2xl border border-white/10 p-6"
        >
            <div className="text-white text-xl font-medium mb-4">Dashboard Overview</div>
            <div className="w-full flex gap-4 overflow-x-auto overflow-y-hidden pb-2">
                {
                    items.map((item, index) => (
                        <StatCard item={item} key={index} index={index} />
                    ))
                }
            </div>
        </motion.div>
    )
}