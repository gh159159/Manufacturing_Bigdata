from flask import jsonify, Blueprint, request
import joblib
import numpy as np

ai_route = Blueprint('ai_route', __name__)

lin_reg = joblib.load('Big250110/static/models/linear_model.pkl')
rf_reg = joblib.load('Big250110/static/models/rf_model.pkl')

@ai_route.route('/predict-house-price', methods=['GET'])
def predictHousePrice():
    area = float(request.args.get('area'))
    rooms = int(request.args.get('rooms'))
    year_built = int(request.args.get('year_built'))
    income = float(request.args.get('income'))
    school_rating = int(request.args.get('school_rating'))
    transit_score = int(request.args.get('transit_score'))

    features = np.array([[area, rooms, year_built, income, school_rating, transit_score]])

    lin_reg_prediction = lin_reg.predict(features)[0]
    rf_reg_prediction = rf_reg.predict(features)[0]
    
    return jsonify({
        "message": "OK",
        "price_by_lin": lin_reg_prediction,
        "price_by_rf": rf_reg_prediction
    })