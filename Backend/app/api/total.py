import os

from flask import jsonify
from app import app, realtime_db

from flask import jsonify
from datetime import datetime, timedelta
from collections import OrderedDict
from app import app, realtime_db
from app.utils.total import *

@app.route("/api/v1/total_users", methods=["GET"])
def get_total_users():
    try:
        users_ref = realtime_db.child('users')
        users_data = users_ref.get()

        if not users_data:
            return jsonify({"msg": "No data available"}), 404

        now = datetime.now()

        last_week = OrderedDict()
        last_month = OrderedDict()
        last_4_months = OrderedDict()
        last_6_months = OrderedDict()
        last_year = OrderedDict()

        ordered_days = [(now - timedelta(days=i)).strftime("%a") for i in range(7, 0, -1)]
        for day in ordered_days:
            last_week[day] = 0

        last_month_days = [(now - timedelta(days=i)).strftime("%d %b") for i in range(30, 0, -1)]
        for day in last_month_days:
            last_month[day] = 0

        last_4_months_keys = [(now - timedelta(days=i * 30)).strftime("%b %Y") for i in range(4, 0, -1)]
        for month in last_4_months_keys:
            last_4_months[month] = 0

        last_6_months_keys = [(now - timedelta(days=i * 30)).strftime("%b %Y") for i in range(6, 0, -1)]
        for month in last_6_months_keys:
            last_6_months[month] = 0

        last_year_keys = [(now - timedelta(days=i * 30)).strftime("%b %Y") for i in range(12, 0, -1)]
        for month in last_year_keys:
            last_year[month] = 0

        # Calculate last week's data
        for i in range(7, 0, -1):
            day = now - timedelta(days=i)

            for _, user_data in users_data.items():
                created_at_str = user_data.get("created_at", None)
                lives_in = user_data.get("livesIn", None)
                if not created_at_str or not lives_in or not isinstance(lives_in, dict):
                    continue

                try:
                    created_at = datetime.strptime(created_at_str, "%Y-%m-%d %H:%M:%S")
                except ValueError:
                    continue

                if created_at < day:
                    day_name = day.strftime("%a")
                    last_week[day_name] += 1

        # Calculate last month's data
        for i in range(30, 0, -1):
            day = now - timedelta(days=i)

            for _, user_data in users_data.items():
                created_at_str = user_data.get("created_at", None)
                lives_in = user_data.get("livesIn", None)
                if not created_at_str or not lives_in or not isinstance(lives_in, dict):
                    continue

                try:
                    created_at = datetime.strptime(created_at_str, "%Y-%m-%d %H:%M:%S")
                except ValueError:
                    continue

                if created_at < day:
                    day_name = day.strftime("%d %b")
                    last_month[day_name] += 1

        # Calculate last 4 months' data
        for i in range(4, 0, -1):
            start_of_month = (now - timedelta(days=i * 30)).replace(day=1)
            end_of_month = (start_of_month + timedelta(days=32)).replace(day=1) - timedelta(days=1)

            for _, user_data in users_data.items():
                created_at_str = user_data.get("created_at", None)
                lives_in = user_data.get("livesIn", None)
                if not created_at_str or not lives_in or not isinstance(lives_in, dict):
                    continue

                try:
                    created_at = datetime.strptime(created_at_str, "%Y-%m-%d %H:%M:%S")
                except ValueError:
                    continue

                if created_at <= end_of_month:
                    month_name = start_of_month.strftime("%b %Y")
                    last_4_months[month_name] += 1

        # Calculate last 6 months' data
        for i in range(6, 0, -1):
            start_of_month = (now - timedelta(days=i * 30)).replace(day=1)
            end_of_month = (start_of_month + timedelta(days=32)).replace(day=1) - timedelta(days=1)

            for _, user_data in users_data.items():
                created_at_str = user_data.get("created_at", None)
                lives_in = user_data.get("livesIn", None)
                if not created_at_str or not lives_in or not isinstance(lives_in, dict):
                    continue

                try:
                    created_at = datetime.strptime(created_at_str, "%Y-%m-%d %H:%M:%S")
                except ValueError:
                    continue

                if created_at <= end_of_month:
                    month_name = start_of_month.strftime("%b %Y")
                    last_6_months[month_name] += 1

        # Calculate last year' data
        for i in range(12, 0, -1):
            start_of_month = (now - timedelta(days=i * 30)).replace(day=1)
            end_of_month = (start_of_month + timedelta(days=32)).replace(day=1) - timedelta(days=1)

            for _, user_data in users_data.items():
                created_at_str = user_data.get("created_at", None)
                lives_in = user_data.get("livesIn", None)
                if not created_at_str or not lives_in or not isinstance(lives_in, dict):
                    continue

                try:
                    created_at = datetime.strptime(created_at_str, "%Y-%m-%d %H:%M:%S")
                except ValueError:
                    continue

                if created_at <= end_of_month:
                    month_name = start_of_month.strftime("%b %Y")
                    last_year[month_name] += 1

        gained_user = {
            "last_week": list(last_week.items()),
            "last_month": list(last_month.items()),
            "last_4_months": list(last_4_months.items()),
            "last_6_months": list(last_6_months.items()),
            "last_year": list(last_year.items()),
        }

        total_users = sum(
            1 for _, user_data in users_data.items()
            if user_data.get("created_at") and 
               user_data.get("livesIn") and 
               isinstance(user_data["livesIn"], dict) and 
               "latitude" in user_data["livesIn"] and 
               "longitude" in user_data["livesIn"]
        )

        return jsonify({"msg": "Success", "total_users": total_users, "gained_user": gained_user}), 200

    except Exception as e:
        print(f"Error encountered: {e}")
        return jsonify({"msg": "Error fetching data", "error": str(e)}), 500

