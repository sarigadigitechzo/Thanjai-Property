import { initiateRegistration, verifyOTPAndActivate, loginUser, getPendingOTPUser } from './utils/userAuthStore.js';

export function renderLogin(initialMode = 'signin') {
  const pending = getPendingOTPUser();
  const targetEmail = pending ? pending.email : 'you@example.com';

  return `
    <div class="login-wrapper">
      <div class="login-split-card">
        
        <!-- LEFT DARK SLATE VISUAL PANEL -->
        <div class="login-left-panel">
          <div class="login-left-content">
            <div class="login-brand-area">
              <h2 style="font-size: 1.4rem; font-weight: 800; color: #fff; margin: 0; letter-spacing: 1px;">Thanjai<span style="color: #eb5e28;">Property</span></h2>
            </div>

            <div class="login-left-illustration">
              <div class="house-graphic-box">
                <i class="ri-building-4-line"></i>
              </div>
            </div>

            <div class="login-left-tagline" id="left-tagline">
              ${initialMode === 'otp'
                ? `Enter the 4-digit OTP sent to ${targetEmail} to complete verification.`
                : initialMode === 'register'
                  ? 'Find your perfect home in Thanjavur & surrounding areas. Trusted listings, verified owners.'
                  : 'Welcome back! Sign in to continue exploring properties in Thanjavur & surrounding areas.'
              }
            </div>
          </div>
        </div>

        <!-- RIGHT FORM PANEL -->
        <div class="login-right-panel">

          <!-- SIGN IN FORM MODE -->
          <div class="auth-mode-container ${initialMode === 'signin' ? 'active-mode' : ''}" id="mode-signin">
            <h1 class="auth-heading">Sign in to your account</h1>

            <form class="auth-form" id="signin-form" onsubmit="return false;">
              <div class="auth-field">
                <label class="auth-label" for="signin-email">EMAIL ADDRESS</label>
                <div class="input-icon-wrap">
                  <i class="ri-mail-line field-icon"></i>
                  <input type="email" id="signin-email" name="email" placeholder="you@example.com" required class="auth-input" />
                </div>
              </div>

              <div class="auth-field">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <label class="auth-label" for="signin-password">PASSWORD</label>
                  <a href="#" class="forgot-link">Forgot password?</a>
                </div>
                <div class="input-icon-wrap">
                  <i class="ri-lock-2-line field-icon"></i>
                  <input type="password" id="signin-password" name="password" placeholder="Enter your password" required class="auth-input" />
                  <i class="ri-eye-line toggle-pw-icon" id="toggle-signin-pw" title="Toggle password visibility"></i>
                </div>
              </div>

              <div class="auth-checkbox-row">
                <label class="checkbox-label">
                  <input type="checkbox" id="remember-me" checked />
                  <span>Remember me</span>
                </label>
              </div>

              <button type="submit" class="auth-submit-btn" id="signin-btn">
                Sign in
              </button>

              <div class="auth-toggle-footer">
                Don't have an account? <a href="#" id="go-to-register" class="auth-link">Sign up for free</a>
              </div>
            </form>

            <!-- DEMO LOGIN QUICK FILL -->
            <div class="demo-logins-container">
              <div class="demo-logins-title"><i class="ri-key-2-line"></i> Client Portal Demo Accounts — click to fill</div>
              <div class="demo-logins-grid">
                <div class="demo-user" data-email="kanidigitechzo@gmail.com">
                  <div class="demo-role">Kani Digitechzo (Individual Owner)</div>
                  <div class="demo-email">kanidigitechzo@gmail.com</div>
                </div>
                <div class="demo-user" data-email="senthil.agent@thanjai.example">
                  <div class="demo-role">Senthil Kumar (Agent / Broker)</div>
                  <div class="demo-email">senthil.agent@thanjai.example</div>
                </div>
                <div class="demo-user" data-email="tamilselvan.builder@thanjai.example">
                  <div class="demo-role">Tamilselvan R. (Builder / Developer)</div>
                  <div class="demo-email">tamilselvan.builder@thanjai.example</div>
                </div>
              </div>
            </div>
          </div>

          <!-- CREATE ACCOUNT FORM MODE -->
          <div class="auth-mode-container ${initialMode === 'register' ? 'active-mode' : ''}" id="mode-register">
            <a href="#" id="reg-back-to-signin" style="display: inline-flex; align-items: center; gap: 6px; font-size: 0.85rem; font-weight: 700; color: #718096; text-decoration: none; margin-bottom: 24px; transition: color 0.2s;" onmouseover="this.style.color='#2d3748'" onmouseout="this.style.color='#718096'">
              <i class="ri-arrow-left-line"></i> Back to Sign In
            </a>
            <h1 class="auth-heading">Create your Account</h1>

            <form class="auth-form" id="register-form" onsubmit="return false;">
              <div class="auth-field">
                <label class="auth-label" for="reg-fullname">FULL NAME</label>
                <div class="input-icon-wrap">
                  <i class="ri-user-3-line field-icon"></i>
                  <input type="text" id="reg-fullname" name="fullname" placeholder="Enter your full name" required class="auth-input" />
                </div>
              </div>

              <div class="auth-field">
                <label class="auth-label" for="reg-email">EMAIL ADDRESS (USERNAME)</label>
                <div class="input-icon-wrap">
                  <i class="ri-mail-line field-icon"></i>
                  <input type="email" id="reg-email" name="email" placeholder="you@example.com" required class="auth-input" />
                </div>
              </div>

              <div class="auth-field">
                <label class="auth-label" for="reg-phone">MOBILE NUMBER</label>
                <div class="input-icon-wrap">
                  <i class="ri-phone-line field-icon"></i>
                  <input type="tel" id="reg-phone" name="phone" placeholder="10-digit mobile number" maxlength="10" pattern="[0-9]{10}" required class="auth-input" oninput="this.value = this.value.replace(/[^0-9]/g, '')" />
                </div>
              </div>

              <div class="auth-field">
                <label class="auth-label" for="reg-role">SELECT YOUR ROLE</label>
                <div class="input-icon-wrap">
                  <i class="ri-user-shared-line field-icon"></i>
                  <select id="reg-role" name="role" required class="auth-select">
                    <option value="">-- Select your role --</option>
                    <option value="individualowner" data-label="Individual Owner">Individual Owner</option>
                    <option value="agentbroker" data-label="Agent / Broker">Agent / Broker</option>
                    <option value="builderdeveloper" data-label="Builder / Developer">Builder / Developer</option>
                  </select>
                </div>
              </div>

              <!-- RECAPTCHA BOX SIMULATION -->
              <div class="recaptcha-box">
                <label class="recaptcha-label">
                  <input type="checkbox" id="recaptcha-check" required />
                  <span style="font-size: 0.88rem; color: #333; font-weight: 600;">I'm not a robot</span>
                </label>
                <div class="recaptcha-badge">
                  <i class="ri-shield-check-fill" style="color: #1a73e8; font-size: 1.2rem;"></i>
                  <span style="font-size: 0.65rem; color: #666; font-weight: 700; display: block;">reCAPTCHA</span>
                </div>
              </div>

              <div class="auth-checkbox-row">
                <label class="checkbox-label">
                  <input type="checkbox" id="reg-terms" required />
                  <span>I agree to the <a href="/index.html#term-privacy" target="_blank" class="auth-link">privacy policy</a> and <a href="/index.html#terms" target="_blank" class="auth-link">terms of service</a></span>
                </label>
              </div>

              <button type="submit" class="auth-submit-btn" id="register-btn">
                Sign up with email
              </button>

              <div class="auth-toggle-footer">
                Already have an account? <a href="#" id="go-to-signin" class="auth-link">Sign In</a>
              </div>
            </form>
          </div>

          <!-- OTP VERIFICATION SCREEN (MATCHING SCREENSHOT 2) -->
          <div class="auth-mode-container ${initialMode === 'otp' ? 'active-mode' : ''}" id="mode-otp">
            <div style="text-align: center; margin-bottom: 24px;">
              <div class="otp-icon-circle">
                <i class="ri-smartphone-line"></i>
              </div>
              <h1 class="auth-heading" style="margin-bottom: 6px;">OTP Verification</h1>
              <p style="font-size: 0.88rem; color: #718096; line-height: 1.5; max-width: 320px; margin: 0 auto;">
                Enter the 4-digit verification code sent to you via SMS and Email to <strong id="otp-email-display">${targetEmail}</strong>.
              </p>
              <div style="font-size: 0.78rem; font-weight: 700; color: #E52E3D; background: rgba(229,46,61,0.08); padding: 4px 12px; border-radius: 20px; display: inline-block; margin-top: 10px;">
                <i class="ri-key-fill"></i> Demo OTP Code: <strong>1234</strong>
              </div>
            </div>

            <form class="auth-form" id="otp-form" onsubmit="return false;">
              <div class="otp-inputs-row">
                <input type="text" maxlength="1" class="otp-box" id="otp-1" autofocus pattern="[0-9]" />
                <input type="text" maxlength="1" class="otp-box" id="otp-2" pattern="[0-9]" />
                <input type="text" maxlength="1" class="otp-box" id="otp-3" pattern="[0-9]" />
                <input type="text" maxlength="1" class="otp-box" id="otp-4" pattern="[0-9]" />
              </div>

              <div id="otp-error-msg" style="color: #D92332; font-size: 0.82rem; font-weight: 700; text-align: center; display: none;"></div>

              <button type="submit" class="auth-submit-btn" id="verify-otp-btn" style="margin-top: 16px;">
                Verify & Activate Account
              </button>

              <div class="auth-toggle-footer" style="margin-top: 16px;">
                Didn't receive code? <a href="#" id="resend-otp-btn" class="auth-link">Resend OTP</a> &nbsp;•&nbsp; <a href="#" id="otp-back-signin" class="auth-link">Back to Sign In</a>
              </div>
            </form>
          </div>

        </div>

      </div>
    </div>
  `;
}

