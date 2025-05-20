import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MdShowChart, MdDateRange, MdRefresh } from 'react-icons/md';

function Profile({ data, loading, title = "Orders Over Time", onRefresh }) {
  const [timeframe, setTimeframe] = useState('weekly'); // 'daily', 'weekly', 'monthly'
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (data && data.length > 0) {
      prepareChartData();
    }
  }, [data, timeframe]);

  const prepareChartData = () => {
    if (!data || data.length === 0) return;

    let groupedData = {};
    let dateFormat;

    // Assume data has a date field and amount/value field
    data.forEach(order => {
      const orderDate = new Date(order.date);
      let timeKey;

      if (timeframe === 'daily') {
        // Format: May 15, 2025
        timeKey = orderDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        dateFormat = 'daily';
      } else if (timeframe === 'weekly') {
        // Get the week number and year
        const firstDayOfYear = new Date(orderDate.getFullYear(), 0, 1);
        const pastDaysOfYear = (orderDate - firstDayOfYear) / 86400000;
        const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
        timeKey = `Week ${weekNum}, ${orderDate.getFullYear()}`;
        dateFormat = 'weekly';
      } else if (timeframe === 'monthly') {
        // Format: May 2025
        timeKey = orderDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        dateFormat = 'monthly';
      }

      if (!groupedData[timeKey]) {
        groupedData[timeKey] = {
          name: timeKey,
          totalOrders: 0,
          totalRevenue: 0,
          averageOrderValue: 0,
          date: orderDate // Store date for sorting
        };
      }

      groupedData[timeKey].totalOrders += 1;
      groupedData[timeKey].totalRevenue += order.amount || 0;
    });

    // Calculate average order values
    Object.keys(groupedData).forEach(key => {
      const group = groupedData[key];
      group.averageOrderValue = group.totalRevenue / group.totalOrders;
    });

    // Convert to array and sort by date
    let result = Object.values(groupedData);
    result.sort((a, b) => a.date - b.date);

    // Format numbers for better display
    result = result.map(item => ({
      ...item,
      totalRevenue: Number(item.totalRevenue.toFixed(2)),
      averageOrderValue: Number(item.averageOrderValue.toFixed(2))
    }));

    setChartData(result);
  };

  const timeframeOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  const chartColors = {
    totalOrders: '#4f46e5', // indigo
    totalRevenue: '#059669', // green
    averageOrderValue: '#d97706' // amber
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
          <h2 className="text-xl font-bold text-gray-800 mb-2 sm:mb-0 flex items-center">
            <MdShowChart className="mr-2" size={24} />
            {title}
          </h2>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              {timeframeOptions.map(option => (
                <button
                  key={option.value}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    timeframe === option.value
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setTimeframe(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            
            <button 
              onClick={onRefresh}
              className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors"
              title="Refresh Data"
            >
              <MdRefresh size={20} />
            </button>
          </div>
        </div>
        
        {/* Key metrics row */}
        <div className="flex flex-wrap mt-2">
          {chartData.length > 0 && (
            <>
              <div className="mr-6 mb-2">
                <span className="text-xs text-gray-500 block">Total Orders (Period)</span>
                <span className="text-lg font-semibold text-gray-800">
                  {chartData.reduce((sum, item) => sum + item.totalOrders, 0).toLocaleString()}
                </span>
              </div>
              
              <div className="mr-6 mb-2">
                <span className="text-xs text-gray-500 block">Total Revenue (Period)</span>
                <span className="text-lg font-semibold text-gray-800">
                  ${chartData.reduce((sum, item) => sum + item.totalRevenue, 0).toLocaleString()}
                </span>
              </div>
              
              <div className="mb-2">
                <span className="text-xs text-gray-500 block">Avg Order Value (Period)</span>
                <span className="text-lg font-semibold text-gray-800">
                  ${(chartData.reduce((sum, item) => sum + item.totalRevenue, 0) / 
                    chartData.reduce((sum, item) => sum + item.totalOrders, 0)).toFixed(2)}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Chart section */}
      <div className="flex-grow p-4">
        {loading ? (
          <div className="h-64 flex justify-center items-center">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-64 flex flex-col justify-center items-center text-gray-500">
            <MdShowChart className="w-16 h-16 mb-2" />
            <p className="text-lg font-medium">No order data available</p>
            <p className="text-sm">Try changing the date range or refresh the data</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={70} 
                tick={{ fontSize: 12 }}
              />
              <YAxis yAxisId="left" orientation="left" stroke={chartColors.totalOrders} />
              <YAxis yAxisId="right" orientation="right" stroke={chartColors.totalRevenue} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', border: '1px solid #f0f0f0' }}
                formatter={(value, name) => {
                  if (name === 'totalOrders') return [value.toLocaleString(), 'Orders'];
                  if (name === 'totalRevenue') return [`$${value.toLocaleString()}`, 'Revenue'];
                  if (name === 'averageOrderValue') return [`$${value.toLocaleString()}`, 'Avg Order'];
                  return [value, name];
                }}
                labelFormatter={(label) => {
                  return <span className="font-medium">{label}</span>;
                }}
              />
              <Legend 
                verticalAlign="top"
                height={36}
                formatter={(value) => {
                  if (value === 'totalOrders') return 'Orders';
                  if (value === 'totalRevenue') return 'Revenue';
                  if (value === 'averageOrderValue') return 'Avg Order Value';
                  return value;
                }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="totalOrders"
                name="totalOrders"
                stroke={chartColors.totalOrders}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="totalRevenue"
                name="totalRevenue"
                stroke={chartColors.totalRevenue}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="averageOrderValue"
                name="averageOrderValue"
                stroke={chartColors.averageOrderValue}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                strokeDasharray="3 3"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default Profile;