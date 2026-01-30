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

// Filter & Pencarian
function filterData() {
  const statusFilter = document.getElementById('statusFilter');
  const searchInput = document.getElementById('searchInput');
  const tableBody = document.getElementById('claimTableBody');

  if (!statusFilter || !searchInput || !tableBody) return;

  const selectedStatus = statusFilter.value.toLowerCase();
  const searchText = searchInput.value.toLowerCase().trim();
  const rows = tableBody.getElementsByTagName('tr');

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    
    // Skip jika row kosong atau "Belum ada riwayat" / "Memuat data..."
    if (row.cells.length < 5) {
      row.style.display = ''; // Tetap tampilkan row kosong/loading
      continue;
    }

    // Ambil text dari kolom status (index 3)
    const statusCell = row.cells[3];
    const statusText = statusCell.innerText.toLowerCase().trim();
    
    // Ambil text dari seluruh row untuk search
    const rowText = row.innerText.toLowerCase();

    // Filter berdasarkan status
    const matchesStatus = selectedStatus === 'all' || statusText.includes(selectedStatus);
    
    // Filter berdasarkan search input
    const matchesSearch = searchText === '' || rowText.includes(searchText);

    // Tampilkan row jika cocok dengan kedua filter
    row.style.display = (matchesStatus && matchesSearch) ? '' : 'none';
  }
}

// Event listeners untuk filter
document.addEventListener('DOMContentLoaded', () => {
  const statusFilter = document.getElementById('statusFilter');
  const searchInput = document.getElementById('searchInput');
  let searchDebounce;

  if (statusFilter) {
    statusFilter.addEventListener('change', filterData);
  }

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(filterData, 300); // Debounce 300ms
    });
  }
});

// Format angka dengan pemisah ribuan (titik)
function formatNumber(n) {
  return n.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// ✅ TAMBAHKAN FUNGSI INI - Parse nominal untuk dikirim ke API
function parseNominalValue(value) {
  // Hapus titik pemisah ribuan, lalu hapus semua karakter non-angka
  return (value || '').replace(/\./g, '').replace(/[^0-9]/g, '');
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
