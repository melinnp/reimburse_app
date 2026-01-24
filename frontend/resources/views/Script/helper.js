window.getStatusBadge = function (status) {
  switch (status) {
    case "approved":
      return `
        <span class="badge rounded-pill bg-success-subtle text-success border px-3">
          Sudah Cair
        </span>`;
    case "pending":
      return `
        <span class="badge rounded-pill bg-warning text-dark px-3">
          Queue
        </span>`;
    case "rejected":
      return `
        <span class="badge rounded-pill bg-danger-subtle text-danger border px-3">
          Ditolak
        </span>`;
    default:
      return status;
  }
};

function viewNota(path) {
  if (!path) return alert("Nota tidak tersedia");
  window.open(
    `http://localhost:8000/storage/nota/${path}`,
    "_blank"
  );
}

function approveRequest(id) {
  console.log("Approve:", id);
  // nanti POST ke /approve
}

function openRejectModal(id, name) {
  document.getElementById("rejectTargetName").innerText = name;
  document.getElementById("rejectTargetID").innerText = `REQ-${id}`;

  document.getElementById("btnConfirmReject").onclick = () =>
    rejectRequest(id);

  new bootstrap.Modal(
    document.getElementById("rejectModal")
  ).show();
}

function rejectRequest(id) {
  const reason = document.getElementById("rejectReason").value;
  if (!reason) {
    document.getElementById("rejectReason").classList.add("is-invalid");
    return;
  }

  console.log("Reject:", id, reason);
  // nanti POST ke /reject
}
