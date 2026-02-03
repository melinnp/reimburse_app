import { showAlert } from './alert.js';
import { router } from './router.js';

export function checkAuth() {
  const token = localStorage.getItem('token');
  if (!token) {
    showAlert('warning', 'Silakan login terlebih dahulu');
    setTimeout(() => {
      router.navigate('/login');
    }, 2000);
    return false;
  }
  return true;
}
