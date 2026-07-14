document.addEventListener('DOMContentLoaded', function () {
  loadEmployees();

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('keyup', function () {
      const filter = this.value.toLowerCase();
      const rows = document.querySelectorAll('#employeeTable tr');
      rows.forEach(function (row) {
        const nama = row.cells[1] ? row.cells[1].textContent.toLowerCase() : '';
        const username = row.cells[2] ? row.cells[2].textContent.toLowerCase() : '';
        const email = row.cells[3] ? row.cells[3].textContent.toLowerCase() : '';
        row.style.display = (nama.includes(filter) || username.includes(filter) || email.includes(filter)) ? '' : 'none';
      });
    });
  }
});

async function loadEmployees() {
  const token = localStorage.getItem('token');
  if (!token) {
    showAlert("warning", "Silahkan login ulang");
    setTimeout(function () {
      window.location.href = "/public/Auth/login.html";
    }, 2000);
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/admin/employee`, {
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
      },
    });

    const result = await res.json();
    if (!result.status) return;

    const tbody = document.getElementById('employeeTable');
    if (!tbody) return;

    if (result.data.length === 0) {
      tbody.innerHTML = `
          <tr>
            <td colspan="5" class="text-center text-muted py-4">
              Tidak ada data karyawan
            </td>
          </tr>
        `;
      return;
    }

    const rows = result.data
      .map(
        (user, index) => `
        <tr>
          <td class="ps-3 text-center">${index + 1}</td>
          <td class="text-center">${user.name}</td>
          <td class="text-center">${user.username}</td>
          <td class="text-center">
            <span>
              ${user.email}
            </span>
          </td>
          <td class="text-center">
            <span class="badge bg-success-subtle text-success border border-success px-3 ">
              Karyawan
            </span>
          </td>
          <td class="text-center">
            <button class="btn btn-sm btn-outline-danger shadow-sm px-2" onclick="deleteEmployee(${user.id}, '${user.name}')">
              <i class="bi bi-trash"></i>
            </button>
           </td>
        </tr>
      `
      )
      .join('');
    tbody.innerHTML = rows;
  } catch (_error) {}
}
async function deleteEmployee(id, name) {
  const token = localStorage.getItem('token');

  const confirmed = await showConfirmAlert(
    'Konfirmasi Hapus Karyawan',
    `Apakah Anda yakin ingin menghapus karyawan "${name}"? Tindakan ini tidak dapat dibatalkan.`,
    'Ya, Hapus',
    'Batal',
    'danger'
  );
  
  if (!confirmed) return;

  try {
    const res = await fetch(`${API_BASE}/admin/employee/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
      },
    });

    const result = await res.json();

    if (res.ok) {
      showAlert('success', 'Karyawan berhasil dihapus!');
      loadEmployees();
    } else {
      showAlert('danger', result.message || 'Gagal menghapus karyawan');
    }
  } catch (_error) {
    showAlert('danger', 'Terjadi kesalahan koneksi saat menghapus');
  }
}
