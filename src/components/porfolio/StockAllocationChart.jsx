"use client"
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const StockAllocationChart = ({ portfolioData, formatCurrency }) => {
    const getStockDistributionData = () => {
        const stockMap = {};
        
        portfolioData.items.forEach(item => {
            const symbol = item.symbol;
            const invested = item.invested_value;
            
            if (!stockMap[symbol]) {
                stockMap[symbol] = 0;
            }
            stockMap[symbol] += invested;
        });

        const labels = Object.keys(stockMap);
        const data = Object.values(stockMap);
        const backgroundColors = labels.map((_, index) => 
            `hsl(${(index * 360 / labels.length)}, 70%, 50%)`
        );

        return {
            labels,
            datasets: [{
                data,
                backgroundColor: backgroundColors,
                borderWidth: 1
            }]
        };
    };

    const chartOptions = {
        plugins: {
            legend: {
                position: 'right',
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = Math.round((value / total) * 100);
                        return `${label}: ${formatCurrency(value)} (${percentage}%)`;
                    }
                }
            }
        },
        maintainAspectRatio: false
    };

    return (
        <div className="h-80">
            <Pie 
                data={getStockDistributionData()} 
                options={chartOptions} 
            />
        </div>
    );
};

export default StockAllocationChart;