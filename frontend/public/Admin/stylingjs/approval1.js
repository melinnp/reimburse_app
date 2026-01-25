//    searchbar (debounced to reduce reflows on fast typing)
const searchInput = document.querySelector('input[placeholder="Cari nama atau ID..."]');
const tableBody = document.getElementById('approvalTable');

function runApprovalFilter() {
  if (!searchInput || !tableBody) return;
  const filter = searchInput.value.toLowerCase();
  const rows = tableBody.getElementsByTagName('tr');
  for (let i = 0; i < rows.length; i++) {
    const nameColumn = rows[i].getElementsByTagName('td')[1];
    if (nameColumn) {
      const el = nameColumn.querySelector('.fw-bold');
      const nameText = el ? (el.textContent || el.innerText || '').toLowerCase() : '';
      rows[i].style.display = nameText.indexOf(filter) > -1 ? '' : 'none';
    }
  }
}

if (searchInput && tableBody) {
  let debounceTimer;
  searchInput.addEventListener('keyup', function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(runApprovalFilter, 150);
  });
}

function initOffcanvas() {
  const offcanvasEl = document.getElementById('offcanvasScrolling');
  const mainContent = document.getElementById('main-content');
  const navbar = document.querySelector('.navbar');

  if (!offcanvasEl || !mainContent || !navbar) return;

  offcanvasEl.addEventListener('shown.bs.offcanvas', () => {
    mainContent.style.marginLeft = '250px';
    navbar.style.marginLeft = '250px';
  });

  offcanvasEl.addEventListener('hide.bs.offcanvas', () => {
    mainContent.style.marginLeft = '0';
    navbar.style.marginLeft = '0';
  });
}