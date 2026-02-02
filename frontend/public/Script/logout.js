document.addEventListener("click", async function (e) {
  const btn = e.target.closest("#btnLogout");
  if (!btn) return;

  e.preventDefault();

  // Konfirmasi sebelum logout
  const confirmed = await showConfirmAlert(
    "Konfirmasi Logout",
    "Apakah Anda yakin ingin keluar dari akun ini?",
    "Ya, Logout",
    "Batal",
    "warning"
  );

  if (!confirmed) return;

  const token = localStorage.getItem("token");

  try {
    await fetch("http://localhost:8000/api/logout", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  } catch (_err) {}

  localStorage.clear();
  window.location.href = "../Auth/login.html";
});
