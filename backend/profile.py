from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from lib.mongodb import db
from bson.objectid import ObjectId

profile_blueprint = Blueprint('profile', __name__)

@profile_blueprint.route('/api/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = db['users'].find_one({'_id': ObjectId(user_id)}, {'password': 0})
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    user['_id'] = str(user['_id'])
    return jsonify(user), 200

@profile_blueprint.route('/api/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh_token():
    user_id = get_jwt_identity()
    new_token = create_access_token(identity=user_id)
    return jsonify({'access_token': new_token}), 200