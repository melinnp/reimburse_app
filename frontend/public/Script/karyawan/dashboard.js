document.addEventListener('DOMContentLoaded', () => {
  loadDashboard();
});

async function loadDashboard() {
  const token = localStorage.getItem('token');
  if (!token) {
    showAlert('warning', 'Silahkan login ulang');
    setTimeout(() => {
      window.location.href = '/public/Auth/login.html';
    }, 2000);
    return;
  }

  try {
    const res = await fetch('http://localhost:8000/api/employee/reimburse', {
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
      },
    });

    const result = await res.json();

    if (!result.status) return;

    const data = result.data;

    // =====================
    // STAT CARD
    // =====================
    let pending = 0;
    let approved = 0;
    let reject = 0;
    let paid = 0;

    for (let i = 0; i < data.length; i++) {
      const s = data[i].status.toLowerCase();
    
      if (s === 'pending' || s === 'queue') {
        pending++;
      } else if (s === 'approved') {
        approved++;
      } else if (s === 'rejected' || s === 'reject') {
        reject++;
      } else if (s === 'paid') {
        paid++;
      }
    }    

    const selesai = paid;

    document.getElementById('statPending').innerText = pending;
    document.getElementById('statApproved').innerText = approved;
    document.getElementById('statReject').innerText = reject;
    document.getElementById('statSelesai').innerText = selesai;

    // =====================
    // TABLE
    // =====================
    const tbody = document.getElementById('reimburseTable');

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

    const rows = data
      .map(
        (item) => `
      <tr class="text-center">
        <td class="text-center">${item.kategori || item.category || '-'}</td>
        <td class="text-center">${formatTanggal(item.tanggal_nota || item.date || item.created_at)}</td>
        <td class="text-center">Rp ${formatRupiah(item.nominal || item.amount || 0)}</td>
        <td class="text-center">${getStatusBadge(item.status)}</td>
      </tr>
    `
      )
      .join('');

    tbody.innerHTML = rows;
  } catch (_err) {
    showAlert('danger', 'Gagal memuat data. Silakan coba lagi.');
  }
}
