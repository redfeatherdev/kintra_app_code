# import os
# import cv2
# # import dlib
# import gdown
# import requests
# import numpy as np
# import tensorflow_addons as tfa

# from tensorflow.keras.models import load_model

# base_dir = os.path.dirname(os.path.abspath(__file__))
# MODEL_URL = 'https://drive.google.com/file/d/1b_tgLV-m7kiVQarKXHpth6paQjwQA89y'
# MODEL_PATH = os.path.join(base_dir, "../../assets/pre-trained_weights/model_inception_facial_keypoints.h5")
# THRESHOLD = 0.4

# labels = [
#     '5_o_Clock_Shadow', 'Arched_Eyebrows', 'Attractive', 'Bags_Under_Eyes', 
#     'Bald', 'Bangs', 'Big_Lips', 'Big_Nose', 'Black_Hair', 'Blond_Hair', 
#     'Blurry', 'Brown_Hair', 'Bushy_Eyebrows', 'Chubby', 'Double_Chin', 
#     'Eyeglasses', 'Goatee', 'Gray_Hair', 'Heavy_Makeup', 'High_Cheekbones', 
#     'Male', 'Mouth_Slightly_Open', 'Mustache', 'Narrow_Eyes', 'No_Beard', 
#     'Oval_Face', 'Pale_Skin', 'Pointy_Nose', 'Receding_Hairline',
#     'Rosy_Cheeks', 'Sideburns', 'Smiling', 'Straight_Hair', 'Wavy_Hair', 
#     'Wearing_Earrings', 'Wearing_Hat', 'Wearing_Lipstick', 'Wearing_Necklace', 
#     'Wearing_Necktie', 'Young'
# ]

# def download_model(url, output_path):
#   dir_path = os.path.dirname(output_path)
#   if not os.path.exists(dir_path):
#     os.makedirs(dir_path)
#   gdown.download(url, output_path, quiet=False)

# def load_face_model():
#   if not os.path.isfile(MODEL_PATH):
#     download_model(MODEL_URL, MODEL_PATH)
#   return load_model(MODEL_PATH, custom_objects={"Adamw": tfa.optimizers.AdamW}, compile=False)

# detector = dlib.get_frontal_face_detector()
# model = load_face_model()

# def calculate_attractiveness(output, gender):
#   attribute_weights = {
#     'male': {
#       'positive': {
#         'Smiling': 0.6, 'High_Cheekbones': 0.5, 'Young': 0.7, 
#         'Attractive': 0.8, 'Straight_Hair': 0.4, 'Wavy_Hair': 0.4, 
#         'Arched_Eyebrows': 0.3, 'Rosy_Cheeks': 0.4, 'Black_Hair': 0.3
#       },
#       'negative': {
#         'Bags_Under_Eyes': -0.5, 'Gray_Hair': -0.4, 'Chubby': -0.5,
#         'Double_Chin': -0.6, 'Receding_Hairline': -0.6, 'Big_Nose': -0.4,
#         'Pointy_Nose': -0.3, 'Blurry': -0.2, 'Narrow_Eyes': -0.4
#       }
#     },
#     'female': {
#       'positive': {
#         'Smiling': 0.7, 'High_Cheekbones': 0.6, 'Young': 0.8, 
#         'Attractive': 0.9, 'Straight_Hair': 0.4, 'Wavy_Hair': 0.4, 
#         'Arched_Eyebrows': 0.5, 'Rosy_Cheeks': 0.5, 'Black_Hair': 0.3
#       },
#       'negative': {
#         'Bags_Under_Eyes': -0.4, 'Gray_Hair': -0.5, 'Chubby': -0.6,
#         'Double_Chin': -0.6, 'Receding_Hairline': -0.5, 'Big_Nose': -0.4,
#         'Pointy_Nose': -0.3, 'Blurry': -0.2, 'Narrow_Eyes': -0.3
#       }
#     }
#   }

#   gender_key = 'male' if gender == 'male' else 'female'
#   positive_weights = attribute_weights[gender_key]['positive']
#   negative_weights = attribute_weights[gender_key]['negative']

#   score = 5.0

#   for i, prob in enumerate(output[0]):
#       attribute = labels[i]
#       if attribute in positive_weights:
#           score += prob * positive_weights[attribute]
#       elif attribute in negative_weights:
#           score += prob * negative_weights[attribute]

#   return max(1, min(10, round(score, 1)))

# def process_faces(image, dets):
#   for _, det in enumerate(dets, start=1):
#     crop_image = image[det.top():det.bottom(), det.left():det.right()]
#     image_batch = np.zeros((1, 128, 128, 3))
#     image_batch[0] = cv2.resize(crop_image, (128, 128)) / 256

#     output = model.predict(image_batch)

#     male_index = labels.index('Male')
#     gender = "male" if output[0][male_index] > 0.5 else "female"

#     rating = calculate_attractiveness(output, gender)

#     return rating

# def process_image(image_url):
#   try:
#     response = requests.get(image_url, stream=True)
#     if response.status_code != 200:
#       print(f"Error: Failed to download image from {image_url}")
#       return
    
#     image_array = np.asanyarray(bytearray(response.content), dtype=np.uint8)
#     img = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

#     if img is None:
#       print(f"Error: Could not load image from {image_url}.")
#       return
    
#     resized_image = cv2.resize(img, (img.shape[1] // 2, img.shape[0] // 2))
#     rgb_image = cv2.cvtColor(resized_image, cv2.COLOR_BGR2RGB)

#     dets = detector(rgb_image, 1) if detector else []

#     attractiveness = process_faces(rgb_image, dets)
#     return attractiveness
    
#   except Exception as e:
#     print(f"Error processing image from URL {image_url}: {e}")

# process_image("https://storage.googleapis.com/kintr-dc6a8.firebasestorage.app/profile_images/007b8bea-5270-49b3-997a-b707a7577482.jpg")