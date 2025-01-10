from flask import Flask, jsonify, render_template, request, Blueprint
from db import get_connection

user_route = Blueprint('user_route', __name__)

@user_route.route('/add-user', methods=['POST'])
def addUser():
    id = request.form.get('id')
    pw = request.form.get('pw')
    nick = request.form.get('nick')
    address = request.form.get('address')
    type = request.form.get('type')

    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        query = """
            INSERT INTO user 
            (id, pw, nick, address, type, created_date)
            VALUES 
            (%s, MD5(%s), %s, %s, %s, NOW())
        """
        cursor.execute(query, (id, pw, nick, address, type))
        conn.commit()
        return jsonify({"message": "User added successfully"})
    except Exception as e:
        return jsonify({"error": str(e)})
    finally:
        cursor.close()
        conn.close()

@user_route.route('/detail-user')
def detailUser():
    user_idx = request.args.get('user_idx')
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM user where user_idx=%s", (user_idx,))
        users = cursor.fetchall()
        return jsonify(users)
    except Exception as e:
        return jsonify({"error": str(e)})
    finally:
        cursor.close()
        conn.close()