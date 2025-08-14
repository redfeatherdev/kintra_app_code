from flask import request, jsonify
from app import app, realtime_db
from werkzeug.security import generate_password_hash

@app.route("/api/v1/add_admin", methods=["POST"])
def add_admin():
  try:
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
      return jsonify({"msg": "Missing required fields"}), 400
    
    admins_ref = realtime_db.child('admins')
    existing_admin = admins_ref.order_by_child('email').equal_to(email).get()

    if existing_admin:
      return jsonify({"msg": "Email already exists"}), 400
    
    admin_id = admins_ref.push().key
    new_admin = {
      "name": name,
      "email": email,
      "password": generate_password_hash(password)
    }

    admins_ref.child(admin_id).set(new_admin)
    return jsonify({"msg": "New Admin added successfully"}), 200
  except Exception as e:
    print(f"Error encountered while adding admin: {e}"), 500
    return jsonify({"msg": "Error adding admin"}), 500
  
@app.route("/api/v1/get_admins", methods=["GET"])
def get_admins():
  try:
    admins_ref = realtime_db.child('admins')
    admins_data = admins_ref.get()

    if not admins_data:
      return jsonify({"msg": "No admins found"}), 404
    
    admins_list = [{"id": admin_id, **admin_data} for admin_id, admin_data in admins_data.items() if isinstance(admins_data, dict)]

    search_query = request.args.get('search', "").strip().lower()

    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 5))

    if search_query:
      admins_list = [
        admin for admin in admins_list
        if search_query in str(admin.get("name", "")).lower()
        or search_query in str(admin.get("email", "")).lower()
      ]

    total_count = len(admins_list)
    start_index = (page - 1) * limit
    end_index = start_index + limit
    paginated_admins = admins_list[start_index:end_index]

    return jsonify({"msg": "Admins fetched successfully", "count": total_count, "admins": paginated_admins})

  except Exception as e:
    print(f"Error encountered while fetching admins: {e}")
    return jsonify({"msg": "Error fetching admins"}), 500
  
@app.route("/api/v1/update_admin/<admin_id>", methods=["PUT"])
def update_admin(admin_id):
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

        if not name or not email:
          return jsonify({"msg": "Missing required fields"}), 400

        admins_ref = realtime_db.child('admins')
        admin_data = admins_ref.child(admin_id).get()

        if not admin_data or not isinstance(admin_data, dict):
            return jsonify({"msg": "Admin not found"}), 404

        updated_data = {}
        if name:
            updated_data["name"] = name
        if email:
            existing_admin = admins_ref.order_by_child('email').equal_to(email).get()
            if existing_admin and list(existing_admin.keys())[0] != admin_id:
                return jsonify({"msg": "Email already exists"}), 400
            updated_data["email"] = email
        if password:
          updated_data["password"] = generate_password_hash(password)
        else:
          updated_data["password"] = admin_data["password"]

        admins_ref.child(admin_id).update(updated_data)

        return jsonify({"msg": "Admin updated successfully"}), 200

    except Exception as e:
        print(f"Error encountered while updating admin: {e}")
        return jsonify({"msg": "Error updating admin"}), 500
    
@app.route("/api/v1/delete_admin/<admin_id>", methods=["DELETE"])
def delete_admin(admin_id):
  try:
    admins_ref = realtime_db.child('admins')
    admin_data = admins_ref.child(admin_id).get()

    if not admin_data:
      return jsonify({'msg': "Admin not found"}), 404
    
    admins_ref.child(admin_id).delete()
    return jsonify({"msg": "Admin deleted successfully"}), 200
  except Exception as e:
    print(f"Error encountered while deleting admin: {e}")
    return jsonify({"msg": "Error deleting admin user", "error": str(e)}), 500 