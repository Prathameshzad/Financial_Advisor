from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

# JWT Configuration
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY") or "super-secret-key"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 360000  # 1 hour
jwt = JWTManager(app)

# Register blueprints
from stock_metrics_routes import stock_metrics_blueprint
from widgets import widgets_blueprint
from finView import finview_blueprint
from register import registerform_blueprint
from login import loginform_blueprint
from profile import profile_blueprint
from portfolio import portfolio_blueprint
from news import news_blueprint
from indiaNews import india_news_blueprint
from chatbot import chatbot_blueprint

app.register_blueprint(stock_metrics_blueprint)
app.register_blueprint(widgets_blueprint)
app.register_blueprint(finview_blueprint)
app.register_blueprint(registerform_blueprint)
app.register_blueprint(loginform_blueprint)
app.register_blueprint(profile_blueprint)
app.register_blueprint(portfolio_blueprint)
app.register_blueprint(news_blueprint) 
app.register_blueprint(india_news_blueprint)
app.register_blueprint(chatbot_blueprint)

if __name__ == '__main__':
    app.run(debug=True)