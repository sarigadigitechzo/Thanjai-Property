import { initiateRegistration, verifyOTPAndActivate, loginUser, getPendingOTPUser, updateUserPassword, sendOtpEmail, sendCredentialsEmail, initUsersStore } from './utils/userAuthStore.js';
import { installGlobalPopupShield } from './utils/toast.js';

installGlobalPopupShield();

export function renderLogin(initialMode = 'signin') {
  const pending = getPendingOTPUser();
  const targetEmail = pending ? pending.email : 'you@example.com';

  return `
    <div class="login-wrapper">
      <div class="login-split-card">
        
        <!-- LEFT DARK SLATE VISUAL PANEL -->
        <div class="login-left-panel">
          <div class="login-left-content">
            <div class="login-brand-area" style="display: flex; align-items: center; justify-content: center; width: 100%; text-align: center; margin-bottom: 24px;">
              <div style="background: #ffffff; padding: 12px 24px; border-radius: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
                <img src="/thanjai-official-new.png" alt="Thanjai Property Logo" style="height: 68px; max-width: 100%; object-fit: contain; display: block;" />
              </div>
            </div>

            <div class="login-left-tagline" id="left-tagline" style="text-align: center;">
              ${initialMode === 'otp'
                ? `Enter the 6-digit OTP sent to ${targetEmail} to complete verification.`
                : initialMode === 'credentials'
                  ? 'Your account has been created. Use your one-time password to sign in.'
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
            <a href="/" id="signin-back-to-home" style="display: inline-flex; align-items: center; gap: 6px; font-size: 0.85rem; font-weight: 700; color: #718096; text-decoration: none; margin-bottom: 24px; transition: color 0.2s;" onmouseover="this.style.color='#2d3748'" onmouseout="this.style.color='#718096'">
              <i class="ri-arrow-left-line"></i> Back to Home
            </a>
            <h1 class="auth-heading">Sign in to your account</h1>

            <form class="auth-form" id="signin-form" onsubmit="return false;" autocomplete="off">
              <!-- Dummy inputs to prevent aggressive browser autofill -->
              <input type="email" style="display:none" name="fake_email" />
              <input type="password" style="display:none" name="fake_password" />

              <div class="auth-field">
                <label class="auth-label" for="signin-email">EMAIL ADDRESS</label>
                <div class="input-icon-wrap">
                  <i class="ri-mail-line field-icon"></i>
                  <input type="email" id="signin-email" name="email" placeholder="you@example.com" required class="auth-input" autocomplete="off" />
                </div>
              </div>

              <div class="auth-field">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <label class="auth-label" for="signin-password">PASSWORD</label>
                  <a href="#" class="forgot-link" id="forgot-password-link">Forgot password?</a>
                </div>
                <div class="input-icon-wrap">
                  <i class="ri-lock-2-line field-icon"></i>
                  <input type="password" id="signin-password" name="password" placeholder="Enter your password" required class="auth-input" autocomplete="new-password" />
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

              <!-- INTERACTIVE RECAPTCHA WIDGET -->
              <div class="recaptcha-widget" id="recaptcha-widget">
                <div class="recaptcha-checkbox-area" id="recaptcha-trigger">
                  <div class="recaptcha-checkbox" id="recaptcha-checkbox">
                    <div class="recaptcha-spinner" id="recaptcha-spinner"></div>
                    <i class="ri-check-line recaptcha-checkmark" id="recaptcha-checkmark"></i>
                  </div>
                  <span class="recaptcha-text" id="recaptcha-text">I'm not a robot</span>
                </div>
                <div class="recaptcha-brand">
                  <i class="ri-shield-check-fill" style="color: #1a73e8; font-size: 1.35rem;"></i>
                  <div style="font-size: 0.65rem; color: #555; font-weight: 700; line-height: 1.1;">reCAPTCHA<br><span style="font-weight: 400; color: #888;">Privacy - Terms</span></div>
                </div>
              </div>
              <div id="recaptcha-error-msg" style="color: #D92332; font-size: 0.8rem; font-weight: 700; display: none;">
                Please verify that you are not a robot before proceeding.
              </div>

              <div class="auth-checkbox-row">
                <label class="checkbox-label">
                  <input type="checkbox" id="reg-terms" required />
                  <span>I agree to the <a href="/privacy-policy" target="_blank" class="auth-link">privacy policy</a> and <a href="/terms-of-use" target="_blank" class="auth-link">terms of service</a></span>
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

          <!-- 6-DIGIT EMAIL OTP VERIFICATION SCREEN -->
          <div class="auth-mode-container ${initialMode === 'otp' ? 'active-mode' : ''}" id="mode-otp">
            <div style="text-align: center; margin-bottom: 20px;">
              <div class="otp-icon-circle">
                <i class="ri-mail-check-line"></i>
              </div>
              <h1 class="auth-heading" style="margin-bottom: 6px; font-size: 1.6rem;">Email OTP Verification</h1>
              <p style="font-size: 0.88rem; color: #718096; line-height: 1.5; max-width: 340px; margin: 0 auto;">
                We have sent a 6-digit verification code to <strong id="otp-email-display" style="color: #1A202C;">${targetEmail}</strong>.
              </p>

              <!-- Email Dispatch Notification Banner -->
              <div class="email-dispatch-banner" id="email-dispatch-banner" style="margin-top: 14px; background: #EBF8FF; border: 1.5px solid #BEE3F8; border-radius: 14px; padding: 14px 18px; text-align: left; display: flex; align-items: flex-start; gap: 12px;">
                <i class="ri-mail-send-line" style="color: #3182CE; font-size: 1.4rem; margin-top: 2px;"></i>
                <div style="flex: 1;">
                  <div style="font-size: 0.88rem; font-weight: 700; color: #2D3748;">
                    Verification Code Sent to <span id="toast-email-span">${targetEmail}</span>
                  </div>
                  <div style="font-size: 0.82rem; color: #4A5568; margin-top: 4px; line-height: 1.45;">
                    Please check your email inbox (and spam/junk folder) for your 6-digit OTP verification code and enter it below.
                  </div>
                </div>
              </div>
            </div>

            <form class="auth-form" id="otp-form" onsubmit="return false;">
              <div class="otp-inputs-row">
                <input type="text" maxlength="1" class="otp-box" id="otp-1" autofocus pattern="[0-9]" />
                <input type="text" maxlength="1" class="otp-box" id="otp-2" pattern="[0-9]" />
                <input type="text" maxlength="1" class="otp-box" id="otp-3" pattern="[0-9]" />
                <input type="text" maxlength="1" class="otp-box" id="otp-4" pattern="[0-9]" />
                <input type="text" maxlength="1" class="otp-box" id="otp-5" pattern="[0-9]" />
                <input type="text" maxlength="1" class="otp-box" id="otp-6" pattern="[0-9]" />
              </div>

              <div id="otp-error-msg" style="color: #D92332; font-size: 0.82rem; font-weight: 700; text-align: center; display: none;"></div>

              <button type="submit" class="auth-submit-btn" id="verify-otp-btn" style="margin-top: 14px;">
                Verify OTP & Continue
              </button>

              <div class="auth-toggle-footer" style="margin-top: 14px;">
                Didn't receive code? <button type="button" id="resend-otp-btn" class="auth-link" style="background: none; border: none; cursor: pointer; padding: 0; font-size: 0.88rem;">Resend OTP (<span id="resend-countdown">45</span>s)</button> &nbsp;•&nbsp; <a href="#" id="otp-back-signin" class="auth-link">Back to Sign In</a>
              </div>
            </form>
          </div>

          <!-- ACCOUNT CREATED & CREDENTIALS SENT TO EMAIL SCREEN -->
          <div class="auth-mode-container ${initialMode === 'credentials' ? 'active-mode' : ''}" id="mode-credentials">
            <div style="text-align: center; margin-bottom: 20px;">
              <div style="width: 68px; height: 68px; border-radius: 50%; background: #DEF7EC; color: #0E9F6E; display: flex; align-items: center; justify-content: center; font-size: 2.2rem; margin: 0 auto 16px;">
                <i class="ri-mail-check-line"></i>
              </div>
              <h1 class="auth-heading" style="margin-bottom: 8px; font-size: 1.65rem; color: #1A202C;">Account Created Successfully!</h1>
              <p style="font-size: 0.92rem; color: #718096; line-height: 1.5; max-width: 360px; margin: 0 auto;">
                Your account is verified. Your login credentials have been sent directly to your registered email address.
              </p>
            </div>

            <!-- Email Dispatched Notification Card -->
            <div style="background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 16px; padding: 22px; margin-bottom: 20px; text-align: center;">
              <div style="font-size: 0.75rem; font-weight: 800; color: #718096; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px;">
                LOGIN CREDENTIALS SENT TO
              </div>
              <div style="font-size: 1.02rem; font-weight: 800; color: #2B6CB0; background: #EBF8FF; border: 1px solid #BEE3F8; padding: 8px 16px; border-radius: 10px; display: inline-block; word-break: break-all; margin-bottom: 12px;" id="cred-username-display">
                you@example.com
              </div>

              <p style="font-size: 0.85rem; color: #4A5568; line-height: 1.5; margin: 0;">
                Please open your email inbox to retrieve your <strong>Username</strong> and <strong>One-Time Password</strong> for sign in.
              </p>
            </div>

            <div style="background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 10px; padding: 10px 14px; font-size: 0.82rem; color: #92400E; margin-bottom: 20px; line-height: 1.4; display: flex; gap: 8px; align-items: flex-start;">
              <i class="ri-information-fill" style="font-size: 1.1rem; color: #D97706; margin-top: 1px;"></i>
              <span>You can change the one-time password to your personal permanent password anytime under <strong>Profile & Password</strong> in your dashboard.</span>
            </div>

            <button type="button" class="auth-submit-btn" id="proceed-to-dashboard-btn">
              Proceed to Sign In <i class="ri-arrow-right-line" style="margin-left: 6px;"></i>
            </button>
          </div>

        </div>

      </div>
    </div>
  `;
}

