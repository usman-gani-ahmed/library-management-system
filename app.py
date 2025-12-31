import os
import mysql.connector
from mysql.connector import errorcode
from flask import (
    Flask, render_template, request, redirect, url_for,
    session, flash, get_flashed_messages
)
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv

# Load .env if present
load_dotenv()

# --------------------------------------------------
# APP CONFIG
# --------------------------------------------------
app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET", "change_this_secret")

# --------------------------------------------------
# DB CONFIG (from env)
# --------------------------------------------------
DB_HOST = os.environ.get("DB_HOST", "localhost")
DB_USER = os.environ.get("DB_USER", "root")
DB_PASSWORD = os.environ.get("DB_PASSWORD", "")
DB_NAME = os.environ.get("DB_NAME", "library_management")

DB_CONFIG = {
    "host": DB_HOST,
    "user": DB_USER,
    "password": DB_PASSWORD,
    "database": DB_NAME,
    "auth_plugin": "mysql_native_password",
}


def get_server_connection():
    # connect without selecting a database (to create DB if needed)
    cfg = {"host": DB_HOST, "user": DB_USER, "password": DB_PASSWORD, "auth_plugin": "mysql_native_password"}
    return mysql.connector.connect(**cfg)


def get_db_connection():
    return mysql.connector.connect(**DB_CONFIG)


