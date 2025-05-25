from flask import Flask

def create_app():
    app = Flask(__name__)
    app.config.from_pyfile("../.env")   # or use python-dotenv

    from .routes import bp as api_bp
    app.register_blueprint(api_bp, url_prefix="/api")

    return app