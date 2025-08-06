from flask import Blueprint, request, jsonify
import uuid
from datetime import datetime

support_bp = Blueprint('support_bp', __name__)

@support_bp.route("/api/v1/support/tickets", methods=["POST"])
def create_ticket():
    # Import here to avoid circular imports
    from app import realtime_db
    
    data = request.get_json()
    ticket_id = str(uuid.uuid4())

    ticket_data = {
        "ticket_id": ticket_id,
        "created_by": data.get("user_id"),
        "created_at": datetime.utcnow().isoformat(),
        "status": "open",
        "messages": {},  # Changed to empty dict for Firebase
        "last_activity": datetime.utcnow().isoformat()
    }

    realtime_db.child("supportTickets").child(ticket_id).set(ticket_data)
    return jsonify({"msg": "Ticket created", "ticket_id": ticket_id}), 201


@support_bp.route("/api/v1/support/tickets/<ticket_id>/message", methods=["POST"])
def add_message(ticket_id):
    from app import realtime_db
    
    data = request.get_json()
    message = {
        "sender": data.get("sender"),
        "text": data.get("text"),
        "timestamp": datetime.utcnow().isoformat(),
        "sender_type": "admin" if data.get("sender", "").lower().startswith("admin") else "user"
    }

    # Add message to messages collection
    ticket_ref = realtime_db.child("supportTickets").child(ticket_id).child("messages")
    ticket_ref.push(message)
    
    # Update last activity
    realtime_db.child("supportTickets").child(ticket_id).child("last_activity").set(datetime.utcnow().isoformat())
    
    return jsonify({"msg": "Message added", "message": message}), 200


@support_bp.route("/api/v1/support/tickets/<ticket_id>/messages", methods=["GET"])
def get_messages(ticket_id):
    """Fetch messages for a specific ticket"""
    from app import realtime_db
    
    try:
        messages_data = realtime_db.child("supportTickets").child(ticket_id).child("messages").get() or {}
        
        # Convert Firebase data to list
        messages_list = []
        for key, message in messages_data.items():
            if isinstance(message, dict):
                message['id'] = key  # Add Firebase key as message ID
                messages_list.append(message)
        
        # Sort messages by timestamp
        messages_list.sort(key=lambda x: x.get('timestamp', ''))
        
        return jsonify(messages_list), 200
    except Exception as e:
        print(f"Error fetching messages: {str(e)}")
        return jsonify({"error": str(e)}), 500


@support_bp.route("/api/v1/support/tickets", methods=["GET"])
def get_tickets():
    """Get all tickets (for admin dashboard)"""
    from app import realtime_db
    
    try:
        status_filter = request.args.get("status")  # "open" or "closed"
        all_tickets = realtime_db.child("supportTickets").get() or {}
        filtered = []

        for ticket_id, ticket in all_tickets.items():
            if isinstance(ticket, dict):
                if not status_filter or ticket.get("status") == status_filter:
                    ticket["ticket_id"] = ticket_id
                    
                    # Get message count
                    messages = ticket.get("messages", {})
                    ticket["message_count"] = len(messages) if isinstance(messages, dict) else 0
                    
                    # Get last message preview
                    if messages:
                        last_msg = max(messages.values(), key=lambda x: x.get('timestamp', '')) if isinstance(messages, dict) else None
                        ticket["last_message"] = last_msg.get('text', '')[:50] + '...' if last_msg else ''
                    else:
                        ticket["last_message"] = "No messages yet"
                    
                    filtered.append(ticket)

        # Sort by last activity (newest first)
        filtered.sort(key=lambda x: x.get('last_activity', ''), reverse=True)
        
        return jsonify(filtered), 200
    except Exception as e:
        print(f"Error fetching tickets: {str(e)}")
        return jsonify({"error": str(e)}), 500


@support_bp.route("/api/v1/support/tickets/<ticket_id>/status", methods=["PUT"])
def update_ticket_status(ticket_id):
    """Update ticket status (open/closed)"""
    from app import realtime_db
    
    try:
        data = request.get_json()
        new_status = data.get("status")
        
        if new_status not in ["open", "closed"]:
            return jsonify({"error": "Invalid status. Must be 'open' or 'closed'"}), 400
        
        realtime_db.child("supportTickets").child(ticket_id).child("status").set(new_status)
        realtime_db.child("supportTickets").child(ticket_id).child("last_activity").set(datetime.utcnow().isoformat())
        
        return jsonify({"msg": f"Ticket status updated to {new_status}"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@support_bp.route("/api/v1/support/tickets/<ticket_id>", methods=["GET"])
def get_ticket_details(ticket_id):
    """Get details of a specific ticket"""
    from app import realtime_db
    
    try:
        ticket_data = realtime_db.child("supportTickets").child(ticket_id).get()
        
        if not ticket_data:
            return jsonify({"error": "Ticket not found"}), 404
        
        ticket_data["ticket_id"] = ticket_id
        return jsonify(ticket_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Debug endpoint to see all data
@support_bp.route("/api/v1/support/debug", methods=["GET"])
def debug_support():
    """Debug endpoint to see all support data"""
    from app import realtime_db
    
    try:
        all_data = realtime_db.child("supportTickets").get() or {}
        return jsonify(all_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@support_bp.route("/api/v1/support/user/<user_id>/tickets", methods=["GET"])
def get_user_tickets(user_id):
    from app import realtime_db

    try:
        all_tickets = realtime_db.child("supportTickets").get() or {}
        user_tickets = []

        for ticket_id, ticket in all_tickets.items():
            if isinstance(ticket, dict) and ticket.get("created_by") == user_id:
                ticket["ticket_id"] = ticket_id
                user_tickets.append(ticket)

        user_tickets.sort(key=lambda x: x.get('last_activity', ''), reverse=True)
        return jsonify(user_tickets), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500



@support_bp.route("/api/v1/support/tickets/<ticket_id>", methods=["DELETE"])
def delete_ticket(ticket_id):
    """Delete a ticket and all its messages"""
    from app import realtime_db

    try:
        ticket_data = realtime_db.child("supportTickets").child(ticket_id).get()

        if not ticket_data:
            return jsonify({"error": "Ticket not found"}), 404

        print(f"Deleting ticket: {ticket_id}")

        # ✅ Clear the ticket data using `.set({})` for Pyrebase compatibility
        realtime_db.child("supportTickets").child(ticket_id).set({})

        return jsonify({"msg": f"Ticket {ticket_id} deleted successfully"}), 200
    except Exception as e:
        print(f"🔥 Error deleting ticket {ticket_id}: {str(e)}")
        return jsonify({"error": str(e)}), 500


