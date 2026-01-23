document.getElementById('pengajuanForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  console.log('Aman');

  const token = localStorage.getItem('token');
  if (!token) {
    alert('Silakan login ulang');
    return;
  }

  const formData = new FormData();
  formData.append('kategori', document.getElementById('kategori').value);
  formData.append('tanggal', document.getElementById('tanggal').value);
  formData.append('mata_uang', document.getElementById('jenis').value);
  formData.append('nominal', document.getElementById('nominalInput').value);
  formData.append('keterangan', document.getElementById('keterangan').value);
  formData.append('nota', document.getElementById('nota').files[0]);

  const response = await fetch('http://localhost:8000/api/employee/reimburse/create', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
    },
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    alert(result.message || 'Gagal mengajukan');
    return;
  }

  alert('Pengajuan berhasil');
  window.location.href = '../user/userdash.html';
});
