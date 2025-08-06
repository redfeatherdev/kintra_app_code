

from flask import Blueprint, request, jsonify
import stripe
from app.firebase_helpers import create_payment_document
from app.firebase_helpers import create_booking_document 
from app import realtime_db  
import uuid
from datetime import datetime, timezone

payment_bp = Blueprint("payment", __name__)

stripe.api_key = ''


# Function to create a payment document (no change needed)
def create_payment_document(payment_id, amount, currency, status):
    payment_doc = {
        'paymentId': payment_id,
        'amount': amount,
        'currency': currency,
        'status': status,
        'createdAt': datetime.now(timezone.utc).isoformat(),
        'updatedAt': datetime.now(timezone.utc).isoformat()
    }
    realtime_db.child("payments").child(payment_id).set(payment_doc)

def slugify(text: str) -> str:
    return text.strip().replace(" ", "_").lower()

# Function to create a booking document using Realtime Database
def create_booking_document(event_id, name, age, gender, seat_type, amount):
    booking_id = str(uuid.uuid4())

    booking_doc = {
        'eventId': slugify(event_id),
        'eventName': event_id,  # 👈 Optional: store original name for display
        'name': name,
        'age': age,
        'gender': gender,
        'seatType': seat_type,
        'amount': amount,
        'status': 'pending',
        'createdAt': datetime.now(timezone.utc).isoformat(),
        'updatedAt': datetime.now(timezone.utc).isoformat()
    }

    realtime_db.child("bookings").child(booking_id).set(booking_doc)
    return booking_id

@payment_bp.route("/bookings/initiate", methods=["POST"])
def initiate_booking():
    # Print when the endpoint is hit
    print("Received request for /bookings/initiate")
    
    data = request.json
    
    # Print the received data
    print(f"Received data: {data}")
    
    # Validate the necessary fields
    required_fields = ['name', 'age', 'gender', 'seat_type', 'event_id', 'amount']
    for field in required_fields:
        if field not in data:
            print(f"Missing required field: {field}")
            return jsonify({"detail": f"{field} is required"}), 400

    try:
        # Print that we're about to create a booking
        print("Creating booking document in Realtime Database")
        
        booking_id = create_booking_document(
            event_id=data['event_id'],
            name=data['name'],
            age=data['age'],
            gender=data['gender'],
            seat_type=data['seat_type'],
            amount=data['amount']
        )
        
        # Print the booking ID after creation
        print(f"Booking created successfully with ID: {booking_id}")

        # Return the booking ID for later use in checkout session creation
        return jsonify({"booking_id": booking_id}), 201

    except Exception as e:
        # Print the error if there is one
        print(f"Error creating booking: {str(e)}")
        return jsonify({"detail": f"Error creating booking: {str(e)}"}), 500


@payment_bp.route("/create-checkout-session", methods=["POST", "OPTIONS"])
def create_checkout_session():
    if request.method == "OPTIONS":
        return '', 200

    data = request.json
    amount = data.get("amount")
    booking_id = data.get("booking_id")  

    if not amount:
        return jsonify({"detail": "Amount is required"}), 400
    if not booking_id:
        return jsonify({"detail": "Booking ID is required"}), 400

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {'name': 'Event Ticket'},
                    'unit_amount': int(amount),
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url="http://localhost:5173/success",
            cancel_url="http://localhost:5173/cancel",
            shipping_address_collection={
                'allowed_countries': ['US'] 
            },
            payment_intent_data={
                "metadata": {
                    "booking_id": booking_id  # ← Attach booking_id to the PaymentIntent
                }
            }
        )
        return jsonify({"checkoutUrl": session.url})
    except Exception as e:
        return jsonify({"detail": str(e)}), 400

@payment_bp.route("/create-payment-intent", methods=["POST"])
def create_payment_intent():
    data = request.json
    amount = data.get("amount")

    if not amount:
        return jsonify({"detail": "Amount is required"}), 400

    try:
        intent = stripe.PaymentIntent.create(
            amount=int(amount),
            currency='usd',
            automatic_payment_methods={'enabled': True},
        )
        return jsonify({"clientSecret": intent.client_secret})
    except Exception as e:
        return jsonify({"detail": str(e)}), 400


