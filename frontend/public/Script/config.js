// public/Script/config.js
const APP_BASE = (() => {
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') {
    return 'http://localhost:8000';
  }
  return 'https://reimburse-api.tansys.my.id';
})();

const API_BASE = `${APP_BASE}/api`;
const STORAGE_BASE = `${APP_BASE}/storage`;