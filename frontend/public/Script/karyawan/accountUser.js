document.addEventListener("DOMContentLoaded", () => {
  const el = id => document.getElementById(id);

  const displayUsername = el("displayUsername");
  const displayEmail = el("displayEmail");
  const displayRole = el("displayRole");

  const avatarInitial = el("avatarInitial");
  const displayAvatarImg = el("displayAvatarImg");

  const previewImage = el("previewImage");
  const previewInitial = el("previewInitial");

  const usernameInput = el("usernameInput");
  const emailInput = el("emailInput");
  const passwordInput = el("passwordInput");
  const photoInput = el("photoInput");

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Silahkan login ulang");
    window.location.href = "/public/Auth/login.html";
    return;
  }

  /* =====================
     FETCH USER PROFILE
  ====================== */
  fetch("http://localhost:8000/api/employee/me", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  })
    .then(res => {
      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
    })
    .then(res => {
      const user = res.data;

      displayUsername.textContent = user.username;
      displayEmail.textContent = user.email;
      displayRole.textContent = user.role;

      const initial = user.username.charAt(0).toUpperCase();
      avatarInitial.textContent = initial;
      previewInitial.textContent = initial;

      usernameInput.value = user.username;
      emailInput.value = user.email;

      if (user.photo) {
        const imgUrl = `http://localhost:8000/storage/profile/${user.photo}`;
        
        displayAvatarImg.src = imgUrl;
        displayAvatarImg.style.display = "block";
        avatarInitial.style.display = "none";

        previewImage.src = imgUrl;
        previewImage.style.display = "block";
        previewInitial.style.display = "none";
      }
    })
    .catch(() => {
      alert("Session habis, silakan login ulang");
      localStorage.removeItem("token");
      window.location.href = "/public/Auth/login.html";
    });

  /* =====================
     PREVIEW PHOTO
  ====================== */
  window.previewPhoto = e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      previewImage.src = reader.result;
      previewImage.style.display = "block";
      previewInitial.style.display = "none";
    };
    reader.readAsDataURL(file);
  };

  /* =====================
     SAVE PROFILE
  ====================== */
  window.saveProfile = () => {
    const oldUsername = displayUsername.textContent;
    const oldEmail = displayEmail.textContent;
    
    const newUsername = usernameInput.value.trim();
    const newEmail = emailInput.value.trim();
    const newPassword = passwordInput.value.trim();
    const newPhoto = photoInput.files.length > 0;

    const hasChanges = 
        newUsername !== oldUsername ||
        newEmail !== oldEmail ||
        newPassword !== "" ||
        newPhoto;

    if (!hasChanges) {
        alert("Tidak ada data yang diubah");
        return;
    }

    const formData = new FormData();
    formData.append("username", newUsername);
    formData.append("email", newEmail);

    if (newPassword) {
        formData.append("password", newPassword);
    }

    if (newPhoto) {
        formData.append("photo", photoInput.files[0]);
    }

    // Ganti endpoint ke /update-profile (pure POST)
    fetch("http://localhost:8000/api/employee/me", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
    })
        .then(res => {
          if (!res.ok) {
            return res.json().then(err => Promise.reject(err));
          }
          return res.json();
        })
        .then(res => {
          alert(res.message || "Profile updated");
          
          if (newPassword) {
            alert("Password berhasil diubah. Silakan login kembali.");
            localStorage.removeItem("token");
            window.location.replace("/public/Auth/login.html");
          } else {
            bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
            window.location.reload();
          }
        })
        .catch(err => {
          alert(err.message || "Gagal update profile");
        });
    };
});