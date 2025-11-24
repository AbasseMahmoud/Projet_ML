# from flask import Flask, jsonify
# from flask_cors import CORS
# import os
# from flask_sqlalchemy import SQLAlchemy

# db = SQLAlchemy()

# def create_app():
#     app = Flask(__name__)

#     # CONFIG SQLITE
#     app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
#     app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

#     CORS(app)

#     # ACTIVER LA BASE DE DONNEES
#     db.init_app(app)

#     # CREER LES TABLES (ex: users)
#     with app.app_context():
#         db.create_all()

#     from .routes import bp as main_routes
#     app.register_blueprint(main_routes)

#     @app.route('/')
#     def home():
#         return jsonify({"message": "API online"})

#     return app

from flask import Flask, jsonify
from flask_cors import CORS
import os
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    # CONFIGURATION POSTGRESQL RENDER
    database_url = "postgresql://machine_learning_db_user:YYDiI7DBB4d3LOQsyJYXm7LET9jKBmcb@dpg-d4b1qoili9vc73dmoos0-a.oregon-postgres.render.com/machine_learning_db"
    
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Configuration CORS
    CORS(app, origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:5173", 
        "https://front-bd66.onrender.com"
    ])

    # ACTIVER LA BASE DE DONNEES
    db.init_app(app)

    # IMPORT DES MODÈLES
    from . import models

    # CREER LES TABLES
    with app.app_context():
        try:
            db.create_all()
            print("✅ Tables PostgreSQL créées avec succès")
        except Exception as e:
            print(f"❌ Erreur création tables: {e}")

    from .routes import bp as main_routes
    app.register_blueprint(main_routes)

    @app.route('/')
    def home():
        return jsonify({"message": "API online avec PostgreSQL"})

    @app.route('/api/db-test')
    def db_test():
        try:
            db.session.execute('SELECT 1')
            return jsonify({"status": "✅ PostgreSQL connecté"})
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    return app