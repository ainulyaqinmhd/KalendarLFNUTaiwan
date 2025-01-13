from flask import Flask, jsonify, request
from datetime import datetime
import calendar

app = Flask(__name__)

# Define a dictionary to store the Hijri offset values
hijri_offsets = {}


# Define a function to generate the calendar data
def generate_calendar(year, month, hijri_offset):
    # Create a calendar object
    cal = calendar.monthcalendar(year, month)

    # Initialize an empty list to store the calendar data
    calendar_data = []

    # Iterate over the weeks in the month
    for week in cal:
        # Initialize an empty list to store the days in the week
        week_data = []

        # Iterate over the days in the week
        for day in week:
            # If the day is 0, it means it's not in the current month
            if day == 0:
                week_data.append(None)
            else:
                # Create a datetime object for the day
                date = datetime(year, month, day)

                # Calculate the Hijri date
                hijri_date = date + datetime.timedelta(days=hijri_offset)

                # Append the day data to the week data
                week_data.append(
                    {
                        "gregorian": date.strftime("%Y-%m-%d"),
                        "hijri": hijri_date.strftime("%Y-%m-%d"),
                    }
                )

        # Append the week data to the calendar data
        calendar_data.append(week_data)

    # Return the calendar data
    return calendar_data


# Define a route to get the calendar data
@app.route("/get-calendar", methods=["GET"])
def get_calendar():
    # Get the year and month from the query parameters
    year = int(request.args.get("year"))
    month = int(request.args.get("month"))

    # Get the Hijri offset value from the query parameters
    hijri_offset = int(request.args.get("hijri_offset", 0))

    # Generate the calendar data
    calendar_data = generate_calendar(year, month, hijri_offset)

    # Return the calendar data as JSON
    return jsonify(calendar_data)


# Define a route to set the Hijri offset value
@app.route("/set-hijri-offset", methods=["POST"])
def set_hijri_offset():
    # Get the Hijri offset value from the request body
    hijri_offset = int(request.json["hijri_offset"])

    # Store the Hijri offset value in the dictionary
    hijri_offsets["hijri_offset"] = hijri_offset

    # Return a success message
    return jsonify({"message": "Hijri offset value set successfully"})


# Run the application
if __name__ == "__main__":
    app.run(debug=True)
