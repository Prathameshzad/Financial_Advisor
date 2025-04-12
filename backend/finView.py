import yfinance as yf
import pandas as pd
from flask import Blueprint, request, jsonify

finview_blueprint = Blueprint('finview', __name__)

def convert_to_crores(df):
    """Convert DataFrame values to crores."""
    return df.apply(lambda x: x / 10000000)

def fetch_financial_statements(ticker, frequency='Annual'):
    """
    Fetch and process financial statements (balance sheet, income statement, cash flow)
    for the given ticker.
    """
    try:
        stock = yf.Ticker(ticker)
        if frequency == 'Annual':
            balance_sheet = stock.balance_sheet
            income_statement = stock.financials
            cash_flow = stock.cashflow
        else:  # Quarterly data
            balance_sheet = stock.quarterly_balance_sheet
            income_statement = stock.quarterly_financials
            cash_flow = stock.quarterly_cashflow

        # Convert to crores (divide by 10 million)
        balance_sheet = convert_to_crores(balance_sheet)
        income_statement = convert_to_crores(income_statement)
        cash_flow = convert_to_crores(cash_flow)

        # Fill NaN values and convert to dictionary
        return {
            'balance_sheet': balance_sheet.fillna(0).to_dict(),
            'income_statement': income_statement.fillna(0).to_dict(),
            'cash_flow': cash_flow.fillna(0).to_dict()
        }
    except Exception as e:
        print(f"Error fetching financial statements for {ticker}: {str(e)}")
        return None

def convert_timestamps_to_strings(data):
    """
    Recursively convert any pandas Timestamp objects in the data to ISO-formatted strings.
    """
    if isinstance(data, dict):
        return {str(k): convert_timestamps_to_strings(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [convert_timestamps_to_strings(item) for item in data]
    elif isinstance(data, pd.Timestamp):
        return data.isoformat()
    else:
        return data

@finview_blueprint.route('/financial-statements', methods=['POST'])
def financial_statements_route():
    data = request.json
    ticker = data.get('ticker')
    frequency = data.get('frequency', 'annual')

    # Map frequency to period label
    period_label = 'Annual' if frequency == 'annual' else 'Quarterly'
    
    financial_data = fetch_financial_statements(ticker, period_label)
    
    if financial_data is None:
        return jsonify({'error': 'Failed to fetch financial statements. Please check the ticker symbol.'}), 400

    # Convert any Timestamp objects to string format
    financial_data = convert_timestamps_to_strings(financial_data)
    return jsonify(financial_data)
