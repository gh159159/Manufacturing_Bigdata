import cv2
import numpy as np

# Pre-trained model and configuration files for MobileNet-SSD
prototxt_path = "deploy.prototxt"
model_path = "mobilenet_iter_73000.caffemodel"

# Load the model
net = cv2.dnn.readNetFromCaffe(prototxt_path, model_path)

# Load the video
video_path = "people.mp4"  # MP4 파일 경로
cap = cv2.VideoCapture(video_path)

# Initialize person class ID for MobileNet-SSD
person_class_id = 15  # MobileNet-SSD에서 "person" 클래스의 ID는 15입니다.

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break
    
    # Resize frame for faster processing
    height, width = frame.shape[:2]
    blob = cv2.dnn.blobFromImage(frame, scalefactor=0.007843, size=(300, 300), mean=(127.5, 127.5, 127.5), swapRB=True)
    
    # Pass the blob through the network
    net.setInput(blob)
    detections = net.forward()
    
    person_count = 0
    
    for i in range(detections.shape[2]):
        confidence = detections[0, 0, i, 2]
        if confidence > 0.5:  # Confidence threshold
            class_id = int(detections[0, 0, i, 1])
            if class_id == person_class_id:
                person_count += 1
                box = detections[0, 0, i, 3:7] * np.array([width, height, width, height])
                (x_start, y_start, x_end, y_end) = box.astype("int")
                
                # Draw bounding box around detected person
                cv2.rectangle(frame, (x_start, y_start), (x_end, y_end), (0, 255, 0), 2)
                cv2.putText(frame, "Person", (x_start, y_start - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
    
    # Display the person count on the frame
    cv2.putText(frame, f"Persons: {person_count}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    print(f"Detected persons: {person_count}")
    cv2.imshow("Video", frame)
    
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
