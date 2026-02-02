(function checkAuthOnLoad() {
    const token = localStorage.getItem('token'); // sesuaikan key
  
    // 1. Token gak ada
    if (!token) {
      alert('Session habis, silakan login ulang');
      window.location.href = '/public/Auth/login.html';
      return;
    }
  
  });