import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import {
  Pools,
  PredictedTrendItem,
  Predictions,
} from "./dashboard-data-access";
import { HealthFactorChart } from "./health-factor-chart";

interface Option {
  label: string;
  mint: string;
}

const calculatePredictedHF = (selectedPool: any, predictions: any) => {
  try {
    const { deposits, borrows } = selectedPool;
    const predctionPerMint: {
      [key: string]: any;
    } = {};

    for (const mint of Object.keys(predictions)) {
      predctionPerMint[mint] = predictions[mint].predictedTrend;
    }

    const lengths = Object.keys(predictions).map((x) => {
      return predctionPerMint[x].length;
    });

    const min = Math.min(...lengths);
    console.log("min",min);
    
    let liquidationsPerHour: number[] = [];
    let borrowWeightPerHour: number[] = [];

    deposits.forEach((d: any, i: number) => {
    console.log("d,i",d,i);
      predctionPerMint[d.mint].forEach((k, j) => {
        if (j > min - 1) return;
        console.log("xxxx" ,d.liquidationThreshold,
            d.depositedAmount ,
            predctionPerMint[d.mint][j].price);
        
        
        if (i > 0) {
          liquidationsPerHour[j] +=
            (d.liquidationThreshold /100)*
            d.depositedAmount *
            predctionPerMint[d.mint][j].price;
        } else {
          liquidationsPerHour.push(
            (d.liquidationThreshold /100)*
              d.depositedAmount *
              predctionPerMint[d.mint][j].price
          );
        }
      });
    });

    borrows.forEach((d: any, i: number) => {
      predctionPerMint[d.mint].forEach((k, j) => {
        if (j > min - 1) return;
        if (i > 0) {
          borrowWeightPerHour[j] +=
            d.borrowWeight / 100 *
            d.borrowedAmount *
            predctionPerMint[d.mint][j].price;
        } else {
          borrowWeightPerHour.push(
            d.borrowWeight  *
              d.borrowedAmount *
              predctionPerMint[d.mint][j].price
          );
        }
      });
    });
    return liquidationsPerHour.map((x, i) => {
      return x / borrowWeightPerHour[i];
    });

    
  } catch (error) {
    console.log(error);
  }
};

export default function AiPredictedTrends({
  poolsData,
  predictionsData,
}: {
  poolsData: Pools;
  predictionsData: Predictions;
}) {
  const svgRef = useRef(null);
  const [selectedPool, setSelectedPool] = useState<any>();
  const [calculatedHealthFactor, setCalculatedHealthFactor] = useState<any>();
  const [options, setOptions] = useState<string[]>([]);

  const handleMintChange = (e) => {
    console.log(e.target.value);

    setSelectedPool(
      poolsData.pools.find((x) => {
        return x.lendingMarketName == e.target.value;
      })
    );
    console.log(
      poolsData.pools.find((x) => {
        return x.lendingMarketName == e.target.value;
      })
    );
  };

  useEffect(() => {
    if (!poolsData || !predictionsData || !poolsData.pools) return;

    console.log("PASSED", poolsData.pools, predictionsData);
    setOptions(
      poolsData.pools.map((x) => {
        return x.lendingMarketName;
      })
    );
    if(!selectedPool){
        setSelectedPool(poolsData.pools[0] as any);
    }
    
  }, [poolsData, predictionsData]);

  useEffect(() => {
    if (!selectedPool) return;

    setCalculatedHealthFactor(calculatePredictedHF(selectedPool, predictionsData.predictions));
  }, [selectedPool]);

  return (
    <div className="w-full h-full border border-[#333333] rounded-[15px]  flex flex-col gap-3 pt-[18px] pb-6 px-[22px]">
      <div className="flex flex-col lg:flex-row gap-2 justify-between items-center w-full">
        <div className="text-base font-semibold text-white lg:pl-8 w-full text-left">
          AI Predicted Trends
        </div>
        <select
          className="select select-bordered w-full max-w-xs bg-black text-white"
          onChange={handleMintChange}
        >
          {options?.map((opt, index: number) => (
            <option value={opt} key={index}>
              {opt} Pool
            </option>
          ))}
        </select>
      </div>

      {calculatedHealthFactor && (
        <HealthFactorChart data={calculatedHealthFactor} />
      )}
      
    </div>
  );
}
