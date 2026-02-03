import { loadUserLayout, loadAdminLayout } from './layoutManager.js';

export async function loadView(viewPath) {
  const app = document.getElementById('app');
  if (!app) return;

  try {
    // Load the view HTML
    const response = await fetch(`/views/${viewPath}`);
    if (!response.ok) {
      throw new Error(`Failed to load view: ${viewPath}`);
    }

    let html = await response.text();

    // Extract and execute scripts
    const scriptRegex = /<script[^>]*src=["']([^"']+)["'][^>]*><\/script>/gi;
    const scripts = [];
    let match;

    while ((match = scriptRegex.exec(html)) !== null) {
      scripts.push(match[1]);
    }

    // Remove script tags from HTML
    html = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

    // Remove html, head, body tags but keep their content
    html = html.replace(/<!doctype[^>]*>/gi, '');
    html = html.replace(/<html[^>]*>/gi, '');
    html = html.replace(/<\/html>/gi, '');
    html = html.replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '');
    html = html.replace(/<body[^>]*>/gi, '');
    html = html.replace(/<\/body>/gi, '');

    // Update app content
    app.innerHTML = html;

    // Load appropriate layout based on view
    if (viewPath.startsWith('User/')) {
      await loadUserLayout();
    } else if (viewPath.startsWith('Admin/')) {
      await loadAdminLayout();
    }

    // Load and execute scripts
    for (const scriptSrc of scripts) {
      try {
        // Convert relative paths to absolute
        let absolutePath = scriptSrc;
        if (scriptSrc.startsWith('../')) {
          // Replace ../Script/ with /script/ and ../assets/ with /assets/
          absolutePath = scriptSrc.replace(/\.\.\/Script\//gi, '/script/')
                                   .replace(/\.\.\/assets\//gi, '/assets/')
                                   .replace(/\.\.\/Admin\//gi, '/views/Admin/')
                                   .replace(/\.\.\/User\//gi, '/views/User/')
                                   .replace(/\.\.\//g, '/');
        } else if (scriptSrc.startsWith('./')) {
          absolutePath = scriptSrc.replace('./', '/');
        } else if (!scriptSrc.startsWith('/')) {
          absolutePath = '/' + scriptSrc;
        }
        
        // Normalize Script to script (case sensitivity)
        absolutePath = absolutePath.replace(/\/Script\//g, '/script/');

        // Skip layout scripts as they're handled by layoutManager
        if (absolutePath.includes('partials.js') || 
            absolutePath.includes('infoUser.js') || 
            absolutePath.includes('infoAdmin.js') ||
            absolutePath.includes('logout.js')) {
          continue;
        }

        // Load script as module
        const script = document.createElement('script');
        script.type = 'module';
        script.src = absolutePath;
        document.body.appendChild(script);
      } catch (error) {
        console.error(`Error loading script ${scriptSrc}:`, error);
      }
    }

    // Update navigation links to use hash routing
    updateNavigationLinks();
  } catch (error) {
    console.error('Error loading view:', error);
    app.innerHTML = `
      <div class="container mt-5">
        <div class="alert alert-danger">
          <h4>Error Loading Page</h4>
          <p>${error.message}</p>
        </div>
      </div>
    `;
  }
}

function updateNavigationLinks() {
  // Update all links to use hash routing
  const links = document.querySelectorAll('a[href]');
  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('#') && !href.startsWith('http') && !href.startsWith('mailto:')) {
      // Convert to hash route
      let hashRoute = href;
      
      // Map old routes to new hash routes
      if (href.includes('login.html')) {
        hashRoute = '#/login';
      } else if (href.includes('userdash.html')) {
        hashRoute = '#/user/dashboard';
      } else if (href.includes('riwyatuser.html')) {
        hashRoute = '#/user/history';
      } else if (href.includes('pengajuan.html')) {
        hashRoute = '#/user/submission';
      } else if (href.includes('account.html')) {
        hashRoute = '#/user/account';
      } else if (href.includes('admindash.html')) {
        hashRoute = '#/admin/dashboard';
      } else if (href.includes('employees.html')) {
        hashRoute = '#/admin/employees';
      } else if (href.includes('approval.html')) {
        hashRoute = '#/admin/approval';
      } else if (href.includes('accountAdmin.html')) {
        hashRoute = '#/admin/account';
      } else {
        // Default: convert .html to hash route
        hashRoute = '#' + href.replace('.html', '').replace('../', '/');
      }
      
      link.setAttribute('href', hashRoute);
    }
  });
}

