
from flask import Blueprint, jsonify, request
from app import realtime_db  

booking_bp = Blueprint("booking_bp", __name__)  

@booking_bp.route("/bookings/by-event/<event_id>", methods=["GET"])
def get_bookings_by_event(event_id):
    try:
        all_bookings_snapshot = realtime_db.child("bookings").get()
        all_bookings = all_bookings_snapshot.val() if hasattr(all_bookings_snapshot, 'val') else all_bookings_snapshot

        matched_users = []

        for booking_id, data in all_bookings.items():
            # Ensure key exists and status is successful
            if data.get("eventId") == event_id and data.get("status") == "successful":
                matched_users.append(data)

        return jsonify(matched_users), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
