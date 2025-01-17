from flask import render_template, request, jsonify, Blueprint, redirect, url_for

view_route = Blueprint('view_route', __name__)

@view_route.route("/")
def main():
    return render_template('main.html')
