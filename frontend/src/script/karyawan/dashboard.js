import { showAlert } from '../alert.js';
import { getStatusBadge } from '../helper.js';
import { API_BASE_URL } from '../config.js';
import { router } from '../router.js';

document.addEventListener('DOMContentLoaded', () => {
  loadDashboard();
});

async function loadDashboard() {
  const token = localStorage.getItem('token');
  if (!token) {
    showAlert('warning', 'Silahkan login ulang');
    setTimeout(() => {
      router.navigate('/login');
    }, 2000);
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/employee/reimburse`, {
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

    for (let i = 0; i < data.length; i++) {
      const s = data[i].status.toLowerCase();
      if (s === 'pending' || s === 'queue') pending++;
      else if (s === 'approved') approved++;
      else if (s === 'rejected' || s === 'reject') reject++;
    }

    const selesai = approved + reject;

    const statPendingEl = document.getElementById('statPending');
    const statApprovedEl = document.getElementById('statApproved');
    const statRejectEl = document.getElementById('statReject');
    const statSelesaiEl = document.getElementById('statSelesai');

    if (statPendingEl) statPendingEl.innerText = pending;
    if (statApprovedEl) statApprovedEl.innerText = approved;
    if (statRejectEl) statRejectEl.innerText = reject;
    if (statSelesaiEl) statSelesaiEl.innerText = selesai;

    // =====================
    // TABLE
    // =====================
    const tbody = document.getElementById('reimburseTable');
    if (!tbody) return;

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

function formatTanggal(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatRupiah(angka) {
  return new Intl.NumberFormat('id-ID').format(angka);
}
