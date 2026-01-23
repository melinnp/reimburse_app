document.addEventListener('DOMContentLoaded', function () {
  // 1. Logika Sidebar (Offcanvas)
  const offcanvasEl = document.getElementById('offcanvasScrolling');
  const mainContent = document.getElementById('main-content');

  if (offcanvasEl && mainContent) {
    offcanvasEl.addEventListener('shown.bs.offcanvas', function () {
      mainContent.style.marginLeft = '250px';
    });

    offcanvasEl.addEventListener('hidden.bs.offcanvas', function () {
      mainContent.style.marginLeft = '0';
    });
  }

  // 2. Logika Form Pengajuan Baru
  const form = document.getElementById('formReimburse');
  const table = document.getElementById('reimburseTable');
  const statTotal = document.getElementById('statTotal');
  const statPending = document.getElementById('statPending');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Ambil data dari form
      const jenis = document.getElementById('jenis').value;
      const nominalValue = document.getElementById('nominal').value;
      const tanggal = new Date().toLocaleDateString('id-ID');

      // Format Rupiah
      const formattedNominal = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      }).format(nominalValue);

      // Tambah baris baru ke tabel
      const newRow = `
                <tr>
                    <td class="ps-4 fw-medium">${jenis}</td>
                    <td class="text-muted small">${tanggal}</td>
                    <td class="fw-bold">${formattedNominal}</td>
                    <td><span class="badge rounded-pill bg-warning text-dark">Queue</span></td>
                    <td class="text-center"><button class="btn btn-sm btn-outline-secondary">Detail</button></td>
                </tr>
            `;
      table.insertAdjacentHTML('beforeend', newRow);

      // Update Statistik pada Card
      let totalCount = parseInt(statTotal.innerText);
      let pendingCount = parseInt(statPending.innerText);

      statTotal.innerText = totalCount + 1;
      statPending.innerText = pendingCount + 1;

      // Tutup Modal
      const modalElement = document.getElementById('modalTambah');
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }

      // Reset Form
      form.reset();

      // Notifikasi
      alert('Pengajuan Anda telah berhasil dikirim ke Admin!');
    });
  }
});
