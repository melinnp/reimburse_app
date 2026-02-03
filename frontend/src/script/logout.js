import { router } from './router.js';
import { showConfirmAlert } from './alert.js';

document.addEventListener('DOMContentLoaded', () => {
  const logoutButtons = document.querySelectorAll('#btnLogout');
  
  logoutButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const confirmed = await showConfirmAlert(
        'Logout',
        'Apakah Anda yakin ingin logout?',
        'Ya, Logout',
        'Batal',
        'warning'
      );

      if (confirmed) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.navigate('/login');
      }
    });
  });
});
