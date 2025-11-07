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

# Configuration CORS COMPLÈTE pour toutes les routes
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "Accept"],
        "supports_credentials": True
    }
})

# Gestion manuelle des requêtes OPTIONS
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

# Route OPTIONS globale pour toutes les routes
@app.route('/', methods=['OPTIONS'])
@app.route('/<path:path>', methods=['OPTIONS'])
def options_handler(path=None):
    return '', 200

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)