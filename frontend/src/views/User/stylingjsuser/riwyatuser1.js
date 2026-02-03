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

  let visibleCount = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    
    // Skip jika row kosong atau "Belum ada riwayat" / "Memuat data..."
    if (row.cells.length < 5) {
      continue; // Jangan tampilkan row kosong saat filter aktif
    }

    // Ambil text dari kolom status (index 3)
    const statusCell = row.cells[3];
    const statusBadge = statusCell.querySelector('.badge');
    const statusText = statusBadge ? statusBadge.innerText.toLowerCase().trim() : statusCell.innerText.toLowerCase().trim();
    
    // Ambil text dari seluruh row untuk search
    const rowText = row.innerText.toLowerCase();

    // Filter berdasarkan status
    let matchesStatus = selectedStatus === 'all';
    if (!matchesStatus) {
      if (selectedStatus === 'sudah cair') {
        matchesStatus = statusText.includes('approved') || statusText.includes('sudah cair');
      } else if (selectedStatus === 'queue') {
        matchesStatus = statusText.includes('queue') || statusText.includes('pending');
      } else if (selectedStatus === 'ditolak') {
        matchesStatus = statusText.includes('rejected') || statusText.includes('ditolak');
      }
    }
    
    // Filter berdasarkan search input
    const matchesSearch = searchText === '' || rowText.includes(searchText);

    // Tampilkan row jika cocok dengan kedua filter
    if (matchesStatus && matchesSearch) {
      row.style.display = '';
      visibleCount++;
    } else {
      row.style.display = 'none';
    }
  }

  // Tampilkan pesan jika tidak ada data yang cocok
  if (visibleCount === 0 && rows.length > 0) {
    const noDataRow = tableBody.querySelector('.no-filter-result');
    if (!noDataRow) {
      const tr = document.createElement('tr');
      tr.className = 'no-filter-result';
      tr.innerHTML = '<td colspan="5" class="text-center py-4 text-muted">Tidak ada data yang sesuai dengan filter</td>';
      tableBody.appendChild(tr);
    }
  } else {
    const noDataRow = tableBody.querySelector('.no-filter-result');
    if (noDataRow) noDataRow.remove();
  }
}

// Event listeners untuk filter
function setupFilterListeners() {
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
}

// Format angka dengan pemisah ribuan (titik)
function formatNumber(n) {
  return n.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Parse nominal untuk dikirim ke API
function parseNominalValue(value) {
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

      e.target.value = formatNumber(value);

      let newLength = e.target.value.length;
      cursorPosition = cursorPosition + (newLength - oldLength);
      e.target.setSelectionRange(cursorPosition, cursorPosition);
    });
  }

  // Initialize offcanvas jika ada
  initOffcanvas();
  
  // Setup filter listeners
  setupFilterListeners();
});