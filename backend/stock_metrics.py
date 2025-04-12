import warnings
warnings.filterwarnings("ignore", category=FutureWarning)

import yfinance as yf
import numpy as np
from scipy.stats import norm

def fetch_stock_data(ticker, period):
    try:
        stock_data = yf.Ticker(ticker).history(period=period)
        if stock_data.empty:
            raise ValueError("No data found.")
        return stock_data
    except Exception as e:
        print(f"Error fetching {ticker}: {str(e)}")
        return None

def calculate_beta(stock_returns, market_returns):
    cov_matrix = np.cov(stock_returns, market_returns)
    beta = cov_matrix[0, 1] / cov_matrix[1, 1]
    return beta

def calculate_var(stock_returns, confidence_level=0.95):
    mean = np.mean(stock_returns)
    std = np.std(stock_returns)
    z = norm.ppf(1 - confidence_level)
    return mean + z * std

def calculate_volatility(stock_returns, days=252):
    return np.std(stock_returns) * np.sqrt(days)

def calculate_cagr(data, period):
    period_to_years = {
        '1mo': 1 / 12,
        '3mo': 3 / 12,
        '6mo': 6 / 12,
        '1y': 1,
        '3y': 3,
        '5y': 5
    }
    years = period_to_years.get(period, 1)
    start = data['Close'].iloc[0]
    end = data['Close'].iloc[-1]
    return (end / start) ** (1 / years) - 1