export async function initLogin() {
  const app = document.getElementById('login-app');
  if (!app) return;

  await initUsersStore().catch(() => {});

  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.slice(1).toLowerCase();
  let mode = 'signin';
  if (path.includes('user-register') || hash.includes('register') || hash.includes('signup')) {
    mode = 'register';
  } else if (path.includes('otp') || hash.includes('otp')) {
    mode = 'otp';
  } else {
    mode = 'signin';
  }

  app.innerHTML = renderLogin(mode);

  const modeSignin = document.getElementById('mode-signin');
  const modeRegister = document.getElementById('mode-register');
  const modeOtp = document.getElementById('mode-otp');
  const modeCredentials = document.getElementById('mode-credentials');
  const leftTagline = document.getElementById('left-tagline');

  let isRecaptchaVerified = false;
  let resendTimer = null;
  let countdownSeconds = 45;

  function updateLoginUrlSlug(slug) {
    try {
      window.history.replaceState(null, '', '/' + slug);
    } catch (err) {
      window.location.hash = slug;
    }
  }

  function showMode(targetMode) {
    [modeSignin, modeRegister, modeOtp, modeCredentials].forEach(m => m?.classList.remove('active-mode'));
    if (targetMode === 'signin') {
      updateLoginUrlSlug('user-login');
      modeSignin?.classList.add('active-mode');
      if (leftTagline) leftTagline.textContent = 'Welcome back! Sign in to continue exploring properties in Thanjavur & surrounding areas.';
    } else if (targetMode === 'register') {
      updateLoginUrlSlug('user-register');
      modeRegister?.classList.add('active-mode');
      if (leftTagline) leftTagline.textContent = 'Find your perfect home in Thanjavur & surrounding areas. Trusted listings, verified owners.';
    } else if (targetMode === 'otp') {
      updateLoginUrlSlug('otp');
      modeOtp?.classList.add('active-mode');
      const pending = getPendingOTPUser();
      const email = pending ? pending.email : '';
      const otpCode = pending ? pending.otpCode : '123456';
      
      const emailDisplay = document.getElementById('otp-email-display');
      if (emailDisplay) emailDisplay.textContent = email;
      const toastEmail = document.getElementById('toast-email-span');
      if (toastEmail) toastEmail.textContent = email;
      const dispatchedOtp = document.getElementById('dispatched-otp-code');
      if (dispatchedOtp) dispatchedOtp.textContent = otpCode;

      if (leftTagline) leftTagline.textContent = `Enter the 6-digit OTP sent to ${email} to complete verification.`;
      startResendCountdown();
      setTimeout(() => document.getElementById('otp-1')?.focus(), 100);
    } else if (targetMode === 'credentials') {
      updateLoginUrlSlug('account-activated');
      modeCredentials?.classList.add('active-mode');
      if (leftTagline) leftTagline.textContent = 'Your account has been created. Use your one-time password to sign in.';
    }
  }

  function startResendCountdown() {
    clearInterval(resendTimer);
    countdownSeconds = 45;
    const countdownEl = document.getElementById('resend-countdown');
    const resendBtn = document.getElementById('resend-otp-btn');
    if (resendBtn) resendBtn.disabled = true;

    resendTimer = setInterval(() => {
      countdownSeconds--;
      if (countdownEl) countdownEl.textContent = countdownSeconds;
      if (countdownSeconds <= 0) {
        clearInterval(resendTimer);
        if (resendBtn) {
          resendBtn.disabled = false;
          resendBtn.innerHTML = 'Resend OTP Now';
        }
      }
    }, 1000);
  }

  // Navigation Links between modes
  document.getElementById('go-to-register')?.addEventListener('click', (e) => { e.preventDefault(); showMode('register'); });
  document.getElementById('go-to-signin')?.addEventListener('click', (e) => { e.preventDefault(); showMode('signin'); });
  document.getElementById('reg-back-to-signin')?.addEventListener('click', (e) => { e.preventDefault(); showMode('signin'); });
  document.getElementById('otp-back-signin')?.addEventListener('click', (e) => { e.preventDefault(); showMode('signin'); });

  // Interactive reCAPTCHA Click Simulation
  const recaptchaTrigger = document.getElementById('recaptcha-trigger');
  const recaptchaWidget = document.getElementById('recaptcha-widget');
  const recaptchaSpinner = document.getElementById('recaptcha-spinner');
  const recaptchaCheckmark = document.getElementById('recaptcha-checkmark');
  const recaptchaErrorMsg = document.getElementById('recaptcha-error-msg');
  const recaptchaCheckbox = document.getElementById('recaptcha-checkbox');

  recaptchaTrigger?.addEventListener('click', () => {
    if (isRecaptchaVerified) return;

    if (recaptchaSpinner) recaptchaSpinner.style.display = 'block';
    if (recaptchaCheckbox) recaptchaCheckbox.style.borderColor = '#1a73e8';

    setTimeout(() => {
      isRecaptchaVerified = true;
      if (recaptchaSpinner) recaptchaSpinner.style.display = 'none';
      if (recaptchaCheckmark) recaptchaCheckmark.style.display = 'block';
      if (recaptchaCheckbox) {
        recaptchaCheckbox.style.backgroundColor = '#1a73e8';
        recaptchaCheckbox.style.borderColor = '#1a73e8';
      }
      if (recaptchaWidget) {
        recaptchaWidget.style.borderColor = '#34D399';
        recaptchaWidget.style.backgroundColor = '#F0FDF4';
      }
      if (recaptchaErrorMsg) recaptchaErrorMsg.style.display = 'none';
    }, 600);
  });

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

  // Sign In Form Inputs
  const emailInput = document.getElementById('signin-email');
  const passwordInput = document.getElementById('signin-password');

  // Sign In Form Submission
  document.getElementById('signin-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = document.getElementById('signin-btn');
    const originalText = btn ? btn.textContent : 'Sign in';
    if (btn) btn.textContent = 'Signing in...';
    
    const email = emailInput?.value || '';
    const pass = passwordInput?.value || '';

    setTimeout(() => {
      const loggedUser = loginUser(email, pass);
      
      if (loggedUser) {
        if (loggedUser.roleCode && (loggedUser.roleCode.includes('admin') || loggedUser.roleCode.includes('manager') || loggedUser.roleCode.includes('executive') || loggedUser.roleCode.includes('staff'))) {
          window.location.href = '/dashboard.html';
        } else {
          window.location.href = '/user-dashboard';
        }
      } else {
        if (btn) btn.textContent = originalText;
        alert('Invalid email or password. Please check your credentials and try again.');
      }
    }, 600);
  });

  // Register Form Submission -> Validates reCAPTCHA and initiates OTP verification
  document.getElementById('register-form')?.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!isRecaptchaVerified) {
      if (recaptchaErrorMsg) recaptchaErrorMsg.style.display = 'block';
      if (recaptchaWidget) {
        recaptchaWidget.style.borderColor = '#E52E3D';
        recaptchaWidget.style.backgroundColor = '#FFF5F5';
      }
      return;
    }

    const fullName = document.getElementById('reg-fullname')?.value.trim();
    const email = document.getElementById('reg-email')?.value.trim();
    const phone = document.getElementById('reg-phone')?.value.trim();
    const roleSelect = document.getElementById('reg-role');
    const roleVal = roleSelect?.value;
    const roleLabel = roleSelect?.options[roleSelect.selectedIndex]?.dataset?.label || 'Individual Owner';

    initiateRegistration({ fullName, email, phone, role: roleVal, roleLabel });

    showMode('otp');
  });

  // 6-Digit OTP Auto-Focus Navigation Logic
  const otpBoxes = [
    document.getElementById('otp-1'),
    document.getElementById('otp-2'),
    document.getElementById('otp-3'),
    document.getElementById('otp-4'),
    document.getElementById('otp-5'),
    document.getElementById('otp-6')
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

    box.addEventListener('paste', (e) => {
      e.preventDefault();
      const pasteData = (e.clipboardData || window.clipboardData).getData('text').trim().replace(/[^0-9]/g, '');
      if (pasteData) {
        for (let i = 0; i < otpBoxes.length; i++) {
          if (pasteData[i]) {
            otpBoxes[i].value = pasteData[i];
          }
        }
        otpBoxes[Math.min(pasteData.length, otpBoxes.length - 1)].focus();
      }
    });
  });

  // OTP Verification Form Submission -> Transitions to Credentials screen
  let verifiedCredentials = null;

  document.getElementById('otp-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const otpCode = otpBoxes.map(b => b?.value || '').join('');
    const errMsg = document.getElementById('otp-error-msg');
    const btn = document.getElementById('verify-otp-btn');

    if (otpCode.length < 6) {
      if (errMsg) {
        errMsg.textContent = 'Please enter all 6 digits of the OTP code.';
        errMsg.style.display = 'block';
      }
      return;
    }

    if (btn) btn.textContent = 'Verifying Code...';

    const result = verifyOTPAndActivate(otpCode);
    if (result.success) {
      if (errMsg) errMsg.style.display = 'none';
      if (btn) btn.textContent = 'Verified!';

      verifiedCredentials = result;

      // Dispatch real credentials email to user
      sendCredentialsEmail(result.user.email, result.user.fullName, result.tempPassword);

      // Update Credentials Screen details
      const credUserDisplay = document.getElementById('cred-username-display');
      if (credUserDisplay) credUserDisplay.textContent = result.username || result.user.email;

      setTimeout(() => {
        showMode('credentials');
      }, 400);
    } else {
      if (btn) btn.textContent = 'Verify OTP & Continue';
      if (errMsg) {
        errMsg.textContent = result.message;
        errMsg.style.display = 'block';
      }
    }
  });

  // Proceed to Sign In Button (Pre-fills Sign In form with registered email)
  document.getElementById('proceed-to-dashboard-btn')?.addEventListener('click', () => {
    if (verifiedCredentials && verifiedCredentials.user) {
      if (emailInput) emailInput.value = verifiedCredentials.user.email;
      if (passwordInput) {
        passwordInput.value = '';
        setTimeout(() => passwordInput.focus(), 150);
      }
    }
    showMode('signin');
  });

  // Resend OTP handler
  document.getElementById('resend-otp-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    const pending = getPendingOTPUser();
    if (!pending) return;

    // Generate fresh OTP code
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    pending.otpCode = newOtp;
    localStorage.setItem('thanjai_pending_otp_user', JSON.stringify(pending));

    // Send fresh OTP email to user
    sendOtpEmail(pending.email, pending.fullName, newOtp);

    startResendCountdown();
    otpBoxes.forEach(b => { if (b) b.value = ''; });
    otpBoxes[0]?.focus();
  });
}

document.addEventListener('DOMContentLoaded', initLogin);

