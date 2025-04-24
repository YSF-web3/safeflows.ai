import { useEffect, useRef, useState } from "react"
import * as d3 from "d3";
import { motion } from "framer-motion";
import { Pools } from "./dashboard-data-access"

export default function HealthFactor ({ poolsData }: { poolsData: Pools }) {
    
    const svgRef = useRef(null);
    const width = 225;
    const borrowedRef = useRef(0);
    const [healthPercent, setHealthPercent] = useState(0);
    const [healthStatus, setHealthStatus] = useState<'good' | 'ordinary' | 'worst'>('good');
    

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
          .attr("id", "glow")
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
      
        // Create a gradient
        const gradient = defs.append("linearGradient")
          .attr("id", "gaugeGradient")
          .attr("gradientUnits", "userSpaceOnUse")
          .attr("x1", "0%")
          .attr("y1", "0%")
          .attr("x2", "100%")
          .attr("y2", "0%");
      
        gradient.append("stop")
          .attr("offset", "0%")
          .attr("stop-color", "#B52C24");
      
        gradient.append("stop")
          .attr("offset", "50%")
          .attr("stop-color", "#FDAA35");
      
        gradient.append("stop")
          .attr("offset", "100%")
          .attr("stop-color", "#C9F31D");
      
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
          .style("fill", "url(#gaugeGradient)")
          .style("filter", "url(#glow)")
          .attr("d", d => arc(d));
      
        // Add central text for percentage
        const textValue = g
            .append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "0.4em")
            .style("font-size", "60px")
            .style("fill", "#B52C24")
            .style("font-weight", "700")
            .text("0%");
      
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
      
        // Calculate health factor
        const collateral = poolsData?.pools.reduce((total, obligation) => {
            const sum = obligation.depositValueUSD;
            return total + sum;
        }, 0) || 0;

        const borrowed = poolsData?.pools.reduce((total, obligation) => {
            const sum = obligation.borrowValueUSD;
            return total + sum;
        }, 0) || 0;

        const percent = 100 - ((borrowed / collateral) * 100) || 0;
        setHealthPercent(Math.round(percent));

        // Determine health status color
        let color;
        let status: 'good' | 'ordinary' | 'worst';
        if (percent >= 70) {
          color = "#3BD32D";  // Good Health (Green)
          status = 'good';
        } else if (percent >= 40) {
          color = "#FDAA35";  // Ordinary (Orange)
          status = 'ordinary';
        } else {
          color = "#B52C24";  // Worst (Red)
          status = 'worst';
        }
        setHealthStatus(status);
      
        // Animate arc if needed
        if( borrowedRef.current !== borrowed ) {
            foreground
              .transition()
              .duration(750)
              .attrTween("d", arcTween((percent / 100) * arcSpan - arcSpan / 2) as any)
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
              .attrTween("d", arcTween((percent / 100) * arcSpan - arcSpan / 2) as any)
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
     
    // Status indicator component
    const StatusIndicator = ({ status }: { status: string }) => {
        const colors = {
            good: "#3BD32D",
            ordinary: "#FDAA35",
            worst: "#B52C24"
        };
        
        const labels = {
            good: "Good Health",
            ordinary: "Ordinary",
            worst: "Critical"
        };
        
        return (
            <div className="flex items-center gap-2">
                <motion.span 
                    className="w-[10px] h-[10px] rounded-full"
                    style={{ backgroundColor: colors[status as keyof typeof colors] }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-text-secondary text-sm">
                    {labels[status as keyof typeof labels]}
                </span>
            </div>
        );
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full h-full glass-container rounded-2xl border border-white/10 p-6"
        >
            <div className="flex flex-col h-full">
                <div className="text-white text-xl font-medium mb-2">Health Factor</div>
                
                <div className="flex-grow flex flex-col items-center justify-center">
                    <div className="h-[225px] w-full flex flex-col justify-center items-center">
                        <svg ref={svgRef} className="max-w-[225px] max-h-[225px]"></svg>
                    </div>
                    
                    <div className={`text-sm font-medium mt-2 ${
                        healthStatus === 'good' ? 'text-[#3BD32D]' : 
                        healthStatus === 'ordinary' ? 'text-[#FDAA35]' : 
                        'text-[#B52C24]'
                    }`}>
                        {healthStatus === 'good' ? 'Healthy Position' : 
                         healthStatus === 'ordinary' ? 'Moderate Risk' : 
                         'High Risk'}
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4 mb-2">
                    <StatusIndicator status="good" />
                    <StatusIndicator status="ordinary" />
                    <StatusIndicator status="worst" />
                </div>
                
                <div className="bg-white/5 rounded-xl p-3 text-center mt-2">
                    <div className="text-xs text-text-secondary mb-1">Current Health</div>
                    <div className="text-lg font-semibold text-white">{healthPercent}%</div>
                </div>
            </div>
        </motion.div>
    )
}