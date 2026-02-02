(function () {
  const token = localStorage.getItem('token');
  if (!token) {
    showAlert('warning', 'Silakan login terlebih dahulu');
    setTimeout(function () {
      window.location.replace('/public/Auth/login.html');
    }, 2000);
  }
})();