def init_db():
    """Create database and tables if they don't exist."""
    # 1) ensure database exists
    try:
        server_conn = get_server_connection()
        server_conn.autocommit = True
        server_cursor = server_conn.cursor()
        server_cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{DB_NAME}` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
        server_cursor.close()
        server_conn.close()
    except mysql.connector.Error as err:
        print("Error creating database:", err)
        raise

    # 2) create tables inside database
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(20) NOT NULL DEFAULT 'user'
        ) ENGINE=InnoDB;
        """)
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS books (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            author VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB;
        """)
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS issues (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            book_id INT NOT NULL,
            status VARCHAR(20) NOT NULL,
            issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            returned_at TIMESTAMP NULL DEFAULT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
        ) ENGINE=InnoDB;
        """)
        conn.commit()
    finally:
        cursor.close()
        conn.close()


# --------------------------------------------------
# Helpers & decorators
# --------------------------------------------------
def login_required(fn):
    from functools import wraps
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if "user_id" not in session:
            flash("Please login first.", "warning")
            return redirect(url_for("login"))
        return fn(*args, **kwargs)
    return wrapper


def admin_required(fn):
    from functools import wraps
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if session.get("role") != "admin":
            flash("Admin access required.", "danger")
            return redirect(url_for("books"))
        return fn(*args, **kwargs)
    return wrapper


# --------------------------------------------------
# ROUTES
# --------------------------------------------------

@app.route("/")
@login_required
def dashboard():
    return render_template("dashboard.html")


# -------- AUTH --------
@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        name = request.form.get("name", "").strip()
        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")

        if not name or not email or not password:
            flash("All fields are required.", "danger")
            return redirect(url_for("signup"))

        hashed = generate_password_hash(password)

        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO users (name, email, password, role) VALUES (%s, %s, %s, %s)",
                (name, email, hashed, "user")
            )
            conn.commit()
            flash("Account created. Please login.", "success")
            return redirect(url_for("login"))
        except mysql.connector.IntegrityError:
            flash("Email already registered. Please login.", "warning")
            return redirect(url_for("login"))
        finally:
            try:
                cursor.close()
                conn.close()
            except:
                pass

    return render_template("signup.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if user and check_password_hash(user["password"], password):
            session["user_id"] = user["id"]
            session["role"] = user["role"]
            session["user_name"] = user["name"]
            flash("Logged in successfully.", "success")
            return redirect(url_for("dashboard"))
        else:
            flash("Invalid email or password.", "danger")
            return redirect(url_for("login"))

    return render_template("login.html")


@app.route("/logout")
def logout():
    session.clear()
    flash("Logged out.", "info")
    return redirect(url_for("login"))


# -------- BOOKS --------
@app.route("/books")
def books():
    q = request.args.get("q", "").strip()
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    if q:
        like = f"%{q}%"
        cursor.execute("SELECT * FROM books WHERE title LIKE %s OR author LIKE %s ORDER BY created_at DESC", (like, like))
    else:
        cursor.execute("SELECT * FROM books ORDER BY created_at DESC")
    books = cursor.fetchall()
    cursor.close()
    conn.close()
    return render_template("books.html", books=books, q=q)


@app.route("/add-book", methods=["GET", "POST"])
@admin_required
def add_book():
    if request.method == "POST":
        title = request.form.get("title", "").strip()
        author = request.form.get("author", "").strip()
        if not title or not author:
            flash("Both title and author are required.", "danger")
            return redirect(url_for("add_book"))
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO books (title, author) VALUES (%s, %s)", (title, author))
        conn.commit()
        cursor.close()
        conn.close()
        flash("Book added.", "success")
        return redirect(url_for("books"))
    return render_template("add_book.html")


@app.route("/edit-book/<int:book_id>", methods=["GET", "POST"])
@admin_required
def edit_book(book_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    if request.method == "POST":
        title = request.form.get("title", "").strip()
        author = request.form.get("author", "").strip()
        if not title or not author:
            flash("Both title and author are required.", "danger")
            return redirect(url_for("edit_book", book_id=book_id))
        cursor.execute("UPDATE books SET title=%s, author=%s WHERE id=%s", (title, author, book_id))
        conn.commit()
        cursor.close()
        conn.close()
        flash("Book updated.", "success")
        return redirect(url_for("books"))
    else:
        cursor.execute("SELECT * FROM books WHERE id=%s", (book_id,))
        book = cursor.fetchone()
        cursor.close()
        conn.close()
        if not book:
            flash("Book not found.", "warning")
            return redirect(url_for("books"))
        return render_template("edit_book.html", book=book)


@app.route("/delete-book/<int:book_id>", methods=["POST"])
@admin_required
def delete_book(book_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM books WHERE id=%s", (book_id,))
    conn.commit()
    cursor.close()
    conn.close()
    flash("Book deleted.", "info")
    return redirect(url_for("books"))


# -------- ISSUE / RETURN --------
@app.route("/issue/<int:book_id>")
@login_required
def issue_book(book_id):
    # Prevent issuing if book already issued and not returned
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM issues WHERE book_id=%s AND status='issued'", (book_id,))
    already = cursor.fetchone()
    if already:
        cursor.close()
        conn.close()
        flash("This book is currently issued to someone else.", "warning")
        return redirect(url_for("books"))

    cursor.execute("INSERT INTO issues (user_id, book_id, status) VALUES (%s, %s, %s)",
                   (session["user_id"], book_id, "issued"))
    conn.commit()
    cursor.close()
    conn.close()
    flash("Book issued to you.", "success")
    return redirect(url_for("my_books"))


@app.route("/my-books")
@login_required
def my_books():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT issues.id AS issue_id, books.id AS book_id, books.title, books.author, issues.issued_at
        FROM issues
        JOIN books ON books.id = issues.book_id
        WHERE issues.user_id=%s AND issues.status='issued'
        ORDER BY issues.issued_at DESC
    """, (session["user_id"],))
    books = cursor.fetchall()
    cursor.close()
    conn.close()
    return render_template("my_books.html", books=books)


@app.route("/return/<int:issue_id>")
@login_required
def return_book(issue_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE issues SET status='returned', returned_at=NOW() WHERE id=%s", (issue_id,))
    conn.commit()
    cursor.close()
    conn.close()
    flash("Book returned. Thank you!", "success")
    return redirect(url_for("my_books"))


# -------- ADMIN: ISSUE RECORDS --------
@app.route("/issue-records")
@admin_required
def issue_records():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT issues.id, issues.status, issues.issued_at, issues.returned_at,
               users.name AS user_name, users.email AS user_email,
               books.title AS book_title, books.author AS book_author
        FROM issues
        JOIN users ON users.id = issues.user_id
        JOIN books ON books.id = issues.book_id
        ORDER BY issues.issued_at DESC
    """)
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return render_template("issue_records.html", rows=rows)


# --------------------------------------------------
# RUN
# --------------------------------------------------
if __name__ == "__main__":
    # initialize DB & tables if needed
    try:
        init_db()
    except Exception as e:
        print("Warning: init_db failed:", e)
    app.run(debug=True)