export function initLogin() {
  const app = document.getElementById('login-app');
  if (!app) return;

  const hash = window.location.hash.slice(1).toLowerCase();
  let mode = 'signin';
  if (hash === 'register' || hash === 'user-register' || hash === 'signup') {
    mode = 'register';
    window.location.hash = 'user-register';
  } else if (hash === 'otp') {
    mode = 'otp';
    window.location.hash = 'otp';
  } else {
    mode = 'signin';
    window.location.hash = 'user-login';
  }

  app.innerHTML = renderLogin(mode);

  const modeSignin = document.getElementById('mode-signin');
  const modeRegister = document.getElementById('mode-register');
  const modeOtp = document.getElementById('mode-otp');
  const leftTagline = document.getElementById('left-tagline');

  function showMode(targetMode) {
    [modeSignin, modeRegister, modeOtp].forEach(m => m?.classList.remove('active-mode'));
    if (targetMode === 'signin') {
      window.location.hash = 'user-login';
      modeSignin?.classList.add('active-mode');
      if (leftTagline) leftTagline.textContent = 'Welcome back! Sign in to continue exploring properties in Thanjavur & surrounding areas.';
    } else if (targetMode === 'register') {
      window.location.hash = 'user-register';
      modeRegister?.classList.add('active-mode');
      if (leftTagline) leftTagline.textContent = 'Find your perfect home in Thanjavur & surrounding areas. Trusted listings, verified owners.';
    } else if (targetMode === 'otp') {
      window.location.hash = 'otp';
      modeOtp?.classList.add('active-mode');
      const pending = getPendingOTPUser();
      const email = pending ? pending.email : '';
      if (leftTagline) leftTagline.textContent = `Enter the 4-digit OTP sent to ${email} to complete verification.`;
      // Auto focus first OTP input box
      setTimeout(() => document.getElementById('otp-1')?.focus(), 100);
    }
  }

  document.getElementById('go-to-register')?.addEventListener('click', (e) => { e.preventDefault(); showMode('register'); });
  document.getElementById('go-to-signin')?.addEventListener('click', (e) => { e.preventDefault(); showMode('signin'); });
  document.getElementById('reg-back-to-signin')?.addEventListener('click', (e) => { e.preventDefault(); showMode('signin'); });
  document.getElementById('otp-back-signin')?.addEventListener('click', (e) => { e.preventDefault(); showMode('signin'); });

  // Password Visibility Eye Toggle
  const toggleSigninPw = document.getElementById('toggle-signin-pw');
  const signinPassword = document.getElementById('signin-password');
  toggleSigninPw?.addEventListener('click', () => {
    if (signinPassword) {
      const isPw = signinPassword.type === 'password';
      signinPassword.type = isPw ? 'text' : 'password';
      toggleSigninPw.className = isPw ? 'ri-eye-off-line toggle-pw-icon' : 'ri-eye-line toggle-pw-icon';
    }
  });

  // Demo User Quick Fill
  const emailInput = document.getElementById('signin-email');
  const passwordInput = document.getElementById('signin-password');
  document.querySelectorAll('.demo-user').forEach(user => {
    user.addEventListener('click', () => {
      const email = user.getAttribute('data-email');
      if (emailInput) emailInput.value = email;
      if (passwordInput) passwordInput.value = 'Admin@1234';
      showMode('signin');
    });
  });

  // Sign In Form Submission
  document.getElementById('signin-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = document.getElementById('signin-btn');
    if (btn) btn.textContent = 'Signing in...';
    
    const email = emailInput?.value || '';
    const pass = passwordInput?.value || 'Admin@1234';

    setTimeout(() => {
      const loggedUser = loginUser(email, pass);
      if (loggedUser && (loggedUser.role === 'superadmin' || loggedUser.email === 'admin@realrest.example')) {
        window.location.href = '/dashboard.html';
      } else {
        window.location.href = '/user-dashboard.html';
      }
    }, 800);
  });

  // Register Form Submission -> Triggers OTP Verification Screen (Screenshot 2)
  document.getElementById('register-form')?.addEventListener('submit', (e) => {
    e.preventDefault();

    const fullName = document.getElementById('reg-fullname')?.value.trim();
    const email = document.getElementById('reg-email')?.value.trim();
    const phone = document.getElementById('reg-phone')?.value.trim();
    const roleSelect = document.getElementById('reg-role');
    const roleVal = roleSelect?.value;
    const roleLabel = roleSelect?.options[roleSelect.selectedIndex]?.dataset?.label || 'Individual Owner';

    initiateRegistration({ fullName, email, phone, role: roleVal, roleLabel });

    const emailDisplay = document.getElementById('otp-email-display');
    if (emailDisplay) emailDisplay.textContent = email;

    showMode('otp');
  });

  // OTP Auto-Focus Navigation Logic
  const otpBoxes = [
    document.getElementById('otp-1'),
    document.getElementById('otp-2'),
    document.getElementById('otp-3'),
    document.getElementById('otp-4')
  ];

  otpBoxes.forEach((box, idx) => {
    if (!box) return;
    box.addEventListener('input', (e) => {
      const val = e.target.value;
      if (val && idx < otpBoxes.length - 1) {
        otpBoxes[idx + 1].focus();
      }
    });

    box.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !box.value && idx > 0) {
        otpBoxes[idx - 1].focus();
      }
    });
  });

  // OTP Verification Form Submission
  document.getElementById('otp-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const otpCode = otpBoxes.map(b => b?.value || '').join('');
    const errMsg = document.getElementById('otp-error-msg');
    const btn = document.getElementById('verify-otp-btn');

    if (otpCode.length < 4) {
      if (errMsg) {
        errMsg.textContent = 'Please enter all 4 digits of the OTP code.';
        errMsg.style.display = 'block';
      }
      return;
    }

    if (btn) btn.textContent = 'Verifying...';

    const result = verifyOTPAndActivate(otpCode);
    if (result.success) {
      if (errMsg) errMsg.style.display = 'none';
      if (btn) btn.textContent = 'Activated! Opening Dashboard...';
      alert(`Account Activated Successfully!\nYour Login Email & System Password have been dispatched to your registered email.\n\nClick OK to open your Client User Dashboard.`);
      setTimeout(() => {
        window.location.href = '/user-dashboard.html';
      }, 500);
    } else {
      if (btn) btn.textContent = 'Verify & Activate Account';
      if (errMsg) {
        errMsg.textContent = result.message;
        errMsg.style.display = 'block';
      }
    }
  });

  // Resend OTP handler
  document.getElementById('resend-otp-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    alert('A new 4-digit verification code (1234) has been sent to your email and phone.');
  });
}

document.addEventListener('DOMContentLoaded', initLogin);
