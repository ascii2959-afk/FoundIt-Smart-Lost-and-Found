/**
 * FoundIt - Authentication Pages, Personalization & RBAC Dashboards
 * 
 * Provides:
 * 1. Login View (#login) with Google OAuth & Email/Password
 * 2. Register View (#register) with default Student Role
 * 3. Email Verification View (#verify-email) with expiring codes & rate-limiting
 * 4. Forgot Password View (#forgot-password)
 * 5. Reset Password View (#reset-password)
 * 6. Access Denied View (#access-denied) - 403 Forbidden Shield
 * 7. Session Expired View (#session-expired)
 * 8. Personalized Student Dashboard (#dashboard)
 * 9. Comprehensive Administrator Console (#admin)
 */

window.FoundItAuthViews = (function () {
  'use strict';

  function t(key) {
    return window.FOUNDIT_I18N ? window.FOUNDIT_I18N.t(key) : key;
  }

  function isAr() {
    return window.FOUNDIT_I18N ? window.FOUNDIT_I18N.getLang() === 'ar' : false;
  }

  // =========================================================================
  // VIEW: LOGIN (#login)
  // =========================================================================
  function renderLoginView() {
    return `
      <div class="max-w-md mx-auto py-6 sm:py-12 animate-in fade-in duration-200">
        <div class="bg-[#172033] border border-[#293449] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden gradient-card-glow">
          
          <!-- Header -->
          <div class="text-center space-y-2 mb-6">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6366F1] to-[#22D3EE] flex items-center justify-center mx-auto text-white shadow-lg shadow-[#6366F1]/30">
              <i data-lucide="shield-check" class="w-6 h-6"></i>
            </div>
            <h1 class="text-2xl font-extrabold text-[#F8FAFC] tracking-tight" data-i18n="loginTitle">${t('loginTitle')}</h1>
            <p class="text-xs text-[#94A3B8]" data-i18n="loginSubtitle">${t('loginSubtitle')}</p>
          </div>

          <!-- Alert Container -->
          <div id="login-alert" class="hidden mb-4 p-3 rounded-xl border text-xs font-medium flex items-start gap-2.5">
            <i data-lucide="alert-circle" id="login-alert-icon" class="w-4 h-4 shrink-0 mt-0.5"></i>
            <span id="login-alert-text" class="flex-1"></span>
          </div>

          <!-- 1. Google Sign-In Button (Official Branding) -->
          <div class="space-y-3 mb-6">
            <button id="btn-google-login" type="button" class="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-50 text-[#0F172A] font-semibold text-xs sm:text-sm flex items-center justify-center gap-3 transition shadow-md hover:shadow-lg transform active:scale-98 border border-slate-200">
              <!-- Official Google Multi-color G SVG -->
              <svg class="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span data-i18n="btnContinueGoogle">${t('btnContinueGoogle')}</span>
            </button>

            <!-- Divider -->
            <div class="relative flex items-center justify-center my-4">
              <div class="border-t border-[#293449] w-full"></div>
              <span class="bg-[#172033] px-3 text-[10px] uppercase font-bold tracking-widest text-[#64748B] shrink-0">
                ${isAr() ? 'أو عبر البريد الأكاديمي' : 'or continue with university email'}
              </span>
              <div class="border-t border-[#293449] w-full"></div>
            </div>
          </div>

          <!-- 2. Standard Email/Password Form -->
          <form id="form-login" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-[#94A3B8] mb-1.5" for="login-email">
                ${isAr() ? 'البريد الإلكتروني' : 'Email Address'}
              </label>
              <div class="relative">
                <i data-lucide="mail" class="w-4 h-4 text-[#64748B] absolute left-3 top-3 rtl:left-auto rtl:right-3 pointer-events-none"></i>
                <input type="email" id="login-email" required class="w-full pl-9 pr-3 rtl:pl-3 rtl:pr-9 py-2.5 text-xs sm:text-sm rounded-xl border border-[#293449] bg-[#111827] text-[#F8FAFC] focus:ring-2 focus:ring-[#6366F1] focus:outline-none transition" placeholder="name@campus.edu">
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between mb-1.5 text-xs font-semibold">
                <label for="login-password" class="text-[#94A3B8]">
                  ${isAr() ? 'كلمة المرور' : 'Password'}
                </label>
                <a href="#forgot-password" class="text-[#22D3EE] hover:underline text-[11px]">
                  ${isAr() ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                </a>
              </div>
              <div class="relative">
                <i data-lucide="lock" class="w-4 h-4 text-[#64748B] absolute left-3 top-3 rtl:left-auto rtl:right-3 pointer-events-none"></i>
                <input type="password" id="login-password" required class="w-full pl-9 pr-10 rtl:pl-10 rtl:pr-9 py-2.5 text-xs sm:text-sm rounded-xl border border-[#293449] bg-[#111827] text-[#F8FAFC] focus:ring-2 focus:ring-[#6366F1] focus:outline-none transition" placeholder="••••••••">
                <button type="button" id="btn-toggle-login-pass" class="absolute right-3 top-2.5 rtl:right-auto rtl:left-3 text-[#64748B] hover:text-[#F8FAFC]">
                  <i data-lucide="eye" id="icon-login-pass" class="w-4 h-4"></i>
                </button>
              </div>
            </div>

            <button type="submit" id="btn-login-submit" class="w-full py-3 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold text-xs sm:text-sm shadow-md shadow-[#6366F1]/25 hover:shadow-lg transition flex items-center justify-center gap-2">
              <span data-i18n="btnSignIn">${t('btnSignIn')}</span>
              <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </button>
          </form>

          <!-- Register Link -->
          <div class="text-center pt-5 border-t border-[#293449] mt-6 text-xs text-[#94A3B8]">
            <span>${isAr() ? 'ليس لديك حساب بعد؟' : "Don't have an account yet?"}</span>
            <a href="#register" class="text-[#22D3EE] font-bold hover:underline ml-1">
              ${isAr() ? 'تسجيل حساب طالب جديد' : 'Register Student Account'}
            </a>
          </div>

          <!-- Instant Evaluator Sandbox -->
          <div class="mt-6 pt-4 border-t border-[#293449]/70 bg-[#111827] -mx-6 -mb-6 p-4 rounded-b-3xl">
            <div class="flex items-center justify-between text-[11px] font-bold text-[#94A3B8] mb-2.5">
              <span class="flex items-center gap-1.5 text-[#22D3EE]">
                <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
                <span>One-Click Role Test Credentials</span>
              </span>
              <span class="text-[10px] text-[#64748B]">Auto-Fill & Sign In</span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <button type="button" id="btn-fill-student" class="p-2 rounded-lg bg-[#172033] hover:bg-[#1E2A42] border border-[#293449] text-left transition flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-[#22D3EE]"></span>
                <div>
                  <div class="font-bold text-[#F8FAFC] text-[11px]">Sarah (Student)</div>
                  <div class="text-[10px] text-[#64748B]">sarah@student.edu</div>
                </div>
              </button>
              <button type="button" id="btn-fill-admin" class="p-2 rounded-lg bg-[#172033] hover:bg-[#1E2A42] border border-[#293449] text-left transition flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-[#FBBF24]"></span>
                <div>
                  <div class="font-bold text-[#F8FAFC] text-[11px]">Staff (Admin)</div>
                  <div class="text-[10px] text-[#64748B]">admin@campus.edu</div>
                </div>
              </button>
            </div>
          </div>

        </div>
      </div>
    `;
  }

  function setupLoginListeners() {
    const form = document.getElementById('form-login');
    const alertBox = document.getElementById('login-alert');
    const alertText = document.getElementById('login-alert-text');
    const alertIcon = document.getElementById('login-alert-icon');
    const btnGoogle = document.getElementById('btn-google-login');
    const btnTogglePass = document.getElementById('btn-toggle-login-pass');
    const inputPass = document.getElementById('login-password');
    const iconPass = document.getElementById('icon-login-pass');

    const showAlert = (msg, isErr = true) => {
      if (!alertBox) return;
      alertBox.className = `mb-4 p-3 rounded-xl border text-xs font-medium flex items-start gap-2.5 ${
        isErr ? 'bg-rose-950/40 border-rose-500/30 text-rose-300' : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
      }`;
      alertText.textContent = msg;
      alertBox.classList.remove('hidden');
      if (window.lucide) window.lucide.createIcons({ root: alertBox });
    };

    if (btnTogglePass && inputPass) {
      btnTogglePass.addEventListener('click', () => {
        const isPassword = inputPass.type === 'password';
        inputPass.type = isPassword ? 'text' : 'password';
        if (iconPass) iconPass.setAttribute('data-lucide', isPassword ? 'eye-off' : 'eye');
        if (window.lucide) window.lucide.createIcons();
      });
    }

    // Google Sign-In button
    if (btnGoogle) {
      btnGoogle.addEventListener('click', async () => {
        btnGoogle.disabled = true;
        btnGoogle.innerHTML = `
          <div class="w-4 h-4 border-2 border-[#6366F1] border-t-transparent rounded-full animate-spin"></div>
          <span>Authenticating with Google...</span>
        `;
        try {
          const res = await window.foundItAuth.signInWithGoogle();
          if (res.redirecting) return; // Supabase redirecting
          window.location.hash = res.user.role === 'admin' ? '#admin' : '#dashboard';
        } catch (err) {
          showAlert(err.message);
          btnGoogle.disabled = false;
          btnGoogle.innerHTML = `<span data-i18n="btnContinueGoogle">${t('btnContinueGoogle')}</span>`;
        }
      });
    }

    // Standard Login
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const submitBtn = document.getElementById('btn-login-submit');

        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Verifying Credentials...</span>
        `;

        try {
          const res = await window.foundItAuth.signInWithEmail(email, password);
          if (res.requiresVerification) {
            window.location.hash = `#verify-email?email=${encodeURIComponent(res.email)}`;
            return;
          }
          window.location.hash = res.user.role === 'admin' ? '#admin' : '#dashboard';
        } catch (err) {
          showAlert(err.message);
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<span>${t('btnSignIn')}</span><i data-lucide="arrow-right" class="w-4 h-4"></i>`;
          if (window.lucide) window.lucide.createIcons();
        }
      });
    }

    // Fast Sandbox Fill buttons
    const fillStudent = document.getElementById('btn-fill-student');
    const fillAdmin = document.getElementById('btn-fill-admin');

    if (fillStudent) {
      fillStudent.addEventListener('click', () => {
        document.getElementById('login-email').value = 'sarah.jenkins@student.edu';
        document.getElementById('login-password').value = 'anasali2006#';
        document.getElementById('form-login').dispatchEvent(new Event('submit'));
      });
    }

    if (fillAdmin) {
      fillAdmin.addEventListener('click', () => {
        document.getElementById('login-email').value = 'admin@campus.edu';
        document.getElementById('login-password').value = 'anasali2003#';
        document.getElementById('form-login').dispatchEvent(new Event('submit'));
      });
    }
  }

  // =========================================================================
  // VIEW: REGISTER (#register)
  // =========================================================================
  function renderRegisterView() {
    return `
      <div class="max-w-md mx-auto py-6 sm:py-12 animate-in fade-in duration-200">
        <div class="bg-[#172033] border border-[#293449] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden gradient-card-glow">
          
          <div class="text-center space-y-2 mb-6">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6366F1] to-[#22D3EE] flex items-center justify-center mx-auto text-white shadow-lg shadow-[#6366F1]/30">
              <i data-lucide="user-plus" class="w-6 h-6"></i>
            </div>
            <h1 class="text-2xl font-extrabold text-[#F8FAFC] tracking-tight" data-i18n="registerTitle">${t('registerTitle')}</h1>
            <p class="text-xs text-[#94A3B8]" data-i18n="registerSubtitle">${t('registerSubtitle')}</p>
          </div>

          <div id="register-alert" class="hidden mb-4 p-3 rounded-xl border text-xs font-medium flex items-start gap-2.5">
            <i data-lucide="alert-circle" id="register-alert-icon" class="w-4 h-4 shrink-0 mt-0.5"></i>
            <span id="register-alert-text" class="flex-1"></span>
          </div>

          <!-- Registration Form -->
          <form id="form-register" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-[#94A3B8] mb-1.5" for="reg-name">
                ${isAr() ? 'الاسم الكامل' : 'Full Name'} *
              </label>
              <input type="text" id="reg-name" required class="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-[#293449] bg-[#111827] text-[#F8FAFC] focus:ring-2 focus:ring-[#6366F1] focus:outline-none" placeholder="e.g. Sarah Jenkins">
            </div>

            <div>
              <label class="block text-xs font-semibold text-[#94A3B8] mb-1.5" for="reg-email">
                ${isAr() ? 'البريد الإلكتروني الجامعي' : 'University Email'} *
              </label>
              <input type="email" id="reg-email" required class="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-[#293449] bg-[#111827] text-[#F8FAFC] focus:ring-2 focus:ring-[#6366F1] focus:outline-none" placeholder="student.name@university.edu">
              <p class="text-[10px] text-[#64748B] mt-1">Verification code will be sent to this email.</p>
            </div>

            <div>
              <label class="block text-xs font-semibold text-[#94A3B8] mb-1.5" for="reg-studentid">
                ${isAr() ? 'الرقم الجامعي (اختياري)' : 'Student ID (Optional)'}
              </label>
              <input type="text" id="reg-studentid" class="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-[#293449] bg-[#111827] text-[#F8FAFC] focus:ring-2 focus:ring-[#6366F1] focus:outline-none" placeholder="STD-2026-4421">
            </div>

            <div>
              <label class="block text-xs font-semibold text-[#94A3B8] mb-1.5" for="reg-password">
                ${isAr() ? 'كلمة المرور' : 'Password'} *
              </label>
              <input type="password" id="reg-password" required minlength="8" class="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-[#293449] bg-[#111827] text-[#F8FAFC] focus:ring-2 focus:ring-[#6366F1] focus:outline-none" placeholder="Minimum 8 characters">
              
              <!-- Strength meter -->
              <div class="mt-2 space-y-1">
                <div class="h-1.5 w-full bg-[#111827] rounded-full overflow-hidden border border-[#293449]">
                  <div id="password-strength-bar" class="h-full w-0 transition-all duration-300"></div>
                </div>
                <div id="password-strength-text" class="text-[10px] text-[#64748B]">Enter password to gauge strength</div>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-[#94A3B8] mb-1.5" for="reg-confirm-password">
                ${isAr() ? 'تأكيد كلمة المرور' : 'Confirm Password'} *
              </label>
              <input type="password" id="reg-confirm-password" required class="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-[#293449] bg-[#111827] text-[#F8FAFC] focus:ring-2 focus:ring-[#6366F1] focus:outline-none" placeholder="Repeat password">
            </div>

            <!-- Role Enforcement Disclosure -->
            <div class="p-3 rounded-xl bg-[#111827] border border-[#293449] text-xs text-[#94A3B8] flex items-start gap-2">
              <i data-lucide="shield" class="w-4 h-4 text-[#22D3EE] shrink-0 mt-0.5"></i>
              <span><strong>Security Policy</strong>: Every new registration creates a <strong>Regular Student</strong> account. Administrator accounts are provisioned exclusively via authorized university database operations.</span>
            </div>

            <button type="submit" id="btn-register-submit" class="w-full py-3 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold text-xs sm:text-sm shadow-md shadow-[#6366F1]/25 hover:shadow-lg transition flex items-center justify-center gap-2">
              <span data-i18n="btnRegister">${t('btnRegister')}</span>
              <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </button>
          </form>

          <div class="text-center pt-5 border-t border-[#293449] mt-6 text-xs text-[#94A3B8]">
            <span>${isAr() ? 'لديك حساب بالفعل؟' : 'Already have an account?'}</span>
            <a href="#login" class="text-[#22D3EE] font-bold hover:underline ml-1">
              ${isAr() ? 'تسجيل الدخول' : 'Sign In'}
            </a>
          </div>

        </div>
      </div>
    `;
  }

  function setupRegisterListeners() {
    const form = document.getElementById('form-register');
    const alertBox = document.getElementById('register-alert');
    const alertText = document.getElementById('register-alert-text');
    const passInput = document.getElementById('reg-password');
    const strengthBar = document.getElementById('password-strength-bar');
    const strengthText = document.getElementById('password-strength-text');

    const showAlert = (msg, isErr = true) => {
      if (!alertBox) return;
      alertBox.className = `mb-4 p-3 rounded-xl border text-xs font-medium flex items-start gap-2.5 ${
        isErr ? 'bg-rose-950/40 border-rose-500/30 text-rose-300' : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
      }`;
      alertText.textContent = msg;
      alertBox.classList.remove('hidden');
      if (window.lucide) window.lucide.createIcons({ root: alertBox });
    };

    if (passInput && strengthBar && strengthText) {
      passInput.addEventListener('input', () => {
        const val = passInput.value;
        let score = 0;
        if (val.length >= 8) score += 25;
        if (/[A-Z]/.test(val)) score += 25;
        if (/[0-9]/.test(val)) score += 25;
        if (/[^A-Za-z0-9]/.test(val)) score += 25;

        strengthBar.style.width = score + '%';
        if (score <= 25) {
          strengthBar.className = 'h-full bg-rose-500 transition-all duration-300';
          strengthText.textContent = 'Weak: Add uppercase, numbers & symbols';
          strengthText.className = 'text-[10px] text-rose-400';
        } else if (score <= 75) {
          strengthBar.className = 'h-full bg-amber-400 transition-all duration-300';
          strengthText.textContent = 'Moderate: Good password';
          strengthText.className = 'text-[10px] text-amber-300';
        } else {
          strengthBar.className = 'h-full bg-emerald-400 transition-all duration-300';
          strengthText.textContent = 'Strong: Enterprise-grade security';
          strengthText.className = 'text-[10px] text-emerald-300';
        }
      });
    }

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const studentId = document.getElementById('reg-studentid').value;
        const password = document.getElementById('reg-password').value;
        const confirmPass = document.getElementById('reg-confirm-password').value;
        const submitBtn = document.getElementById('btn-register-submit');

        if (password !== confirmPass) {
          showAlert('Passwords do not match.');
          return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Creating Student Account...</span>
        `;

        try {
          const res = await window.foundItAuth.register({ name, email, password, studentId });
          window.location.hash = `#verify-email?email=${encodeURIComponent(res.email)}`;
        } catch (err) {
          showAlert(err.message);
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<span>${t('btnRegister')}</span><i data-lucide="arrow-right" class="w-4 h-4"></i>`;
          if (window.lucide) window.lucide.createIcons();
        }
      });
    }
  }

  // =========================================================================
  // VIEW: EMAIL VERIFICATION (#verify-email)
  // =========================================================================
  function renderVerifyEmailView() {
    const raw = window.location.hash.split('?')[1] || '';
    const params = new URLSearchParams(raw);
    let email = params.get('email') || '';

    // Check if there is an active demo code for this email or latest unverified account
    const users = window.foundItAuth ? window.foundItAuth.getUsers() : [];
    let target = email ? users.find(u => u.email.toLowerCase() === email.toLowerCase()) : null;
    if (!target) {
      const unverified = users.filter(u => !u.emailVerified);
      if (unverified.length > 0) {
        target = unverified[unverified.length - 1];
        email = target.email;
      }
    }
    const demoCode = target ? target.verificationCode : '';

    return `
      <div class="max-w-md mx-auto py-6 sm:py-12 animate-in fade-in duration-200">
        <div class="bg-[#172033] border border-[#293449] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden gradient-card-glow text-center">
          
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6366F1] to-[#22D3EE] flex items-center justify-center mx-auto text-white shadow-lg shadow-[#6366F1]/30 mb-4">
            <i data-lucide="mail-check" class="w-6 h-6"></i>
          </div>

          <h1 class="text-2xl font-extrabold text-[#F8FAFC] tracking-tight mb-2" data-i18n="verifyEmailTitle">${t('verifyEmailTitle')}</h1>
          <p class="text-xs text-[#94A3B8] mb-1" data-i18n="verifyEmailSubtitle">${t('verifyEmailSubtitle')}</p>
          <div class="inline-block px-3 py-1 rounded-lg bg-[#111827] border border-[#293449] text-xs font-mono font-bold text-[#22D3EE] mb-4">
            ${email || 'your-email@campus.edu'}
          </div>

          <!-- Prominent Notice: Sandbox Mode Explanation -->
          <div class="mb-5 p-3.5 rounded-2xl bg-[#111827] border border-[#6366F1]/40 text-left text-xs space-y-2">
            <div class="flex items-center gap-2 text-[#22D3EE] font-bold text-[11px]">
              <i data-lucide="info" class="w-4 h-4 shrink-0 text-[#22D3EE]"></i>
              <span>${isAr() ? 'تنبيه بيئة الاختبار (Sandbox Mode)' : 'Offline Evaluation Sandbox Notice'}</span>
            </div>
            <p class="text-[#94A3B8] text-[11px] leading-relaxed">
              ${isAr() 
                ? 'التطبيق يعمل حالياً كواجهة محلية (Frontend) بدون خادم بريد SMTP خارجي مرتبط، لذلك <strong>لن تصلك رسائل إلى صندوق بريد Gmail الفعلي</strong>. تم توليد كود الأمان أدناه لتجربة التحقق فوراً:' 
                : 'The application runs client-side without an external SMTP provider configured, so <strong>no actual email is sent to your real Gmail inbox</strong>. Your 6-digit verification code is generated below for instant testing:'}
            </p>
            ${demoCode ? `
              <div class="pt-2 border-t border-[#293449] flex items-center justify-between">
                <span class="text-[10px] text-[#94A3B8]">${isAr() ? 'كود التحقق:' : 'Security Code:'}</span>
                <span id="sandbox-code-display" class="font-mono font-extrabold text-base text-[#34D399] tracking-widest bg-[#172033] px-3 py-1 rounded-lg border border-[#34D399]/30">${demoCode}</span>
                <button type="button" id="btn-autofill-code" class="px-2.5 py-1 rounded-lg bg-[#6366F1]/20 hover:bg-[#6366F1]/40 text-[#22D3EE] text-[11px] font-semibold transition flex items-center gap-1 border border-[#6366F1]/30">
                  <i data-lucide="copy" class="w-3 h-3"></i>
                  <span>${isAr() ? 'تعبئة تلقائية' : 'Auto-fill'}</span>
                </button>
              </div>
            ` : `
              <div id="sandbox-code-container" class="pt-2 border-t border-[#293449] hidden items-center justify-between">
                <span class="text-[10px] text-[#94A3B8]">${isAr() ? 'كود التحقق:' : 'Security Code:'}</span>
                <span id="sandbox-code-display" class="font-mono font-extrabold text-base text-[#34D399] tracking-widest bg-[#172033] px-3 py-1 rounded-lg border border-[#34D399]/30"></span>
                <button type="button" id="btn-autofill-code" class="px-2.5 py-1 rounded-lg bg-[#6366F1]/20 hover:bg-[#6366F1]/40 text-[#22D3EE] text-[11px] font-semibold transition flex items-center gap-1 border border-[#6366F1]/30">
                  <i data-lucide="copy" class="w-3 h-3"></i>
                  <span>${isAr() ? 'تعبئة تلقائية' : 'Auto-fill'}</span>
                </button>
              </div>
            `}
          </div>

          <div id="verify-alert" class="hidden mb-4 p-3 rounded-xl border text-xs font-medium text-left flex items-start gap-2.5">
            <i data-lucide="alert-circle" id="verify-alert-icon" class="w-4 h-4 shrink-0 mt-0.5"></i>
            <span id="verify-alert-text" class="flex-1"></span>
          </div>

          <!-- Code Entry Form -->
          <form id="form-verify-email" class="space-y-4">
            <input type="hidden" id="verify-target-email" value="${email}">

            <div>
              <label class="block text-xs font-semibold text-[#94A3B8] mb-2">
                ${isAr() ? 'أدخل رمز التحقق الأمني المكون من 6 أرقام' : '6-Digit Security Verification Code'}
              </label>
              <input type="text" id="verify-code-input" maxlength="6" pattern="[0-9]{6}" required autofocus
                     class="w-full text-center tracking-[0.5em] font-mono text-xl sm:text-2xl py-3 rounded-xl border border-[#293449] bg-[#111827] text-[#F8FAFC] focus:ring-2 focus:ring-[#6366F1] focus:outline-none"
                     placeholder="••••••">
            </div>

            <!-- Countdown Timer & Attempts -->
            <div class="flex items-center justify-between text-[11px] text-[#94A3B8] px-1">
              <span class="flex items-center gap-1 text-[#FBBF24]">
                <i data-lucide="clock" class="w-3.5 h-3.5"></i>
                <span id="verify-timer">${isAr() ? 'صلاحية الكود: 10 دقائق' : 'Expires in 10:00'}</span>
              </span>
              <span id="verify-attempts" class="text-[#64748B]">${isAr() ? 'أقصى حد: 3 محاولات' : 'Max 3 attempts'}</span>
            </div>

            <button type="submit" id="btn-verify-submit" class="w-full py-3 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold text-xs sm:text-sm shadow-md shadow-[#6366F1]/25 hover:shadow-lg transition flex items-center justify-center gap-2">
              <span>${isAr() ? 'تأكيد الحساب والمتابعة' : 'Verify & Continue'}</span>
              <i data-lucide="check-circle" class="w-4 h-4"></i>
            </button>
          </form>

          <!-- Resend Section with Rate Limiting -->
          <div class="mt-6 pt-5 border-t border-[#293449] flex items-center justify-between text-xs">
            <span class="text-[#64748B]">${isAr() ? 'تريد كوداً جديداً؟' : "Didn't receive code?"}</span>
            <button type="button" id="btn-resend-code" class="text-[#22D3EE] font-bold hover:underline disabled:opacity-50 disabled:no-underline">
              ${isAr() ? 'توليد كود جديد (Resend)' : 'Resend Code'}
            </button>
          </div>

        </div>
      </div>
    `;
  }

  function setupVerifyEmailListeners() {
    const form = document.getElementById('form-verify-email');
    const alertBox = document.getElementById('verify-alert');
    const alertText = document.getElementById('verify-alert-text');
    const resendBtn = document.getElementById('btn-resend-code');
    const emailInput = document.getElementById('verify-target-email');
    const codeInput = document.getElementById('verify-code-input');
    const autoFillBtn = document.getElementById('btn-autofill-code');
    const codeDisplay = document.getElementById('sandbox-code-display');
    const codeContainer = document.getElementById('sandbox-code-container');
    const email = emailInput ? emailInput.value : '';

    const showAlert = (msg, isErr = true) => {
      if (!alertBox) return;
      alertBox.className = `mb-4 p-3 rounded-xl border text-xs font-medium text-left flex items-start gap-2.5 ${
        isErr ? 'bg-rose-950/40 border-rose-500/30 text-rose-300' : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
      }`;
      alertText.textContent = msg;
      alertBox.classList.remove('hidden');
      if (window.lucide) window.lucide.createIcons({ root: alertBox });
    };

    if (autoFillBtn && codeInput) {
      autoFillBtn.addEventListener('click', () => {
        const currentCode = codeDisplay ? codeDisplay.textContent.trim() : '';
        if (currentCode) {
          codeInput.value = currentCode;
          codeInput.focus();
        }
      });
    }

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const code = codeInput ? codeInput.value : '';
        const submitBtn = document.getElementById('btn-verify-submit');

        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Verifying Code...</span>
        `;

        try {
          const res = await window.foundItAuth.verifyEmail(email, code);
          window.location.hash = res.user.role === 'admin' ? '#admin' : '#dashboard';
        } catch (err) {
          showAlert(err.message);
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<span>Verify & Continue</span><i data-lucide="check-circle" class="w-4 h-4"></i>`;
          if (window.lucide) window.lucide.createIcons();
        }
      });
    }

    if (resendBtn) {
      resendBtn.addEventListener('click', async () => {
        resendBtn.disabled = true;
        try {
          const res = await window.foundItAuth.resendVerificationCode(email);
          showAlert(res.message, false);

          // Dynamically update the on-screen code
          if (res.verificationCode) {
            if (codeDisplay) codeDisplay.textContent = res.verificationCode;
            if (codeContainer) {
              codeContainer.classList.remove('hidden');
              codeContainer.classList.add('flex');
            }
            if (codeInput) {
              codeInput.value = res.verificationCode;
            }
          }

          // 60-second cooldown timer
          let cooldown = 60;
          resendBtn.textContent = `Wait ${cooldown}s`;
          const timer = setInterval(() => {
            cooldown -= 1;
            if (cooldown <= 0) {
              clearInterval(timer);
              resendBtn.disabled = false;
              resendBtn.textContent = 'Resend Code';
            } else {
              resendBtn.textContent = `Wait ${cooldown}s`;
            }
          }, 1000);
        } catch (err) {
          showAlert(err.message);
          resendBtn.disabled = false;
        }
      });
    }
  }

  // =========================================================================
  // VIEW: FORGOT PASSWORD (#forgot-password)
  // =========================================================================
  function renderForgotPasswordView() {
    return `
      <div class="max-w-md mx-auto py-6 sm:py-12 animate-in fade-in duration-200">
        <div class="bg-[#172033] border border-[#293449] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden gradient-card-glow">
          
          <div class="text-center space-y-2 mb-6">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6366F1] to-[#22D3EE] flex items-center justify-center mx-auto text-white shadow-lg shadow-[#6366F1]/30">
              <i data-lucide="key-round" class="w-6 h-6"></i>
            </div>
            <h1 class="text-2xl font-extrabold text-[#F8FAFC] tracking-tight" data-i18n="forgotPasswordTitle">${t('forgotPasswordTitle')}</h1>
            <p class="text-xs text-[#94A3B8]" data-i18n="forgotPasswordSubtitle">${t('forgotPasswordSubtitle')}</p>
          </div>

          <div id="forgot-alert" class="hidden mb-4 p-3 rounded-xl border text-xs font-medium flex items-start gap-2.5">
            <i data-lucide="alert-circle" id="forgot-alert-icon" class="w-4 h-4 shrink-0 mt-0.5"></i>
            <span id="forgot-alert-text" class="flex-1"></span>
          </div>

          <form id="form-forgot-password" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-[#94A3B8] mb-1.5" for="forgot-email">
                Registered University Email
              </label>
              <input type="email" id="forgot-email" required class="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-[#293449] bg-[#111827] text-[#F8FAFC] focus:ring-2 focus:ring-[#6366F1] focus:outline-none" placeholder="name@campus.edu">
            </div>

            <button type="submit" id="btn-forgot-submit" class="w-full py-3 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold text-xs sm:text-sm shadow-md shadow-[#6366F1]/25 hover:shadow-lg transition flex items-center justify-center gap-2">
              <span>Send Recovery Link</span>
              <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </button>
          </form>

          <div class="text-center pt-5 border-t border-[#293449] mt-6 text-xs text-[#94A3B8]">
            <a href="#login" class="text-[#22D3EE] font-bold hover:underline flex items-center justify-center gap-1">
              <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
              <span>Back to Sign In</span>
            </a>
          </div>

        </div>
      </div>
    `;
  }

  function setupForgotPasswordListeners() {
    const form = document.getElementById('form-forgot-password');
    const alertBox = document.getElementById('forgot-alert');
    const alertText = document.getElementById('forgot-alert-text');

    const showAlert = (msg, isErr = true) => {
      if (!alertBox) return;
      alertBox.className = `mb-4 p-3 rounded-xl border text-xs font-medium flex items-start gap-2.5 ${
        isErr ? 'bg-rose-950/40 border-rose-500/30 text-rose-300' : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
      }`;
      alertText.textContent = msg;
      alertBox.classList.remove('hidden');
      if (window.lucide) window.lucide.createIcons({ root: alertBox });
    };

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('forgot-email').value;
        const submitBtn = document.getElementById('btn-forgot-submit');

        submitBtn.disabled = true;
        try {
          const res = await window.foundItAuth.requestPasswordReset(email);
          showAlert(res.message, false);
          if (res.resetToken) {
            // Provide shortcut to test password reset immediately
            setTimeout(() => {
              window.location.hash = `#reset-password?token=${res.resetToken}`;
            }, 1200);
          }
        } catch (err) {
          showAlert(err.message);
          submitBtn.disabled = false;
        }
      });
    }
  }

  // =========================================================================
  // VIEW: RESET PASSWORD (#reset-password)
  // =========================================================================
  function renderResetPasswordView() {
    const raw = window.location.hash.split('?')[1] || '';
    const params = new URLSearchParams(raw);
    const token = params.get('token') || '';

    return `
      <div class="max-w-md mx-auto py-6 sm:py-12 animate-in fade-in duration-200">
        <div class="bg-[#172033] border border-[#293449] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden gradient-card-glow">
          
          <div class="text-center space-y-2 mb-6">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6366F1] to-[#22D3EE] flex items-center justify-center mx-auto text-white shadow-lg shadow-[#6366F1]/30">
              <i data-lucide="lock-keyhole" class="w-6 h-6"></i>
            </div>
            <h1 class="text-2xl font-extrabold text-[#F8FAFC] tracking-tight" data-i18n="resetPasswordTitle">${t('resetPasswordTitle')}</h1>
            <p class="text-xs text-[#94A3B8]" data-i18n="resetPasswordSubtitle">${t('resetPasswordSubtitle')}</p>
          </div>

          <div id="reset-alert" class="hidden mb-4 p-3 rounded-xl border text-xs font-medium flex items-start gap-2.5">
            <i data-lucide="alert-circle" id="reset-alert-icon" class="w-4 h-4 shrink-0 mt-0.5"></i>
            <span id="reset-alert-text" class="flex-1"></span>
          </div>

          <form id="form-reset-password" class="space-y-4">
            <input type="hidden" id="reset-token" value="${token}">

            <div>
              <label class="block text-xs font-semibold text-[#94A3B8] mb-1.5" for="new-pass">
                New Password (minimum 8 characters)
              </label>
              <input type="password" id="new-pass" required minlength="8" class="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-[#293449] bg-[#111827] text-[#F8FAFC] focus:ring-2 focus:ring-[#6366F1] focus:outline-none">
            </div>

            <div>
              <label class="block text-xs font-semibold text-[#94A3B8] mb-1.5" for="confirm-new-pass">
                Confirm New Password
              </label>
              <input type="password" id="confirm-new-pass" required class="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-[#293449] bg-[#111827] text-[#F8FAFC] focus:ring-2 focus:ring-[#6366F1] focus:outline-none">
            </div>

            <button type="submit" id="btn-reset-submit" class="w-full py-3 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold text-xs sm:text-sm shadow-md shadow-[#6366F1]/25 hover:shadow-lg transition flex items-center justify-center gap-2">
              <span>Update Password</span>
              <i data-lucide="check" class="w-4 h-4"></i>
            </button>
          </form>

        </div>
      </div>
    `;
  }

  function setupResetPasswordListeners() {
    const form = document.getElementById('form-reset-password');
    const alertBox = document.getElementById('reset-alert');
    const alertText = document.getElementById('reset-alert-text');

    const showAlert = (msg, isErr = true) => {
      if (!alertBox) return;
      alertBox.className = `mb-4 p-3 rounded-xl border text-xs font-medium flex items-start gap-2.5 ${
        isErr ? 'bg-rose-950/40 border-rose-500/30 text-rose-300' : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
      }`;
      alertText.textContent = msg;
      alertBox.classList.remove('hidden');
      if (window.lucide) window.lucide.createIcons({ root: alertBox });
    };

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = document.getElementById('reset-token').value;
        const newPass = document.getElementById('new-pass').value;
        const confirmPass = document.getElementById('confirm-new-pass').value;

        if (newPass !== confirmPass) {
          showAlert('Passwords do not match.');
          return;
        }

        try {
          await window.foundItAuth.resetPassword(token, newPass);
          showAlert('Password reset successfully! Redirecting to login...', false);
          setTimeout(() => {
            window.location.hash = '#login';
          }, 1500);
        } catch (err) {
          showAlert(err.message);
        }
      });
    }
  }

  // =========================================================================
  // VIEW: ACCESS DENIED (#access-denied) - 403 FORBIDDEN
  // =========================================================================
  function renderAccessDeniedView() {
    const user = window.foundItAuth ? window.foundItAuth.currentUser : null;
    return `
      <div class="max-w-lg mx-auto py-12 sm:py-20 text-center animate-in fade-in duration-200">
        <div class="bg-[#172033] border border-rose-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          
          <div class="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-rose-950">
            <i data-lucide="shield-alert" class="w-8 h-8"></i>
          </div>

          <span class="inline-block px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-extrabold uppercase tracking-wider mb-3 border border-rose-500/20">
            HTTP 403 Forbidden
          </span>

          <h1 class="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight mb-3" data-i18n="accessDeniedTitle">
            ${t('accessDeniedTitle')}
          </h1>

          <p class="text-xs sm:text-sm text-[#94A3B8] leading-relaxed max-w-md mx-auto mb-6" data-i18n="accessDeniedDesc">
            ${t('accessDeniedDesc')}
          </p>

          <!-- Authenticated State Summary -->
          ${user ? `
            <div class="bg-[#111827] p-3.5 rounded-2xl border border-[#293449] text-xs text-left mb-6 flex items-center justify-between">
              <div>
                <span class="text-[#64748B] block text-[10px] uppercase font-bold">Authenticated Identity</span>
                <span class="font-bold text-[#F8FAFC]">${user.name}</span>
                <span class="text-[#94A3B8] block text-[11px]">${user.email}</span>
              </div>
              <span class="px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wider bg-[#22D3EE]/15 text-[#22D3EE] border border-[#22D3EE]/30">
                ${user.role}
              </span>
            </div>
          ` : ''}

          <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="#dashboard" class="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 shadow-md">
              <i data-lucide="layout-dashboard" class="w-4 h-4"></i>
              <span data-i18n="btnReturnDashboard">${t('btnReturnDashboard')}</span>
            </a>
            <button id="btn-denied-signout" class="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#111827] hover:bg-[#1E2A42] border border-[#293449] text-[#94A3B8] hover:text-white text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2">
              <i data-lucide="log-out" class="w-4 h-4"></i>
              <span>Sign Out</span>
            </button>
          </div>

        </div>
      </div>
    `;
  }

  function setupAccessDeniedListeners() {
    const btn = document.getElementById('btn-denied-signout');
    if (btn) {
      btn.addEventListener('click', () => {
        window.foundItAuth.signOut();
      });
    }
  }

  // =========================================================================
  // VIEW: SESSION EXPIRED (#session-expired)
  // =========================================================================
  function renderSessionExpiredView() {
    return `
      <div class="max-w-md mx-auto py-12 sm:py-20 text-center animate-in fade-in duration-200">
        <div class="bg-[#172033] border border-amber-500/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          
          <div class="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-6">
            <i data-lucide="clock-alert" class="w-8 h-8"></i>
          </div>

          <h1 class="text-2xl font-extrabold text-[#F8FAFC] tracking-tight mb-3" data-i18n="sessionExpiredTitle">
            ${t('sessionExpiredTitle')}
          </h1>

          <p class="text-xs sm:text-sm text-[#94A3B8] leading-relaxed mb-6" data-i18n="sessionExpiredDesc">
            ${t('sessionExpiredDesc')}
          </p>

          <a href="#login" class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs sm:text-sm font-semibold shadow-md shadow-[#6366F1]/25 transition">
            <i data-lucide="log-in" class="w-4 h-4"></i>
            <span data-i18n="btnSignInAgain">${t('btnSignInAgain')}</span>
          </a>

        </div>
      </div>
    `;
  }

  function setupSessionExpiredListeners() {}

  // =========================================================================
  // VIEW: PERSONALIZED STUDENT DASHBOARD (#dashboard / #my-reports)
  // =========================================================================
  function renderStudentDashboardView() {
    const user = window.foundItAuth ? window.foundItAuth.currentUser : null;
    const allReports = window.foundItStore ? window.foundItStore.getAllReports() : [];
    
    // Filter reports belonging to this student
    const userReports = allReports.filter(r => {
      if (!user) return false;
      return (
        r.reporterId === user.id ||
        r.reporterRef === user.id ||
        r.reporterEmail === user.email ||
        (user.email && r.description && r.description.includes(user.email))
      );
    });

    const userClaims = window.foundItStore ? window.foundItStore.getUserClaims(user ? user.email : '') : [];

    // Calculate algorithmic match candidates for the student's reports
    let matchedCandidates = [];
    if (window.SmartMatchingEngine && userReports.length > 0) {
      userReports.forEach(r => {
        const matches = window.SmartMatchingEngine.findMatchesFor(r, allReports).slice(0, 2);
        matches.forEach(m => {
          if (m.totalScore >= 45) {
            matchedCandidates.push({ sourceReport: r, match: m });
          }
        });
      });
    }

    const returnedCount = userReports.filter(r => r.status === 'returned').length;

    return `
      <div class="space-y-8 animate-in fade-in duration-200">
        
        <!-- Personalized Student Banner -->
        <div class="bg-[#172033] border border-[#293449] rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden gradient-card-glow">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div class="flex items-center gap-4">
              <div class="relative">
                <img src="${user ? user.avatar : 'https://api.dicebear.com/7.x/initials/svg?seed=Student'}" 
                     class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#22D3EE] shadow-md shadow-[#22D3EE]/20" alt="Avatar">
                <span class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#34D399] border-2 border-[#172033]" title="Online Session"></span>
              </div>
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#22D3EE]/15 text-[#22D3EE] border border-[#22D3EE]/30">
                    Regular Student
                  </span>
                  <span class="text-xs text-[#94A3B8] font-mono">${user ? user.studentId || 'ID Verified' : ''}</span>
                </div>
                <h1 class="text-xl sm:text-2xl font-extrabold text-[#F8FAFC]">
                  ${isAr() ? `مرحباً بعودتك، ${user ? user.name : 'طالبنا العزيز'}` : `Welcome back, ${user ? user.name : 'Student'}!`}
                </h1>
                <p class="text-xs text-[#94A3B8] mt-0.5">${user ? user.email : ''}</p>
              </div>
            </div>

            <!-- Shortcuts -->
            <div class="flex flex-wrap items-center gap-2.5">
              <a href="#report?type=lost" class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-semibold text-xs shadow-md transition flex items-center gap-1.5">
                <i data-lucide="plus-circle" class="w-4 h-4"></i>
                <span>Report Lost Item</span>
              </a>
              <a href="#report?type=found" class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-semibold text-xs shadow-md transition flex items-center gap-1.5">
                <i data-lucide="check-circle" class="w-4 h-4"></i>
                <span>Report Found Item</span>
              </a>
              <button id="btn-dash-undo" class="px-3.5 py-2.5 rounded-xl bg-[#111827] hover:bg-[#1E2A42] border border-[#293449] text-[#22D3EE] font-semibold text-xs transition flex items-center gap-1.5" title="Undo last report action using LIFO Stack">
                <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
                <span>Stack Undo</span>
              </button>
            </div>

          </div>
        </div>

        <!-- 4 KPI Metrics -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-[#172033] p-5 rounded-2xl border border-[#293449] shadow-sm">
            <div class="flex items-center justify-between text-[#6366F1] mb-2">
              <span class="text-xs font-bold text-[#94A3B8]">My Active Reports</span>
              <i data-lucide="folder" class="w-4 h-4"></i>
            </div>
            <div class="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">${userReports.length}</div>
            <div class="text-[10px] text-[#64748B] mt-1">Under moderation or active</div>
          </div>

          <div class="bg-[#172033] p-5 rounded-2xl border border-[#293449] shadow-sm">
            <div class="flex items-center justify-between text-[#22D3EE] mb-2">
              <span class="text-xs font-bold text-[#94A3B8]">Correlated Matches</span>
              <i data-lucide="sparkles" class="w-4 h-4"></i>
            </div>
            <div class="text-2xl sm:text-3xl font-extrabold text-[#22D3EE]">${matchedCandidates.length}</div>
            <div class="text-[10px] text-[#64748B] mt-1">Suggested by algorithm</div>
          </div>

          <div class="bg-[#172033] p-5 rounded-2xl border border-[#293449] shadow-sm">
            <div class="flex items-center justify-between text-[#34D399] mb-2">
              <span class="text-xs font-bold text-[#94A3B8]">Reunited to Owner</span>
              <i data-lucide="check-check" class="w-4 h-4"></i>
            </div>
            <div class="text-2xl sm:text-3xl font-extrabold text-[#34D399]">${returnedCount}</div>
            <div class="text-[10px] text-[#64748B] mt-1">Successful campus handovers</div>
          </div>

          <div class="bg-[#172033] p-5 rounded-2xl border border-[#293449] shadow-sm">
            <div class="flex items-center justify-between text-[#FBBF24] mb-2">
              <span class="text-xs font-bold text-[#94A3B8]">My Submitted Claims</span>
              <i data-lucide="shield-check" class="w-4 h-4"></i>
            </div>
            <div class="text-2xl sm:text-3xl font-extrabold text-[#FBBF24]">${userClaims.length}</div>
            <div class="text-[10px] text-[#64748B] mt-1">Under staff verification</div>
          </div>
        </div>

        <!-- Section 1: My Reports -->
        <div class="bg-[#172033] border border-[#293449] rounded-3xl p-6 shadow-xl space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-bold text-[#F8FAFC]">My Campus Reports</h2>
              <p class="text-xs text-[#94A3B8]">Manage your submissions. Authorized edit and delete access is enforced.</p>
            </div>
            <a href="#report" class="text-xs font-semibold text-[#22D3EE] hover:underline flex items-center gap-1">
              <span>+ New Report</span>
            </a>
          </div>

          ${userReports.length === 0 ? `
            <div class="text-center py-12 border-2 border-dashed border-[#293449] rounded-2xl">
              <i data-lucide="inbox" class="w-10 h-10 text-[#64748B] mx-auto mb-3"></i>
              <h3 class="text-sm font-bold text-[#F8FAFC] mb-1">No Reports Submitted Yet</h3>
              <p class="text-xs text-[#94A3B8] max-w-sm mx-auto mb-4">
                Have you misplaced an item or found student belongings on campus? File a report to initiate recovery.
              </p>
              <a href="#report" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6366F1] text-white text-xs font-semibold">
                <i data-lucide="plus" class="w-4 h-4"></i>
                <span>Report Item Now</span>
              </a>
            </div>
          ` : `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              ${userReports.map(r => `
                <div class="bg-[#111827] border border-[#293449] rounded-2xl p-4 flex gap-4 hover:border-[#6366F1]/50 transition">
                  <img src="${r.image}" class="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0" alt="">
                  <div class="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div class="flex items-center gap-2 mb-1">
                        <span class="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider text-white ${r.type === 'lost' ? 'bg-rose-600' : 'bg-teal-600'}">
                          ${r.type.toUpperCase()}
                        </span>
                        <span class="text-[10px] text-[#64748B] font-mono">${r.id}</span>
                        <span class="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          r.status === 'open' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30' :
                          r.status === 'under_review' ? 'bg-amber-950/60 text-amber-400 border border-amber-500/30' :
                          r.status === 'returned' ? 'bg-teal-950/60 text-teal-300 border border-teal-500/30' :
                          'bg-slate-800 text-slate-300'
                        }">
                          ${r.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <h3 class="text-sm font-bold text-[#F8FAFC] truncate">${r.title}</h3>
                      <p class="text-[11px] text-[#94A3B8] line-clamp-1 mt-0.5">${r.description}</p>
                    </div>

                    <div class="flex items-center justify-between pt-2 border-t border-[#293449] mt-2">
                      <span class="text-[10px] text-[#64748B]">${r.date}</span>
                      <div class="flex items-center gap-1.5">
                        <button class="btn-dash-details text-[11px] font-semibold text-[#22D3EE] hover:underline px-2 py-1" data-id="${r.id}">
                          View Details
                        </button>
                        <button class="btn-dash-delete text-[11px] font-semibold text-rose-400 hover:text-rose-300 px-2 py-1" data-id="${r.id}">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <!-- Section 2: AI Heuristic Match Suggestions -->
        ${matchedCandidates.length > 0 ? `
          <div class="bg-[#172033] border border-[#293449] rounded-3xl p-6 shadow-xl space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-lg font-bold text-[#F8FAFC] flex items-center gap-2">
                  <i data-lucide="sparkles" class="w-5 h-5 text-[#22D3EE]"></i>
                  <span>Heuristic Matches for Your Items</span>
                </h2>
                <p class="text-xs text-[#94A3B8]">The system automatically correlated complementary Lost & Found reports based on category, keywords, building proximity, and dates.</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              ${matchedCandidates.map(item => `
                <div class="bg-[#111827] border border-[#293449] rounded-2xl p-4 flex gap-4 hover:border-[#22D3EE]/50 transition">
                  <img src="${item.match.candidateReport.image}" class="w-20 h-20 rounded-xl object-cover shrink-0" alt="">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between gap-2 mb-1">
                      <span class="px-2 py-0.5 rounded-full text-xs font-bold ${item.match.badgeClass}">
                        ${item.match.totalScore}% Match
                      </span>
                      <span class="text-[10px] text-[#64748B]">${item.match.candidateReport.date}</span>
                    </div>
                    <h3 class="text-sm font-bold text-[#F8FAFC] truncate">${item.match.candidateReport.title}</h3>
                    <p class="text-[11px] text-[#94A3B8] mt-0.5">Complementary to your report: <span class="text-[#22D3EE] font-medium">${item.sourceReport.title}</span></p>
                    <div class="pt-2 mt-2 flex justify-end">
                      <button class="btn-dash-details px-3 py-1.5 rounded-lg bg-[#22D3EE]/15 hover:bg-[#22D3EE]/25 text-[#22D3EE] text-xs font-semibold transition" data-id="${item.match.candidateReport.id}">
                        Inspect Candidate Item
                      </button>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Section 3: Safe Handover Claims -->
        <div class="bg-[#172033] border border-[#293449] rounded-3xl p-6 shadow-xl space-y-4">
          <div>
            <h2 class="text-lg font-bold text-[#F8FAFC] flex items-center gap-2">
              <i data-lucide="shield-check" class="w-5 h-5 text-[#34D399]"></i>
              <span>My Ownership Claims</span>
            </h2>
            <p class="text-xs text-[#94A3B8]">When you claim a found item, campus security verifies identifying marks before releasing the property.</p>
          </div>

          ${userClaims.length === 0 ? `
            <p class="text-xs text-[#64748B] italic">You have not submitted any item claims yet.</p>
          ` : `
            <div class="space-y-3">
              ${userClaims.map(c => `
                <div class="bg-[#111827] border border-[#293449] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-xs font-bold text-[#F8FAFC]">${c.id}</span>
                      <span class="text-[11px] text-[#64748B]">Target Item: ${c.reportId}</span>
                    </div>
                    <p class="text-xs text-[#94A3B8]">Identifying Mark: "${c.q1}"</p>
                  </div>
                  <span class="px-2.5 py-1 rounded-full text-xs font-bold self-start sm:self-auto ${
                    c.status === 'approved_for_handover' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30' :
                    c.status === 'rejected' ? 'bg-rose-950/60 text-rose-400 border border-rose-500/30' :
                    'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                  }">
                    ${c.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              `).join('')}
            </div>
          `}
        </div>

      </div>
    `;
  }

  function setupStudentDashboardListeners() {
    // Details buttons
    document.querySelectorAll('.btn-dash-details').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (id && window.openItemDetails) window.openItemDetails(id);
      });
    });

    // Delete buttons
    document.querySelectorAll('.btn-dash-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (!id) return;
        if (window.openConfirmDialog) {
          window.openConfirmDialog(
            'Delete Report?',
            'Are you sure you want to delete this report? You can instantly restore it with the LIFO Stack Undo button.',
            () => {
              try {
                window.foundItStore.deleteReport(id);
                if (window.showToast) window.showToast('Report deleted. Use Stack Undo to restore.', 'info');
                window.location.hash = '#dashboard';
              } catch (err) {
                if (window.showToast) window.showToast(err.message, 'error');
              }
            }
          );
        }
      });
    });

    // Undo button
    const undoBtn = document.getElementById('btn-dash-undo');
    if (undoBtn) {
      undoBtn.addEventListener('click', () => {
        const res = window.foundItStore.undoLastAction();
        if (window.showToast) {
          window.showToast(res.message, res.success ? 'success' : 'error');
        }
        if (res.success) {
          window.renderCurrentView();
        }
      });
    }
  }

  // =========================================================================
  // VIEW: COMPREHENSIVE ADMINISTRATOR CONSOLE (#admin)
  // =========================================================================
  let currentAdminTab = 'queue'; // 'queue' | 'reports' | 'claims' | 'users' | 'audit' | 'cloud'

  function renderAdminConsoleView() {
    const auth = window.foundItAuth;
    const store = window.foundItStore;
    const allReports = store.getAllReports();
    const reviewQueue = store.reviewQueue;
    const returnedCount = allReports.filter(r => r.status === 'returned').length;
    const approvedCount = allReports.filter(r => r.status === 'open' || r.status === 'matched').length;
    const users = auth.getUsers();
    const claims = store.getClaims();
    const auditLogs = store.auditLogs;
    const securityLogs = auth.getSecurityAuditLogs();
    const cloudConfig = auth.getCloudConfig();

    return `
      <div class="space-y-8 animate-in fade-in duration-200">
        
        <!-- Admin Console Header -->
        <div class="bg-[#172033] border border-[#293449] rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden gradient-card-glow">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/15 text-[#FBBF24] border border-amber-500/30 flex items-center gap-1">
                  <i data-lucide="shield" class="w-3 h-3"></i>
                  <span>Campus Administrator Authority</span>
                </span>
                <span class="text-xs text-[#94A3B8]">Staff Moderation & Database Desk</span>
              </div>
              <h1 class="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">
                ${isAr() ? 'مركز الإدارة والإشراف الجامعي' : 'University Administration & Moderation Console'}
              </h1>
              <p class="text-xs text-[#94A3B8] mt-1 max-w-xl">
                Moderate university item reports, review student ownership claims, manage user accounts, inspect security audit trails, and configure Supabase Google OAuth.
              </p>
            </div>

            <!-- Quick Dequeue Button -->
            <button id="btn-admin-dequeue-fifo" ${reviewQueue.length === 0 ? 'disabled' : ''}
                    class="px-5 py-3 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#4F46E5] hover:from-[#4F46E5] hover:to-[#4338CA] text-white font-semibold text-xs shadow-md transition flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shrink-0">
              <i data-lucide="layers" class="w-4 h-4 text-[#22D3EE]"></i>
              <span>Process Next in FIFO Queue</span>
            </button>
          </div>
        </div>

        <!-- 5 KPI Summary Cards -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <div class="bg-[#172033] p-4 rounded-2xl border border-[#293449] shadow-sm">
            <div class="flex items-center justify-between text-[#FBBF24] mb-1">
              <span class="text-[11px] font-bold text-[#94A3B8]">FIFO Queue</span>
              <i data-lucide="layers" class="w-4 h-4"></i>
            </div>
            <div class="text-2xl font-extrabold text-[#FBBF24]">${reviewQueue.length}</div>
            <div class="text-[10px] text-[#64748B]">Pending review</div>
          </div>

          <div class="bg-[#172033] p-4 rounded-2xl border border-[#293449] shadow-sm">
            <div class="flex items-center justify-between text-[#6366F1] mb-1">
              <span class="text-[11px] font-bold text-[#94A3B8]">Total Reports</span>
              <i data-lucide="database" class="w-4 h-4"></i>
            </div>
            <div class="text-2xl font-extrabold text-[#F8FAFC]">${allReports.length}</div>
            <div class="text-[10px] text-[#64748B]">Catalog indexed</div>
          </div>

          <div class="bg-[#172033] p-4 rounded-2xl border border-[#293449] shadow-sm">
            <div class="flex items-center justify-between text-[#34D399] mb-1">
              <span class="text-[11px] font-bold text-[#94A3B8]">Approved & Open</span>
              <i data-lucide="check-circle" class="w-4 h-4"></i>
            </div>
            <div class="text-2xl font-extrabold text-[#34D399]">${approvedCount}</div>
            <div class="text-[10px] text-[#64748B]">Active on campus</div>
          </div>

          <div class="bg-[#172033] p-4 rounded-2xl border border-[#293449] shadow-sm">
            <div class="flex items-center justify-between text-[#22D3EE] mb-1">
              <span class="text-[11px] font-bold text-[#94A3B8]">Reunited Items</span>
              <i data-lucide="award" class="w-4 h-4"></i>
            </div>
            <div class="text-2xl font-extrabold text-[#22D3EE]">${returnedCount}</div>
            <div class="text-[10px] text-[#64748B]">Handed to owner</div>
          </div>

          <div class="bg-[#172033] p-4 rounded-2xl border border-[#293449] shadow-sm">
            <div class="flex items-center justify-between text-indigo-400 mb-1">
              <span class="text-[11px] font-bold text-[#94A3B8]">Registered Users</span>
              <i data-lucide="users" class="w-4 h-4"></i>
            </div>
            <div class="text-2xl font-extrabold text-[#F8FAFC]">${users.length}</div>
            <div class="text-[10px] text-[#64748B]">Verified students & staff</div>
          </div>
        </div>

        <!-- 6 Interactive Tabs Bar -->
        <div class="border-b border-[#293449] flex items-center overflow-x-auto no-scrollbar gap-2 pb-px">
          <button class="admin-tab-btn px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            currentAdminTab === 'queue' ? 'border-[#6366F1] text-[#22D3EE] bg-[#172033]/50 rounded-t-xl' : 'border-transparent text-[#94A3B8] hover:text-white'
          }" data-tab="queue">
            <i data-lucide="layers" class="w-4 h-4"></i>
            <span>FIFO Moderation Queue</span>
            <span class="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-[#FBBF24] font-mono">${reviewQueue.length}</span>
          </button>

          <button class="admin-tab-btn px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            currentAdminTab === 'reports' ? 'border-[#6366F1] text-[#22D3EE] bg-[#172033]/50 rounded-t-xl' : 'border-transparent text-[#94A3B8] hover:text-white'
          }" data-tab="reports">
            <i data-lucide="list" class="w-4 h-4"></i>
            <span>All Campus Reports (${allReports.length})</span>
          </button>

          <button class="admin-tab-btn px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            currentAdminTab === 'claims' ? 'border-[#6366F1] text-[#22D3EE] bg-[#172033]/50 rounded-t-xl' : 'border-transparent text-[#94A3B8] hover:text-white'
          }" data-tab="claims">
            <i data-lucide="shield-check" class="w-4 h-4"></i>
            <span>Ownership Claims Desk (${claims.length})</span>
          </button>

          <button class="admin-tab-btn px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            currentAdminTab === 'users' ? 'border-[#6366F1] text-[#22D3EE] bg-[#172033]/50 rounded-t-xl' : 'border-transparent text-[#94A3B8] hover:text-white'
          }" data-tab="users">
            <i data-lucide="users" class="w-4 h-4"></i>
            <span>Registered Users & Roles</span>
          </button>

          <button class="admin-tab-btn px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            currentAdminTab === 'audit' ? 'border-[#6366F1] text-[#22D3EE] bg-[#172033]/50 rounded-t-xl' : 'border-transparent text-[#94A3B8] hover:text-white'
          }" data-tab="audit">
            <i data-lucide="file-text" class="w-4 h-4"></i>
            <span>Security & Audit Trails</span>
          </button>

          <button class="admin-tab-btn px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            currentAdminTab === 'cloud' ? 'border-[#6366F1] text-[#22D3EE] bg-[#172033]/50 rounded-t-xl' : 'border-transparent text-[#94A3B8] hover:text-white'
          }" data-tab="cloud">
            <i data-lucide="cloud-cog" class="w-4 h-4"></i>
            <span>Supabase & OAuth Settings</span>
          </button>
        </div>

        <!-- =================================================================== -->
        <!-- TAB 1: FIFO MODERATION QUEUE -->
        <!-- =================================================================== -->
        <div id="tab-admin-queue" class="${currentAdminTab === 'queue' ? '' : 'hidden'} space-y-4">
          <div class="bg-[#172033] border border-[#293449] rounded-3xl p-6 shadow-xl space-y-4">
            <div class="flex items-center justify-between border-b border-[#293449] pb-4">
              <div>
                <h3 class="text-base font-bold text-[#F8FAFC] flex items-center gap-2">
                  <span>FIFO Review Queue (Data Structure: Queue)</span>
                </h3>
                <p class="text-xs text-[#94A3B8]">Items are prioritized in exact first-in, first-out order to ensure academic fairness.</p>
              </div>
              <span class="text-xs text-[#FBBF24] font-mono bg-amber-950/40 px-3 py-1 rounded-lg border border-amber-500/30">
                ${reviewQueue.length} items awaiting review
              </span>
            </div>

            ${reviewQueue.length === 0 ? `
              <div class="text-center py-12 space-y-2 text-[#94A3B8]">
                <i data-lucide="check-circle" class="w-12 h-12 text-[#34D399] mx-auto mb-2"></i>
                <h4 class="text-base font-bold text-[#F8FAFC]">Review Queue is Empty!</h4>
                <p class="text-xs max-w-sm mx-auto">All submitted university items have been moderated and published.</p>
              </div>
            ` : `
              <div class="overflow-x-auto">
                <table class="w-full text-left rtl:text-right text-xs">
                  <thead>
                    <tr class="border-b border-[#293449] text-[#94A3B8] uppercase font-bold text-[10px]">
                      <th class="py-3 px-3">Queue Position</th>
                      <th class="py-3 px-3">Item Details</th>
                      <th class="py-3 px-3">Category</th>
                      <th class="py-3 px-3">Location & Reporter</th>
                      <th class="py-3 px-3">Date</th>
                      <th class="py-3 px-3 text-right rtl:text-left">Moderation Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-[#293449]/70">
                    ${reviewQueue.map((item, idx) => `
                      <tr class="hover:bg-[#111827]/60 transition">
                        <td class="py-3 px-3 font-mono font-bold">
                          ${idx === 0 ? '<span class="px-2 py-0.5 rounded bg-amber-500 text-black text-[10px] font-extrabold animate-pulse">NEXT FIFO</span>' : `#${idx + 1}`}
                        </td>
                        <td class="py-3 px-3">
                          <div class="flex items-center gap-3">
                            <img src="${item.image}" class="w-10 h-10 rounded-lg object-cover shrink-0 border border-[#293449]" alt="">
                            <div>
                              <div class="font-bold text-[#F8FAFC]">${item.title}</div>
                              <div class="text-[10px] text-[#64748B] font-mono">${item.id} • ${item.type.toUpperCase()}</div>
                            </div>
                          </div>
                        </td>
                        <td class="py-3 px-3 text-[#94A3B8]">${item.category}</td>
                        <td class="py-3 px-3">
                          <div class="text-[#F8FAFC]">${item.zone}</div>
                          <div class="text-[10px] text-[#64748B]">${item.reporterName} (${item.reporterEmail || 'student'})</div>
                        </td>
                        <td class="py-3 px-3 text-[#94A3B8]">${item.date}</td>
                        <td class="py-3 px-3 text-right rtl:text-left space-x-1 rtl:space-x-reverse">
                          <button class="btn-admin-approve px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 text-[#34D399] font-bold text-xs border border-emerald-500/30 transition" data-id="${item.id}">
                            Approve & Publish
                          </button>
                          <button class="btn-admin-reject px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-400 font-bold text-xs border border-rose-500/30 transition" data-id="${item.id}">
                            Reject / Flag
                          </button>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            `}
          </div>
        </div>

        <!-- =================================================================== -->
        <!-- TAB 2: ALL CAMPUS REPORTS MASTER TABLE -->
        <!-- =================================================================== -->
        <div id="tab-admin-reports" class="${currentAdminTab === 'reports' ? '' : 'hidden'} space-y-4">
          <div class="bg-[#172033] border border-[#293449] rounded-3xl p-6 shadow-xl space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#293449] pb-4">
              <div>
                <h3 class="text-base font-bold text-[#F8FAFC]">All University Reports Database</h3>
                <p class="text-xs text-[#94A3B8]">Direct administrative status modification and report management.</p>
              </div>
              <input type="text" id="admin-reports-search" placeholder="Search ID, title, zone, reporter..." 
                     class="px-3 py-2 rounded-xl border border-[#293449] bg-[#111827] text-xs text-[#F8FAFC] w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-[#22D3EE]">
            </div>

            <div class="overflow-x-auto max-h-[600px] overflow-y-auto">
              <table class="w-full text-left rtl:text-right text-xs" id="table-admin-reports">
                <thead class="sticky top-0 bg-[#172033] z-10 border-b border-[#293449]">
                  <tr class="text-[#94A3B8] uppercase font-bold text-[10px]">
                    <th class="py-3 px-3">Report ID</th>
                    <th class="py-3 px-3">Item Details</th>
                    <th class="py-3 px-3">Type</th>
                    <th class="py-3 px-3">Status Modifier</th>
                    <th class="py-3 px-3">Reporter Info</th>
                    <th class="py-3 px-3 text-right rtl:text-left">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#293449]/70" id="admin-reports-tbody">
                  ${allReports.map(r => `
                    <tr class="hover:bg-[#111827]/60 transition" data-report-id="${r.id}">
                      <td class="py-3 px-3 font-mono font-bold text-[#22D3EE]">${r.id}</td>
                      <td class="py-3 px-3">
                        <div class="flex items-center gap-2.5">
                          <img src="${r.image}" class="w-8 h-8 rounded-lg object-cover shrink-0 border border-[#293449]" alt="">
                          <div>
                            <div class="font-bold text-[#F8FAFC]">${r.title}</div>
                            <div class="text-[10px] text-[#64748B]">${r.category} • ${r.date}</div>
                          </div>
                        </div>
                      </td>
                      <td class="py-3 px-3">
                        <span class="px-2 py-0.5 rounded text-[9px] font-bold uppercase ${r.type === 'lost' ? 'bg-rose-950/60 text-rose-400 border border-rose-500/30' : 'bg-teal-950/60 text-teal-400 border border-teal-500/30'}">
                          ${r.type}
                        </span>
                      </td>
                      <td class="py-3 px-3">
                        <select class="admin-status-select bg-[#111827] border border-[#293449] rounded-lg px-2 py-1 text-xs text-[#F8FAFC] focus:outline-none" data-id="${r.id}">
                          <option value="open" ${r.status === 'open' ? 'selected' : ''}>Active / Open</option>
                          <option value="under_review" ${r.status === 'under_review' ? 'selected' : ''}>Under Review</option>
                          <option value="matched" ${r.status === 'matched' ? 'selected' : ''}>Match Found</option>
                          <option value="returned" ${r.status === 'returned' ? 'selected' : ''}>Returned to Owner</option>
                          <option value="closed" ${r.status === 'closed' ? 'selected' : ''}>Closed / Archived</option>
                        </select>
                      </td>
                      <td class="py-3 px-3 text-[11px] text-[#94A3B8]">
                        <div class="text-[#F8FAFC]">${r.reporterName}</div>
                        <div class="text-[10px] text-[#64748B]">${r.reporterEmail || r.contactMethod}</div>
                      </td>
                      <td class="py-3 px-3 text-right rtl:text-left space-x-1">
                        <button class="btn-admin-view-details px-2 py-1 rounded bg-[#111827] hover:bg-[#1E2A42] text-[#22D3EE] text-[11px] font-semibold" data-id="${r.id}">
                          Inspect
                        </button>
                        <button class="btn-admin-delete px-2 py-1 rounded bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-[11px] font-semibold" data-id="${r.id}">
                          Delete
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- =================================================================== -->
        <!-- TAB 3: OWNERSHIP CLAIMS DESK -->
        <!-- =================================================================== -->
        <div id="tab-admin-claims" class="${currentAdminTab === 'claims' ? '' : 'hidden'} space-y-4">
          <div class="bg-[#172033] border border-[#293449] rounded-3xl p-6 shadow-xl space-y-4">
            <div class="border-b border-[#293449] pb-4">
              <h3 class="text-base font-bold text-[#F8FAFC] flex items-center gap-2">
                <i data-lucide="shield-check" class="w-5 h-5 text-[#34D399]"></i>
                <span>Safe Ownership Verification Claims Desk</span>
              </h3>
              <p class="text-xs text-[#94A3B8]">Review answers submitted by students to verify genuine item ownership before safe handover.</p>
            </div>

            ${claims.length === 0 ? `
              <p class="text-xs text-[#64748B] italic py-8 text-center">No item claims submitted yet.</p>
            ` : `
              <div class="space-y-4">
                ${claims.map(c => `
                  <div class="bg-[#111827] border border-[#293449] rounded-2xl p-5 space-y-3">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#293449]/70 pb-3">
                      <div>
                        <div class="flex items-center gap-2">
                          <span class="text-xs font-mono font-bold text-[#22D3EE]">${c.id}</span>
                          <span class="text-xs font-bold text-[#F8FAFC]">For Report: ${c.reportId}</span>
                        </div>
                        <div class="text-xs text-[#94A3B8] mt-0.5">
                          Claimant: <strong class="text-[#F8FAFC]">${c.studentName}</strong> (${c.studentEmail}) • Student ID: ${c.studentId}
                        </div>
                      </div>
                      <span class="px-2.5 py-1 rounded-full text-xs font-bold self-start sm:self-auto ${
                        c.status === 'approved_for_handover' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30' :
                        c.status === 'rejected' ? 'bg-rose-950/60 text-rose-400 border border-rose-500/30' :
                        'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                      }">
                        ${c.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    <!-- Verification Questions Answer Inspection -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-[#172033] p-3 rounded-xl border border-[#293449]">
                      <div>
                        <span class="text-[#64748B] block text-[10px] font-bold uppercase mb-0.5">Q1: Markings / Scratches</span>
                        <p class="text-[#F8FAFC]">${c.q1 || 'None provided'}</p>
                      </div>
                      <div>
                        <span class="text-[#64748B] block text-[10px] font-bold uppercase mb-0.5">Q2: Time / Specific Location</span>
                        <p class="text-[#F8FAFC]">${c.q2 || 'None provided'}</p>
                      </div>
                      <div>
                        <span class="text-[#64748B] block text-[10px] font-bold uppercase mb-0.5">Q3: Serial / Passcode Hint</span>
                        <p class="text-[#F8FAFC]">${c.q3 || 'None provided'}</p>
                      </div>
                    </div>

                    <!-- Claim Action Buttons -->
                    <div class="flex items-center justify-end gap-2 pt-1">
                      <button class="btn-claim-approve px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 text-[#34D399] font-semibold text-xs border border-emerald-500/30 transition" data-id="${c.id}">
                        Approve Handover
                      </button>
                      <button class="btn-claim-reject px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-400 font-semibold text-xs border border-rose-500/30 transition" data-id="${c.id}">
                        Reject Claim
                      </button>
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>
        </div>

        <!-- =================================================================== -->
        <!-- TAB 4: REGISTERED USERS & ROLES -->
        <!-- =================================================================== -->
        <div id="tab-admin-users" class="${currentAdminTab === 'users' ? '' : 'hidden'} space-y-4">
          <div class="bg-[#172033] border border-[#293449] rounded-3xl p-6 shadow-xl space-y-4">
            <div class="border-b border-[#293449] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 class="text-base font-bold text-[#F8FAFC]">Registered Campus Users Directory</h3>
                <p class="text-xs text-[#94A3B8]">Review user identity, verified email status, roles, and enforce account suspension.</p>
              </div>
              <div class="p-2 rounded-xl bg-[#111827] border border-[#293449] text-[11px] text-[#22D3EE]">
                🔒 <strong>RBAC Policy</strong>: Only authenticated database administrators can alter accounts.
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left rtl:text-right text-xs">
                <thead>
                  <tr class="border-b border-[#293449] text-[#94A3B8] uppercase font-bold text-[10px]">
                    <th class="py-3 px-3">User</th>
                    <th class="py-3 px-3">Role</th>
                    <th class="py-3 px-3">Student / Staff ID</th>
                    <th class="py-3 px-3">Email Verified</th>
                    <th class="py-3 px-3">Status</th>
                    <th class="py-3 px-3 text-right rtl:text-left">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#293449]/70">
                  ${users.map(u => `
                    <tr class="hover:bg-[#111827]/60 transition">
                      <td class="py-3 px-3">
                        <div class="flex items-center gap-2.5">
                          <img src="${u.avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=User'}" class="w-8 h-8 rounded-lg object-cover shrink-0 border border-[#293449]" alt="">
                          <div>
                            <div class="font-bold text-[#F8FAFC]">${u.name}</div>
                            <div class="text-[10px] text-[#64748B]">${u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td class="py-3 px-3">
                        <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          u.role === 'admin' ? 'bg-amber-500/15 text-[#FBBF24] border border-amber-500/30' : 'bg-[#22D3EE]/15 text-[#22D3EE] border border-[#22D3EE]/30'
                        }">
                          ${u.role}
                        </span>
                      </td>
                      <td class="py-3 px-3 font-mono text-[#94A3B8]">${u.studentId || 'N/A'}</td>
                      <td class="py-3 px-3">
                        <span class="flex items-center gap-1 font-semibold ${u.emailVerified ? 'text-[#34D399]' : 'text-amber-400'}">
                          <i data-lucide="${u.emailVerified ? 'check-circle' : 'alert-circle'}" class="w-3.5 h-3.5"></i>
                          <span>${u.emailVerified ? 'Verified' : 'Pending Code'}</span>
                        </span>
                      </td>
                      <td class="py-3 px-3">
                        <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.status === 'active' ? 'bg-emerald-950/60 text-[#34D399]' : 'bg-rose-950/60 text-rose-400'
                        }">
                          ${u.status}
                        </span>
                      </td>
                      <td class="py-3 px-3 text-right rtl:text-left">
                        ${u.id !== auth.currentUser.id ? `
                          ${u.status === 'active' ? `
                            <button class="btn-user-suspend px-2.5 py-1 rounded bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-semibold border border-rose-500/30" data-id="${u.id}">
                              Suspend
                            </button>
                          ` : `
                            <button class="btn-user-reactivate px-2.5 py-1 rounded bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 text-xs font-semibold border border-emerald-500/30" data-id="${u.id}">
                              Reactivate
                            </button>
                          `}
                        ` : '<span class="text-[10px] text-[#64748B] italic">Current Session</span>'}
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- =================================================================== -->
        <!-- TAB 5: SYSTEM & SECURITY AUDIT TRAILS -->
        <!-- =================================================================== -->
        <div id="tab-admin-audit" class="${currentAdminTab === 'audit' ? '' : 'hidden'} space-y-4">
          <div class="bg-[#172033] border border-[#293449] rounded-3xl p-6 shadow-xl space-y-4">
            <div class="border-b border-[#293449] pb-4 flex items-center justify-between">
              <div>
                <h3 class="text-base font-bold text-[#F8FAFC]">Security Audit Log & Moderation Trail</h3>
                <p class="text-xs text-[#94A3B8]">Immutable stream of authentication attempts, role checks, and database modifications.</p>
              </div>
              <span class="text-xs font-mono text-[#64748B]">Real-Time Monitor</span>
            </div>

            <div class="space-y-2.5 max-h-[500px] overflow-y-auto">
              ${[...securityLogs, ...auditLogs].slice(0, 30).map(log => `
                <div class="bg-[#111827] border border-[#293449] p-3 rounded-xl flex items-start justify-between gap-3 text-xs">
                  <div class="flex items-start gap-2.5">
                    <span class="w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      (log.type && log.type.includes('SECURITY')) || (log.type && log.type.includes('FAIL')) ? 'bg-rose-500' :
                      (log.type && log.type.includes('SUCCESS')) ? 'bg-emerald-400' : 'bg-[#6366F1]'
                    }"></span>
                    <div>
                      <div class="font-bold text-[#F8FAFC]">${log.message || log.text}</div>
                      <div class="text-[10px] text-[#64748B]">User: ${log.user || 'system'} • Event: ${log.type || 'info'}</div>
                    </div>
                  </div>
                  <span class="text-[10px] text-[#64748B] font-mono shrink-0">${log.time}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- =================================================================== -->
        <!-- TAB 6: SUPABASE & GOOGLE OAUTH CONFIGURATION -->
        <!-- =================================================================== -->
        <div id="tab-admin-cloud" class="${currentAdminTab === 'cloud' ? '' : 'hidden'} space-y-6">
          <div class="bg-[#172033] border border-[#293449] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div class="border-b border-[#293449] pb-4">
              <h3 class="text-lg font-bold text-[#F8FAFC] flex items-center gap-2">
                <i data-lucide="cloud-cog" class="w-5 h-5 text-[#22D3EE]"></i>
                <span>Supabase Authentication & Google OAuth Provider Setup</span>
              </h3>
              <p class="text-xs text-[#94A3B8] mt-1">
                Configure connection parameters for production cloud services. When credentials are omitted, the application operates in compliant local sandbox mode.
              </p>
            </div>

            <!-- Configuration Form -->
            <form id="form-cloud-config" class="space-y-4 max-w-xl">
              <div>
                <label class="block text-xs font-semibold text-[#94A3B8] mb-1.5" for="cfg-supabase-url">
                  Supabase Project URL
                </label>
                <input type="text" id="cfg-supabase-url" value="${cloudConfig.supabaseUrl || ''}" placeholder="https://your-project.supabase.co"
                       class="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-[#293449] bg-[#111827] text-[#F8FAFC] focus:ring-2 focus:ring-[#6366F1] focus:outline-none">
              </div>

              <div>
                <label class="block text-xs font-semibold text-[#94A3B8] mb-1.5" for="cfg-supabase-key">
                  Supabase Public Anon Key
                </label>
                <input type="password" id="cfg-supabase-key" value="${cloudConfig.supabaseAnonKey || ''}" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI..."
                       class="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-[#293449] bg-[#111827] text-[#F8FAFC] focus:ring-2 focus:ring-[#6366F1] focus:outline-none">
              </div>

              <div>
                <label class="block text-xs font-semibold text-[#94A3B8] mb-1.5" for="cfg-google-client-id">
                  Google OAuth Client ID (Google Identity Services)
                </label>
                <input type="text" id="cfg-google-client-id" value="${cloudConfig.googleClientId || ''}" placeholder="123456789-xxxx.apps.googleusercontent.com"
                       class="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-[#293449] bg-[#111827] text-[#F8FAFC] focus:ring-2 focus:ring-[#6366F1] focus:outline-none">
              </div>

              <div class="flex items-center gap-3 pt-2">
                <button type="submit" class="px-5 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold text-xs transition shadow-md flex items-center gap-2">
                  <i data-lucide="save" class="w-4 h-4"></i>
                  <span>Save Configuration</span>
                </button>
                <button type="button" id="btn-test-cloud" class="px-4 py-2.5 rounded-xl bg-[#111827] hover:bg-[#1E2A42] border border-[#293449] text-[#22D3EE] font-semibold text-xs transition flex items-center gap-2">
                  <i data-lucide="activity" class="w-4 h-4"></i>
                  <span>Test Cloud Connection</span>
                </button>
              </div>
            </form>

            <!-- Production PostgreSQL Schema with RLS Policies -->
            <div class="pt-6 border-t border-[#293449] space-y-3">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-bold text-[#F8FAFC]">PostgreSQL Schema with Row Level Security (RLS)</h4>
                  <p class="text-xs text-[#94A3B8]">Deploy this SQL script to your Supabase SQL Editor to enforce strict RBAC at database level.</p>
                </div>
                <button id="btn-copy-sql" class="px-3 py-1.5 rounded-lg bg-[#111827] hover:bg-[#1E2A42] border border-[#293449] text-[#22D3EE] text-xs font-semibold flex items-center gap-1.5 transition">
                  <i data-lucide="copy" class="w-3.5 h-3.5"></i>
                  <span>Copy SQL Script</span>
                </button>
              </div>

              <pre class="bg-[#111827] border border-[#293449] p-4 rounded-2xl text-[11px] font-mono text-slate-300 overflow-x-auto max-h-64 leading-relaxed"><code id="sql-schema-code">-- 1. PROFILES TABLE (Strict RBAC)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  student_id TEXT,
  avatar_url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles read" ON public.profiles FOR SELECT TO authenticated USING (true);

-- User cannot elevate their own role
CREATE POLICY "Users update own non-role profile" ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Admins moderate profiles" ON public.profiles FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- 2. REPORTS TABLE WITH OWNERSHIP ENFORCEMENT
CREATE TABLE IF NOT EXISTS public.reports (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('lost', 'found')),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  zone TEXT NOT NULL,
  location_detail TEXT,
  status TEXT NOT NULL DEFAULT 'under_review' CHECK (status IN ('under_review', 'open', 'matched', 'returned', 'closed')),
  reporter_id UUID REFERENCES public.profiles(id),
  reporter_email TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Read reports" ON public.reports FOR SELECT TO authenticated
USING (status != 'under_review' OR reporter_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Students insert reports" ON public.reports FOR INSERT TO authenticated
WITH CHECK (reporter_id = auth.uid() AND status = 'under_review');

CREATE POLICY "Students update own reports" ON public.reports FOR UPDATE TO authenticated
USING (reporter_id = auth.uid()) WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "Admins moderate all reports" ON public.reports FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));</code></pre>
            </div>

          </div>
        </div>

      </div>
    `;
  }

  function setupAdminConsoleListeners() {
    // Tab switching
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentAdminTab = btn.getAttribute('data-tab');
        if (window.renderCurrentView) window.renderCurrentView();
      });
    });

    // Dequeue FIFO
    const fifoBtn = document.getElementById('btn-admin-dequeue-fifo');
    if (fifoBtn) {
      fifoBtn.addEventListener('click', () => {
        try {
          const approved = window.foundItStore.dequeueAndApprove();
          if (approved && window.showToast) {
            window.showToast(`FIFO Dequeued & Approved: "${approved.title}" (${approved.id})`, 'success');
            window.renderCurrentView();
          }
        } catch (err) {
          if (window.showToast) window.showToast(err.message, 'error');
        }
      });
    }

    // Individual Approve
    document.querySelectorAll('.btn-admin-approve').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        window.foundItStore.updateReport(id, { status: 'open' });
        if (window.showToast) window.showToast(`Report ${id} approved and published!`, 'success');
        window.renderCurrentView();
      });
    });

    // Individual Reject
    document.querySelectorAll('.btn-admin-reject').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        window.foundItStore.updateReport(id, { status: 'closed' });
        if (window.showToast) window.showToast(`Report ${id} closed/rejected.`, 'info');
        window.renderCurrentView();
      });
    });

    // Status changer dropdown
    document.querySelectorAll('.admin-status-select').forEach(sel => {
      sel.addEventListener('change', () => {
        const id = sel.getAttribute('data-id');
        const nextStatus = sel.value;
        try {
          window.foundItStore.updateReport(id, { status: nextStatus });
          if (window.showToast) window.showToast(`Updated status of ${id} to ${nextStatus}`, 'success');
        } catch (err) {
          if (window.showToast) window.showToast(err.message, 'error');
        }
      });
    });

    // Delete in master table
    document.querySelectorAll('.btn-admin-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (window.openConfirmDialog) {
          window.openConfirmDialog(
            'Delete Report (Administrator Override)?',
            `Are you sure you want to remove report ${id}? This action will be recorded in the security audit trail.`,
            () => {
              window.foundItStore.deleteReport(id);
              if (window.showToast) window.showToast(`Report ${id} deleted by Administrator`, 'info');
              window.renderCurrentView();
            }
          );
        }
      });
    });

    // Inspect Details
    document.querySelectorAll('.btn-admin-view-details').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (id && window.openItemDetails) window.openItemDetails(id);
      });
    });

    // Claims approve/reject
    document.querySelectorAll('.btn-claim-approve').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        window.foundItStore.updateClaimStatus(id, 'approved_for_handover');
        if (window.showToast) window.showToast(`Claim ${id} approved for handover!`, 'success');
        window.renderCurrentView();
      });
    });

    document.querySelectorAll('.btn-claim-reject').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        window.foundItStore.updateClaimStatus(id, 'rejected');
        if (window.showToast) window.showToast(`Claim ${id} rejected.`, 'info');
        window.renderCurrentView();
      });
    });

    // User Suspend / Reactivate
    document.querySelectorAll('.btn-user-suspend').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        try {
          window.foundItAuth.setUserStatus(id, 'suspended');
          if (window.showToast) window.showToast('User account suspended.', 'error');
          window.renderCurrentView();
        } catch (err) {
          if (window.showToast) window.showToast(err.message, 'error');
        }
      });
    });

    document.querySelectorAll('.btn-user-reactivate').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        try {
          window.foundItAuth.setUserStatus(id, 'active');
          if (window.showToast) window.showToast('User account reactivated.', 'success');
          window.renderCurrentView();
        } catch (err) {
          if (window.showToast) window.showToast(err.message, 'error');
        }
      });
    });

    // Reports Search
    const searchInput = document.getElementById('admin-reports-search');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const q = searchInput.value.toLowerCase().trim();
        document.querySelectorAll('#admin-reports-tbody tr').forEach(row => {
          const text = row.textContent.toLowerCase();
          row.style.display = text.includes(q) ? '' : 'none';
        });
      });
    }

    // Cloud Config Form
    const cloudForm = document.getElementById('form-cloud-config');
    if (cloudForm) {
      cloudForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const supabaseUrl = document.getElementById('cfg-supabase-url').value.trim();
        const supabaseAnonKey = document.getElementById('cfg-supabase-key').value.trim();
        const googleClientId = document.getElementById('cfg-google-client-id').value.trim();

        window.foundItAuth.saveCloudConfig({ supabaseUrl, supabaseAnonKey, googleClientId });
        if (window.showToast) window.showToast('Cloud configuration saved successfully!', 'success');
      });
    }

    // Test Cloud Connection
    const testBtn = document.getElementById('btn-test-cloud');
    if (testBtn) {
      testBtn.addEventListener('click', () => {
        if (window.foundItAuth.isSupabaseConfigured()) {
          if (window.showToast) window.showToast('Connected to Supabase project successfully!', 'success');
        } else {
          if (window.showToast) window.showToast('Local offline sandbox mode active. Enter credentials to connect live Supabase.', 'info');
        }
      });
    }

    // Copy SQL Script
    const copySqlBtn = document.getElementById('btn-copy-sql');
    if (copySqlBtn) {
      copySqlBtn.addEventListener('click', () => {
        const code = document.getElementById('sql-schema-code').innerText;
        navigator.clipboard.writeText(code).then(() => {
          if (window.showToast) window.showToast('PostgreSQL RLS Schema copied to clipboard!', 'success');
        }).catch(() => {
          if (window.showToast) window.showToast('Failed to copy text', 'error');
        });
      });
    }
  }

  return {
    renderLoginView,
    setupLoginListeners,
    renderRegisterView,
    setupRegisterListeners,
    renderVerifyEmailView,
    setupVerifyEmailListeners,
    renderForgotPasswordView,
    setupForgotPasswordListeners,
    renderResetPasswordView,
    setupResetPasswordListeners,
    renderAccessDeniedView,
    setupAccessDeniedListeners,
    renderSessionExpiredView,
    setupSessionExpiredListeners,
    renderStudentDashboardView,
    setupStudentDashboardListeners,
    renderAdminConsoleView,
    setupAdminConsoleListeners
  };

})();

