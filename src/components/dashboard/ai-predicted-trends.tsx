


import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

export default function AiPredictedTrends() {

    
    const svgRef = useRef(null);

    const data = [
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
        { Date: new Date(2023, 0, 19), Close: Math.random() * 100 },
        { Date: new Date(2023, 0, 20), Close: Math.random() * 100 },
    ];
    const width = 500;
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
            .y((d) => y(d.Close));

            const svg = d3
            .select(svgRef.current)
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("width", width)
            .attr("height", height)
            .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;")
            .style("-webkit-tap-highlight-color", "transparent")
            .style("overflow", "visible")
            .on("pointerenter pointermove", pointerMoved)
            .on("pointerleave", pointerLeft)
            .on("touchstart", (event) => event.preventDefault());

            svg.selectAll("*").remove();

            svg
            .append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

            svg
            .append("g")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(d3.axisLeft(y).ticks(height / 40))
            .call((g) => g.select(".domain").remove())
            .call((g) =>
                g
                .selectAll(".tick line")
                .clone()
                .attr("x2", width - marginLeft - marginRight)
                .attr("stroke-opacity", 0.1)
            )
            .call((g) =>
                g
                .append("text")
                .attr("x", -marginLeft)
                .attr("y", 10)
                .attr("fill", "currentColor")
                .attr("text-anchor", "start")
                .text("↑ Daily Close ($)")
            );

            svg
            .append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", line);

            const tooltip = svg.append("g").style("display", "none");

            const bisect = d3.bisector<{ Date: Date; Close: number }, Date>((d) => d.Date).center;

            function pointerMoved(event: any) {
                const i = bisect(data, x.invert(d3.pointer(event)[0]));
                tooltip.style("display", null);
                tooltip.attr(
                    "transform",
                    `translate(${x(data[i].Date)},${y(data[i].Close)})`
                );

                const path = tooltip
                    .selectAll("path")
                    .data([null])
                    .join("path")
                    .attr("fill", "white")
                    .attr("stroke", "black");

                const text = tooltip
                    .selectAll("text")
                    .data([null])
                    .join("text")
                    .call((text) =>
                    text
                        .selectAll("tspan")
                        .data([
                        formatDate(data[i].Date),
                        formatValue(data[i].Close),
                        ])
                        .join("tspan")
                        .attr("x", 0)
                        .attr("y", (_, i) => `${i * 1.1}em`)
                        .attr("font-weight", (_, i) => (i ? null : "bold"))
                        .text((d) => d)
                    );

                size(text, path);
            }

            function pointerLeft() {
            tooltip.style("display", "none");
            }

            function size(text: d3.Selection<SVGTextElement, unknown, null, undefined>, path: d3.Selection<SVGPathElement, unknown, null, undefined>) {
            const { x, y, width: w, height: h } = text.node()!.getBBox();
            text.attr("transform", `translate(${-w / 2},${15 - y})`);
            path.attr(
                "d",
                `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`
            );
            }

            function formatValue(value: number) {
            return value.toLocaleString("en", {
                style: "currency",
                currency: "USD",
            });
            }

            function formatDate(date: Date) {
            return date.toLocaleString("en", {
                month: "short",
                day: "numeric",
                year: "numeric",
                timeZone: "UTC",
            });
            }
        }, [data, height, width]);
    return <svg ref={svgRef} className="w-full"></svg>;
};