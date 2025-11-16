# Frontend-Backend Connection Guide

## ✅ Connection Status: READY

Your frontend and backend are configured to connect!

## 🚀 Quick Start

### Step 1: Start the Backend Server

**Windows:**
```bash
cd backend
python app.py
```

**Mac/Linux:**
```bash
cd backend
python3 app.py
```

You should see:
```
✅ Firebase initialized successfully!
 * Running on http://0.0.0.0:5000
```

### Step 2: Verify Connection

1. Open `frontend/test-backend.html` in your browser
2. Click "Test Backend Connection"
3. You should see: ✅ CONNECTED!

## 📡 Connection Details

- **Frontend API Base:** `http://localhost:5000/api`
- **Backend Port:** `5000`
- **CORS:** Enabled (allows frontend to connect)

## 🔧 API Endpoints

### Health Check
- `GET http://localhost:5000/api/health`
- Returns: `{"status": "healthy", "timestamp": "..."}`

### Create Order
- `POST http://localhost:5000/api/orders`
- Body: `{userId, items, total, address, phone, paymentMethod}`

### Other Endpoints
- `GET /api/users` - Get users
- `POST /api/users` - Create user
- `GET /api/products` - Get products
- `POST /api/products` - Create product

## 🐛 Troubleshooting

### Backend won't start?
1. Check if port 5000 is available
2. Install dependencies: `pip install -r requirements.txt`
3. Check Firebase service account key exists

### Frontend can't connect?
1. Make sure backend is running
2. Check browser console for errors
3. Verify `API_BASE = 'http://localhost:5000/api'` in `frontend/js/main.js`

### CORS errors?
- Backend has CORS enabled, but if you see errors:
  - Make sure `CORS(app)` is in `backend/app.py`
  - Check browser console for specific error

## ✅ Connection Test

Open `frontend/test-backend.html` to test:
- Backend connection
- Health endpoint
- Order creation

## 📝 Notes

- Backend must be running for frontend API calls to work
- Frontend uses Firebase directly for authentication (doesn't need backend)
- Cart uses localStorage (doesn't need backend)
- Orders require backend to save to database

