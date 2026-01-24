document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");
  if (!token) return;

  fetch("http://localhost:8000/api/employee/me", {
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
      if (navUsername) navUsername.innerText = user.username;

      // Profile section (sidebar)
      const profileUsername = document.getElementById("profileUsername");
      if (profileUsername) profileUsername.innerText = user.username;

      const profileEmail = document.getElementById("profileEmail");
      if (profileEmail) profileEmail.innerText = user.email;

      // Foto
      const userPhoto = document.getElementById("userPhoto");
      if (userPhoto) {
        userPhoto.src = user.photo
          ? `http://localhost:8000/storage/profile/${user.photo}`
          : "../assets/default-user.png";
      }
    })
    .catch(err => console.error("Gagal ambil user:", err));
});
