import { resolve } from 'path'
import { defineConfig } from 'vite'

function adminLinkPlugin() {
  return {
    name: 'admin-link-logger',
    configureServer(server) {
      server.httpServer?.once('listening', () => {
        setTimeout(() => {
          const port = server.config.server.port || 5173;
          console.log(`  \x1b[32m➜\x1b[0m  \x1b[1mAdmin:\x1b[0m   \x1b[36mhttp://localhost:${port}/admin-login\x1b[0m\n`);
        }, 100);
      });
    }
  }
}

function cleanUrlRewritePlugin() {
  return {
    name: 'clean-url-rewrite',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url ? req.url.split('?')[0].split('#')[0] : '';
        if (url === '/admin-dashboard') {
          req.url = '/dashboard.html';
        } else if (url === '/user-login' || url === '/user-register' || url === '/login' || url === '/register') {
          req.url = '/login.html';
        } else if (url === '/user-dashboard') {
          req.url = '/user-dashboard.html';
        } else if (
          !url.includes('.') && 
          !url.startsWith('/@') && 
          !url.startsWith('/src') && 
          !url.startsWith('/public') && 
          !url.startsWith('/node_modules') &&
          !url.includes('dashboard') &&
          !url.includes('login')
        ) {
          req.url = '/index.html';
        }
        next();
      });
    }
  }
}

export default defineConfig({
  plugins: [adminLinkPlugin(), cleanUrlRewritePlugin()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        login: resolve(import.meta.dirname, 'login.html'),
        dashboard: resolve(import.meta.dirname, 'dashboard.html'),
        userDashboard: resolve(import.meta.dirname, 'user-dashboard.html'),
        user_dashboard: resolve(import.meta.dirname, 'user-dashboard.html'),
      },
    },
  },
})
