<<<<<<< HEAD
# ...existing code...
=======
>>>>>>> bf691cdf37e9ca01fd7271a05f3e27c660099eef
from flask import Flask, request, jsonify
from flask_cors import CORS
from firebase_config import init_firebase
from datetime import datetime

app = Flask(__name__)
<<<<<<< HEAD
CORS(app, resources={r"/api/*": {"origins": "*"}})

=======
CORS(app)  # Enable CORS for all routes
>>>>>>> bf691cdf37e9ca01fd7271a05f3e27c660099eef
db = init_firebase()

@app.route("/")
def home():
<<<<<<< HEAD
    return "Backend API is running!"

# Simple user add (keeps existing behavior)
@app.route("/add-user", methods=["POST"])
def add_user():
    data = request.json or {}
    try:
        db.collection("users").add(data)
        return jsonify({"message": "User added successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# API prefix endpoints expected by frontend
@app.route("/api/products", methods=["GET"])
def get_products():
    try:
        docs = db.collection("products").stream()
        products = []
        for d in docs:
            p = d.to_dict()
            p["id"] = d.id
            products.append(p)
        return jsonify(products), 200
=======
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
>>>>>>> bf691cdf37e9ca01fd7271a05f3e27c660099eef
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/orders", methods=["POST"])
def create_order():
<<<<<<< HEAD
    data = request.json or {}
    # basic validation
    if "items" not in data or "total" not in data:
        return jsonify({"error": "Missing items or total"}), 400
    order = {
        "items": data["items"],
        "total": data["total"],
        "userId": data.get("userId"),
        "address": data.get("address", ""),
        "phone": data.get("phone", ""),
        "paymentMethod": data.get("paymentMethod", "COD"),
        "createdAt": datetime.utcnow().isoformat() + "Z"
    }
    try:
        doc_ref = db.collection("orders").add(order)
        return jsonify({"id": doc_ref[1].id if isinstance(doc_ref, tuple) else doc_ref.id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
# ...existing code...
=======
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        order_data = {
            "userId": data.get("userId"),
            "items": data.get("items", []),
            "total": data.get("total", 0),
            "address": data.get("address"),
            "phone": data.get("phone"),
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
    app.run(debug=True, port=5000)
>>>>>>> bf691cdf37e9ca01fd7271a05f3e27c660099eef
