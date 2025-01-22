import { useEffect, useRef, useState } from "react"
import * as d3 from "d3";

export default function SupplyBorrowFactor() {

    const svgRef = useRef(null);
    const width = 225
    const [ data, setData ] = useState([
        {apples: 53245, oranges: 200},
        {apples: 28479, oranges: 200},
    ])

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

                // Add second line of text (label)
        const textLabel = g
            .append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "-0.3em") // Move second line below the first
            .style("font-size", "24px")
            .style("fill", "#C9F31D")  // Label color
            .style("font-weight", "400")
            .text("Completion");  // Initial label
      
        // Add first line of text (value percentage)
        const textValue = g
            .append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "1.2em") // Move the first line a bit up
            .style("font-size", "24px")
            .style("fill", "#C9F31D")  // Text color
            .style("font-weight", "400")
            .text("$0");  // Initial value
      

      
        // Animation for dynamic updates
        const interval = d3.interval(() => {
          const randomValue = Math.random() * 100; // Generate a random value between 0-100%
      
          foreground
            .transition()
            .duration(750)
            .attrTween("d", arcTween((randomValue / 100) * arcSpan - arcSpan / 2) as any); // Scale value within -135 to +135
      
          textValue.transition()
            .duration(750)
            .tween("text", () => {
                const i = d3.interpolateNumber(parseFloat(textValue.text()), randomValue * 10);
                return function (t) {
                    textValue.text(`$${Math.round(t * 10000)}`);
                };
            });
      
        }, 1500);
      
        function arcTween(newAngle: number) {
            return function (d: { endAngle: number }) {
                const interpolate = d3.interpolate(d.endAngle, newAngle);
                return function (t: number) {
                    d.endAngle = interpolate(t);
                    return arc(d);
                };
            };
        }
      
        return () => interval.stop();
    }, [width]);
      
      
      
    return (
        <div className="w-full h-full flex flex-col gap-5 justify-between border border-[#333333] rounded-md p-8 bg-[#0B0E12] bg-opacity-60">
            <div className="h-[225px] w-full flex flex-col justify-center items-center">
                <svg ref={svgRef} className="max-w-[225px] max-h-[225px]"></svg>
                <div className="text-sm font-normal text-white">Overall Borrow Limit: $14000</div>
            </div>

            <div>
                <div className="text-[19px] font-bold text-white leading-9">Supply Borrow Factor</div>
                <div className="text-[19px] font-normal text-white leading-9">Supplied as Collateral: <span className="text-[#C9F31D]">$25000</span></div>
                <div className="text-[19px] font-normal text-white leading-9">Supplied: <span className="text-[#C9F31D]">$89000</span></div>
            </div>
        </div>
    )
}