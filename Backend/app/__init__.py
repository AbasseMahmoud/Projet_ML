from flask import Flask, jsonify
from flask_cors import CORS
from Model.Entrainement import train_model
def create_app():
    app = Flask(__name__)


    CORS(app)  # Autorise le frontend React à faire des requêtes


    with app.app_context():
        train_model() 
    from .routes import bp as main_routes
    app.register_blueprint(main_routes)

    @app.route('/')
    def home():
        return jsonify({"message" :"Welcome les gars"})

    return app
