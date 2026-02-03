import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import * as bootstrap from 'bootstrap';
import { router } from './script/router.js';
import { checkAuth } from './script/checkAuth.js';

// Make bootstrap available globally
window.bootstrap = bootstrap;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  // Initialize router
  router.init();
  
  // Check authentication on initial load
  const currentPath = window.location.hash.slice(1) || '/';
  if (currentPath !== '/login') {
    checkAuth();
  }
});

