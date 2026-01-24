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
