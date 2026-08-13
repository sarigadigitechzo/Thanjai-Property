export function showToast(message, iconClass = 'ri-checkbox-circle-fill', duration = 3500) {
  let toastContainer = document.getElementById('global-toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'global-toast-container';
    toastContainer.className = 'toast-notification';
    document.body.appendChild(toastContainer);
  }

  toastContainer.innerHTML = `
    <i class="${iconClass}" style="color: var(--color-orange); font-size: 1.35rem;"></i>
    <span>${message}</span>
  `;

  toastContainer.classList.add('show');

  setTimeout(() => {
    toastContainer.classList.remove('show');
  }, duration);
}
