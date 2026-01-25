// 1. Data Dummy
const waitingQueue = [
  { nama: "Ahmad", jenis: "Transport", nominal: 150000, status: "Queue" },
  { nama: "Siti", jenis: "Kesehatan", nominal: 500000, status: "Queue" },
  { nama: "Budi", jenis: "Dinas", nominal: 1200000, status: "Queue" }
];

const employees = [
  { id: "1045", name: "Rizki Canelo", job: "Borongan", status: "Bebaslah", location: "Margaasih" },
  { id: "1046", name: "Fathan Canelo", job: "Mafia CEO", status: "Seumur Hidup", location: "Republik Kedaulatan Cipatik (RCK)" },
  { id: "1047", name: "Thomas Canelo", job: "Pengamen", status: "Dipecat", location: "Nomaden" }
];

// 2. Fungsi Navigasi Halaman
function showPage(pageId) {
  document.getElementById('page-dashboard').style.display = (pageId === 'dashboard') ? 'block' : 'none';
  document.getElementById('page-employees').style.display = (pageId === 'employees') ? 'block' : 'none';
  
  // Update link active
  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => {
    link.classList.remove('active');
    if(link.innerText.toLowerCase() === pageId) link.classList.add('active');
  });
}

// 3. Fungsi Animasi Angka
function animateValue(id, start, end, duration) {
  const obj = document.getElementById(id);
  if (!obj) return;
  let startTime = null;
  const step = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    if (id === 'active') {
      obj.innerHTML = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value).replace(/\s/g, '');
    } else {
      obj.innerHTML = value.toLocaleString('id-ID');
    }
    if (progress < 1) window.requestAnimationFrame(step);
  };
  window.requestAnimationFrame(step);
}

// 4. Render Saat Start
window.addEventListener('DOMContentLoaded', () => {
  // Render Antrean Dashboard
  const queueBody = document.getElementById("queueTableBody");
  waitingQueue.forEach(item => {
    queueBody.innerHTML += `<tr><td>${item.nama}</td><td>${item.jenis}</td><td>Rp ${item.nominal.toLocaleString('id-ID')}</td><td class="status-waiting">${item.status}</td></tr>`;
  });

  // Render Tabel Employee
  const empBody = document.getElementById("employeeTableBody");
  employees.forEach(emp => {
    empBody.innerHTML += `<tr><td>${emp.id}</td><td>${emp.name}</td><td>${emp.job}</td><td>${emp.status}</td><td>${emp.location}</td></tr>`;
  });

  // Animasi Card
  animateValue("active", 0, 4750000, 2000);
  animateValue("employee", 0, 210, 2000);
  animateValue("project", 0, waitingQueue.length, 2000);
  
});