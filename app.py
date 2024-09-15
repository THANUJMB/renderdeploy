from flask import Flask, render_template, request, jsonify
import pandas as pd
import numpy as np
import pickle
import joblib

app = Flask(__name__)

# Load the saved model, scaler, and label encoders
model = joblib.load(open('random_forest_model v1.pkl', 'rb'))
scaler = pickle.load(open('scaler.pkl', 'rb'))  
label_encoders = pickle.load(open('label_encoders.pkl', 'rb'))  

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analytics')
def analytics():
    return render_template('analytics.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        print(f"Received data: {data}")

        # Extract features from the input
        actor1 = data.get('Actor1')
        actor2 = data.get('Actor2')
        director = data.get('Director')
        budget = float(data.get('Budget', 0))
        theater_count = int(data.get('TheaterCount', 0))
        popularity = float(data.get('Popularity', 0))
        duration = float(data.get('Duration', 0))

        # Encode categorical features
        actor1_encoded = label_encoders['Actor1'].transform([actor1])[0] if actor1 else 0
        actor2_encoded = label_encoders['Actor2'].transform([actor2])[0] if actor2 else 0
        director_encoded = label_encoders['Director'].transform([director])[0] if director else 0

        # Prepare numerical features
        numerical_features = np.array([budget, theater_count, popularity, duration]).reshape(1, -1)
        
        # Scale the numerical features
        scaled_numerical_features = scaler.transform(numerical_features)

        # Concatenate scaled numerical features with encoded categorical features
        features = np.hstack((scaled_numerical_features, [[actor1_encoded, actor2_encoded, director_encoded]]))

        # Make the prediction using the trained model
        prediction = model.predict(features)

        # Return the prediction as JSON
        return jsonify({'prediction': round(prediction[0], 2)})

    except ValueError as ve:
        return jsonify({'error': f"Value Error: {str(ve)}"}), 400
    except Exception as e:
        return jsonify({'error': f"Error during prediction: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