@payment_bp.route("/webhook", methods=["POST"])
def stripe_webhook():
    print("Webhook received from Stripe")

    payload = request.get_data(as_text=False)
    sig_header = request.headers.get("stripe-signature")
    endpoint_secret = "whsec_kszJzWPepqIpvejK1N1QIj805lbhb5s8"

    try:
        print(f"Payload received: {payload}")
        print(f"Stripe Signature: {sig_header}")

        # Verify the event
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)

        print(f"Event received: {event['type']}")

    except ValueError as e:
        print(f"Invalid payload: {str(e)}")
        return jsonify({"detail": f"Invalid payload: {str(e)}"}), 400
    except stripe.error.SignatureVerificationError as e:
        print(f"Invalid signature: {str(e)}")
        return jsonify({"detail": f"Invalid signature: {str(e)}"}), 400

    if event["type"] == "payment_intent.succeeded":
        intent = event["data"]["object"]
        booking_id = intent.get("metadata", {}).get("booking_id")

        if booking_id:
            print(f"Payment successful for booking ID: {booking_id}")

            # Get booking data
            booking = realtime_db.child("bookings").child(booking_id).get()
            if not booking:
                print(f"No booking record found for ID: {booking_id}")
                return jsonify({"detail": "Booking not found"}), 404

            event_id = booking.get("eventId")
            seat_type = booking.get("seatType")

            # Get event data
            event_ref = realtime_db.child("events").child(event_id)
            event_data = event_ref.get()

            if not event_data:
                print(f"Event {event_id} not found for booking {booking_id}")
                return jsonify({"detail": "Event not found"}), 404

            # Update the event's seat count
            if seat_type == "normal":
                current = int(event_data.get("booked_normal", 0))
                event_ref.update({"booked_normal": current + 1})
                print(f"Incremented booked_normal to {current + 1}")
            elif seat_type == "vip":
                current = int(event_data.get("booked_vip", 0))
                event_ref.update({"booked_vip": current + 1})
                print(f"Incremented booked_vip to {current + 1}")
            else:
                print(f"Unknown seat type: {seat_type}")
                return jsonify({"detail": f"Unknown seat type: {seat_type}"}), 400

            # Update booking status
            realtime_db.child("bookings").child(booking_id).update({
                "status": "successful",
                "updatedAt": datetime.utcnow().isoformat()
            })

            # Create payment record
            create_payment_document(
                payment_id=intent["id"],
                amount=intent["amount"],
                currency=intent["currency"],
                status=intent["status"],
            )

            print(f"Booking {booking_id} marked as successful, event seats updated")

        else:
            print("No booking ID found in metadata")

    return jsonify({"status": "success"})


@payment_bp.route("/bookings", methods=["GET"])
def get_all_bookings():
    try:
        bookings_snapshot = realtime_db.child("bookings").get()
        if bookings_snapshot:
            return jsonify(bookings_snapshot), 200
        else:
            return jsonify({"message": "No bookings found"}), 404
    except Exception as e:
        print(f"Error fetching bookings: {str(e)}")
        return jsonify({"detail": f"Error fetching bookings: {str(e)}"}), 500


@payment_bp.route("/payments", methods=["GET"])
def get_all_payments():
    try:
        payments_snapshot = realtime_db.child("payments").get()
        if payments_snapshot:
            return jsonify(payments_snapshot), 200
        else:
            return jsonify({"message": "No payments found"}), 404
    except Exception as e:
        print(f"Error fetching payments: {str(e)}")
        return jsonify({"detail": f"Error fetching payments: {str(e)}"}), 500


@payment_bp.route("/bookings/<string:booking_id>", methods=["DELETE"])
def delete_booking(booking_id):
    try:
        booking_ref = realtime_db.child("bookings").child(booking_id)
        if booking_ref.get() is not None:
            booking_ref.delete()
            return jsonify({"message": f"Booking {booking_id} deleted successfully."}), 200
        else:
            return jsonify({"detail": "Booking not found"}), 404
    except Exception as e:
        print(f"Error deleting booking: {str(e)}")
        return jsonify({"detail": f"Error deleting booking: {str(e)}"}), 500


@payment_bp.route("/payments/<string:payment_id>", methods=["DELETE"])
def delete_payment(payment_id):
    try:
        payment_ref = realtime_db.child("payments").child(payment_id)
        if payment_ref.get() is not None:
            payment_ref.delete()
            return jsonify({"message": f"Payment {payment_id} deleted successfully."}), 200
        else:
            return jsonify({"detail": "Payment not found"}), 404
    except Exception as e:
        print(f"Error deleting payment: {str(e)}")
        return jsonify({"detail": f"Error deleting payment: {str(e)}"}), 500


@payment_bp.route("/bookings/clear", methods=["DELETE"])
def clear_all_bookings():
    try:
        bookings_snapshot = realtime_db.child("bookings").get()
        if bookings_snapshot:
            for booking_id in bookings_snapshot.keys():
                realtime_db.child("bookings").child(booking_id).delete()
            return jsonify({"message": "All bookings cleared successfully."}), 200
        else:
            return jsonify({"message": "No bookings to delete."}), 200
    except Exception as e:
        print(f"Error clearing bookings: {str(e)}")
        return jsonify({"detail": f"Error clearing bookings: {str(e)}"}), 500

@payment_bp.route("/payments/clear", methods=["DELETE"])
def clear_all_payments():
    try:
        payments_snapshot = realtime_db.child("payments").get()
        if payments_snapshot:
            for payment_id in payments_snapshot.keys():
                realtime_db.child("payments").child(payment_id).delete()
            return jsonify({"message": "All payments cleared successfully."}), 200
        else:
            return jsonify({"message": "No payments to delete."}), 200
    except Exception as e:
        print(f"Error clearing payments: {str(e)}")
        return jsonify({"detail": f"Error clearing payments: {str(e)}"}), 500
