"use client";
import React, { useState } from 'react';
import axios from 'axios';

const FinViewModal = () => {
  const [ticker, setTicker] = useState('');
  const [financialStatements, setFinancialStatements] = useState(null);
  const [frequency, setFrequency] = useState('annual');
  const [error, setError] = useState('');

  const handleFetchFinancialStatements = async () => {
    try {
      setError('');
      setFinancialStatements(null);

      const response = await axios.post('http://localhost:5000/financial-statements', {
        ticker,
        frequency,
      });

      setFinancialStatements(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch financial statements. Please check the ticker symbol.');
    }
  };

  const renderFinancialData = (data) => {
    if (!data || Object.keys(data).length === 0) {
      return <p>No data available</p>;
    }

    const categories = Object.keys(data);
    const timestamps = Object.keys(data[categories[0]] || {});

    return (
      <table className="min-w-full border-collapse border border-gray-400 ">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-400 px-4 py-2">Timestamp</th>
            {categories.map((category) => (
              <th key={category} className="border border-gray-400 px-4 py-2">
                {category}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timestamps.map((timestamp) => (
            <tr key={timestamp}>
              <td className="border border-gray-400 px-4 py-2">{timestamp}</td>
              {categories.map((category) => (
                <td key={category + timestamp} className="border border-gray-400 px-4 py-2">
                  {data[category][timestamp] !== undefined ? data[category][timestamp].toFixed(2) : 'N/A'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="p-4 text-black">
      <h1 className="text-xl font-bold mb-4">FINVIEW</h1>
      <input
        type="text"
        placeholder="Enter stock ticker (e.g., RELIANCE.NS)"
        value={ticker}
        onChange={(e) => setTicker(e.target.value)}
        className="border border-gray-300 p-2 mb-2 w-full"
      />
      <select
        value={frequency}
        onChange={(e) => setFrequency(e.target.value)}
        className="border border-gray-300 p-2 mb-4 w-full"
      >
        <option value="annual">Annual</option>
        <option value="quarterly">Quarterly</option>
      </select>
      <button
        onClick={handleFetchFinancialStatements}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
      >
        Fetch Financial Statements
      </button>

      {error && <p className="text-red-600">{error}</p>}

      {financialStatements && (
        <div>
          <h2 className="text-lg font-semibold mt-4">Balance Sheet</h2>
          {renderFinancialData(financialStatements.balance_sheet)}

          <h2 className="text-lg font-semibold mt-4">Income Statement</h2>
          {renderFinancialData(financialStatements.income_statement)}

          <h2 className="text-lg font-semibold mt-4">Cash Flow Statement</h2>
          {renderFinancialData(financialStatements.cash_flow)}
        </div>
      )}
    </div>
  );
};

export default FinViewModal;
