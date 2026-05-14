from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.utils import secure_filename
from ultralytics import YOLO
import os

app = Flask(__name__)
CORS(app)

# =========================================================
#                    IMAGE UPLOAD CONFIG
# =========================================================

UPLOAD_FOLDER = "uploads"

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# =========================================================
#                    DATABASE CONFIG
# =========================================================

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

# =========================================================
#                    TABLES
# =========================================================

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

    contact_person = db.Column(db.String(100))

    phone = db.Column(db.String(20))

    email = db.Column(db.String(100))

    total_projects = db.Column(db.Integer)

    total_repairs = db.Column(db.Integer)

    performance_score = db.Column(db.Float)


# -------------------- ROAD PROJECT TABLE --------------------

class RoadProject(db.Model):

    id = db.Column(db.Integer, primary_key=True)

    road_name = db.Column(db.String(100))

    road_type = db.Column(db.String(50))

    area = db.Column(db.String(100))

    contractor_id = db.Column(
        db.Integer,
        db.ForeignKey('contractor.id')
    )

    authority_id = db.Column(
        db.Integer,
        db.ForeignKey('authority.id')
    )

    allocated_budget = db.Column(db.Float)

    spent_budget = db.Column(db.Float)

    project_status = db.Column(db.String(20))

    last_repair_date = db.Column(db.DateTime)

    next_inspection_date = db.Column(db.DateTime)


# -------------------- COMPLAINT TABLE --------------------

class Complaint(db.Model):

    id = db.Column(db.Integer, primary_key=True)

    lat = db.Column(db.Float)

    lon = db.Column(db.Float)

    road_name = db.Column(db.String(100))

    road_type = db.Column(db.String(50))

    area = db.Column(db.String(100))

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

    project_id = db.Column(
        db.Integer,
        db.ForeignKey('road_project.id')
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


# -------------------- REPAIR HISTORY TABLE --------------------

class RepairHistory(db.Model):

    id = db.Column(db.Integer, primary_key=True)

    complaint_id = db.Column(
        db.Integer,
        db.ForeignKey('complaint.id')
    )

    repaired_by = db.Column(db.String(100))

    repair_date = db.Column(db.DateTime)

    remarks = db.Column(db.Text)

    repair_cost = db.Column(db.Float)


# -------------------- AI PREDICTIONS TABLE --------------------

class AIPrediction(db.Model):

    id = db.Column(db.Integer, primary_key=True)

    complaint_id = db.Column(
        db.Integer,
        db.ForeignKey('complaint.id')
    )

    detected_issue = db.Column(db.String(50))

    confidence_score = db.Column(db.Float)

    predicted_severity = db.Column(db.String(20))

    processed_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )

# =========================================================
#                    HOME ROUTE
# =========================================================

@app.route("/")
def home():
    return "RoadWatch Backend Running"


# =========================================================
#                    COMPLAINT APIs
# =========================================================

@app.route("/complaints", methods=["POST"])
def create_complaint():

    lat = request.form.get("lat")

    lon = request.form.get("lon")

    road_name = request.form.get("road_name")

    road_type = request.form.get("road_type")

    area = request.form.get("area")

    description = request.form.get("description")

    issue = request.form.get("issue")

    severity = request.form.get("severity")

    # -------------------- ROAD TYPE NORMALIZATION --------------------

    if road_type == "primary":
        road_type = "NH"

    elif road_type == "secondary":
        road_type = "SH"

    elif road_type == "tertiary":
        road_type = "MDR"

    elif road_type == "trunk":
        road_type = "NH"

    else:
        road_type = "City Road"

    # -------------------- FIND MATCHING ROAD PROJECT --------------------

    matched_project = RoadProject.query.filter_by(
        road_name=road_name
    ).first()

    authority_id = None

    contractor_id = None

    project_id = None

    if matched_project:

        authority_id = matched_project.authority_id

        contractor_id = matched_project.contractor_id

        project_id = matched_project.id

        if not area:
            area = matched_project.area

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

        area=area,

        description=description,

        image_url=image_path,

        issue=issue,

        severity=severity,

        authority_id=authority_id,

        contractor_id=contractor_id,

        project_id=project_id

    )

    db.session.add(new_complaint)

    db.session.commit()

    return jsonify({

        "message": "Complaint stored successfully",

        "matched_project": project_id,

        "authority_id": authority_id,

        "contractor_id": contractor_id

    })


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

            "area": complaint.area,

            "description": complaint.description,

            "image_url": complaint.image_url,

            "issue": complaint.issue,

            "severity": complaint.severity,

            "status": complaint.status,

            "authority_id": complaint.authority_id,

            "contractor_id": complaint.contractor_id,

            "project_id": complaint.project_id,

            "created_at": complaint.created_at

        })

    return jsonify(output)


# =========================================================
#                    ROAD PROJECT APIs
# =========================================================

@app.route("/road-projects", methods=["GET"])
def get_road_projects():

    roads = RoadProject.query.all()

    output = []

    for road in roads:

        output.append({

            "id": road.id,

            "road_name": road.road_name,

            "road_type": road.road_type,

            "area": road.area,

            "contractor_id": road.contractor_id,

            "authority_id": road.authority_id,

            "allocated_budget": road.allocated_budget,

            "spent_budget": road.spent_budget,

            "project_status": road.project_status,

            "last_repair_date": road.last_repair_date,

            "next_inspection_date": road.next_inspection_date

        })

    return jsonify(output)


# =========================================================
#                    RUN APP
# =========================================================

if __name__ == "__main__":

    with app.app_context():
        db.create_all()

    app.run(debug=True)