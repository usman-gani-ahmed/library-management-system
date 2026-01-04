/* ======================================================
   STUDENT BOOK CATALOG – FINAL FIX
====================================================== */

document.addEventListener("DOMContentLoaded", () => {

  // 1️⃣ Get identity
  const activeStudent = JSON.parse(localStorage.getItem("activeStudent"));
  const students = JSON.parse(localStorage.getItem("students") || []);

  if (!activeStudent) {
    alert("Please login as student first");
    window.location.href = "../index.html";
    return;
  }

  // 2️⃣ Get fresh student record
  const me = students.find(
    s => s.roll === activeStudent.roll && s.course === activeStudent.course
  );

  if (!me) {
    alert("Student record not found. Please submit request again.");
    window.location.href = "../index.html";
    return;
  }

  if (!me.approved) {
    alert("Your account is not approved yet");
    window.location.href = "dashboard.html";
    return;
  }

  // 3️⃣ Load books
  const books = JSON.parse(localStorage.getItem("books") || []);

// 🔧 FIX: Normalize old books (no available field)
books.forEach(book => {
  if (book.available === undefined) {
    book.available = book.quantity ?? 1;
  }
});

  const requests = JSON.parse(localStorage.getItem("bookRequests") || []);

  const grid = document.getElementById("booksGrid");
  const empty = document.getElementById("emptyState");

  grid.innerHTML = "";

  if (books.length === 0) {
    empty.style.display = "block";
    return;
  } else {
    empty.style.display = "none";
  }

  // 4️⃣ Render books
  books.forEach(book => {

  // ✅ FIX: handle books without availability (old data)
  if (book.available === undefined) {
    book.available = book.quantity ? book.quantity : 1;
  }

  // If no copies available, do not show
  if (book.available <= 0) return;

  const alreadyRequested = requests.some(
    r =>
      r.roll === me.roll &&
      r.bookTitle === book.title &&
      r.status === "pending"
  );

  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <img src="${book.image}"
         style="width:100%;height:200px;object-fit:cover;
                border-radius:10px;margin-bottom:12px">

    <h3>${book.title}</h3>
    <p class="subtitle">Author: ${book.author}</p>
    <p class="subtitle">Course: ${book.course}</p>
    <p class="subtitle">Available: ${book.available}</p>

    <button class="btn" ${alreadyRequested ? "disabled" : ""}>
      ${alreadyRequested ? "Requested" : "Request Book"}
    </button>
  `;

  if (!alreadyRequested) {
    card.querySelector("button").onclick = () => requestBook(book, me);
  }

  grid.appendChild(card);
});
});
/* ======================================================
   REQUEST BOOK
====================================================== */

function requestBook(book, me) {
  const requests = JSON.parse(localStorage.getItem("bookRequests") || []);

  requests.push({
    id: "req_" + Date.now(),
    studentName: me.name,
    roll: me.roll,
    course: me.course,
    bookTitle: book.title,
    status: "pending"
  });

  localStorage.setItem("bookRequests", JSON.stringify(requests));
  alert("Book request sent to admin");
  location.reload();
}
