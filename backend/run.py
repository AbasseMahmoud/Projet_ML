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

# Autoriser toutes les origines et gérer correctement les requêtes préflight OPTIONS
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
