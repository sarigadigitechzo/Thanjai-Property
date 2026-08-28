export function showToast(message, iconClass = 'ri-checkbox-circle-fill', duration = 3500) {
  let toastContainer = document.getElementById('global-toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'global-toast-container';
    toastContainer.className = 'toast-notification';
    document.body.appendChild(toastContainer);
  }

  toastContainer.innerHTML = `
    <i class="${iconClass}" style="color: var(--color-orange, #eb5e28); font-size: 1.35rem;"></i>
    <span>${message}</span>
  `;

  toastContainer.classList.add('show');

  setTimeout(() => {
    toastContainer.classList.remove('show');
  }, duration);
}

export function showConfirmModal({
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed with this action?',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  confirmIcon = 'ri-delete-bin-line',
  isDanger = true,
  onConfirm = () => {}
}) {
  document.getElementById('os-global-confirm-modal')?.remove();

  const overlay = document.createElement('div');
  overlay.id = 'os-global-confirm-modal';
  overlay.style.cssText = `
    position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important;
    width: 100vw !important; height: 100vh !important; z-index: 999999 !important;
    background: rgba(15, 23, 42, 0.72) !important; backdrop-filter: blur(8px) !important;
    display: flex !important; align-items: center !important; justify-content: center !important;
    padding: 20px !important; transition: opacity 0.2s ease;
  `;

  const btnBg = isDanger ? '#e53e3e' : 'var(--os-luxury-orange, #eb5e28)';
  const iconColor = isDanger ? '#e53e3e' : 'var(--os-luxury-orange, #eb5e28)';
  const iconBg = isDanger ? 'rgba(229, 62, 62, 0.12)' : 'rgba(235, 94, 40, 0.12)';

  overlay.innerHTML = `
    <div style="
      background: #ffffff; border-radius: 20px; max-width: 440px; width: 100%;
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.35); overflow: hidden;
      border: 1px solid rgba(226, 232, 240, 0.9); transform: scale(1);
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    ">
      <div style="padding: 28px 28px 20px 28px; text-align: center;">
        <div style="
          width: 56px; height: 56px; border-radius: 16px; background: ${iconBg};
          color: ${iconColor}; display: inline-flex; align-items: center; justify-content: center;
          font-size: 1.75rem; margin-bottom: 16px;
        ">
          <i class="${confirmIcon}"></i>
        </div>
        <h3 style="font-size: 1.25rem; font-weight: 700; color: #1a202c; margin: 0 0 8px 0; line-height: 1.3;">
          ${title}
        </h3>
        <p style="font-size: 0.92rem; color: #718096; line-height: 1.55; margin: 0;">
          ${message}
        </p>
      </div>

      <div style="
        padding: 16px 24px 20px 24px; background: #f8fafc; border-top: 1px solid #edf2f7;
        display: flex; gap: 12px; justify-content: flex-end;
      ">
        <button id="os-confirm-cancel-btn" style="
          flex: 1; padding: 11px 20px; border-radius: 10px; border: 1px solid #cbd5e0;
          background: #ffffff; color: #4a5568; font-weight: 600; font-size: 0.9rem;
          cursor: pointer; transition: all 0.2s;
        ">
          ${cancelText}
        </button>
        <button id="os-confirm-action-btn" style="
          flex: 1; padding: 11px 20px; border-radius: 10px; border: none;
          background: ${btnBg}; color: #ffffff; font-weight: 700; font-size: 0.9rem;
          cursor: pointer; box-shadow: 0 4px 14px rgba(0,0,0,0.15); transition: all 0.2s;
          display: inline-flex; align-items: center; justify-content: center; gap: 6px;
        ">
          <i class="${confirmIcon}"></i>
          <span>${confirmText}</span>
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const close = () => overlay.remove();

  document.getElementById('os-confirm-cancel-btn')?.addEventListener('click', close);
  document.getElementById('os-confirm-action-btn')?.addEventListener('click', () => {
    close();
    onConfirm();
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
}

export function showAlertModal({
  title = 'Notification',
  message = '',
  type = 'info', // 'success', 'warning', 'error', 'info'
  buttonText = 'Got it',
  onOk = () => {}
}) {
  document.getElementById('os-global-alert-modal')?.remove();

  const config = {
    warning: {
      icon: 'ri-error-warning-line',
      iconBg: 'rgba(235, 94, 40, 0.12)',
      iconColor: 'var(--os-luxury-orange, #eb5e28)',
      btnBg: 'var(--os-luxury-orange, #eb5e28)',
      defaultTitle: 'Notice'
    },
    error: {
      icon: 'ri-close-circle-line',
      iconBg: 'rgba(239, 68, 68, 0.12)',
      iconColor: '#ef4444',
      btnBg: '#ef4444',
      defaultTitle: 'Error'
    },
    success: {
      icon: 'ri-checkbox-circle-line',
      iconBg: 'rgba(16, 185, 129, 0.12)',
      iconColor: '#10b981',
      btnBg: '#10b981',
      defaultTitle: 'Success'
    },
    info: {
      icon: 'ri-information-line',
      iconBg: 'rgba(59, 130, 246, 0.12)',
      iconColor: '#3b82f6',
      btnBg: 'var(--os-luxury-orange, #eb5e28)',
      defaultTitle: 'Information'
    }
  };

  const activeConf = config[type] || config.info;
  const modalTitle = title || activeConf.defaultTitle;

  const overlay = document.createElement('div');
  overlay.id = 'os-global-alert-modal';
  overlay.style.cssText = `
    position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important;
    width: 100vw !important; height: 100vh !important; z-index: 999999 !important;
    background: rgba(15, 23, 42, 0.72) !important; backdrop-filter: blur(8px) !important;
    display: flex !important; align-items: center !important; justify-content: center !important;
    padding: 20px !important; transition: opacity 0.2s ease;
  `;

  overlay.innerHTML = `
    <div style="
      background: #ffffff; border-radius: 20px; max-width: 440px; width: 100%;
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.35); overflow: hidden;
      border: 1px solid rgba(226, 232, 240, 0.9); transform: scale(1);
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    ">
      <div style="padding: 30px 28px 22px 28px; text-align: center;">
        <div style="
          width: 58px; height: 58px; border-radius: 16px; background: ${activeConf.iconBg};
          color: ${activeConf.iconColor}; display: inline-flex; align-items: center; justify-content: center;
          font-size: 1.85rem; margin-bottom: 16px;
        ">
          <i class="${activeConf.icon}"></i>
        </div>
        <h3 style="font-size: 1.25rem; font-weight: 700; color: #1a202c; margin: 0 0 10px 0; line-height: 1.3;">
          ${modalTitle}
        </h3>
        <div style="font-size: 0.92rem; color: #64748b; line-height: 1.6; margin: 0; word-break: break-word;">
          ${message}
        </div>
      </div>

      <div style="
        padding: 16px 24px 20px 24px; background: #f8fafc; border-top: 1px solid #edf2f7;
        display: flex; justify-content: center;
      ">
        <button id="os-alert-ok-btn" style="
          width: 100%; padding: 12px 24px; border-radius: 10px; border: none;
          background: ${activeConf.btnBg}; color: #ffffff; font-weight: 700; font-size: 0.92rem;
          cursor: pointer; box-shadow: 0 4px 14px rgba(0,0,0,0.12); transition: all 0.2s;
        ">
          ${buttonText}
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const close = () => {
    overlay.remove();
    onOk();
  };

  document.getElementById('os-alert-ok-btn')?.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
}

// Global Browser Shield to prevent any raw browser alerts
export function installGlobalPopupShield() {
  if (typeof window !== 'undefined') {
    window.alert = function(msg) {
      const text = String(msg || '');
      const isErr = text.toLowerCase().includes('failed') || text.toLowerCase().includes('error') || text.toLowerCase().includes('invalid');
      const isWarn = text.toLowerCase().includes('required') || text.toLowerCase().includes('please select') || text.toLowerCase().includes('enter');
      const isSuccess = text.toLowerCase().includes('success') || text.toLowerCase().includes('broadcasted') || text.toLowerCase().includes('shared');
      
      const type = isErr ? 'error' : (isWarn ? 'warning' : (isSuccess ? 'success' : 'info'));
      const title = isErr ? 'Notice' : (isWarn ? 'Required Information' : (isSuccess ? 'Action Completed' : 'Notification'));
      
      showAlertModal({
        title: title,
        message: text,
        type: type,
        buttonText: 'Got it'
      });
    };
  }
}
