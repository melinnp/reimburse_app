import { showAlert } from './alert.js';
import { router } from './router.js';
import { API_BASE_URL } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;

  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
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
        showAlert('danger', 'Login Gagal! Email atau Password Salah');
        return;
      }

      // simpan token
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));

      // ambil role
      const role = result.users.role;

      // redirect berdasarkan role
      if (role === 'admin') {
        router.navigate('/admin/dashboard');
      } else if (role === 'karyawan') {
        router.navigate('/user/dashboard');
      } else {
        showAlert('warning', 'Role tidak dikenali');
      }
    } catch (_error) {
      showAlert('danger', 'Login gagal');
    }
  });

  // Password toggle
  const togglePassword = document.querySelector('#togglePassword');
  const password = document.querySelector('#password');
  const eyeIcon = document.querySelector('#eyeIcon');

  if (togglePassword && password && eyeIcon) {
    togglePassword.addEventListener('click', function () {
      const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
      password.setAttribute('type', type);
      eyeIcon.classList.toggle('bi-eye');
      eyeIcon.classList.toggle('bi-eye-slash');
    });
  }
});
