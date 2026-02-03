import { loadView } from './viewLoader.js';
import { checkAuth } from './checkAuth.js';

class Router {
  constructor() {
    this.routes = {
      '/': () => this.redirectBasedOnRole(),
      '/login': () => loadView('Auth/login.html'),
      '/user/dashboard': () => {
        checkAuth();
        loadView('User/userdash.html');
      },
      '/user/history': () => {
        checkAuth();
        loadView('User/riwyatuser.html');
      },
      '/user/submission': () => {
        checkAuth();
        loadView('User/pengajuan.html');
      },
      '/user/account': () => {
        checkAuth();
        loadView('User/account.html');
      },
      '/admin/dashboard': () => {
        checkAuth();
        loadView('Admin/admindash.html');
      },
      '/admin/employees': () => {
        checkAuth();
        loadView('Admin/employees.html');
      },
      '/admin/approval': () => {
        checkAuth();
        loadView('Admin/approval.html');
      },
      '/admin/account': () => {
        checkAuth();
        loadView('Admin/accountAdmin.html');
      },
    };
  }

  init() {
    // Handle initial route
    this.handleRoute();

    // Listen for hash changes
    window.addEventListener('hashchange', () => {
      this.handleRoute();
    });

    // Prevent default link behavior and use hash routing
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (link) {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href && href !== '#') {
          window.location.hash = href.slice(1);
        }
      }
    });
  }

  handleRoute() {
    const hash = window.location.hash.slice(1) || '/';
    const route = this.routes[hash];

    if (route) {
      route();
    } else {
      // 404 - redirect to login or dashboard based on auth
      const token = localStorage.getItem('token');
      if (token) {
        this.redirectBasedOnRole();
      } else {
        window.location.hash = '/login';
      }
    }
  }

  redirectBasedOnRole() {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.hash = '/login';
      return;
    }

    const user = JSON.parse(localStorage.getItem('users') || '{}');
    const role = user.role;

    if (role === 'admin') {
      window.location.hash = '/admin/dashboard';
    } else if (role === 'karyawan') {
      window.location.hash = '/user/dashboard';
    } else {
      window.location.hash = '/login';
    }
  }

  navigate(path) {
    window.location.hash = path;
  }
}

export const router = new Router();

