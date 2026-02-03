import { showAlert } from '../alert.js';
import { API_BASE_URL } from '../config.js';
import { router } from '../router.js';

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');

  if (!token) {
    showAlert('warning', 'Session habis, silakan login ulang');
    setTimeout(() => {
      router.navigate('/login');
    }, 2000);
    return;
  }

  // ===============================
  // FETCH DASHBOARD SUMMARY
  // ===============================
  fetch(`${API_BASE_URL}/admin/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error('Unauthorized');
      return res.json();
    })
    .then((res) => {
      const data = res.data;

      const totalKaryawanEl = document.getElementById('totalKaryawan');
      const pendingReimburseEl = document.getElementById('pendingReimburse');
      const totalPengajuanEl = document.getElementById('totalPengajuan');
      const totalDiSetujuiEl = document.getElementById('totalDiSetujui');

      if (totalKaryawanEl) totalKaryawanEl.textContent = data.total_karyawan || 0;
      if (pendingReimburseEl) pendingReimburseEl.textContent = data.pending || 0;
      if (totalPengajuanEl) totalPengajuanEl.textContent = data.total_pengajuan || 0;
      if (totalDiSetujuiEl) totalDiSetujuiEl.textContent = data.approved || 0;
    })
    .catch(() => {
      showAlert('warning', 'Session habis / akses ditolak');
      localStorage.removeItem('token');
      setTimeout(() => {
        router.navigate('/login');
      }, 2000);
    });

  // ===============================
  // FETCH TABLE REIMBURSE
  // ===============================
  fetch(`${API_BASE_URL}/admin/reimburse`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error('Gagal ambil data tabel');
      return res.json();
    })
    .then((res) => {
      const tbody = document.querySelector('table tbody');
      if (!tbody) return;

      tbody.innerHTML = ''; // hapus dummy row

      res.data.forEach((item) => {
        let badgeClass = 'bg-secondary';
        let statusText = item.status;

        if (item.status === 'pending') {
          badgeClass = 'bg-warning text-dark';
          statusText = 'Queue';
        } else if (item.status === 'approved') {
          badgeClass = 'bg-success';
          statusText = 'Approved';
        } else if (item.status === 'rejected') {
          badgeClass = 'bg-danger';
          statusText = 'Rejected';
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="text-center">${item.user?.name || 'N/A'}</td>
            <td class="text-center">${item.kategori}</td>
            <td class="text-center">Rp ${item.nominal_format}</td>
            <td class="text-center">
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
              <td colspan="4" class="text-center text-muted py-3">
                Tidak ada data pengajuan
              </td>
            </tr>
          `;
      }
    })
    .catch(() => {
      showAlert('danger', 'Gagal memuat data tabel');
    });
});
