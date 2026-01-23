function initOffcanvas() {
  const offcanvasEl = document.getElementById('offcanvasScrolling');
  const mainContent = document.getElementById('main-content');

  if (!offcanvasEl || !mainContent) return;

  offcanvasEl.addEventListener('shown.bs.offcanvas', () => {
    mainContent.style.marginLeft = '250px';
  });

  // PINDAH KE hide (sebelum animasi nutup)
  offcanvasEl.addEventListener('hide.bs.offcanvas', () => {
    mainContent.style.marginLeft = '0';
  });
}

const nominalInput = document.getElementById('nominalInput');
const currencySelect = document.getElementById('currency');
const curSymbolPreview = document.getElementById('curSymbol');
const form = document.getElementById('formReimburseLaman');

// Map simbol mata uang
const currencyMap = {
  IDR: 'Rp',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
};

// 1. Fungsi Format Angka (Ribuan)
function formatNumber(n) {
  // Hapus semua karakter kecuali angka
  return n.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// 2. Event Listener untuk Input Nominal (Auto Format)
nominalInput.addEventListener('input', function (e) {
  let value = e.target.value;
  // Simpan posisi cursor
  let cursorPosition = e.target.selectionStart;
  let oldLength = value.length;

  // Terapkan format ribuan
  e.target.value = formatNumber(value);

  // Kembalikan posisi cursor agar tidak melompat ke akhir
  let newLength = e.target.value.length;
  cursorPosition = cursorPosition + (newLength - oldLength);
  e.target.setSelectionStart(cursorPosition);
  e.target.setSelectionEnd(cursorPosition);
});

// 3. Update Simbol saat Mata Uang diubah
currencySelect.addEventListener('change', function () {
  const selected = this.value;
  curSymbolPreview.innerText = currencyMap[selected] || selected;
});

// 4. Handle Submit Form
form.addEventListener('submit', function (e) {
  e.preventDefault();

  // Ambil data asli (bersihkan titik pemisah ribuan)
  const rawNominal = nominalInput.value.replace(/\./g, '');
  const currency = currencySelect.value;
  const jenis = document.getElementById('jenis').value;

  if (!rawNominal || rawNominal === '0') {
    alert('Harap masukkan nominal yang valid.');
    return;
  }

  // Simulasi pengiriman data
  console.log('Data Pengajuan Terkirim:', {
    jenis: jenis,
    mataUang: currency,
    nominal: rawNominal,
    tanggal: document.getElementById('tanggal').value,
    keterangan: document.getElementById('keterangan').value,
  });

  alert(`Berhasil!\nPengajuan ${jenis} sebesar ${currencyMap[currency]} ${nominalInput.value} telah dikirim.`);

  // Reset form
  form.reset();
  curSymbolPreview.innerText = 'Rp';
});
