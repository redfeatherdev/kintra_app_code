import os
import json

from flask import request, jsonify
from app import app, bucket, realtime_db
from app.utils.total import parse_kml
from app.utils.notification import *
from werkzeug.utils import secure_filename

@app.route("/api/v1/get_regions", methods=["GET"])
def get_regions():
  try:
    base_dir = os.path.dirname(os.path.abspath(__file__))
    regions_dir = os.path.join(base_dir, "../../assets/Region Locations.kml")

    regions = parse_kml(regions_dir)
    return jsonify({"regions": regions}), 200
  except Exception as e:
    print(f"Error encountered fetching regions")
    return jsonify({"msg": "Error fetching regions"}), 500

@app.route("/api/v1/get_notifications", methods=["GET"])
def get_notifications():
  try:
    notifications_ref = realtime_db.child('notifications')
    notifications_data = notifications_ref.get()

    if not notifications_data:
      return jsonify({"msg": "No notifications found"}), 404
    
    notifications_list = [{"id": notification_id, **notification_data} for notification_id, notification_data in notifications_data.items() if isinstance(notifications_data, dict)]

    search_query = request.args.get("search", "").strip().lower()

    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 10))

    if search_query:
      notifications_list = [
        notification for notification in notifications_list
        if search_query in str(notification.get("name", "")).lower()
        or search_query in str(notification.get("title", "")).lower()
        or search_query in str(notification.get("content", "")).lower()
      ]

    total_count = len(notifications_list)
    start_index = (page - 1) * limit
    end_index = start_index + limit
    paginated_notifications = notifications_list[start_index:end_index]

    return jsonify({"msg": "Notifications fetched successfully", "count": total_count, "notifications": paginated_notifications})
  except Exception as e:
    print(f"Error encountered while fetching notifications: {e}")
    return jsonify({"msg": "Error fetching admins"}), 500

@app.route("/api/v1/add_notification", methods=["POST"])
def add_notification():
  try:
    name = request.form.get('name')
    title = request.form.get('title')
    content = request.form.get('content')
    users = request.form.get('users')
    app_notification_settings = request.form.get('appNotificationSettings')

    users = json.loads(users) if users else []
    app_notification_settings = json.loads(app_notification_settings) if app_notification_settings else {}

    seen = {user: False for user in users}

    if 'imgFile' in request.files:
      img_file = request.files['imgFile']
      if img_file:
        filename = secure_filename(img_file.filename)
        blob = bucket.blob(f'notification/{filename}')
        blob.upload_from_file(img_file)
        blob.make_public()
        img_url = blob.public_url
        app_notification_settings['imgUrl'] = img_url

    notification_data = {
      "name": name,
      "title": title,
      "content": content,
      "seen": seen,
    }

    if app_notification_settings:
      notification_data['appNotificationSettings'] = app_notification_settings

    ref = realtime_db.child('notifications')
    ref.push(notification_data)

    return jsonify({"msg": "Notification added successfully"}), 200
    
  except Exception as e:
    print(f"Error encountered adding notification due to {e}")
    return jsonify({"msg": "Error encountered adding notification"}), 500

@app.route("/api/v1/delete_notification/<notification_id>", methods=["DELETE"])
def delete_notification(notification_id):
  try:
    notifications_ref = realtime_db.child('notifications')
    notification_data = notifications_ref.child(notification_id).get()

    if not notification_data:
      return jsonify({'msg': "Notification not found"}), 404
    
    notifications_ref.child(notification_id).delete()
    return jsonify({"msg": "Notification deleted successfully"}), 200
  except Exception as e:
    print(f"Error encountered while deleting notification: {e}")
    return jsonify({"msg": "Error deleting notification", "error": str(e)}), 500 