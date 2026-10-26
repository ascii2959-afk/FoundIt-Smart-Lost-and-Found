// js/notifications.js
// Simple toast/notification system for FoundIt UI
// Uses the <div id="toast-container"> already present in index.html
// Types: 'success', 'info', 'warning', 'error'

(() => {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const icons = {
    success: 'check-circle',
    info: 'info',
    warning: 'alert-triangle',
    error: 'x-circle'
  };

  function createToast(type, message, duration = 4000) {
    const toast = document.createElement('div');
    const bgClass = type === 'error' ? 'rose-600' : type === 'warning' ? 'amber-500' : type === 'info' ? 'cyan-600' : 'emerald-600';
    toast.className = `toast flex items-center gap-2 p-3 rounded-xl shadow-md bg-${bgClass} text-white transition-opacity duration-300`;
    // Icon using lucide (if loaded)
    if (window.lucide) {
      const i = document.createElement('i');
      i.setAttribute('data-lucide', icons[type] || 'info');
      toast.appendChild(i);
    }
    const span = document.createElement('span');
    span.textContent = message;
    toast.appendChild(span);
    container.appendChild(toast);
    // Ensure lucide icons are rendered for the new element
    if (window.lucide) window.lucide.createIcons();
    // Auto‑dismiss after duration
    setTimeout(() => {
      toast.classList.add('opacity-0');
      toast.addEventListener('transitionend', () => toast.remove());
    }, duration);
  }

  // Expose globally as a simple API
  window.FoundItToast = { show: createToast };
})();
