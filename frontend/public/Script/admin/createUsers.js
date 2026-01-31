document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("btnSaveUser")
    .addEventListener("click", createUser);
});

async function createUser() {
  const token = localStorage.getItem("token");
  if (!token) return;

  const data = {
    name: document.getElementById("name").value,
    username: document.getElementById("username").value,
    email: document.getElementById("email").value,
    role: document.getElementById("role").value,
    password: document.getElementById("password").value,
  };

  try {
    const res = await fetch("http://localhost:8000/api/admin/employee/create", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token,
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!result.status) {
      alert("Gagal membuat user");
      return;
    }

    alert("User berhasil dibuat");

    // Tutup modal
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("exampleModal")
    );
    modal.hide();

    // Refresh tabel employee
    if (typeof loadEmployees === "function") {
      loadEmployees();
    }

  } catch (err) {
    console.error("Create user error:", err);
  }
}
