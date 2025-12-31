# Library Management System (Flask + MySQL)

A web-based **Library Management System** developed using **Python (Flask)** and **MySQL**.  
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

```
library-management-system/
│
├── app.py
├── README.md
├── requirements.txt
├── .gitignore
├── .env.example
│
├── templates/
│   ├── base.html
│   ├── dashboard.html
│   ├── login.html
│   ├── signup.html
│   ├── books.html
│   ├── add_book.html
│   ├── edit_book.html
│   ├── my_books.html
│   └── issue_records.html
│
├── static/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── main.js
```

---

## 🔹 How to Run the Project

### 1️⃣ Install dependencies
```bash
pip install -r requirements.txt
```

### 2️⃣ Create MySQL Database
Either let the app create the database/tables automatically (it will when you run `app.py`) or run the provided SQL in MySQL Workbench to create `library_management` and the tables.

### 3️⃣ Configure Database
Copy `.env.example` to `.env` and update values:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=library_management
FLASK_SECRET=change_this_secret
```

### 4️⃣ Run the Application
```bash
python app.py
```

Open browser:
```
http://127.0.0.1:5000
```

---

## 🔹 Admin Login Setup

1. Signup as a normal user
2. Open MySQL Workbench
3. Run the following command (replace with the email you used):
```sql
UPDATE users SET role='admin' WHERE email='your_email@gmail.com';
```
4. Logout and login again

---

## 🔹 Future Enhancements
- Password hashing (already implemented)
- Book edit & delete
- Search functionality
- Pagination
- Role-based access control

---

## 🔹 Author
**Usman Gani Ahmed**  
BSc Data Science Student
