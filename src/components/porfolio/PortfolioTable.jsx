"use client"
import React from 'react';

const PortfolioTable = ({ 
    items, 
    isLoading, 
    formatCurrency, 
    getPnlClass, 
    handleDelete 
}) => {
    if (isLoading && !items.length) {
        return (
            <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (items.length === 0) {
        return <p className="text-gray-500 py-4">No investments in your portfolio yet.</p>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Cost</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invested</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Value</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P/L ($)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P/L (%)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sector</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {items.map(item => (
                        <tr key={item._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{item.symbol}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">{item.quantity}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">{formatCurrency(item.purchase_price)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">{formatCurrency(item.current_price)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">{formatCurrency(item.invested_value)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">{formatCurrency(item.current_value)}</td>
                            <td className={`px-6 py-4 whitespace-nowrap ${getPnlClass(item.pnl)}`}>
                                {formatCurrency(item.pnl)}
                            </td>
                            <td className={`px-6 py-4 whitespace-nowrap ${getPnlClass(item.pnl)}`}>
                                {item.pnl_percentage.toFixed(2)}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">{item.sector}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <button 
                                    onClick={() => handleDelete(item._id)}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PortfolioTable;