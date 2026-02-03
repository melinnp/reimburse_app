export function getStatusBadge(status) {
  switch (status) {
    case 'approved':
      return `
        <span class="badge rounded-pill btn btn-outline-success text-dark px-3">
          Approved
        </span>`;
    case 'pending':
      return `
        <span class="badge rounded-pill btn btn-outline-secondary  text-dark px-3">
          Queue
        </span>`;
    case 'rejected':
      return `
        <span class="badge rounded-pill btn btn-outline-danger text-dark px-3">
          Rejected
        </span>`;
    default:
      return status;
  }
}

export function openNotaModal(notaUrl) {
  // Create modal if it doesn't exist
  let modalElement = document.getElementById('notaModal');
  if (!modalElement) {
    const modalHTML = `
      <div class="modal fade" id="notaModal" tabindex="-1" aria-labelledby="notaModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="notaModalLabel">Nota</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body text-center">
              <img id="notaImage" src="" alt="Nota" class="img-fluid" />
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    modalElement = document.getElementById('notaModal');
  }

  const img = document.getElementById('notaImage');
  img.src = '';
  img.alt = 'Loading...';

  img.onerror = () => {
    img.alt = 'Gagal memuat gambar';
  };

  // Jika notaUrl sudah full URL, gunakan langsung
  // Jika hanya filename, construct URL
  if (notaUrl && notaUrl.startsWith('http')) {
    img.src = notaUrl;
  } else if (notaUrl) {
    img.src = `http://localhost:8000/storage/nota/${notaUrl}`;
  } else {
    img.alt = 'Nota tidak tersedia';
  }

  new bootstrap.Modal(modalElement).show();
}

// Make functions available globally for backward compatibility
window.getStatusBadge = getStatusBadge;
window.openNotaModal = openNotaModal;
