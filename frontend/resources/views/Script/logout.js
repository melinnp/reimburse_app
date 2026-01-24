document.addEventListener("click", async function (e) {
  const btn = e.target.closest("#btnLogout");
  if (!btn) return;

  e.preventDefault();

  const token = localStorage.getItem("token");

  try {
    await fetch("http://localhost:8000/api/logout", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.log("Logout API gagal, lanjut hapus token");
  }

  localStorage.clear();
  window.location.href = "../auth/login.html";
});
