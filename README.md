# Library Management System (Flask + MySQL)

A web-based Library Management System developed using **Python (Flask)** and **MySQL**.  
This project allows users to view and issue books, while admins can manage the library inventory.

---

## 🔹 Features

### 👤 User Features
- User Signup & Login
- View available books
- Issue books
- View issued books
- Return books
- Logout

### 🛠 Admin Features
- Admin login (role-based)
- Add new books
- View all books
- Issue & return tracking

---

## 🔹 Tech Stack

- **Backend:** Python (Flask)
- **Frontend:** HTML, CSS
- **Database:** MySQL
- **Tools:** VS Code, MySQL Workbench, GitHub

---

## 🔹 Project Structure

library-management-system/
│
├── app.py
├── README.md
│
├── templates/
│ ├── base.html
│ ├── dashboard.html
│ ├── login.html
│ ├── signup.html
│ ├── books.html
│ ├── add_book.html
│ └── my_books.html
│
├── static/
│ └── css/
│ └── style.css
│
└── database/
└── (MySQL – managed via MySQL Workbench)

---

## 🔹 Database Schema

### users
- id (Primary Key)
- name
- email (Unique)
- password
- role (user / admin)

### books
- id (Primary Key)
- title
- author

### issues
- id (Primary Key)
- user_id (Foreign Key)
- book_id (Foreign Key)
- status (issued / returned)

---

## 🔹 How to Run the Project

### 1️⃣ Install dependencies
```bash
pip install flask mysql-connector-python