import streamlit as st
from streamlit_webrtc import webrtc_streamer, RTCConfiguration
import av
import cv2
import os
from cvzone.PoseModule import PoseDetector
import cvzone
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)

# Paths to the resources
button_r_path = "button.png"
button_l_path = "button.png"
shirt_path = "Shirts"

# Ensure resource files are in the correct path
if not os.path.exists(button_r_path) or not os.path.exists(shirt_path):
    st.error("Resource files not found. Make sure button.png and Shirts directory are uploaded.")
    st.stop()

# Load button images
try:
    button_r = cv2.imread(button_r_path, cv2.IMREAD_UNCHANGED)
    button_l = cv2.flip(button_r, 1)
    logging.debug("Loaded button images successfully.")
except Exception as e:
    st.error(f"Error loading button images: {e}")
    logging.error(f"Error loading button images: {e}")
    st.stop()

# Define shirt information (image filenames and prices)
shirt_info = [
    {"image": "1.png", "price": "₹500"},
    {"image": "2.png", "price": "₹750"},
    {"image": "3.png", "price": "₹600"},
    {"image": "4.png", "price": "₹500"},
    {"image": "5.png", "price": "₹750"},
    {"image": "6.png", "price": "₹600"},
]

# Initialize pose detector
detector = PoseDetector()
logging.debug("PoseDetector initialized.")

# Define the VideoProcessor class
class VideoProcessor:
    def __init__(self):
        self.counter_r = 0
        self.counter_l = 0
        self.img_num = 0
        self.shirt_info = shirt_info

    def recv(self, frame):
        logging.debug("Frame received.")
        frm = frame.to_ndarray(format="bgr24")

        img = detector.findPose(frm, draw=False)
        lmList, bboxInfo = detector.findPosition(img, bboxWithHands=False, draw=False)

        if lmList:
            logging.debug(f"Landmarks detected: {lmList}")
            lm16 = lmList[16]  # Index finger landmark
            lm19 = lmList[19]  # Thumb landmark

            # Check if the index finger is within the left button region
            left_button_region = (0, 100, 200, 500)  # Adjust as per your frame size
            right_button_region = (875 - 200, 100, 200, 500)  # Adjust as per your frame size
            
            if left_button_region[0] < lm16[0] < left_button_region[0] + left_button_region[2] and \
                    left_button_region[1] < lm16[1] < left_button_region[1] + left_button_region[3]:
                self.counter_r += 1
                cv2.ellipse(img, (139, 360), (66, 66), 0, 0, self.counter_r * 7, (0, 255, 0), 20)
                if self.counter_r * 7 > 360:
                    self.counter_r = 0
                    if self.img_num < len(self.shirt_info) - 1:
                        self.img_num += 1

            # Check if the thumb is within the right button region
            elif right_button_region[0] < lm19[0] < right_button_region[0] + right_button_region[2] and \
                    right_button_region[1] < lm19[1] < right_button_region[1] + right_button_region[3]:
                self.counter_l += 1
                cv2.ellipse(img, (1138, 
