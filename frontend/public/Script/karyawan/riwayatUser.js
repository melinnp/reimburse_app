// getStatusBadge is defined globally in helper.js - removed duplikat
function formatRupiah(value) {
  return 'Rp ' + Number(value).toLocaleString('id-ID');
}

document.addEventListener('DOMContentLoaded', () => {
  loadRiwayat();
});

async function loadRiwayat() {
  const token = localStorage.getItem('token');
  if (!token) {
    showAlert('warning', 'Silakan login ulang');
    setTimeout(() => {
      window.location.replace('/public/Auth/login.html');
    }, 2000);
    return;
  }

  try {
    const res = await fetch('http://localhost:8000/api/employee/reimburse', {
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
      },
    });

    const result = await res.json();
    if (!result.status) return;

    const tbody = document.getElementById('claimTableBody');
    tbody.innerHTML = '';

    if (result.data.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center text-muted py-4">
            Belum ada riwayat pengajuan
          </td>
        </tr>
      `;
      return;
    }

    const rows = result.data
      .map((item) => {
        return `
        <tr>
          <td class="text-center">#REQ-${item.id}</td>
          <td class="text-center">${item.tanggal_format}</td>
          <td class="text-center">Rp ${item.nominal_format}</td>
          <td class="text-center">${getStatusBadge(item.status)}</td>
          <td class="text-center">
            <button 
              type="button" 
              class="btn btn-outline-secondary btn-sm rounded-4 me-2"
              onclick="showDetail(${item.id})">
              DETAIL
            </button>
            <button 
              type="button" 
              class="btn btn-outline-primary btn-sm rounded-4 me-2"
              onclick="openEditModal(${item.id})"
              ${item.status !== 'pending' ? 'disabled' : ''}>
              EDIT
            </button>
            <button 
              type="button" 
              class="btn btn-outline-danger btn-sm rounded-4"
              onclick="deleteRequest(${item.id})"
              ${item.status !== 'pending' ? 'disabled' : ''}>
              HAPUS
            </button>
          </td>
        </tr>
      `;
      })
      .join('');
    tbody.innerHTML = rows;
  } catch (_err) {}
}

// Fungsi untuk menampilkan detail di modal
async function showDetail(id) {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const res = await fetch(`http://localhost:8000/api/employee/reimburse/${id}`, {
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
      },
    });

    const result = await res.json();

    if (!result.status) {
      showAlert('danger', 'Gagal memuat detail');
      return;
    }

    const data = result.data;

    const paymentWrapper = document.getElementById('paymentInfoWrapper');

    if (data.status === 'paid' && data.payment) {
      paymentWrapper.style.display = 'block';

      document.getElementById('paidBy').value =
        data.payment.admin.name || '-';

      document.getElementById('paidDate').value =
        data.payment.transfer_date || '-';

      document.getElementById('paidAmount').value =
        formatRupiah(data.payment.amount);

      document.getElementById('paymentNote').value =
        data.payment.notes || '-';
    } else {
      paymentWrapper.style.display = 'none';
    }

    // Update gambar nota
    const imgElement = document.getElementById('modalNotaImage');
    if (imgElement) {
      if (data.nota_url) {
        imgElement.src = data.nota_url + '?t=' + new Date().getTime();
      } else if (data.nota) {
        imgElement.src = `http://localhost:8000/storage/nota/${data.nota}?t=${new Date().getTime()}`;
      } else {
        imgElement.src = 'https://via.placeholder.com/400x200?text=No+Image';
      }
      imgElement.onerror = function () {
        this.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found';
      };
    }

    // Update form fields
    document.getElementById('jenis').value = data.kategori || '-';
    document.getElementById('nominal').value = formatRupiah(data.nominal) || '-';
    document.getElementById('detailRekening').value = data.nomor_rekening || '-';
    document.getElementById('ket').value = data.keterangan || '-';

    // Admin note
    const adminNoteWrapper = document.getElementById('adminNoteWrapper');
    const adminNoteTextarea = document.getElementById('adminNote');

    if (data.status === 'rejected' && data.admin_note) {
      adminNoteWrapper.style.display = 'block';
      adminNoteTextarea.textContent = data.admin_note;
    } else {
      adminNoteWrapper.style.display = 'none';
      adminNoteTextarea.textContent = '';
    }

    // Buka modal
    const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
    modal.show();
  } catch (_err) {
    showAlert('danger', 'Terjadi kesalahan saat memuat detail');
  }
}

