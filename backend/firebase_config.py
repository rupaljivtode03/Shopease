import firebase_admin
from firebase_admin import credentials, firestore
<<<<<<< HEAD

def init_firebase():
    cred = credentials.Certificate("serviceAccountKey.json")
    firebase_admin.initialize_app(cred)
    return firestore.client()
=======
import os

def init_firebase():
    try:
        # Check if Firebase is already initialized
        if firebase_admin._apps:
            return firestore.client()
        
        # Path to service account key
        service_account_path = "serviceAccountKey.json"
        
        # Check if file exists
        if not os.path.exists(service_account_path):
            raise FileNotFoundError(
                f"Firebase service account key not found at {service_account_path}. "
                "Please download it from Firebase Console and place it in the backend folder."
            )
        
        # Initialize Firebase
        cred = credentials.Certificate(service_account_path)
        firebase_admin.initialize_app(cred)
        return firestore.client()
    except Exception as e:
        print(f"Error initializing Firebase: {e}")
        raise
>>>>>>> bf691cdf37e9ca01fd7271a05f3e27c660099eef
