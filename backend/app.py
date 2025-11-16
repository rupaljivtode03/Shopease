# ...existing code...
from flask import Flask, request, jsonify
from flask_cors import CORS
from firebase_config import init_firebase
from datetime import datetime

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

db = init_firebase()

@app.route("/")
def home():
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
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/orders", methods=["POST"])
def create_order():
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