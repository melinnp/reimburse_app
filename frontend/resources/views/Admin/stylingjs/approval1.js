//    searchbar
const searchInput = document.querySelector('input[placeholder="Cari nama atau ID..."]');
const tableBody = document.getElementById('approvalTable');

if (searchInput) {
  searchInput.addEventListener('keyup', function () {
    const filter = searchInput.value.toLowerCase();
    const rows = tableBody.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
      // Mencari nama
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

let currentActiveID = null;
const modalElement = document.getElementById('rejectModal');
const rejectModal = new bootstrap.Modal(modalElement);

//onclick
window.approveRequest = function (id) {
  if (confirm(`Apakah Anda yakin ingin menyetujui pengajuan #${id}?`)) {
    alert(`Pengajuan #${id} Berhasil Disetujui!`);
    removeRowFromTable(id);
  }
};

window.openRejectModal = function (id, name) {
  currentActiveID = id;
  document.getElementById('rejectTargetName').innerText = name;
  document.getElementById('rejectTargetID').innerText = id;
  document.getElementById('rejectReason').value = '';
  document.getElementById('rejectReason').classList.remove('is-invalid');
  rejectModal.show();
};

// reject konfirmasi
document.getElementById('btnConfirmReject').addEventListener('click', function () {
  const reasonInput = document.getElementById('rejectReason');
  const reason = reasonInput.value;

  if (reason.trim() === '') {
    reasonInput.classList.add('is-invalid');
    return;
  }

  console.log(`Rejecting ID: ${currentActiveID} | Reason: ${reason}`);
  alert(`Pengajuan #${currentActiveID} telah ditolak.\nAlasan: ${reason}`);

  rejectModal.hide();
  removeRowFromTable(currentActiveID);
});

// hapus tabel
function removeRowFromTable(id) {
  const rows = tableBody.getElementsByTagName('tr');
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].innerHTML.includes(id)) {
      //    efek tutup
      rows[i].style.transition = 'all 0.5s';
      rows[i].style.opacity = '0';
      setTimeout(() => {
        rows[i].remove();
      }, 500);
      break;
    }
  }
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
