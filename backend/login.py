# routes/login.py

from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from lib.mongodb import db
from model.user import UserSchema

loginform_blueprint = Blueprint('loginform', __name__)

@loginform_blueprint.route('/api/login', methods=['POST'])
def login_user():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400

    user = db['users'].find_one({'email': email})
    if not user:
        return jsonify({'error': 'User does not exist'}), 404

    if not check_password_hash(user['password'], password):
        return jsonify({'error': 'Incorrect password'}), 401

    return jsonify({'message': 'Login successful', 'name': user['name']}), 200

