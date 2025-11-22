# wsgi.py
from app import create_app

# Crée l'application Flask
app = create_app()

if __name__ == "__main__":
    # Mode debug local uniquement
    app.run(host="0.0.0.0", port=5000, debug=True)
