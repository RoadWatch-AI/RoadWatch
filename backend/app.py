from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.utils import secure_filename
from ultralytics import YOLO
import os
from flask_jwt_extended import (
    JWTManager,
    create_access_token
)

import bcrypt

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
app.config["JWT_SECRET_KEY"] = "roadwatch_secret_key"

jwt = JWTManager(app)

db = SQLAlchemy(app)

# =========================================================
#                    AI MODEL
# =========================================================

model = YOLO("models/YOLOv8_Small_RDD.pt")

CLASS_MAPPING = {

    0: "Crack",
    1: "Crack",
    2: "Crack",
    3: "Pothole"

}

# =========================================================
#                    TABLES
# =========================================================

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
#               IMAGE SERVING ROUTE
# =========================================================

@app.route('/uploads/<path:filename>')
def uploaded_file(filename):

    return send_from_directory(
        app.config['UPLOAD_FOLDER'],
        filename
    )

# =========================================================
#                    AUTH APIs
# =========================================================

@app.route("/signup", methods=["POST"])
def signup():

    data = request.json

    name = data.get("name")

    email = data.get("email")

    phone = data.get("phone")

    password = data.get("password")

    # ---------------- CHECK EXISTING USER ----------------

    existing_user = User.query.filter_by(
        email=email
    ).first()

    if existing_user:

        return jsonify({

            "message": "Email already exists"

        }), 400

    # ---------------- HASH PASSWORD ----------------

    hashed_password = bcrypt.hashpw(

        password.encode("utf-8"),

        bcrypt.gensalt()

    ).decode("utf-8")

    # ---------------- CREATE USER ----------------

    new_user = User(

        name=name,

        email=email,

        phone=phone,

        password=hashed_password,

        role="USER"

    )

    db.session.add(new_user)

    db.session.commit()

    return jsonify({

        "message": "Signup successful"

    }), 201


@app.route("/login", methods=["POST"])
def login():

    data = request.json

    email = data.get("email")

    password = data.get("password")

    # ---------------- FIND USER ----------------

    user = User.query.filter_by(
        email=email
    ).first()

    if not user:

        return jsonify({

            "message": "Invalid email"

        }), 401

    # ---------------- VERIFY PASSWORD ----------------

    password_correct = bcrypt.checkpw(

        password.encode("utf-8"),

        user.password.encode("utf-8")

    )

    if not password_correct:

        return jsonify({

            "message": "Invalid password"

        }), 401

    # ---------------- CREATE JWT TOKEN ----------------

    access_token = create_access_token(

        identity={

            "id": user.id,

            "email": user.email,

            "role": user.role

        }

    )

    return jsonify({

        "message": "Login successful",

        "token": access_token,

        "role": user.role,

        "name": user.name

    }), 200

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

    # =========================================================
    #                    IMAGE HANDLING
    # =========================================================

    image = request.files.get("image")

    image_path = None

    issue = "AI Uncertain"

    severity = "LOW"

    confidence_score = 0

    if image:

        filename = secure_filename(image.filename)

        image_path = f"uploads/{filename}"

        image.save(
        os.path.join(
        app.config["UPLOAD_FOLDER"],
        filename
    )
)
        # =========================================================
        #                    AI DETECTION
        # =========================================================

        try:

            results = model(image_path, conf=0.55)

            highest_conf = 0

            for result in results:

                for box in result.boxes:

                    class_id = int(box.cls[0])

                    confidence = float(box.conf[0])

                    if confidence > highest_conf:

                        highest_conf = confidence

                        confidence_score = round(confidence, 2)

                        issue = CLASS_MAPPING.get(
                            class_id,
                            "AI Uncertain"
                        )

            # -------------------- SEVERITY --------------------

            if highest_conf >= 0.85:

                severity = "HIGH"

            elif highest_conf >= 0.65:

                severity = "MEDIUM"

            else:

                severity = "LOW"

        except Exception as e:

            print("AI ERROR:", e)

            issue = "AI Uncertain"

            severity = "LOW"

    # =========================================================
    #                    STORE COMPLAINT
    # =========================================================

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

    # =========================================================
    #                    STORE AI PREDICTION
    # =========================================================

    ai_prediction = AIPrediction(

        complaint_id=new_complaint.id,

        detected_issue=issue,

        confidence_score=confidence_score,

        predicted_severity=severity

    )

    db.session.add(ai_prediction)

    db.session.commit()

    return jsonify({

        "message": "Complaint stored successfully",

        "issue": issue,

        "severity": severity,

        "image_url": image_path

    })


@app.route("/complaints", methods=["GET"])
def get_complaints():

    complaints = Complaint.query.all()

    output = []

    for complaint in complaints:

        project = None
        contractor = None
        authority = None

        # ---------------- PROJECT ----------------

        if complaint.project_id:

            project = RoadProject.query.get(
                complaint.project_id
            )

        # ---------------- CONTRACTOR ----------------

        if complaint.contractor_id:

            contractor = Contractor.query.get(
                complaint.contractor_id
            )

        # ---------------- AUTHORITY ----------------

        if complaint.authority_id:

            authority = Authority.query.get(
                complaint.authority_id
            )

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

            # ---------------- CONTRACTOR ----------------

            "contractor_name":

                contractor.contractor_name
                if contractor else "Not Assigned",

            # ---------------- AUTHORITY ----------------

            "authority_name":

                authority.authority_name
                if authority else "Not Assigned",

            # ---------------- BUDGET ----------------

            "allocated_budget":

                project.allocated_budget
                if project else 0,

            "spent_budget":

                project.spent_budget
                if project else 0,

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