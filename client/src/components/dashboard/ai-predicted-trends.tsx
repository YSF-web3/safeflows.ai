import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const predictionsMock = {


        "So11111111111111111111111111111111111111112": {
            "predictedPriceUsd": 230.8,
            "predictedTrend": [
                {
                    "price": 231,
                    "timestamp": "2025-01-29T12:10:57.526Z"
                },
                {
                    "price": 230,
                    "timestamp": "2025-01-29T13:10:57.526Z"
                },
                {
                    "price": 230,
                    "timestamp": "2025-01-29T14:10:57.526Z"
                },
                {
                    "price": 229,
                    "timestamp": "2025-01-29T15:10:57.526Z"
                },
                {
                    "price": 228,
                    "timestamp": "2025-01-29T16:10:57.526Z"
                },
                {
                    "price": 227,
                    "timestamp": "2025-01-29T17:10:57.526Z"
                },
                {
                    "price": 227,
                    "timestamp": "2025-01-29T18:10:57.526Z"
                },
                {
                    "price": 226,
                    "timestamp": "2025-01-29T19:10:57.526Z"
                },
                {
                    "price": 225,
                    "timestamp": "2025-01-29T20:10:57.526Z"
                },
                {
                    "price": 224,
                    "timestamp": "2025-01-29T21:10:57.526Z"
                },
                {
                    "price": 224,
                    "timestamp": "2025-01-29T22:10:57.526Z"
                },
                {
                    "price": 223,
                    "timestamp": "2025-01-29T23:10:57.526Z"
                },
                {
                    "price": 222,
                    "timestamp": "2025-01-30T00:10:57.526Z"
                },
                {
                    "price": 221,
                    "timestamp": "2025-01-30T01:10:57.526Z"
                },
                {
                    "price": 221,
                    "timestamp": "2025-01-30T02:10:57.526Z"
                },
                {
                    "price": 220,
                    "timestamp": "2025-01-30T03:10:57.526Z"
                },
                {
                    "price": 219,
                    "timestamp": "2025-01-30T04:10:57.526Z"
                },
                {
                    "price": 218,
                    "timestamp": "2025-01-30T05:10:57.526Z"
                },
                {
                    "price": 218,
                    "timestamp": "2025-01-30T06:10:57.526Z"
                },
                {
                    "price": 217,
                    "timestamp": "2025-01-30T07:10:57.526Z"
                },
                {
                    "price": 216,
                    "timestamp": "2025-01-30T08:10:57.526Z"
                },
                {
                    "price": 215,
                    "timestamp": "2025-01-30T09:10:57.526Z"
                },
                {
                    "price": 215,
                    "timestamp": "2025-01-30T10:10:57.526Z"
                },
                {
                    "price": 214,
                    "timestamp": "2025-01-30T11:10:57.526Z"
                },
                {
                    "price": 213,
                    "timestamp": "2025-01-30T12:10:57.526Z"
                },
                {
                    "price": 212,
                    "timestamp": "2025-01-30T13:10:57.526Z"
                },
                {
                    "price": 212,
                    "timestamp": "2025-01-30T14:10:57.526Z"
                },
                {
                    "price": 211,
                    "timestamp": "2025-01-30T15:10:57.526Z"
                },
                {
                    "price": 210,
                    "timestamp": "2025-01-30T16:10:57.526Z"
                },
                {
                    "price": 209,
                    "timestamp": "2025-01-30T17:10:57.526Z"
                },
                {
                    "price": 209,
                    "timestamp": "2025-01-30T18:10:57.526Z"
                },
                {
                    "price": 208,
                    "timestamp": "2025-01-30T19:10:57.526Z"
                },
                {
                    "price": 207,
                    "timestamp": "2025-01-30T20:10:57.526Z"
                },
                {
                    "price": 206,
                    "timestamp": "2025-01-30T21:10:57.526Z"
                },
                {
                    "price": 206,
                    "timestamp": "2025-01-30T22:10:57.526Z"
                },
                {
                    "price": 205,
                    "timestamp": "2025-01-30T23:10:57.526Z"
                },
                {
                    "price": 204,
                    "timestamp": "2025-01-31T00:10:57.526Z"
                },
                {
                    "price": 203,
                    "timestamp": "2025-01-31T01:10:57.526Z"
                },
                {
                    "price": 203,
                    "timestamp": "2025-01-31T02:10:57.526Z"
                },
                {
                    "price": 202,
                    "timestamp": "2025-01-31T03:10:57.526Z"
                },
                {
                    "price": 201,
                    "timestamp": "2025-01-31T04:10:57.526Z"
                },
                {
                    "price": 200,
                    "timestamp": "2025-01-31T05:10:57.526Z"
                },
                {
                    "price": 200,
                    "timestamp": "2025-01-31T06:10:57.526Z"
                },
                {
                    "price": 199,
                    "timestamp": "2025-01-31T07:10:57.526Z"
                },
                {
                    "price": 198,
                    "timestamp": "2025-01-31T08:10:57.526Z"
                },
                {
                    "price": 197,
                    "timestamp": "2025-01-31T09:10:57.526Z"
                },
                {
                    "price": 197,
                    "timestamp": "2025-01-31T10:10:57.526Z"
                },
                {
                    "price": 196,
                    "timestamp": "2025-01-31T11:10:57.526Z"
                },
                {
                    "price": 195,
                    "timestamp": "2025-01-31T12:10:57.526Z"
                },
                {
                    "price": 194,
                    "timestamp": "2025-01-31T13:10:57.526Z"
                },
                {
                    "price": 194,
                    "timestamp": "2025-01-31T14:10:57.526Z"
                },
                {
                    "price": 193,
                    "timestamp": "2025-01-31T15:10:57.526Z"
                },
                {
                    "price": 192,
                    "timestamp": "2025-01-31T16:10:57.526Z"
                },
                {
                    "price": 191,
                    "timestamp": "2025-01-31T17:10:57.526Z"
                },
                {
                    "price": 191,
                    "timestamp": "2025-01-31T18:10:57.526Z"
                },
                {
                    "price": 190,
                    "timestamp": "2025-01-31T19:10:57.526Z"
                },
                {
                    "price": 189,
                    "timestamp": "2025-01-31T20:10:57.526Z"
                },
                {
                    "price": 188,
                    "timestamp": "2025-01-31T21:10:57.526Z"
                },
                {
                    "price": 188,
                    "timestamp": "2025-01-31T22:10:57.526Z"
                },
                {
                    "price": 187,
                    "timestamp": "2025-01-31T23:10:57.526Z"
                },
                {
                    "price": 186,
                    "timestamp": "2025-02-01T00:10:57.526Z"
                },
                {
                    "price": 185,
                    "timestamp": "2025-02-01T01:10:57.526Z"
                },
                {
                    "price": 185,
                    "timestamp": "2025-02-01T02:10:57.526Z"
                },
                {
                    "price": 184,
                    "timestamp": "2025-02-01T03:10:57.526Z"
                },
                {
                    "price": 183,
                    "timestamp": "2025-02-01T04:10:57.526Z"
                },
                {
                    "price": 182,
                    "timestamp": "2025-02-01T05:10:57.526Z"
                },
                {
                    "price": 182,
                    "timestamp": "2025-02-01T06:10:57.526Z"
                },
                {
                    "price": 181,
                    "timestamp": "2025-02-01T07:10:57.526Z"
                },
                {
                    "price": 180,
                    "timestamp": "2025-02-01T08:10:57.526Z"
                },
                {
                    "price": 179,
                    "timestamp": "2025-02-01T09:10:57.526Z"
                },
                {
                    "price": 179,
                    "timestamp": "2025-02-01T10:10:57.526Z"
                },
                {
                    "price": 178,
                    "timestamp": "2025-02-01T11:10:57.526Z"
                }
            ],
            "lastCalculated": "2025-01-29T12:10:57.526Z"
        },
        "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v": {
            "predictedPriceUsd": 1.00041,
            "predictedTrend": [
                {
                    "price": 1.0004,
                    "timestamp": "2025-01-29T12:11:19.270Z"
                },
                {
                    "price": 1.00039,
                    "timestamp": "2025-01-29T13:11:19.270Z"
                },
                {
                    "price": 1.00038,
                    "timestamp": "2025-01-29T14:11:19.270Z"
                },
                {
                    "price": 1.00037,
                    "timestamp": "2025-01-29T15:11:19.270Z"
                },
                {
                    "price": 1.00036,
                    "timestamp": "2025-01-29T16:11:19.270Z"
                },
                {
                    "price": 1.00035,
                    "timestamp": "2025-01-29T17:11:19.270Z"
                },
                {
                    "price": 1.00034,
                    "timestamp": "2025-01-29T18:11:19.270Z"
                },
                {
                    "price": 1.00033,
                    "timestamp": "2025-01-29T19:11:19.270Z"
                },
                {
                    "price": 1.00032,
                    "timestamp": "2025-01-29T20:11:19.270Z"
                },
                {
                    "price": 1.00031,
                    "timestamp": "2025-01-29T21:11:19.270Z"
                },
                {
                    "price": 1.0003,
                    "timestamp": "2025-01-29T22:11:19.270Z"
                },
                {
                    "price": 1.00029,
                    "timestamp": "2025-01-29T23:11:19.270Z"
                },
                {
                    "price": 1.00028,
                    "timestamp": "2025-01-30T00:11:19.270Z"
                },
                {
                    "price": 1.00027,
                    "timestamp": "2025-01-30T01:11:19.270Z"
                },
                {
                    "price": 1.00026,
                    "timestamp": "2025-01-30T02:11:19.270Z"
                },
                {
                    "price": 1.00025,
                    "timestamp": "2025-01-30T03:11:19.270Z"
                },
                {
                    "price": 1.00024,
                    "timestamp": "2025-01-30T04:11:19.270Z"
                },
                {
                    "price": 1.00023,
                    "timestamp": "2025-01-30T05:11:19.270Z"
                },
                {
                    "price": 1.00022,
                    "timestamp": "2025-01-30T06:11:19.270Z"
                },
                {
                    "price": 1.00021,
                    "timestamp": "2025-01-30T07:11:19.270Z"
                },
                {
                    "price": 1.0002,
                    "timestamp": "2025-01-30T08:11:19.270Z"
                },
                {
                    "price": 1.00019,
                    "timestamp": "2025-01-30T09:11:19.270Z"
                },
                {
                    "price": 1.00018,
                    "timestamp": "2025-01-30T10:11:19.270Z"
                },
                {
                    "price": 1.00017,
                    "timestamp": "2025-01-30T11:11:19.270Z"
                },
                {
                    "price": 1.00016,
                    "timestamp": "2025-01-30T12:11:19.270Z"
                },
                {
                    "price": 1.00015,
                    "timestamp": "2025-01-30T13:11:19.270Z"
                },
                {
                    "price": 1.00014,
                    "timestamp": "2025-01-30T14:11:19.270Z"
                },
                {
                    "price": 1.00013,
                    "timestamp": "2025-01-30T15:11:19.270Z"
                },
                {
                    "price": 1.00012,
                    "timestamp": "2025-01-30T16:11:19.270Z"
                },
                {
                    "price": 1.00011,
                    "timestamp": "2025-01-30T17:11:19.270Z"
                },
                {
                    "price": 1.0001,
                    "timestamp": "2025-01-30T18:11:19.270Z"
                },
                {
                    "price": 1.00009,
                    "timestamp": "2025-01-30T19:11:19.270Z"
                },
                {
                    "price": 1.00008,
                    "timestamp": "2025-01-30T20:11:19.270Z"
                },
                {
                    "price": 1.00007,
                    "timestamp": "2025-01-30T21:11:19.270Z"
                },
                {
                    "price": 1.00006,
                    "timestamp": "2025-01-30T22:11:19.270Z"
                },
                {
                    "price": 1.00005,
                    "timestamp": "2025-01-30T23:11:19.270Z"
                },
                {
                    "price": 1.00004,
                    "timestamp": "2025-01-31T00:11:19.270Z"
                },
                {
                    "price": 1.00003,
                    "timestamp": "2025-01-31T01:11:19.270Z"
                },
                {
                    "price": 1.00002,
                    "timestamp": "2025-01-31T02:11:19.270Z"
                },
                {
                    "price": 1.00001,
                    "timestamp": "2025-01-31T03:11:19.270Z"
                },
                {
                    "price": 1,
                    "timestamp": "2025-01-31T04:11:19.270Z"
                },
                {
                    "price": 0.99999,
                    "timestamp": "2025-01-31T05:11:19.270Z"
                },
                {
                    "price": 0.99998,
                    "timestamp": "2025-01-31T06:11:19.270Z"
                },
                {
                    "price": 0.99997,
                    "timestamp": "2025-01-31T07:11:19.270Z"
                },
                {
                    "price": 0.99996,
                    "timestamp": "2025-01-31T08:11:19.270Z"
                },
                {
                    "price": 0.99995,
                    "timestamp": "2025-01-31T09:11:19.270Z"
                },
                {
                    "price": 0.99994,
                    "timestamp": "2025-01-31T10:11:19.270Z"
                },
                {
                    "price": 0.99993,
                    "timestamp": "2025-01-31T11:11:19.270Z"
                },
                {
                    "price": 0.99992,
                    "timestamp": "2025-01-31T12:11:19.270Z"
                },
                {
                    "price": 0.99991,
                    "timestamp": "2025-01-31T13:11:19.270Z"
                },
                {
                    "price": 0.9999,
                    "timestamp": "2025-01-31T14:11:19.270Z"
                },
                {
                    "price": 0.99989,
                    "timestamp": "2025-01-31T15:11:19.270Z"
                },
                {
                    "price": 0.99988,
                    "timestamp": "2025-01-31T16:11:19.270Z"
                },
                {
                    "price": 0.99987,
                    "timestamp": "2025-01-31T17:11:19.270Z"
                },
                {
                    "price": 0.99986,
                    "timestamp": "2025-01-31T18:11:19.270Z"
                },
                {
                    "price": 0.99985,
                    "timestamp": "2025-01-31T19:11:19.270Z"
                },
                {
                    "price": 0.99984,
                    "timestamp": "2025-01-31T20:11:19.270Z"
                },
                {
                    "price": 0.99983,
                    "timestamp": "2025-01-31T21:11:19.270Z"
                },
                {
                    "price": 0.99982,
                    "timestamp": "2025-01-31T22:11:19.270Z"
                },
                {
                    "price": 0.99981,
                    "timestamp": "2025-01-31T23:11:19.270Z"
                },
                {
                    "price": 0.9998,
                    "timestamp": "2025-02-01T00:11:19.270Z"
                },
                {
                    "price": 0.99979,
                    "timestamp": "2025-02-01T01:11:19.270Z"
                },
                {
                    "price": 0.99978,
                    "timestamp": "2025-02-01T02:11:19.270Z"
                },
                {
                    "price": 0.99977,
                    "timestamp": "2025-02-01T03:11:19.270Z"
                },
                {
                    "price": 0.99976,
                    "timestamp": "2025-02-01T04:11:19.270Z"
                },
                {
                    "price": 0.99975,
                    "timestamp": "2025-02-01T05:11:19.270Z"
                },
                {
                    "price": 0.99974,
                    "timestamp": "2025-02-01T06:11:19.270Z"
                },
                {
                    "price": 0.99973,
                    "timestamp": "2025-02-01T07:11:19.270Z"
                }
            ],
            "lastCalculated": "2025-01-29T12:11:19.270Z"
        }
    
};

