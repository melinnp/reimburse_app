document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');

  if (!token) {
    showAlert('warning', 'Session habis, silakan login ulang');
    setTimeout(() => {
      window.location.href = '/public/Auth/login.html';
    }, 2000);
    return;
  }
  fetch('http://localhost:8000/api/admin/dashboard', {
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

      // Queue (pending)
      document.getElementById('totalQueue').textContent = data.pending || 0;

      // Rejected
      document.getElementById('totalRejected').textContent = data.rejected || 0;

      // Approved
      document.getElementById('totalApproved').textContent = data.approved || 0;

      // Completed (paid)
      document.getElementById('totalCompleted').textContent = data.paid || 0;
    })
    .catch(() => {
      showAlert('warning', 'Session habis / akses ditolak');
      localStorage.removeItem('token');
      setTimeout(() => {
        window.location.href = '/public/Auth/login.html';
      }, 2000);
    });

  fetch('http://localhost:8000/api/admin/reimburse', {
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
      tbody.innerHTML = '';

      res.data.forEach((item) => {
        // STATUS BADGE
        let statusBadge = '';
        if (item.status === 'pending') {
          statusBadge = `<span class="badge border border-warning text-warning">Pending</span>`;
        } else if (item.status === 'approved') {
          statusBadge = `<span class="badge border border-success text-success">Approved</span>`;
        } else if (item.status === 'paid') {
          statusBadge = `<span class="badge border border-primary text-primary">Paid</span>`;
        } else {
          statusBadge = `<span class="badge border border-danger text-danger">Rejected</span>`;
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="text-center">${item.user?.name || 'N/A'}</td>
            <td class="text-center">${item.kategori}</td>
            <td class="text-center">Rp ${item.nominal_format}</td>
            <td class="text-center">${statusBadge}</td>
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
