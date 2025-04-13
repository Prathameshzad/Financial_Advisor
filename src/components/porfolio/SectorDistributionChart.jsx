"use client"
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const SectorDistributionChart = ({ portfolioData, formatCurrency }) => {
    const getSectorDistributionData = () => {
        const sectorMap = {};
        
        portfolioData.items.forEach(item => {
            const sector = item.sector;
            const invested = item.invested_value;
            
            if (!sectorMap[sector]) {
                sectorMap[sector] = 0;
            }
            sectorMap[sector] += invested;
        });

        const labels = Object.keys(sectorMap);
        const data = Object.values(sectorMap);
        const backgroundColors = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
            '#FF9F40', '#8AC24A', '#F06292', '#7986CB', '#A1887F',
            '#90CAF9', '#CE93D8'
        ];

        return {
            labels,
            datasets: [{
                data,
                backgroundColor: backgroundColors.slice(0, labels.length),
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
                data={getSectorDistributionData()} 
                options={chartOptions} 
            />
        </div>
    );
};

export default SectorDistributionChart;