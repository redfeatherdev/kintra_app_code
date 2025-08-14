from google.cloud import storage
import firebase_admin
from firebase_admin import credentials
import os

print("Initializing Firebase...")

cred_path = os.path.join(os.path.dirname(__file__), "assets", "kintr-dc6a8-firebase-adminsdk-7kr4t-cabb464ea4.json")

# Load credentials
cred = credentials.Certificate(cred_path)

# Initialize Firebase only once
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred, {
        'storageBucket': 'kintr-dc6a8.appspot.com',
        'databaseURL': 'https://kintr-dc6a8-default-rtdb.firebaseio.com/'
    })

print("Creating storage client with credentials...")

# ✅ Use credentials explicitly
client = storage.Client(credentials=cred.get_credential(), project="kintr-dc6a8")

try:
    buckets = list(client.list_buckets())
    if not buckets:
        print("No buckets found.")
    else:
        for b in buckets:
            print(" -", b.name)
except Exception as e:
    print("❌ Error occurred:", e)
