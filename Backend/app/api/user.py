import os

from flask import jsonify, request
from collections import Counter

from app import app, realtime_db, bucket
from app.utils.user import *
from app.utils.total import *
from app.utils.attractiveness import *

@app.route("/api/v1/get_all_users", methods=["GET"])
def get_all_users():
  try:
    users_ref = realtime_db.child('users')
    users_data = users_ref.get()

    if not users_data:
      return jsonify({"msg": "No users found"}), 404
  
    total_count = len(users_data)
     
    return jsonify({"msg": "Users fetched successfully", "count": total_count, "users": users_data}), 200

  except Exception as e:
    print(f"Error encountered while fetching users: {e}")
    return jsonify({"msg": "Error fetching users","error": str(e)}), 500

@app.route("/api/v1/get_paginated_users", methods=["GET"])
def get_paginated_users():
    try:
        users_ref = realtime_db.child('users')
        users_data = users_ref.get()

        if not users_data:
            return jsonify({"msg": "No users found"}), 404
        
        users_list = [{"id": user_id, **user_data} for user_id, user_data in users_data.items() if isinstance(user_data, dict)]

        search_query = request.args.get("search", "").strip().lower()

        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 10))

        if search_query:
          users_list = [
            user for user in users_list
            if search_query in str(user.get("name", "")).lower()
            or search_query in str(user.get("email", "")).lower()
            or search_query in str(user.get("age", ""))
            or search_query in str(user.get("attractiveness", ""))
            or search_query in str(user.get("gender", "")).lower()
          ]

        total_count = len(users_list)
        start_index = (page - 1) * limit
        end_index = start_index + limit
        paginated_users = users_list[start_index:end_index]

        return jsonify({"msg": "Users fetched successfully", "count": total_count, "users": paginated_users}), 200
    except Exception as e:
        print(f"Error encountered while fetching users: {e}")
        return jsonify({"msg": "Error fetching users","error": str(e)}), 500

@app.route("/api/v1/get_user_demographics", methods=["GET"])
def get_user_demographics():
  try:
    users_ref = realtime_db.child('users')
    users_data = users_ref.get()

    if not users_data:
      return jsonify({"msg": "No data available"}), 404

    periods = ['day', 'week', 'month', '6months', 'year']
    demographic_data = {period: {
      "heights": { "Man": Counter(), "Woman": Counter() },
      "skin_colors": { "Man": Counter(), "Woman": Counter() },
      "job_prominences": { "Man": Counter(), "Woman": Counter() },
      "yearly_incomes": { "Man": Counter(), "Woman": Counter() },
      "hobbies": { "Man": Counter(), "Woman": Counter() },
      "colleges": Counter(),
      "cities": Counter()
    } for period in periods}

    for user_data in users_data.values():
      gender = user_data.get('gender')
      likes_received = user_data.get('likesReceived')

      height = user_data.get('height')
      skin_color = user_data.get('skinColor')
      job_prominence = user_data.get('jobProminence')
      yearly_income = user_data.get('yearlyIncome')
      hobbies = user_data.get('hobbies', [])
      college = user_data.get('collegeOrSchool')

      for period in periods:
         if likes_received:
            filtered_likes_count = filter_likes_by_period(likes_received, period)

            if gender and height:
              demographic_data[period]["heights"][gender][height] += filtered_likes_count

            if gender and skin_color:
              demographic_data[period]["skin_colors"][gender][skin_color] += filtered_likes_count 

            if gender and job_prominence:
              demographic_data[period]["job_prominences"][gender][job_prominence] += filtered_likes_count

            if gender and yearly_income:
              demographic_data[period]["yearly_incomes"][gender][yearly_income] += filtered_likes_count

            if hobbies:
              for hobby in hobbies:
                demographic_data[period]["hobbies"][gender][hobby] += filtered_likes_count

            if college:
              demographic_data[period]["colleges"][college] += filtered_likes_count

            if 'livesIn' in user_data and isinstance(user_data['livesIn'], dict):
              lives_in = user_data['livesIn']
              if 'latitude' in lives_in and 'longitude' in lives_in:
                closest_city = get_closest_city(lives_in['latitude'], lives_in['longitude'])
                demographic_data[period]["cities"][closest_city] += filtered_likes_count

    top_data = {}
    for period in periods:
      top_data[period] = {
        "top_heights": {
          gender: [height for height, _ in height_count.most_common(4)]
          for gender, height_count in demographic_data[period]["heights"].items()
        },
        "top_skin_colors": {
          gender: [skin_color for skin_color, _ in skin_color_count.most_common(4)]
          for gender, skin_color_count in demographic_data[period]["skin_colors"].items()
        },
        "top_job_prominences": {
          gender: [job_prominence for job_prominence, _ in job_prominence_count.most_common(4)]
          for gender, job_prominence_count in demographic_data[period]["job_prominences"].items()
        },
        "top_yearly_incomes": {
          gender: [yearly_income for yearly_income, _ in yearly_income_count.most_common(4)]
          for gender, yearly_income_count in demographic_data[period]["yearly_incomes"].items()
        },
        "top_hobbies": {
          gender: [hobby for hobby, _ in hobby_count.most_common(4)]
          for gender, hobby_count in demographic_data[period]["hobbies"].items()
        },
        "top_colleges": [college for college, _ in demographic_data[period]["colleges"].most_common(4)],
        "top_cities": [city for city, _ in demographic_data[period]["cities"].most_common(4)]
      }

    return jsonify(top_data), 200
  except Exception as e:
    print(f"Error getting user demographics: {e}")
    return jsonify({"msg": "error getting user demographics"}), 500

