/* ======================================================
   ADMIN BOOK REQUESTS LOGIC (IFRAME SAFE)
====================================================== */

function loadRequests() {
  const requests = JSON.parse(localStorage.getItem("bookRequests") || "[]");
  const table = document.getElementById("requestsTable");
  const empty = document.getElementById("emptyState");

  table.innerHTML = "";

  if (requests.length === 0) {
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";

  requests.forEach((req, index) => {
    const statusBadge =
      req.status === "approved"
        ? `<span class="badge success">Approved</span>`
        : `<span class="badge warning">Pending</span>`;

    let actionButtons = "-";

    if (req.status === "pending") {
      actionButtons = `
        <button class="btn success" onclick="approveRequest(${index})">
          Approve
        </button>
        <button class="btn danger" onclick="rejectRequest(${index})" style="margin-left:8px">
          Reject
        </button>
      `;
    }

    table.innerHTML += `
      <tr>
        <td>${req.studentName}</td>
        <td>${req.roll}</td>
        <td>${req.bookTitle}</td>
        <td>${statusBadge}</td>
        <td>${actionButtons}</td>
      </tr>
    `;
  });
}

function approveRequest(index) {
  const requests = JSON.parse(localStorage.getItem("bookRequests"));
  requests[index].status = "approved";
  localStorage.setItem("bookRequests", JSON.stringify(requests));

  // Also add to issued books
  const issued = JSON.parse(localStorage.getItem("issuedBooks") || "[]");
  issued.push({
    studentName: requests[index].studentName,
    roll: requests[index].roll,
    bookTitle: requests[index].bookTitle,
    issueDate: new Date().toLocaleDateString()
  });
  localStorage.setItem("issuedBooks", JSON.stringify(issued));

  loadRequests();
}

function rejectRequest(index) {
  const requests = JSON.parse(localStorage.getItem("bookRequests"));
  requests.splice(index, 1);
  localStorage.setItem("bookRequests", JSON.stringify(requests));
  loadRequests();
}

/* INIT */
loadRequests();
