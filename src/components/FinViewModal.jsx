// "use client";
// import React, { useState } from 'react';
// import axios from 'axios';

// const FinViewModal = () => {
//   const [ticker, setTicker] = useState('');
//   const [financialStatements, setFinancialStatements] = useState(null);
//   const [frequency, setFrequency] = useState('annual');
//   const [error, setError] = useState('');

//   const handleFetchFinancialStatements = async () => {
//     try {
//       setError('');
//       setFinancialStatements(null);

//       const response = await axios.post('http://localhost:5000/financial-statements', {
//         ticker,
//         frequency,
//       });

//       setFinancialStatements(response.data);
//     } catch (err) {
//       console.error(err);
//       setError('Failed to fetch financial statements. Please check the ticker symbol.');
//     }
//   };

//   const renderFinancialData = (data) => {
//     if (!data || Object.keys(data).length === 0) {
//       return <p>No data available</p>;
//     }

//     const categories = Object.keys(data);
//     const timestamps = Object.keys(data[categories[0]] || {});

//     return (
//       <table className="min-w-full border-collapse border border-gray-400 ">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="border border-gray-400 px-4 py-2">Timestamp</th>
//             {categories.map((category) => (
//               <th key={category} className="border border-gray-400 px-4 py-2">
//                 {category}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {timestamps.map((timestamp) => (
//             <tr key={timestamp}>
//               <td className="border border-gray-400 px-4 py-2">{timestamp}</td>
//               {categories.map((category) => (
//                 <td key={category + timestamp} className="border border-gray-400 px-4 py-2">
//                   {data[category][timestamp] !== undefined ? data[category][timestamp].toFixed(2) : 'N/A'}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     );
//   };

//   return (
//     <div className="p-4 text-black">
//       <h1 className="text-xl font-bold mb-4">FINVIEW</h1>
//       <input
//         type="text"
//         placeholder="Enter stock ticker (e.g., RELIANCE.NS)"
//         value={ticker}
//         onChange={(e) => setTicker(e.target.value)}
//         className="border border-gray-300 p-2 mb-2 w-full"
//       />
//       <select
//         value={frequency}
//         onChange={(e) => setFrequency(e.target.value)}
//         className="border border-gray-300 p-2 mb-4 w-full"
//       >
//         <option value="annual">Annual</option>
//         <option value="quarterly">Quarterly</option>
//       </select>
//       <button
//         onClick={handleFetchFinancialStatements}
//         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
//       >
//         Fetch Financial Statements
//       </button>

//       {error && <p className="text-red-600">{error}</p>}

//       {financialStatements && (
//         <div>
//           <h2 className="text-lg font-semibold mt-4">Balance Sheet</h2>
//           {renderFinancialData(financialStatements.balance_sheet)}

//           <h2 className="text-lg font-semibold mt-4">Income Statement</h2>
//           {renderFinancialData(financialStatements.income_statement)}

//           <h2 className="text-lg font-semibold mt-4">Cash Flow Statement</h2>
//           {renderFinancialData(financialStatements.cash_flow)}
//         </div>
//       )}
//     </div>
//   );
// };

// export default FinViewModal;




