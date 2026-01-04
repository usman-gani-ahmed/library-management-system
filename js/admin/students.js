/* ======================================================
   ADMIN STUDENT APPROVAL LOGIC (IFRAME SAFE)
====================================================== */

function loadStudents() {
  const students = JSON.parse(localStorage.getItem("students") || "[]");
  const table = document.getElementById("studentsTable");
  const empty = document.getElementById("emptyState");

  table.innerHTML = "";

  if (students.length === 0) {
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";

  students.forEach((student, index) => {
    const statusBadge = student.approved
      ? `<span class="badge success">Approved</span>`
      : `<span class="badge warning">Pending</span>`;

    let actionButtons = "-";

    if (!student.approved) {
      actionButtons = `
        <button class="btn success" onclick="approveStudent(${index})">
          Approve
        </button>
        <button class="btn danger" onclick="rejectStudent(${index})" style="margin-left:8px">
          Reject
        </button>
      `;
    }

    table.innerHTML += `
      <tr>
        <td>${student.name}</td>
        <td>${student.roll}</td>
        <td>${student.course}</td>
        <td>${statusBadge}</td>
        <td>${actionButtons}</td>
      </tr>
    `;
  });
}

function approveStudent(index) {
  const students = JSON.parse(localStorage.getItem("students"));
  students[index].approved = true;
  localStorage.setItem("students", JSON.stringify(students));
  loadStudents();
}

function rejectStudent(index) {
  const students = JSON.parse(localStorage.getItem("students"));
  students.splice(index, 1);
  localStorage.setItem("students", JSON.stringify(students));
  loadStudents();
}

/* INIT */
loadStudents();
