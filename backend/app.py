from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import sys

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize Firebase (with error handling)
try:
    from firebase_config import init_firebase
    db = init_firebase()
    print("✅ Firebase initialized successfully!")
except Exception as e:
    print(f"⚠️  Warning: Firebase initialization failed: {e}")
    print("   Backend will still run, but database operations will fail.")
    db = None

@app.route("/")
def home():
    return jsonify({"message": "Backend API is running!", "status": "success"})

# User Management
@app.route("/api/users", methods=["POST"])
def add_user():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        user_data = {
            "name": data.get("name"),
            "email": data.get("email"),
            "isAdmin": data.get("isAdmin", False),
            "createdAt": datetime.now()
        }
        
        doc_ref = db.collection("users").add(user_data)
        return jsonify({"message": "User added successfully!", "id": doc_ref[1].id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/users/<user_id>", methods=["GET"])
def get_user(user_id):
    try:
        user_doc = db.collection("users").document(user_id).get()
        if user_doc.exists:
            return jsonify({"id": user_doc.id, **user_doc.to_dict()}), 200
        return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Product Management
@app.route("/api/products", methods=["GET"])
def get_products():
    try:
        products = []
        products_ref = db.collection("products")
        
        # Support query parameters
        category = request.args.get("category")
        if category:
            products_ref = products_ref.where("category", "==", category)
        
        for doc in products_ref.stream():
            products.append({"id": doc.id, **doc.to_dict()})
        
        return jsonify({"products": products, "count": len(products)}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/products", methods=["POST"])
def add_product():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        product_data = {
            "title": data.get("title"),
            "price": data.get("price"),
            "image": data.get("image"),
            "category": data.get("category"),
            "description": data.get("description", ""),
            "stock": data.get("stock", 0),
            "createdAt": datetime.now()
        }
        
        doc_ref = db.collection("products").add(product_data)
        return jsonify({"message": "Product added successfully!", "id": doc_ref[1].id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/products/<product_id>", methods=["GET"])
def get_product(product_id):
    try:
        product_doc = db.collection("products").document(product_id).get()
        if product_doc.exists:
            return jsonify({"id": product_doc.id, **product_doc.to_dict()}), 200
        return jsonify({"error": "Product not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/products/<product_id>", methods=["PUT"])
def update_product(product_id):
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        db.collection("products").document(product_id).update(data)
        return jsonify({"message": "Product updated successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/products/<product_id>", methods=["DELETE"])
def delete_product(product_id):
    try:
        db.collection("products").document(product_id).delete()
        return jsonify({"message": "Product deleted successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Order Management
@app.route("/api/orders", methods=["GET"])
def get_orders():
    try:
        orders = []
        orders_ref = db.collection("orders")
        
        # Support filtering by user_id
        user_id = request.args.get("user_id")
        if user_id:
            orders_ref = orders_ref.where("userId", "==", user_id)
        
        for doc in orders_ref.stream():
            orders.append({"id": doc.id, **doc.to_dict()})
        
        return jsonify({"orders": orders, "count": len(orders)}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/orders", methods=["POST"])
def create_order():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        if db is None:
            return jsonify({"error": "Database not initialized. Please check Firebase configuration."}), 500
        
        order_data = {
            "userId": data.get("userId"),
            "items": data.get("items", []),
            "total": data.get("total", 0),
            "address": data.get("address", ""),
            "phone": data.get("phone", ""),
            "paymentMethod": data.get("paymentMethod", "COD"),
            "status": data.get("status", "Pending"),
            "createdAt": datetime.now()
        }
        
        doc_ref = db.collection("orders").add(order_data)
        return jsonify({"message": "Order created successfully!", "id": doc_ref[1].id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/orders/<order_id>", methods=["GET"])
def get_order(order_id):
    try:
        order_doc = db.collection("orders").document(order_id).get()
        if order_doc.exists:
            return jsonify({"id": order_doc.id, **order_doc.to_dict()}), 200
        return jsonify({"error": "Order not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/orders/<order_id>", methods=["PUT"])
def update_order(order_id):
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        db.collection("orders").document(order_id).update(data)
        return jsonify({"message": "Order updated successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Cart Management (for server-side cart if needed)
@app.route("/api/cart", methods=["POST"])
def add_to_cart():
    try:
        data = request.json
        return jsonify({"message": "Item added to cart", "data": data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Health check
@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

