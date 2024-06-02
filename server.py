from flask import Flask, render_template, request,  jsonify
import tensorflow as tf
from PIL import Image
import numpy as np
import os
import uuid  # Import the uuid module to generate unique filenames

app = Flask(__name__)

# Load the trained model
model = tf.keras.models.load_model('multi_classifi_model.keras')

# Define class names
class_names = ['apple', 'banana', 'bread', 'chappathi', 'idli', 'milk', 'orange', 'raw chicken']

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        # Get the uploaded image file
        image_file = request.files['imageFile']
        # Generate a unique filename using UUID
        unique_filename = str(uuid.uuid4()) + '.jpg'
        # Save the original image with the unique filename
        original_image_path = os.path.join('static', unique_filename)
        image_file.save(original_image_path)
        # Resize image to 28x28 pixels
        img = Image.open(image_file)
        img = img.resize((28, 28))
        # Preprocess image for prediction
        img = np.array(img.convert('L'))  # Convert to grayscale
        img = img / 255.0
        img = np.expand_dims(img, axis=0)
        img = np.expand_dims(img, axis=3)
        # Make prediction
        prediction = model.predict(img)
        predicted_class_index = np.argmax(prediction)
        predicted_class = class_names[predicted_class_index]

        # Generate nutrition information based on predicted class
        if predicted_class == "idli":
            nutrition_info = "<br><b>CALORIES:</b>37<br><b>CARBS(g):</b>8<br><b>PROTEIN(g):</b>2<br><b>FAT(g):</b>0"
        elif predicted_class == "chappathi":
            nutrition_info = "<br><b>CALORIES:</b>71<br><b>CARBS(g):</b>15<br><b>PROTEIN(g):</b>3<br><b>FAT(g):</b>0.4"
        elif predicted_class == "bread":
            nutrition_info = "<br><b>CALORIES:</b>66<br><b>CARBS(g):</b>12<br><b>PROTEIN(g):</b>2<br><b>FAT(g):</b>0.8"
        elif predicted_class == "raw chicken":
            nutrition_info = "<br><b>CALORIES:</b>165<br><b>CARBS(g):</b>0<br><b>PROTEIN(g):</b>31<br><b>FAT(g):</b>3.5"
        elif predicted_class == "milk":
            nutrition_info = "<br><b>CALORIES:</b>63<br><b>CARBS(g):</b>4.6<br><b>PROTEIN(g):</b>3.4<br><b>FAT(g):</b>2"
        elif predicted_class == "apple":
            nutrition_info = "<br><b>CALORIES:</b>95<br><b>CARBS(g):</b>25<br><b>PROTEIN(g):</b>1<br><b>FAT(g):</b>0"
        elif predicted_class == "orange":
            nutrition_info = "<br><b>CALORIES:</b>90<br><b>CARBS(g):</b>15.4<br><b>PROTEIN(g):</b>1<br><b>FAT(g):</b>0"
        elif predicted_class == "banana":
            nutrition_info = "<br><b>CALORIES:</b>110<br><b>CARBS(g):</b>28<br><b>PROTEIN(g):</b>1<br><b>FAT(g):</b>0"

        # Save the predicted image with the unique filename
        predicted_image_path = os.path.join('static', unique_filename)
        img_resized = Image.open(original_image_path)
        img_resized.save(predicted_image_path)

        # Render the result template with the predicted image
        return render_template('result_partial.html', predicted_image=predicted_image_path, predicted_class=predicted_class, nutrition_info=nutrition_info)
    else:
        # If not a POST request, render the result template without any predictions
        return render_template('result_partial.html', predicted_image='', predicted_class='', nutrition_info='')

@app.route('/correct_prediction', methods=['POST'])
def correct_prediction():
    correct_food = request.form['correctFood']
    

    # Generate nutrition information based on corrected class
    nutrition_info = get_nutrition_info(correct_food)

    return jsonify({
        'html': render_template('result_partial.html', predicted_class=correct_food, nutrition_info=nutrition_info)
    })

def get_nutrition_info(food_name):
    nutrition_data = {
        "idli": "<br><b>CALORIES:</b>37<br><b>CARBS(g):</b>8<br><b>PROTEIN(g):</b>2<br><b>FAT(g):</b>0",
        "chappathi": "<br><b>CALORIES:</b>71<br><b>CARBS(g):</b>15<br><b>PROTEIN(g):</b>3<br><b>FAT(g):</b>0.4",
        "bread": "<br><b>CALORIES:</b>66<br><b>CARBS(g):</b>12<br><b>PROTEIN(g):</b>2<br><b>FAT(g):</b>0.8",
        "raw chicken": "<br><b>CALORIES:</b>165<br><b>CARBS(g):</b>0<br><b>PROTEIN(g):</b>31<br><b>FAT(g):</b>3.5",
        "milk": "<br><b>CALORIES:</b>63<br><b>CARBS(g):</b>4.6<br><b>PROTEIN(g):</b>3.4<br><b>FAT(g):</b>2",
        "apple": "<br><b>CALORIES:</b>95<br><b>CARBS(g):</b>25<br><b>PROTEIN(g):</b>1<br><b>FAT(g):</b>0",
        "orange": "<br><b>CALORIES:</b>90<br><b>CARBS(g):</b>15.4<br><b>PROTEIN(g):</b>1<br><b>FAT(g):</b>0",
        "banana": "<br><b>CALORIES:</b>110<br><b>CARBS(g):</b>28<br><b>PROTEIN(g):</b>1<br><b>FAT(g):</b>0",
        # Add more food items here if needed
    }
    return nutrition_data.get(food_name.lower(), "<br><b>CALORIES:</b>Unknown<br><b>CARBS(g):</b>Unknown<br><b>PROTEIN(g):</b>Unknown<br><b>FAT(g):</b>Unknown")



if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