@app.route("/api/v1/update_user/<user_id>", methods=["PUT"])
def udpate_user(user_id):
  try:
    updated_user_data = request.get_json()

    if not updated_user_data:
      return jsonify({"msg": "No data provided"}), 400

    users_ref = realtime_db.child('users')
    user_data = users_ref.child(user_id).get()

    if not user_data or not isinstance(user_data, dict):
      return jsonify({"msg": f"User {user_id} not found"}), 404

    users_ref.child(user_id).update(updated_user_data)
    return jsonify({"msg": "User updated successfully", "user": updated_user_data}), 200
  except Exception as e:
    print(f"Error encountered while updating user: {e}")
    return jsonify({"msg": "Error updating user", "error": str(e)}), 500

@app.route("/api/v1/delete_user/<user_id>", methods=["DELETE"])
def delete_user(user_id):
  try:
    users_ref = realtime_db.child('users')
    user_data = users_ref.child(user_id).get()

    if not user_data:
      return jsonify({'msg': "User not found"}), 404
    
    users_ref.child(user_id).delete()
    return jsonify({"msg": "User deleted successfully"}), 200
  except Exception as e:
    print(f"Error encountered while deleting user: {e}")
    return jsonify({"msg": "Error deleting user", "error": str(e)}), 500 

@app.route("/api/v1/upload_images", methods=["GET"])
def upload_images_to_storage():
  try:
      users_ref = realtime_db.child('users')
      users_data = users_ref.get()

      base_dir = os.path.dirname(os.path.abspath(__file__))
      image_dir = os.path.join(base_dir, "../../assets/faces")

      if not users_data:
        return jsonify({"msg": "No data available"}), 404
      
      for index, (user_id, user_data) in enumerate(users_data.items(), start=1):
          if not isinstance(user_data, dict):
            print(f"Skipping invalid user data for user ID: {user_id}")
            continue

          image_file_name = f"{index}.jpg"
          image_file_path = os.path.join(image_dir, image_file_name)
          image_file_path = os.path.normpath(image_file_path)

          storage_blob = bucket.blob(f"profile_images/{user_id}.jpg")
          if storage_blob.exists():
              image_url = storage_blob.public_url
              users_ref.child(user_id).update({
                'profileImageURL': image_url
              })
              print(f"Profile image already exists for user {user_id}. URL updated.")
          else:
            if os.path.exists(image_file_path):
                image_url = upload_image_to_firebase(image_file_path, user_id)
                print(f"Uploaded image for user {user_id} successfully")
                users_ref.child(user_id).update({
                    'profileImageURL': image_url
                })
                print(f"Updated profileImageURL for user {user_id}")
            else:
                print(f"Image file {image_file_path} not found for user {user_id}")

      return jsonify({"msg": "Images uploaded successfully"}), 200
  except Exception as e:
        print(f"Error encountered: {e}")
        return jsonify({"msg": "Error uploading image", "error": str(e)}), 500

