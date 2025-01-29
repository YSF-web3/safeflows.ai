import React, { useEffect, useRef } from 'react';
import * as d3 from "d3";
import { Pools, Prices, Predictions } from "./dashboard-data-access"


export default function PoolsHeatmap({ onItemClicked, poolsData, predictionsData }: { onItemClicked: (item: any) => void, poolsData: Pools, predictionsData: Predictions }) {
    
    const svgRef = useRef(null);
    const tooltipRef = useRef(null);

    const drawChart = () => {
        const predictions = { ...predictionsData?.predictions };
    
        const margin = { top: 50, right: 0, bottom: 0, left: 50 };
        const width = 750 - margin.right - margin.left;
        const height = 330 - margin.top - margin.bottom;
    
        const data = poolsData?.pools?.flatMap((pool: any) =>
            pool.deposits.map((deposit: any) => ({
                pool: pool.lendingMarketName,
                symbol: deposit.symbol,
                value: predictions[deposit.mint] / deposit.pricePerTokenInUSD,
            }))
        );
    
        const fixedColumns = 11;
        const fixedRows = 6;
    
        let x_elements = Array.from(new Set(data.map((item) => item.symbol)));
        let y_elements = Array.from(new Set(data.map((item) => item.pool)));
    
        while (x_elements.length < fixedColumns) {
            x_elements.push(`Placeholder ${x_elements.length + 1}`);
        }
        while (y_elements.length < fixedRows) {
            y_elements.push(`Placeholder ${y_elements.length + 1}`);
        }
    
        const fullGrid = [];
        for (let y = 0; y < y_elements.length; y++) {
            for (let x = 0; x < x_elements.length; x++) {
                const match = data.find(
                    (d) => d.symbol === x_elements[x] && d.pool === y_elements[y]
                );
                const value = match?.value || 0;
    
                fullGrid.push({
                    pool: y_elements[y],
                    symbol: x_elements[x],
                    value,
                });
            }
        }
    
        const itemSize = Math.min(
            height / y_elements.length,
            width / x_elements.length
        );
    
        const xScale = d3
            .scaleBand()
            .domain(x_elements)
            .range([0, x_elements.length * itemSize])
            .padding(0.05);
    
        const yScale = d3
            .scaleBand()
            .domain(y_elements)
            .range([0, y_elements.length * itemSize])
            .padding(0.05);
    
        const colorScale = d3
            .scaleThreshold<number, string>()
            .domain([1])
            .range([ "#B52C24", "#FDAA35", "#3BD32D"]);
    
        // Tooltip setup
        const tooltip = d3
            .select(tooltipRef.current)
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("background-color", "#333")
            .style("color", "#fff")
            .style("padding", "5px")
            .style("border-radius", "4px")
            .style("pointer-events", "none");
    
        d3.select(svgRef.current).selectAll("*").remove();
        const svg = d3
            .select(svgRef.current)
            .attr("height", height + margin.top + margin.bottom)
            .attr("width", "100%")
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
    
        svg.selectAll("rect")
            .data(fullGrid)
            .enter()
            .append("rect")
            .attr("class", "cell")
            .attr("width", xScale.bandwidth())
            .attr("height", yScale.bandwidth())
            .attr("x", (d) => xScale(d.symbol) || 0)
            .attr("y", (d) => yScale(d.pool) || 0)
            .attr("fill", (d) => (d.value === 0 ? "#FFFFFF11" : colorScale(d.value)))
            .attr("rx", 4)
            .attr("ry", 4)
            .on("mouseover", (event, d) => {
                if( !d.symbol.startsWith("Placeholder") && !d.pool.startsWith("Placeholder") )
                {
                    tooltip
                        .style("visibility", "visible")
                        .html(
                            `<strong>Pool:</strong> ${d.pool}<br><strong>Symbol:</strong> ${d.symbol}<br><strong>RTRS:</strong> ${d.value.toFixed(2)}`
                        );
                }
            })
            .on("mousemove", (event) => {
                tooltip
                    .style("top", `${event.pageY + 10}px`)
                    .style("left", `${event.pageX + 10}px`);
            })
            .on("mouseout", () => {
                tooltip.style("visibility", "hidden");
            });
    
        const xAxis = svg.append("g")
            .attr("class", "x axis")
            .style("color", "#FFFFFF")
            .style("font-size", "12px")
            .call(d3.axisTop(xScale));
    
        xAxis.select("path").remove();
        xAxis.selectAll("line").remove();
    
        xAxis.selectAll("text")
            .filter(function () {
                return d3.select(this).text().startsWith("Placeholder");
            })
            .style("opacity", 0);
    
        const yAxis = svg.append("g")
            .attr("class", "y axis")
            .style("color", "#FFFFFF")
            .style("font-size", "14px")
            .style("font-weight", "600")
            .call(d3.axisLeft(yScale));
    
        yAxis.select("path").remove();
        yAxis.selectAll("line").remove();
    
        yAxis.selectAll("text")
            .filter(function () {
                return d3.select(this).text().startsWith("Placeholder");
            })
            .style("opacity", 0);
    };
    
    
    


    useEffect(() => {
        if( poolsData && predictionsData) {
            drawChart();
        }

    }, [poolsData, predictionsData]);

    
    return (
        <div className="w-full h-full flex flex-col gap-3 border p-[18px] rounded-[13px] border-[#333333]">
            <div className="flex flex-col lg:flex-row justify-between items-center w-full gap-2">
                <div className="text-base font-semibold text-white lg:pl-8 w-full text-left">Real Time Risk Scoring (RTRS)</div>

            </div>
            <div>
                <svg ref={svgRef} />
                <div ref={tooltipRef}></div>
            </div>
        </div>
    )
}