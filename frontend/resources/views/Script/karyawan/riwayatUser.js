// Tambahkan di riwayatUser.js

document.addEventListener("DOMContentLoaded", () => {
  loadRiwayat();
});

async function loadRiwayat() {
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

    const tbody = document.getElementById("claimTableBody");
    tbody.innerHTML = "";

    if (result.data.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center text-muted py-4">
            Belum ada riwayat pengajuan
          </td>
        </tr>
      `;
      return;
    }

    result.data.forEach((item) => {
      const statusBadge = getStatusBadge(item.status);
      
      tbody.innerHTML += `
        <tr>
          <td class="ps-4">#REQ-${item.id}</td>
          <td>${item.tanggal_format}</td>
          <td class="fw-bold">Rp ${item.nominal_format}</td>
          <td>${statusBadge}</td>
          <td class="text-center">
            <button 
              type="button" 
              class="btn btn-outline-secondary btn-sm"
              onclick="showDetail(${item.id})">
              DETAIL
            </button>
            <button 
              type="button" 
              class="btn btn-outline-danger btn-sm"
              onclick="deleteRequest(${item.id})"
              ${item.status !== 'pending' ? 'disabled' : ''}>
              HAPUS
            </button>
          </td>
        </tr>
      `;
    });

  } catch (err) {
    console.error("Load riwayat error:", err);
  }
}

// Fungsi untuk menampilkan badge status
function getStatusBadge(status) {
  const badges = {
    pending: '<span class="badge bg-warning text-dark">Queue</span>',
    approved: '<span class="badge bg-success">Sudah Cair</span>',
    rejected: '<span class="badge bg-danger">Ditolak</span>',
    paid: '<span class="badge bg-success">Sudah Cair</span>'
  };
  return badges[status] || '<span class="badge bg-secondary">Unknown</span>';
}

// Fungsi untuk menampilkan detail di modal
// Fungsi untuk menampilkan detail di modal
async function showDetail(id) {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch(`http://localhost:8000/api/employee/reimburse/${id}`, {
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
      },
    });

    const result = await res.json();
    
    if (!result.status) {
      alert("Gagal memuat detail");
      return;
    }

    const data = result.data;

    // Update gambar nota
    const imgElement = document.getElementById("modalNotaImage");
    if (imgElement) {
      imgElement.src = `http://localhost:8000/storage/nota/${data.nota_path}`;
    }

    // Update form fields
    document.getElementById("jenis").value = data.kategori || "-";
    document.getElementById("nominal").value = `Rp ${data.nominal_format}` || "-";
    document.getElementById("ket").value = data.keterangan || "-";

    // Tampilkan catatan admin jika status rejected DAN admin_note ada
    const adminNoteWrapper = document.getElementById("adminNoteWrapper");
    const adminNoteTextarea = document.getElementById("adminNote");
    
    console.log("Status:", data.status); // Debug
    console.log("Admin Note:", data.admin_note); // Debug
    
    if (data.status === 'rejected' && data.admin_note) {
      adminNoteWrapper.style.display = "block";
      adminNoteTextarea.value = data.admin_note;
    } else {
      adminNoteWrapper.style.display = "none";
      adminNoteTextarea.value = "";
    }

    // Buka modal
    const modal = new bootstrap.Modal(document.getElementById("exampleModal"));
    modal.show();

  } catch (err) {
    console.error("Show detail error:", err);
    alert("Terjadi kesalahan saat memuat detail");
  }
}

// Fungsi untuk hapus request (opsional, hanya bisa hapus yang pending)
async function deleteRequest(id) {
  const token = localStorage.getItem("token");
  if (!token) return;

  if (!confirm("Yakin ingin menghapus pengajuan ini?")) return;

  try {
    const res = await fetch(`http://localhost:8000/api/employee/reimburse/${id}/delete`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
      },
    });

    const result = await res.json();

    if (!res.ok) {
      alert(result.message || "Gagal menghapus");
      return;
    }

    alert("Pengajuan berhasil dihapus");
    loadRiwayat(); // Refresh tabel

  } catch (err) {
    console.error("Delete error:", err);
    alert("Terjadi kesalahan saat menghapus");
  }
}