export default function AiPredictedTrends() {
  const svgRef = useRef(null);
  const width = 800;
  const height = 400;

  const [dataSets, setDataSets] = useState<any[]>([]);

  useEffect(() => {
    // Process predictionsMock into a list of datasets for each line
    const processedData = Object.entries(predictionsMock).map(
      ([key, value]) => ({
        id: key,
        data: value.predictedTrend.map((trend) => ({
          Date: new Date(trend.timestamp), // Convert timestamp to Date
          Close: trend.price, // Price of the trend
        })),
      })
    );
    setDataSets(processedData);
  }, []);

  useEffect(() => {
    if (dataSets.length > 0) {
      renderChart2(dataSets);
    }
  }, [dataSets]);

  const renderChart = (dataSets: any[]) => {
    const marginTop = 20;
    const marginRight = 30;
    const marginBottom = 30;
    const marginLeft = 40;

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", width)
      .attr("height", height);

    svg.selectAll("*").remove(); // Clear previous render

    // Combine all data for scaling
    const allData = dataSets.flatMap((d) => d.data);

    // Define scales
    const x = d3
      .scaleUtc()
      .domain(d3.extent(allData, (d: any) => d.Date) as [Date, Date])
      .range([marginLeft, width - marginRight]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(allData, (d: any) => d.Close) || 0])
      .nice()
      .range([height - marginBottom, marginTop]);

    // Axes
    svg
      .append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).ticks(width / 80))
      .call((g) => g.select(".domain").remove());

    svg
      .append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y))
      .call((g) => g.select(".domain").remove());

    // Line generator
    const lineGenerator = d3
      .line<{ Date: Date; Close: number }>()
      .x((d) => x(d.Date))
      .y((d) => y(d.Close))
      .curve(d3.curveMonotoneX);

    // Add lines
    const colors = d3.schemeCategory10; // Use a color palette
    dataSets.forEach((dataSet, index) => {
      svg
        .append("path")
        .datum(dataSet.data)
        .attr("fill", "none")
        .attr("stroke", colors[index % colors.length])
        .attr("stroke-width", 2)
        .attr("d", lineGenerator);
    });

    // Add legend
    const legend = svg
      .append("g")
      .attr("transform", `translate(${width - 150},${marginTop})`);

    dataSets.forEach((dataSet, index) => {
      const legendRow = legend
        .append("g")
        .attr("transform", `translate(0, ${index * 20})`);

      legendRow
        .append("circle")
        .attr("cx", 0)
        .style("color", "white")
        .attr("cy", 0)
        .attr("r", 5)
        .attr("fill", colors[index % colors.length]);

      legendRow
        .append("text")
        .attr("x", 10)
        .attr("y", 5)
        .text(dataSet.id)
                .attr("alignment-baseline", "middle");
    });
  };

  const renderChart2 = (dataSets: any[]) => {
    const marginTop = 20;
    const marginRight = 30;
    const marginBottom = 30;
    const marginLeft = 40;
  
    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", width)
      .attr("height", height);
  
    svg.selectAll("*").remove(); // Clear previous render
  
    // Combine all data for scaling
    const allData = dataSets.flatMap((d) => d.data);
  
    // Define scales
    const x = d3
      .scaleUtc()
      .domain(d3.extent(allData, (d: any) => d.Date) as [Date, Date])
      .range([marginLeft, width - marginRight]);
  
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(allData, (d: any) => d.Close) || 0])
      .nice()
      .range([height - marginBottom, marginTop]);
  
    // Axes
    svg
      .append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).ticks(width / 80))
      .call((g) => g.select(".domain").remove());
  
    svg
      .append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y))
      .call((g) => g.select(".domain").remove());
  
    // Line generator
    const lineGenerator = d3
      .line<{ Date: Date; Close: number }>()
      .x((d) => x(d.Date))
      .y((d) => y(d.Close))
      .curve(d3.curveMonotoneX);
  
    // Area generator for gradient
    const areaGenerator = d3
      .area<{ Date: Date; Close: number }>()
      .x((d) => x(d.Date))
      .y0(height - marginBottom) // Bottom of the chart
      .y1((d) => y(d.Close))
      .curve(d3.curveMonotoneX);
  
    // Add gradient definition
    const defs = svg.append("defs");
    const gradient = defs
      .append("linearGradient")
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
  
    // Add lines and areas for each dataset
    const colors = ["##c9f31d", "#7fde2e", "#00c640","#00ad50"]; // Use a color palette
    dataSets.forEach((dataSet, index) => {
      // Area chart with gradient
      svg
        .append("path")
        .datum(dataSet.data)
        .attr("fill", "url(#area-gradient)")
        .attr("d", areaGenerator);
  
      // Line chart
      svg
        .append("path")
        .datum(dataSet.data)
        .attr("fill", "none")
        .attr("stroke", colors[index % colors.length])
        .attr("stroke-width", 2)
        .attr("d", lineGenerator);
    });
  
    // Add legend
    const legend = svg
      .append("g")
      .attr("transform", `translate(${width - 150},${marginTop})`);
  
    // dataSets.forEach((dataSet, index) => {
    //   const legendRow = legend
    //     .append("g")
    //     .attr("transform", `translate(0, ${index * 20})`);
  
    //   legendRow
    //     .append("circle")
    //     .attr("cx", 0)
    //     .style("color", "white")
    //     .attr("cy", 0)
    //     .attr("r", 5)
    //     .attr("fill", colors[index % colors.length]);
  
    //   legendRow
    //     .append("text")
    //     .attr("x", 10)
    //     .attr("y", 5)
    //     .text(dataSet.id)
    //     .attr("alignment-baseline", "middle");
    // });
  
    // Tooltip setup (same logic as renderChart)
    const tooltip = svg.append("g").style("display", "none");
    const bisect = d3
      .bisector<{ Date: Date; Close: number }, Date>((d) => d.Date)
      .center;
  
    const dot = svg
      .append("g") // Create a group to hold both circles
      .style("pointer-events", "none") // Avoid interaction
      .style("opacity", 0); // Initially hide the dot
  
    // Create the outer dot (green circle)
    dot.append("circle")
      .attr("r", 10) // Outer circle radius
      .attr("fill", "#C9F31D"); // Green color for the outer circle
  
    // Create the inner dot (black circle)
    dot.append("circle")
      .attr("r", 4) // Inner circle radius (smaller than outer circle)
      .attr("fill", "black"); // Black color for the inner circle
  
    function pointerMoved(event: any) {
      const i = bisect(dataSets[0].data, x.invert(d3.pointer(event)[0]));
      tooltip.style("display", null);
      tooltip.attr(
        "transform",
        `translate(${x(dataSets[0].data[i].Date)},${y(dataSets[0].data[i].Close)})`
      );
  
      // Update dot position
      dot
        .attr("transform", `translate(${x(dataSets[0].data[i].Date)}, ${y(dataSets[0].data[i].Close)})`)
        .style("opacity", 1); // Show the dot
  
      // Tooltip background and content (same logic as renderChart)
      const padding = 6;
      const textWidth = 150;
      const textHeight = 40;
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
        .attr("rx", 5)
        .attr("ry", 5);
  
    //   tooltip
    //     .selectAll("circle")
    //     .data([null, null])
    //     .join("circle")
    //     .attr("cx", -textWidth / 2 + 20)
    //     .attr("cy", (_, i) => i * 20 - 10 + marginTop)
    //     .attr("r", 4)
    //     .attr("fill", (_, i) => colors[i]);
  
    //   tooltip
    //     .selectAll("text")
    //     .data([null, null])
    //     .join("text")
    //     .attr("x", 100)
    //     .attr("y", (_, i) => i * 20 - 8 + marginTop)
    //     // .attr("font-weight", (_, i) => (i ? null : "bold"))
    //     .attr("font-size", (_, i) => (i ? 10 : 16))
    //     .attr("fill", (_, i) => (i ? "#81818A" : "white"))
    //     .call((text) =>
    //       text
    //         .selectAll("tspan")
    //         .data([`${}`, "100"])
    //         .join("tspan")
    //         .attr("x", -20)
    //         .text((d) => d)
    //     );
    }
  
    function pointerLeft() {
      tooltip.style("display", "none");
      dot.style("opacity", 0); // Hide dot on pointer leave
    }
  
    svg.on("pointerenter pointermove", pointerMoved).on("pointerleave", pointerLeft);
  };
  
  return (
    <div className="w-full h-full border text-white border-[#333333] rounded-[15px] bg-[#1C252F9E] flex flex-col justify-between gap-3 pt-[18px] pb-6 px-[22px]">
    <div className="flex flex-col lg:flex-row gap-2 justify-between items-center w-full">
        <div className="text-base font-semibold text-white lg:pl-8 w-full text-left">AI Predicted Trends</div>
        <div className="w-full flex gap-2 justify-end">
            <button className="h-7 border border-[#8081954D] px-2 rounded-md text-[10px] font-normal leading-4 text-[#C2C2C2]">1D</button>
            <button className="h-7 border border-[#8081954D] px-2 rounded-md text-[10px] font-normal leading-4 text-[#C2C2C2]">1M</button>
            <button className="h-7 border border-[#8081954D] px-2 rounded-md text-[10px] font-normal leading-4 text-[#C2C2C2]">6M</button>
            <button className="h-7 border border-[#8081954D] px-2 rounded-md text-[10px] font-normal leading-4 text-[#C2C2C2]">1Y</button>
            <button className="h-7 border border-[#8081954D] px-2 rounded-md text-[10px] font-normal leading-4 text-[#C2C2C2]">YYD</button>
            <button className="h-7 border border-[#8081954D] px-2 rounded-md text-[10px] font-normal leading-4 text-black bg-[#C9F31D]">All</button>
        </div>
    </div>

    <svg ref={svgRef} className="w-full"></svg>
</div>
  );
}
