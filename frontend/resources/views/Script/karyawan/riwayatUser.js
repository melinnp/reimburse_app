document.addEventListener("DOMContentLoaded", () => {
  fetchRiwayat();
});

function fetchRiwayat() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Silahkan login ulang");
    window.location.href = "../../auth/login.html";
    return;
  }
  
  fetch("http://localhost:8000/api/employee/reimburse", {
    headers: {
      "Authorization": "Bearer " + token,
      "Accept": "application/json"
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("Unauthorized / error API");
      return res.json();
    })
    .then(res => {
      renderTable(res.data);
    })
    .catch(err => {
      console.error(err);
    });
}

function renderTable(data) {
  const tbody = document.getElementById("claimTableBody");
  tbody.innerHTML = "";

  if (data.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-muted py-4">
          Belum ada pengajuan
        </td>
      </tr>`;
    return;
  }

  data.forEach(item => {
    const statusBadge = getStatusBadge(item.status);

    tbody.innerHTML += `
    <tr>
        <td class="ps-4 text-muted small fw-bold">#REB-${item.id}</td>

        <!-- PAKAI ACCESSOR -->
        <td>${item.tanggal_format}</td>

        <td class="fw-bold">Rp ${item.nominal_format}</td>

        <td>${getStatusBadge(item.status)}</td>

        <td class="text-center">
        <button class="btn btn-sm btn-outline-secondary"
            onclick="showDetail(${item.id})">
            Detail
        </button>
        </td>
    </tr>
    `;
  });
}
