from flask import Blueprint, jsonify
from Model.Entrainement import train_model
bp = Blueprint('main', __name__, url_prefix='/api')

@bp.route('/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Bonjour depuis Flask "})

@bp.route('/data', methods=['GET'])
def get_data():
    data = train_model()  
    return jsonify(data) 

from flask import current_app as app

