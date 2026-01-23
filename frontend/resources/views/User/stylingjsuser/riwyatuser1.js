function initOffcanvas() {
  const offcanvasEl = document.getElementById('offcanvasScrolling');
  const mainContent = document.getElementById('main-content');

  if (!offcanvasEl || !mainContent) return;

  offcanvasEl.addEventListener('shown.bs.offcanvas', () => {
    mainContent.style.marginLeft = '250px';
  });

  // PINDAH KE hide (sebelum animasi nutup)
  offcanvasEl.addEventListener('hide.bs.offcanvas', () => {
    mainContent.style.marginLeft = '0';
  });
}

// 2. Logika Filter & Pencarian Tabel
const statusFilter = document.getElementById('statusFilter');
const searchInput = document.getElementById('searchInput');
const tableRows = document.querySelectorAll('#claimTable tbody tr');

function filterData() {
  const selectedStatus = statusFilter.value.toLowerCase();
  const searchText = searchInput.value.toLowerCase();

  tableRows.forEach((row) => {
    // Kolom status adalah kolom ke-5 (index 4)
    const statusValue = row.cells[4].innerText.toLowerCase();
    // Gabungkan teks seluruh baris untuk pencarian global
    const rowText = row.innerText.toLowerCase();

    const matchesStatus = selectedStatus === 'all' || statusValue.includes(selectedStatus);
    const matchesSearch = rowText.includes(searchText);

    // Baris ditampilkan hanya jika memenuhi kedua kriteria
    if (matchesStatus && matchesSearch) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

// Jalankan fungsi saat ada perubahan pada select maupun input
if (statusFilter && searchInput) {
  statusFilter.addEventListener('change', filterData);
  searchInput.addEventListener('input', filterData);
}
