from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.utils import secure_filename
from ultralytics import YOLO
import os

app = Flask(__name__)
CORS(app)

# -------------------- IMAGE UPLOAD CONFIG --------------------

UPLOAD_FOLDER = "uploads"

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# -------------------- DATABASE CONFIG --------------------

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:sql%40123@localhost/roadwatch'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# -------------------- AI MODEL --------------------

model = YOLO("models/YOLOv8_Small_RDD.pt")

CLASS_MAPPING = {

    0: "Crack",
    1: "Crack",
    2: "Crack",
    3: "Pothole"

}
# -------------------- ROAD TABLE --------------------

class Road(db.Model):

    id = db.Column(db.Integer, primary_key=True)

    road_name = db.Column(db.String(100))

    road_type = db.Column(db.String(50))

    contractor = db.Column(db.String(100))

    last_repair_date = db.Column(db.String(100))

    sanctioned_amount = db.Column(db.Float)

    spent_amount = db.Column(db.Float)


# -------------------- USER TABLE --------------------

class User(db.Model):

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(100))

    email = db.Column(db.String(100), unique=True)

    phone = db.Column(db.String(20))

    password = db.Column(db.String(255))

    role = db.Column(db.String(20))

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )


# -------------------- AUTHORITY TABLE --------------------

class Authority(db.Model):

    id = db.Column(db.Integer, primary_key=True)

    authority_name = db.Column(db.String(100))

    zone = db.Column(db.String(50))

    contact_email = db.Column(db.String(100))

    phone = db.Column(db.String(20))


# -------------------- CONTRACTOR TABLE --------------------

class Contractor(db.Model):

    id = db.Column(db.Integer, primary_key=True)

    contractor_name = db.Column(db.String(100))

    budget_allocated = db.Column(db.Float)

    amount_spent = db.Column(db.Float)

    repair_count = db.Column(db.Integer)


# -------------------- COMPLAINT TABLE --------------------

class Complaint(db.Model):

    id = db.Column(db.Integer, primary_key=True)

    lat = db.Column(db.Float)

    lon = db.Column(db.Float)

    road_name = db.Column(db.String(100))

    road_type = db.Column(db.String(50))

    description = db.Column(db.Text)

    image_url = db.Column(db.Text)

    issue = db.Column(db.String(50))

    severity = db.Column(db.String(20))

    status = db.Column(
        db.String(20),
        default="ACTIVE"
    )

    authority_id = db.Column(
        db.Integer,
        db.ForeignKey('authority.id')
    )

    contractor_id = db.Column(
        db.Integer,
        db.ForeignKey('contractor.id')
    )

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )

    updated_at = db.Column(
        db.DateTime,
        server_default=db.func.now(),
        onupdate=db.func.now()
    )

    resolved_at = db.Column(db.DateTime)


# -------------------- HOME ROUTE --------------------

@app.route("/")
def home():
    return "RoadWatch Backend Running"


# =========================================================
#                    USER APIs
# =========================================================

# -------------------- SIGNUP --------------------

@app.route("/signup", methods=["POST"])
def signup():

    data = request.get_json()

    new_user = User(

        name=data["name"],

        email=data["email"],

        phone=data["phone"],

        password=data["password"],

        role=data["role"]

    )

    db.session.add(new_user)

    db.session.commit()

    return jsonify({
        "message": "User created successfully"
    })


# -------------------- GET USERS --------------------

@app.route("/users", methods=["GET"])
def get_users():

    users = User.query.all()

    output = []

    for user in users:

        output.append({

            "id": user.id,

            "name": user.name,

            "email": user.email,

            "phone": user.phone,

            "role": user.role

        })

    return jsonify(output)


# =========================================================
#                    COMPLAINT APIs
# =========================================================

# -------------------- CREATE COMPLAINT --------------------

@app.route("/complaints", methods=["POST"])
def create_complaint():

    # FORM DATA
    lat = request.form.get("lat")

    lon = request.form.get("lon")

    road_name = request.form.get("road_name")

    road_type = request.form.get("road_type")

    description = request.form.get("description")

    issue = request.form.get("issue")

    severity = request.form.get("severity")

    authority_id = request.form.get("authority_id")

    contractor_id = request.form.get("contractor_id")

    # -------------------- ROAD TYPE NORMALIZATION --------------------

    if road_type == "primary":
        road_type = "NH"

    elif road_type == "secondary":
        road_type = "SH"

    elif road_type == "tertiary":
        road_type = "MH"

    else:
        road_type = "City Road"

    # -------------------- IMAGE HANDLING --------------------

    image = request.files.get("image")

    image_path = None

    if image:

        filename = secure_filename(image.filename)

        image_path = os.path.join(
            app.config["UPLOAD_FOLDER"],
            filename
        )

        image.save(image_path)

    # -------------------- STORE COMPLAINT --------------------

    new_complaint = Complaint(

        lat=lat,

        lon=lon,

        road_name=road_name,

        road_type=road_type,

        description=description,

        image_url=image_path,

        issue=issue,

        severity=severity,

        authority_id=authority_id,

        contractor_id=contractor_id

    )

    db.session.add(new_complaint)

    db.session.commit()

    return jsonify({
        "message": "Complaint stored successfully"
    })


