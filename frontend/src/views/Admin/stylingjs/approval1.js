// Search dan Filter Status
const searchInput = document.querySelector('#searchInput'); // ✅ ID yang benar
const statusFilter = document.querySelector('#statusFilter'); // ✅ Tambahkan selector untuk dropdown
const tableBody = document.getElementById('approvalTable');

let currentStatusFilter = 'all';

// Function untuk filter berdasarkan status dan search
function applyFilters() {
  if (!searchInput || !tableBody) return;
  
  const searchText = searchInput.value.toLowerCase();
  const rows = tableBody.getElementsByTagName('tr');
  
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    
    // Get ID dari kolom pertama
    const idColumn = row.getElementsByTagName('td')[0];
    const idText = idColumn ? (idColumn.textContent || '').toLowerCase() : '';
    
    // Get Employee name dari kolom kedua (untuk search yang lebih fleksibel)
    const employeeColumn = row.getElementsByTagName('td')[1];
    const employeeText = employeeColumn ? (employeeColumn.textContent || '').toLowerCase() : '';
    
    // Get status dari kolom terakhir
    const statusColumn = row.getElementsByTagName('td')[6]; // Index 6 untuk kolom Status
    const statusText = statusColumn ? (statusColumn.textContent || '').trim() : '';
    
    // Check search filter (cari di ID atau Employee)
    const matchesSearch = idText.indexOf(searchText) > -1 || employeeText.indexOf(searchText) > -1;
    
    // Check status filter - sesuaikan dengan value di HTML
    let matchesStatus = true;
    if (currentStatusFilter !== 'all') {
      // Mapping status dari dropdown ke text di badge
      if (currentStatusFilter === 'Sudah Cair') {
        matchesStatus = statusText.includes('Approved') || statusText.includes('Sudah Cair');
      } else if (currentStatusFilter === 'Queue') {
        matchesStatus = statusText.includes('Queue') || statusText.includes('Pending');
      } else if (currentStatusFilter === 'Ditolak') {
        matchesStatus = statusText.includes('Ditolak') || statusText.includes('Rejected');
      }
    }
    
    // Show/hide row
    row.style.display = (matchesSearch && matchesStatus) ? '' : 'none';
  }
}

// Event listener untuk search (debounced)
if (searchInput && tableBody) {
  let debounceTimer;
  searchInput.addEventListener('keyup', function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(applyFilters, 150);
  });
}

// Event listener untuk status filter dropdown
if (statusFilter) {
  statusFilter.addEventListener('change', function() {
    currentStatusFilter = this.value;
    applyFilters();
  });
}

function renderCurrentMonth() {
  const el = document.getElementById("currentDate");
  if (!el) return;

  const now = new Date();
  const formatted = now.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  el.textContent =
    formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

// init
document.addEventListener("DOMContentLoaded", () => {
  renderCurrentMonth();
});