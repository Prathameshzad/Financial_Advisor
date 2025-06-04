"use client";
import { useState } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

export default function StockMetrics() {
  const [ticker, setTicker] = useState("");
  const [period, setPeriod] = useState("1y");
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState("");

  const handleFetchMetrics = async () => {
    setLoading(true);
    setError("");
    setMetrics(null);

    try {
      const response = await fetch("http://localhost:5000/stock-metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker, period }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong");
      setMetrics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const chartData = metrics
    ? [
        { metric: "Beta", value: metrics.beta_value },
        { metric: "VaR 95%", value: metrics.var_values["95"] },
        { metric: "VaR 99%", value: metrics.var_values["99"] },
        { metric: "Volatility", value: metrics.volatility_value },
        { metric: "CAGR", value: metrics.cagr_value },
      ]
    : [];

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 border rounded shadow text-black">
      <h2 className="text-2xl font-bold mb-4 text-center">Stock Metrics Visualized & Explained</h2>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Enter ticker symbol (e.g., AAPL or INFY.NS)"
          className="w-full border p-2 rounded"
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
        />
        <select
          className="w-full border p-2 rounded"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          <option value="1mo">1 Month</option>
          <option value="3mo">3 Months</option>
          <option value="6mo">6 Months</option>
          <option value="1y">1 Year</option>
          <option value="3y">3 Years</option>
          <option value="5y">5 Years</option>
        </select>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleFetchMetrics}
          disabled={loading}
        >
          {loading ? "Loading..." : "Get Metrics"}
        </button>
      </div>

      {error && <p className="mt-4 text-red-500">{error}</p>}

      {metrics && (
        <div className="mt-8">
          {/* Textual Descriptions */}
          <div className="space-y-2 mb-10">
            <h3 className="text-xl font-semibold mb-2">Textual Summary</h3>
            <p><strong>Beta:</strong> {metrics.beta_description}</p>
            <p><strong>95% VaR:</strong> {metrics.var_description["95"]}</p>
            <p><strong>99% VaR:</strong> {metrics.var_description["99"]}</p>
            <p><strong>Volatility:</strong> {metrics.volatility_description}</p>
            <p><strong>CAGR:</strong> {metrics.cagr_description}</p>
          </div>

          {/* Radar Chart */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold mb-4 text-center">Radar Chart</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <Radar name="Metric Value" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-center">Bar Chart</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="metric" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
