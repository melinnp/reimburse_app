async function loadLayout() {
  const layout = await fetch('../User/partials.html').then(res => res.text());
  document.getElementById('layout').innerHTML = layout;
}
document.addEventListener('DOMContentLoaded', loadLayout);
