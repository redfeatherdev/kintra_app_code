import os
import math
import xml.etree.ElementTree as ET

from datetime import datetime, timedelta, timezone

def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    
    a = math.sin(delta_phi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    return R * c

def parse_kml(file_path):
  locations = []
  tree = ET.parse(file_path)
  root = tree.getroot()
  ns = {'kml': 'http://www.opengis.net/kml/2.2'}

  for placemark in root.findall('.//kml:Placemark', ns):
        name = placemark.find('kml:name', ns).text
        lookat = placemark.find('kml:LookAt', ns)

        if lookat:
            longitude = float(lookat.find('kml:longitude', ns).text)
            latitude = float(lookat.find('kml:latitude', ns).text)
            range = float(lookat.find('kml:range', ns).text)
            locations.append({"name": name, "longitude": longitude, "latitude": latitude, "range": range})

  return locations

def get_closest_city(user_lat, user_lon):
    base_dir = os.path.dirname(os.path.abspath(__file__))
    cities_dir = os.path.join(base_dir, "../../assets/Cities.kml")

    cities = parse_kml(cities_dir)
    all_locations = [loc for loc in cities if isinstance(loc.get("name"), str) and loc["name"].isalpha()]

    closest_city = None
    min_distance = float('inf')
    for location in all_locations:
        loc_lat = location['latitude']
        loc_lon = location['longitude']
        distance = haversine(user_lat, user_lon, loc_lat, loc_lon)

        if distance < min_distance:
            min_distance = distance
            closest_city = location["name"]

    return closest_city

def fetch_user_locations(realtime_db):
    users_ref = realtime_db.child('users')
    users_data = users_ref.get()

    if not users_data:
        return []

    user_locations = []
    for user_id, user_data in users_data.items():
        if not isinstance(user_data, dict):
            print(f"Skipping invalid user data for user ID: {user_id}")
            continue

        if 'livesIn' in user_data and isinstance(user_data['livesIn'], dict):
            lives_in = user_data['livesIn']
            if 'latitude' in lives_in and 'longitude' in lives_in:
                user_locations.append({
                    "id": user_id,
                    "latitude": lives_in['latitude'],
                    "longitude": lives_in['longitude']
                })

    return user_locations

def fetch_college_counts(realtime_db):
    users_ref = realtime_db.child('users')
    users_data = users_ref.get()

    if not users_data:
        return {}

    college_counts = {}
    for user_id, user_data in users_data.items():
        if not isinstance(user_data, dict):
            print(f"Skipping invalid user data for user ID: {user_id}")
            continue

        college = user_data.get("collegeOrSchool")
        if college:
            college_counts[college] = college_counts.get(college, 0) + 1

    return college_counts

def fetch_recent_users(realtime_db):
    users_ref = realtime_db.child('users')
    users_data = users_ref.get()

    if not users_data:
        return 0
    
    recent_users_12h_count = 0
    recent_users_4h_count = 0
    current_time = datetime.now(timezone.utc)

    for user_id, user_data in users_data.items():
        if not isinstance(user_data, dict):
            print(f"Skipping invalid user data for user ID: {user_id}")
            continue

        created_at = user_data.get("created_at")
        if created_at:
            try:
                created_time = datetime.strptime(created_at, "%Y-%m-%d %H:%M:%S").replace(tzinfo=timezone.utc)
                if current_time - created_time <= timedelta(hours=12):
                    recent_users_12h_count += 1
                if current_time - created_time <= timedelta(hours=4):
                    recent_users_4h_count += 1
            except ValueError:
                print(f"Skipping user {user_id}: Invalid 'created_at' format.")
                continue

    return recent_users_12h_count, recent_users_4h_count