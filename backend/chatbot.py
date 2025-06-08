from flask import Blueprint, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

chatbot_blueprint = Blueprint("chatbot", __name__)

# Enable CORS for this blueprint
def init_cors(app):
    CORS(app, resources={
        r"/chatbot": {
            "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
            "methods": ["POST", "OPTIONS"],
            "allow_headers": ["Content-Type"]
        }
    })

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables")

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

@chatbot_blueprint.route("/chatbot", methods=["POST", "OPTIONS"])
def chatbot():
    # Handle preflight OPTIONS request
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200
    
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
            
        message = data.get("message", "")

        if not message or not message.strip():
            return jsonify({"error": "Please enter a valid question."}), 400

        # Generate response using Gemini
        response = model.generate_content(message)
        
        # Check if response was generated successfully
        if not response or not response.text:
            return jsonify({"error": "Failed to generate response"}), 500
            
        return jsonify({
            "response": response.text.strip(),
            "status": "success"
        }), 200
        
    except Exception as e:
        print(f"Error in chatbot endpoint: {str(e)}")
        return jsonify({
            "error": "An error occurred while processing your request. Please try again.",
            "details": str(e)
        }), 500

# Health check endpoint
@chatbot_blueprint.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy", "service": "chatbot"}), 200