document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('http://localhost:8000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      alert('Login Gagal! Email atau Password Salah');
    }

    // simpan token
    localStorage.setItem('token', result.token);
    localStorage.setItem('user', JSON.stringify(result.user));

    // ambil role
    const role = result.users.role;

    // redirect berdasarkan role
    if (role === 'admin') {
      window.location.href = '../Admin/admindash.html';
    } else if (role === 'karyawan') {
      window.location.href = '../User/userdash.html';
    } else {
      alert('Role tidak dikenali');
    }
  } catch (error) {
    // document.getElementById('errorMsg').innerText = 'Server error';
    alert('Login gagal');
    console.error(error);
  }
});
const togglePassword = document.querySelector('#togglePassword');
const password = document.querySelector('#password');
const eyeIcon = document.querySelector('#eyeIcon');

togglePassword.addEventListener('click', function () {
  const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
  password.setAttribute('type', type);
  eyeIcon.classList.toggle('bi-eye');
  eyeIcon.classList.toggle('bi-eye-slash');
});
