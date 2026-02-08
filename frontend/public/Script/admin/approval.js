let rejectRequestId = null;
let currentPaymentRequestId = null;

document.addEventListener('DOMContentLoaded', () => {
  loadPendingApproval();
});
async function loadPendingApproval() {
  const token = localStorage.getItem('token');
  if (!token) {
    showAlert('warning', 'Silahkan login ulang');
    setTimeout(() => {
      window.location.href = '/public/Auth/login.html';
    }, 2000);
    return;
  }

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

      // STATUS BADGE
      let statusBadge = '';
      if (item.status === 'pending') {
        statusBadge = `<span class="badge bg-warning text-dark">Pending</span>`;
      } else if (item.status === 'approved') {
        statusBadge = `<span class="badge bg-success">Approved</span>`;
      } else if (item.status === 'paid') {
        statusBadge = `<span class="badge bg-primary">Paid</span>`;
      } else {
        statusBadge = `<span class="badge bg-danger">Rejected</span>`;
      }

      // ACTION BUTTON
      let actionButtons = `
        <button
          class="btn btn-sm btn-outline-success px-2"
          onclick="approveRequest(${item.id})"
          ${item.status !== 'pending' ? 'disabled' : ''}>
          <i class="bi bi-check-lg"></i> Approve
        </button>

        <button
          class="btn btn-sm btn-outline-danger px-2"
          onclick="openRejectModal(${item.id}, '${item.user.name}')"
          ${item.status !== 'pending' ? 'disabled' : ''}>
          <i class="bi bi-x-lg"></i> Reject
        </button>
      `;

      // 🔥 PAYMENT HANYA JIKA APPROVED
      if (item.status === 'approved') {
        actionButtons += `
          <button
            class="btn btn-sm btn-outline-secondary px-2"
            onclick="openPaymentModal(
              ${item.id},
              '${item.user.name}',
              '${item.nomor_rekening}',
              ${item.nominal}
            )">
            Payment
          </button>
        `;
      }

      return `
        <tr class="align-middle">
          <td class="text-center">#REQ-${item.id}</td>

          <td class="text-center">
            <div class="fw-bold">${item.user.name}</div>
            <small class="text-muted">${item.user.email}</small>
          </td>

          <td class="text-center">${item.kategori}</td>

          <td class="fw-bold text-center">
            Rp ${item.nominal_format || item.nominal}
          </td>

          <td class="text-center">
            <button class="btn btn-sm btn-light border"
              onclick="openNotaModal('${item.nota_url}')">
              <i class="bi bi-eye"></i> Lihat
            </button>
          </td>

          <td class="text-center">
            <div class="d-flex justify-content-center gap-2">
              ${actionButtons}
            </div>
          </td>

          <td class="text-center">${statusBadge}</td>
        </tr>
      `;
    })
    .join('');

    tbody.innerHTML = rows;
  } catch (_err) {}
}

// openNotaModal is defined in helper.js - removed duplicate

// Fungsi untuk approve
async function approveRequest(id) {
  const token = localStorage.getItem('token');
  if (!token) return;

  const confirmed = await showConfirmAlert('Konfirmasi Approve', 'Yakin mau approve request ini?', 'Ya, Approve', 'Batal', 'success');

  if (!confirmed) return;

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
      showAlert('danger', result.message || 'Gagal approve');
      return;
    }

    showAlert('success', 'Request berhasil di-approve');
    loadPendingApproval();
  } catch (_err) {
    showAlert('danger', 'Terjadi kesalahan saat approve');
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

function openPaymentModal(id, accountName, accountNumber, nominal) {
  currentPaymentRequestId = id;

  document.getElementById('accName').value = accountName;
  document.getElementById('accNumber').value = accountNumber;
  document.getElementById('amount').value = nominal;

  // auto set tanggal hari ini
  setTodayDate();

  const modal = new bootstrap.Modal(
    document.getElementById('paymentModal')
  );
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
    showAlert('warning', 'ID request tidak valid');
    return;
  }

  // Konfirmasi sebelum reject
  const confirmed = await showConfirmAlert('Konfirmasi Reject', 'Apakah Anda yakin ingin menolak pengajuan ini? Tindakan ini tidak dapat dibatalkan.', 'Ya, Reject', 'Batal', 'danger');

  if (!confirmed) return;

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
      showAlert('danger', result.message || 'Gagal reject');
      return;
    }

    showAlert('success', 'Request berhasil di-reject');

    // Tutup modal
    const modalElement = document.getElementById('rejectModal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();

    // Refresh tabel
    loadPendingApproval();

    // Reset ID
    rejectRequestId = null;
  } catch (_err) {
    showAlert('danger', 'Terjadi kesalahan saat reject');
  }
});
function setTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`;
  document.getElementById('transferDate').value = formattedDate;
}

document.addEventListener('DOMContentLoaded', setTodayDate);

document.querySelector('#paymentModal .btn-primary')
  .addEventListener('click', async () => {

    if (!currentPaymentRequestId) {
      showAlert('warning', 'Request tidak valid');
      return;
    }

    const token = localStorage.getItem('token');

    const payload = {
      bank_name: document.querySelector(
        'input[name="paymentOption"]:checked'
      ).id,
      account_name: accName.value.trim(),
      account_number: accNumber.value.trim(),
      amount: amount.value.replace(/\D/g, ''),
      transfer_date: transferDate.value,
      notes: notes.value.trim(),
    };

    const confirmed = await showConfirmAlert(
      'Konfirmasi Pembayaran',
      'Yakin ingin memproses pembayaran ini?',
      'Ya, Bayar',
      'Batal',
      'warning'
    );

    if (!confirmed) return;

    const res = await fetch(
      `http://localhost:8000/api/admin/reimburse/${currentPaymentRequestId}/pay`,
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await res.json();

    if (!res.ok) {
      showAlert('danger', result.message || 'Gagal pembayaran');
      return;
    }

    showAlert('success', 'Pembayaran berhasil');

    bootstrap.Modal
      .getInstance(document.getElementById('paymentModal'))
      .hide();

    currentPaymentRequestId = null;
    loadPendingApproval();
  });