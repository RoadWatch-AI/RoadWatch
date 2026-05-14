from ultralytics import YOLO

# Load model
model = YOLO("models/YOLOv8_Small_RDD.pt")

# Run prediction
results = model("test4.jpeg",conf = 0.55,save=True)

print("Detection Completed")