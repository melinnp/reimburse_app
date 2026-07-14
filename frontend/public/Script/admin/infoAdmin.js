document.addEventListener("partials-loaded", function () {
  const token = localStorage.getItem("token");
  if (!token) {
    showAlert("warning", "Silahkan login ulang");
    setTimeout(() => {
      window.location.href = "/public/Auth/login.html";
    }, 2000);
    return;
  }

  fetch(`${API_BASE}/admin/me`, {
    headers: {
      Authorization: "Bearer " + token,
      Accept: "application/json"
    }
  })
    .then(res => res.json())
    .then(res => {
      const user = res.data;

      // Navbar username
      const navUsername = document.getElementById("navUsername");
      if (navUsername) navUsername.innerText = user.role === 'admin' ? 'Admin' : user.role;

      // Profile section (sidebar)
      const profileUsername = document.getElementById("profileUsername");
      if (profileUsername) profileUsername.innerText = user.username;

      const profileEmail = document.getElementById("profileEmail");
      if (profileEmail) profileEmail.innerText = user.email;

      // Foto - pastikan elemen ada dan set src dengan benar
      const userPhoto = document.getElementById("userPhoto");
      if (userPhoto) {
        if (user.photo) {
          userPhoto.src = `${STORAGE_BASE}/profile/${user.photo}`;
          userPhoto.onerror = function() {
            // Fallback jika foto tidak ditemukan
            this.src = "../assets/default-user.png";
          };
        } else {
          userPhoto.src = "../assets/default-user.png";
        }
      }
    })
    .catch(() => {});
});