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

// Filter & Pencarian (debounce on search input to reduce reflows)
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
    if (row.cells.length < 5) continue;

    const statusText = row.cells[3].innerText.toLowerCase();
    const rowText = row.innerText.toLowerCase();
    const matchesStatus = selectedStatus === 'all' || statusText.includes(selectedStatus);
    const matchesSearch = rowText.includes(searchText);
    row.style.display = matchesStatus && matchesSearch ? '' : 'none';
  }
}

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
      searchDebounce = setTimeout(filterData, 150);
    });
  }
});