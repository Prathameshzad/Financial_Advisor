"use client";
import React, { useState, useEffect } from 'react';

const Widgets = () => {
  const [stockName, setStockName] = useState('INFY');
  const [widgets, setWidgets] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWidgets = async () => {
    setLoading(true);
    setWidgets(null);
    try {
      const response = await fetch("http://localhost:5000/widgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stock_name: stockName }),
      });

      if (response.ok) {
        const data = await response.json();
        setWidgets(data.widgets);
      } else {
        console.error("Error fetching widgets.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStockNameChange = (e) => {
    setStockName(e.target.value.toUpperCase());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWidgets();
  };

  useEffect(() => {
    if (widgets) {
      const scriptUrl = "https://cdn-static.trendlyne.com/static/js/webwidgets/tl-widgets.js";
  
      const cleanupOldWidgets = () => {
        const oldScript = document.querySelector(`script[src="${scriptUrl}"]`);
        if (oldScript) {
          oldScript.remove();
        }
      };
  
      const injectNewScript = () => {
        const script = document.createElement("script");
        script.src = scriptUrl;
        script.async = true;
        script.charset = "utf-8";
        script.onload = () => {
          if (window.TrendlyneWidgets?.init) {
            window.TrendlyneWidgets.init();
          }
        };
        document.body.appendChild(script);
      };
  
      // Clean up and inject
      cleanupOldWidgets();
      injectNewScript();
    }
  }, [widgets]);
  

  return (
    <div className='text-black'>
      <h1>Dashboard with Analysis</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <label>
          Stock Name:
          <input
            type="text"
            value={stockName}
            onChange={handleStockNameChange}
            placeholder="Enter stock symbol, e.g., INFY"
          />
        </label>
        <button type="submit">Load Analysis</button>
      </form>

      <p>Enter only Indian stock names like INFY, TCS, etc., with their usual symbols.</p>

      {loading && <p>Loading Analysis...</p>}

      {widgets && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h2>Stock Technicals</h2>
            <div dangerouslySetInnerHTML={{ __html: widgets.technical }} />
          </div>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h2>Stock Checklist</h2>
            <div dangerouslySetInnerHTML={{ __html: widgets.checklist }} />
          </div>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h2>QVT Score</h2>
            <div dangerouslySetInnerHTML={{ __html: widgets.qvt }} />
          </div>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h2>SWOT Analysis</h2>
            <div dangerouslySetInnerHTML={{ __html: widgets.swot }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Widgets;
