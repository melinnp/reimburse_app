document.addEventListener("DOMContentLoaded", () => {
  loadPendingApproval();
});

async function loadPendingApproval() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch(
      "http://localhost:8000/api/admin/reimburse",
      {
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json",
        },
      }
    );

    const result = await res.json();
    if (!result.status) return;

    const tbody = document.getElementById("approvalTable");
    tbody.innerHTML = "";

    if (result.data.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center text-muted py-4">
            Tidak ada antrean persetujuan
          </td>
        </tr>
      `;
      return;
    }

    result.data.forEach(item => {
      tbody.innerHTML += `
        <tr>
          <td>#REQ-${item.id}</td>
          <td>
            <div class="fw-bold">${item.user.name}</div>
            <small class="text-muted">${item.user.email}</small>
          </td>
          <td>
            <span class="badge bg-info-subtle text-info border px-3">
              ${item.kategori}
            </span>
          </td>
          <td class="fw-bold">
            Rp ${item.nominal_format}
          </td>
          <td>
            <button class="btn btn-sm btn-light border"
              onclick="viewNota('${item.nota_path}')">
              <i class="bi bi-eye"></i> Lihat
            </button>
          </td>
          <td class="text-center">
            <button
              class="btn btn-sm btn-success px-3 me-2"
              onclick="approveRequest(${item.id})">
              <i class="bi bi-check-lg"></i> Approve
            </button>
            <button
              class="btn btn-sm btn-danger px-3"
              onclick="openRejectModal(${item.id}, '${item.user.name}')">
              <i class="bi bi-x-lg"></i> Reject
            </button>
          </td>
        </tr>
      `;
    });

  } catch (err) {
    console.error("Load approval error:", err);
  }
}
