import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { Pools, PredictedTrendItem, Predictions } from "./dashboard-data-access"

interface Option {
    label: string
    mint: string
}

export default function AiPredictedTrends({ poolsData, predictionsData }: { poolsData: Pools, predictionsData: Predictions }) {

    const svgRef = useRef(null);
    const [ selectedPool, setSelectedPool ] = useState<string>();
    const [ options, setOptions ] = useState<Option[]>([]);

    
    const drawChart = (data: PredictedTrendItem[]) => {
        const width = 800;
        const height = 300;
        const margin = { top: 20, right: 30, bottom: 30, left: 50 };
    
        const x = d3
            .scaleUtc()
            .domain(d3.extent(data, (d) => d.timestamp) as [Date, Date])
            .range([margin.left, width - margin.right]);
    
        const y = d3
            .scaleLinear()
            .domain([
                (d3.min(data, (d) => d.price) || 0) * 0.99,
                (d3.max(data, (d) => d.price) || 1) * 1.01
            ])
            .nice()
            .range([height - margin.bottom, margin.top]);
    
        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height);
    
        svg.selectAll("*").remove();
    
        svg.style("background", "#1e1e1e").style("color", "#fff").style("border-radius", "8px");
    
        const lineGenerator = d3.line<{ timestamp: Date; price: number }>()
            .x((d) => x(d.timestamp))
            .y((d) => y(d.price))
            .curve(d3.curveBumpX);
    
        const areaGenerator = d3.area<{ timestamp: Date; price: number }>()
            .x((d) => x(d.timestamp))
            .y0(height - margin.bottom)
            .y1((d) => y(d.price))
            .curve(d3.curveBasis);
    
        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).ticks(5).tickFormat(d3.timeFormat("%H:%M") as any))
            .selectAll("text").style("fill", "#FFF");

    
        svg.selectAll(".domain").remove(); // Remove default axis lines
    
        svg.append("g")
            .attr("class", "grid")
            .attr("transform", `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(y).ticks(5).tickSize(-width + margin.left + margin.right).tickPadding(10))
            .selectAll("line").style("stroke", "#444").style("stroke-width", "0.5px");
    
        svg.selectAll(".domain").remove();
    
        let segment: { timestamp: Date; price: number }[] = [];
        let currentColor = data[0]?.price >= 1 ? "green" : "red";
    
        for (let i = 0; i < data.length; i++) {
            const current = data[i];
            const next = data[i + 1];
    
            segment.push(current);
    
            if (next && (current.price >= 1) !== (next.price >= 1)) {
                svg.append("path")
                    .datum(segment)
                    .attr("fill", currentColor === "green" ? "rgba(0, 255, 0, 0.2)" : "rgba(255, 0, 0, 0.2)")
                    .attr("stroke", "none")
                    .attr("d", areaGenerator);
    
                svg.append("path")
                    .datum(segment)
                    .attr("fill", "none")
                    .attr("stroke", currentColor)
                    .attr("stroke-width", 3)
                    .attr("d", lineGenerator);
    
                segment = [current];
                currentColor = next.price >= 1 ? "green" : "red";
            }
        }
    
        if (segment.length) {
            svg.append("path")
                .datum(segment)
                .attr("fill", currentColor === "green" ? "rgba(0, 255, 0, 0.2)" : "rgba(255, 0, 0, 0.2)")
                .attr("stroke", "none")
                .attr("d", areaGenerator);
    
            svg.append("path")
                .datum(segment)
                .attr("fill", "none")
                .attr("stroke", currentColor)
                .attr("stroke-width", 3)
                .attr("d", lineGenerator);
        }
    
        const tooltip = svg.append("g").style("display", "none");
        const dot = svg.append("g").style("opacity", 0);

        dot.append("circle")
            .attr("class", "outer")
            .attr("r", 8)
            .attr("fill", "black");
        
        dot.append("circle")
            .attr("class", "inner")
            .attr("r", 5)
            .attr("fill", "white");
    
        function pointerMoved(event: any) {
            const [xPos] = d3.pointer(event);
            const timestamp = x.invert(xPos);
            const bisect = d3.bisector<{ timestamp: Date; price: number }, Date>((d) => d.timestamp).center;
            const i = bisect(data, timestamp);
    
            if (i >= 0 && i < data.length) {
                const nearest = data[i];

                const dotColor = nearest.price >= 1 ? "green" : "red";
        
                dot.attr("transform", `translate(${x(nearest.timestamp)}, ${y(nearest.price)})`)
                    .style("opacity", 1);
        
                dot.select("circle.outer")
                    .attr("fill", dotColor);
        
                dot.select("circle.inner")
                    .attr("r", 3)
                    .attr("fill", "white");
        
                tooltip.style("display", null);
                tooltip.attr("transform", `translate(${x(nearest.timestamp)}, ${y(nearest.price) - 10})`);
        
                tooltip.selectAll("text").remove();
                tooltip.append("text")
                    .text(`${nearest.price.toFixed(4)}`)
                    .attr("fill", "white")
                    .attr("font-size", "12px")
                    .attr("text-anchor", "middle");
            }
        }
    
        function pointerLeft() {
            tooltip.style("display", "none");
            dot.style("opacity", 0);
        }
    
        svg.on("pointerenter pointermove", pointerMoved).on("pointerleave", pointerLeft);
        svg.on("mousemove", function(event) {
            const [xPos, yPos] = d3.pointer(event);
            svg.selectAll(".crosshair").remove();
    
            svg.append("line")
                .attr("class", "crosshair")
                .attr("x1", xPos)
                .attr("x2", xPos)
                .attr("y1", margin.top)
                .attr("y2", height - margin.bottom)
                .attr("stroke", "#fff")
                .attr("stroke-width", 1)
                .attr("stroke-dasharray", "5,5");
    
            svg.append("line")
                .attr("class", "crosshair")
                .attr("x1", margin.left)
                .attr("x2", width - margin.right)
                .attr("y1", yPos)
                .attr("y2", yPos)
                .attr("stroke", "#fff")
                .attr("stroke-width", 1)
                .attr("stroke-dasharray", "5,5");
        });
    };
    
        
    useEffect(() => {
        if( predictionsData && selectedPool ) {
            const predictions: any = predictionsData?.predictions || {};
    
            const selectedPrediction = predictions[selectedPool];
    
            const data: {price: number, timestamp: Date}[] = [ ...(selectedPrediction?.predictedTrend ? selectedPrediction?.predictedTrend: []) ].map((pre: any) => ({price: selectedPrediction?.predictedPriceUsd / pre.price, timestamp: new Date(pre.timestamp)}));
    
            // Format the data
            const formattedData = data.map(d => ({
                    price: d.price,
                    timestamp: new Date(d.timestamp),
                }));
    
            drawChart(formattedData)
        }
    
    }, [selectedPool, predictionsData]);

    useEffect(() => {

        if( poolsData ) {
            const mints = poolsData?.pools?.map((pool: any) => {
                return pool.deposits.map((deposit: any) => ({ label: deposit.symbol, mint: deposit.mint }));
            }).flat();

            const uniqueMints = Object.values(
                mints.reduce((acc, curr) => {
                    acc[curr.label] = curr;
                    return acc;
                }, {})
            ) as Option[];
            
            setOptions(uniqueMints)

            if( !selectedPool && uniqueMints.length > 0 ) {
                setSelectedPool(uniqueMints[0].mint)
            }
        }
    }, [ predictionsData, poolsData ])

    const handleMintChange = (e: any) => {
        setSelectedPool(e.target.value)
    }
    

    return (
        <div className="w-full h-full border border-[#333333] rounded-[15px] bg-[#1C252F9E] flex flex-col gap-3 pt-[18px] pb-6 px-[22px]">
            <div className="flex flex-col lg:flex-row gap-2 justify-between items-center w-full">
                <div className="text-base font-semibold text-white lg:pl-8 w-full text-left">AI Predicted Trends</div>
                <select className="select select-bordered w-full max-w-xs bg-black text-white" onChange={handleMintChange}>
                    {
                        options?.map((opt, index: number) => (
                            <option value={opt.mint} key={index}>{opt.label}</option>
                        ))
                    }
                </select>
            </div>

            <svg ref={svgRef} className="w-full"></svg>
        </div>
    )
};