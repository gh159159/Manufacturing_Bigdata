import mysql.connector

# def get_connection():
#     return mysql.connector.connect(
#         host="3.36.28.140",
#         user="jmcoding",
#         password="123qwe!",
#         database="my_db"
#     )

def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="159159",
        database="helloworld"
    )
