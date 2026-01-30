document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('pengajuanForm');

  if (!form) {
    console.error('Form tidak ditemukan');
    return;
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Silahkan login ulang');
      window.location.replace('/public/auth/login.html');
      return;
    }

    try {
      // ✅ PAKAI FUNGSI parseNominalValue() dari pengajuan1.js
      const rawNominal = parseNominalValue(document.getElementById('nominalInput').value);

      // Validasi file
      const notaFile = document.getElementById('nota').files[0];
      if (!notaFile) {
        alert('Harap upload bukti nota');
        return;
      }

      const formData = new FormData();
      formData.append('kategori', document.getElementById('kategori').value);
      formData.append('tanggal_nota', document.getElementById('tanggal').value);
      formData.append('mata_uang', 'IDR');
      formData.append('nominal', rawNominal);
      formData.append('keterangan', document.getElementById('keterangan').value);
      formData.append('nota', notaFile);

      const response = await fetch('http://localhost:8000/api/employee/reimburse/create', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          Accept: 'application/json',
        },
        body: formData,
      });

      if (response.ok) {
        alert('Pengajuan berhasil dikirim!');
        form.reset();
        window.location.replace('/public/user/userdash.html');
        return;
      }

      const result = await response.json().catch(function () {
        return {};
      });
      alert(result.message || 'Gagal mengajukan');
    } catch (err) {
      console.error(err);
      alert('Gagal mengajukan. Periksa koneksi atau coba lagi.');
    }
  });
});
