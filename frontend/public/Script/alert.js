/**
 * Menampilkan alert dengan 3 tipe: warning, danger, dan success
 * @param {string} type - Tipe alert: 'warning', 'danger', atau 'success'
 * @param {string} message - Pesan yang akan ditampilkan
 */
function showAlert(type, message) {
  const alertBox = document.getElementById('alertBox');
  if (!alertBox) return;

  const validTypes = ['warning', 'danger', 'success'];
  if (!validTypes.includes(type)) type = 'warning';

  let icon = 'bi-info-circle-fill';
  if (type === 'warning') icon = 'bi-exclamation-triangle-fill';
  if (type === 'danger') icon = 'bi-x-circle-fill';
  if (type === 'success') icon = 'bi-check-circle-fill';

  // reset biar ga numpuk
  alertBox.innerHTML = `
    <div class="alert alert-${type} d-flex align-items-center alert-dismissible fade show p-3 shadow border-0 border-start border-4 rounded-3" role="alert">
      <i class="bi ${icon} fs-4 me-2"></i>
      <div class="fw-semibold pe-4">${message}</div>
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `;

  // auto close (opsional)
  setTimeout(() => {
    const alert = alertBox.querySelector('.alert');
    if (alert) alert.remove();
  }, 3000);
}

/**
 * Menampilkan modal konfirmasi dan mengembalikan Promise
 * @param {string} title - Judul modal konfirmasi
 * @param {string} message - Pesan konfirmasi
 * @param {string} confirmText - Teks tombol konfirmasi (default: 'Ya, Lanjutkan')
 * @param {string} cancelText - Teks tombol batal (default: 'Batal')
 * @param {string} type - Tipe konfirmasi: 'warning', 'danger', 'info', 'success' (default: 'warning')
 * @returns {Promise<boolean>} - Promise yang resolve ke true jika dikonfirmasi, false jika dibatalkan
 */
function showConfirmAlert(title, message, confirmText = 'Ya, Lanjutkan', cancelText = 'Batal', type = 'warning') {
  return new Promise((resolve) => {
    // Cek apakah modal sudah ada, jika ada hapus dulu
    let existingModal = document.getElementById('confirmModal');
    if (existingModal) {
      existingModal.remove();
    }

    // Tentukan icon dan warna berdasarkan type
    let icon = 'bi-exclamation-triangle-fill';
    let iconColor = 'text-warning';
    let btnClass = 'btn-warning';
    
    if (type === 'danger') {
      icon = 'bi-x-circle-fill';
      iconColor = 'text-danger';
      btnClass = 'btn-danger';
    } else if (type === 'info') {
      icon = 'bi-info-circle-fill';
      iconColor = 'text-info';
      btnClass = 'btn-info';
    } else if (type === 'success') {
      icon = 'bi-check-circle-fill';
      iconColor = 'text-success';
      btnClass = 'btn-success';
    }

    // Buat modal HTML
    const modalHTML = `
      <div class="modal fade" id="confirmModal" tabindex="-1" aria-labelledby="confirmModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow-lg rounded-4">
            <div class="modal-header border-0 pb-2">
              <h5 class="modal-title fw-bold d-flex align-items-center" id="confirmModalLabel">
                <i class="bi ${icon} ${iconColor} me-2 fs-5"></i>
                ${title}
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body pt-0">
              <p class="mb-0">${message}</p>
            </div>
            <div class="modal-footer border-0 pt-0">
              <button type="button" class="btn btn-light rounded-pill px-4" id="confirmCancelBtn" data-bs-dismiss="modal">${cancelText}</button>
              <button type="button" class="btn ${btnClass} text-white rounded-pill px-4" id="confirmOkBtn">${confirmText}</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Tambahkan modal ke body
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modalElement = document.getElementById('confirmModal');
    const modal = new bootstrap.Modal(modalElement);

    // Event handler untuk tombol OK
    document.getElementById('confirmOkBtn').addEventListener('click', () => {
      modal.hide();
      resolve(true);
    });

    // Event handler untuk tombol Cancel dan close
    const cancelBtn = document.getElementById('confirmCancelBtn');
    cancelBtn.addEventListener('click', () => {
      resolve(false);
    });

    modalElement.addEventListener('hidden.bs.modal', () => {
      // Hapus modal dari DOM setelah ditutup
      modalElement.remove();
    });

    // Tampilkan modal
    modal.show();
  });
}
