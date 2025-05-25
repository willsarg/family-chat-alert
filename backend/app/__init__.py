from flask import Flask
from .routes import bp as api_bp
from pathlib import Path

def create_app():
    app = Flask(__name__)
    env_path = Path(__file__).parent.parent / ".env"
    app.config.from_pyfile(str(env_path))
    app.register_blueprint(api_bp, url_prefix="/api")

    return app