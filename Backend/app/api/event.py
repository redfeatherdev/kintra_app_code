from flask import Blueprint, request, jsonify
from app import realtime_db
import uuid
from datetime import datetime

# Define a blueprint for events
event_bp = Blueprint('event_bp', __name__)

def slugify(text: str) -> str:
    return text.strip().replace(" ", "_").lower()

@event_bp.route("/api/v1/events", methods=["POST"])
def create_event():
    data = request.get_json()
    event_id = slugify(data.get("name"))

    
    event_data = {
        "name": data.get("name"),
        "event_date": data.get("event_date"),
        "location": data.get("location"),
        "max_tickets": int(data.get("max_tickets", 0)),
        "vip_limit": int(data.get("vip_limit", 0)),
        "created_by": data.get("created_by"),
        "rsvps": {},
        "booked_normal": 0,
        "booked_vip": 0
    }


    realtime_db.child("events").child(event_id).set(event_data)
    return jsonify({"msg": "Event created", "event_id": event_id}), 201


# Get upcoming events
@event_bp.route("/api/v1/events/upcoming", methods=["GET"])
def get_upcoming_events():
    all_events = realtime_db.child("events").get()
    now = datetime.utcnow().isoformat()

    upcoming = []
    if all_events:
        for event_id, event in all_events.items():
            if event.get("event_date") > now:
                event["event_id"] = event_id
                event["booked_normal"] = int(event.get("booked_normal", 0))
                event["booked_vip"] = int(event.get("booked_vip", 0))
                event["available_normal"] = int(event.get("max_tickets", 0)) - event["booked_normal"]
                event["available_vip"] = int(event.get("vip_limit", 0)) - event["booked_vip"]
                upcoming.append(event)

    return jsonify(upcoming), 200


# Get past events
@event_bp.route("/api/v1/events/past", methods=["GET"])
def get_past_events():
    all_events = realtime_db.child("events").get()
    now = datetime.utcnow().isoformat()

    past = []
    if all_events:
        for event_id, event in all_events.items():
            if event.get("event_date") <= now:
                event["event_id"] = event_id
                past.append(event)

    return jsonify(past), 200

# RSVP to an event
@event_bp.route("/api/v1/events/<event_id>/rsvp", methods=["POST"])
def rsvp_event(event_id):
    data = request.get_json()
    user_id = data.get("user_id")
    if not user_id:
        return jsonify({"msg": "user_id is required"}), 400

    realtime_db.child("events").child(event_id).child("rsvps").update({user_id: True})
    return jsonify({"msg": "RSVP successful"}), 200

# Get event ticket stats
@event_bp.route("/api/v1/events/<event_id>/stats", methods=["GET"])
def get_event_stats(event_id):
    event = realtime_db.child("events").child(event_id).get()
    if not event:
        return jsonify({"msg": "Event not found"}), 404

    stats = {
        "event_id": event_id,
        "name": event.get("name"),
        "location": event.get("location"),
        "event_date": event.get("event_date"),
        "max_tickets": int(event.get("max_tickets", 0)),
        "vip_limit": int(event.get("vip_limit", 0)),
        "booked_normal": int(event.get("booked_normal", 0)),
        "booked_vip": int(event.get("booked_vip", 0))
    }
    stats["available_normal"] = stats["max_tickets"] - stats["booked_normal"]
    stats["available_vip"] = stats["vip_limit"] - stats["booked_vip"]

    return jsonify(stats), 200

# Book ticket for event
@event_bp.route("/api/v1/events/<event_id>/book", methods=["POST"])
def book_ticket(event_id):
    data = request.get_json()
    name = data.get("name")
    age = data.get("age")
    gender = data.get("gender")
    seat_type = data.get("seat_type")  # 'normal' or 'vip'

    if not all([name, age, gender, seat_type]):
        return jsonify({"msg": "All fields are required"}), 400

    event = realtime_db.child("events").child(event_id).get()
    if not event:
        return jsonify({"msg": "Event not found"}), 404

    if seat_type == "normal":
        if int(event.get("booked_normal", 0)) >= int(event.get("max_tickets", 0)):
            return jsonify({"msg": "No normal tickets available"}), 400
        event["booked_normal"] = int(event.get("booked_normal", 0)) + 1
    elif seat_type == "vip":
        if int(event.get("booked_vip", 0)) >= int(event.get("vip_limit", 0)):
            return jsonify({"msg": "No VIP tickets available"}), 400
        event["booked_vip"] = int(event.get("booked_vip", 0)) + 1
    else:
        return jsonify({"msg": "Invalid seat type"}), 400

    ticket_id = str(uuid.uuid4())
    ticket_data = {
        "ticket_id": ticket_id,
        "name": name,
        "age": age,
        "gender": gender,
        "seat_type": seat_type,
        "booked_at": datetime.utcnow().isoformat()
    }

    realtime_db.child("events").child(event_id).child("tickets").child(ticket_id).set(ticket_data)
    realtime_db.child("events").child(event_id).update({
        "booked_normal": event.get("booked_normal"),
        "booked_vip": event.get("booked_vip")
    })

    return jsonify({"msg": "Ticket booked", "ticket_id": ticket_id}), 200

# Delete an event by ID
@event_bp.route("/api/v1/events/<event_id>", methods=["DELETE"])
def delete_event(event_id):
    event_ref = realtime_db.child("events").child(event_id)
    event = event_ref.get()

    if not event:
        return jsonify({"msg": "Event not found"}), 404

    event_ref.delete()
    return jsonify({"msg": f"Event {event_id} deleted successfully"}), 200


@event_bp.route("/api/v1/events/<event_id>", methods=["GET"])
def get_event(event_id):
    event = realtime_db.child("events").child(event_id).get()
    if not event:
        return jsonify({"msg": "Event not found"}), 404

    event["event_id"] = event_id
    return jsonify(event), 200


# Get list of registered attendees for an event
@event_bp.route("/api/v1/events/<event_id>/attendees", methods=["GET"])
def get_event_attendees(event_id):
    event = realtime_db.child("events").child(event_id).get()
    if not event:
        return jsonify({"msg": "Event not found"}), 404

    tickets = event.get("tickets", {})
    attendees = []

    for ticket_id, ticket_info in tickets.items():
        attendee = {
            "ticket_id": ticket_id,
            "name": ticket_info.get("name"),
            "age": ticket_info.get("age"),
            "gender": ticket_info.get("gender"),
            "seat_type": ticket_info.get("seat_type"),
            "booked_at": ticket_info.get("booked_at")
        }
        attendees.append(attendee)

    return jsonify(attendees), 200
