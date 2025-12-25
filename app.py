import mysql.connector
from flask import Flask, render_template, request, redirect, url_for, session

# --------------------------------------------------
# APP CONFIG
# --------------------------------------------------
app = Flask(__name__)
app.secret_key = "library_secret_key"

# --------------------------------------------------
# MYSQL CONFIG (CHANGE PASSWORD)
# --------------------------------------------------
DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "khuljasimsim",  # 🔴 change this
    "database": "library_management"
}


def get_db_connection():
    return mysql.connector.connect(**DB_CONFIG)


# --------------------------------------------------
# AUTH ROUTES
# --------------------------------------------------

@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        name = request.form["name"]
        email = request.form["email"]
        password = request.form["password"]

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute(
            "INSERT INTO users (name, email, password, role) VALUES (%s, %s, %s, %s)",
            (name, email, password, "user")
        )

        conn.commit()
        cursor.close()
        conn.close()

        return redirect(url_for("login"))

    return render_template("signup.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form["email"]
        password = request.form["password"]

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            "SELECT * FROM users WHERE email=%s AND password=%s",
            (email, password)
        )

        user = cursor.fetchone()

        cursor.close()
        conn.close()

        if user:
            session["user_id"] = user["id"]
            session["role"] = user["role"]
            return redirect(url_for("dashboard"))

    return render_template("login.html")


@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))


# --------------------------------------------------
# DASHBOARD
# --------------------------------------------------

@app.route("/")
def dashboard():
    if "user_id" not in session:
        return redirect(url_for("login"))
    return render_template("dashboard.html")


# --------------------------------------------------
# BOOK ROUTES
# --------------------------------------------------

@app.route("/books")
def books():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM books")
    books = cursor.fetchall()

    cursor.close()
    conn.close()

    return render_template("books.html", books=books)


@app.route("/add-book", methods=["GET", "POST"])
def add_book():
    if session.get("role") != "admin":
        return redirect(url_for("books"))

    if request.method == "POST":
        title = request.form["title"]
        author = request.form["author"]

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute(
            "INSERT INTO books (title, author) VALUES (%s, %s)",
            (title, author)
        )

        conn.commit()
        cursor.close()
        conn.close()

        return redirect(url_for("books"))

    return render_template("add_book.html")


# --------------------------------------------------
# ISSUE / RETURN
# --------------------------------------------------

@app.route("/issue/<int:book_id>")
def issue_book(book_id):
    if "user_id" not in session:
        return redirect(url_for("login"))

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO issues (user_id, book_id, status) VALUES (%s, %s, %s)",
        (session["user_id"], book_id, "issued")
    )

    conn.commit()
    cursor.close()
    conn.close()

    return redirect(url_for("my_books"))


@app.route("/my-books")
def my_books():
    if "user_id" not in session:
        return redirect(url_for("login"))

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT issues.id, books.title, books.author
        FROM issues
        JOIN books ON books.id = issues.book_id
        WHERE issues.user_id=%s AND issues.status='issued'
    """, (session["user_id"],))

    books = cursor.fetchall()

    cursor.close()
    conn.close()

    return render_template("my_books.html", books=books)


@app.route("/return/<int:issue_id>")
def return_book(issue_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "UPDATE issues SET status='returned' WHERE id=%s",
        (issue_id,)
    )

    conn.commit()
    cursor.close()
    conn.close()

    return redirect(url_for("my_books"))


# --------------------------------------------------
# RUN APPLICATION (ONLY ONE MAIN BLOCK)
# --------------------------------------------------
if __name__ == "__main__":
   app.run(debug=True)