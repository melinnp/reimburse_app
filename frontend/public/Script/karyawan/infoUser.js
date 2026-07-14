document.addEventListener("partials-loaded", function () {
  const token = localStorage.getItem("token");
  if (!token) {
    showAlert('warning', 'Silakan login terlebih dahulu');
    setTimeout(() => {
      window.location.replace('/public/Auth/login.html');
    }, 2000);
    return;
  }

  fetch(`${API_BASE}/employee/me`, {
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
      if (navUsername) navUsername.innerText = user.role === 'karyawan' ? 'Employee' : user.role;

      // Profile section (sidebar)
      const profileUsername = document.getElementById("profileUsername");
      if (profileUsername) profileUsername.innerText = user.username;

      const profileEmail = document.getElementById("profileEmail");
      if (profileEmail) profileEmail.innerText = user.email;

      // Foto
      const userPhoto = document.getElementById("userPhoto");
      if (userPhoto) {
        userPhoto.src = user.photo
          ? `${STORAGE_BASE}/profile/${user.photo}`
          : "../assets/default-user.png";
      }
    })
    .catch(() => {});
});