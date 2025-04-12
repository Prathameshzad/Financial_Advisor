from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash  # For password hashing
from lib.mongodb import db  # Assuming your MongoDB connection is here
from model.user import UserSchema
from datetime import datetime

registerform_blueprint = Blueprint('registerform', __name__)

@registerform_blueprint.route('/api/register', methods=['POST'])
def register_user():
    # Get the incoming data
    data = request.get_json()

    # Validate the data with Pydantic (optional but helps clean up)
    try:
        user_data = UserSchema(**data)  # Validate and parse data
    except ValueError as e:
        return jsonify({'error': f'Invalid data: {str(e)}'}), 400

    name = user_data.name
    email = user_data.email
    password = user_data.password

    if not name or not email or not password:
        return jsonify({'error': 'Missing required fields'}), 400

    # Check if the email already exists in the database
    users_collection = db['users']
    if users_collection.find_one({'email': email}):
        return jsonify({'error': 'Email already registered'}), 400

    # Hash the password using bcrypt
    hashed_password = generate_password_hash(password)

    # Prepare the user data
    user_document = {
        "name": name,
        "email": email,
        "password": hashed_password,
        "created_at": datetime.utcnow()
    }

    # Insert the user into the database
    try:
        users_collection.insert_one(user_document)
    except Exception as e:
        return jsonify({'error': f'Error registering user: {str(e)}'}), 500

    return jsonify({'message': 'User registered successfully'}), 201
