from flask import Flask, request, jsonify
from firebase_config import init_firebase

app = Flask(__name__)
db = init_firebase()

@app.route("/")
def home():
    return "Backend API is running!"

@app.route("/add-user", methods=["POST"])
def add_user():
    data = request.json
    db.collection("users").add(data)
    return jsonify({"message": "User added successfully!"})

if __name__ == "__main__":
    app.run(debug=True)
