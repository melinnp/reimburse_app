document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Session habis, silakan login ulang");
    window.location.href = "../../auth/login.html";
    return;
  }

  // ===============================
  // FETCH DASHBOARD SUMMARY
  // ===============================
  fetch("http://localhost:8000/api/admin/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
    })
    .then(res => {
      const data = res.data;

      document.getElementById("totalKaryawan").textContent =
        data.total_karyawan;

      document.getElementById("pendingReimburse").textContent =
        data.pending;

      document.getElementById("totalPengajuan").textContent =
        data.total_pengajuan;
    })
    .catch(() => {
      alert("Session habis / akses ditolak");
      localStorage.removeItem("token");
      window.location.href = "../../auth/login.html";
    });

  // ===============================
  // FETCH TABLE REIMBURSE
  // ===============================
  fetch("http://localhost:8000/api/admin/reimburse", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("Gagal ambil data tabel");
      return res.json();
    })
    .then(res => {
      const tbody = document.querySelector("table tbody");
      tbody.innerHTML = ""; // hapus dummy row

      res.data.forEach(item => {
        let badgeClass = "bg-secondary";
        let statusText = item.status;

        if (item.status === "pending") {
          badgeClass = "bg-warning text-dark";
          statusText = "Queue";
        } else if (item.status === "approved") {
          badgeClass = "bg-success";
          statusText = "Approved";
        } else if (item.status === "rejected") {
          badgeClass = "bg-danger";
          statusText = "Rejected";
        }

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${item.user?.name}</td>
          <td>${item.kategori}</td>
          <td>Rp ${Number(item.nominal).toLocaleString("id-ID")}</td>
          <td>
            <span class="badge ${badgeClass}">
              ${statusText}
            </span>
          </td>
        `;

        tbody.appendChild(tr);
      });

      if (res.data.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="4" class="text-center text-muted">
              Tidak ada data pengajuan
            </td>
          </tr>
        `;
      }
    })
    .catch(err => {
      console.error(err);
      alert("Gagal memuat data tabel");
    });
});
