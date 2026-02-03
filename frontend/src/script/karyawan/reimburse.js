document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('pengajuanForm');

  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    const token = localStorage.getItem('token');
    if (!token) {
      showAlert('warning', 'Silakan login terlebih dahulu');
      setTimeout(() => {
        window.location.hash = '/login';
      }, 2000);
      return;
    }

    // Konfirmasi sebelum submit
    const confirmed = await showConfirmAlert(
      'Konfirmasi Pengajuan',
      'Apakah Anda yakin ingin mengirim pengajuan reimbursement ini?',
      'Ya, Kirim',
      'Batal',
      'info'
    );

    if (!confirmed) return;

    try {
      // 1. AMBIL NILAI NOMINAL
      const nominalInput = document.getElementById('nominalInput').value;
      let rawNominal;

      // Cek apakah fungsi parseNominalValue tersedia (dari pengajuan1.js)
      if (typeof parseNominalValue === 'function') {
        rawNominal = parseNominalValue(nominalInput);
      } else {
        rawNominal = nominalInput.replace(/[^0-9]/g, '');
      }

      // 2. VALIDASI FILE NOTA
      const notaFileInput = document.getElementById('nota');
      const notaFile = notaFileInput.files[0];
      if (!notaFile) {
        showAlert('warning', 'Harap upload bukti nota');
        return;
      }

      // 3. SIAPKAN FORMDATA
      const formData = new FormData();
      formData.append('kategori', document.getElementById('kategori').value);
      formData.append('tanggal_nota', document.getElementById('tanggal').value);
      formData.append('mata_uang', 'IDR');
      formData.append('nominal', rawNominal);
      formData.append('keterangan', document.getElementById('keterangan').value);
      formData.append('nota', notaFile);

      // 4. KIRIM DATA KE API
      const response = await fetch('http://localhost:8000/api/employee/reimburse/create', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          Accept: 'application/json',
          // PENTING: Jangan tulis Content-Type jika pakai FormData!
        },
        body: formData,
      });

      const result = await response.json().catch(() => ({}));

      // 5. PENGECEKAN RESPON
      if (response.ok) {
        showAlert('success', 'Pengajuan berhasil dikirim!');
        form.reset();
        setTimeout(() => {
          window.location.hash = '/user/dashboard';
        }, 2000);
      } else {
        // Tampilkan pesan error dari Laravel (misal: validasi gagal)
        if (result.errors) {
          // Kalau ada banyak error validasi, gabungkan pesannya
          const errorMsg = Object.values(result.errors).flat().join(', ');
          showAlert('danger', 'Gagal: ' + errorMsg);
        } else {
          showAlert('danger', result.message || 'Gagal mengajukan');
        }
      }
    } catch (_err) {
      showAlert('danger', 'Gagal mengirim data. Silakan coba lagi.');
    }
  });
});
