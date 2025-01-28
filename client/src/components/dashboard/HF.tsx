import { useEffect, useRef, useState } from "react"
import * as d3 from "d3";
import { Pools } from "./dashboard-data-access"

export default function HealthFactor ({ poolsData }: { poolsData: Pools }) {
    
    const svgRef = useRef(null);
    const width = 225;
    const borrowedRef = useRef(0);
    

    useEffect(() => {
        const height = width * 0.8; // Increase height for 270-degree arc
        const outerRadius = width / 2; 
        const innerRadius = outerRadius * 0.80;
        const arcSpan = (7 * Math.PI) / 5; // 270 degrees in radians
      
        d3.select(svgRef.current).selectAll("*").remove();
      
        const svg = d3
          .select(svgRef.current)
          .attr("viewBox", `0 0 ${width} ${height}`) // Adjust view to fit the 270-degree arc
          .attr("preserveAspectRatio", "xMidYMid meet");
      
        const g = svg
          .append("g")
          .attr("transform", `translate(${width / 2}, ${outerRadius})`); // Centering for 270 degrees
      
        // Create the arc generator with rounded corners
        const arc = d3
          .arc<{ endAngle: number }>()
          .innerRadius(innerRadius)
          .outerRadius(outerRadius)
          .startAngle(-arcSpan / 2)  // Start at -135 degrees (left side)
          .cornerRadius(50); // Rounded edges
      
        // Background arc (full 270 degrees)
        const background = g
          .append("path")
          .datum({ endAngle: arcSpan / 2 }) // 270-degree arc
          .style("fill", "#3D3E52")
          .attr("d", d => arc(d));
      
        // Foreground arc (progress fill)
        const foreground = g
          .append("path")
          .datum({ endAngle: -arcSpan / 2 }) // Start with no progress
          .style("fill", "#C9F31D")
          .attr("d", d => arc(d));
      
        // Add first line of text (value percentage)
        const textValue = g
            .append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "0.4em") // Move the first line a bit up
            .style("font-size", "60px")
            .style("fill", "#B52C24")  // Text color
            .style("font-weight", "700")
            .text("0%");  // Initial value
      
        const collateral = poolsData?.pools.reduce((total, obligation) => {
            const sum = obligation.depositValueUSD;
            return total + sum;
        }, 0);

        const borrowed = poolsData?.pools.reduce((total, obligation) => {
            const sum = obligation.borrowValueUSD;
            return total + sum;
        }, 0);

        const percent = 100 - ((borrowed / collateral) * 100) || 0;


        let color;
        if (percent >= 70) {
          color = "#3BD32D";  // Good Health (Green)
        } else if (percent >= 40) {
          color = "#FDAA35";  // Ordinary (Orange)
        } else {
          color = "#B52C24";  // Worst (Red)
        }

        if( borrowedRef.current !== borrowed ) {
            foreground
              .transition()
              .duration(750)
              .attrTween("d", arcTween((percent / 100) * arcSpan - arcSpan / 2) as any) // Scale value within -135 to +135
              .style("fill", color);
      
            textValue.transition()
                .style("fill", color)
                .duration(750)
                .tween("text", () => {
                    const i = d3.interpolateNumber(parseFloat(textValue.text()), percent );
                    return function (t) {
                        textValue.text(`${Math.round(i(t))}%`);
                    };
                });

            borrowedRef.current = borrowed;
        } else {
            foreground
              .transition()
              .duration(0)
              .attrTween("d", arcTween((percent / 100) * arcSpan - arcSpan / 2) as any) // Scale value within -135 to +135
              .style("fill", color);
                
            textValue.text(`${percent.toFixed(0)}%`).style("fill", color);
        }
      
        function arcTween(newAngle: number) {
            return function (d: { endAngle: number }) {
                const interpolate = d3.interpolate(d.endAngle, newAngle);
                return function (t: number) {
                    d.endAngle = interpolate(t);
                    return arc(d);
                };
            };
        }
      
    }, [width, poolsData]); 
     
    return (
        <div className="w-full h-full flex flex-col gap-4 border border-[#333333] rounded-md p-8 bg-[#0B0E12] bg-opacity-60">
            <div className="w-full text-[#C2C2C2] text-[32px] font-normal">Health Factor</div>
            <div className="h-[225px] w-full flex flex-col justify-center items-center">
                <svg ref={svgRef} className="max-w-[225px] max-h-[225px]"></svg>
            </div>

            <div className="flex flex-col justify-center w-full items-center">
                <div className="text-white font-normal text-sm leading-5 flex flex-row gap-2 items-center"><span className="w-[10px] h-[10px] bg-[#3BD32D] rounded-full"></span>Good Health</div>
                <div className="text-white font-normal text-sm leading-5 flex flex-row gap-2 items-center"><span className="w-[10px] h-[10px] bg-[#FDAA35] rounded-full"></span>Ordinary</div>
                <div className="text-white font-normal text-sm leading-5 flex flex-row gap-2 items-center"><span className="w-[10px] h-[10px] bg-[#B52C24] rounded-full"></span>Worst</div>
            </div>
        </div>
    )
}