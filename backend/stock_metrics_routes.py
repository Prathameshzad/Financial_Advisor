from flask import Blueprint, request, jsonify
from stock_metrics import fetch_stock_data, calculate_beta, calculate_var, calculate_volatility, calculate_cagr
import pandas as pd

stock_metrics_blueprint = Blueprint('stock_metrics', __name__)

period_to_days = {
    '1mo': 21,
    '3mo': 63,
    '6mo': 126,
    '1y': 252,
    '3y': 756,
    '5y': 1260,
}

# @stock_metrics_blueprint.route('/stock-metrics', methods=['POST'])
# def stock_metrics_route():
#     data = request.json
#     ticker = data.get('ticker')
#     period = data.get('period')

#     stock_data = fetch_stock_data(ticker, period)
#     market_data = fetch_stock_data('^BSESN' if ticker.endswith('.NS') else '^GSPC', period)

#     if stock_data is None or market_data is None:
#         return jsonify({'error': 'Failed to fetch data. Please check the ticker symbol or time frame.'}), 400

#     stock_returns = stock_data['Close'].pct_change().dropna()
#     market_returns = market_data['Close'].pct_change().dropna()

#     # Align by index and trim to equal length
#     stock_returns, market_returns = stock_returns.align(market_returns, join='inner')
#     stock_returns = stock_returns.dropna()
#     market_returns = market_returns.dropna()

#     # Ensure equal lengths
#     min_len = min(len(stock_returns), len(market_returns))
#     stock_returns = stock_returns[-min_len:]
#     market_returns = market_returns[-min_len:]

#     if stock_returns.empty or market_returns.empty:
#         return jsonify({'error': 'Not enough data available to calculate metrics. Try a different time frame.'}), 400

#     try:
#         beta = calculate_beta(stock_returns, market_returns)
#         var_95 = calculate_var(stock_returns, confidence_level=0.95)
#         var_99 = calculate_var(stock_returns, confidence_level=0.99)
#         volatility = calculate_volatility(stock_returns, period_to_days.get(period, 252))
#         cagr = calculate_cagr(stock_data, period)
#     except Exception as e:
#         return jsonify({'error': f'Error calculating metrics: {str(e)}'}), 500

#     response = {
#         'beta': beta,
#         'beta_description': f"Beta for {ticker} over {period}: {round(beta, 2)} "
#                             f"i.e., the stock is {round((1 - beta) * 100, 2) if beta < 1 else round((beta - 1) * 100, 2)}% "
#                             f"{'more' if beta > 1 else 'less'} volatile than the market.",
#         'var_95': var_95,
#         'var_99': var_99,
#         'var_description': {
#             '95': f"VaR (95%) for {ticker} is {round(var_95, 2)}, "
#                   f"expected to lose at most {round(-var_95 * 100, 2)}% over {period} with 95% confidence.",
#             '99': f"VaR (99%) for {ticker} is {round(var_99, 2)}, "
#                   f"expected to lose at most {round(-var_99 * 100, 2)}% over {period} with 99% confidence."
#         },
#         'volatility': volatility,
#         'volatility_description': f"Volatility for {ticker} over {period} is {round(volatility, 2)}",
#         'cagr': cagr,
#         'cagr_description': f"CAGR for {ticker} over {period} is {round(cagr * 100, 2)}%",
#         'stock_prices': stock_data['Close'].fillna(0).tolist(),
#         'dates': stock_data.index.strftime('%Y-%m-%d').tolist()
#     }

#     return jsonify(response)

@stock_metrics_blueprint.route('/stock-metrics', methods=['POST'])
def stock_metrics_route():
    data = request.json
    ticker = data.get('ticker')
    period = data.get('period')

    stock_data = fetch_stock_data(ticker, period)
    market_data = fetch_stock_data('^BSESN' if ticker.endswith('.NS') else '^GSPC', period)

    if stock_data is None or market_data is None:
        return jsonify({'error': 'Failed to fetch data. Please check the ticker symbol or time frame.'}), 400

    stock_returns = stock_data['Close'].pct_change().dropna()
    market_returns = market_data['Close'].pct_change().dropna()

    # Align and trim
    stock_returns, market_returns = stock_returns.align(market_returns, join='inner')
    stock_returns = stock_returns.dropna()
    market_returns = market_returns.dropna()
    min_len = min(len(stock_returns), len(market_returns))
    stock_returns = stock_returns[-min_len:]
    market_returns = market_returns[-min_len:]

    if stock_returns.empty or market_returns.empty:
        return jsonify({'error': 'Not enough data available to calculate metrics. Try a different time frame.'}), 400

    try:
        beta = calculate_beta(stock_returns, market_returns)
        var_95 = calculate_var(stock_returns, confidence_level=0.95)
        var_99 = calculate_var(stock_returns, confidence_level=0.99)
        volatility = calculate_volatility(stock_returns, period_to_days.get(period, 252))
        cagr = calculate_cagr(stock_data, period)

        # Format descriptions
        beta_desc = f"Beta of {beta:.2f} implies the stock {'is more volatile' if beta > 1 else 'is less volatile' if beta < 1 else 'moves in line'} with the market."
        var_desc = {
            '95': f"There's a 5% chance the daily return could be lower than {var_95:.2%}.",
            '99': f"There's a 1% chance the daily return could be lower than {var_99:.2%}.",
        }
        volatility_desc = f"Annualized volatility is {volatility:.2%}, indicating the riskiness of the stock."
        cagr_desc = f"The CAGR over the selected period is {cagr:.2%}, showing the compound annual growth."

        return jsonify({
            "beta_value": round(beta, 4),
            "var_values": {
                "95": round(var_95, 4),
                "99": round(var_99, 4)
            },
            "volatility_value": round(volatility, 4),
            "cagr_value": round(cagr, 4),

            "beta_description": beta_desc,
            "var_description": var_desc,
            "volatility_description": volatility_desc,
            "cagr_description": cagr_desc,
        })

    except Exception as e:
        return jsonify({'error': f'Error calculating metrics: {str(e)}'}), 500