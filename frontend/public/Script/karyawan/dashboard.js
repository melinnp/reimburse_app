document.addEventListener("DOMContentLoaded", () => {
  loadDashboard();
});

async function loadDashboard() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Silahkan login ulang");
    window.location.href = "../../auth/login.html";
    return;
  }

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
    // STAT CARD (single pass)
    // =====================
    let pending = 0;
    let approved = 0;
    for (let i = 0; i < data.length; i++) {
      const s = data[i].status;
      if (s === "pending") pending++;
      else if (s === "approved") approved++;
    }
    const total = data.length;

    document.getElementById("statTotal").innerText = total;
    document.getElementById("statPending").innerText = pending;
    document.getElementById("statApproved").innerText = approved;

    // =====================
    // TABLE (single DOM write)
    // =====================
    const tbody = document.getElementById("reimburseTable");
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

    const rows = data.map(item => `
      <tr>
        <td class="ps-4 fw-medium">${item.kategori}</td>
        <td class="text-muted small">${item.tanggal_format}</td>
        <td class="fw-bold">Rp ${item.nominal_format}</td>
        <td>${getStatusBadge(item.status)}</td>
      </tr>
    `).join("");
    tbody.innerHTML = rows;

  } catch (err) {
    console.error("Dashboard error:", err);
  }
}
