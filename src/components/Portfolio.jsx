"use client"
import React, { useState, useEffect } from 'react';
import { getAccessToken } from '../lib/auth';
import TransactionList from './TransactionList';
import SectorDistributionChart from './porfolio/SectorDistributionChart';
import StockAllocationChart from './porfolio/StockAllocationChart';
import PortfolioTable from './porfolio/PortfolioTable';

const Portfolio = () => {
    const [portfolioData, setPortfolioData] = useState({
        items: [],
        totals: {
            total_invested: 0,
            total_current: 0,
            total_pnl: 0,
            total_pnl_percentage: 0,
            total_today_pnl: 0,
            total_today_pnl_percentage: 0
        }
    });
    const [newItem, setNewItem] = useState({
        symbol: '',
        quantity: '',
        purchase_price: '',
        sector: 'Technology'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showTransactions, setShowTransactions] = useState(false);

    const sectors = [
        'Technology',
        'Healthcare',
        'Financials',
        'Consumer Discretionary',
        'Communication Services',
        'Industrials',
        'Consumer Staples',
        'Energy',
        'Utilities',
        'Real Estate',
        'Materials',
        'Other'
    ];

    const fetchPortfolio = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/portfolio', {
                headers: {
                    'Authorization': `Bearer ${getAccessToken()}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch portfolio');
            const data = await response.json();
            setPortfolioData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPortfolio();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewItem(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await fetch('http://localhost:5000/api/portfolio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAccessToken()}`
                },
                body: JSON.stringify(newItem)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add item');
            }
            
            setNewItem({
                symbol: '',
                quantity: '',
                purchase_price: '',
                sector: 'Technology'
            });
            await fetchPortfolio();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (itemId) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        
        try {
            const response = await fetch(`http://localhost:5000/api/portfolio/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getAccessToken()}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to delete item');
            await fetchPortfolio();
        } catch (err) {
            setError(err.message);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'IND'
        }).format(value);
    };

    const getPnlClass = (value) => {
        return value >= 0 ? 'text-green-600' : 'text-red-600';
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">My Investment Portfolio</h1>
                <button 
                    onClick={() => setShowTransactions(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    View Transactions
                </button>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Sector Distribution</h2>
                    <SectorDistributionChart 
                        portfolioData={portfolioData} 
                        formatCurrency={formatCurrency} 
                    />
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Stock Allocation</h2>
                    <StockAllocationChart 
                        portfolioData={portfolioData} 
                        formatCurrency={formatCurrency} 
                    />
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium mb-1">Total Invested</h3>
                    <p className="text-2xl font-semibold text-gray-800">
                        {formatCurrency(portfolioData.totals.total_invested)}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium mb-1">Current Value</h3>
                    <p className="text-2xl font-semibold text-gray-800">
                        {formatCurrency(portfolioData.totals.total_current)}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium mb-1">Profit/Loss</h3>
                    <p className={`text-2xl font-semibold ${getPnlClass(portfolioData.totals.total_pnl)}`}>
                        {formatCurrency(portfolioData.totals.total_pnl)} ({portfolioData.totals.total_pnl_percentage.toFixed(2)}%)
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium mb-1">Today's Change</h3>
                    <p className={`text-2xl font-semibold ${getPnlClass(portfolioData.totals.total_today_pnl)}`}>
                        {formatCurrency(portfolioData.totals.total_today_pnl)} ({portfolioData.totals.total_today_pnl_percentage.toFixed(2)}%)
                    </p>
                </div>
            </div>
            
            {/* Add New Investment Form */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Investment</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Symbol</label>
                            <input
                                type="text"
                                name="symbol"
                                value={newItem.symbol}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g. AAPL"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                            <input
                                type="number"
                                name="quantity"
                                value={newItem.quantity}
                                onChange={handleInputChange}
                                step="0.01"
                                min="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price</label>
                            <input
                                type="number"
                                name="purchase_price"
                                value={newItem.purchase_price}
                                onChange={handleInputChange}
                                step="0.01"
                                min="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
                            <select
                                name="sector"
                                value={newItem.sector}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                {sectors.map(sector => (
                                    <option key={sector} value={sector}>{sector}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`px-4 py-2 rounded-md text-white ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} transition-colors`}
                    >
                        {isLoading ? 'Adding...' : 'Add to Portfolio'}
                    </button>
                </form>
                {error && (
                    <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}
            </div>
            
            {/* Portfolio Table */}
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Investments</h2>
                <PortfolioTable
                    items={portfolioData.items}
                    isLoading={isLoading}
                    formatCurrency={formatCurrency}
                    getPnlClass={getPnlClass}
                    handleDelete={handleDelete}
                />
            </div>
            
            {showTransactions && (
                <TransactionList onClose={() => setShowTransactions(false)} />
            )}
        </div>
    );
};

export default Portfolio;