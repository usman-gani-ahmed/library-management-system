/* ======================================================
   ADMIN ISSUED BOOKS LOGIC (IFRAME SAFE)
====================================================== */

function loadIssues() {
  const issues = JSON.parse(localStorage.getItem("issuedBooks") || "[]");
  const table = document.getElementById("issuesTable");
  const empty = document.getElementById("emptyState");

  table.innerHTML = "";

  if (issues.length === 0) {
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";

  issues.forEach((issue, index) => {
    table.innerHTML += `
      <tr>
        <td>${issue.studentName}</td>
        <td>${issue.roll}</td>
        <td>${issue.bookTitle}</td>
        <td>${issue.issueDate}</td>
        <td>
          <button class="btn success" onclick="markReturned(${index})">
            Mark Returned
          </button>
        </td>
      </tr>
    `;
  });
}

function markReturned(index) {
  const issues = JSON.parse(localStorage.getItem("issuedBooks"));
  issues.splice(index, 1);
  localStorage.setItem("issuedBooks", JSON.stringify(issues));
  loadIssues();
}

/* INIT */
loadIssues();
