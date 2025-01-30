import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { Pools, Prices, Predictions } from "./dashboard-data-access"



export default function AiPredictedTrends({ poolsData, predictionsData }: { poolsData: Pools, predictionsData: Predictions }) {

    console.log(predictionsData)

    
    const svgRef = useRef(null);
    const [ data, setData ] = useState([
        { Date: new Date(2023, 0, 1), Close: Math.random() * 100 },
        { Date: new Date(2023, 0, 2), Close: Math.random() * 100 },
        { Date: new Date(2023, 0, 3), Close: Math.random() * 100 },
        { Date: new Date(2023, 0, 4), Close: Math.random() * 100 },
        { Date: new Date(2023, 0, 5), Close: Math.random() * 100 },
        { Date: new Date(2023, 0, 6), Close: Math.random() * 100 },
        { Date: new Date(2023, 0, 7), Close: Math.random() * 100 },
        { Date: new Date(2023, 0, 8), Close: Math.random() * 100 },
        { Date: new Date(2023, 0, 9), Close: Math.random() * 100 },
        { Date: new Date(2023, 0, 10), Close: Math.random() * 100 },
        { Date: new Date(2023, 0, 11), Close: Math.random() * 100 },
        { Date: new Date(2023, 0, 12), Close: Math.random() * 100 },
        { Date: new Date(2023, 0, 13), Close: Math.random() * 100 },
        { Date: new Date(2023, 0, 14), Close: Math.random() * 100 },
        { Date: new Date(2023, 0, 15), Close: Math.random() * 100 },
        { Date: new Date(2023, 0, 16), Close: Math.random() * 100 },
        { Date: new Date(2023, 0, 17), Close: Math.random() * 100 },
        { Date: new Date(2023, 0, 18), Close: Math.random() * 100 },
    ]);
    const width = 800;
    const height = 300;


    useEffect(() => {
        const marginTop = 20;
        const marginRight = 30;
        const marginBottom = 30;
        const marginLeft = 40;
    
        const x = d3
            .scaleUtc()
            .domain(d3.extent(data, (d) => d.Date) as [Date, Date])
            .range([marginLeft, width - marginRight]);
    
        const y = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => d.Close) || 0])
            .nice()
            .range([height - marginBottom, marginTop]);
    
        const line = d3
            .line<{ Date: Date; Close: number }>()
            .x((d) => x(d.Date))
            .y((d) => y(d.Close))
            .curve(d3.curveMonotoneX);
    
        const area = d3
            .area<{ Date: Date; Close: number }>()
            .x((d) => x(d.Date))
            .y0(height - marginBottom) // Bottom of the chart
            .y1((d) => y(d.Close))
            .curve(d3.curveMonotoneX); // Line position
    
        const svg = d3
            .select(svgRef.current)
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("width", width)
            .attr("height", height)
            .attr("style", `max-width: 100%; height: 300px; font: 10px sans-serif;`)
            .style("-webkit-tap-highlight-color", "transparent")
            .style("overflow", "visible")
            .on("pointerenter pointermove", pointerMoved)
            .on("pointerleave", pointerLeft)
            .on("touchstart", (event) => event.preventDefault());
    
        svg.selectAll("*").remove();
    
        // Add gradient definition
        const defs = svg.append("defs");
        const gradient = defs.append("linearGradient")
            .attr("id", "area-gradient")
            .attr("x1", "0%")
            .attr("x2", "0%")
            .attr("y1", "0%")
            .attr("y2", "100%");
    
        gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#C9F31D80")
            .attr("stop-opacity", 0.7);
    
        gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#C9F31D80")
            .attr("stop-opacity", 0);
    
        // Drawing horizontal text
        svg
            .append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .style("font-size", "14px")
            .style("font-weight", "600")
            .style("color", "#A4A8AB")
            .call(d3
                .axisBottom(x)
                .ticks(width / 80)
                .tickFormat((d: any) => {
                    const options: Intl.DateTimeFormatOptions = { weekday: "short" }
                    return new Date(d).toLocaleDateString("en-US", options);
                }))
            .selectAll(".tick line") // Select the tick marks (lines)
            .remove(); // Remove all tick marks
    
    
        svg
            .append("g")
            .attr("transform", `translate(${marginLeft},0)`)
            .style("font-size", "12px")
            .style("font-weight", "400")
            .style("color", "#A4A8AB")
            .call(d3.axisLeft(y).ticks(height / 90))
            .call((g) => g.select(".domain").remove())
            .call((g) =>
                g
                .selectAll(".tick line")
                .clone()
                .attr("x2", width - marginLeft - marginRight)
                .attr("stroke-opacity", 0.1)
            )
    
        // Add area chart with gradient fill
        svg
            .append("path")
            .datum(data)
            .attr("fill", "url(#area-gradient)")
            .attr("d", area);
    
        // Add the line chart
        svg
            .append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#C9F31D")
            .attr("stroke-width", 3)
            .attr("d", line);
    
        const tooltip = svg.append("g").style("display", "none");
        const bisect = d3.bisector<{ Date: Date; Close: number }, Date>((d) => d.Date).center;
    

        const dot = svg.append("g") // Create a group to hold both circles
            .style("pointer-events", "none") // Avoid interaction
            .style("opacity", 0) // Initially hide the dot

        // Create the outer dot (green circle)
        dot.append("circle")
            .attr("r", 10) // Outer circle radius
            .attr("fill", "#C9F31D"); // Green color for the outer circle

        // Create the inner dot (black circle)
        dot.append("circle")
            .attr("r", 4) // Inner circle radius (smaller than outer circle)
            .attr("fill", "black"); // Black color for the inner circle

    
        function pointerMoved(event: any) {
            const i = bisect(data, x.invert(d3.pointer(event)[0]));
            tooltip.style("display", null);
            tooltip.attr(
                "transform",
                `translate(${x(data[i].Date)},${y(data[i].Close)})`
            );
    
            // Update dot position
            dot
                .attr("transform", `translate(${x(data[i].Date)}, ${y(data[i].Close)})`)
                .style("opacity", 1); // Show the dot
    
            // Add white background behind the tooltip content
            const padding = 6;
            const textWidth = 150; // Adjust based on the length of the longest text
            const textHeight = 40; // Adjust based on the number of rows
            const marginTop = 50;
    
            tooltip.selectAll("rect")
                .data([null])
                .join("rect")
                .attr("x", -textWidth / 2 - padding)
                .attr("y", -textHeight / 2 - padding + marginTop)
                .attr("width", textWidth + 2 * padding)
                .attr("height", textHeight + 2 * padding)
                .attr("fill", "#12181F87")
                .attr("stroke", "black")
                .attr("stroke-width", 0)
                .attr("rx", 5) // Rounded corners
                .attr("ry", 5);
    
            // Add circles (dots) for each row
            const dotRadius = 4; // Radius of the circle
    
            const circles = tooltip
                .selectAll("circle")
                .data([null, null]) // Two dots for two rows
                .join("circle")
                .attr("cx", -textWidth / 2 + dotRadius + 20) // Position the dots to the left of the text
                .attr("cy", (_, i) => i * 20 - 10 + marginTop) // Vertical position
                .attr("r", dotRadius) // Dot radius
                .attr("fill", (_, i) => i === 0 ? "#C9F31D" : "#FF5733"); // Different colors for each dot
    
            // Add text elements for each row
            const text = tooltip
                .selectAll("text")
                .data([null, null])
                .join("text")
                .attr("x", 100) // Adjust to align text with circles
                .attr("y", (_, i) => i * 20 - 8 + marginTop) // Vertical position
                .attr("margin-left", 10)
                .attr("font-weight", (_, i) => (i ? null : "bold"))
                .attr("font-size", (_, i) => (i ? 10 : 16))
                .attr("fill", (_, i) => (i ? "#81818A" : "white"))
                .call((text) =>
                    text
                        .selectAll("tspan")
                        .data([
                            "$500",
                            "100",
                        ])
                        .join("tspan")
                        .attr("x", -20)
                        .text((d) => d)
                );
        }
    
        function pointerLeft() {
            tooltip.style("display", "none");
            dot.style("opacity", 0); // Hide dot on pointer leave
        }
    
    }, [data, height, width]);
    

    return (
        <div className="w-full h-full border border-[#333333] rounded-[15px] bg-[#1C252F9E] flex flex-col justify-between gap-3 pt-[18px] pb-6 px-[22px]">
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