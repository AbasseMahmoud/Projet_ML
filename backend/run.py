# from app import create_app
# import os
# from flask_cors import CORS

# app = create_app()

# # ✅ Autoriser toutes les origines et toutes les routes
# CORS(app, resources={r"/*": {"origins": "*"}})
# if __name__ == "__main__":
#     port = int(os.environ.get('PORT', 5000))
#     app.run(host='0.0.0.0', port=port, debug=False)

from app import create_app
from flask_cors import CORS
import os

app = create_app()

# Configuration CORS COMPLÈTE et ROBUSTE
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "Accept"],
        "supports_credentials": True
    }
})

# Gestion manuelle des requêtes OPTIONS globales
@app.before_request
def handle_options():
    from flask import request
    if request.method == 'OPTIONS':
        response = app.make_default_options_response()
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
            'Access-Control-Max-Age': '3600'
        }
        return '', 200, headers

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)  # Mettez debug=True temporairement