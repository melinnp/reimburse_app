// document.addEventListener("DOMContentLoaded", () => {
//   loadEmployees();
// });

// async function loadEmployees() {
//   const token = localStorage.getItem("token");
//   if (!token) return;

//   try {
//     const res = await fetch("http://localhost:8000/api/admin/employee", {
//       headers: {
//         Authorization: "Bearer " + token,
//         Accept: "application/json",
//       },
//     });

//     const result = await res.json();
//     if (!result.status) return;

//     const tbody = document.getElementById("employeeTable");
//     if (result.data.length === 0) {
//       tbody.innerHTML = `
//         <tr>
//           <td colspan="5" class="text-center text-muted py-4">
//             Tidak ada data karyawan
//           </td>
//         </tr>
//       `;
//       return;
//     }

//     const rows = result.data.map((user, index) => `
//       <tr>
//         <td class="ps-3">${index + 1}</td>
//         <td class="fw-bold">${user.name}</td>
//         <td>${user.username}</td>
//         <td>
//           <span class="text-primary fw-semibold">
//             ${user.email}
//           </span>
//         </td>
//         <td>
//           <span class="badge bg-success-subtle text-success border border-success px-3">
//             Karyawan
//           </span>
//         </td>
//       </tr>
//     `).join("");
//     tbody.innerHTML = rows;

//   } catch (error) {
//     console.error("Gagal load employees:", error);
//   }
// }
