import os
import firebase_admin
from firebase_admin import credentials, db, storage, firestore

# Path to the service account key JSON file
base_dir = os.path.dirname(os.path.abspath(__file__))
service_account_path = os.path.join(base_dir, "../assets/kintr-dc6a8-firebase-adminsdk-7kr4t-cabb464ea4.json")

# Initialize Firebase app only once
if not firebase_admin._apps:
    cred = credentials.Certificate(service_account_path)
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://kintr-dc6a8-default-rtdb.firebaseio.com/',
        # 'storageBucket': 'kintr-dc6a8.appspot.com'
        'storageBucket': 'kintr-dc6a8.firebasestorage.app'
    })

# Export these
realtime_db = db.reference('/')
bucket = storage.bucket("kintr-dc6a8.appspot.com")
firestore_db = firestore.client()