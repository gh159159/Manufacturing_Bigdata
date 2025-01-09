from flask import Flask, jsonify, render_template,request, redirect, url_for
import os
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_diabetes
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
import mysql.connector

app = Flask(__name__)

def get_db_connection():
    return mysql.connector.connect(
        host='localhost',
        user='root',
        password='159159',
        database='helloworld'
    )

@app.route("/detail-user")
def detailUser():
    user_idx = request.args.get('user_idx')
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM user where user_idx=%s", (user_idx,))
        users = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(users)
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/')
def main():
    return render_template('main.html')

@app.route('/jsbasic')
def js():
    return render_template('js-basic.html')

@app.route('/todo-detail')
def td():
    id = request.args.get('id')
    userid = request.args.get('userid')
    title = request.args.get('title')
    completed = request.args.get('completed')

    return render_template(
        'detail-todo.html',
        todo_id=id,
        todo_userid=userid,
        todo_title=title,
        todo_completed=completed,
        )

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if username == 'admin' and password == '1234':
            return redirect(url_for('main'))
        else:
            error = 'Invalid Credentials. Please try again.'
            return render_template('login.html', error=error)
    return render_template('login.html')

@app.route('/study')
def study():
    diabetes = load_diabetes()
    X = diabetes.data
    y = diabetes.target
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = LinearRegression()
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)

    plt.figure(figsize=(10, 6))
    plt.scatter(y_test, y_pred, color='blue', label='Predicted vs Actual')
    plt.plot([min(y_test), max(y_test)], [min(y_test), max(y_test)], color='red', linewidth=2, label='Ideal Fit')
    plt.xlabel('Actual')
    plt.ylabel('Predicted')
    plt.legend()
    image_path = os.path.join('C:/Users/gh159/Desktop/제조빅데이터/Big250108/Front_prac/static/images/diabetes_prediction.png')
    plt.savefig(image_path)
    plt.close()
    return render_template('study.html', mse=mse, r2=r2)

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/project')
def project():
    return render_template('project.html')

@app.route('/database')
def database():
    return render_template('database.html')


if __name__ == '__main__':
    app.run(debug=True)