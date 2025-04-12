from flask import Blueprint, jsonify, request
import yfinance as yf
from datetime import datetime

portfolio_blueprint = Blueprint('portfolio', __name__)

# In-memory storage for transaction history
transaction_history = []

@portfolio_blueprint.route('/get_portfolio_data', methods=['POST'])
def get_portfolio_data():
    try:
        data = request.get_json()
        portfolio = data.get('portfolio')
        
        if not portfolio or not isinstance(portfolio, list):
            return jsonify({'error': 'Portfolio data is required as an array'}), 400
        
        results = []
        
        for item in portfolio:
            symbol = item.get('symbol')
            quantity = item.get('quantity', 1)
            purchase_price = item.get('purchasePrice')
            
            if not symbol or not purchase_price:
                continue
            
            try:
                quantity = float(quantity)
                purchase_price = float(purchase_price)
                
                # Get stock data
                stock = yf.Ticker(symbol)
                current_price = stock.history(period='1d')['Close'].iloc[-1]
                
                current_value = current_price * quantity
                investment = purchase_price * quantity
                pnl = current_value - investment
                pnl_percentage = (pnl / investment) * 100 if investment != 0 else 0
                
                results.append({
                    'symbol': symbol,
                    'quantity': quantity,
                    'purchasePrice': purchase_price,
                    'currentPrice': round(current_price, 2),
                    'currentValue': round(current_value, 2),
                    'investment': round(investment, 2),
                    'pnl': round(pnl, 2),
                    'pnlPercentage': round(pnl_percentage, 2),
                    'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                })
                
            except Exception as e:
                results.append({
                    'symbol': symbol,
                    'error': str(e)
                })
        
        return jsonify({
            'stocks': results
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@portfolio_blueprint.route('/add_transaction', methods=['POST'])
def add_transaction():
    try:
        transaction = request.get_json()
        transaction['timestamp'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        transaction_history.append(transaction)
        return jsonify({'success': True}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@portfolio_blueprint.route('/get_transaction_history', methods=['GET'])
def get_transaction_history():
    return jsonify({
        'transactions': transaction_history
    }), 200