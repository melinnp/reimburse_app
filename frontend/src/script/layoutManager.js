import { router } from './router.js';

export async function loadUserLayout() {
  const layout = await fetch('/views/User/sidebar.html').then((res) => res.text());
  const layout2 = await fetch('/views/User/navbar.html').then((res) => res.text());
  
  const layoutEl = document.getElementById('layout');
  const layout2El = document.getElementById('layout2');
  
  if (layoutEl) layoutEl.innerHTML = layout;
  if (layout2El) layout2El.innerHTML = layout2;

  // Load user info scripts
  await loadScript('/script/karyawan/infoUser.js');
  await loadScript('/script/logout.js');
  
  // Set page title
  setPageTitle();

  document.dispatchEvent(new Event('partials-loaded'));
}

export async function loadAdminLayout() {
  const layout = await fetch('/views/Admin/Adsidebar.html').then((res) => res.text());
  const layout2 = await fetch('/views/User/navbar.html').then((res) => res.text());
  
  const layoutEl = document.getElementById('layout');
  const layout2El = document.getElementById('layout2');
  
  if (layoutEl) layoutEl.innerHTML = layout;
  if (layout2El) layout2El.innerHTML = layout2;

  // Load admin info scripts
  await loadScript('/script/admin/infoAdmin.js');
  await loadScript('/script/logout.js');
  
  // Set page title
  setPageTitle();

  document.dispatchEvent(new Event('partials-loaded'));
}

function setPageTitle() {
  const pageTitleElement = document.getElementById('pageTitle');
  const currentHash = window.location.hash.slice(1);
  
  const pageTitles = {
    '/user/dashboard': 'Dashboard',
    '/user/history': 'My History',
    '/user/submission': 'Submission',
    '/user/account': 'Account',
    '/admin/dashboard': 'Dashboard',
    '/admin/employees': 'Employees',
    '/admin/approval': 'Approval',
    '/admin/account': 'Account',
  };
  
  if (pageTitleElement) {
    pageTitleElement.textContent = pageTitles[currentHash] || 'Dashboard';
  }
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