# -------------------- GET ALL COMPLAINTS --------------------

@app.route("/complaints", methods=["GET"])
def get_complaints():

    complaints = Complaint.query.all()

    output = []

    for complaint in complaints:

        output.append({

            "id": complaint.id,

            "lat": complaint.lat,

            "lon": complaint.lon,

            "road_name": complaint.road_name,

            "road_type": complaint.road_type,

            "description": complaint.description,

            "image_url": complaint.image_url,

            "issue": complaint.issue,

            "severity": complaint.severity,

            "status": complaint.status,

            "authority_id": complaint.authority_id,

            "contractor_id": complaint.contractor_id,

            "created_at": complaint.created_at

        })

    return jsonify(output)


# -------------------- GET SINGLE COMPLAINT --------------------

@app.route("/complaints/<int:id>", methods=["GET"])
def get_complaint(id):

    complaint = Complaint.query.get(id)

    if not complaint:
        return jsonify({
            "message": "Complaint not found"
        }), 404

    return jsonify({

        "id": complaint.id,

        "lat": complaint.lat,

        "lon": complaint.lon,

        "road_name": complaint.road_name,

        "road_type": complaint.road_type,

        "description": complaint.description,

        "image_url": complaint.image_url,

        "issue": complaint.issue,

        "severity": complaint.severity,

        "status": complaint.status

    })


# -------------------- UPDATE COMPLAINT --------------------

@app.route("/complaints/<int:id>", methods=["PUT"])
def update_complaint(id):

    complaint = Complaint.query.get(id)

    if not complaint:
        return jsonify({
            "message": "Complaint not found"
        }), 404

    data = request.get_json()

    complaint.issue = data["issue"]

    complaint.severity = data["severity"]

    complaint.description = data["description"]

    complaint.status = data["status"]

    db.session.commit()

    return jsonify({
        "message": "Complaint updated successfully"
    })


# -------------------- DELETE COMPLAINT --------------------

@app.route("/complaints/<int:id>", methods=["DELETE"])
def delete_complaint(id):

    complaint = Complaint.query.get(id)

    if not complaint:
        return jsonify({
            "message": "Complaint not found"
        }), 404

    db.session.delete(complaint)

    db.session.commit()

    return jsonify({
        "message": "Complaint deleted successfully"
    })


# =========================================================
#                    ROAD APIs
# =========================================================

# -------------------- CREATE ROAD --------------------

@app.route("/roads", methods=["POST"])
def create_road():

    data = request.get_json()

    new_road = Road(

        road_name=data["road_name"],

        road_type=data["road_type"],

        contractor=data["contractor"],

        last_repair_date=data["last_repair_date"],

        sanctioned_amount=data["sanctioned_amount"],

        spent_amount=data["spent_amount"]

    )

    db.session.add(new_road)

    db.session.commit()

    return jsonify({
        "message": "Road created successfully"
    })


# -------------------- GET ALL ROADS --------------------

@app.route("/roads", methods=["GET"])
def get_roads():

    roads = Road.query.all()

    output = []

    for road in roads:

        output.append({

            "id": road.id,

            "road_name": road.road_name,

            "road_type": road.road_type,

            "contractor": road.contractor,

            "last_repair_date": road.last_repair_date,

            "sanctioned_amount": road.sanctioned_amount,

            "spent_amount": road.spent_amount

        })

    return jsonify(output)


# -------------------- GET SINGLE ROAD --------------------

@app.route("/roads/<int:id>", methods=["GET"])
def get_road(id):

    road = Road.query.get(id)

    if not road:
        return jsonify({
            "message": "Road not found"
        }), 404

    return jsonify({

        "id": road.id,

        "road_name": road.road_name,

        "road_type": road.road_type,

        "contractor": road.contractor,

        "last_repair_date": road.last_repair_date,

        "sanctioned_amount": road.sanctioned_amount,

        "spent_amount": road.spent_amount

    })


# -------------------- UPDATE ROAD --------------------

@app.route("/roads/<int:id>", methods=["PUT"])
def update_road(id):

    road = Road.query.get(id)

    if not road:
        return jsonify({
            "message": "Road not found"
        }), 404

    data = request.get_json()

    road.road_name = data["road_name"]

    road.road_type = data["road_type"]

    road.contractor = data["contractor"]

    road.last_repair_date = data["last_repair_date"]

    road.sanctioned_amount = data["sanctioned_amount"]

    road.spent_amount = data["spent_amount"]

    db.session.commit()

    return jsonify({
        "message": "Road updated successfully"
    })


# -------------------- DELETE ROAD --------------------

@app.route("/roads/<int:id>", methods=["DELETE"])
def delete_road(id):

    road = Road.query.get(id)

    if not road:
        return jsonify({
            "message": "Road not found"
        }), 404

    db.session.delete(road)

    db.session.commit()

    return jsonify({
        "message": "Road deleted successfully"
    })


# =========================================================
#                    RUN APP
# =========================================================

if __name__ == "__main__":

    with app.app_context():
        db.create_all()

    app.run(debug=True)