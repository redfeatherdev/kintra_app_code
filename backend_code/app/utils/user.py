import random

from app import bucket
from datetime import datetime, timedelta

def upload_image_to_firebase(file_path, user_id):
  try:
    blob = bucket.blob(f"profile_images/{user_id}.jpg")
    blob.upload_from_filename(file_path)
    blob.make_public()
    return blob.public_url
  except Exception as e:
    print(f"Error uploading image for user {user_id}: {e}")

def filter_likes_by_period(likes_received, period='day'):
  current_time = datetime.now()

  if period == 'day':
    delta = timedelta(days=1)
  elif period == 'week':
    delta = timedelta(days=7)
  elif period == 'month':
    delta = timedelta(days=30)
  elif period == '6months':
    delta = timedelta(days=182)
  elif period == 'year':
    delta = timedelta(days=365)

  period_start = current_time - delta

  filtered_likes = [
    timestamp for timestamp in likes_received
    if datetime.strptime(timestamp, '%Y-%m-%d %H:%M:%S') > period_start
  ]
  return len(filtered_likes)