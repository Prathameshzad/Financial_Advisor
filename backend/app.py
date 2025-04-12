from flask import Flask
from flask_cors import CORS
from stock_metrics_routes import stock_metrics_blueprint
from widgets import widgets_blueprint
from finView import finview_blueprint  # Import the finView blueprint

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

app.register_blueprint(stock_metrics_blueprint)
app.register_blueprint(widgets_blueprint)
app.register_blueprint(finview_blueprint)

if __name__ == '__main__':
    app.run(debug=True)
