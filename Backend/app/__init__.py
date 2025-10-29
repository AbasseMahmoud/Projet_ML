from flask import Flask, jsonify
from flask_cors import CORS
import os

def create_app():
    app = Flask(__name__)

    # CORS pour production - plus permissif
    CORS(app)  # Laissez comme ça pour tous les domains temporairement

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