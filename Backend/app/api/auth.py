from flask import request, jsonify
from datetime import datetime, timedelta
from werkzeug.security import check_password_hash

from app import app, realtime_db
from app.config import JWT_SECRET_KEY

import jwt

@app.route("/api/v1/auth/signin", methods=["POST"])
def signin():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        # 🔧 TEMP BYPASS FOR ADMIN
        if email == "bypass@dev.com" and password == "bypass123":
            payload = {
                'exp': datetime.utcnow() + timedelta(hours=1),
                'iat': datetime.utcnow(),
                'sub': "bypass-admin-id",
                'role': "admin"
            }
            token = jwt.encode(payload, JWT_SECRET_KEY, algorithm='HS256')
            fake_admin = {
                "email": email,
                "name": "Bypass Admin",
                "role": "admin"
            }
            return jsonify({"msg": "Bypassed Admin Login Success", "token": token, "user": fake_admin}), 201

        # 🔧 TEMP BYPASS FOR USER
        if email == "testuser@dev.com" and password == "user123":
            payload = {
                'exp': datetime.utcnow() + timedelta(hours=1),
                'iat': datetime.utcnow(),
                'sub': "bypass-user-id",
                'role': "user"
            }
            token = jwt.encode(payload, JWT_SECRET_KEY, algorithm='HS256')
            fake_user = {
                "email": email,
                "name": "Test User",
                "role": "user"
            }
            return jsonify({"msg": "Bypassed User Login Success", "token": token, "user": fake_user}), 201

        # 👉 Real ADMIN login logic
        if not email or not password:
            return jsonify({"msg": "Missing required fields"}), 400

        admins_ref = realtime_db.child('admins')
        admin_data = admins_ref.order_by_child('email').equal_to(email).get()

        if not admin_data:
            return jsonify({"msg": "Invalid credentials"}), 400

        admin_id = list(admin_data.keys())[0]
        admin = admin_data[admin_id]

        if not check_password_hash(admin["password"], password):
            return jsonify({"msg": "Invalid credentials"}), 400

        payload = {
            'exp': datetime.utcnow() + timedelta(hours=1),
            'iat': datetime.utcnow(),
            'sub': admin_id,
            'role': "admin"
        }

        token = jwt.encode(payload, JWT_SECRET_KEY, algorithm='HS256')
        return jsonify({"msg": "User signed in successfully", "token": token, "user": admin}), 201

    except Exception as e:
        print(f"Error encountered while signing in: {e}")
        return jsonify({"msg": "Error signing in", "err": str(e)}), 500


# @app.route("/api/v1/auth/signin", methods=["POST"])
# def signin():
#     try:
#         data =request.get_json()
#         email = data.get("email")
#         password = data.get("password")

#         if not email or not password:
#             return jsonify({"msg": "Missing required fields"}), 400
        
#         admins_ref = realtime_db.child('admins')
#         admin_data = admins_ref.order_by_child('email').equal_to(email).get()

#         if not admin_data:
#             return jsonify({"msg": "Invalid credentials"}), 400
        
#         admin_id = list(admin_data.keys())[0]
#         admin = admin_data[admin_id]

#         if not check_password_hash(admin["password"], password):
#             return jsonify({"msg": "Invalid credentials"}), 400
        
#         payload = {
#             'exp': datetime.utcnow() + timedelta(hours=1),
#             'iat': datetime.utcnow(),
#             'sub': admin_id
#         }

#         token = jwt.encode(payload, JWT_SECRET_KEY, algorithm='HS256')

#         return jsonify({"msg": "User signed in successfully", "token": token, "user": admin}), 201
        
#     except Exception as e:
#         print(f"Error encountered while signing in: {e}")
#         return jsonify({"msg": "Error signing in", "err": str(e)}), 500
