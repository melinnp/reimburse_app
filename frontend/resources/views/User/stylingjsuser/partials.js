async function loadLayout() {
  const layout = await fetch('../User/partials.html').then((res) => res.text());
  document.getElementById('layout').innerHTML = layout;

  initOffcanvas();
  
  // ✅ Dispatch event 'partials-loaded'
  document.dispatchEvent(new Event('partials-loaded'));
}

document.addEventListener('DOMContentLoaded', loadLayout);