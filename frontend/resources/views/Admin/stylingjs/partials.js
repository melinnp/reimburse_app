async function loadLayout() {
  const layout = await fetch('partials.html').then((res) => res.text());
  document.getElementById('layout').innerHTML = layout;

  // PENTING: baru jalanin ini SETELAH partials masuk
  initOffcanvas();
}

document.addEventListener('DOMContentLoaded', loadLayout);
