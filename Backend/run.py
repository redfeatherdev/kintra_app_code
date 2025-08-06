from app import app
from app.api import event
from app.api.payment import payment_bp
from app.api.booking_route import booking_bp 
from app.api.media import media_bp

app.register_blueprint(payment_bp, url_prefix="/api/v1")
app.register_blueprint(booking_bp, url_prefix="/api/v1")  
print("Registering media_bp under /api/v1")
app.register_blueprint(media_bp, url_prefix='/api/v1')

if __name__ == "__main__":
    app.run(debug=True)
