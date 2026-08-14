export function renderLogin() {
  return `
    <div class="login-wrapper">
      <div class="login-card">
        <div class="login-header">
          <img src="/thanjai-official-new.png" alt="Thanjai Property Logo" class="login-logo" />
          <h1 class="login-title">Sign in to your workspace</h1>
        </div>

        <form class="login-form" id="login-form">
          <div class="login-field">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" placeholder="you@company.com" required />
          </div>
          <div class="login-field">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" placeholder="********" required />
          </div>
          <button type="submit" class="btn btn-primary login-btn">Sign in</button>
          <a href="#" class="forgot-password">Forgot password?</a>
        </form>

        <div class="demo-logins-container">
          <div class="demo-logins-title">Demo logins (password: Admin@1234) — click to fill</div>
          <div class="demo-logins-grid">
            <div class="demo-user" data-email="admin@realrest.example">
              <div class="demo-role">Super Admin</div>
              <div class="demo-email">admin@realrest.example</div>
            </div>
            <div class="demo-user" data-email="manager@realrest.example">
              <div class="demo-role">Sales Manager</div>
              <div class="demo-email">manager@realrest.example</div>
            </div>
            <div class="demo-user" data-email="kavitha@realrest.example">
              <div class="demo-role">Sales Executive</div>
              <div class="demo-email">kavitha@realrest.example</div>
            </div>
            <div class="demo-user" data-email="arun@realrest.example">
              <div class="demo-role">Sales Executive</div>
              <div class="demo-email">arun@realrest.example</div>
            </div>
            <div class="demo-user" data-email="priya@realrest.example">
              <div class="demo-role">Property Staff</div>
              <div class="demo-email">priya@realrest.example</div>
            </div>
            <div class="demo-user" data-email="senthil@chennaiprime.example">
              <div class="demo-role">Partner User</div>
              <div class="demo-email">senthil@chennaiprime.example...</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function initLogin() {
  const app = document.getElementById('login-app');
  if (!app) return;
  app.innerHTML = renderLogin();

  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const demoUsers = document.querySelectorAll('.demo-user');

  demoUsers.forEach(user => {
    user.addEventListener('click', () => {
      const email = user.getAttribute('data-email');
      emailInput.value = email;
      passwordInput.value = 'Admin@1234';
    });
  });

  const form = document.getElementById('login-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.login-btn');
    btn.textContent = 'Signing in...';
    setTimeout(() => {
      window.location.href = '/';
    }, 1500);
  });
}

document.addEventListener('DOMContentLoaded', initLogin);
