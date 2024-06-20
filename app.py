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
shirt_path = "Shirts"

# Ensure resource files are in the correct path
if not os.path.exists(button_r_path) or not os.path.exists(shirt_path):
    st.error("Resource files not found. Make sure button.png and Shirts directory are uploaded.")
    st.stop()

# Load shirt images from the directory
def load_shirts(shirt_path):
    shirts = []
    for filename in os.listdir(shirt_path):
        if filename.endswith(".png"):
            shirt_info = {
                "image": os.path.join(shirt_path, filename),
                "price": 500  # Replace with actual price logic if available
            }
            shirts.append(shirt_info)
    return shirts

shirts = load_shirts(shirt_path)

# Initialize pose detector
detector = PoseDetector()
logging.debug("PoseDetector initialized.")

# Streamlit app title and description
st.title("Virtual Dress Try-On with Webcam")
st.write("Try on shirts virtually using your webcam!")

# Configure WebRTC for webcam and virtual try-on
if 'selected_shirt' in st.session_state:
    st.markdown("# Virtual Try-On")
    webrtc_streamer(
        key="example",
        video_processor_factory=VideoProcessor,
        rtc_configuration=RTCConfiguration(
            {"iceServers": [{"urls": ["stun:stun.l.google.com:19302"]}]}
        ),
    )
    logging.debug("WebRTC streamer initialized.")

# Display shirt gallery in three columns
st.markdown("# Shirt Gallery")

# Calculate number of rows and columns for grid display
num_cols = 3
num_rows = (len(shirts) + num_cols - 1) // num_cols

# Distribute shirts evenly across columns
for row in range(num_rows):
    cols = st.columns(num_cols)
    for col, shirt_index in zip(cols, range(row * num_cols, (row + 1) * num_cols)):
        if shirt_index < len(shirts):
            shirt = shirts[shirt_index]
            col.image(cv2.imread(shirt["image"]), caption=f"Price: ₹{shirt['price']}", width=200)
            if col.button("Try On", key=f"try_on_{shirt_index}"):
                st.session_state['selected_shirt'] = shirt_index
                st.experimental_rerun()

# Menu bar with login/signup, about us, and cart functionality
menu_options = ["Home", "Login/Signup", "About Us", "Cart"]
selected_option = st.sidebar.selectbox("Menu", menu_options)

if selected_option == "Login/Signup":
    st.subheader("Login/Signup Section")
    # Add your login/signup form or integration here
    st.write("Login/Signup form goes here.")
elif selected_option == "About Us":
    st.subheader("About Us")
    st.write("Hello! My name is Charan.")
elif selected_option == "Cart":
    st.subheader("Cart")
    if len(st.session_state.cart) == 0:
        st.write("Your cart is empty.")
    else:
        for item in st.session_state.cart:
            st.image(cv2.imread(item['image']), caption=f"Price: ₹{item['price']}", width=200)

# Calculate total price of items in the cart
total_price = sum(item['price'] for item in st.session_state.cart)

# Display total price and buy button
st.subheader("Cart Total")
st.write(f"Total: ₹{total_price}")

if st.button("Buy"):
    st.success("Purchase successful! Thank you for shopping with us.")

# Define the VideoProcessor class for virtual try-on
class VideoProcessor:
    def __init__(self):
        self.counter_r = 0
        self.counter_l = 0
        self.img_num = 0
        self.shirt_info = shirts

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
                cv2.ellipse(img, (1138, 360), (66, 66), 0, 0, self.counter_l * 7, (0, 255, 0), 20)
                if self.counter_l * 7 > 360:
                    self.counter_l = 0
                    if self.img_num > 0:
                        self.img_num -= 1
            else:
                self.counter_r = 0
                self.counter_l = 0

            lm11 = lmList[11][0:2]
            lm12 = lmList[12][0:2]

            imgShirt = cv2.imread(os.path.join(shirt_path, self.shirt_info[self.img_num]["image"]), cv2.IMREAD_UNCHANGED)
            ratio = 262 / 190  # Adjust based on your shirt dimensions
            shirt_ratio = 581 / 440  # Adjust based on your shirt dimensions
            shirt_width = int((lm11[0] - lm12[0]) * ratio)
            imgShirt = cv2.resize(imgShirt, (shirt_width, int(shirt_width * shirt_ratio)))
            scale = (lm11[0] - lm12[0]) / 190
            offset = int(44 * scale), int(48 * scale)

            try:
                img = cvzone.overlayPNG(img, imgShirt, (lm12[0] - offset[0], lm12[1] - offset[1]))
                logging.debug("Shirt overlaid on image.")
            except Exception as e:
                st.write(f"Error overlaying image: {e}")
                logging.error(f"Error overlaying image: {e}")

            # Adjust button overlay positions for 875x660 frame
            try:
                adjusted_left_x = 72
                adjusted_right_x = 875 - 72 - button_r.shape[1]
                adjusted_y = 293
                
                img = cvzone.overlayPNG(img, button_r, (adjusted_right_x, adjusted_y))
                img = cvzone.overlayPNG(img, button_r, (adjusted_left_x, adjusted_y))
                logging.debug("Buttons overlaid on image.")
            except Exception as e:
                st.write(f"Error overlaying buttons: {e}")
                logging.error(f"Error overlaying buttons: {e}")

        return av.VideoFrame.from_ndarray(img, format='bgr24')
