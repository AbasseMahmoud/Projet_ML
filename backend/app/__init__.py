from flask import Flask, jsonify
from flask_cors import CORS
import os
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    # CONFIG SQLITE
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    CORS(app)

    # ACTIVER LA BASE DE DONNEES
    db.init_app(app)

    # CREER LES TABLES (ex: users)
    with app.app_context():
        db.create_all()

    from .routes import bp as main_routes
    app.register_blueprint(main_routes)

    @app.route('/')
    def home():
        return jsonify({"message": "API online"})

    return app
