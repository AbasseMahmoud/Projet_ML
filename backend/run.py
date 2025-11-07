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

# ✅ Configuration CORS UNIQUE et SIMPLIFIÉE
CORS(app)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)