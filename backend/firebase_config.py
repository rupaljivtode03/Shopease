import firebase_admin
from firebase_admin import credentials, firestore
import os

def init_firebase():
    try:
        # Check if Firebase is already initialized
        if firebase_admin._apps:
            return firestore.client()
        
        # Path to service account key - check both backend folder and parent directory
        service_account_path = "serviceAccountKey.json"
        
        # If not found in backend folder, check parent directory
        if not os.path.exists(service_account_path):
            parent_path = os.path.join("..", "serviceAccountKey.json")
            if os.path.exists(parent_path):
                service_account_path = parent_path
            else:
                raise FileNotFoundError(
                    f"Firebase service account key not found. "
                    "Please download it from Firebase Console and place it in either:\n"
                    f"  - {os.path.abspath('serviceAccountKey.json')}\n"
                    f"  - {os.path.abspath(parent_path)}"
                )
        
        # Initialize Firebase
        cred = credentials.Certificate(service_account_path)
        firebase_admin.initialize_app(cred)
        return firestore.client()
    except Exception as e:
        print(f"Error initializing Firebase: {e}")
        raise

