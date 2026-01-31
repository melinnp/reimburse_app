// Tambahkan fungsi getStatusBadge
function getStatusBadge(status) {
  const badges = {
    pending: '<span class="badge bg-warning text-white rounded-pill px-3 py-2">Queue</span>',
    approved: '<span class="badge bg-success rounded-pill px-3 py-2">Approved</span>',
    rejected: '<span class="badge merah rounded-pill px-3 py-2">Rejected</span>',
  };
  return badges[status] || '<span class="badge bg-secondary rounded-pill px-3 py-2">Unknown</span>';
}

document.addEventListener('DOMContentLoaded', () => {
  loadRiwayat();
});

async function loadRiwayat() {
  const token = localStorage.getItem('token');
  if (!token) return;

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
  } catch (err) {
    console.error('Load riwayat error:', err);
  }
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
      alert('Gagal memuat detail');
      return;
    }

    const data = result.data;

    // Update gambar nota
    const imgElement = document.getElementById('modalNotaImage');
    if (imgElement) {
      imgElement.src = `http://localhost:8000/storage/nota/${data.nota_path}`;
    }

    // Update form fields
    document.getElementById('jenis').value = data.kategori || '-';
    document.getElementById('nominal').value = `Rp ${data.nominal_format}` || '-';
    document.getElementById('ket').value = data.keterangan || '-';

    // Tampilkan catatan admin jika status rejected DAN admin_note ada
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
  } catch (err) {
    console.error('Show detail error:', err);
    alert('Terjadi kesalahan saat memuat detail');
  }
}

// TAMBAHKAN FUNGSI INI - Edit Modal
async function openEditModal(id) {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    // Ambil data dari API
    const res = await fetch(`http://localhost:8000/api/employee/reimburse/${id}`, {
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
      },
    });

    const result = await res.json();

    if (!result.status) {
      alert('Gagal memuat data');
      return;
    }

    const data = result.data;

    // Isi form edit dengan data yang ada
    document.getElementById('editId').value = data.id;
    document.getElementById('editKategori').value = data.kategori;
    document.getElementById('editTanggal').value = data.tanggal_nota;
    document.getElementById('editNominal').value = data.nominal;
    document.getElementById('editKeterangan').value = data.keterangan;

    // Tampilkan preview gambar nota lama
    const previewImg = document.getElementById('editNotaPreview');
    if (previewImg) {
      previewImg.src = `http://localhost:8000/storage/nota/${data.nota_path}`;
      previewImg.style.display = 'block';
    }

    // Buka modal edit
    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
  } catch (err) {
    console.error('Open edit modal error:', err);
    alert('Terjadi kesalahan saat memuat data');
  }
}

// TAMBAHKAN FUNGSI INI - Submit Edit (menggunakan POST)
async function submitEdit() {
  const token = localStorage.getItem('token');
  if (!token) return;

  const id = document.getElementById('editId').value;

  try {
    const formData = new FormData();
    formData.append('kategori', document.getElementById('editKategori').value);
    formData.append('tanggal_nota', document.getElementById('editTanggal').value);
    formData.append('nominal', document.getElementById('editNominal').value);
    formData.append('keterangan', document.getElementById('editKeterangan').value);

    // Jika ada file nota baru yang diupload
    const notaFile = document.getElementById('editNota').files[0];
    if (notaFile) {
      formData.append('nota', notaFile);
    }

    // ✅ HAPUS LINE INI (tidak perlu method spoofing karena API pakai POST)
    // formData.append('_method', 'PUT');

    // ✅ UBAH METHOD JADI POST
    const res = await fetch(`http://localhost:8000/api/employee/reimburse/${id}/update`, {
      method: 'POST', // ✅ Pakai POST sesuai API Laravel
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
      },
      body: formData,
    });

    const result = await res.json();

    if (!res.ok) {
      alert(result.message || 'Gagal mengupdate');
      return;
    }

    alert('Pengajuan berhasil diupdate');

    // Tutup modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
    modal.hide();

    // Refresh tabel
    loadRiwayat();
  } catch (err) {
    console.error('Submit edit error:', err);
    alert('Terjadi kesalahan saat mengupdate');
  }
}

// Fungsi untuk hapus request
async function deleteRequest(id) {
  const token = localStorage.getItem('token');
  if (!token) return;

  if (!confirm('Yakin ingin menghapus pengajuan ini?')) return;

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
      alert(result.message || 'Gagal menghapus');
      return;
    }

    alert('Pengajuan berhasil dihapus');
    loadRiwayat(); // Refresh tabel
  } catch (err) {
    console.error('Delete error:', err);
    alert('Terjadi kesalahan saat menghapus');
  }
}
