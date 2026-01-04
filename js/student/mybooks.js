/* ======================================================
   STUDENT MY BOOKS LOGIC
====================================================== */

const activeStudent = JSON.parse(localStorage.getItem("activeStudent"));
const issued = JSON.parse(localStorage.getItem("issuedBooks") || []);

if (!activeStudent) {
  alert("Please login as student first");
  window.location.href = "../index.html";
}

const myBooks = issued.filter(
  b => b.roll === activeStudent.roll
);

const table = document.getElementById("myBooksTable");
const empty = document.getElementById("emptyState");

table.innerHTML = "";

if (myBooks.length === 0) {
  empty.style.display = "block";
} else {
  empty.style.display = "none";

  myBooks.forEach(book => {
    table.innerHTML += `
      <tr>
        <td>${book.bookTitle}</td>
        <td>${book.issueDate}</td>
      </tr>
    `;
  });
}
