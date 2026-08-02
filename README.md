# RoadWatch AI 

AI-Powered Smart Mobility Infrastructure Monitoring System

---

## Overview

RoadWatch AI is a smart mobility infrastructure monitoring platform designed to detect road damages such as potholes and cracks using AI-based computer vision.

The system helps citizens report road issues, enables authorities to manage maintenance operations efficiently, and improves transparency between citizens and government departments.

----

## Problem Statement

Poor road infrastructure leads to:

* Traffic congestion
* Unsafe commuting conditions
* Vehicle damage
* Delayed maintenance operations
* Lack of transparency in complaint handling

Traditional road inspection methods are manual, time-consuming, and inefficient.

---

## Solution

RoadWatch AI provides:

* AI-powered pothole and crack detection
* Complaint management with offline sync support
* Authority-based complaint routing
* Interactive map-based monitoring
* Smart road hazard heatmaps
* Dangerous road zone visualization
* Repair transparency tracking
* Severity prediction and analytics

---

## Key Features

### Citizen Portal

* Register/Login
* Upload road images/videos
* Report complaints with map location
* Offline complaint submission and auto-sync
* Track complaint status
* View road transparency details

### Authority Dashboard

* View assigned complaints
* Update repair status
* Manage maintenance workflows
* Track repair history
* Monitor dangerous road zones
* Heatmap-based infrastructure monitoring

### Admin Dashboard

* City-wide analytics
* Complaint statistics
* Severity distribution
* Authority monitoring
* Heatmap and hotspot analysis
* Infrastructure transparency tracking

---

## Tech Stack

* Frontend: React.js
* Backend: Flask REST API
* Database: PostgreSQL
* AI/ML: YOLOv8, OpenCV
* Authentication: JWT
* Maps: OpenStreetMap, Leaflet

---

## AI Model

RoadWatch AI uses a YOLOv8-based computer vision model to detect:

* Potholes
* Road cracks
* Damage severity levels

---

## System Workflow

1. Citizens upload road images/videos with location details.
2. The YOLOv8 AI model analyzes the uploaded media.
3. Road damages and severity levels are detected automatically.
4. Complaints are routed to the responsible authority.
5. Authorities manage repairs and update complaint status.
6. Admin monitors overall infrastructure analytics and hotspot regions.

---

## Smart Mobility Features

* Interactive city monitoring maps
* Smart road hazard heatmaps
* Dangerous road zone identification
* Complaint analytics and hotspot tracking
* Road transparency system
* AI-assisted maintenance insights

---

## Road Transparency Feature

Citizens can access detailed road transparency information including:

* Assigned authority
* Contractor details
* Maintenance history
* Budget allocation
* Budget utilization
* Last repair information

This improves transparency between citizens and government authorities.

---

## Offline Support

RoadWatch AI supports offline complaint submission.

If internet connectivity is unavailable, complaints are temporarily stored locally and automatically synced once the network connection is restored.

---

## Installation

### Backend

```bash
pip install -r requirements.txt
python app.py
```

### Frontend

```bash
npm install
npm start
```

---

## Demo Video

(Link: https://youtu.be/U-Fc_jmFB7E)

---



## Future Scope

* Predictive maintenance
* Waterlogging detection
* Drone inspection
* CCTV integration
* Smart traffic connectivity
* Mobile application support

---

## Note

Due to deployment resource limitations and large AI model size, the complete AI inference pipeline is demonstrated locally within the prototype environment.

---

## Team

* A. Dinesh Kumar
* CH. Praveen
* Sarvesh B
* P. Nihal Reddy

---


