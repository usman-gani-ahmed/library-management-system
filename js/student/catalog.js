const booksGrid = document.getElementById("booksGrid");
const emptyState = document.getElementById("emptyState");

/* ===============================
   RENDER BOOK CATALOG
================================ */
function renderBooks() {
  const books = JSON.parse(localStorage.getItem("books")) || [];
  const requests = JSON.parse(localStorage.getItem("bookRequests")) || [];
  const student = JSON.parse(localStorage.getItem("activeStudent"));

  booksGrid.innerHTML = "";

  if (books.length === 0) {
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";

  books.forEach(book => {
    const card = document.createElement("div");
    card.className = "book-card";

    const alreadyRequested = requests.some(
      r =>
        r.bookId === book.id &&
        r.studentId === student?.id &&
        r.status === "pending"
    );

    let actionHTML = "";

    if (book.quantity <= 0) {
      actionHTML = `<span class="badge danger">Out of Stock</span>`;
    } else if (alreadyRequested) {
      actionHTML = `<span class="badge warning">Requested</span>`;
    } else {
      actionHTML = `
        <button class="btn" onclick="requestBook('${book.id}')">
          Request Book
        </button>
      `;
    }

    card.innerHTML = `
      <img src="${book.image || '../assets/book-placeholder.png'}">
      <h4>${book.title}</h4>
      <p>Author: ${book.author}</p>
      <p>Available: ${book.quantity}</p>
      ${actionHTML}
    `;

    booksGrid.appendChild(card);
  });
}

/* ===============================
   REQUEST BOOK
================================ */
function requestBook(bookId) {
  const student = JSON.parse(localStorage.getItem("activeStudent"));
  const books = JSON.parse(localStorage.getItem("books")) || [];

  if (!student) {
    alert("Student not logged in");
    return;
  }

  const book = books.find(b => b.id === bookId);
  if (!book || book.quantity <= 0) {
    alert("Book not available");
    return;
  }

  let requests = JSON.parse(localStorage.getItem("bookRequests")) || [];

  const exists = requests.find(
    r =>
      r.bookId === bookId &&
      r.studentId === student.id &&
      r.status === "pending"
  );

  if (exists) {
    alert("You have already requested this book");
    return;
  }

  requests.push({
    id: "req_" + Date.now(),

    // BOOK INFO
    bookId: book.id,
    bookTitle: book.title,

    // STUDENT INFO
    studentId: student.id,
    studentName: student.name,
    studentRoll: student.roll,

    status: "pending",
    requestedAt: new Date().toISOString()
  });

  localStorage.setItem("bookRequests", JSON.stringify(requests));

  alert("Book request sent to admin");
  renderBooks(); // 🔁 refresh UI immediately
}

/* ===============================
   INIT
================================ */
document.addEventListener("DOMContentLoaded", renderBooks);
