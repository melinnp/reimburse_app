window.getStatusBadge = function (status) {
  switch (status) {
    case 'approved':
      return `
        <span class="badge rounded-pill bg-success-subtle text-success border px-3">
          Sudah Cair
        </span>`;
    case 'pending':
      return `
        <span class="badge rounded-pill bg-warning text-dark px-3">
          Queue
        </span>`;
    case 'rejected':
      return `
        <span class="badge rounded-pill bg-danger-subtle text-danger border px-3">
          Ditolak
        </span>`;
    default:
      return status;
  }
};

function openNotaModal(path) {
  const img = document.getElementById('notaImage');
  img.src = '';
  img.alt = 'Loading...';

  img.onerror = () => {
    img.alt = 'Gagal memuat gambar';
  };

  img.src = `http://localhost:8000/storage/nota/${path}`;

  new bootstrap.Modal(document.getElementById('notaModal')).show();
}

function approveRequest(id) {
  console.log('Approve:', id);
  // nanti POST ke /approve
}

function openRejectModal(id, name) {
  document.getElementById('rejectTargetName').innerText = name;
  document.getElementById('rejectTargetID').innerText = `REQ-${id}`;

  document.getElementById('btnConfirmReject').onclick = () => rejectRequest(id);

  new bootstrap.Modal(document.getElementById('rejectModal')).show();
}

function rejectRequest(id) {
  const reason = document.getElementById('rejectReason').value;
  if (!reason) {
    document.getElementById('rejectReason').classList.add('is-invalid');
    return;
  }

  console.log('Reject:', id, reason);
  // nanti POST ke /reject
}