// Fungsi untuk edit modal
async function openEditModal(id) {
  const token = localStorage.getItem('token');
  if (!token) {
    showAlert('warning', 'Token tidak ditemukan. Silakan login ulang.');
    return;
  }

  try {
    const res = await fetch(`http://localhost:8000/api/employee/reimburse/${id}`, {
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      showAlert('danger', `Error ${res.status}: Gagal memuat data`);
      return;
    }

    const result = await res.json();

    if (!result.status) {
      showAlert('danger', result.message || 'Gagal memuat data');
      return;
    }

    const data = result.data;

    // Isi form
    document.getElementById('editId').value = data.id;
    document.getElementById('editKategori').value = data.kategori || '';
    document.getElementById('editRekening').value = data.nomor_rekening || '';
    document.getElementById('editTanggal').value = data.tanggal_iso || '';
    document.getElementById('editNominal').value = data.nominal_format || '';
    document.getElementById('editKeterangan').value = data.keterangan || '';

    // Preview gambar
    const previewImg = document.getElementById('editNotaPreview');
    if (previewImg) {
      if (data.nota_url) {
        previewImg.src = data.nota_url + '?t=' + new Date().getTime();
        previewImg.style.display = 'block';
      } else if (data.nota) {
        previewImg.src = `http://localhost:8000/storage/nota/${data.nota}?t=${new Date().getTime()}`;
        previewImg.style.display = 'block';
      } else {
        previewImg.style.display = 'none';
      }
      previewImg.onerror = function () {
        this.style.display = 'none';
      };
    }

    // Reset file input
    document.getElementById('editNota').value = '';

    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
  } catch (err) {
    showAlert('danger', 'Terjadi kesalahan: ' + (err.message || ''));
  }
}

document.getElementById('editNota').addEventListener('change', function (e) {
  const file = e.target.files[0];
  const previewImg = document.getElementById('editNotaPreview');

  if (!file) return;

  // Validasi ringan (opsional tapi recommended)
  if (!file.type.startsWith('image/')) {
    showAlert('warning', 'File harus berupa gambar');
    e.target.value = '';
    previewImg.style.display = 'none';
    return;
  }

  // Buat URL sementara untuk preview
  const objectUrl = URL.createObjectURL(file);

  previewImg.src = objectUrl;
  previewImg.style.display = 'block';

  // Bersihin memory setelah load
  previewImg.onload = () => {
    URL.revokeObjectURL(objectUrl);
  };
});


// Submit Edit (menggunakan POST)
async function submitEdit() {
  const token = localStorage.getItem('token');
  if (!token) return;

  const id = document.getElementById('editId').value;

  // Konfirmasi sebelum update
  const confirmed = await showConfirmAlert(
    'Konfirmasi Update',
    'Apakah Anda yakin ingin mengupdate pengajuan ini?',
    'Ya, Update',
    'Batal',
    'warning'
  );

  if (!confirmed) return;

  try {
    const formData = new FormData();
    formData.append('kategori', document.getElementById('editKategori').value);
    formData.append('tanggal_nota', document.getElementById('editTanggal').value);
    formData.append('nomor_rekening', document.getElementById('editRekening').value);
    formData.append('nominal', document.getElementById('editNominal').value);
    formData.append('keterangan', document.getElementById('editKeterangan').value);

    // PERBAIKAN: Gunakan field name 'nota' sesuai dengan backend
    const notaFile = document.getElementById('editNota').files[0];
    if (notaFile) {
      formData.append('nota', notaFile);
    }

    const res = await fetch(`http://localhost:8000/api/employee/reimburse/${id}/update`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
      },
      body: formData,
    });

    const result = await res.json();

    if (!res.ok) {
      showAlert('danger', result.message || 'Gagal mengupdate');
      return;
    }

    showAlert('success', 'Pengajuan berhasil diupdate');

    // Tutup modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
    modal.hide();

    // Refresh tabel
    loadRiwayat();
  } catch (_err) {
    showAlert('danger', 'Terjadi kesalahan saat mengupdate');
  }
}

// Fungsi untuk hapus request
async function deleteRequest(id) {
  const token = localStorage.getItem('token');
  if (!token) return;

  const confirmed = await showConfirmAlert(
    'Konfirmasi Hapus',
    'Yakin ingin menghapus pengajuan ini? Tindakan ini tidak dapat dibatalkan.',
    'Ya, Hapus',
    'Batal',
    'danger'
  );
  
  if (!confirmed) return;

  try {
    const res = await fetch(`http://localhost:8000/api/employee/reimburse/${id}/delete`, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
      },
    });

    const result = await res.json();

    if (!res.ok) {
      showAlert('danger', result.message || 'Gagal menghapus');
      return;
    }

    showAlert('success', 'Pengajuan berhasil dihapus');
    loadRiwayat(); // Refresh tabel
  } catch (_err) {
    showAlert('danger', 'Terjadi kesalahan saat menghapus');
  }
}
function viewFullImage() {
  const img = document.getElementById("modalNotaImage");
  const fullImg = document.getElementById("fullImagePreview");

  if (!img || !img.src) return;

  fullImg.src = img.src;

  const modal = new bootstrap.Modal(
    document.getElementById("fullImageModal")
  );

  modal.show();
}
