from flask import Flask, jsonify, request, render_template

app = Flask(__name__)

@app.route('/')
def main():
    return render_template('main.html')

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