/* ======================================================
   ADMIN – ISSUED BOOKS (FINAL & CORRECT)
====================================================== */

document.addEventListener("DOMContentLoaded", loadIssues);

function loadIssues() {
  const issuedBooks = JSON.parse(localStorage.getItem("issuedBooks")) || [];
  const books = JSON.parse(localStorage.getItem("books")) || [];
  const table = document.getElementById("issuesTable");
  const empty = document.getElementById("emptyState");

  table.innerHTML = "";

  if (issuedBooks.length === 0) {
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";

  issuedBooks.forEach(issue => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${issue.studentName}</td>
      <td>${issue.title}</td>
      <td>${new Date(issue.issuedAt).toDateString()}</td>
      <td>${new Date(issue.dueDate).toDateString()}</td>
      <td>
        <button class="btn success" onclick="markReturned('${issue.id}')">
          Mark Returned
        </button>
      </td>
    `;

    table.appendChild(row);
  });
}

/* ===============================
   RETURN BOOK
================================ */
function markReturned(issueId) {
  let issuedBooks = JSON.parse(localStorage.getItem("issuedBooks")) || [];
  let books = JSON.parse(localStorage.getItem("books")) || [];

  const issue = issuedBooks.find(i => i.id === issueId);
  if (!issue) return;

  // Restore book quantity
  const book = books.find(b => b.id === issue.bookId);
  if (book) {
    book.quantity += 1;
  }

  // Remove issued record
  issuedBooks = issuedBooks.filter(i => i.id !== issueId);

  localStorage.setItem("books", JSON.stringify(books));
  localStorage.setItem("issuedBooks", JSON.stringify(issuedBooks));

  loadIssues();
}
