from flask import Flask
from flask_cors import CORS
from firebase_admin import credentials, db, storage
import os
import firebase_admin

# Initialize Flask App
app = Flask(__name__)
CORS(app, origins="*", allow_headers="*")

# Firebase Configuration
base_dir = os.path.dirname(os.path.abspath(__file__))
service_account_path = os.path.join(base_dir, "../assets/kintr-dc6a8-firebase-adminsdk-7kr4t-cabb464ea4.json")

cred = credentials.Certificate(service_account_path)
default_app = firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://kintr-dc6a8-default-rtdb.firebaseio.com/',
    'storageBucket': 'kintr-dc6a8.appspot.com'  # FIXED: should end in .appspot.com
})


realtime_db = db.reference('/')
bucket = storage.bucket()

from app.api.event import event_bp
app.register_blueprint(event_bp)

from app.api.payment import payment_bp
app.register_blueprint(payment_bp)

from app.api.media import media_bp
app.register_blueprint(media_bp)

from app.api.support import support_bp
app.register_blueprint(support_bp)

# from app.api.media import media_bp
# app.register_blueprint(media_bp)

# Optional: include other route files
from app.api.auth import *
from app.api.total import *
from app.api.user import *
from app.api.notification import *
from app.api.admin import *

# Exportable items
__all__ = ['app', 'realtime_db'] 