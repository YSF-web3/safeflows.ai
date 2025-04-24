import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, LineStyle, MouseEventParams, Time, UTCTimestamp, LineData } from 'lightweight-charts';
import { motion } from 'framer-motion';

interface HealthFactorChartProps {
  data: number[];
}

export const HealthFactorChart = ({ data }: HealthFactorChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chart = useRef<IChartApi | null>(null);
  const lineSeries = useRef<ISeriesApi<"Line"> | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentValue, setCurrentValue] = useState<number | null>(null);
  const [highestValue, setHighestValue] = useState<number | null>(null);
  const [lowestValue, setLowestValue] = useState<number | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current || !data || data.length === 0) return;

    // Calculate statistics
    const highest = Math.max(...data);
    const lowest = Math.min(...data);
    setHighestValue(highest);
    setLowestValue(lowest);
    setCurrentValue(data[data.length - 1]);

    // Create the chart with modern styling
    chart.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 300,
      layout: {
        background: { 
          type: 'solid' as ColorType, 
          color: 'transparent' 
        },
        textColor: 'rgba(255, 255, 255, 0.7)',
        fontFamily: 'Poppins, sans-serif',
      },
      grid: {
        vertLines: {
          color: 'rgba(255, 255, 255, 0.05)',
          style: LineStyle.Dotted,
        },
        horzLines: {
          color: 'rgba(255, 255, 255, 0.05)',
          style: LineStyle.Dotted,
        },
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        timeVisible: true,
        secondsVisible: false,
        barSpacing: 12,
      },
      crosshair: {
        mode: 0,
        vertLine: {
          color: 'rgba(201, 243, 29, 0.4)',
          width: 1,
          style: LineStyle.Dashed,
          labelBackgroundColor: 'rgba(201, 243, 29, 0.8)',
        },
        horzLine: {
          color: 'rgba(201, 243, 29, 0.4)',
          width: 1,
          style: LineStyle.Dashed,
          labelBackgroundColor: 'rgba(201, 243, 29, 0.8)',
        },
      },
      handleScroll: {
        vertTouchDrag: false,
      },
    });

    // Create the line series with modern styling
    lineSeries.current = chart.current.addLineSeries({
      color: '#C9F31D',
      lineWidth: 2,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 6,
      crosshairMarkerBorderColor: '#000000',
      crosshairMarkerBackgroundColor: '#C9F31D',
      lineType: 0,
      priceLineVisible: false,
      lastValueVisible: false,
    });

    // Format and set data for the line series
    const formattedData = formatChartData(data);
    lineSeries.current.setData(formattedData);

    // Add area under the line for better visualization
    const areaSeries = chart.current.addAreaSeries({
      lineColor: 'transparent',
      topColor: 'rgba(201, 243, 29, 0.3)',
      bottomColor: 'rgba(201, 243, 29, 0.0)',
    });
    areaSeries.setData(formattedData);

    // Subscribe to crosshair move to update current value
    chart.current.subscribeCrosshairMove((param: MouseEventParams<Time>) => {
      if (param.point && lineSeries.current) {
        const seriesData = param.seriesData.get(lineSeries.current) as LineData<Time> | undefined;
        if (seriesData && 'value' in seriesData) {
          setCurrentValue(seriesData.value as number);
        }
      } else {
        setCurrentValue(data[data.length - 1]);
      }
    });

    // Fit the content
    chart.current.timeScale().fitContent();
    
    // Chart is now loaded
    setIsLoaded(true);

    // Handle resize
    const handleResize = () => {
      if (chart.current && chartContainerRef.current) {
        chart.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
        chart.current.timeScale().fitContent();
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

  // Format data for the chart
  const formatChartData = (values: number[]) => {
    const currentTime = new Date();
    return values.map((value, index) => ({
      time: (new Date(currentTime.getTime() + index * 60 * 60 * 1000).getTime() / 1000) as UTCTimestamp,
      value: value
    }));
  };

  // Get health factor status color
  const getStatusColor = (value: number | null) => {
    if (value === null) return 'text-text-secondary';
    if (value < 1.1) return 'text-red-500';
    if (value < 1.5) return 'text-yellow-500';
    return 'text-primary';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full h-full glass-container p-4 rounded-2xl border border-white/10"
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col">
            <h3 className="text-lg text-white font-medium">Health Factor</h3>
            <p className="text-text-secondary text-sm">Historical health factor values</p>
          </div>
          {currentValue !== null && (
            <div className="flex flex-col items-end">
              <div className={`text-lg font-bold ${getStatusColor(currentValue)}`}>
                {currentValue.toFixed(2)}
              </div>
              <div className="text-xs text-text-secondary">Current</div>
            </div>
          )}
        </div>
        
        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white/5 rounded-xl px-4 py-2 flex flex-col">
            <span className="text-xs text-text-secondary">Highest</span>
            <span className="text-lg text-primary font-medium">
              {highestValue !== null ? highestValue.toFixed(2) : '-'}
            </span>
          </div>
          <div className="bg-white/5 rounded-xl px-4 py-2 flex flex-col">
            <span className="text-xs text-text-secondary">Lowest</span>
            <span className="text-lg text-white font-medium">
              {lowestValue !== null ? lowestValue.toFixed(2) : '-'}
            </span>
          </div>
        </div>
        
        {/* Chart container */}
        <div className="flex-grow relative">
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          )}
          <div 
            ref={chartContainerRef} 
            className={`w-full h-[300px] ${!isLoaded ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}`} 
          />
        </div>
        
        {/* Legend */}
        <div className="flex justify-end mt-2">
          <div className="inline-flex items-center gap-2 text-xs text-text-secondary">
            <div className="h-2 w-2 rounded-full bg-primary"></div>
            Health Factor
          </div>
        </div>
      </div>
    </motion.div>
  );
};