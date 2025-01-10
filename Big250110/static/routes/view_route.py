from flask import render_template, request, jsonify, Blueprint, redirect, url_for

view_route = Blueprint('view_route', __name__)

@view_route.route("/")
def main():
    return render_template('main.html')

@view_route.route('/jsbasic')
def js():
    return render_template('js-basic.html')

@view_route.route('/todo-detail')
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
@view_route.route('/study')
def study():
    return render_template('study.html')

@view_route.route('/login', methods=['GET', 'POST'])
def login():
    return render_template('login.html')

@view_route.route('/about')
def about():
    return render_template('about.html')

@view_route.route('/contact')
def contact():
    return render_template('contact.html')

@view_route.route('/project')
def project():
    return render_template('project.html')

@view_route.route('/database')
def database():
    return render_template('database.html')
