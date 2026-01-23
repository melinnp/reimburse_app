document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  console.log('submit masuk');

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('http://localhost:8000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    console.log('response status:', response.status);

    const result = await response.json();
    console.log('result:', result);

    if (!response.ok) {
      //   document.getElementById('errorMsg').innerText = result.message;
      alert(result.message || 'Login gagal');
      return;
    }

    // simpan token
    localStorage.setItem('token', result.token);

    // ambil role
    const role = result.users.role;

    // redirect berdasarkan role
    if (role === 'admin') {
      window.location.href = '../admin/index.html';
    } else if (role === 'karyawan') {
      window.location.href = '../user/userdash.html';
    } else {
      alert('Role tidak dikenali');
    }
  } catch (error) {
    // document.getElementById('errorMsg').innerText = 'Server error';
    alert('Login gagal');
    console.error(error);
  }
});
