let rejectRequestId = null;

document.addEventListener('DOMContentLoaded', () => {
  loadPendingApproval();
});
async function loadPendingApproval() {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const res = await fetch('http://localhost:8000/api/admin/reimburse', {
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
      },
    });

    const result = await res.json();
    if (!result.status) return;

    const tbody = document.getElementById('approvalTable');
    tbody.innerHTML = '';

    // Colspan jadi 7 karena ada kolom Status
    if (result.data.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center text-muted py-4">
            Tidak ada antrean persetujuan
          </td>
        </tr>
      `;
      return;
    }

    const rows = result.data
      .map((item) => {
        // --- 1. LOGIKA KOLOM STATUS (KEPUTUSAN ADMIN) ---
        let statusBadge = '';
        if (item.status === 'pending') {
          statusBadge = `<span class="badge bg-warning text-dark px-3">Pending</span>`;
        } else if (item.status === 'approved') {
          statusBadge = `<span class="badge bg-success px-3">Approved</span>`;
        } else {
          statusBadge = `<span class="badge bg-danger px-3">Rejected</span>`;
        }

        // --- 2. LOGIKA DISABLE TOMBOL AKSI ---
        // Jika status bukan pending (artinya sudah di-approve/reject), tombol jadi disabled
        const isDisabled = item.status !== 'pending' ? 'disabled' : '';

        return `
        <tr class="align-middle"> <td class="text-center">#REQ-${item.id}</td>
          
          <td class="text-center">
            <div class="fw-bold">${item.user.name}</div>
            <small class="text-muted">${item.user.email}</small>
          </td>
          
          <td class="text-center">
            <span class="badge bg-info-subtle text-dark border px-3">
              ${item.kategori}
            </span>
          </td>
          
          <td class="fw-bold text-center">
            Rp ${item.nominal_format || item.nominal}
          </td>
          
          <td class="text-center">
            <button class="btn btn-sm btn-light border"
              onclick="openNotaModal('${item.nota_path}')">
              <i class="bi bi-eye"></i> Lihat
            </button>
          </td>
          <td class="text-center">
            <div class="d-flex justify-content-center gap-2"> <button
                class="btn btn-sm btn-success px-3"
                onclick="approveRequest(${item.id})"
                ${isDisabled}>
                <i class="bi bi-check-lg"></i> Approve
              </button>
              <button
                class="btn btn-sm btn-danger px-3"
                onclick="openRejectModal(${item.id}, '${item.user.name}')"
                ${isDisabled}>
                <i class="bi bi-x-lg"></i> Reject
              </button>
            </div>
          </td>
          <td class="text-center">
            ${statusBadge}
          </td>
        </tr>
      `;
      })
      .join('');

    tbody.innerHTML = rows;
  } catch (err) {
    console.error('Load approval error:', err);
  }
}

// Fungsi untuk buka modal nota
function openNotaModal(notaPath) {
  const imgElement = document.getElementById('notaImage');
  imgElement.src = `http://localhost:8000/storage/nota/${notaPath}`;

  const modal = new bootstrap.Modal(document.getElementById('notaModal'));
  modal.show();
}

// Fungsi untuk approve
async function approveRequest(id) {
  const token = localStorage.getItem('token');
  if (!token) return;

  if (!confirm('Yakin mau approve request ini?')) return;

  try {
    const res = await fetch(`http://localhost:8000/api/admin/reimburse/${id}/approve`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reason: 'Disetujui oleh admin',
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      alert(result.message || 'Gagal approve');
      return;
    }

    alert('Request berhasil di-approve');
    loadPendingApproval();
  } catch (err) {
    console.error('Approve error:', err);
    alert('Terjadi kesalahan saat approve');
  }
}

// Fungsi untuk buka modal reject
function openRejectModal(id, name) {
  rejectRequestId = id; // Set ID di sini

  document.getElementById('rejectTargetName').innerText = name;
  document.getElementById('rejectTargetID').innerText = `#REQ-${id}`;
  document.getElementById('rejectReason').value = '';
  document.getElementById('rejectReason').classList.remove('is-invalid');

  const modal = new bootstrap.Modal(document.getElementById('rejectModal'));
  modal.show();
}

// Event listener untuk tombol reject (hanya 1x)
document.getElementById('btnConfirmReject').addEventListener('click', async function () {
  const reason = document.getElementById('rejectReason').value.trim();
  const token = localStorage.getItem('token');

  if (!reason) {
    document.getElementById('rejectReason').classList.add('is-invalid');
    return;
  }

  if (!rejectRequestId) {
    alert('ID request tidak valid');
    return;
  }

  try {
    const res = await fetch(`http://localhost:8000/api/admin/reimburse/${rejectRequestId}/reject`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason }),
    });

    const result = await res.json();

    if (!res.ok) {
      alert(result.message || 'Gagal reject');
      return;
    }

    alert('Request berhasil di-reject');

    // Tutup modal
    const modalElement = document.getElementById('rejectModal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();

    // Refresh tabel
    loadPendingApproval();

    // Reset ID
    rejectRequestId = null;
  } catch (err) {
    console.error('Reject error:', err);
    alert('Terjadi kesalahan saat reject');
  }
});
// fungsi search
document.getElementById('searchApproval').addEventListener('input', function () {
  let keyword = this.value.toLowerCase();
  let rows = document.querySelectorAll('#approvalTable tr');

  console.log('Mencari:', keyword);

  rows.forEach((row) => {
    let isiBaris = row.innerText.toLowerCase();

    if (isiBaris.includes(keyword)) {
      row.style.setProperty('display', '', 'important');
    } else {
      row.style.setProperty('display', 'none', 'important');
    }
  });
});
