// Data dummy
const reimbursements = [
  { nama: "Ahmad", jenis: "Transport", nominal: "Rp150.000", status: "Approved" },
  { nama: "Siti", jenis: "Kesehatan", nominal: "Rp500.000", status: "Pending" },
  { nama: "Budi", jenis: "Dinas", nominal: "Rp1.200.000", status: "Rejected" }
];

// Render table
const tableBody = document.getElementById("tableBody");

reimbursements.forEach(item => {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${item.nama}</td>
    <td>${item.jenis}</td>
    <td>${item.nominal}</td>
    <td class="status-${item.status.toLowerCase()}">${item.status}</td>
  `;
  tableBody.appendChild(tr);
});

// Chart
const ctx = document.getElementById("myChart");
new Chart(ctx, {
  type: "line",
  data: {
    labels: ["2019", "2020", "2021", "2022", "2023"],
    datasets: [{
      label: "Total Reimbursement",
      data: [120, 200, 300, 250, 400],
      borderWidth: 2
    }]
  }
});
