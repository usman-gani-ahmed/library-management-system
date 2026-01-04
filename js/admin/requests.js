/* ======================================================
   ADMIN – BOOK REQUESTS (FINAL & SAFE)
====================================================== */

document.addEventListener("DOMContentLoaded", renderRequests);

function renderRequests() {
  const requests = JSON.parse(localStorage.getItem("bookRequests")) || [];
  const books = JSON.parse(localStorage.getItem("books")) || [];
  const students = JSON.parse(localStorage.getItem("students")) || [];
  const table = document.getElementById("requestTable");

  table.innerHTML = "";

  if (requests.length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center;color:#94a3b8;">
          No book requests.
        </td>
      </tr>
    `;
    return;
  }

  requests.forEach(req => {
    const book = books.find(b => b.id === req.bookId);
    const student = students.find(s => s.id === req.studentId);

    let actionHTML = "";

    if (req.status === "pending") {
      actionHTML = `
        <button class="btn success" onclick="approveRequest('${req.id}')">Approve</button>
        <button class="btn danger" onclick="rejectRequest('${req.id}')">Reject</button>
      `;
    } else {
      actionHTML = `<span class="badge ${req.status === "approved" ? "success" : "danger"}">${req.status}</span>`;
    }

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${book ? book.title : req.bookTitle || "—"}</td>
      <td>${student ? student.name : req.studentName || "—"}</td>
      <td>${student ? student.roll : req.studentRoll || "—"}</td>
      <td>${req.status}</td>
      <td>${actionHTML}</td>
    `;

    table.appendChild(row);
  });
}

/* ===============================
   APPROVE REQUEST
================================ */
function approveRequest(requestId) {
  const requests = JSON.parse(localStorage.getItem("bookRequests")) || [];
  const books = JSON.parse(localStorage.getItem("books")) || [];
  const issuedBooks = JSON.parse(localStorage.getItem("issuedBooks")) || [];

  const req = requests.find(r => r.id === requestId);
  if (!req) return;

  const book = books.find(b => b.id === req.bookId);
  if (!book || book.quantity <= 0) {
    alert("Book not available");
    return;
  }

  // Reduce quantity
  book.quantity -= 1;

  // Mark approved
  req.status = "approved";

  // Issue book
  issuedBooks.push({
    id: "issue_" + Date.now(),
    bookId: book.id,
    title: book.title,
    image: book.image || "",
    studentId: req.studentId,
    studentName: req.studentName,
    issuedAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
  });

  localStorage.setItem("books", JSON.stringify(books));
  localStorage.setItem("bookRequests", JSON.stringify(requests));
  localStorage.setItem("issuedBooks", JSON.stringify(issuedBooks));

  renderRequests();
}

/* ===============================
   REJECT REQUEST
================================ */
function rejectRequest(requestId) {
  const requests = JSON.parse(localStorage.getItem("bookRequests")) || [];
  const req = requests.find(r => r.id === requestId);
  if (!req) return;

  req.status = "rejected";
  localStorage.setItem("bookRequests", JSON.stringify(requests));

  renderRequests();
}
