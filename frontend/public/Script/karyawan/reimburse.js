document.getElementById('pengajuanForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  e.stopImmediatePropagation();

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Silahkan login ulang");
      window.location.href = "../auth/login.html";
      return;
  }

  try {
    let rawNominal = document.getElementById('nominalInput').value;
    rawNominal = (rawNominal || '').replace(/[^0-9]/g, '');

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

    if (response.ok) {
      alert('Pengajuan berhasil');
      window.location.replace(window.location.pathname.replace(/\/[^/]*$/, '') + '/userdash.html');
      return;
    }

    const result = await response.json().catch(function () { return {}; });
    alert(result.message || 'Gagal mengajukan');
  } catch (err) {
    console.error(err);
    alert('Gagal mengajukan. Periksa koneksi atau coba lagi.');
  }
});
