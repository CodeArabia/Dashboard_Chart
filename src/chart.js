import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Dot,
  Area,
} from 'recharts';

const Chart = ({ title, dataSource }) => {
  const [currentInterval, setCurrentInterval] = useState('day');
  const [tooltipData, setTooltipData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [total, setTotal] = useState(0);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const fetchData = () => {
      if (currentInterval === 'all') {
        const allData = getAllData(dataSource.chart);
        const allAmounts = Object.values(dataSource.amount).map((amount) => amount.total);
        const allTotal = allAmounts.reduce((total, amount) => total + amount, 0);
        const allPercentage = allAmounts.length > 0 ? (allTotal / allAmounts.length) : 0;

        setChartData(allData);
        setTotal(allTotal);
        setPercentage(allPercentage);
      } else {
        const data = dataSource.chart[currentInterval] || [];
        const amountData = dataSource.amount[currentInterval] || { total: 0, percentage: 0 };

        setChartData(data);
        setTotal(amountData.total);
        setPercentage(amountData.percentage);
      }
    };

    fetchData();
  }, [currentInterval, dataSource]);

  const handleButtonClick = (interval) => {
    setCurrentInterval(interval);
  };

  const handleAllButtonClick = () => {
    setCurrentInterval('all');
  };

  const renderChartXAxis = () => {
    switch (currentInterval) {
      case 'day':
        return (value) => new Date(value).toLocaleString('en-US', { day: 'numeric', hour: 'numeric' });
      case 'week':
        return (value) => new Date(value).toLocaleString('en-US', { weekday: 'short' });
      case 'month':
        return (value) => new Date(value).toLocaleString('en-US', { month: 'short' });
      case 'year':
        return (value) => new Date(value).getFullYear();
      default:
        return (value) => value;
    }
  };

  const handleMouseMove = (e) => {
    if (e && e.activeTooltipIndex !== undefined) {
      setTooltipData(chartData[e.activeTooltipIndex]);
    }
  };

  const handleMouseLeave = () => {
    setTooltipData(null);
  };

  const axisLabelStyles = {
    fontFamily: 'Arial, sans-serif',
    fontSize: 12,
    fill: '#555',
  };

  const getAllData = (chartData) => {
    return Object.values(chartData).flat().sort((a, b) => new Date(a.time) - new Date(b.time));
  };

  return (
    <div className="dashboard-card">
      <h2 className="card_title">{title}</h2>

      <div className="buttons-container">
        <button onClick={handleAllButtonClick}>All</button>
        <button onClick={() => handleButtonClick('day')}>Day</button>
        <button onClick={() => handleButtonClick('week')}>Week</button>
        <button onClick={() => handleButtonClick('month')}>Month</button>
        <button onClick={() => handleButtonClick('year')}>Year</button>
      </div>

      <div className="card_amount">
        <p className="card_total">Total: {total} </p>
        <div className="card_Percentage">{percentage > 0 ? `+${percentage}%` : `${percentage}%`}</div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <XAxis
              dataKey="time"
              tickFormatter={renderChartXAxis()}
              stroke="#333"
              tick={axisLabelStyles}
            />
            <YAxis stroke="#333" allowDecimals={false} tick={axisLabelStyles} />
            <CartesianGrid vertical={false} stroke="#ccc" />
            <Tooltip contentStyle={{ backgroundColor: '#f0f0f0', border: 'none' }} />
            <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="value" fill="url(#colorFill)" stroke="none" />
            <defs>
              <linearGradient id="colorFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            {tooltipData && <ReferenceLine x={tooltipData.time} stroke="rgba(0, 0, 0, 0.25)" />}
            {tooltipData && (
              <Dot cx={tooltipData.cx} cy={tooltipData.cy} r={5} fill="#8884d8" stroke="#fff" strokeWidth={2} />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;
