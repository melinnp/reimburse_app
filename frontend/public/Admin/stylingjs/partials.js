async function loadLayout() {
  const layout = await fetch('Adsidebar.html').then((res) => res.text());
  const layout2 = await fetch('../User/navbar.html').then((res) => res.text());
  document.getElementById('layout').innerHTML = layout;
  document.getElementById('layout2').innerHTML = layout2;
  
  // Set page title setelah navbar dimuat
  setPageTitle();

  document.dispatchEvent(new Event('partials-loaded'));
}

function setPageTitle() {
  const pageTitleElement = document.getElementById('pageTitle');
  const pageAttr = document.body.getAttribute('data-page');
  
  if (pageTitleElement && pageAttr) {
    pageTitleElement.textContent = pageAttr;
  }
}

document.addEventListener('DOMContentLoaded', loadLayout);
