/**
 * FoundIt - Premium Dark Theme Manager
 * Dark mode enabled by default with light mode toggle and persistence
 * Palette:
 * - Background: #0B1020
 * - Surface: #111827
 * - Card/Panel: #172033
 * - Primary Accent: #6366F1 (Indigo)
 * - Secondary Accent: #22D3EE (Cyan)
 * - Success: #34D399 | Warning: #FBBF24 | Error: #F87171
 * - Borders: #293449 | Text: #F8FAFC / #94A3B8
 */

class FoundItTheme {
  constructor() {
    this.STORAGE_KEY = 'foundit_theme_preference';
    this.currentTheme = 'dark'; // Dark Mode default
    this.init();
  }

  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') {
      this.currentTheme = saved;
    } else {
      this.currentTheme = 'dark'; // explicitly default to dark mode
    }
    this.apply();
  }

  apply() {
    const root = document.documentElement;
    if (this.currentTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }

    this.updateIcons();
    window.dispatchEvent(new CustomEvent('foundit_theme_changed', { detail: { theme: this.currentTheme } }));
  }

  toggle() {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(this.STORAGE_KEY, this.currentTheme);
    this.apply();
    return this.currentTheme;
  }

  isDark() {
    return this.currentTheme === 'dark';
  }

  getTheme() {
    return this.currentTheme;
  }

  updateIcons() {
    const isDark = this.isDark();
    // Desktop Theme Button
    const themeBtn = document.getElementById('btn-theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
      themeIcon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
    }
    if (themeBtn) {
      themeBtn.title = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    }

    // Mobile Theme Button
    const mobileThemeIcon = document.getElementById('mobile-theme-icon');
    const mobileThemeLabel = document.getElementById('mobile-theme-label');
    if (mobileThemeIcon) {
      mobileThemeIcon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
    }
    if (mobileThemeLabel) {
      mobileThemeLabel.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
}

window.FoundItTheme = new FoundItTheme();
