from flask import Blueprint, jsonify

bp = Blueprint('main', __name__, url_prefix='/api')

@bp.route('/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Bonjour depuis Flask 🚀"})

from flask import current_app as app

