"""
Flask app that serves a signup page and registers users in Firebase (Authentication + Firestore).

Requirements:
  pip install flask firebase-admin python-dotenv

Setup:
  1. Create a Firebase project at https://console.firebase.google.com/
  2. In Project settings > Service accounts, generate a new private key JSON and save as serviceAccountKey.json
  3. Enable Email/Password sign-in in Firebase Console (Authentication -> Sign-in method)
  4. Replace FIREBASE_CRED_PATH with the path to your JSON file or set environment variable FIREBASE_CRED
  5. Run: python signup_app.py

This is a minimal, ready-to-run example for development. For production secure your keys and use HTTPS.
"""

from flask import Flask, request, render_template_string, jsonify
import firebase_admin
from firebase_admin import credentials, auth, firestore
import os
from dotenv import load_dotenv

load_dotenv()

# Path to service account JSON - prefer to set FIREBASE_CRED env var
FIREBASE_CRED_PATH = os.getenv('FIREBASE_CRED', 'serviceAccountKey.json')

# Initialize Firebase Admin SDK
if not firebase_admin._apps:
    cred = credentials.Certificate(FIREBASE_CRED_PATH)
    firebase_admin.initialize_app(cred)

db = firestore.client()

app = Flask(__name__)

# Simple signup page (inline for single-file convenience)
SIGNUP_HTML = r"""
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Sign up — Nykaa Demo Shop</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"/>
  <style>
    body{font-family:Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial;background:#fff; color:#121212;display:flex;align-items:center;justify-content:center;height:100vh;margin:0}
    .card{width:360px;padding:20px;border-radius:12px;box-shadow:0 10px 40px rgba(0,0,0,0.07)}
    h2{margin:0 0 8px}
    label{font-size:13px;color:#555}
    input{width:100%;padding:10px;border-radius:8px;border:1px solid #eee;margin-top:6px;margin-bottom:12px}
    button{width:100%;padding:10px;border-radius:8px;border:0;background:#e80087;color:#fff;font-weight:600;cursor:pointer}
    .hint{font-size:13px;color:#666;margin-top:8px;text-align:center}
    .msg{font-size:14px;margin-top:10px;text-align:center}
  </style>
</head>
<body>
  <div class="card">
    <h2>Create your account</h2>
    <form id="signupForm">
      <label for="name">Full name</label>
      <input id="name" name="name" placeholder="Aarti Sharma" required>

      <label for="email">Email</label>
      <input id="email" name="email" type="email" placeholder="you@example.com" required>

      <label for="phone">Phone (optional)</label>
      <input id="phone" name="phone" placeholder="+919xxxxxxxxx">

      <label for="password">Password</label>
      <input id="password" name="password" type="password" placeholder="At least 6 characters" required>

      <button type="submit">Sign up</button>
    </form>

    <div class="msg" id="msg"></div>
    <div class="hint">Already have an account? <a href="/login">Sign in</a></div>
  </div>

<script>
const form = document.getElementById('signupForm');
const msg = document.getElementById('msg');
form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  msg.textContent = '';
  const data = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    password: form.password.value
  };

  // Basic client-side validation
  if(!data.name || !data.email || data.password.length < 6){
    msg.style.color = 'crimson';
    msg.textContent = 'Please provide a name, valid email and a password (min 6 chars).';
    return;
  }

  msg.style.color = '#333';
  msg.textContent = 'Creating account...';

  try{
    const res = await fetch('/api/signup', {
      method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data)
    });
    const j = await res.json();
    if(res.ok){
      msg.style.color = 'green';
      msg.innerHTML = 'Account created — <b>' + j.email + '</b>. You can now <a href="/login">sign in</a>.';
      form.reset();
    } else {
      msg.style.color = 'crimson';
      msg.textContent = j.error || 'Signup failed';
    }
  } catch(err){
    msg.style.color = 'crimson';
    msg.textContent = 'Network error — try again.';
  }
});
</script>
</body>
</html>
"""

@app.route('/signup', methods=['GET'])
def signup_page():
    return render_template_string(SIGNUP_HTML)

@app.route('/api/signup', methods=['POST'])
def api_signup():
    """Create a Firebase Auth user and store profile in Firestore.
    Expected JSON: { name, email, phone, password }
    """
    data = request.get_json() or {}
    name = (data.get('name') or '').strip()
    email = (data.get('email') or '').strip().lower()
    phone = (data.get('phone') or '').strip()
    password = data.get('password') or ''

    if not name or not email or len(password) < 6:
        return jsonify({'error':'Name, email and password (min 6 chars) are required.'}), 400

    # create auth user
    try:
        user = auth.create_user(
            email=email,
            email_verified=False,
            password=password,
            display_name=name,
            phone_number=phone if phone else None,
        )
    except Exception as e:
        # firebase_admin raises various errors; return message to client
        return jsonify({'error': str(e)}), 400

    # store a profile document in Firestore
    try:
        doc_ref = db.collection('users').document(user.uid)
        doc_ref.set({
            'name': name,
            'email': email,
            'phone': phone,
            'createdAt': firestore.SERVER_TIMESTAMP,
        })
    except Exception as e:
        # If Firestore write fails, delete the created user to avoid orphaned auth
        try:
            auth.delete_user(user.uid)
        except Exception:
            pass
        return jsonify({'error':'Failed to save user profile: ' + str(e)}), 500

    return jsonify({'uid': user.uid, 'email': user.email}), 201

if __name__ == '__main__':
    app.run(debug=True, port=5000)
