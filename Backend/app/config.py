from dotenv import load_dotenv

import os

load_dotenv()

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

import os

STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "your_default_stripe_secret_here")
STRIPE_PUBLISHABLE_KEY = os.getenv("STRIPE_PUBLISHABLE_KEY")
