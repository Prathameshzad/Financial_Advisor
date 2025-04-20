from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from lib.mongodb import db
from bson.objectid import ObjectId
from model.portfolio import PortfolioItemSchema, DeletedPortfolioItemSchema
from datetime import datetime
import yfinance as yf

portfolio_blueprint = Blueprint('portfolio', __name__)

def get_current_price(symbol):
    try:
        ticker = yf.Ticker(symbol)
        todays_data = ticker.history(period='1d')
        return todays_data['Close'].iloc[-1]
    except:
        return None
    
def get_stock_data(symbol):
    try:
        ticker = yf.Ticker(symbol)
        # Get today's and yesterday's data
        data = ticker.history(period='2d')
        if len(data) < 2:
            return None, None, None
        
        current_price = data['Close'].iloc[-1]
        previous_close = data['Close'].iloc[-2]
        change = current_price - previous_close
        change_percent = (change / previous_close) * 100
        
        return current_price, change, change_percent
    except:
        return None, None, None

@portfolio_blueprint.route('/api/portfolio', methods=['POST'])
@jwt_required()
def add_portfolio_item():
    current_user = get_jwt_identity()
    data = request.get_json()
    
    try:
        # Validate input data
        item_data = {
            "user_id": current_user,
            "symbol": data.get('symbol').upper(),
            "quantity": float(data.get('quantity')),
            "purchase_price": float(data.get('purchase_price')),
            "sector": data.get('sector')
        }
        portfolio_item = PortfolioItemSchema(**item_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
    # Insert into database
    result = db['portfolio'].insert_one(portfolio_item.dict())
    
    return jsonify({
        "message": "Portfolio item added successfully",
        "id": str(result.inserted_id)
    }), 201

@portfolio_blueprint.route('/api/portfolio', methods=['GET'])
@jwt_required()

def get_portfolio():
    current_user = get_jwt_identity()
    
    portfolio_items = list(db['portfolio'].find({"user_id": current_user}))
    
    # Get current prices and calculate P&L
    portfolio_with_pnl = []
    total_today_pnl = 0
    total_previous_close_value = 0
    
    for item in portfolio_items:
        current_price, today_change, today_change_percent = get_stock_data(item['symbol'])
        if current_price is None:
            current_price = item['purchase_price']
            today_change = 0
            today_change_percent = 0
        
        item['_id'] = str(item['_id'])
        item['current_price'] = current_price
        item['invested_value'] = item['quantity'] * item['purchase_price']
        item['current_value'] = item['quantity'] * current_price
        item['pnl'] = item['current_value'] - item['invested_value']
        item['pnl_percentage'] = (item['pnl'] / item['invested_value']) * 100 if item['invested_value'] != 0 else 0
        
        # Calculate today's P&L
        previous_close_price = current_price - today_change if today_change is not None else current_price
        item['today_pnl'] = item['quantity'] * today_change if today_change is not None else 0
        item['today_pnl_percentage'] = today_change_percent if today_change_percent is not None else 0
        total_today_pnl += item['today_pnl']
        total_previous_close_value += item['quantity'] * previous_close_price
        
        portfolio_with_pnl.append(item)
    
    # Calculate totals
    totals = {
        'total_invested': sum(item['invested_value'] for item in portfolio_with_pnl),
        'total_current': sum(item['current_value'] for item in portfolio_with_pnl),
        'total_pnl': sum(item['pnl'] for item in portfolio_with_pnl),
        'total_pnl_percentage': (sum(item['pnl'] for item in portfolio_with_pnl) / 
                               sum(item['invested_value'] for item in portfolio_with_pnl) * 100 
                               if sum(item['invested_value'] for item in portfolio_with_pnl) != 0 else 0),
        'total_today_pnl': total_today_pnl,
        'total_today_pnl_percentage': (total_today_pnl / total_previous_close_value * 100 
                                      if total_previous_close_value != 0 else 0)
    }
    
    return jsonify({
        'items': portfolio_with_pnl,
        'totals': totals
    }), 200

@portfolio_blueprint.route('/api/portfolio/<item_id>', methods=['DELETE'])
@jwt_required()
def delete_portfolio_item(item_id):
    current_user = get_jwt_identity()
    
    # Find the item first
    item = db['portfolio'].find_one({
        "_id": ObjectId(item_id),
        "user_id": current_user
    })
    
    if not item:
        return jsonify({"error": "Item not found or not owned by user"}), 404
    
    # Get current price at time of deletion
    current_price = get_current_price(item['symbol'])
    if current_price is None:
        current_price = item['purchase_price']
    
    # Calculate financial metrics
    invested_value = item['quantity'] * item['purchase_price']
    current_value = item['quantity'] * current_price
    pnl = current_value - invested_value
    pnl_percentage = (pnl / invested_value) * 100 if invested_value != 0 else 0
    
    # Create deleted item record with all necessary fields
    deleted_item = {
        "user_id": item['user_id'],
        "symbol": item['symbol'],
        "quantity": item['quantity'],
        "purchase_price": item['purchase_price'],
        "sector": item['sector'],
        "current_price": current_price,
        "invested_value": invested_value,
        "current_value": current_value,
        "pnl": pnl,
        "pnl_percentage": pnl_percentage,
        "original_id": str(item['_id'])
    }
    
    # Validate and save to deleted_items collection
    try:
        validated_item = DeletedPortfolioItemSchema(**deleted_item)
        db['deleted_portfolio_items'].insert_one(validated_item.dict())
    except Exception as e:
        return jsonify({"error": f"Failed to save deleted item: {str(e)}"}), 500
    
    # Delete from active portfolio
    db['portfolio'].delete_one({"_id": ObjectId(item_id)})
    
    return jsonify({"message": "Portfolio item deleted successfully"}), 200

@portfolio_blueprint.route('/api/portfolio/transactions', methods=['GET'])
@jwt_required()
def get_deleted_items():
    current_user = get_jwt_identity()
    
    deleted_items = list(db['deleted_portfolio_items'].find(
        {"user_id": current_user}
    ))
    
    # Convert ObjectId to string
    for item in deleted_items:
        item['_id'] = str(item['_id'])
    
    return jsonify(deleted_items), 200