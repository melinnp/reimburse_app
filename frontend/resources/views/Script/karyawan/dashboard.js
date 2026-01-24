document.addEventListener("DOMContentLoaded", () => {
  loadDashboard();
});

async function loadDashboard() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch("http://localhost:8000/api/employee/reimburse", {
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
      },
    });

    const result = await res.json();
    if (!result.status) return;

    const data = result.data;

    // =====================
    // STAT CARD
    // =====================
    const total = data.length;
    const pending = data.filter(item => item.status === "pending").length;
    const approved = data.filter(item => item.status === "approved").length;

    document.getElementById("statTotal").innerText = total;
    document.getElementById("statPending").innerText = pending;
    document.getElementById("statApproved").innerText = approved;
    // kalau mau isi "Total Selesai", tinggal tambahin id di HTML

    // =====================
    // TABLE
    // =====================
    const tbody = document.getElementById("reimburseTable");
    tbody.innerHTML = "";

    if (data.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" class="text-center text-muted py-4">
            Belum ada pengajuan reimbursement
          </td>
        </tr>
      `;
      return;
    }

    data.forEach(item => {
      tbody.innerHTML += `
        <tr>
          <td class="ps-4 fw-medium">${item.kategori}</td>
          <td class="text-muted small">${item.tanggal_format}</td>
          <td class="fw-bold">Rp ${item.nominal_format}</td>
          <td>${getStatusBadge(item.status)}</td>
        </tr>
      `;
    });

  } catch (err) {
    console.error("Dashboard error:", err);
  }
}
