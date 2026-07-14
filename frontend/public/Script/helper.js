window.getStatusBadge = function (status) {
  switch (status) {
    case 'approved':
      return `
        <span class="badge rounded-pill btn btn-outline-success text-dark px-3">
          Approved
        </span>`;

    case 'pending':
      return `
        <span class="badge rounded-pill btn btn-outline-secondary text-dark px-3">
          Queue
        </span>`;

    case 'rejected':
      return `
        <span class="badge rounded-pill btn btn-outline-danger text-dark px-3">
          Rejected
        </span>`;

    case 'paid':
      return `
        <span class="badge rounded-pill btn btn-outline-primary text-dark px-3">
          Paid
        </span>`;

    default:
      return status;
  }
};

function openNotaModal(notaUrl) {
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
    img.src = `${STORAGE_BASE}/nota/${notaUrl}`;
  } else {
    img.alt = 'Nota tidak tersedia';
  }

  new bootstrap.Modal(document.getElementById('notaModal')).show();
}
