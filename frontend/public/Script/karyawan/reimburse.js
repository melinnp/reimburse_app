document.getElementById('pengajuanForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  console.log('Aman');

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Silahkan login ulang");
    window.location.href = "../../auth/login.html";
    return;
  }

  let rawNominal = document.getElementById('nominalInput').value;

  rawNominal = rawNominal.replace(/[^0-9]/g, '');

  const formData = new FormData();
  formData.append('kategori', document.getElementById('kategori').value);
  formData.append('tanggal_nota', document.getElementById('tanggal').value);
  formData.append('mata_uang', document.getElementById('jenis').value);
  formData.append('nominal', rawNominal);
  formData.append('keterangan', document.getElementById('keterangan').value);
  formData.append('nota', document.getElementById('nota').files[0]);

  const response = await fetch('http://localhost:8000/api/employee/reimburse/create', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json', 
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
