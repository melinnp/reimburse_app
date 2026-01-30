async function loadLayout() {
  const layout = await fetch('Adsidebar.html').then((res) => res.text());
  const layout2 = await fetch('../User/navbar.html').then((res) => res.text());
  document.getElementById('layout').innerHTML = layout;
  document.getElementById('layout2').innerHTML = layout2;

  initOffcanvas();

  document.dispatchEvent(new Event('partials-loaded'));
}

document.addEventListener('DOMContentLoaded', loadLayout);
