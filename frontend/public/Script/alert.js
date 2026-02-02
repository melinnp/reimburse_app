function showAlert(type, message) {
  const alertBox = document.getElementById('alertBox');
  if (!alertBox) return;

  // Mapping icon berdasarkan tipe alert
  let icon = 'bi-info-circle-fill';
  if (type === 'danger') icon = 'bi-exclamation-triangle-fill';
  if (type === 'success') icon = 'bi-check-circle-fill';

  alertBox.innerHTML = `
    <div class="alert alert-${type} d-flex align-items-center alert-dismissible fade show p-2 shadow-sm border-0 border-start border-4 rounded-3" role="alert">
      <i class="bi ${icon} fs-5 me-2 ps-1"></i>
      
      <div class="small fw-semibold pe-4">
        ${message}
      </div>

      <button type="button" class="btn-close m-0 p-2 position-absolute top-50 end-0 translate-middle-y" data-bs-dismiss="alert" aria-label="Close" style="margin-right: 0.5rem !important;"></button>
    </div>
  `;
}