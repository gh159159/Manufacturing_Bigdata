from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("mainpage.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/contact")
def contact():
    return render_template("contact.html")

@app.route("/login")
def login():
    return render_template("login.html")

@app.route("/id-class")
def idclass():
    return render_template("id-class.html")

@app.route("/layout")
def layout():
    return render_template("layout.html")

@app.route("/front")
def front():
    return render_template("front.html")


if __name__ == "__main__":
    app.run(debug=True)