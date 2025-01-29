
import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

export const HealthFactorChart = ({ data }:any) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chart:any = useRef(null);
  
    useEffect(() => {
      if (!chartContainerRef.current || !data) return;
  
      // Create the chart
      chart.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 400,
        layout: {
          background: { color: 'transparent' },
          textColor: '#DDD',
        },
        grid: {
          vertLines: { color: 'black' },
          horzLines: { color: 'black' },
        },
        rightPriceScale: {
          borderColor: '#333',
        },
        timeScale: {
          borderColor: '#333',
          timeVisible: true,
          secondsVisible: false,
        },
      });
  
      // Create the line series
      const lineSeries = chart.current.addLineSeries({
        color: '#c9f31d',
        lineWidth: 2,
        crosshairMarkerVisible: true,
        crosshairMarkerRadius: 6,
      });
  
      // Format the data
      const currentTime = new Date();
      const chartData = data.map((value:any, index:number) => ({
        time: new Date(currentTime.getTime() + index * 60 * 60 * 1000).getTime() / 1000,
        value: value
      }));
  
      // Set the data
      lineSeries.setData(chartData);
  
      // Fit the content
      chart.current.timeScale().fitContent();
  
      // Handle resize
      const handleResize = () => {
        if (chart.current && chartContainerRef.current) {
          chart.current.applyOptions({
            width: chartContainerRef.current!.clientWidth 
          });
        }
      };
  
      window.addEventListener('resize', handleResize);
  
      return () => {
        window.removeEventListener('resize', handleResize);
        if (chart.current) {
          chart.current.remove();
        }
      };
    }, [data]);
  
    return (
      <div className="w-full h-full">
        <div ref={chartContainerRef} className="w-full h-[400px]" />
      </div>
    );
  };