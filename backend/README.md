# Backend API

This is the Flask backend server for the ShopEase application.

## Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Set up Firebase:
   - Download your Firebase service account key from Firebase Console
   - Place it as `serviceAccountKey.json` in the backend folder (or parent directory)

3. Run the server:
```bash
python app.py
```

The server will run on `http://localhost:5000`

## API Endpoints

### Health Check
- `GET /api/health` - Check if backend is running

### Users
- `POST /api/users` - Create a new user
- `GET /api/users/<user_id>` - Get user by ID

### Products
- `GET /api/products` - Get all products (optional: ?category=name)
- `POST /api/products` - Create a new product
- `GET /api/products/<product_id>` - Get product by ID
- `PUT /api/products/<product_id>` - Update product
- `DELETE /api/products/<product_id>` - Delete product

### Orders
- `GET /api/orders` - Get all orders (optional: ?user_id=id)
- `POST /api/orders` - Create a new order
- `GET /api/orders/<order_id>` - Get order by ID
- `PUT /api/orders/<order_id>` - Update order

### Cart
- `POST /api/cart` - Add item to cart (placeholder)

## Notes

- CORS is enabled for all routes
- The backend uses Firebase Firestore for data storage
- Make sure Firebase is properly configured before running

