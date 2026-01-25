//    searchbar
const searchInput = document.querySelector('input[placeholder="Cari nama atau ID..."]');
const tableBody = document.getElementById('approvalTable');

if (searchInput) {
  searchInput.addEventListener('keyup', function () {
    const filter = searchInput.value.toLowerCase();
    const rows = tableBody.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
      const nameColumn = rows[i].getElementsByTagName('td')[1];
      if (nameColumn) {
        const nameText = nameColumn.querySelector('.fw-bold').textContent || nameColumn.querySelector('.fw-bold').innerText;

        if (nameText.toLowerCase().indexOf(filter) > -1) {
          rows[i].style.display = '';
        } else {
          rows[i].style.display = 'none';
        }
      }
    }
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