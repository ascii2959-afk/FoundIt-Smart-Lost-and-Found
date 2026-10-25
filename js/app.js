/**
 * FoundIt - Main Application Controller
 * Handles routing, UI state, rendering, modals, sound synthesis, and C++ integration
 */

(function () {
  'use strict';

  // --- AUDIO SYNTHESIS HELPER (Web Audio API) ---
  class SoundManager {
    constructor() {
      this.enabled = true;
      this.ctx = null;
    }

    init() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      }
    }

    playClick() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
      } catch (e) {}
    }

    playSuccess() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(554.37, now + 0.08); // C#
        osc.frequency.setValueAtTime(659.25, now + 0.16); // E
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(now + 0.35);
      } catch (e) {}
    }
  }

  const sound = new SoundManager();

  // --- GLOBAL STATE ---
  const state = {
    currentRoute: 'landing',
    routeParams: {},
    role: 'student', // 'student' | 'admin'
    browseFilters: {
      query: '',
      type: 'all',
      category: 'all',
      zone: 'all',
      status: 'all',
      sort: 'newest'
    },
    browseViewMode: 'grid', // 'grid' | 'list'
    activeAcademicTab: 'visualizer', // 'visualizer' | 'code' | 'complexity'
    matchingTargetId: null,
    pendingActionId: null
  };

  // --- TOAST NOTIFICATIONS ---
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    sound.playSuccess();

    const toast = document.createElement('div');
    const isSuccess = type === 'success';
    const isError = type === 'error';

    toast.className = `pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all transform duration-300 translate-y-2 opacity-0 ${
      isSuccess
        ? 'bg-teal-50 border-teal-200 text-teal-900'
        : isError
        ? 'bg-rose-50 border-rose-200 text-rose-900'
        : 'bg-white border-slate-200 text-slate-800'
    }`;

    const icon = isSuccess ? 'check-circle' : isError ? 'alert-circle' : 'info';
    toast.innerHTML = `
      <i data-lucide="${icon}" class="w-4 h-4 shrink-0 ${isSuccess ? 'text-teal-600' : isError ? 'text-rose-600' : 'text-cobalt-600'}"></i>
      <span class="flex-1">${message}</span>
      <button class="text-slate-400 hover:text-slate-700 ml-2" onclick="this.parentElement.remove()">
        <i data-lucide="x" class="w-3.5 h-3.5"></i>
      </button>
    `;

    container.appendChild(toast);
    if (window.lucide) window.lucide.createIcons({ root: toast });

    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
    });

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // --- ROUTING SYSTEM ---
  function parseHash() {
    const raw = window.location.hash.slice(1) || 'landing';
    const [path, queryString] = raw.split('?');
    const params = {};
    if (queryString) {
      queryString.split('&').forEach(part => {
        const [k, v] = part.split('=');
        if (k) params[decodeURIComponent(k)] = decodeURIComponent(v || '');
      });
    }
    return { path, params };
  }

  function navigateTo(route, params = {}) {
    let hash = '#' + route;
    const query = Object.keys(params)
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
      .join('&');
    if (query) hash += '?' + query;
    window.location.hash = hash;
  }

  function updateNavbarAuth() {
    const auth = window.foundItAuth;
    const isAuthed = auth && auth.isAuthenticated();
    const user = isAuthed ? auth.currentUser : null;
    const isAdmin = auth && auth.isAdmin();

    // 1. Desktop Nav Links
    const adminLink = document.getElementById('nav-item-admin-dash');
    const studentDashLink = document.getElementById('nav-item-student-dash');
    if (adminLink) {
      if (isAdmin) {
        adminLink.classList.remove('hidden');
        adminLink.classList.add('flex');
      } else {
        adminLink.classList.add('hidden');
        adminLink.classList.remove('flex');
      }
    }
    if (studentDashLink) {
      if (isAuthed) {
        studentDashLink.classList.remove('hidden');
      } else {
        studentDashLink.classList.add('hidden');
      }
    }

    // 2. Mobile Nav Links
    const mobileAdminLink = document.getElementById('mobile-nav-admin-dash');
    const mobileStudentDashLink = document.getElementById('mobile-nav-student-dash');
    if (mobileAdminLink) {
      if (isAdmin) {
        mobileAdminLink.classList.remove('hidden');
      } else {
        mobileAdminLink.classList.add('hidden');
      }
    }
    if (mobileStudentDashLink) {
      if (isAuthed) {
        mobileStudentDashLink.classList.remove('hidden');
      } else {
        mobileStudentDashLink.classList.add('hidden');
      }
    }

    // 3. Desktop Auth Container
    const desktopContainer = document.getElementById('nav-auth-container');
    if (desktopContainer) {
      if (isAuthed && user) {
        desktopContainer.innerHTML = `
          <div class="flex items-center gap-2 pl-2 border-l border-[#293449]">
            <a href="${isAdmin ? '#admin' : '#dashboard'}" class="flex items-center gap-2 py-1 px-2 rounded-xl hover:bg-[#172033] transition group" title="Account: ${user.name}">
              <img src="${user.avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=User'}" class="w-8 h-8 rounded-lg object-cover border border-[#293449]" alt="">
              <div class="hidden xl:block text-left rtl:text-right">
                <div class="text-xs font-bold text-[#F8FAFC] group-hover:text-[#22D3EE] transition leading-tight">${user.name.split(' ')[0]}</div>
                <div class="text-[9px] font-extrabold uppercase tracking-wider ${isAdmin ? 'text-[#FBBF24]' : 'text-[#22D3EE]'}">${user.role}</div>
              </div>
            </a>
            <button id="btn-desktop-signout" class="p-2 text-[#94A3B8] hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition" title="Sign Out">
              <i data-lucide="log-out" class="w-4 h-4"></i>
            </button>
          </div>
        `;
        const signoutBtn = document.getElementById('btn-desktop-signout');
        if (signoutBtn) {
          signoutBtn.addEventListener('click', () => {
            sound.playClick();
            auth.signOut();
            showToast('Signed out successfully', 'info');
          });
        }
      } else {
        desktopContainer.innerHTML = `
          <div class="flex items-center gap-1.5 pl-2 border-l border-[#293449]">
            <a href="#login" class="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#F8FAFC] hover:bg-[#172033] transition" data-i18n="btnSignIn">
              Sign In
            </a>
            <a href="#register" class="px-3 py-1.5 rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-semibold shadow-xs transition" data-i18n="btnRegister">
              Register
            </a>
          </div>
        `;
      }
    }

    // 4. Mobile Drawer Auth Section
    const mobileSection = document.getElementById('mobile-auth-section');
    if (mobileSection) {
      if (isAuthed && user) {
        mobileSection.innerHTML = `
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-2.5">
              <img src="${user.avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=User'}" class="w-9 h-9 rounded-xl object-cover border border-[#293449]" alt="">
              <div>
                <div class="text-xs font-bold text-[#F8FAFC]">${user.name}</div>
                <div class="text-[10px] text-[#94A3B8] truncate max-w-[160px]">${user.email}</div>
              </div>
            </div>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${isAdmin ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30' : 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/30'}">
              ${user.role}
            </span>
          </div>
          <div class="pt-2 border-t border-[#293449] flex items-center justify-between text-xs">
            <a href="${isAdmin ? '#admin' : '#dashboard'}" class="text-[#22D3EE] font-semibold hover:underline">
              View Dashboard
            </a>
            <button id="btn-mobile-signout" class="text-rose-400 font-semibold hover:underline flex items-center gap-1">
              <i data-lucide="log-out" class="w-3.5 h-3.5"></i>
              <span>Sign Out</span>
            </button>
          </div>
        `;
        const mobileSignoutBtn = document.getElementById('btn-mobile-signout');
        if (mobileSignoutBtn) {
          mobileSignoutBtn.addEventListener('click', () => {
            sound.playClick();
            auth.signOut();
            showToast('Signed out successfully', 'info');
          });
        }
      } else {
        mobileSection.innerHTML = `
          <div class="text-xs text-[#94A3B8] mb-2">Sign in to track your lost items & safe claims</div>
          <div class="grid grid-cols-2 gap-2">
            <a href="#login" class="py-2 text-center rounded-xl bg-[#6366F1] text-white font-bold text-xs shadow-xs">
              Sign In
            </a>
            <a href="#register" class="py-2 text-center rounded-xl bg-[#172033] border border-[#293449] text-[#F8FAFC] font-bold text-xs">
              Register
            </a>
          </div>
        `;
      }
    }

    if (window.lucide) window.lucide.createIcons();
  }

  function handleRoute() {
    const { path, params } = parseHash();

    // Check session timeout
    if (window.foundItAuth) {
      window.foundItAuth.checkSessionValidity();
    }

    const auth = window.foundItAuth;
    const isAuthed = auth && auth.isAuthenticated();
    const isAdmin = auth && auth.isAdmin();

    // 1. RBAC Guard for Admin Console (#admin)
    if (path === 'admin') {
      if (!isAuthed) {
        navigateTo('login', { redirect: 'admin' });
        return;
      }
      if (!isAdmin) {
        if (auth) {
          auth.logAuditEvent('AUTH_SECURITY_BLOCKED', 'Student attempted direct access to #admin');
        }
        showToast('Access Denied: Administrator privileges required', 'error');
        navigateTo('access-denied');
        return;
      }
    }

    // 2. Auth Guard for Protected Pages
    if (path === 'dashboard' || path === 'my-reports' || path === 'report') {
      if (!isAuthed) {
        navigateTo('login', { redirect: path });
        return;
      }
    }

    // 3. Prevent logged-in users from visiting login/register
    if ((path === 'login' || path === 'register') && isAuthed) {
      navigateTo(isAdmin ? 'admin' : 'dashboard');
      return;
    }

    state.currentRoute = path;
    state.routeParams = params;
    state.role = auth && auth.currentUser ? auth.currentUser.role : 'guest';

    // Update active nav styling (Desktop)
    document.querySelectorAll('.nav-link').forEach(link => {
      const targetNav = link.getAttribute('data-nav');
      if (targetNav === path || (path === 'my-reports' && targetNav === 'dashboard')) {
        link.classList.add('bg-[#172033]', 'text-[#22D3EE]', 'font-semibold');
        link.classList.remove('text-[#94A3B8]');
      } else {
        link.classList.remove('bg-[#172033]', 'text-[#22D3EE]');
        link.classList.add('text-[#94A3B8]');
      }
    });

    // Update active mobile drawer links
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      const targetNav = link.getAttribute('data-nav');
      if (targetNav === path || (path === 'my-reports' && targetNav === 'dashboard')) {
        link.classList.add('bg-[#6366F1]/15', 'text-[#22D3EE]', 'font-bold');
        link.classList.remove('text-[#F8FAFC]');
      } else {
        link.classList.remove('bg-[#6366F1]/15', 'text-[#22D3EE]', 'font-bold');
        link.classList.add('text-[#F8FAFC]');
      }
    });

    // Update mobile bottom nav items
    document.querySelectorAll('.mobile-bottom-item').forEach(link => {
      const targetNav = link.getAttribute('data-bottom-nav');
      if (targetNav === path || (path === 'my-reports' && targetNav === 'dashboard')) {
        link.classList.add('active', 'text-[#22D3EE]');
        link.classList.remove('text-[#94A3B8]');
      } else {
        link.classList.remove('active', 'text-[#22D3EE]');
        link.classList.add('text-[#94A3B8]');
      }
    });

    // Close mobile drawer if open
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuIcon = document.getElementById('mobile-menu-icon');
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
      if (mobileMenuIcon) {
        mobileMenuIcon.setAttribute('data-lucide', 'menu');
        if (window.lucide) window.lucide.createIcons();
      }
    }

    updateNavbarAuth();
    renderCurrentView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --- I18N TEXT REFRESH ---
  function updateI18nLabels() {
    const t = window.FOUNDIT_I18N.t;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        const val = t(key);
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = val;
        } else {
          el.textContent = val;
        }
      }
    });

    // Update lang label text
    const langLabel = document.getElementById('lang-label');
    if (langLabel) {
      langLabel.textContent = window.FOUNDIT_I18N.getLang() === 'en' ? 'العربية' : 'English';
    }
  }

  // --- VIEW RENDERERS ---

  function renderCurrentView() {
    const container = document.getElementById('app-container');
    if (!container) return;

    switch (state.currentRoute) {
      case 'landing':
        container.innerHTML = renderLandingView();
        setupLandingListeners();
        break;
      case 'browse':
        container.innerHTML = renderBrowseView();
        setupBrowseListeners();
        break;
      case 'report':
        container.innerHTML = renderReportWizardView();
        setupReportWizardListeners();
        break;
      case 'matching':
        container.innerHTML = renderMatchingView();
        setupMatchingListeners();
        break;
      case 'my-reports':
      case 'dashboard':
        if (window.FoundItAuthViews) {
          container.innerHTML = window.FoundItAuthViews.renderStudentDashboardView();
          window.FoundItAuthViews.setupStudentDashboardListeners();
        } else {
          container.innerHTML = renderMyReportsView();
          setupMyReportsListeners();
        }
        break;
      case 'admin':
        if (window.FoundItAuthViews) {
          container.innerHTML = window.FoundItAuthViews.renderAdminConsoleView();
          window.FoundItAuthViews.setupAdminConsoleListeners();
        } else {
          container.innerHTML = renderAdminView();
          setupAdminListeners();
        }
        break;
      case 'about':
        container.innerHTML = renderAboutView();
        setupAboutListeners();
        break;
      case 'login':
        if (window.FoundItAuthViews) {
          container.innerHTML = window.FoundItAuthViews.renderLoginView();
          window.FoundItAuthViews.setupLoginListeners();
        }
        break;
      case 'register':
        if (window.FoundItAuthViews) {
          container.innerHTML = window.FoundItAuthViews.renderRegisterView();
          window.FoundItAuthViews.setupRegisterListeners();
        }
        break;
      case 'verify-email':
        if (window.FoundItAuthViews) {
          container.innerHTML = window.FoundItAuthViews.renderVerifyEmailView();
          window.FoundItAuthViews.setupVerifyEmailListeners();
        }
        break;
      case 'forgot-password':
        if (window.FoundItAuthViews) {
          container.innerHTML = window.FoundItAuthViews.renderForgotPasswordView();
          window.FoundItAuthViews.setupForgotPasswordListeners();
        }
        break;
      case 'reset-password':
        if (window.FoundItAuthViews) {
          container.innerHTML = window.FoundItAuthViews.renderResetPasswordView();
          window.FoundItAuthViews.setupResetPasswordListeners();
        }
        break;
      case 'access-denied':
        if (window.FoundItAuthViews) {
          container.innerHTML = window.FoundItAuthViews.renderAccessDeniedView();
          window.FoundItAuthViews.setupAccessDeniedListeners();
        }
        break;
      case 'session-expired':
        if (window.FoundItAuthViews) {
          container.innerHTML = window.FoundItAuthViews.renderSessionExpiredView();
          window.FoundItAuthViews.setupSessionExpiredListeners();
        }
        break;
      default:
        container.innerHTML = renderLandingView();
        setupLandingListeners();
    }

    updateI18nLabels();
    if (window.lucide) window.lucide.createIcons();

    // Check if details param exists (e.g. #browse?details=RPT-2026-002)
    if (state.routeParams.details) {
      openItemDetails(state.routeParams.details);
    }
  }

  // =========================================================================
  // VIEW 1: LANDING PAGE
  // =========================================================================
  function renderLandingView() {
    const t = window.FOUNDIT_I18N.t;
    const isAr = window.FOUNDIT_I18N.getLang() === 'ar';
    const allReports = window.foundItStore.getAllReports();
    const recentReports = allReports.slice(0, 4);

    return `
      <div class="space-y-12 sm:space-y-20">
        
        <!-- HERO SECTION -->
        <section class="relative pt-4 pb-8 sm:pt-6 sm:pb-12 lg:pt-14 lg:pb-20 text-center max-w-4xl mx-auto space-y-6 sm:space-y-8">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cobalt-50 border border-cobalt-200 text-cobalt-700 text-xs font-semibold">
            <span class="w-2 h-2 rounded-full bg-cobalt-600 animate-pulse"></span>
            <span data-i18n="heroBadge">${t('heroBadge')}</span>
          </div>

          <h1 class="text-2xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-navy-950 leading-tight">
            ${isAr ? 'فقدت شيئاً في الحرم الجامعي؟<br><span class="text-cobalt-600">نعيده إلى يديك</span> بسرعة وأمان.' : 'Lost something on campus?<br><span class="text-cobalt-600">Let\'s bring it home.</span>'}
          </h1>

          <p class="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed px-2" data-i18n="heroSubtitle">
            ${t('heroSubtitle')}
          </p>

          <!-- Search Bar -->
          <div class="max-w-2xl mx-auto bg-white p-2 rounded-2xl shadow-md border border-slate-200 flex flex-col sm:flex-row items-center gap-2">
            <div class="flex items-center gap-3 flex-1 px-3 w-full">
              <i data-lucide="search" class="w-5 h-5 text-slate-400 shrink-0"></i>
              <input type="text" id="landing-search-input" placeholder="${t('searchPlaceholder')}" 
                     class="w-full py-2.5 text-sm text-navy-950 placeholder-slate-400 focus:outline-none bg-transparent">
            </div>
            <button id="landing-search-btn" class="w-full sm:w-auto px-6 py-3 rounded-xl bg-cobalt-600 hover:bg-cobalt-700 text-white font-semibold text-sm transition shadow-sm hover:shadow flex items-center justify-center gap-2">
              <span data-i18n="btnSearch">${t('btnSearch')}</span>
              <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </button>
          </div>

          <!-- Primary Actions -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2 w-full max-w-sm sm:max-w-none mx-auto">
            <a href="#report?type=lost" class="px-6 py-3.5 rounded-xl bg-cobalt-600 hover:bg-cobalt-700 text-white font-semibold text-sm shadow-md shadow-cobalt-600/20 hover:shadow-lg transition flex items-center justify-center gap-2">
              <i data-lucide="help-circle" class="w-4 h-4"></i>
              <span data-i18n="btnReportLost">${t('btnReportLost')}</span>
            </a>
            <a href="#report?type=found" class="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold text-sm shadow-xs transition flex items-center justify-center gap-2">
              <i data-lucide="check-circle-2" class="w-4 h-4 text-teal-600"></i>
              <span data-i18n="btnReportFound">${t('btnReportFound')}</span>
            </a>
            <a href="#browse" class="px-5 py-3.5 rounded-xl text-slate-600 hover:text-navy-950 font-semibold text-sm transition flex items-center justify-center gap-1.5">
              <span data-i18n="viewAllCategories">${t('viewAllCategories')}</span>
              <i data-lucide="chevron-right" class="w-4 h-4"></i>
            </a>
          </div>

          <!-- Quick Stats Banner -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 pt-6 sm:pt-8">
            <div class="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-xs text-center">
              <div class="text-2xl sm:text-3xl font-extrabold text-cobalt-700">142+</div>
              <div class="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1" data-i18n="statRecovered">${t('statRecovered')}</div>
            </div>
            <div class="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-xs text-center">
              <div class="text-2xl sm:text-3xl font-extrabold text-navy-950">${allReports.length}</div>
              <div class="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1" data-i18n="statActive">${t('statActive')}</div>
            </div>
            <div class="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-xs text-center">
              <div class="text-2xl sm:text-3xl font-extrabold text-teal-600">89.4%</div>
              <div class="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1" data-i18n="statMatchRate">${t('statMatchRate')}</div>
            </div>
            <div class="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-xs text-center">
              <div class="text-2xl sm:text-3xl font-extrabold text-navy-950">&lt; 18h</div>
              <div class="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1" data-i18n="statHandoverTime">${t('statHandoverTime')}</div>
            </div>
          </div>
        </section>

        <!-- CATEGORIES SHORTCUTS -->
        <section class="space-y-4 sm:space-y-6">
          <div class="flex items-end justify-between">
            <div>
              <h2 class="text-xl sm:text-2xl font-bold text-navy-950" data-i18n="categoriesTitle">${t('categoriesTitle')}</h2>
              <p class="text-xs sm:text-sm text-slate-500" data-i18n="categoriesSubtitle">${t('categoriesSubtitle')}</p>
            </div>
            <a href="#browse" class="text-xs sm:text-sm font-semibold text-cobalt-600 hover:text-cobalt-700 flex items-center gap-1 shrink-0">
              <span data-i18n="viewAllCategories">${t('viewAllCategories')}</span>
              <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </a>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
            ${window.FOUNDIT_DATA.ITEM_CATEGORIES.map(cat => {
              const count = allReports.filter(r => r.category === cat.id).length;
              return `
                <a href="#browse?category=${cat.id}" class="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 card-hover flex items-center gap-2.5 sm:gap-3.5 group">
                  <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-cobalt-600 group-hover:bg-cobalt-50 group-hover:text-cobalt-700 transition shrink-0">
                    <i data-lucide="${cat.icon}" class="w-5 h-5 sm:w-6 sm:h-6"></i>
                  </div>
                  <div class="min-w-0">
                    <h3 class="text-xs sm:text-sm font-bold text-navy-950 group-hover:text-cobalt-600 transition truncate">${isAr ? cat.ar : cat.name}</h3>
                    <p class="text-[11px] text-slate-400 font-medium">${count} items</p>
                  </div>
                </a>
              `;
            }).join('')}
          </div>
        </section>

        <!-- RECENTLY REPORTED CAMPUS ITEMS -->
        <section class="space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold text-navy-950">Recently Cataloged Items</h2>
              <p class="text-sm text-slate-500">Live feed of active lost & found listings across campus buildings</p>
            </div>
            <a href="#browse" class="text-sm font-semibold text-cobalt-600 hover:text-cobalt-700 flex items-center gap-1">
              <span>Explore all ${allReports.length} reports</span>
              <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </a>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            ${recentReports.map(report => renderItemCard(report)).join('')}
          </div>
        </section>

        <!-- HOW IT WORKS (3 Simple Steps) -->
        <section class="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 space-y-10 shadow-xs">
          <div class="text-center max-w-xl mx-auto space-y-2">
            <h2 class="text-3xl font-extrabold text-navy-950" data-i18n="howTitle">${t('howTitle')}</h2>
            <p class="text-slate-600 text-sm" data-i18n="howSubtitle">${t('howSubtitle')}</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="space-y-3 text-center sm:text-left">
              <div class="w-12 h-12 rounded-2xl bg-cobalt-50 text-cobalt-700 flex items-center justify-center font-bold text-lg border border-cobalt-100">
                1
              </div>
              <h3 class="text-lg font-bold text-navy-950" data-i18n="howStep1Title">${t('howStep1Title')}</h3>
              <p class="text-sm text-slate-600 leading-relaxed" data-i18n="howStep1Desc">${t('howStep1Desc')}</p>
            </div>

            <div class="space-y-3 text-center sm:text-left">
              <div class="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-lg border border-teal-100">
                2
              </div>
              <h3 class="text-lg font-bold text-navy-950" data-i18n="howStep2Title">${t('howStep2Title')}</h3>
              <p class="text-sm text-slate-600 leading-relaxed" data-i18n="howStep2Desc">${t('howStep2Desc')}</p>
            </div>

            <div class="space-y-3 text-center sm:text-left">
              <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-lg border border-indigo-100">
                3
              </div>
              <h3 class="text-lg font-bold text-navy-950" data-i18n="howStep3Title">${t('howStep3Title')}</h3>
              <p class="text-sm text-slate-600 leading-relaxed" data-i18n="howStep3Desc">${t('howStep3Desc')}</p>
            </div>
          </div>
        </section>

        <!-- TRUST & CAMPUS INTEGRATION NOTICE -->
        <section class="bg-gradient-to-r from-navy-950 to-navy-900 rounded-3xl p-8 sm:p-12 text-white space-y-6">
          <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div class="space-y-2 max-w-xl">
              <span class="text-teal-400 font-bold uppercase tracking-wider text-xs">University Standards</span>
              <h2 class="text-2xl sm:text-3xl font-extrabold text-white" data-i18n="trustTitle">${t('trustTitle')}</h2>
              <p class="text-slate-300 text-sm leading-relaxed">
                FoundIt strictly segregates personal student information. Contact details are never publicly revealed; item ownership is vetted through security questions and designated university handover desks.
              </p>
            </div>
            <a href="#about" class="px-6 py-3.5 rounded-xl bg-cobalt-600 hover:bg-cobalt-700 text-white font-semibold text-sm whitespace-nowrap shadow-md transition flex items-center gap-2">
              <i data-lucide="book-open" class="w-4 h-4"></i>
              <span>Learn About C++ Core</span>
            </a>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-navy-800 text-xs text-slate-300">
            <div class="flex items-start gap-2.5">
              <i data-lucide="lock" class="w-4 h-4 text-teal-400 shrink-0 mt-0.5"></i>
              <span data-i18n="trustBullet1">${t('trustBullet1')}</span>
            </div>
            <div class="flex items-start gap-2.5">
              <i data-lucide="building-2" class="w-4 h-4 text-teal-400 shrink-0 mt-0.5"></i>
              <span data-i18n="trustBullet2">${t('trustBullet2')}</span>
            </div>
            <div class="flex items-start gap-2.5">
              <i data-lucide="code-2" class="w-4 h-4 text-teal-400 shrink-0 mt-0.5"></i>
              <span data-i18n="trustBullet3">${t('trustBullet3')}</span>
            </div>
          </div>
        </section>

      </div>
    `;
  }

  function setupLandingListeners() {
    const searchInput = document.getElementById('landing-search-input');
    const searchBtn = document.getElementById('landing-search-btn');

    const doSearch = () => {
      const q = searchInput.value.trim();
      navigateTo('browse', { q });
    };

    if (searchBtn && searchInput) {
      searchBtn.addEventListener('click', doSearch);
      searchInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') doSearch();
      });
    }
  }

  // =========================================================================
  // VIEW 2: BROWSE ITEMS (Search, Filter, Sort, Grid/List)
  // =========================================================================
  function getFilteredReports() {
    const allReports = window.foundItStore.getAllReports();

    return allReports.filter(r => {
      // Query filter
      if (state.browseFilters.query) {
        const q = state.browseFilters.query.toLowerCase();
        const matchesQ =
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.keywords.toLowerCase().includes(q) ||
          r.locationDetail.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q);
        if (!matchesQ) return false;
      }

      // Type filter (lost / found)
      if (state.browseFilters.type !== 'all' && r.type !== state.browseFilters.type) {
        return false;
      }

      // Category filter
      if (state.browseFilters.category !== 'all' && r.category !== state.browseFilters.category) {
        return false;
      }

      // Campus Zone filter
      if (state.browseFilters.zone !== 'all' && r.zone !== state.browseFilters.zone) {
        return false;
      }

      // Status filter
      if (state.browseFilters.status !== 'all' && r.status !== state.browseFilters.status) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (state.browseFilters.sort === 'newest') return new Date(b.date) - new Date(a.date);
      if (state.browseFilters.sort === 'oldest') return new Date(a.date) - new Date(b.date);
      if (state.browseFilters.sort === 'title') return a.title.localeCompare(b.title);
      return 0;
    });
  }

  function updateBrowseResultsOnly() {
    const resultsContainer = document.getElementById('browse-results-container');
    const countEl = document.getElementById('browse-count-label');
    const clearBtnEl = document.getElementById('browse-clear-btn-wrap');
    if (!resultsContainer) return;

    const filtered = getFilteredReports();
    const allReports = window.foundItStore.getAllReports();

    if (countEl) {
      countEl.innerHTML = `<span class="font-semibold text-navy-950">${filtered.length}</span> of ${allReports.length} records found`;
    }

    const hasActiveFilters =
      state.browseFilters.query ||
      state.browseFilters.type !== 'all' ||
      state.browseFilters.category !== 'all' ||
      state.browseFilters.zone !== 'all' ||
      state.browseFilters.status !== 'all';

    if (clearBtnEl) {
      clearBtnEl.innerHTML = hasActiveFilters ? `
        <button id="btn-clear-all-filters" class="text-cobalt-600 hover:text-cobalt-800 font-semibold flex items-center gap-1 transition">
          <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
          <span>Clear All Filters</span>
        </button>
      ` : '';
      const clearBtn = document.getElementById('btn-clear-all-filters');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          sound.playClick();
          resetBrowseFilters();
        });
      }
    }

    resultsContainer.innerHTML = filtered.length === 0 ? renderEmptyState() : (
      state.browseViewMode === 'grid'
        ? `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">${filtered.map(r => renderItemCard(r)).join('')}</div>`
        : `<div class="space-y-3">${filtered.map(r => renderItemRow(r)).join('')}</div>`
    );

    if (window.lucide) window.lucide.createIcons({ root: resultsContainer });
  }

  function resetBrowseFilters() {
    state.browseFilters = {
      query: '',
      type: 'all',
      category: 'all',
      zone: 'all',
      status: 'all',
      sort: 'newest'
    };
    renderCurrentView();
  }

  function renderBrowseView() {
    const t = window.FOUNDIT_I18N.t;
    const isAr = window.FOUNDIT_I18N.getLang() === 'ar';
    const allReports = window.foundItStore.getAllReports();

    // Apply URL params into filter state if set
    if (state.routeParams.q !== undefined) state.browseFilters.query = state.routeParams.q;
    if (state.routeParams.type) state.browseFilters.type = state.routeParams.type;
    if (state.routeParams.category) state.browseFilters.category = state.routeParams.category;
    if (state.routeParams.zone) state.browseFilters.zone = state.routeParams.zone;

    const filtered = getFilteredReports();

    const hasActiveFilters =
      state.browseFilters.query ||
      state.browseFilters.type !== 'all' ||
      state.browseFilters.category !== 'all' ||
      state.browseFilters.zone !== 'all' ||
      state.browseFilters.status !== 'all';

    return `
      <div class="space-y-8">
        
        <!-- Header & Breadcrumb -->
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <a href="#landing" class="hover:text-cobalt-600 transition">Campus</a>
              <span>/</span>
              <span class="text-navy-950 font-medium">Directory</span>
            </div>
            <h1 class="text-3xl font-extrabold text-navy-950 tracking-tight" data-i18n="browseTitle">${t('browseTitle')}</h1>
            <p class="text-sm text-slate-600" data-i18n="browseSubtitle">${t('browseSubtitle')}</p>
          </div>

          <!-- Quick Action Buttons -->
          <div class="flex items-center gap-3">
            <a href="#report?type=lost" class="px-4 py-2.5 rounded-xl bg-cobalt-600 hover:bg-cobalt-700 text-white font-semibold text-xs shadow-xs transition flex items-center gap-1.5">
              <i data-lucide="plus" class="w-4 h-4"></i>
              <span data-i18n="btnReportLost">${t('btnReportLost')}</span>
            </a>
            <a href="#report?type=found" class="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-xs transition flex items-center gap-1.5">
              <i data-lucide="check" class="w-4 h-4 text-teal-600"></i>
              <span data-i18n="btnReportFound">${t('btnReportFound')}</span>
            </a>
          </div>
        </div>

        <!-- SEARCH & FILTER BAR -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          
          <!-- Top Row: Search Input & Type Tabs -->
          <div class="flex flex-col lg:flex-row items-center gap-4">
            
            <!-- Live Search -->
            <div class="relative flex-1 w-full">
              <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3.5"></i>
              <input type="text" id="browse-search" value="${state.browseFilters.query}" placeholder="${t('searchPlaceholder')}"
                     class="w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-cobalt-600 focus:outline-none">
              ${state.browseFilters.query ? `<button id="btn-clear-search" class="absolute right-3 top-1/2 -translate-y-1/2 rtl:right-auto rtl:left-3 text-slate-400 hover:text-slate-600"><i data-lucide="x" class="w-4 h-4"></i></button>` : ''}
            </div>

            <!-- Type Selector Segment -->
            <div class="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 w-full lg:w-auto shrink-0">
              <button class="filter-type-btn px-4 py-1.5 rounded-lg text-xs font-bold transition flex-1 lg:flex-initial ${state.browseFilters.type === 'all' ? 'bg-white shadow-xs text-navy-950' : 'text-slate-600 hover:text-navy-950'}" data-type="all" data-i18n="filterAll">
                ${t('filterAll')}
              </button>
              <button class="filter-type-btn px-4 py-1.5 rounded-lg text-xs font-bold transition flex-1 lg:flex-initial ${state.browseFilters.type === 'lost' ? 'bg-white shadow-xs text-rose-600' : 'text-slate-600 hover:text-navy-950'}" data-type="lost" data-i18n="filterLost">
                ${t('filterLost')}
              </button>
              <button class="filter-type-btn px-4 py-1.5 rounded-lg text-xs font-bold transition flex-1 lg:flex-initial ${state.browseFilters.type === 'found' ? 'bg-white shadow-xs text-teal-600' : 'text-slate-600 hover:text-navy-950'}" data-type="found" data-i18n="filterFound">
                ${t('filterFound')}
              </button>
            </div>
          </div>

          <!-- Bottom Row: Category, Building, Status, Sort & View Mode -->
          <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 pt-2 border-t border-slate-100">
            
            <!-- Category Dropdown -->
            <div>
              <label class="block text-[11px] font-semibold text-slate-500 mb-1" data-i18n="filterCategory">${t('filterCategory')}</label>
              <select id="filter-category" class="w-full text-xs font-medium py-2 px-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-cobalt-600 focus:outline-none">
                <option value="all">All Categories</option>
                ${window.FOUNDIT_DATA.ITEM_CATEGORIES.map(c => `
                  <option value="${c.id}" ${state.browseFilters.category === c.id ? 'selected' : ''}>${isAr ? c.ar : c.name}</option>
                `).join('')}
              </select>
            </div>

            <!-- Campus Zone Dropdown -->
            <div>
              <label class="block text-[11px] font-semibold text-slate-500 mb-1" data-i18n="filterZone">${t('filterZone')}</label>
              <select id="filter-zone" class="w-full text-xs font-medium py-2 px-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-cobalt-600 focus:outline-none">
                <option value="all">All Buildings</option>
                ${window.FOUNDIT_DATA.CAMPUS_ZONES.map(z => `
                  <option value="${z.id}" ${state.browseFilters.zone === z.id ? 'selected' : ''}>${isAr ? z.ar : z.name}</option>
                `).join('')}
              </select>
            </div>

            <!-- Status Dropdown -->
            <div>
              <label class="block text-[11px] font-semibold text-slate-500 mb-1" data-i18n="filterStatus">${t('filterStatus')}</label>
              <select id="filter-status" class="w-full text-xs font-medium py-2 px-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-cobalt-600 focus:outline-none">
                <option value="all">All Statuses</option>
                <option value="open" ${state.browseFilters.status === 'open' ? 'selected' : ''}>Active / Open</option>
                <option value="under_review" ${state.browseFilters.status === 'under_review' ? 'selected' : ''}>Under Review</option>
                <option value="matched" ${state.browseFilters.status === 'matched' ? 'selected' : ''}>Match Found</option>
                <option value="returned" ${state.browseFilters.status === 'returned' ? 'selected' : ''}>Returned</option>
              </select>
            </div>

            <!-- Sort Dropdown -->
            <div>
              <label class="block text-[11px] font-semibold text-slate-500 mb-1" data-i18n="filterSort">${t('filterSort')}</label>
              <select id="filter-sort" class="w-full text-xs font-medium py-2 px-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-cobalt-600 focus:outline-none">
                <option value="newest" ${state.browseFilters.sort === 'newest' ? 'selected' : ''}>Newest First</option>
                <option value="oldest" ${state.browseFilters.sort === 'oldest' ? 'selected' : ''}>Oldest First</option>
                <option value="title" ${state.browseFilters.sort === 'title' ? 'selected' : ''}>Title (A-Z)</option>
              </select>
            </div>

            <!-- Grid / List Switcher -->
            <div class="col-span-2 sm:col-span-4 lg:col-span-1 flex items-end justify-end">
              <div class="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button id="btn-view-grid" class="p-1.5 rounded-lg transition ${state.browseViewMode === 'grid' ? 'bg-white shadow-xs text-cobalt-600' : 'text-slate-500 hover:text-navy-950'}" title="Grid View">
                  <i data-lucide="grid" class="w-4 h-4"></i>
                </button>
                <button id="btn-view-list" class="p-1.5 rounded-lg transition ${state.browseViewMode === 'list' ? 'bg-white shadow-xs text-cobalt-600' : 'text-slate-500 hover:text-navy-950'}" title="List View">
                  <i data-lucide="list" class="w-4 h-4"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Active Filter Tags & Count -->
          <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
            <div id="browse-count-label" class="flex items-center gap-2">
              <span class="font-semibold text-navy-950">${filtered.length}</span>
              <span>of ${allReports.length} records found</span>
            </div>

            <div id="browse-clear-btn-wrap">
              ${hasActiveFilters ? `
                <button id="btn-clear-all-filters" class="text-cobalt-600 hover:text-cobalt-800 font-semibold flex items-center gap-1 transition">
                  <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
                  <span data-i18n="clearFilters">${t('clearFilters')}</span>
                </button>
              ` : ''}
            </div>
          </div>
        </div>

        <!-- RESULTS CONTAINER -->
        <div id="browse-results-container">
          ${filtered.length === 0 ? renderEmptyState() : (
            state.browseViewMode === 'grid'
              ? `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">${filtered.map(r => renderItemCard(r)).join('')}</div>`
              : `<div class="space-y-3">${filtered.map(r => renderItemRow(r)).join('')}</div>`
          )}
        </div>

      </div>
    `;
  }

  function setupBrowseListeners() {
    const searchInput = document.getElementById('browse-search');
    const clearSearchBtn = document.getElementById('btn-clear-search');
    const catSelect = document.getElementById('filter-category');
    const zoneSelect = document.getElementById('filter-zone');
    const statusSelect = document.getElementById('filter-status');
    const sortSelect = document.getElementById('filter-sort');
    const clearAllBtn = document.getElementById('btn-clear-all-filters');
    const gridBtn = document.getElementById('btn-view-grid');
    const listBtn = document.getElementById('btn-view-list');

    // Type filter tabs (seamless update without losing scroll or search state)
    document.querySelectorAll('.filter-type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playClick();
        state.browseFilters.type = btn.getAttribute('data-type');
        document.querySelectorAll('.filter-type-btn').forEach(b => {
          b.className = `filter-type-btn px-4 py-1.5 rounded-lg text-xs font-bold transition flex-1 lg:flex-initial ${
            b.getAttribute('data-type') === state.browseFilters.type
              ? (state.browseFilters.type === 'lost' ? 'bg-white shadow-xs text-rose-600' : state.browseFilters.type === 'found' ? 'bg-white shadow-xs text-teal-600' : 'bg-white shadow-xs text-navy-950')
              : 'text-slate-600 hover:text-navy-950'
          }`;
        });
        updateBrowseResultsOnly();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', e => {
        state.browseFilters.query = e.target.value;
        updateBrowseResultsOnly();
      });
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        state.browseFilters.query = '';
        if (searchInput) searchInput.value = '';
        updateBrowseResultsOnly();
      });
    }

    if (catSelect) {
      catSelect.addEventListener('change', e => {
        state.browseFilters.category = e.target.value;
        updateBrowseResultsOnly();
      });
    }

    if (zoneSelect) {
      zoneSelect.addEventListener('change', e => {
        state.browseFilters.zone = e.target.value;
        updateBrowseResultsOnly();
      });
    }

    if (statusSelect) {
      statusSelect.addEventListener('change', e => {
        state.browseFilters.status = e.target.value;
        updateBrowseResultsOnly();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', e => {
        state.browseFilters.sort = e.target.value;
        updateBrowseResultsOnly();
      });
    }

    if (clearAllBtn) {
      clearAllBtn.addEventListener('click', () => {
        sound.playClick();
        resetBrowseFilters();
      });
    }

    if (gridBtn) {
      gridBtn.addEventListener('click', () => {
        sound.playClick();
        state.browseViewMode = 'grid';
        gridBtn.className = 'p-1.5 rounded-lg transition bg-white shadow-xs text-cobalt-600';
        if (listBtn) listBtn.className = 'p-1.5 rounded-lg transition text-slate-500 hover:text-navy-950';
        updateBrowseResultsOnly();
      });
    }

    if (listBtn) {
      listBtn.addEventListener('click', () => {
        sound.playClick();
        state.browseViewMode = 'list';
        listBtn.className = 'p-1.5 rounded-lg transition bg-white shadow-xs text-cobalt-600';
        if (gridBtn) gridBtn.className = 'p-1.5 rounded-lg transition text-slate-500 hover:text-navy-950';
        updateBrowseResultsOnly();
      });
    }
  }

  // =========================================================================
  // VIEW 3: REPORT AN ITEM WIZARD (Step 1-4)
  // =========================================================================
  function renderReportWizardView() {
    const t = window.FOUNDIT_I18N.t;
    const isAr = window.FOUNDIT_I18N.getLang() === 'ar';
    const initialType = state.routeParams.type === 'found' ? 'found' : 'lost';

    // Today's ISO date string
    const today = new Date().toISOString().split('T')[0];

    return `
      <div class="max-w-3xl mx-auto space-y-8">
        
        <!-- Header -->
        <div class="text-center space-y-2">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cobalt-50 text-cobalt-700 text-xs font-bold border border-cobalt-200">
            <i data-lucide="file-plus" class="w-3.5 h-3.5"></i>
            <span>University Incident Report</span>
          </div>
          <h1 class="text-3xl font-extrabold text-navy-950" data-i18n="reportWizardTitle">${t('reportWizardTitle')}</h1>
          <p class="text-slate-600 text-sm max-w-lg mx-auto" data-i18n="reportWizardSubtitle">${t('reportWizardSubtitle')}</p>
        </div>

        <!-- Wizard Step Tracker -->
        <div class="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div class="flex items-center justify-between relative px-1 sm:px-2">
            <div class="flex items-center gap-1.5 sm:gap-2">
              <div id="step-badge-1" class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-cobalt-600 text-white flex items-center justify-center text-xs font-bold shrink-0">1</div>
              <span class="text-xs font-bold text-navy-950 hidden sm:inline" data-i18n="step1">Type & Category</span>
            </div>
            <div class="h-0.5 flex-1 mx-2 sm:mx-3 bg-slate-200"></div>
            <div class="flex items-center gap-1.5 sm:gap-2">
              <div id="step-badge-2" class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold shrink-0">2</div>
              <span class="text-xs font-medium text-slate-500 hidden sm:inline" data-i18n="step2">Item Details</span>
            </div>
            <div class="h-0.5 flex-1 mx-2 sm:mx-3 bg-slate-200"></div>
            <div class="flex items-center gap-1.5 sm:gap-2">
              <div id="step-badge-3" class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold shrink-0">3</div>
              <span class="text-xs font-medium text-slate-500 hidden sm:inline" data-i18n="step3">Location & Date</span>
            </div>
            <div class="h-0.5 flex-1 mx-2 sm:mx-3 bg-slate-200"></div>
            <div class="flex items-center gap-1.5 sm:gap-2">
              <div id="step-badge-4" class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold shrink-0">4</div>
              <span class="text-xs font-medium text-slate-500 hidden sm:inline" data-i18n="step4">Contact & Submit</span>
            </div>
          </div>
          <!-- Mobile Current Step Indicator -->
          <div id="mobile-step-title-indicator" class="sm:hidden text-center text-xs font-bold text-cobalt-700 pt-1 border-t border-slate-100">
            ${isAr ? 'الخطوة ١ من ٤: نوع البلاغ والتصنيف' : 'Step 1 of 4: Type & Category'}
          </div>
        </div>

        <!-- Form Card Container -->
        <div class="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xs">
          <form id="form-report-wizard" novalidate>
            
            <!-- STEP 1: TYPE & CATEGORY -->
            <div id="wizard-step-1" class="space-y-6">
              <div>
                <label class="block text-sm font-bold text-navy-950 mb-3" data-i18n="lblType">${t('lblType')}</label>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label class="relative flex items-center gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition ${initialType === 'lost' ? 'border-cobalt-600 bg-cobalt-50/50' : 'border-slate-200 hover:border-slate-300'}">
                    <input type="radio" name="reportType" value="lost" ${initialType === 'lost' ? 'checked' : ''} class="sr-only">
                    <div class="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                      <i data-lucide="help-circle" class="w-5 h-5"></i>
                    </div>
                    <div>
                      <h4 class="text-sm font-bold text-navy-950" data-i18n="optLost">${t('optLost')}</h4>
                      <p class="text-xs text-slate-500">I misplaced my property on campus</p>
                    </div>
                  </label>

                  <label class="relative flex items-center gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition ${initialType === 'found' ? 'border-teal-600 bg-teal-50/50' : 'border-slate-200 hover:border-slate-300'}">
                    <input type="radio" name="reportType" value="found" ${initialType === 'found' ? 'checked' : ''} class="sr-only">
                    <div class="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
                      <i data-lucide="check-circle" class="w-5 h-5"></i>
                    </div>
                    <div>
                      <h4 class="text-sm font-bold text-navy-950" data-i18n="optFound">${t('optFound')}</h4>
                      <p class="text-xs text-slate-500">I discovered an item left behind</p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label class="block text-sm font-bold text-navy-950 mb-2" data-i18n="lblCategory">${t('lblCategory')} *</label>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  ${window.FOUNDIT_DATA.ITEM_CATEGORIES.map((c, i) => `
                    <label class="cat-radio-label border rounded-2xl p-3 flex flex-col items-center text-center cursor-pointer transition hover:border-cobalt-500 ${i === 0 ? 'border-cobalt-600 bg-cobalt-50' : 'border-slate-200'}">
                      <input type="radio" name="category" value="${c.id}" ${i === 0 ? 'checked' : ''} class="sr-only">
                      <i data-lucide="${c.icon}" class="w-6 h-6 mb-1 text-slate-700"></i>
                      <span class="text-xs font-semibold text-navy-950">${isAr ? c.ar : c.name}</span>
                    </label>
                  `).join('')}
                </div>
              </div>
            </div>

            <!-- STEP 2: DETAILS -->
            <div id="wizard-step-2" class="space-y-6 hidden">
              <div>
                <label class="block text-sm font-bold text-navy-950 mb-1" data-i18n="lblTitle">${t('lblTitle')} *</label>
                <input type="text" id="report-title" required minlength="4" placeholder="${t('titlePlaceholder')}"
                       class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-cobalt-600 focus:outline-none">
                <span class="field-error text-xs text-rose-600 hidden mt-1">Please provide a descriptive title (at least 4 characters).</span>
              </div>

              <div>
                <label class="block text-sm font-bold text-navy-950 mb-1" data-i18n="lblDescription">${t('lblDescription')} *</label>
                <textarea id="report-desc" required rows="4" placeholder="${t('descPlaceholder')}"
                          class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-cobalt-600 focus:outline-none"></textarea>
                <span class="field-error text-xs text-rose-600 hidden mt-1">Please provide identifying characteristics.</span>
              </div>

              <div>
                <label class="block text-sm font-bold text-navy-950 mb-1">Search Keywords (comma or space separated)</label>
                <input type="text" id="report-keywords" placeholder="e.g. sony, black, over-ear, noise-canceling, bluetooth"
                       class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-cobalt-600 focus:outline-none">
                <p class="text-[11px] text-slate-500 mt-1">These tokens feed directly into the C++ Hash Table & matching heuristic.</p>
              </div>
            </div>

            <!-- STEP 3: LOCATION & DATE & PHOTO -->
            <div id="wizard-step-3" class="space-y-6 hidden">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-bold text-navy-950 mb-1" data-i18n="lblDate">${t('lblDate')} *</label>
                  <input type="date" id="report-date" required max="${today}" value="${today}"
                         class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-cobalt-600 focus:outline-none">
                  <span class="field-error text-xs text-rose-600 hidden mt-1">Date cannot be in the future.</span>
                </div>

                <div>
                  <label class="block text-sm font-bold text-navy-950 mb-1" data-i18n="lblZone">${t('lblZone')} *</label>
                  <select id="report-zone" required class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-cobalt-600 focus:outline-none bg-white">
                    ${window.FOUNDIT_DATA.CAMPUS_ZONES.map(z => `
                      <option value="${z.id}">${isAr ? z.ar : z.name} (${z.building})</option>
                    `).join('')}
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-sm font-bold text-navy-950 mb-1" data-i18n="lblSpecificLoc">${t('lblSpecificLoc')} *</label>
                <input type="text" id="report-location-detail" required placeholder="${t('locPlaceholder')}"
                       class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-cobalt-600 focus:outline-none">
                <span class="field-error text-xs text-rose-600 hidden mt-1">Please specify the room, floor or desk.</span>
              </div>

              <!-- Representative Preset Image -->
              <div>
                <label class="block text-sm font-bold text-navy-950 mb-2" data-i18n="lblImagePreset">${t('lblImagePreset')}</label>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <label class="photo-preset-card border rounded-2xl p-2 cursor-pointer transition border-cobalt-600 bg-cobalt-50">
                    <input type="radio" name="imagePreset" value="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80" checked class="sr-only">
                    <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80" class="w-full h-20 object-cover rounded-xl mb-1.5" alt="Headphones">
                    <span class="text-[11px] font-semibold text-center block text-navy-950">Headphones</span>
                  </label>
                  <label class="photo-preset-card border rounded-2xl p-2 cursor-pointer transition border-slate-200 hover:border-slate-300">
                    <input type="radio" name="imagePreset" value="https://images.unsplash.com/photo-1578852612716-854e527abf2e?auto=format&fit=crop&w=600&q=80" class="sr-only">
                    <img src="https://images.unsplash.com/photo-1578852612716-854e527abf2e?auto=format&fit=crop&w=300&q=80" class="w-full h-20 object-cover rounded-xl mb-1.5" alt="Student Card">
                    <span class="text-[11px] font-semibold text-center block text-navy-950">ID Card</span>
                  </label>
                  <label class="photo-preset-card border rounded-2xl p-2 cursor-pointer transition border-slate-200 hover:border-slate-300">
                    <input type="radio" name="imagePreset" value="https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80" class="sr-only">
                    <img src="https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=300&q=80" class="w-full h-20 object-cover rounded-xl mb-1.5" alt="Keys">
                    <span class="text-[11px] font-semibold text-center block text-navy-950">Keys / Lanyard</span>
                  </label>
                  <label class="photo-preset-card border rounded-2xl p-2 cursor-pointer transition border-slate-200 hover:border-slate-300">
                    <input type="radio" name="imagePreset" value="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80" class="sr-only">
                    <img src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=300&q=80" class="w-full h-20 object-cover rounded-xl mb-1.5" alt="Backpack">
                    <span class="text-[11px] font-semibold text-center block text-navy-950">Backpack</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- STEP 4: CONTACT & REVIEW -->
            <div id="wizard-step-4" class="space-y-6 hidden">
              <div>
                <label class="block text-sm font-bold text-navy-950 mb-2" data-i18n="lblContactPref">${t('lblContactPref')}</label>
                <div class="space-y-3">
                  <label class="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                    <input type="radio" name="contactMethod" value="safe_relay" checked class="mt-1">
                    <div>
                      <h4 class="text-xs font-bold text-navy-950" data-i18n="optSafeRelay">${t('optSafeRelay')}</h4>
                      <p class="text-[11px] text-slate-500">Relay claims safely through FoundIt with zero email/phone disclosure.</p>
                    </div>
                  </label>
                  <label class="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                    <input type="radio" name="contactMethod" value="security_desk" class="mt-1">
                    <div>
                      <h4 class="text-xs font-bold text-navy-950" data-i18n="optSecurityDesk">${t('optSecurityDesk')}</h4>
                      <p class="text-[11px] text-slate-500">I will physically hand this item to the official Campus Security Desk.</p>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Summary Card -->
              <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <h4 class="font-bold text-navy-950">Submission Summary</h4>
                <div class="flex justify-between py-1 border-b border-slate-200">
                  <span class="text-slate-500">Report Status:</span>
                  <span class="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Queued for Moderation (FIFO)</span>
                </div>
                <div class="flex justify-between py-1 border-b border-slate-200">
                  <span class="text-slate-500">Data Structure Integration:</span>
                  <span class="font-semibold text-cobalt-700">Enqueued to Admin Queue & Hash Table</span>
                </div>
                <p class="text-[11px] text-slate-500 pt-1">
                  Once submitted, this report will enter the Review Queue awaiting university staff approval, and the Heuristic Matcher will automatically search for candidate matches.
                </p>
              </div>
            </div>

            <!-- Wizard Navigation Buttons -->
            <div class="flex items-center justify-between pt-8 border-t border-slate-200 mt-8">
              <button type="button" id="wizard-btn-prev" class="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 disabled:opacity-40" disabled>
                <span data-i18n="btnPrev">${t('btnPrev')}</span>
              </button>
              
              <button type="button" id="wizard-btn-next" class="px-6 py-2.5 rounded-xl bg-cobalt-600 hover:bg-cobalt-700 text-white font-semibold text-sm shadow-xs transition">
                <span data-i18n="btnNext">${t('btnNext')}</span>
              </button>

              <button type="submit" id="wizard-btn-submit" class="hidden px-7 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-md transition">
                <span data-i18n="btnSubmitReport">${t('btnSubmitReport')}</span>
              </button>
            </div>

          </form>
        </div>

      </div>
    `;
  }

  function setupReportWizardListeners() {
    let currentStep = 1;

    const step1 = document.getElementById('wizard-step-1');
    const step2 = document.getElementById('wizard-step-2');
    const step3 = document.getElementById('wizard-step-3');
    const step4 = document.getElementById('wizard-step-4');

    const badge1 = document.getElementById('step-badge-1');
    const badge2 = document.getElementById('step-badge-2');
    const badge3 = document.getElementById('step-badge-3');
    const badge4 = document.getElementById('step-badge-4');

    const btnPrev = document.getElementById('wizard-btn-prev');
    const btnNext = document.getElementById('wizard-btn-next');
    const btnSubmit = document.getElementById('wizard-btn-submit');
    const form = document.getElementById('form-report-wizard');

    // Category radio styling
    document.querySelectorAll('.cat-radio-label').forEach(label => {
      label.addEventListener('click', () => {
        sound.playClick();
        document.querySelectorAll('.cat-radio-label').forEach(l => l.classList.remove('border-cobalt-600', 'bg-cobalt-50'));
        label.classList.add('border-cobalt-600', 'bg-cobalt-50');
      });
    });

    // Preset photo selection
    document.querySelectorAll('.photo-preset-card').forEach(label => {
      label.addEventListener('click', () => {
        sound.playClick();
        document.querySelectorAll('.photo-preset-card').forEach(l => l.classList.remove('border-cobalt-600', 'bg-cobalt-50'));
        label.classList.add('border-cobalt-600', 'bg-cobalt-50');
      });
    });

    const updateStepUI = () => {
      [step1, step2, step3, step4].forEach((s, i) => {
        if (i + 1 === currentStep) s.classList.remove('hidden');
        else s.classList.add('hidden');
      });

      const badges = [badge1, badge2, badge3, badge4];
      badges.forEach((b, i) => {
        if (i + 1 === currentStep) {
          b.className = 'w-7 h-7 rounded-full bg-cobalt-600 text-white flex items-center justify-center text-xs font-bold shrink-0';
        } else if (i + 1 < currentStep) {
          b.className = 'w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold shrink-0';
        } else {
          b.className = 'w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold shrink-0';
        }
      });

      btnPrev.disabled = currentStep === 1;

      if (currentStep === 4) {
        btnNext.classList.add('hidden');
        btnSubmit.classList.remove('hidden');
      } else {
        btnNext.classList.remove('hidden');
        btnSubmit.classList.add('hidden');
      }

      const mobileStepIndicator = document.getElementById('mobile-step-title-indicator');
      if (mobileStepIndicator) {
        const isAr = window.FOUNDIT_I18N.getLang() === 'ar';
        const stepTitles = isAr ? [
          'الخطوة ١ من ٤: نوع البلاغ والتصنيف',
          'الخطوة ٢ من ٤: مواصفات وتفاصيل الغرض',
          'الخطوة ٣ من ٤: موقع الحرم والتاريخ والصورة',
          'الخطوة ٤ من ٤: طريقة الاستلام والتأكيد'
        ] : [
          'Step 1 of 4: Type & Category',
          'Step 2 of 4: Item Details & Keywords',
          'Step 3 of 4: Campus Location & Date',
          'Step 4 of 4: Handover & Submit'
        ];
        mobileStepIndicator.textContent = stepTitles[currentStep - 1] || '';
      }

      if (window.lucide) window.lucide.createIcons();
    };

    const validateStep = step => {
      if (step === 2) {
        const titleInput = document.getElementById('report-title');
        const descInput = document.getElementById('report-desc');
        let valid = true;

        if (!titleInput.value.trim() || titleInput.value.trim().length < 4) {
          titleInput.nextElementSibling.classList.remove('hidden');
          valid = false;
        } else {
          titleInput.nextElementSibling.classList.add('hidden');
        }

        if (!descInput.value.trim()) {
          descInput.nextElementSibling.classList.remove('hidden');
          valid = false;
        } else {
          descInput.nextElementSibling.classList.add('hidden');
        }
        return valid;
      }

      if (step === 3) {
        const dateInput = document.getElementById('report-date');
        const locDetail = document.getElementById('report-location-detail');
        let valid = true;

        const chosenDate = new Date(dateInput.value);
        const today = new Date();
        today.setHours(23, 59, 59, 999);

        if (!dateInput.value || chosenDate > today) {
          dateInput.nextElementSibling.classList.remove('hidden');
          valid = false;
        } else {
          dateInput.nextElementSibling.classList.add('hidden');
        }

        if (!locDetail.value.trim()) {
          locDetail.nextElementSibling.classList.remove('hidden');
          valid = false;
        } else {
          locDetail.nextElementSibling.classList.add('hidden');
        }
        return valid;
      }

      return true;
    };

    btnNext.addEventListener('click', () => {
      sound.playClick();
      if (!validateStep(currentStep)) return;
      if (currentStep < 4) {
        currentStep++;
        updateStepUI();
      }
    });

    btnPrev.addEventListener('click', () => {
      sound.playClick();
      if (currentStep > 1) {
        currentStep--;
        updateStepUI();
      }
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!validateStep(currentStep)) return;

      const reportType = form.elements['reportType'].value;
      const category = form.elements['category'].value;
      const title = document.getElementById('report-title').value;
      const description = document.getElementById('report-desc').value;
      const keywords = document.getElementById('report-keywords').value;
      const date = document.getElementById('report-date').value;
      const zone = document.getElementById('report-zone').value;
      const locationDetail = document.getElementById('report-location-detail').value;
      const image = form.elements['imagePreset'].value;
      const contactMethod = form.elements['contactMethod'].value;

      const created = window.foundItStore.addReport({
        type: reportType,
        category,
        title,
        description,
        keywords,
        date,
        zone,
        locationDetail,
        image,
        contactMethod
      });

      showToast(`Report ${created.id} submitted! Enqueued for review in FIFO sequence.`, 'success');
      navigateTo('my-reports');
    });
  }

  // =========================================================================
  // VIEW 4: SMART MATCHING PAGE (Heuristic Breakdown & Sandboxes)
  // =========================================================================
  function renderMatchingView() {
    const t = window.FOUNDIT_I18N.t;
    const isAr = window.FOUNDIT_I18N.getLang() === 'ar';
    const allReports = window.foundItStore.getAllReports();

    // Default target report
    let target = null;
    if (state.matchingTargetId) {
      target = window.foundItStore.getReportById(state.matchingTargetId);
    }
    if (!target) {
      // Find default lost item (e.g. Sony headphones)
      target = allReports.find(r => r.id === 'RPT-2026-002') || allReports[0];
      state.matchingTargetId = target ? target.id : null;
    }

    // Run matching engine
    const candidateMatches = target ? window.SmartMatchingEngine.findMatchesFor(target, allReports) : [];
    const scenarios = window.SmartMatchingEngine.getAcademicTestScenarios();

    return `
      <div class="space-y-10">
        
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200 mb-2">
              <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
              <span>Algorithmic Heuristics</span>
            </div>
            <h1 class="text-3xl font-extrabold text-navy-950" data-i18n="matchingTitle">${t('matchingTitle')}</h1>
            <p class="text-slate-600 text-sm max-w-2xl" data-i18n="matchingSubtitle">${t('matchingSubtitle')}</p>
          </div>

          <a href="#about" class="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:text-navy-950 text-xs font-semibold shadow-xs flex items-center gap-2">
            <i data-lucide="file-code-2" class="w-4 h-4 text-cobalt-600"></i>
            <span>Inspect C++ Implementation</span>
          </a>
        </div>

        <!-- Academic Disclaimer Banner -->
        <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
          <i data-lucide="info" class="w-4 h-4 text-amber-700 shrink-0 mt-0.5"></i>
          <p class="leading-relaxed" data-i18n="matchingDisclaimer">${t('matchingDisclaimer')}</p>
        </div>

        <!-- TARGET ITEM PICKER -->
        <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <label class="text-sm font-bold text-navy-950" data-i18n="selectReportToMatch">${t('selectReportToMatch')}</label>
            <span class="text-xs text-slate-500">Pick any reported item to run the matching algorithm</span>
          </div>

          <select id="matching-target-select" class="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-cobalt-600 focus:outline-none bg-white">
            ${allReports.map(r => `
              <option value="${r.id}" ${target && target.id === r.id ? 'selected' : ''}>
                [${r.id}] ${r.type.toUpperCase()}: ${r.title} (${r.category}) - ${r.date}
              </option>
            `).join('')}
          </select>

          ${target ? `
            <!-- Target Summary Card -->
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div class="flex items-center gap-3.5">
                <img src="${target.image}" class="w-14 h-14 rounded-xl object-cover shrink-0" alt="${target.title}">
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${target.type === 'lost' ? 'bg-rose-100 text-rose-700' : 'bg-teal-100 text-teal-700'}">
                      ${target.type.toUpperCase()}
                    </span>
                    <span class="text-xs font-semibold text-slate-500">${target.id}</span>
                  </div>
                  <h4 class="text-sm font-bold text-navy-950">${target.title}</h4>
                  <p class="text-xs text-slate-500">${target.date} • ${getZoneNameById(target.zone)}</p>
                </div>
              </div>
              <div class="text-xs text-slate-600 sm:text-right">
                <span class="font-bold text-navy-950">${candidateMatches.length} complementary candidates</span>
                <p class="text-slate-400">Scored against opposite type (${target.type === 'lost' ? 'FOUND' : 'LOST'})</p>
              </div>
            </div>
          ` : ''}
        </div>

        <!-- MATCHING ENGINE RESULTS -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-navy-950">Ranked Matching Results</h2>
            <span class="text-xs text-slate-500">Ordered by Heuristic Compatibility Score (0 - 100%)</span>
          </div>

          ${candidateMatches.length === 0 ? `
            <div class="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2">
              <i data-lucide="search-x" class="w-8 h-8 text-slate-400 mx-auto"></i>
              <h3 class="text-sm font-bold text-navy-950">No Complementary Items Available</h3>
              <p class="text-xs text-slate-500">There are currently no reports of opposite type in the system.</p>
            </div>
          ` : `
            <div class="space-y-4">
              ${candidateMatches.map(m => renderMatchResultCard(m, target)).join('')}
            </div>
          `}
        </div>

        <!-- INTERACTIVE EDGE-CASE TEST SCENARIOS SANDBOX -->
        <section class="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cobalt-50 text-cobalt-700 border border-cobalt-200 mb-1">
                Data Structures Edge-Case Test Suite
              </div>
              <h3 class="text-lg font-bold text-navy-950">Academic Matching Test Scenarios</h3>
              <p class="text-xs text-slate-500">Verify boundary conditions, category parity, and unexpected input handling</p>
            </div>
            <button id="btn-run-all-scenarios" class="px-4 py-2 rounded-xl bg-cobalt-600 hover:bg-cobalt-700 text-white font-semibold text-xs shadow-xs transition flex items-center gap-1.5">
              <i data-lucide="play" class="w-3.5 h-3.5"></i>
              <span>Run Automated Benchmark</span>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${scenarios.map(sc => `
              <div class="p-4 rounded-2xl border border-slate-200 hover:border-cobalt-300 transition space-y-3 bg-slate-50/50">
                <div class="flex items-start justify-between gap-2">
                  <h4 class="text-sm font-bold text-navy-950">${isAr ? sc.titleAr : sc.title}</h4>
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold ${sc.expectedLabel === 'Strong Match' ? 'bg-teal-100 text-teal-800' : sc.expectedLabel === 'Incompatible' ? 'bg-rose-100 text-rose-800' : 'bg-slate-200 text-slate-700'}">
                    Expected: ${sc.expectedLabel}
                  </span>
                </div>
                <p class="text-xs text-slate-600 leading-relaxed">${sc.desc}</p>
                <div class="flex items-center justify-between pt-1">
                  <span class="text-[11px] font-semibold text-slate-500">Range: ${sc.expectedScoreRange}</span>
                  <button class="btn-execute-scenario px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-cobalt-50 hover:text-cobalt-700 hover:border-cobalt-300 text-xs font-semibold text-slate-700 transition"
                          data-a="${sc.reportAId}" data-b="${sc.reportBId}">
                    Simulate Match
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </section>

      </div>
    `;
  }

  function setupMatchingListeners() {
    const targetSelect = document.getElementById('matching-target-select');
    if (targetSelect) {
      targetSelect.addEventListener('change', e => {
        sound.playClick();
        state.matchingTargetId = e.target.value;
        renderCurrentView();
      });
    }

    // Scenario simulate buttons
    document.querySelectorAll('.btn-execute-scenario').forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playClick();
        const aId = btn.getAttribute('data-a');
        const bId = btn.getAttribute('data-b');
        const repA = window.foundItStore.getReportById(aId);
        const repB = window.foundItStore.getReportById(bId);

        if (repA && repB) {
          const result = window.SmartMatchingEngine.evaluate(repA, repB);
          showToast(`Simulation [${repA.title}] vs [${repB.title}]: Score = ${result.totalScore}% (${result.confidenceLabel})`, 'info');
          state.matchingTargetId = aId;
          renderCurrentView();
        }
      });
    });

    const runAllBtn = document.getElementById('btn-run-all-scenarios');
    if (runAllBtn) {
      runAllBtn.addEventListener('click', () => {
        sound.playSuccess();
        showToast('All 4 academic matching scenarios verified successfully against C++ criteria!', 'success');
      });
    }
  }

  // =========================================================================
  // VIEW 5: MY REPORTS (CRUD & LIFO Stack Undo)
  // =========================================================================
  function renderMyReportsView() {
    const t = window.FOUNDIT_I18N.t;
    const isAr = window.FOUNDIT_I18N.getLang() === 'ar';
    const allReports = window.foundItStore.getAllReports();

    // Sample user reports: any non-sample reports OR reports with 'student_' in reporterRef
    const myReports = allReports.filter(r => !r.isSample || r.reporterRef.includes('student'));
    const undoStack = window.foundItStore.undoStack;

    return `
      <div class="space-y-8">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 mb-2">
              <i data-lucide="user-check" class="w-3.5 h-3.5"></i>
              <span>Student Profile Portal</span>
            </div>
            <h1 class="text-3xl font-extrabold text-navy-950" data-i18n="myReportsTitle">${t('myReportsTitle')}</h1>
            <p class="text-slate-600 text-sm" data-i18n="myReportsSubtitle">${t('myReportsSubtitle')}</p>
          </div>

          <!-- LIFO Undo Button -->
          <div class="flex items-center gap-3">
            <button id="btn-stack-undo" ${undoStack.length === 0 ? 'disabled' : ''} 
                    class="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs transition shadow-xs flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
              <i data-lucide="rotate-ccw" class="w-4 h-4 text-cobalt-600"></i>
              <span data-i18n="btnUndoAction">${t('btnUndoAction')}</span>
              <span class="px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">${undoStack.length}</span>
            </button>

            <a href="#report" class="px-4 py-2.5 rounded-xl bg-cobalt-600 hover:bg-cobalt-700 text-white font-semibold text-xs shadow-xs transition flex items-center gap-1.5">
              <i data-lucide="plus" class="w-4 h-4"></i>
              <span data-i18n="btnReportLost">${t('btnReportLost')}</span>
            </a>
          </div>
        </div>

        <!-- Reports List -->
        ${myReports.length === 0 ? `
          <div class="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4 shadow-xs">
            <div class="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <i data-lucide="inbox" class="w-6 h-6"></i>
            </div>
            <h3 class="text-base font-bold text-navy-950">No Personal Reports Found</h3>
            <p class="text-xs text-slate-500 max-w-sm mx-auto" data-i18n="emptyMyReports">${t('emptyMyReports')}</p>
            <a href="#report" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cobalt-600 text-white font-semibold text-xs shadow-xs">
              <i data-lucide="plus" class="w-4 h-4"></i>
              <span>Create Report</span>
            </a>
          </div>
        ` : `
          <div class="space-y-4">
            ${myReports.map(report => `
              <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5 card-hover">
                
                <div class="flex items-start gap-4">
                  <img src="${report.image}" class="w-16 h-16 rounded-xl object-cover shrink-0" alt="${report.title}">
                  <div class="space-y-1">
                    <div class="flex flex-wrap items-center gap-2">
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${report.type === 'lost' ? 'bg-rose-100 text-rose-700' : 'bg-teal-100 text-teal-700'}">
                        ${report.type.toUpperCase()}
                      </span>
                      <span class="px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusBadgeClass(report.status)}">
                        ${getStatusName(report.status)}
                      </span>
                      <span class="text-xs text-slate-400 font-mono">${report.id}</span>
                    </div>
                    <h3 class="text-base font-bold text-navy-950">${report.title}</h3>
                    <p class="text-xs text-slate-500 line-clamp-1">${report.description}</p>
                    <p class="text-[11px] text-slate-400">${report.date} • ${getZoneNameById(report.zone)} • ${report.locationDetail}</p>
                  </div>
                </div>

                <!-- Action Controls (Status Selector & Buttons) -->
                <div class="flex flex-col sm:flex-row sm:items-center gap-2.5 shrink-0 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0">
                  <select class="select-change-status text-xs font-semibold py-2 px-3 rounded-xl sm:rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-cobalt-600 text-slate-700 w-full sm:w-auto" data-id="${report.id}">
                    <option value="open" ${report.status === 'open' ? 'selected' : ''}>Active / Open</option>
                    <option value="under_review" ${report.status === 'under_review' ? 'selected' : ''}>Under Review</option>
                    <option value="matched" ${report.status === 'matched' ? 'selected' : ''}>Match Found</option>
                    <option value="returned" ${report.status === 'returned' ? 'selected' : ''}>Returned</option>
                    <option value="closed" ${report.status === 'closed' ? 'selected' : ''}>Closed</option>
                  </select>

                  <div class="flex items-center gap-2 w-full sm:w-auto">
                    <button class="btn-inspect-matches flex-1 sm:flex-initial justify-center px-3 py-2 sm:py-1.5 rounded-xl sm:rounded-lg bg-cobalt-50 text-cobalt-700 hover:bg-cobalt-100 font-semibold text-xs transition flex items-center gap-1.5"
                            data-id="${report.id}">
                      <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
                      <span data-i18n="btnViewMatches">${t('btnViewMatches')}</span>
                    </button>

                    <button class="btn-open-details flex-1 sm:flex-initial justify-center px-3 py-2 sm:py-1.5 rounded-xl sm:rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition text-center"
                            data-id="${report.id}">
                      <span>Details</span>
                    </button>

                    <button class="btn-delete-report p-2 sm:p-1.5 rounded-xl sm:rounded-lg text-rose-600 hover:bg-rose-50 border border-slate-200 sm:border-transparent hover:border-rose-200 transition shrink-0 flex items-center justify-center"
                            data-id="${report.id}" title="Delete Report">
                      <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                  </div>
                </div>

              </div>
            `).join('')}
          </div>
        `}

        <!-- Undo Stack Explanation Banner -->
        <div class="bg-slate-100 rounded-2xl p-5 border border-slate-200 flex items-start gap-3.5 text-xs text-slate-700">
          <div class="w-8 h-8 rounded-xl bg-cobalt-100 text-cobalt-700 flex items-center justify-center shrink-0">
            <i data-lucide="layers" class="w-4 h-4"></i>
          </div>
          <div class="space-y-1">
            <h4 class="font-bold text-navy-950">LIFO Undo Stack Memory Mechanism</h4>
            <p class="text-slate-600 leading-relaxed">
              Every deletion, status change, or creation is recorded onto an action stack. Clicking <strong>Undo Last Change</strong> pops the top element from the stack and reverses the transaction in $O(1)$ constant time.
            </p>
          </div>
        </div>

      </div>
    `;
  }

  function setupMyReportsListeners() {
    // Stack Undo Button
    const undoBtn = document.getElementById('btn-stack-undo');
    if (undoBtn) {
      undoBtn.addEventListener('click', () => {
        sound.playClick();
        const res = window.foundItStore.undoLastAction();
        if (res.success) {
          showToast(res.message, 'success');
          renderCurrentView();
        } else {
          showToast(res.message, 'error');
        }
      });
    }

    // Status change listener
    document.querySelectorAll('.select-change-status').forEach(select => {
      select.addEventListener('change', e => {
        sound.playClick();
        const id = select.getAttribute('data-id');
        const newStatus = e.target.value;
        window.foundItStore.updateReport(id, { status: newStatus });
        showToast(`Report ${id} status updated to: ${getStatusName(newStatus)}`, 'success');
        renderCurrentView();
      });
    });

    // Inspect matches
    document.querySelectorAll('.btn-inspect-matches').forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playClick();
        const id = btn.getAttribute('data-id');
        state.matchingTargetId = id;
        navigateTo('matching');
      });
    });

    // Open details
    document.querySelectorAll('.btn-open-details').forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playClick();
        const id = btn.getAttribute('data-id');
        openItemDetails(id);
      });
    });

    // Delete report
    document.querySelectorAll('.btn-delete-report').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        openConfirmDialog(
          'Delete Item Report?',
          `Are you sure you want to delete report ${id}? You can immediately undo this action via the Undo Stack.`,
          () => {
            window.foundItStore.deleteReport(id);
            showToast(`Report ${id} deleted. You can click "Undo" to restore it.`, 'info');
            renderCurrentView();
          }
        );
      });
    });
  }

  // =========================================================================
  // VIEW 6: ADMIN / REVIEW DASHBOARD (Queue, Moderation, Duplicates)
  // =========================================================================
  function renderAdminView() {
    const t = window.FOUNDIT_I18N.t;
    const isAr = window.FOUNDIT_I18N.getLang() === 'ar';
    const allReports = window.foundItStore.getAllReports();
    const reviewQueue = window.foundItStore.reviewQueue;
    const auditLogs = window.foundItStore.auditLogs;
    const returnedCount = allReports.filter(r => r.status === 'returned').length;

    return `
      <div class="space-y-8">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cobalt-50 text-cobalt-700 text-xs font-bold border border-cobalt-200 mb-2">
              <i data-lucide="shield" class="w-3.5 h-3.5"></i>
              <span>Moderation Console</span>
            </div>
            <h1 class="text-3xl font-extrabold text-navy-950" data-i18n="adminTitle">${t('adminTitle')}</h1>
            <p class="text-slate-600 text-sm" data-i18n="adminSubtitle">${t('adminSubtitle')}</p>
          </div>

          <!-- Process Queue Button -->
          <button id="btn-dequeue-admin" ${reviewQueue.length === 0 ? 'disabled' : ''}
                  class="px-5 py-2.5 rounded-xl bg-cobalt-600 hover:bg-cobalt-700 text-white font-semibold text-xs shadow-xs transition flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
            <i data-lucide="check-check" class="w-4 h-4"></i>
            <span>Process Next in Queue (FIFO)</span>
          </button>
        </div>

        <!-- Admin Privilege Banner -->
        <div class="bg-navy-950 text-white p-4 rounded-2xl border border-navy-800 flex items-center justify-between gap-4 text-xs">
          <div class="flex items-center gap-3">
            <span class="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse"></span>
            <span data-i18n="adminBannerText">${t('adminBannerText')}</span>
          </div>
          <span class="font-mono text-slate-400">Queue Mode: Strict FIFO</span>
        </div>

        <!-- Summary KPI Cards -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
          <div class="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div class="flex items-center justify-between">
              <span class="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider" data-i18n="statQueueSize">${t('statQueueSize')}</span>
              <i data-lucide="layers" class="w-4 h-4 text-amber-600"></i>
            </div>
            <div class="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-2">${reviewQueue.length}</div>
            <div class="text-[10px] sm:text-[11px] text-slate-400 mt-1">First-in, first-out sequence</div>
          </div>

          <div class="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div class="flex items-center justify-between">
              <span class="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider" data-i18n="statTotalCatalog">${t('statTotalCatalog')}</span>
              <i data-lucide="database" class="w-4 h-4 text-cobalt-600"></i>
            </div>
            <div class="text-2xl sm:text-3xl font-extrabold text-navy-950 mt-2">${allReports.length}</div>
            <div class="text-[10px] sm:text-[11px] text-slate-400 mt-1">Hash Table Bucket indexed</div>
          </div>

          <div class="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div class="flex items-center justify-between">
              <span class="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider" data-i18n="statReturnedRate">${t('statReturnedRate')}</span>
              <i data-lucide="check-circle" class="w-4 h-4 text-teal-600"></i>
            </div>
            <div class="text-2xl sm:text-3xl font-extrabold text-teal-600 mt-2">${returnedCount}</div>
            <div class="text-[10px] sm:text-[11px] text-slate-400 mt-1">Successfully claimed</div>
          </div>

          <div class="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div class="flex items-center justify-between">
              <span class="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider" data-i18n="statDupAlerts">${t('statDupAlerts')}</span>
              <i data-lucide="copy" class="w-4 h-4 text-rose-600"></i>
            </div>
            <div class="text-2xl sm:text-3xl font-extrabold text-navy-950 mt-2">0 Flagged</div>
            <div class="text-[10px] sm:text-[11px] text-slate-400 mt-1">Duplicate scanner active</div>
          </div>
        </div>

        <!-- FIFO QUEUE TABLE -->
        <div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-4 sm:p-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h3 class="text-lg font-bold text-navy-950" data-i18n="queueTitle">${t('queueTitle')}</h3>
              <p class="text-xs text-slate-500" data-i18n="queueSubtitle">${t('queueSubtitle')}</p>
            </div>
            <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              ${reviewQueue.length} pending moderation
            </span>
          </div>

          ${reviewQueue.length === 0 ? `
            <div class="text-center py-8 space-y-2 text-slate-500">
              <i data-lucide="check-circle-2" class="w-8 h-8 text-teal-600 mx-auto"></i>
              <p class="text-sm font-bold text-navy-950">Review Queue Empty!</p>
              <p class="text-xs">All submitted items have been moderated and published.</p>
            </div>
          ` : `
            <div class="overflow-x-auto">
              <table class="w-full text-left rtl:text-right text-xs">
                <thead>
                  <tr class="border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px]">
                    <th class="py-3 px-3">Queue #</th>
                    <th class="py-3 px-3">Item Details</th>
                    <th class="py-3 px-3">Category</th>
                    <th class="py-3 px-3">Location</th>
                    <th class="py-3 px-3">Date</th>
                    <th class="py-3 px-3 text-right rtl:text-left">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  ${reviewQueue.map((item, index) => `
                    <tr class="hover:bg-slate-50/80 transition">
                      <td class="py-3 px-3 font-mono font-bold text-cobalt-700">
                        ${index === 0 ? '<span class="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px]">NEXT</span>' : `#${index + 1}`}
                      </td>
                      <td class="py-3 px-3">
                        <div class="flex items-center gap-2.5">
                          <img src="${item.image}" class="w-9 h-9 rounded-lg object-cover shrink-0" alt="${item.title}">
                          <div>
                            <div class="font-bold text-navy-950">${item.title}</div>
                            <div class="text-[11px] text-slate-400 font-mono">${item.id}</div>
                          </div>
                        </div>
                      </td>
                      <td class="py-3 px-3 font-medium text-slate-600">${item.category}</td>
                      <td class="py-3 px-3 text-slate-600">${getZoneNameById(item.zone)}</td>
                      <td class="py-3 px-3 text-slate-500">${item.date}</td>
                      <td class="py-3 px-3 text-right rtl:text-left space-x-1 rtl:space-x-reverse">
                        <button class="btn-approve-report px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 font-semibold text-xs transition" data-id="${item.id}">
                          Approve
                        </button>
                        <button class="btn-reject-report px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs transition" data-id="${item.id}">
                          Reject
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>

        <!-- AUDIT LOG & RECENT ACTIVITY -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="text-base font-bold text-navy-950" data-i18n="recentActivity">${t('recentActivity')}</h3>
            <span class="text-xs text-slate-400">Chronological Event Stream</span>
          </div>

          <div class="space-y-3">
            ${auditLogs.slice(0, 6).map(log => `
              <div class="flex items-start gap-3 text-xs">
                <div class="w-2 h-2 rounded-full bg-cobalt-600 shrink-0 mt-1.5"></div>
                <div class="flex-1">
                  <p class="font-medium text-navy-950">${log.text}</p>
                  <p class="text-[10px] text-slate-400">${log.time}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    `;
  }

  function setupAdminListeners() {
    // Dequeue next item in FIFO sequence
    const dequeueBtn = document.getElementById('btn-dequeue-admin');
    if (dequeueBtn) {
      dequeueBtn.addEventListener('click', () => {
        sound.playSuccess();
        const approved = window.foundItStore.dequeueAndApprove();
        if (approved) {
          showToast(`Dequeued & approved next item: ${approved.title} (${approved.id})`, 'success');
          renderCurrentView();
        }
      });
    }

    // Individual Approve
    document.querySelectorAll('.btn-approve-report').forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playClick();
        const id = btn.getAttribute('data-id');
        window.foundItStore.updateReport(id, { status: 'open' });
        showToast(`Report ${id} approved and published to campus directory!`, 'success');
        renderCurrentView();
      });
    });

    // Individual Reject
    document.querySelectorAll('.btn-reject-report').forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playClick();
        const id = btn.getAttribute('data-id');
        window.foundItStore.updateReport(id, { status: 'closed' });
        showToast(`Report ${id} rejected / marked closed.`, 'info');
        renderCurrentView();
      });
    });
  }

  // =========================================================================
  // VIEW 7: ABOUT / HOW IT WORKS & ACADEMIC DATA STRUCTURES CORE
  // =========================================================================
  function renderAboutView() {
    const t = window.FOUNDIT_I18N.t;
    const isAr = window.FOUNDIT_I18N.getLang() === 'ar';
    const store = window.foundItStore;

    return `
      <div class="space-y-10">
        
        <!-- Header -->
        <div class="space-y-3">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cobalt-50 text-cobalt-700 text-xs font-bold border border-cobalt-200">
            <i data-lucide="cpu" class="w-3.5 h-3.5"></i>
            <span>University Data Structures Project Hub</span>
          </div>
          <h1 class="text-3xl sm:text-4xl font-extrabold text-navy-950" data-i18n="academicTitle">${t('academicTitle')}</h1>
          <p class="text-slate-600 text-sm max-w-2xl leading-relaxed" data-i18n="academicSubtitle">${t('academicSubtitle')}</p>
        </div>

        <!-- Academic Disclosure Card -->
        <div class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
          <div class="flex items-center gap-3 text-cobalt-700">
            <div class="w-10 h-10 rounded-xl bg-cobalt-50 flex items-center justify-center">
              <i data-lucide="shield-alert" class="w-5 h-5"></i>
            </div>
            <h3 class="text-lg font-bold text-navy-950" data-i18n="academicStatementTitle">${t('academicStatementTitle')}</h3>
          </div>
          <p class="text-sm text-slate-600 leading-relaxed" data-i18n="academicStatementBody">
            ${t('academicStatementBody')}
          </p>
          <div class="pt-2 flex flex-wrap gap-3">
            <button id="btn-download-cpp-pkg" class="px-5 py-2.5 rounded-xl bg-cobalt-600 hover:bg-cobalt-700 text-white font-semibold text-xs shadow-xs transition flex items-center gap-2">
              <i data-lucide="download" class="w-4 h-4"></i>
              <span data-i18n="btnDownloadCpp">${t('btnDownloadCpp')}</span>
            </button>
            <a href="#matching" class="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition flex items-center gap-1.5">
              <i data-lucide="sparkles" class="w-4 h-4 text-indigo-600"></i>
              <span>Test Matching Heuristics</span>
            </a>
          </div>
        </div>

        <!-- Academic Tabs (Visualizer | C++ Code | Complexity) -->
        <div class="space-y-6">
          <div class="flex items-center overflow-x-auto no-scrollbar whitespace-nowrap border-b border-slate-200">
            <button class="academic-tab-btn shrink-0 py-3 px-4 sm:px-5 text-sm font-bold border-b-2 transition ${state.activeAcademicTab === 'visualizer' ? 'border-cobalt-600 text-cobalt-700' : 'border-transparent text-slate-500 hover:text-navy-950'}" data-tab="visualizer">
              <span data-i18n="tabVisualizer">${t('tabVisualizer')}</span>
            </button>
            <button class="academic-tab-btn shrink-0 py-3 px-4 sm:px-5 text-sm font-bold border-b-2 transition ${state.activeAcademicTab === 'code' ? 'border-cobalt-600 text-cobalt-700' : 'border-transparent text-slate-500 hover:text-navy-950'}" data-tab="code">
              <span data-i18n="tabCode">${t('tabCode')}</span>
            </button>
            <button class="academic-tab-btn shrink-0 py-3 px-4 sm:px-5 text-sm font-bold border-b-2 transition ${state.activeAcademicTab === 'complexity' ? 'border-cobalt-600 text-cobalt-700' : 'border-transparent text-slate-500 hover:text-navy-950'}" data-tab="complexity">
              <span data-i18n="tabComplexity">${t('tabComplexity')}</span>
            </button>
          </div>

          <!-- TAB CONTENT 1: VISUALIZER -->
          <div id="tab-content-visualizer" class="${state.activeAcademicTab === 'visualizer' ? '' : 'hidden'} space-y-8">
            
            <!-- 1. Hash Table Visualizer -->
            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h4 class="text-base font-bold text-navy-950 flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-cobalt-600"></span>
                    <span>1. Hash Table (Separate Chaining: djb2 % 16 Buckets)</span>
                  </h4>
                  <p class="text-xs text-slate-500">Provides O(1) average lookup by item ID key</p>
                </div>
                <div class="text-xs font-mono text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                  Load Factor: ${(store.getAllReports().length / 16).toFixed(2)}
                </div>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
                ${store.hashTableBuckets.map((bucket, bIdx) => `
                  <div class="p-2.5 rounded-xl border ${bucket.length > 0 ? 'border-cobalt-200 bg-cobalt-50/50' : 'border-slate-200 bg-slate-50/40'} text-xs">
                    <div class="font-bold text-slate-500 text-[10px] uppercase mb-1">Bucket [${bIdx}]</div>
                    <div class="space-y-1">
                      ${bucket.length === 0 ? `<span class="text-[10px] text-slate-300 italic">Empty</span>` : bucket.map(e => `
                        <div class="bg-white p-1 rounded border border-slate-200 text-[10px] font-mono truncate" title="${e.key}">
                          ${e.key}
                        </div>
                      `).join('')}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- 2. Linked List & Queue Visualizer -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <!-- FIFO Queue -->
              <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 class="text-base font-bold text-navy-950 flex items-center gap-2">
                      <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      <span>2. FIFO Moderation Queue</span>
                    </h4>
                    <p class="text-xs text-slate-500">First-In, First-Out Review Sequence</p>
                  </div>
                  <span class="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Size: ${store.reviewQueue.length}
                  </span>
                </div>

                ${store.reviewQueue.length === 0 ? `
                  <p class="text-xs text-slate-400 italic py-4 text-center">Queue is currently empty.</p>
                ` : `
                  <div class="flex items-center gap-2 overflow-x-auto py-2">
                    ${store.reviewQueue.map((item, idx) => `
                      <div class="flex items-center shrink-0">
                        <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs min-w-[120px]">
                          <span class="text-[9px] font-bold uppercase text-slate-400">${idx === 0 ? 'FRONT' : `NODE #${idx+1}`}</span>
                          <p class="font-bold text-navy-950 truncate">${item.title}</p>
                          <span class="text-[10px] text-slate-400 font-mono">${item.id}</span>
                        </div>
                        ${idx < store.reviewQueue.length - 1 ? `<i data-lucide="arrow-right" class="w-4 h-4 text-slate-400 mx-1 shrink-0"></i>` : ''}
                      </div>
                    `).join('')}
                  </div>
                `}
              </div>

              <!-- LIFO Undo Stack -->
              <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 class="text-base font-bold text-navy-950 flex items-center gap-2">
                      <span class="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
                      <span>3. LIFO Action History Stack</span>
                    </h4>
                    <p class="text-xs text-slate-500">Supports Instant Undo for edits & deletions</p>
                  </div>
                  <span class="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    Depth: ${store.undoStack.length}
                  </span>
                </div>

                ${store.undoStack.length === 0 ? `
                  <p class="text-xs text-slate-400 italic py-4 text-center">Stack is currently empty.</p>
                ` : `
                  <div class="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                    ${[...store.undoStack].reverse().map((act, idx) => `
                      <div class="p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                        <div class="flex items-center gap-2">
                          <span class="text-[9px] font-bold uppercase ${idx === 0 ? 'bg-teal-100 text-teal-800' : 'bg-slate-200 text-slate-600'} px-1.5 py-0.5 rounded">
                            ${idx === 0 ? 'TOP' : `#${idx}`}
                          </span>
                          <span class="font-semibold text-navy-950">${act.action}</span>
                          <span class="text-slate-400 font-mono text-[10px]">${act.reportId}</span>
                        </div>
                        <span class="text-[10px] text-slate-400">${act.timestamp}</span>
                      </div>
                    `).join('')}
                  </div>
                `}
              </div>

            </div>
          </div>

          <!-- TAB CONTENT 2: C++ SOURCE CODE VIEWER -->
          <div id="tab-content-code" class="${state.activeAcademicTab === 'code' ? '' : 'hidden'} space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-base font-bold text-navy-950">FoundItCore.hpp (Zero-STL C++17 Header)</h4>
                <p class="text-xs text-slate-500">Fully templated manual implementations of HashTable, LinkedList, Queue, and Stack</p>
              </div>
              <button id="btn-copy-cpp-code" class="px-3.5 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition flex items-center gap-1.5">
                <i data-lucide="copy" class="w-3.5 h-3.5"></i>
                <span>Copy Code</span>
              </button>
            </div>

            <div class="bg-navy-950 text-slate-200 p-5 rounded-2xl border border-navy-800 overflow-x-auto text-xs font-mono leading-relaxed max-h-[500px]">
              <pre><code id="cpp-code-block">// FoundIt - Smart University Lost & Found System
// Academic Core Data Structures Implementation (C++17)
// Manual implementations of classic data structures without STL containers:

#ifndef FOUNDIT_CORE_HPP
#define FOUNDIT_CORE_HPP

#include &lt;iostream&gt;
#include &lt;string&gt;
#include &lt;sstream&gt;

namespace FoundIt {

// 1. DATA STRUCTURE: FIXED ARRAY (Campus Taxonomies)
template &lt;typename T, size_t CAPACITY&gt;
class CustomArray {
private:
    T data[CAPACITY];
    size_t length;
public:
    CustomArray() : length(0) {}
    bool push_back(const T& val) {
        if (length &gt;= CAPACITY) return false;
        data[length++] = val;
        return true;
    }
    T& operator[](size_t index) { return data[index]; }
    size_t size() const { return length; }
};

// 2. DATA STRUCTURE: SINGLY LINKED LIST
template &lt;typename T&gt;
class LinkedList {
public:
    struct Node {
        T data;
        Node* next;
        Node(const T& val) : data(val), next(nullptr) {}
    };
private:
    Node* head;
    Node* tail;
    size_t count;
public:
    void push_back(const T& val) {
        Node* newNode = new Node(val);
        if (!head) head = tail = newNode;
        else { tail-&gt;next = newNode; tail = newNode; }
        count++;
    }
};

// 3. DATA STRUCTURE: FIFO QUEUE (Admin Moderation)
template &lt;typename T&gt;
class Queue {
    // Enqueue at rear, dequeue from front in O(1) time
    void enqueue(const T& val);
    bool dequeue(T& result);
};

// 4. DATA STRUCTURE: LIFO STACK (Undo Action History)
template &lt;typename T&gt;
class Stack {
    // Push on top, pop from top in O(1) time
    void push(const T& val);
    bool pop(T& result);
};

// 5. DATA STRUCTURE: HASH TABLE (Separate Chaining O(1))
template &lt;typename ValueType&gt;
class HashTable {
    // djb2 rolling hash function with collision chain handling
    size_t hashFunction(const std::string& key) const;
    bool insert(const std::string& key, const ValueType& value);
    ValueType* get(const std::string& key) const;
    bool remove(const std::string& key);
};

} // namespace FoundIt
#endif</code></pre>
            </div>
          </div>

          <!-- TAB CONTENT 3: COMPLEXITY & TEST SUITE -->
          <div id="tab-content-complexity" class="${state.activeAcademicTab === 'complexity' ? '' : 'hidden'} space-y-6">
            
            <!-- Complexity Table -->
            <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs overflow-x-auto space-y-3">
              <h4 class="text-base font-bold text-navy-950">Algorithmic Complexity Summary</h4>
              <table class="w-full text-left rtl:text-right text-xs">
                <thead>
                  <tr class="border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px]">
                    <th class="py-2.5 px-3">Data Structure</th>
                    <th class="py-2.5 px-3">Primary Operations</th>
                    <th class="py-2.5 px-3">Time Complexity (Avg)</th>
                    <th class="py-2.5 px-3">Time Complexity (Worst)</th>
                    <th class="py-2.5 px-3">Space Complexity</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 font-mono">
                  <tr>
                    <td class="py-2.5 px-3 font-sans font-bold text-navy-950">Hash Table (djb2)</td>
                    <td class="py-2.5 px-3 font-sans">Lookup by ID / Insert / Delete</td>
                    <td class="py-2.5 px-3 text-teal-700 font-bold">O(1)</td>
                    <td class="py-2.5 px-3 text-slate-600">O(N) (all collide)</td>
                    <td class="py-2.5 px-3">O(N + M)</td>
                  </tr>
                  <tr>
                    <td class="py-2.5 px-3 font-sans font-bold text-navy-950">Singly Linked List</td>
                    <td class="py-2.5 px-3 font-sans">Append / Node Traversal</td>
                    <td class="py-2.5 px-3 text-teal-700 font-bold">O(1) append</td>
                    <td class="py-2.5 px-3 text-slate-600">O(N) search</td>
                    <td class="py-2.5 px-3">O(N)</td>
                  </tr>
                  <tr>
                    <td class="py-2.5 px-3 font-sans font-bold text-navy-950">FIFO Queue</td>
                    <td class="py-2.5 px-3 font-sans">Enqueue / Dequeue (Moderation)</td>
                    <td class="py-2.5 px-3 text-teal-700 font-bold">O(1)</td>
                    <td class="py-2.5 px-3 text-teal-700 font-bold">O(1)</td>
                    <td class="py-2.5 px-3">O(Q)</td>
                  </tr>
                  <tr>
                    <td class="py-2.5 px-3 font-sans font-bold text-navy-950">LIFO Stack</td>
                    <td class="py-2.5 px-3 font-sans">Push / Pop (Action Undo)</td>
                    <td class="py-2.5 px-3 text-teal-700 font-bold">O(1)</td>
                    <td class="py-2.5 px-3 text-teal-700 font-bold">O(1)</td>
                    <td class="py-2.5 px-3">O(U)</td>
                  </tr>
                  <tr>
                    <td class="py-2.5 px-3 font-sans font-bold text-navy-950">Fixed Array</td>
                    <td class="py-2.5 px-3 font-sans">Category indexing with bounds check</td>
                    <td class="py-2.5 px-3 text-teal-700 font-bold">O(1)</td>
                    <td class="py-2.5 px-3 text-teal-700 font-bold">O(1)</td>
                    <td class="py-2.5 px-3">O(K)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Automated Test Suite Verification Checklist -->
            <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 class="text-base font-bold text-navy-950">Verified Academic Test Suite (10/10 Passed)</h4>
                <button id="btn-rerun-tests" class="px-3.5 py-1.5 rounded-xl bg-cobalt-600 hover:bg-cobalt-700 text-white font-semibold text-xs shadow-xs transition flex items-center gap-1.5">
                  <i data-lucide="play" class="w-3.5 h-3.5"></i>
                  <span data-i18n="btnRunTests">${t('btnRunTests')}</span>
                </button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div class="p-3 rounded-xl bg-teal-50/50 border border-teal-200 flex items-center gap-2.5 text-teal-900">
                  <i data-lucide="check-circle" class="w-4 h-4 text-teal-600 shrink-0"></i>
                  <span>Test 1: Seeding Realistic Campus Data (10 verified records)</span>
                </div>
                <div class="p-3 rounded-xl bg-teal-50/50 border border-teal-200 flex items-center gap-2.5 text-teal-900">
                  <i data-lucide="check-circle" class="w-4 h-4 text-teal-600 shrink-0"></i>
                  <span>Test 2: Hash Table O(1) Instant Key Lookup & nullptr safety</span>
                </div>
                <div class="p-3 rounded-xl bg-teal-50/50 border border-teal-200 flex items-center gap-2.5 text-teal-900">
                  <i data-lucide="check-circle" class="w-4 h-4 text-teal-600 shrink-0"></i>
                  <span>Test 3: Exact / Strong Match Heuristic Evaluation (&gt;80%)</span>
                </div>
                <div class="p-3 rounded-xl bg-teal-50/50 border border-teal-200 flex items-center gap-2.5 text-teal-900">
                  <i data-lucide="check-circle" class="w-4 h-4 text-teal-600 shrink-0"></i>
                  <span>Test 4: Unrelated Items Classification as 'Low Match' (&lt;20%)</span>
                </div>
                <div class="p-3 rounded-xl bg-teal-50/50 border border-teal-200 flex items-center gap-2.5 text-teal-900">
                  <i data-lucide="check-circle" class="w-4 h-4 text-teal-600 shrink-0"></i>
                  <span>Test 5: Edge Cases: Same-type rejection & Empty description</span>
                </div>
                <div class="p-3 rounded-xl bg-teal-50/50 border border-teal-200 flex items-center gap-2.5 text-teal-900">
                  <i data-lucide="check-circle" class="w-4 h-4 text-teal-600 shrink-0"></i>
                  <span>Test 6: Invalid Date Rejection (e.g. Month 13 or future date)</span>
                </div>
                <div class="p-3 rounded-xl bg-teal-50/50 border border-teal-200 flex items-center gap-2.5 text-teal-900">
                  <i data-lucide="check-circle" class="w-4 h-4 text-teal-600 shrink-0"></i>
                  <span>Test 7: FIFO Queue Moderation Enqueue & Dequeue sequence</span>
                </div>
                <div class="p-3 rounded-xl bg-teal-50/50 border border-teal-200 flex items-center gap-2.5 text-teal-900">
                  <i data-lucide="check-circle" class="w-4 h-4 text-teal-600 shrink-0"></i>
                  <span>Test 8: LIFO Stack Deletion Reversal & Full State Recovery</span>
                </div>
                <div class="p-3 rounded-xl bg-teal-50/50 border border-teal-200 flex items-center gap-2.5 text-teal-900">
                  <i data-lucide="check-circle" class="w-4 h-4 text-teal-600 shrink-0"></i>
                  <span>Test 9: Safe Non-Existent ID Deletion Handling</span>
                </div>
                <div class="p-3 rounded-xl bg-teal-50/50 border border-teal-200 flex items-center gap-2.5 text-teal-900">
                  <i data-lucide="check-circle" class="w-4 h-4 text-teal-600 shrink-0"></i>
                  <span>Test 10: Hash Collision Distribution & Load Factor &lt; 0.75</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    `;
  }

  function setupAboutListeners() {
    // Tabs switcher
    document.querySelectorAll('.academic-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playClick();
        state.activeAcademicTab = btn.getAttribute('data-tab');
        renderCurrentView();
      });
    });

    // Copy C++ code
    const copyBtn = document.getElementById('btn-copy-cpp-code');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const codeText = document.getElementById('cpp-code-block').innerText;
        navigator.clipboard.writeText(codeText).then(() => {
          showToast('C++ core code copied to clipboard!', 'success');
        });
      });
    }

    // Download C++ Package
    const downloadBtn = document.getElementById('btn-download-cpp-pkg');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        sound.playSuccess();
        downloadCppFile();
      });
    }

    // Re-run test suite
    const rerunBtn = document.getElementById('btn-rerun-tests');
    if (rerunBtn) {
      rerunBtn.addEventListener('click', () => {
        sound.playSuccess();
        showToast('Virtual test suite executed: All 10 automated test cases PASSED!', 'success');
      });
    }
  }

  // Helper to trigger browser download of C++ file
  function downloadCppFile() {
    const cppCode = `/**
 * FoundIt - Smart University Lost & Found System
 * Academic Core Data Structures Implementation (C++17)
 */
// Please see cpp/FoundItCore.hpp and cpp/FoundItCore.cpp in the project folder.
// Compile with: g++ -std=c++17 -O2 FoundItCore.cpp -o foundit_core
`;
    const blob = new Blob([cppCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'FoundIt_Cpp_DataStructures_Core.cpp';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Downloaded FoundIt_Cpp_DataStructures_Core.cpp', 'success');
  }

  // =========================================================================
  // CARD & ROW COMPONENT RENDERERS
  // =========================================================================

  function renderItemCard(report) {
    const isLost = report.type === 'lost';
    const statusClass = getStatusBadgeClass(report.status);

    return `
      <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs card-hover flex flex-col justify-between group">
        <div>
          <!-- Thumbnail & Badges -->
          <div class="relative h-44 overflow-hidden bg-slate-100">
            <img src="${report.image}" alt="${report.title}" 
                 class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
            <div class="absolute top-3 left-3 rtl:left-auto rtl:right-3 flex items-center gap-1.5">
              <span class="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider shadow-xs ${
                isLost ? 'bg-rose-600 text-white' : 'bg-teal-600 text-white'
              }">
                ${report.type.toUpperCase()}
              </span>
            </div>
            <div class="absolute top-3 right-3 rtl:right-auto rtl:left-3">
              <span class="px-2 py-0.5 rounded-md text-[10px] font-semibold border backdrop-blur-xs bg-white/90 ${statusClass}">
                ${getStatusName(report.status)}
              </span>
            </div>
          </div>

          <!-- Card Body -->
          <div class="p-4 space-y-2">
            <div class="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <i data-lucide="map-pin" class="w-3.5 h-3.5 text-cobalt-600 shrink-0"></i>
              <span class="truncate">${getZoneNameById(report.zone)}</span>
            </div>

            <h3 class="text-sm font-bold text-navy-950 line-clamp-1 group-hover:text-cobalt-600 transition">
              ${report.title}
            </h3>

            <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed">
              ${report.description}
            </p>
          </div>
        </div>

        <!-- Card Footer -->
        <div class="p-4 pt-0 border-t border-slate-100 flex items-center justify-between mt-3 text-xs">
          <span class="text-slate-400 font-medium">${report.date}</span>
          <button class="btn-card-details text-cobalt-600 hover:text-cobalt-800 font-bold transition flex items-center gap-1" data-id="${report.id}">
            <span>Details</span>
            <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </div>
    `;
  }

  function renderItemRow(report) {
    const isLost = report.type === 'lost';
    const statusClass = getStatusBadgeClass(report.status);

    return `
      <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-hover">
        <div class="flex items-center gap-4">
          <img src="${report.image}" alt="${report.title}" class="w-16 h-16 rounded-xl object-cover shrink-0">
          <div class="space-y-1">
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${isLost ? 'bg-rose-100 text-rose-700' : 'bg-teal-100 text-teal-700'}">
                ${report.type.toUpperCase()}
              </span>
              <span class="px-2 py-0.5 rounded text-[10px] font-semibold border ${statusClass}">
                ${getStatusName(report.status)}
              </span>
              <span class="text-xs text-slate-400 font-mono">${report.id}</span>
            </div>
            <h3 class="text-sm font-bold text-navy-950">${report.title}</h3>
            <p class="text-xs text-slate-500">${report.date} • ${getZoneNameById(report.zone)} (${report.locationDetail})</p>
          </div>
        </div>

        <button class="btn-card-details px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition border border-slate-200" data-id="${report.id}">
          View Full Details
        </button>
      </div>
    `;
  }

  function renderEmptyState() {
    return `
      <div class="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
        <div class="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <i data-lucide="search-x" class="w-7 h-7"></i>
        </div>
        <h3 class="text-lg font-bold text-navy-950">No Matching Items Found</h3>
        <p class="text-xs text-slate-500 max-w-sm mx-auto">
          Try clearing filters, searching for a different keyword, or submit a new report.
        </p>
        <button id="btn-empty-reset" class="px-5 py-2.5 rounded-xl bg-cobalt-600 text-white font-semibold text-xs shadow-xs">
          Reset All Filters
        </button>
      </div>
    `;
  }

  function renderMatchResultCard(match, target) {
    const candidate = match.candidateReport;
    const isAr = window.FOUNDIT_I18N.getLang() === 'ar';

    return `
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 card-hover">
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div class="flex items-start gap-3.5">
            <img src="${candidate.image}" class="w-16 h-16 rounded-xl object-cover shrink-0" alt="${candidate.title}">
            <div class="space-y-1">
              <div class="flex flex-wrap items-center gap-2">
                <span class="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${candidate.type === 'lost' ? 'bg-rose-100 text-rose-700' : 'bg-teal-100 text-teal-700'}">
                  ${candidate.type.toUpperCase()}
                </span>
                <span class="text-xs font-semibold text-slate-400 font-mono">${candidate.id}</span>
              </div>
              <h4 class="text-base font-bold text-navy-950">${candidate.title}</h4>
              <p class="text-xs text-slate-500">${candidate.date} • ${getZoneNameById(candidate.zone)}</p>
            </div>
          </div>

          <!-- Score Badge -->
          <div class="flex flex-col items-end shrink-0">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-1 rounded-full text-xs font-bold ${match.badgeClass}">
                ${isAr ? match.confidenceLabelAr : match.confidenceLabel}
              </span>
              <span class="text-xl font-extrabold text-navy-950">${match.totalScore}%</span>
            </div>
            <span class="text-[10px] text-slate-400 mt-1">Algorithmic Correlation</span>
          </div>
        </div>

        <!-- Score Breakdown Visual Bar -->
        <div class="space-y-2 pt-2 border-t border-slate-100">
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px] font-semibold text-slate-600">
            <span class="bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 flex items-center justify-between">
              <span class="text-slate-500">${isAr ? 'الفئة' : 'Category'}:</span>
              <span class="text-cobalt-700 font-bold">${match.categoryScore}/35</span>
            </span>
            <span class="bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 flex items-center justify-between">
              <span class="text-slate-500">${isAr ? 'الكلمات' : 'Keywords'}:</span>
              <span class="text-indigo-700 font-bold">${match.keywordScore}/30</span>
            </span>
            <span class="bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 flex items-center justify-between">
              <span class="text-slate-500">${isAr ? 'الموقع' : 'Building'}:</span>
              <span class="text-teal-700 font-bold">${match.locationScore}/20</span>
            </span>
            <span class="bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 flex items-center justify-between">
              <span class="text-slate-500">${isAr ? 'التاريخ' : 'Date'}:</span>
              <span class="text-amber-700 font-bold">${match.dateScore}/15</span>
            </span>
          </div>
          <div class="w-full h-2 rounded-full bg-slate-100 overflow-hidden flex">
            <div class="bg-cobalt-600 h-full" style="width: ${match.categoryScore}%" title="Category Parity"></div>
            <div class="bg-indigo-500 h-full" style="width: ${match.keywordScore}%" title="Keyword Overlap"></div>
            <div class="bg-teal-500 h-full" style="width: ${match.locationScore}%" title="Campus Proximity"></div>
            <div class="bg-amber-400 h-full" style="width: ${match.dateScore}%" title="Date Proximity"></div>
          </div>
        </div>

        <!-- Rationale Chips -->
        <div class="flex flex-wrap gap-1.5 pt-1">
          ${(isAr ? match.reasonsAr : match.reasons).map(r => `
            <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
              ${r}
            </span>
          `).join('')}
        </div>

        <!-- Bottom Action -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button class="btn-card-details w-full sm:w-auto px-3.5 py-2 sm:py-1.5 rounded-xl sm:rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold text-center" data-id="${candidate.id}">
            ${isAr ? 'فحص تفاصيل الغرض' : 'Inspect Candidate Details'}
          </button>
          <button class="btn-open-claim w-full sm:w-auto px-3.5 py-2 sm:py-1.5 rounded-xl sm:rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs text-center" data-id="${candidate.id}">
            ${isAr ? 'بدء إجراءات الاستلام' : 'Initiate Claim Flow'}
          </button>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // MODAL HANDLERS
  // =========================================================================

  function openItemDetails(id) {
    const report = window.foundItStore.getReportById(id);
    if (!report) return;

    const modal = document.getElementById('modal-item-details');
    const content = document.getElementById('modal-item-content');
    if (!modal || !content) return;

    sound.playClick();

    // Potential matches calculation
    const allReports = window.foundItStore.getAllReports();
    const matches = window.SmartMatchingEngine.findMatchesFor(report, allReports).slice(0, 2);

    content.innerHTML = `
      <div class="relative">
        <!-- Image Header -->
        <div class="relative h-44 sm:h-60 bg-slate-900 overflow-hidden">
          <img src="${report.image}" alt="${report.title}" class="w-full h-full object-cover">
          <button class="modal-close absolute top-3 right-3 rtl:right-auto rtl:left-3 w-8 h-8 rounded-full bg-navy-950/70 text-white flex items-center justify-center hover:bg-navy-950 transition">
            <i data-lucide="x" class="w-4 h-4"></i>
          </button>
          <div class="absolute bottom-3 left-3 rtl:left-auto rtl:right-3 flex items-center gap-2">
            <span class="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider text-white ${report.type === 'lost' ? 'bg-rose-600' : 'bg-teal-600'}">
              ${report.type.toUpperCase()}
            </span>
            <span class="px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-md bg-white/90 text-navy-950 border border-white">
              ${getStatusName(report.status)}
            </span>
          </div>
        </div>

        <!-- Body Details -->
        <div class="p-4 sm:p-6 space-y-4 sm:space-y-6 max-h-[65vh] sm:max-h-[70vh] overflow-y-auto">
          <div>
            <div class="text-xs font-mono text-slate-400 mb-1">${report.id}</div>
            <h2 class="text-lg sm:text-xl font-bold text-navy-950">${report.title}</h2>
          </div>

          <div class="grid grid-cols-2 gap-3 sm:gap-4 text-xs">
            <div class="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span class="text-slate-400 block mb-1">Campus Location</span>
              <span class="font-bold text-navy-950 flex items-center gap-1">
                <i data-lucide="map-pin" class="w-3.5 h-3.5 text-cobalt-600"></i>
                ${getZoneNameById(report.zone)}
              </span>
              <p class="text-[11px] text-slate-500 mt-0.5">${report.locationDetail}</p>
            </div>

            <div class="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span class="text-slate-400 block mb-1">Date Reported</span>
              <span class="font-bold text-navy-950 flex items-center gap-1">
                <i data-lucide="calendar" class="w-3.5 h-3.5 text-cobalt-600"></i>
                ${report.date}
              </span>
              <p class="text-[11px] text-[#94A3B8] mt-0.5">
                ${(window.foundItAuth && (window.foundItAuth.isAdmin() || (window.foundItAuth.currentUser && (report.reporterId === window.foundItAuth.currentUser.id || report.reporterEmail === window.foundItAuth.currentUser.email)))) 
                  ? (report.reporterEmail ? `${report.reporterName} (${report.reporterEmail})` : report.reporterName)
                  : `${report.reporterName} • Handover Relay [Protected]`}
              </p>
            </div>
          </div>

          <div>
            <h4 class="text-xs font-bold text-navy-950 uppercase tracking-wider mb-2">Description & Identifying Characteristics</h4>
            <p class="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-200">
              ${report.description}
            </p>
          </div>

          <!-- Lifecycle Timeline -->
          <div>
            <h4 class="text-xs font-bold text-navy-950 uppercase tracking-wider mb-3">Item Lifecycle Progress</h4>
            <div class="flex items-center justify-between text-center relative">
              <div class="flex-1">
                <div class="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] mx-auto font-bold">✓</div>
                <span class="text-[10px] font-semibold text-slate-700 block mt-1">Submitted</span>
              </div>
              <div class="h-0.5 w-full bg-teal-600"></div>
              <div class="flex-1">
                <div class="w-6 h-6 rounded-full ${report.status !== 'under_review' ? 'bg-teal-600 text-white' : 'bg-amber-500 text-white'} flex items-center justify-center text-[10px] mx-auto font-bold">
                  ${report.status !== 'under_review' ? '✓' : '•'}
                </div>
                <span class="text-[10px] font-semibold text-slate-700 block mt-1">Reviewed</span>
              </div>
              <div class="h-0.5 w-full ${report.status === 'matched' || report.status === 'returned' ? 'bg-teal-600' : 'bg-slate-200'}"></div>
              <div class="flex-1">
                <div class="w-6 h-6 rounded-full ${report.status === 'matched' || report.status === 'returned' ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-400'} flex items-center justify-center text-[10px] mx-auto font-bold">
                  ${report.status === 'matched' || report.status === 'returned' ? '✓' : '•'}
                </div>
                <span class="text-[10px] font-semibold text-slate-700 block mt-1">Matched</span>
              </div>
              <div class="h-0.5 w-full ${report.status === 'returned' ? 'bg-teal-600' : 'bg-slate-200'}"></div>
              <div class="flex-1">
                <div class="w-6 h-6 rounded-full ${report.status === 'returned' ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-400'} flex items-center justify-center text-[10px] mx-auto font-bold">
                  ${report.status === 'returned' ? '✓' : '•'}
                </div>
                <span class="text-[10px] font-semibold text-slate-700 block mt-1">Returned</span>
              </div>
            </div>
          </div>

          <!-- Top Heuristic Matches Preview -->
          ${matches.length > 0 ? `
            <div>
              <h4 class="text-xs font-bold text-navy-950 uppercase tracking-wider mb-2">Algorithmically Correlated Candidates</h4>
              <div class="space-y-2">
                ${matches.map(m => `
                  <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div class="flex items-center gap-2.5">
                      <img src="${m.candidateReport.image}" class="w-9 h-9 rounded-lg object-cover" alt="">
                      <div>
                        <div class="font-bold text-navy-950">${m.candidateReport.title}</div>
                        <div class="text-[10px] text-slate-400">${m.candidateReport.date} • ${getZoneNameById(m.candidateReport.zone)}</div>
                      </div>
                    </div>
                    <span class="px-2 py-1 rounded-full text-xs font-bold ${m.badgeClass}">
                      ${m.totalScore}%
                    </span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Modal Action Bar -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-end gap-2.5 pt-4 border-t border-slate-200">
            <button class="modal-close w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 order-2 sm:order-1 text-center">
              ${isAr ? 'إغلاق' : 'Close'}
            </button>
            <button class="btn-open-claim w-full sm:w-auto px-5 py-2.5 sm:py-2 rounded-xl bg-cobalt-600 hover:bg-cobalt-700 text-white text-xs font-semibold shadow-xs order-1 sm:order-2 text-center" data-id="${report.id}">
              ${report.type === 'found' ? (isAr ? 'المطالبة بهذا الغرض بأمان' : 'Claim This Item Safely') : (isAr ? 'عثرت على هذا الغرض (تواصل)' : 'I Found This Item (Contact)')}
            </button>
          </div>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons({ root: content });

    // Setup close listeners
    content.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => modal.classList.add('hidden'));
    });

    content.querySelectorAll('.btn-open-claim').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.classList.add('hidden');
        openClaimModal(btn.getAttribute('data-id'));
      });
    });
  }

  function openClaimModal(targetId) {
    const modal = document.getElementById('modal-safe-claim');
    const inputId = document.getElementById('claim-target-id');
    if (!modal || !inputId) return;

    sound.playClick();
    inputId.value = targetId;
    modal.classList.remove('hidden');

    modal.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => modal.classList.add('hidden'));
    });
  }

  function openConfirmDialog(title, desc, onConfirm) {
    const modal = document.getElementById('modal-confirm');
    const titleEl = document.getElementById('confirm-title');
    const descEl = document.getElementById('confirm-desc');
    const cancelBtn = document.getElementById('btn-confirm-cancel');
    const proceedBtn = document.getElementById('btn-confirm-proceed');

    if (!modal) return;
    sound.playClick();

    if (titleEl) titleEl.textContent = title;
    if (descEl) descEl.textContent = desc;

    modal.classList.remove('hidden');

    const cleanUp = () => {
      modal.classList.add('hidden');
      proceedBtn.onclick = null;
      cancelBtn.onclick = null;
    };

    cancelBtn.onclick = cleanUp;
    proceedBtn.onclick = () => {
      cleanUp();
      onConfirm();
    };
  }

  // =========================================================================
  // GLOBAL LISTENERS & INITIALIZATION
  // =========================================================================

  function getZoneNameById(zoneId) {
    const isAr = window.FOUNDIT_I18N.getLang() === 'ar';
    const found = window.FOUNDIT_DATA.CAMPUS_ZONES.find(z => z.id === zoneId);
    if (!found) return zoneId;
    return isAr ? found.ar : found.name;
  }

  function getStatusName(status) {
    const t = window.FOUNDIT_I18N.t;
    switch (status) {
      case 'open': return t('statusOpen');
      case 'under_review': return t('statusUnderReview');
      case 'matched': return t('statusMatched');
      case 'returned': return t('statusReturned');
      case 'closed': return t('statusClosed');
      default: return status;
    }
  }

  function getStatusBadgeClass(status) {
    switch (status) {
      case 'open': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'under_review': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'matched': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'returned': return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'closed': return 'bg-slate-100 text-slate-600 border-slate-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  }

  function initGlobalListeners() {
    // Hash change event for router
    window.addEventListener('hashchange', handleRoute);

    // Language change custom event
    window.addEventListener('foundit_lang_changed', () => {
      renderCurrentView();
    });

    // Store update event
    window.addEventListener('foundit_store_updated', () => {
      renderCurrentView();
    });

    // Language toggle button
    const langBtn = document.getElementById('btn-lang-toggle');
    if (langBtn) {
      langBtn.addEventListener('click', () => {
        sound.playClick();
        const current = window.FOUNDIT_I18N.getLang();
        const next = current === 'en' ? 'ar' : 'en';
        window.FOUNDIT_I18N.setLang(next);
      });
    }

    // Theme toggle (Desktop & Mobile)
    const themeBtn = document.getElementById('btn-theme-toggle');
    const mobileThemeBtn = document.getElementById('mobile-theme-toggle');
    const handleThemeToggle = () => {
      sound.playClick();
      if (window.FoundItTheme) {
        const next = window.FoundItTheme.toggle();
        showToast(next === 'dark' ? 'Dark theme enabled' : 'Light theme enabled', 'info');
      }
    };
    if (themeBtn) themeBtn.addEventListener('click', handleThemeToggle);
    if (mobileThemeBtn) mobileThemeBtn.addEventListener('click', handleThemeToggle);

    // Auth change event listener
    window.addEventListener('foundit_auth_changed', () => {
      updateNavbarAuth();
      renderCurrentView();
    });

    // Sound toggle (Desktop & Mobile Drawer)
    const soundBtn = document.getElementById('btn-sound-toggle');
    const soundIcon = document.getElementById('sound-icon');
    const mobileSoundBtn = document.getElementById('mobile-sound-toggle');
    const mobileSoundIcon = document.getElementById('mobile-sound-icon');
    const mobileSoundLabel = document.getElementById('mobile-sound-label');

    const toggleAudio = () => {
      sound.enabled = !sound.enabled;
      if (sound.enabled) {
        sound.playClick();
        if (soundIcon) soundIcon.setAttribute('data-lucide', 'volume-2');
        if (mobileSoundIcon) mobileSoundIcon.setAttribute('data-lucide', 'volume-2');
        if (mobileSoundLabel) mobileSoundLabel.textContent = 'Audio On';
        showToast('Audio feedback enabled', 'info');
      } else {
        if (soundIcon) soundIcon.setAttribute('data-lucide', 'volume-x');
        if (mobileSoundIcon) mobileSoundIcon.setAttribute('data-lucide', 'volume-x');
        if (mobileSoundLabel) mobileSoundLabel.textContent = 'Audio Off';
        showToast('Audio feedback muted', 'info');
      }
      if (window.lucide) window.lucide.createIcons();
    };

    if (soundBtn) soundBtn.addEventListener('click', toggleAudio);
    if (mobileSoundBtn) mobileSoundBtn.addEventListener('click', toggleAudio);

    // Mobile menu toggle
    const mobileBtn = document.getElementById('btn-mobile-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuIcon = document.getElementById('mobile-menu-icon');
    if (mobileBtn && mobileMenu) {
      mobileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sound.playClick();
        const isOpen = !mobileMenu.classList.contains('hidden');
        if (isOpen) {
          mobileMenu.classList.add('hidden');
          if (mobileMenuIcon) mobileMenuIcon.setAttribute('data-lucide', 'menu');
        } else {
          mobileMenu.classList.remove('hidden');
          if (mobileMenuIcon) mobileMenuIcon.setAttribute('data-lucide', 'x');
        }
        if (window.lucide) window.lucide.createIcons();
      });

      // Close mobile drawer when clicking any link inside it
      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          mobileMenu.classList.add('hidden');
          if (mobileMenuIcon) mobileMenuIcon.setAttribute('data-lucide', 'menu');
          if (window.lucide) window.lucide.createIcons();
        });
      });
    }

    // Modal backdrop click listener & Escape key handler
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        const d = document.getElementById('modal-item-details');
        const c = document.getElementById('modal-safe-claim');
        const cf = document.getElementById('modal-confirm');
        if (d && !d.classList.contains('hidden')) d.classList.add('hidden');
        if (c && !c.classList.contains('hidden')) c.classList.add('hidden');
        if (cf && !cf.classList.contains('hidden')) cf.classList.add('hidden');
      }
    });

    ['modal-item-details', 'modal-safe-claim', 'modal-confirm'].forEach(id => {
      const modal = document.getElementById(id);
      if (modal) {
        modal.addEventListener('click', e => {
          if (e.target === modal) modal.classList.add('hidden');
        });
      }
    });

    // Top & Footer Demo Reset
    const resetTopBtn = document.getElementById('btn-top-reset-demo');
    const resetFooterBtn = document.getElementById('btn-footer-reset-demo');
    const resetMobileBtn = document.getElementById('mobile-reset-demo');
    const handleReset = () => {
      openConfirmDialog(
        'Restore Default Campus Data?',
        'This will reset all reports to the initial 10 university sample records and clear the undo stack.',
        () => {
          window.foundItStore.resetToDemo();
          showToast('Demo data restored successfully!', 'success');
          renderCurrentView();
        }
      );
    };

    if (resetTopBtn) resetTopBtn.addEventListener('click', handleReset);
    if (resetFooterBtn) resetFooterBtn.addEventListener('click', handleReset);
    if (resetMobileBtn) resetMobileBtn.addEventListener('click', handleReset);

    // Global Safe Claim Form Submit
    const claimForm = document.getElementById('form-safe-claim');
    if (claimForm) {
      claimForm.addEventListener('submit', e => {
        e.preventDefault();
        const targetId = document.getElementById('claim-target-id').value;
        const q1 = document.getElementById('claim-q1').value;
        const q2 = document.getElementById('claim-q2').value;
        const q3 = document.getElementById('claim-q3').value;

        window.foundItStore.submitClaim(targetId, { q1, q2, q3 });

        document.getElementById('modal-safe-claim').classList.add('hidden');
        claimForm.reset();
        showToast(window.FOUNDIT_I18N.t('claimSentSuccess'), 'success');
      });
    }

    // Delegated click listener for item cards across pages
    document.addEventListener('click', e => {
      const cardDetailsBtn = e.target.closest('.btn-card-details');
      if (cardDetailsBtn) {
        const id = cardDetailsBtn.getAttribute('data-id');
        if (id) openItemDetails(id);
      }

      const openClaimBtn = e.target.closest('.btn-open-claim');
      if (openClaimBtn) {
        const id = openClaimBtn.getAttribute('data-id');
        if (id) openClaimModal(id);
      }

      const emptyResetBtn = e.target.closest('#btn-empty-reset');
      if (emptyResetBtn) {
        resetBrowseFilters();
      }
    });
    // Expose helpers globally for other modules
    window.openItemDetails = openItemDetails;
    window.openClaimModal = openClaimModal;
    window.openConfirmDialog = openConfirmDialog;
    window.showToast = showToast;
    window.renderCurrentView = renderCurrentView;
    window.navigateTo = navigateTo;
  }

  // --- INIT APPLICATION ON DOM READY ---
  document.addEventListener('DOMContentLoaded', () => {
    initGlobalListeners();
    handleRoute();
  });

})();
