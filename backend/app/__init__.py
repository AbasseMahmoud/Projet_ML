from flask import Flask, jsonify
from flask_cors import CORS
import os
from flask_sqlalchemy import SQLAlchemy

# Initialiser SQLAlchemy (en dehors de create_app)
db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    # Config PostgreSQL (Render) ou fallback local
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
        'DATABASE_URL',
        'sqlite:///local.db'  # Fallback to SQLite for local testing
    )
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # CORS pour production - plus permissif
    CORS(app)  # Laissez comme ça pour tous les domaines temporairement
    db.init_app(app)

    with app.app_context():
        try:
            db.create_all()  # Crée les tables si elles n'existent pas
            # ✅ Test de connexion
            engine = db.get_engine()
            conn = engine.connect()
            print("Connexion à PostgreSQL établie ✅")
            conn.close()
        except Exception as e:
            print("Erreur de connexion à PostgreSQL :", e)

    # Éviter le chargement des données au démarrage (trop long)
    # with app.app_context():
    #     train_model()  # COMMENTEZ cette ligne pour Render

    from .routes import bp as main_routes
    app.register_blueprint(main_routes)

    @app.route('/')
    def home():
        return jsonify({
            "message": "API Fraud Detection - Déployée sur Render",
            "status": "online",
            "version": "1.0"
        })

    @app.route('/health', methods=['GET'])
    def health_check():
        return jsonify({"status": "healthy", "message": "API en ligne"})

    return app
