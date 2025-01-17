from flask import jsonify, Blueprint, request, send_file
import joblib
import pandas as pd
from db import get_connection
import logging
from tensorflow.keras.preprocessing import image
import tensorflow as tf
import os
import numpy as np
import matplotlib.pyplot as plt
import io
import base64

ai_route = Blueprint('ai_route', __name__)

wafer_model = tf.keras.models.load_model('Big250116/my_flask_app/wafer defect classification.keras')

@ai_route.route('/upload_pkl', methods=['POST'])
def upload_pkl():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and file.filename.endswith('.pkl'):
        try:
            df = pd.read_pickle(file)
            # Convert ndarray objects to lists
            df = df.applymap(lambda x: x.tolist() if isinstance(x, np.ndarray) else x)
            return jsonify({
                'columns': df.columns.tolist(),
                'data': df.to_dict(orient='records')
            })
        except Exception as e:
            return jsonify({'error': f'Failed to load pickle file: {str(e)}'}), 500
    return jsonify({'error': 'Invalid file format'}), 400

@ai_route.route('/wafer_map', methods=['POST'])
def get_wafer_map():
    try:
        wafer_map = request.json['waferMap']
        wafer_map = np.array(wafer_map)
        plt.imshow(wafer_map, cmap='Purples')
        buf = io.BytesIO()
        plt.savefig(buf, format='png')
        buf.seek(0)
        img_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
        return jsonify({'image': img_base64})
    except Exception as e:
        return jsonify({'error': f'Failed to generate wafer map: {str(e)}'}), 500

@ai_route.route('/predict', methods=['POST'])
def predict():
    try:
        wafer_maps = request.json['waferMaps']
        wafer_maps = np.array(wafer_maps)
        new_x = np.zeros((len(wafer_maps), 26, 26, 3))
        for w in range(len(wafer_maps)):
            for i in range(26):
                for j in range(26):
                    new_x[w, i, j, int(wafer_maps[w, i, j])] = 1
        predictions = wafer_model.predict(new_x)
        class_labels = ['Center', 'Donut', 'Edge-Loc', 'Edge-Ring', 'Loc', 'Near-full', 'Random', 'Scratch', 'none']
        decoded_predictions = [class_labels[np.argmax(pred)] for pred in predictions]
        return jsonify({'predictions': decoded_predictions})
    except Exception as e:
        return jsonify({'error': f'Failed to predict patterns: {str(e)}'}), 500