import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { Pools, PredictedTrendItem, Predictions } from "./dashboard-data-access"



export default function AiPredictedTrends({ poolsData, predictionsData }: { poolsData: Pools, predictionsData: Predictions }) {

    const svgRef = useRef(null);
    const [ selectedPool, setSelectedPool ] = useState<string>("So11111111111111111111111111111111111111112");

    
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
            .domain([d3.min(data, (d) => d.price) || 0, d3.max(data, (d) => d.price) || 1])
            .nice()
            .range([height - margin.bottom, margin.top]);
    
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Clear previous chart
    
        // Apply a dark theme
        svg
            .style("background", "#1e1e1e")
            .style("color", "#fff");
    
        // Define line generator
        const lineGenerator = d3
            .line<{ timestamp: Date; price: number }>()
            .x((d) => x(d.timestamp))
            .y((d) => y(d.price))
            .curve(d3.curveBasis); // Smooth curve
    
        // Draw Axes with custom styling
        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).ticks(5).tickFormat(d3.timeFormat("%H:%M") as any))
            .selectAll("text")
            .style("fill", "#aaa");
    
        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y))
            .selectAll("text")
            .style("fill", "#aaa");
    
        // Add gridlines
        // svg.append("g")
        //     .attr("class", "grid")
        //     .call(
        //         d3
        //             .axisBottom(x)
        //             .ticks(5)
        //             .tickSize(-height + margin.top + margin.bottom)
        //             .tickFormat("")
        //     )
        //     .selectAll("line")
        //     .style("stroke", "#444")
        //     .style("stroke-width", "0.5px");
    
        // svg.append("g")
        //     .attr("class", "grid")
        //     .call(
        //         d3
        //             .axisLeft(y)
        //             .ticks(5)
        //             .tickSize(-width + margin.left + margin.right)
        //             .tickFormat("")
        //     )
        //     .selectAll("line")
        //     .style("stroke", "#444")
        //     .style("stroke-width", "0.5px");
    
        // Split data into segments for red/green lines
        let segment: { timestamp: Date; price: number }[] = [];
        let currentColor = data[0].price >= 1 ? "green" : "red";
    
        for (let i = 0; i < data.length; i++) {
            const current = data[i];
            const next = data[i + 1];
    
            segment.push(current);
    
            if (next && (current.price >= 1) !== (next.price >= 1)) {
                // Transition detected, draw the segment
                svg.append("path")
                    .datum(segment)
                    .attr("fill", "none")
                    .attr("stroke", currentColor)
                    .attr("stroke-width", 3)
                    .attr("d", lineGenerator);
    
                // Reset segment with last point to maintain continuity
                segment = [current];
                currentColor = next.price >= 1 ? "green" : "red";
            }
        }
    
        // Draw the final segment
        if (segment.length) {
            svg.append("path")
                .datum(segment)
                .attr("fill", "none")
                .attr("stroke", currentColor)
                .attr("stroke-width", 3)
                .attr("d", lineGenerator);
        }
    
        // Tooltip logic with enhanced info
        const tooltip = svg.append("g").style("display", "none");
        const dot = svg.append("g").style("opacity", 0);
        dot.append("circle").attr("r", 6).attr("fill", "black");
    
        function pointerMoved(event: any) {
            const [xPos] = d3.pointer(event);
            const timestamp = x.invert(xPos);
            const bisect = d3.bisector<{ timestamp: Date; price: number }, Date>((d) => d.timestamp).center;
            const i = bisect(data, timestamp);
    
            if (i >= 0 && i < data.length) {
                const nearest = data[i];
    
                dot.attr("transform", `translate(${x(nearest.timestamp)}, ${y(nearest.price)})`)
                    .style("opacity", 1);
    
                tooltip.style("display", null);
                tooltip.attr("transform", `translate(${x(nearest.timestamp)}, ${y(nearest.price) - 10})`);
    
                tooltip.selectAll("text").remove();
                tooltip.append("text")
                    .text(`$${nearest.price.toFixed(4)}`)
                    .attr("fill", "white")
                    .attr("font-size", "12px")
                    .attr("text-anchor", "middle");
            }
        }
    
        function pointerLeft() {
            tooltip.style("display", "none");
            dot.style("opacity", 0);
        }
    
        // Crosshair cursor
        svg.on("pointerenter pointermove", pointerMoved).on("pointerleave", pointerLeft);
        svg.on("mousemove", function(event) {
            const [xPos, yPos] = d3.pointer(event);
            svg.selectAll(".crosshair").remove();
    
            // Crosshair vertical line
            svg.append("line")
                .attr("class", "crosshair")
                .attr("x1", xPos)
                .attr("x2", xPos)
                .attr("y1", margin.top)
                .attr("y2", height - margin.bottom)
                .attr("stroke", "#fff")
                .attr("stroke-width", 1)
                .attr("stroke-dasharray", "5,5");
    
            // Crosshair horizontal line
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
        const predictions: any = predictionsData?.predictions || {};

        const selectedPrediction = predictions[selectedPool];

        const data: {price: number, timestamp: Date}[] = [ ...(selectedPrediction?.predictedTrend ? selectedPrediction?.predictedTrend: []) ].slice(0, 20).map((pre: any) => ({price: selectedPrediction?.predictedPriceUsd / pre.price, timestamp: new Date(pre.timestamp)}));

        // Format the data
        const formattedData = [
            {
                "price": 0.991231,
                "timestamp": "2025-01-30T01:35:53.076Z"
            },
            {
                "price": 0.991631,
                "timestamp": "2025-01-30T02:35:53.076Z"
            },
            {
                "price": 0.998231,
                "timestamp": "2025-01-30T03:35:53.076Z"
            },
            {
                "price": 0.991731,
                "timestamp": "2025-01-30T04:35:53.076Z"
            },
            {
                "price": 1.0153129161118508,
                "timestamp": "2025-01-30T05:35:53.076Z"
            },
            {
                "price": 1.0166666666666666,
                "timestamp": "2025-01-30T06:35:53.076Z"
            },
            {
                "price": 1.0180240320427236,
                "timestamp": "2025-01-30T07:35:53.076Z"
            },
            {
                "price": 1.0193850267379678,
                "timestamp": "2025-01-30T08:35:53.076Z"
            },
            {
                "price": 1.0207496653279786,
                "timestamp": "2025-01-30T09:35:53.076Z"
            },
            {
                "price": 1.021661456007146,
                "timestamp": "2025-01-30T10:35:53.076Z"
            },
            {
                "price": 1.0202943800178412,
                "timestamp": "2025-01-30T11:35:53.076Z"
            },
            {
                "price": 1.0189309576837418,
                "timestamp": "2025-01-30T12:35:53.076Z"
            },
            {
                "price": 1.0175711743772242,
                "timestamp": "2025-01-30T13:35:53.076Z"
            },
            {
                "price": 1.0162150155486451,
                "timestamp": "2025-01-30T14:35:53.076Z"
            },
            {
                "price": 1.0180240320427236,
                "timestamp": "2025-01-30T15:35:53.076Z"
            },
            {
                "price": 1.019839500668747,
                "timestamp": "2025-01-30T16:35:53.076Z"
            },
            {
                "price": 1.021661456007146,
                "timestamp": "2025-01-30T17:35:53.076Z"
            },
            {
                "price": 1.023489932885906,
                "timestamp": "2025-01-30T18:35:53.076Z"
            },
            {
                "price": 1.0212053571428572,
                "timestamp": "2025-01-30T19:35:53.076Z"
            },
            {
                "price": 1.0189309576837418,
                "timestamp": "2025-01-30T20:35:53.076Z"
            }
        ].map(d => ({
            price: d.price,
            timestamp: new Date(d.timestamp),
        }));

        console.log("formattedData: ", formattedData)
        // drawChart(formattedData)
    
    }, [selectedPool, predictionsData, poolsData]);
    

    return (
        <div className="w-full h-full border border-[#333333] rounded-[15px] bg-[#1C252F9E] flex flex-col gap-3 pt-[18px] pb-6 px-[22px]">
            <div className="flex flex-col lg:flex-row gap-2 justify-between items-center w-full">
                <div className="text-base font-semibold text-white lg:pl-8 w-full text-left">AI Predicted Trends</div>
                {/* <div className="w-full flex gap-2 justify-end">
                    <button className="h-7 border border-[#8081954D] px-2 rounded-md text-[10px] font-normal leading-4 text-[#C2C2C2]">1D</button>
                    <button className="h-7 border border-[#8081954D] px-2 rounded-md text-[10px] font-normal leading-4 text-[#C2C2C2]">1M</button>
                    <button className="h-7 border border-[#8081954D] px-2 rounded-md text-[10px] font-normal leading-4 text-[#C2C2C2]">6M</button>
                    <button className="h-7 border border-[#8081954D] px-2 rounded-md text-[10px] font-normal leading-4 text-[#C2C2C2]">1Y</button>
                    <button className="h-7 border border-[#8081954D] px-2 rounded-md text-[10px] font-normal leading-4 text-[#C2C2C2]">YYD</button>
                    <button className="h-7 border border-[#8081954D] px-2 rounded-md text-[10px] font-normal leading-4 text-black bg-[#C9F31D]">All</button>
                </div> */}
            </div>

            <svg ref={svgRef} className="w-full"></svg>
        </div>
    )
};