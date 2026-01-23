function previewPhoto(event) {
  const img = document.getElementById('previewImage');
  const initial = document.getElementById('previewInitial');

  if (event.target.files && event.target.files[0]) {
    img.src = URL.createObjectURL(event.target.files[0]);
    img.style.display = 'block';
    initial.style.display = 'none';
  }
}

function togglePassword() {
  const input = document.getElementById('passwordInput');
  const icon = document.getElementById('eyeIcon');

  if (input.type === 'password') {
    input.type = 'text';
    icon.classList.replace('bi-eye', 'bi-eye-slash');
  } else {
    input.type = 'password';
    icon.classList.replace('bi-eye-slash', 'bi-eye');
  }
}

function saveProfile() {
  const username = document.getElementById('usernameInput').value;
  const email = document.getElementById('emailInput').value;
  const previewImg = document.getElementById('previewImage');
  const displayAvatar = document.getElementById('displayAvatar');

  if (username) {
    document.getElementById('displayUsername').innerText = username;
    document.getElementById('avatarInitial').innerText = username.charAt(0).toUpperCase();
  }

  if (email) {
    document.getElementById('displayEmail').innerText = email;
  }

  if (previewImg.style.display === 'block') {
    displayAvatar.innerHTML = `<img src="${previewImg.src}" style="width: 100%; height: 100%; object-fit: cover;">`;
  }

  // Menutup modal setelah simpan
  const modalElement = document.getElementById('editModal');
  const modalInstance = bootstrap.Modal.getInstance(modalElement);
  if (modalInstance) {
    modalInstance.hide();
  }
}

// Logika Offcanvas Margin
function initOffcanvas() {
  const offcanvasEl = document.getElementById('offcanvasScrolling');
  const mainContent = document.getElementById('main-content');
  const navbar = document.querySelector('.navbar');

  if (!offcanvasEl || !mainContent || !navbar) return;

  offcanvasEl.addEventListener('shown.bs.offcanvas', () => {
    mainContent.style.marginLeft = '250px';
    navbar.style.marginLeft = '250px';
  });

  offcanvasEl.addEventListener('hide.bs.offcanvas', () => {
    mainContent.style.marginLeft = '0';
    navbar.style.marginLeft = '0';
  });
}
