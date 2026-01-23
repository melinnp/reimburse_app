$(document).ready(function () {
  const offcanvasEl = document.getElementById('offcanvasScrolling');
  const mainContent = $('#main-content');

  if (offcanvasEl) {
    // buka
    offcanvasEl.addEventListener('shown.bs.offcanvas', function () {
      mainContent.css('margin-left', '250px');
    });

    // tutup
    offcanvasEl.addEventListener('hidden.bs.offcanvas', function () {
      mainContent.css('margin-left', '0');
    });
  }
});