@app.route("/api/v1/top_locations", methods=["GET"])
def get_top_locations():
    try:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        cities_dir = os.path.join(base_dir, "../../assets/Cities.kml")

        cities = parse_kml(cities_dir)
        all_locations = [loc for loc in cities if isinstance(loc.get("name"), str) and loc["name"].isalpha()]

        user_locations = fetch_user_locations(realtime_db)

        if not user_locations:
            return jsonify({"msg": "No user data available"}), 404

        location_user_counts = {loc["name"]: 0 for loc in all_locations}

        for user in user_locations:
            user_lat = user["latitude"]
            user_lon = user["longitude"]

            closest_location = get_closest_city(user_lat, user_lon)
            location_user_counts[closest_location] += 1

        location_scores = [
            {
                "name": loc["name"],
                "user_count": location_user_counts[loc["name"]]
            }
            for loc in all_locations
        ]

        sorted_locations = sorted(location_scores, key=lambda x: x["user_count"], reverse=True)

        top_10_locations = sorted_locations[:10]

        return jsonify({"msg": "Success", "top_locations": top_10_locations}), 200

    except Exception as e:
        print(f"Error encountered: {e}")
        return jsonify({"msg": "Error fetching data", "error": str(e)}), 500

@app.route("/api/v1/top_colleges", methods=["GET"])
def get_top_colleges():
    try:
        college_counts = fetch_college_counts(realtime_db)

        if not college_counts:
            return jsonify({"msg": "No college data available"}), 404

        sorted_colleges = sorted(college_counts.items(), key=lambda x: x[1], reverse=True)[:10]

        top_colleges = [{"college": college, "user_count": count} for college, count in sorted_colleges]

        return jsonify({"msg": "Success", "top_colleges": top_colleges}), 200
    except Exception as e:
        print(f"Error encountered: {e}")
        return jsonify({"msg": "Error fetching data", "error": str(e)}), 500

@app.route("/api/v1/user_locations", methods=["GET"])
def get_user_locations():
    try:
        locations = fetch_user_locations(realtime_db)

        if not locations:
            return jsonify({"msg": "No user locations found"}), 404

        return jsonify({"msg": "Success", "locations": locations}), 200
    except Exception as e:
        print(f"Error encountered: {e}")
        return jsonify({"msg": "Error fetching data", "error": str(e)}), 500

@app.route("/api/v1/recent_accounts", methods=["GET"])
def get_recent_accounts():
    try:
        recent_users_12h_count, recent_users_4h_count = fetch_recent_users(realtime_db)

        return jsonify({
            "msg": "Success", 
            "recent_users_12h_count": recent_users_12h_count, 
            "recent_users_4h_count": recent_users_4h_count
        }), 200
    except Exception as e:
        return jsonify({"msg": "Error fetching data", "error": str(e)}), 500