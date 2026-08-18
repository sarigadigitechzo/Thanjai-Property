import { resolve } from 'path'
import { defineConfig } from 'vite'

function adminLinkPlugin() {
  return {
    name: 'admin-link-logger',
    configureServer(server) {
      server.httpServer?.once('listening', () => {
        setTimeout(() => {
          const port = server.config.server.port || 5173;
          console.log(`  \x1b[32m➜\x1b[0m  \x1b[1mAdmin:\x1b[0m   \x1b[36mhttp://localhost:${port}/dashboard.html\x1b[0m\n`);
        }, 100);
      });
    }
  }
}

export default defineConfig({
  plugins: [adminLinkPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        login: resolve(import.meta.dirname, 'login.html'),
        adminLogin: resolve(import.meta.dirname, 'admin-login.html'),
        dashboard: resolve(import.meta.dirname, 'dashboard.html'),
        userDashboard: resolve(import.meta.dirname, 'user-dashboard.html'),
        user_dashboard: resolve(import.meta.dirname, 'user-dashboard.html'),
      },
    },
  },
})
