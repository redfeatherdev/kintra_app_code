from app.firebase import realtime_db
from datetime import datetime, timezone

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

def create_booking_document(event_id, name, age, gender, seat_type, amount):
    booking_doc = {
        'eventId': event_id,
        'name': name,
        'age': age,
        'gender': gender,
        'seatType': seat_type,
        'amount': amount,
        'status': 'pending',
        'createdAt': datetime.now(timezone.utc).isoformat(),
        'updatedAt': datetime.now(timezone.utc).isoformat()
    }
    # Firebase auto-generates document ID
    booking_ref = realtime_db.child("bookings").push(booking_doc)
    return booking_ref["name"]  # "name" key returned from push() is the new ID


def create_media_document(media_id, caption, url, media_type):
    media_doc = {
        'id': media_id,
        'caption': caption,
        'type': media_type,
        'url': url,
        'active': True,  
        'createdAt': datetime.now(timezone.utc).isoformat(),
        'updatedAt': datetime.now(timezone.utc).isoformat()
    }
    realtime_db.child("media_posts").child(media_id).set(media_doc)


def create_blog_document(blog_id, title, content):
    blog_doc = {
        'id': blog_id,
        'title': title,
        'content': content,
        'active': True,  
        'createdAt': datetime.now(timezone.utc).isoformat(),
        'updatedAt': datetime.now(timezone.utc).isoformat()
    }
    realtime_db.child("blog_posts").child(blog_id).set(blog_doc)


def create_banner_document(url):
    banner_doc = {
        'url': url,
        'active': True,  
        'uploadedAt': datetime.now(timezone.utc).isoformat()
    }
    realtime_db.child("promo_banner").set(banner_doc)
