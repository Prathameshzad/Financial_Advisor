"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Portfolio = () => {
  const [formData, setFormData] = useState({
    symbol: '',
    quantity: 1,
    purchasePrice: ''
  });
  const [portfolio, setPortfolio] = useState([]);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalValues, setTotalValues] = useState({
    investment: 0,
    currentValue: 0,
    pnl: 0
  });

  useEffect(() => {
    // Load transaction history on component mount
    fetchTransactionHistory();
  }, []);

  const fetchTransactionHistory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get_transaction_history');
      setTransactionHistory(response.data.transactions);
    } catch (err) {
      console.error('Failed to fetch transaction history:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addStock = async (e) => {
    e.preventDefault();
    
    if (!formData.symbol || !formData.purchasePrice) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/get_portfolio_data', {
        portfolio: [{
          symbol: formData.symbol,
          quantity: parseFloat(formData.quantity),
          purchasePrice: parseFloat(formData.purchasePrice)
        }]
      });

      const stockData = response.data.stocks[0];
      
      setPortfolio(prev => [stockData, ...prev]);
      
      // Update totals
      setTotalValues(prev => ({
        investment: prev.investment + stockData.investment,
        currentValue: prev.currentValue + stockData.currentValue,
        pnl: prev.pnl + stockData.pnl
      }));

      // Clear form
      setFormData({
        symbol: '',
        quantity: 1,
        purchasePrice: ''
      });

    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to add stock');
    } finally {
      setLoading(false);
    }
  };

  const removeStock = async (index) => {
    const removedStock = portfolio[index];
    
    // Add to transaction history before removing
    try {
      await axios.post('http://localhost:5000/add_transaction', {
        ...removedStock,
        action: 'removed',
        removedAt: new Date().toISOString()
      });
      
      // Refresh transaction history
      const historyResponse = await axios.get('http://localhost:5000/get_transaction_history');
      setTransactionHistory(historyResponse.data.transactions);
    } catch (err) {
      console.error('Failed to record transaction:', err);
      // Still proceed with removal even if history fails
    }
    
    setPortfolio(prev => prev.filter((_, i) => i !== index));
    
    // Update totals
    setTotalValues(prev => ({
      investment: prev.investment - removedStock.investment,
      currentValue: prev.currentValue - removedStock.currentValue,
      pnl: prev.pnl - removedStock.pnl
    }));
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const calculatePnlPercentage = (investment, pnl) => {
    return investment !== 0 ? (pnl / investment) * 100 : 0;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Portfolio Tracker</h2>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-sm"
        >
          {showHistory ? 'Hide Transaction History' : 'View Transaction History'}
        </button>
      </div>
      
      {/* Input Form */}
      {!showHistory && (
        <form onSubmit={addStock} className="mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="symbol" className="block text-gray-700 mb-1 text-sm font-medium">
                Stock Symbol *
              </label>
              <input
                type="text"
                id="symbol"
                name="symbol"
                value={formData.symbol}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="INFY.NS, AAPL"
                required
              />
            </div>
            
            <div>
              <label htmlFor="quantity" className="block text-gray-700 mb-1 text-sm font-medium">
                Quantity *
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                min="1"
                step="1"
                required
              />
            </div>
            
            <div>
              <label htmlFor="purchasePrice" className="block text-gray-700 mb-1 text-sm font-medium">
                Purchase Price (₹) *
              </label>
              <input
                type="number"
                id="purchasePrice"
                name="purchasePrice"
                value={formData.purchasePrice}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                min="0.01"
                step="0.01"
                required
              />
            </div>
            
            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Adding...' : 'Add Stock'}
              </button>
            </div>
          </div>
        </form>
      )}

      {error && (
        <div className="p-3 mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Transaction History */}
      {showHistory ? (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <h3 className="p-4 bg-gray-50 border-b border-gray-200 text-lg font-medium text-gray-800">
            Transaction History
          </h3>
          {transactionHistory.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No transactions yet</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Symbol
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Qty
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Buy Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sold At
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invested
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    P/L
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactionHistory.map((transaction, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(transaction.timestamp || transaction.removedAt)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.symbol}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {transaction.quantity}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(transaction.purchasePrice)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(transaction.currentPrice)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(transaction.investment)}
                    </td>
                    <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${
                      transaction.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(transaction.pnl)} ({transaction.pnlPercentage?.toFixed(2)}%)
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          {portfolio.length > 0 && (
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                <h3 className="text-gray-500 text-sm font-medium mb-1">Total Investment</h3>
                <p className="text-xl font-semibold">
                  {formatCurrency(totalValues.investment)}
                </p>
              </div>
              
              <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                <h3 className="text-gray-500 text-sm font-medium mb-1">Current Value</h3>
                <p className="text-xl font-semibold">
                  {formatCurrency(totalValues.currentValue)}
                </p>
              </div>
              
              <div className={`p-4 bg-white border rounded-lg shadow-sm ${
                totalValues.pnl >= 0 ? 'border-green-200 text-green-600' : 'border-red-200 text-red-600'
              }`}>
                <h3 className="text-sm font-medium mb-1">Profit/Loss</h3>
                <p className="text-xl font-semibold">
                  {formatCurrency(totalValues.pnl)} (
                  {calculatePnlPercentage(totalValues.investment, totalValues.pnl).toFixed(2)}%)
                </p>
              </div>
            </div>
          )}

          {/* Portfolio Table */}
          {portfolio.length > 0 && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Symbol
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Qty
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Buy Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invested
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      P/L
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {portfolio.map((stock, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {stock.symbol}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {stock.quantity}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(stock.purchasePrice)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(stock.currentPrice)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(stock.investment)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(stock.currentValue)}
                      </td>
                      <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${
                        stock.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(stock.pnl)} ({stock.pnlPercentage.toFixed(2)}%)
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => removeStock(index)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      <div className="mt-6 text-xs text-gray-500">
        <p>Note: Use .NS suffix for NSE stocks (e.g., INFY.NS for Infosys). Data may be delayed by 15 minutes.</p>
      </div>
    </div>
  );
};

export default Portfolio;