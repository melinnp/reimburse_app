document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("btnSaveUser")
    .addEventListener("click", createUser);
});

async function createUser() {
  const token = localStorage.getItem("token");
  if (!token) {
    showAlert("warning", "Silahkan login ulang");
    setTimeout(() => {
      window.location.href = "/public/Auth/login.html";
    }, 2000);
    return;
  }

  const data = {
    name: document.getElementById("name").value,
    username: document.getElementById("username").value,
    email: document.getElementById("email").value,
    role: document.getElementById("role").value,
    password: document.getElementById("password").value,
  };

  try {
    const res = await fetch(`${API_BASE}/admin/employee/create`, {
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
      showAlert("danger", "Gagal membuat user");
      return;
    }

    showAlert("success", "User berhasil dibuat");

    // Tutup modal
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("exampleModal")
    );
    modal.hide();

    // Refresh tabel employee
    if (typeof loadEmployees === "function") {
      loadEmployees();
    }

  } catch (_err) {}
}
