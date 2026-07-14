function initOffcanvas() {
  const offcanvasEl = document.getElementById('offcanvasScrolling');
  const mainContent = document.getElementById('main-content');

  if (!offcanvasEl || !mainContent) return;

  offcanvasEl.addEventListener('shown.bs.offcanvas', () => {
    mainContent.style.marginLeft = '250px';
  });

  offcanvasEl.addEventListener('hide.bs.offcanvas', () => {
    mainContent.style.marginLeft = '0';
  });
}

// Format angka dengan pemisah ribuan (titik)
function formatNumber(n) {
  return n.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Auto format nominal input
document.addEventListener('DOMContentLoaded', function () {
  const nominalInput = document.getElementById('nominalInput');

  if (nominalInput) {
    nominalInput.addEventListener('input', function (e) {
      let value = e.target.value;
      let cursorPosition = e.target.selectionStart;
      let oldLength = value.length;

      // Format dengan pemisah ribuan
      e.target.value = formatNumber(value);

      // Pertahankan posisi cursor
      let newLength = e.target.value.length;
      cursorPosition = cursorPosition + (newLength - oldLength);
      e.target.setSelectionRange(cursorPosition, cursorPosition);
    });
  }

  // Initialize offcanvas jika ada
  initOffcanvas();
});
document.getElementById('nota').onchange = function (evt) {
  const [file] = this.files;
  const preview = document.getElementById('imgPreview');
  const placeholder = document.getElementById('placeholderPreview');

  if (file && file.type.startsWith('image/')) {
    preview.src = URL.createObjectURL(file);
    preview.classList.remove('d-none'); // Munculkan gambar
    placeholder.classList.add('d-none'); // Sembunyikan placeholder
  } else {
    preview.classList.add('d-none');
    placeholder.classList.remove('d-none');
  }
};
