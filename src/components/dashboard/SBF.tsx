import { useEffect, useRef, useState } from "react"
import * as d3 from "d3";

export default function SupplyBorrowFactor () {

    const svgRef = useRef(null);
    const width = 200
    const [ data, setData ] = useState([
        {apples: 53245, oranges: 200},
        {apples: 28479, oranges: 200},
    ])

    useEffect(() => {
        const height = Math.min(500, width / 2);
        const outerRadius = height / 1 - 15;
        const innerRadius = outerRadius * 0.75;
        const tau = 2 * Math.PI;
    
        d3.select(svgRef.current).selectAll("*").remove();
    
        const svg = d3
            .select(svgRef.current)
            .attr("viewBox", `0 0 ${width} ${height}`);
    
        const g = svg
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);
    
        const arc = d3
            .arc<{ endAngle: number }>()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius)
            .startAngle(0);
    
        const background = g
            .append("path")
            .datum({ endAngle: tau })
            .style("fill", "#ddd")
            .attr("d", d => arc(d));
    
        const foreground = g
            .append("path")
            .datum({ endAngle: 0.127 * tau })
            .style("fill", "orange")
            .attr("d", d => arc(d));
    
        const interval = d3.interval(() => {
            foreground
            .transition()
            .duration(750)
            .attrTween("d", arcTween(Math.random() * tau));
        }, 1500);
    
        function arcTween(newAngle: number) {
            return function(d: { endAngle: number }) {
                const interpolate = d3.interpolate(d.endAngle, newAngle);
                return function(t: number) {
                    d.endAngle = interpolate(t);
                    return arc(d);
                };
            };
        }
    
        return () => interval.stop();
    }, [width]);   
     
    return (
        <div className="w-full h-full flex flex-row justify-between border rounded-md p-8">
            <div className="w-full h-full flex flex-col justify-between px-8">
                <div className="text-2xl">Supply Borrow Factor</div>
                <div className="flex-grow flex items-center justify-center">
                    <div className="text-4xl">Supplied as Collateral $25000</div>
                </div>
            </div>
            <svg ref={svgRef} className="max-w-[500px] max-h-[300px]"></svg>
        </div>
    )
}