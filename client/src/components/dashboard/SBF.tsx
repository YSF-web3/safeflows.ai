import { useEffect, useRef, useState } from "react"
import * as d3 from "d3";
import { motion } from "framer-motion";
import { Pools } from "./dashboard-data-access"


export default function SupplyBorrowFactor({ poolsData }: { poolsData: Pools }) {
    const svgRef = useRef(null);
    const width = 225;
    const borrowedRef = useRef(0);
    const [borrowValue, setBorrowValue] = useState(0);
    const [borrowLimit, setBorrowLimit] = useState(0);
    const [suppliedValue, setSuppliedValue] = useState(0);
    const [usagePercent, setUsagePercent] = useState(0);

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
      
        // Add drop shadow filter
        const defs = svg.append("defs");
        const filter = defs.append("filter")
            .attr("id", "sbf-glow")
            .attr("x", "-50%")
            .attr("y", "-50%")
            .attr("width", "200%")
            .attr("height", "200%");
        
        filter.append("feGaussianBlur")
            .attr("stdDeviation", "3")
            .attr("result", "blur");
        
        filter.append("feComposite")
            .attr("in", "SourceGraphic")
            .attr("in2", "blur")
            .attr("operator", "over");
      
        const arc = d3
          .arc<{ endAngle: number }>()
          .innerRadius(innerRadius)
          .outerRadius(outerRadius)
          .startAngle(-arcSpan / 2)
          .cornerRadius(50);
      
        // Create a nice gradient from green to red
        const gradient = defs.append("linearGradient")
            .attr("id", "sbfGradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "0%");
      
        gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#C9F31D");
      
        gradient.append("stop")
            .attr("offset", "80%")
            .attr("stop-color", "#FDAA35");
      
        gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#B52C24");
      
        // Background arc with subtle gradient
        const background = g
          .append("path")
          .datum({ endAngle: arcSpan / 2 })
          .style("fill", "rgba(255, 255, 255, 0.07)")
          .attr("d", d => arc(d));
      
        // Foreground arc
        const foreground = g
          .append("path")
          .datum({ endAngle: -arcSpan / 2 })
          .style("fill", "url(#sbfGradient)")
          .style("filter", "url(#sbf-glow)")
          .attr("d", d => arc(d));

         g.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "-0.3em")
            .style("font-size", "24px")
            .style("fill", "#C9F31D")
            .style("font-weight", "500")
            .text("Borrowed");
      
        const textValue = g
            .append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "1.2em")
            .style("font-size", "24px")
            .style("fill", "#C9F31D")
            .style("font-weight", "500")
            .text("$0");
        
        // Add tick marks for better visualization
        const ticks = [0, 25, 50, 75, 100];
        ticks.forEach(tick => {
            const tickAngle = (tick / 100) * arcSpan - arcSpan / 2;
            const x1 = Math.cos(tickAngle) * innerRadius;
            const y1 = Math.sin(tickAngle) * innerRadius;
            const x2 = Math.cos(tickAngle) * outerRadius;
            const y2 = Math.sin(tickAngle) * outerRadius;

            g.append("line")
                .attr("x1", x1)
                .attr("y1", y1)
                .attr("x2", x2)
                .attr("y2", y2)
                .attr("stroke", "rgba(255, 255, 255, 0.3)")
                .attr("stroke-width", tick % 50 === 0 ? 2 : 1);

            if (tick % 25 === 0) {
                g.append("text")
                    .attr("x", Math.cos(tickAngle) * (outerRadius + 15))
                    .attr("y", Math.sin(tickAngle) * (outerRadius + 15))
                    .attr("text-anchor", "middle")
                    .attr("dominant-baseline", "middle")
                    .style("font-size", "10px")
                    .style("fill", "rgba(255, 255, 255, 0.6)")
                    .text(`${tick}%`);
            }
        });

        // Calculate values
        const limit = poolsData?.pools.reduce((total, obligation) => {
            const sum = obligation.borrowLimit;
            return total + sum;
        }, 0);

        const borrowed = poolsData?.pools.reduce((total, obligation) => {
            const sum = obligation.borrowValueUSD;
            return total + sum;
        }, 0);

        const supplied = poolsData?.pools.reduce((total, obligation) => {
            const sum = obligation.depositValueUSD;
            return total + sum;
        }, 0);

        const percent = ((borrowed / limit) * 100) || 0;
        
        // Update state
        setBorrowValue(borrowed);
        setBorrowLimit(limit);
        setSuppliedValue(supplied);
        setUsagePercent(Math.round(percent));

        // Determine color based on usage percentage
        let color;
        if (percent < 50) {
            color = "#C9F31D"; // Good (Green)
        } else if (percent < 80) {
            color = "#FDAA35"; // Warning (Orange)
        } else {
            color = "#B52C24"; // Danger (Red)
        }

        // Animate arc
        if (borrowedRef.current !== borrowed) {
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
                        d3.select(this).text(`$${interpolator(t).toFixed(0)}`);
                    };
                });

            borrowedRef.current = borrowed;
        } else {
            foreground
                .transition()
                .duration(0)
                .attrTween("d", arcTween((percent / 100) * arcSpan - arcSpan / 2) as any);
        
            textValue
                .text(`$${(borrowed || 0).toFixed(0)}`);
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
      
      
      
    // Format USD values
    const formatUSD = (value: number) => {
        if (value >= 1000000) {
            return `$${(value / 1000000)?.toFixed(2)}M`;
        } else if (value >= 1000) {
            return `$${(value / 1000)?.toFixed(2)}K`;
        } else {
            return `$${value?.toFixed(2)}`;
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full h-full glass-container rounded-2xl border border-white/10 p-6 flex flex-col justify-between"
        >
            <div className="flex flex-col">
                <div className="text-white text-xl font-medium mb-2">Supply Borrow Factor</div>
                
                <div className="h-[225px] w-full flex flex-col justify-center items-center">
                    <svg ref={svgRef} className="max-w-[225px] max-h-[225px]"></svg>
                    
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-sm text-text-secondary mt-2 text-center"
                    >
                        {usagePercent >= 80 ? (
                            <span className="text-[#B52C24]">High utilization - consider repaying some</span>
                        ) : usagePercent >= 50 ? (
                            <span className="text-[#FDAA35]">Moderate utilization</span>
                        ) : (
                            <span className="text-[#C9F31D]">Healthy utilization</span>
                        )}
                    </motion.div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-4">
                <div className="glass-container rounded-xl p-4 flex justify-between items-center">
                    <div className="flex flex-col">
                        <div className="text-xs text-text-secondary">Borrowed</div>
                        <div className="text-white font-medium">{formatUSD(borrowValue)}</div>
                    </div>
                    <div className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                        {usagePercent}% used
                    </div>
                </div>
                
                <div className="glass-container rounded-xl p-4 flex justify-between items-center">
                    <div className="flex flex-col">
                        <div className="text-xs text-text-secondary">Borrow Limit</div>
                        <div className="text-white font-medium">{formatUSD(borrowLimit)}</div>
                    </div>
                </div>
                
                <div className="glass-container rounded-xl p-4 flex justify-between items-center">
                    <div className="flex flex-col">
                        <div className="text-xs text-text-secondary">Supplied as Collateral</div>
                        <div className="text-primary font-medium">{formatUSD(suppliedValue)}</div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}