document.addEventListener('DOMContentLoaded', () => {
  loadEmployees();
});

async function loadEmployees() {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const res = await fetch('http://localhost:8000/api/admin/employee', {
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
      },
    });

    const result = await res.json();
    if (!result.status) return;

    const tbody = document.getElementById('employeeTable');
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
      </tr>
    `
      )
      .join('');
    tbody.innerHTML = rows;
  } catch (error) {
    console.error('Gagal load employees:', error);
  }
  document.getElementById('searchInput').addEventListener('keyup', function () {
    let filter = this.value.toLowerCase();
    let rows = document.querySelectorAll('#employeeTable tr');

    rows.forEach((row) => {
      // 3. Ambil teks dari kolom Nama (kolom ke-2) dan Username (kolom ke-3)
      // Kita pakai textContent biar simpel
      let nama = row.cells[1] ? row.cells[1].textContent.toLowerCase() : '';
      let username = row.cells[2] ? row.cells[2].textContent.toLowerCase() : '';
      let email = row.cells[3] ? row.cells[3].textContent.toLowerCase() : '';
      if (nama.includes(filter) || username.includes(filter) || email.includes(filter)) {
        row.style.display = ''; 
      } else {
        row.style.display = 'none'; 
      }
    });
  });
}
