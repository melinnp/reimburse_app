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
  const searchText = searchInput.value.toLowerCase();
  const rows = tableBody.getElementsByTagName('tr');

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    
    // Skip jika row kosong atau "Belum ada riwayat"
    if (row.cells.length < 5) continue;

    // Ambil text dari kolom status (index 3)
    const statusCell = row.cells[3];
    const statusText = statusCell.innerText.toLowerCase();
    
    // Ambil text dari seluruh row untuk search
    const rowText = row.innerText.toLowerCase();

    const matchesStatus = selectedStatus === 'all' || statusText.includes(selectedStatus);
    const matchesSearch = rowText.includes(searchText);

    if (matchesStatus && matchesSearch) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  }
}

// Event listeners untuk filter
document.addEventListener('DOMContentLoaded', () => {
  const statusFilter = document.getElementById('statusFilter');
  const searchInput = document.getElementById('searchInput');

  if (statusFilter) {
    statusFilter.addEventListener('change', filterData);
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterData);
  }
});