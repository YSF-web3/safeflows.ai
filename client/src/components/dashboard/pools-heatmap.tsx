import React, { useEffect, useRef } from 'react';
import * as d3 from "d3";
import { Pools, Prices } from "./dashboard-data-access"


export default function PoolsHeatmap({ onItemClicked, poolsData, pricesData }: { onItemClicked: (item: any) => void, poolsData: Pools, pricesData: Prices }) {
    const svgRef = useRef(null);

    const drawChart = () => {
        const prices = pricesData?.prices?.reduce((price, item) => {
            price[item.symbol] = item.price;
            return price;
        }, {});

        const margin = { top: 50, right: 0, bottom: 0, left: 50 };
    
        const width = 750 - margin.right - margin.left;
        const height = 330 - margin.top - margin.bottom;
    
        const data = poolsData?.pools?.flatMap((pool: any) =>
            pool.deposits.map((deposit: any,j : number) => ({
                pool: pool.lendingMarketName,
                symbol: `${deposit.symbol}`,
                value: prices[deposit.symbol] / deposit.pricePerTokenInUSD,
            }))
        );

        const x_elements = Array.from(new Set(data.map((item) => item.symbol)));
        const y_elements = Array.from(new Set(data.map((item) => item.pool)));
    
        const itemSize = height / Math.max(x_elements.length, y_elements.length);
        // const itemSize = 30;
    
        const xScale = d3.scaleBand()
            .domain(x_elements)
            .range([0, x_elements.length * itemSize])
            .padding(0.05);
    
        const yScale = d3.scaleBand()
            .domain(y_elements)
            .range([0, y_elements.length * itemSize])
            .padding(0.05);
    
        const colorScale = d3.scaleThreshold<number, string>()
            .domain([1])
            .range(["#3BD32D", "#FDAA35", "#B52C24"]);
    
        d3.select(svgRef.current).selectAll("*").remove();
        const svg = d3.select(svgRef.current)
            .attr("height", height + margin.top + margin.bottom)
            .attr("width", "100%")
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
    
        svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "cell")
            .attr("width", xScale.bandwidth())
            .attr("height", yScale.bandwidth())
            .attr("x", (d) => xScale(d.symbol) || 0)
            .attr("y", (d) => yScale(d.pool) || 0)
            .attr("fill", (d) => colorScale(d.value))
            .attr("rx", 4) // Border radius for x-axis
            .attr("ry", 4) // Border radius for y-axis
            .on("click", (event, d) => {});
    
        const xAxis = svg.append("g")
            .attr("class", "x axis")
            .style("color", `#FFFFFF`)
            .style("font-size", "12px")
            .call(d3.axisTop(xScale));
    
        xAxis.select("path").remove(); // Remove the axis line
        xAxis.selectAll("line").remove(); // Remove the tick lines
    
        const yAxis = svg.append("g")
            .attr("class", "y axis")
            .style("color", `#FFFFFF`)
            .style("font-size", "14px")
            .style("font-weight", "600")
            .call(d3.axisLeft(yScale));
    
        yAxis.select("path").remove(); // Remove the axis line
        yAxis.selectAll("line").remove(); // Remove the tick lines
    };
    


    useEffect(() => {
        if( poolsData && pricesData) {
            drawChart();
        }

    }, [poolsData, pricesData]);

    
    return (
        <div className="w-full h-full flex flex-col gap-3 border p-[18px] rounded-[13px] border-[#333333]">
            <div className="flex flex-col lg:flex-row justify-between items-center w-full gap-2">
                <div className="text-base font-semibold text-white lg:pl-8 w-full text-left">Real Time Risk Scoring (RTRS)</div>

            </div>
            <div>
                <svg ref={svgRef} />
            </div>
        </div>
    )
}