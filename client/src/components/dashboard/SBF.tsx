import { useEffect, useRef, useState } from "react"
import * as d3 from "d3";
import { Pools } from "./dashboard-data-access"


export default function SupplyBorrowFactor({ poolsData }: { poolsData: Pools }) {

    const svgRef = useRef(null);
    const width = 225;
    const borrowedRef = useRef(0);

    useEffect(() => {
        const height = width * 0.8;
        const outerRadius = width / 2; 
        const innerRadius = outerRadius * 0.80;
        const arcSpan = (7 * Math.PI) / 5;
      
        d3.select(svgRef.current).selectAll("*").remove();
      
        const svg = d3
          .select(svgRef.current)
          .attr("viewBox", `0 0 ${width} ${height}`)
          .attr("preserveAspectRatio", "xMidYMid meet");
      
        const g = svg
          .append("g")
          .attr("transform", `translate(${width / 2}, ${outerRadius})`);
      
        const arc = d3
          .arc<{ endAngle: number }>()
          .innerRadius(innerRadius)
          .outerRadius(outerRadius)
          .startAngle(-arcSpan / 2)
          .cornerRadius(50);
      
        const background = g
          .append("path")
          .datum({ endAngle: arcSpan / 2 })
          .style("fill", "#3D3E52")
          .attr("d", d => arc(d));
      
        const foreground = g
          .append("path")
          .datum({ endAngle: -arcSpan / 2 })
          .style("fill", "#C9F31D")
          .attr("d", d => arc(d));

         g.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "-0.3em")
            .style("font-size", "24px")
            .style("fill", "#C9F31D")
            .style("font-weight", "400")
            .text("Completion");
      
        const textValue = g
            .append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "1.2em")
            .style("font-size", "24px")
            .style("fill", "#C9F31D")
            .style("font-weight", "400")
            .text("$0");
        
        const limit = poolsData?.pools.reduce((total, obligation) => {
            const sum = obligation.borrowLimit;
            return total + sum;
        }, 0);

        const borrowed = poolsData?.pools.reduce((total, obligation) => {
            const sum = obligation.borrowValueUSD;
            return total + sum;
        }, 0);

        const percent = ((borrowed / limit) * 100) || 0;

        if( borrowedRef.current !== borrowed) {
            foreground
                .transition()
                .duration(750)
                .attrTween("d", arcTween((percent / 100) * arcSpan - arcSpan / 2) as any);
        
            textValue.transition()
                .duration(750)
                .tween("text", function () {
                    const currentValue = parseFloat(d3.select(this).text().replace(/[^0-9.]/g, "")) || 0;
                    const interpolator = d3.interpolateNumber(currentValue, borrowed || 0);
            
                    return function (t) {
                        d3.select(this).text(`$${interpolator(t).toFixed(2)}`);
                    };
                });

            borrowedRef.current = borrowed;
        } else {
            foreground
                .transition()
                .duration(0)
                .attrTween("d", arcTween((percent / 100) * arcSpan - arcSpan / 2) as any);
        
            textValue
                .text(`$${(borrowed || 0).toFixed(2)}`);
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
        <div className="w-full h-full flex flex-col gap-5 justify-between border border-[#333333] rounded-md p-8 bg-[#0B0E12] bg-opacity-60">
            <div className="h-[225px] w-full flex flex-col justify-center items-center">
                <svg ref={svgRef} className="max-w-[225px] max-h-[225px]"></svg>
                <div className="text-sm font-normal text-white">
                    {
                        `Overall Borrow Limit : $${
                            (poolsData?.pools.reduce((total, obligation) => {
                                const sum = obligation.borrowLimit;
                                return total + sum;
                            }, 0) || 0).toFixed(2)
                        }`
                    }
                </div>
            </div>

            <div>
                <div className="text-[19px] font-bold text-white leading-9">Supply Borrow Factor</div>
                <div className="text-[19px] font-normal text-white leading-9 flex gap-1 justify-center">
                    Supplied as Collateral : 
                    <span className="text-[#C9F31D]">
                        {
                            `$${
                                (poolsData?.pools.reduce((total, obligation) => {
                                    const sum = obligation.depositValueUSD;
                                    return total + sum;
                                }, 0) || 0).toFixed(2)
                            }`
                        }
                    </span>
                </div>
            </div>
            <div></div>
        </div>
    )
}