@app.route("/api/v1/add_status_field", methods=["GET"])
def add_status_field():
    try:
        users_ref = realtime_db.child('users')
        users_data = users_ref.get()

        if not users_data:
            return jsonify({"msg": "No data available"}), 404
        
        for user_id, user_data in users_data.items():
            if not isinstance(user_data, dict):
                print(f"Skipping invalid user data for user ID: {user_id}")
                continue

            users_ref.child(str(user_id)).update({'status': 1})
            print(f"Status added for user {user_id}.")

        return jsonify({"msg": "Status added successfully"}), 200
    
    except Exception as e:
        print(f"Error encountered: {e}")
        return jsonify({"msg": "Error adding status field", "error": str(e)}), 500

@app.route("/api/v1/change_status/<user_id>", methods=["PUT"])
def change_status(user_id):
  try:
     request_data = request.get_json()
     status = request_data.get("status")
     
     if not status:
        return jsonify({"msg": "Status is required"}), 400
     
     users_ref = realtime_db.child('users')
     user_data = users_ref.child(user_id).get()

     if not user_data or not isinstance(user_data, dict):
       return jsonify({"msg": f"User {user_id} not found"}), 404
     
     if status == 1:
      users_ref.child(user_id).update({"status": -1})
      updated_user = users_ref.child(user_id).get()
      return jsonify({"msg": "User disabled successfully", "user": updated_user}), 200
     else:
      users_ref.child(user_id).update({"status": 1})
      updated_user = users_ref.child(user_id).get()
      return jsonify({"msg": "User enabled successfully", "user": updated_user}), 200
     
  except Exception as e:
    print(f"Error encountered while changing status for user {user_id}: {e}")
    return jsonify({"msg": "Error changing status", "error": str(e)}), 500

@app.route("/api/v1/calc_attractiveness", methods=["GET"])
def calc_attractiveness():
  try:
    users_ref = realtime_db.child('users')
    users_data = users_ref.get()

    if not users_data:
       return jsonify({"msg": "No data available"}), 404
    
    for (user_id, user_data) in users_data.items():
      if not isinstance(user_data, dict):
        print(f"Skipping invalid user data for user ID: {user_id}")
        continue

      profileImageURL = user_data['profileImageURL']    
      attractiveness = process_image(profileImageURL)
      users_ref.child(user_id).update({
         'attractiveness': attractiveness
      })
      print(f"Updated attractiveness for user {user_id}")

    return jsonify({"msg": "Attractiveness calculated successfully"}), 200
  except Exception as e:
    print(f"Error encountered: {e}")
    return jsonify({"msg": "Error calculating attrativeness", "error": str(e)}), 500

@app.route("/api/v1/calc_attractiveness/<user_id>", methods=["GET"])
def calc_attractiveness_by_user(user_id):
  try:
    users_ref = realtime_db.child('users')
    user_data = users_ref.child(user_id).get()

    if not user_data or not isinstance(user_data, dict):
       return jsonify({"msg": f"User {user_id} not found"}), 404
    
    profile_image_url = user_data.get('profileImageURL')
    if not profile_image_url:
       return jsonify({"msg": f"User {user_id} does not have a profile image"}), 400
    
    attractiveness = process_image(profile_image_url)
    users_ref.child(user_id).update({
      'attractiveness': attractiveness
    })

    return jsonify({
      "msg": "Attractiveness calculated successfully",
      "user_id": user_id,
      "attractiveness": attractiveness
    }), 200
  except Exception as e:
    print(f"Error encountered while calculating attractiveness for user {user_id}: {e}")
    return jsonify({"msg": "Error calculating attrativeness", "error": str(e)}), 500