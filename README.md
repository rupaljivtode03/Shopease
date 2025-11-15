# Shopease - E-commerce Application

## Tech Stack
- **Frontend**: HTML, CSS, JavaScript (Vanilla JS)
- **Backend**: Python + Flask
- **Database**: Firebase Firestore

## Prerequisites
- Python 3.7 or higher
- Firebase service account key file

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend folder:
```bash
cd backend
```

2. Activate virtual environment (if using):
```bash
# On Windows
venv\Scripts\activate

# On Mac/Linux
source venv/bin/activate
```

3. Install dependencies (if not already installed):
```bash
pip install -r requirements.txt
```

4. Add Firebase Service Account Key:
   - Download `serviceAccountKey.json` from Firebase Console
   - Place it in the `backend` folder

5. Run the Flask server:
```bash
python app.py
```

The backend will run on `http://localhost:5000`

### 2. Frontend Setup

1. Navigate to the frontend folder:
```bash
cd frontend
```

2. Serve the frontend using Python's built-in HTTP server:
```bash
# Python 3
python -m http.server 8000

# Or if you have Python 2
python -m SimpleHTTPServer 8000
```

3. Open your browser and go to:
```
http://localhost:8000
```

### 3. Alternative: Open HTML directly

You can also open `index.html` directly in your browser, but note:
- Some features may not work due to CORS restrictions
- Firebase and API calls might have issues
- Recommended: Use a local server (Python HTTP server)

## Running the Application

1. **Terminal 1 - Backend:**
```bash
cd backend
python app.py
```

2. **Terminal 2 - Frontend:**
```bash
cd frontend
python -m http.server 8000
```

3. **Open Browser:**
   - Go to `http://localhost:8000`
   - The frontend will connect to backend at `http://localhost:5000`

## API Endpoints

- `GET /api/products` - Get all products
- `POST /api/products` - Add a product
- `GET /api/products/<id>` - Get a product
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create an order
- `GET /api/users` - Get user info
- `POST /api/users` - Add a user

## Troubleshooting

1. **Backend not starting:**
   - Check if port 5000 is available
   - Ensure `serviceAccountKey.json` is in backend folder
   - Check Python version: `python --version`

2. **Frontend not loading:**
   - Ensure Python HTTP server is running
   - Check browser console for errors
   - Verify backend is running on port 5000

3. **CORS errors:**
   - Backend has CORS enabled, should work automatically
   - If issues persist, check `app.py` has `CORS(app)`

## File Structure

```
Shopease-clean/
├── backend/
│   ├── app.py                 # Flask backend server
│   ├── firebase_config.py     # Firebase configuration
│   ├── requirements.txt       # Python dependencies
│   └── serviceAccountKey.json # Firebase credentials (add this)
└── frontend/
    ├── index.html             # Main page
    ├── checkout.html          # Checkout page
    ├── style.css              # Styles
    ├── firebase-config.js     # Firebase client config
    ├── config.js              # API configuration
    ├── main.js                # Main JavaScript
    ├── auth.js                # Authentication
    ├── cart.js                # Cart management
    ├── checkout.js            # Checkout logic
    └── script.js              # Additional scripts
```