"use client";
import React, { useState } from 'react';
import axios from 'axios';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

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
      <table className="min-w-full border-collapse border border-gray-400">
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

  const renderAssetCompositionChart = () => {
    if (!financialStatements?.balance_sheet) return null;

    const data = Object.entries(financialStatements.balance_sheet).map(([year, values]) => ({
      year: year.split('-')[0],
      cash: values['Cash And Cash Equivalents'] || 0,
      receivables: values['Accounts Receivable'] || 0,
      investments: values['Available For Sale Securities'] || 0,
      ppe: values['Net PPE'] || 0,
      intangible: values['Goodwill And Other Intangible Assets'] || 0
    }));

    return (
      <div className="mt-6">
        <h3 className="text-md font-semibold mb-2">Asset Composition Over Time</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="cash" stackId="1" fill="#8884d8" name="Cash" />
              <Area type="monotone" dataKey="receivables" stackId="1" fill="#82ca9d" name="Receivables" />
              <Area type="monotone" dataKey="investments" stackId="1" fill="#ffc658" name="Investments" />
              <Area type="monotone" dataKey="ppe" stackId="1" fill="#ff8042" name="PPE" />
              <Area type="monotone" dataKey="intangible" stackId="1" fill="#0088FE" name="Intangibles" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderRevenueProfitChart = () => {
    if (!financialStatements?.income_statement) return null;

    const data = Object.entries(financialStatements.income_statement).map(([year, values]) => ({
      year: year.split('-')[0],
      revenue: values['Total Revenue'] || 0,
      grossProfit: values['Gross Profit'] || 0,
      operatingIncome: values['Operating Income'] || 0,
      netIncome: values['Net Income'] || 0
    }));

    return (
      <div className="mt-6">
        <h3 className="text-md font-semibold mb-2">Revenue and Profit Trends</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue" />
              <Line type="monotone" dataKey="grossProfit" stroke="#82ca9d" name="Gross Profit" />
              <Line type="monotone" dataKey="operatingIncome" stroke="#ffc658" name="Operating Income" />
              <Line type="monotone" dataKey="netIncome" stroke="#ff8042" name="Net Income" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderCashFlowChart = () => {
    if (!financialStatements?.cash_flow) return null;

    const data = Object.entries(financialStatements.cash_flow).map(([year, values]) => ({
      year: year.split('-')[0],
      operating: values['Operating Cash Flow'] || 0,
      investing: values['Investing Cash Flow'] || 0,
      financing: values['Financing Cash Flow'] || 0,
      freeCashFlow: values['Free Cash Flow'] || 0
    }));

    return (
      <div className="mt-6">
        <h3 className="text-md font-semibold mb-2">Cash Flow Components</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="operating" fill="#8884d8" name="Operating Cash Flow" />
              <Bar dataKey="investing" fill="#82ca9d" name="Investing Cash Flow" />
              <Bar dataKey="financing" fill="#ffc658" name="Financing Cash Flow" />
              <Line type="monotone" dataKey="freeCashFlow" stroke="#ff8042" name="Free Cash Flow" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderExpenseBreakdown = () => {
    if (!financialStatements?.income_statement) return null;

    // Get the most recent year's data
    const latestYear = Object.keys(financialStatements.income_statement).pop();
    const values = financialStatements.income_statement[latestYear];

    if (!values) return null;

    const data = [
      { name: 'Cost of Revenue', value: values['Cost Of Revenue'] || 0 },
      { name: 'SG&A', value: values['Selling General And Administration'] || 0 },
      { name: 'Other Operating', value: values['Other Operating Expenses'] || 0 },
      { name: 'Interest', value: Math.abs(values['Interest Expense'] || 0) },
      { name: 'Taxes', value: values['Tax Provision'] || 0 }
    ].filter(item => item.value > 0);

    return (
      <div className="mt-6">
        <h3 className="text-md font-semibold mb-2">Expense Breakdown ({latestYear.split('-')[0]})</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => value.toFixed(2)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderLiquidityRatios = () => {
    if (!financialStatements?.balance_sheet) return null;

    const data = Object.entries(financialStatements.balance_sheet).map(([year, values]) => {
      const currentAssets = values['Current Assets'] || 0;
      const currentLiabilities = values['Current Liabilities'] || 1; // Avoid division by zero
      const cash = values['Cash And Cash Equivalents'] || 0;
      const receivables = values['Accounts Receivable'] || 0;

      return {
        year: year.split('-')[0],
        currentRatio: currentAssets / currentLiabilities,
        quickRatio: (cash + receivables) / currentLiabilities,
        cashRatio: cash / currentLiabilities
      };
    });

    return (
      <div className="mt-6">
        <h3 className="text-md font-semibold mb-2">Liquidity Ratios</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip formatter={(value) => value.toFixed(2)} />
              <Legend />
              <Line type="monotone" dataKey="currentRatio" stroke="#8884d8" name="Current Ratio" />
              <Line type="monotone" dataKey="quickRatio" stroke="#82ca9d" name="Quick Ratio" />
              <Line type="monotone" dataKey="cashRatio" stroke="#ffc658" name="Cash Ratio" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 text-black">
      <h1 className="text-xl font-bold mb-4">FINVIEW</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Enter stock ticker (e.g., RELIANCE.NS)"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          className="border border-gray-300 p-2 flex-grow"
        />
        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          className="border border-gray-300 p-2"
        >
          <option value="annual">Annual</option>
          <option value="quarterly">Quarterly</option>
        </select>
        <button
          onClick={handleFetchFinancialStatements}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Fetch Financial Statements
        </button>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      {financialStatements && (
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderAssetCompositionChart()}
            {renderRevenueProfitChart()}
            {renderCashFlowChart()}
            {renderExpenseBreakdown()}
          </div>
          
          {renderLiquidityRatios()}

          <h2 className="text-lg font-semibold mt-8">Balance Sheet</h2>
          <div className="overflow-x-auto">
            {renderFinancialData(financialStatements.balance_sheet)}
          </div>

          <h2 className="text-lg font-semibold mt-8">Income Statement</h2>
          <div className="overflow-x-auto">
            {renderFinancialData(financialStatements.income_statement)}
          </div>

          <h2 className="text-lg font-semibold mt-8">Cash Flow Statement</h2>
          <div className="overflow-x-auto">
            {renderFinancialData(financialStatements.cash_flow)}
          </div>
        </div>
      )}
    </div>
  );
};

export default FinViewModal;