// StatCounter Analytics View Module
export function renderStatCounterView() {
  const statCounterUrl = 'https://statcounter.com/p12085651/summary/daily-pvn-last6months/?account_id=7287753&login_id=5&code=86100789cb77b82739c83e4722c821ac&guest_login=1';

  return `
    <div class="view-enter statcounter-view">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px; margin-bottom: 24px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
            <span style="font-size: 0.75rem; font-weight: 700; color: var(--os-luxury-orange); letter-spacing: 1px; text-transform: uppercase;">
              <i class="ri-line-chart-line" style="margin-right: 4px;"></i> WEB TRAFFIC & VISITOR ANALYTICS
            </span>
          </div>
          <h1 class="view-title" style="margin: 4px 0;">StatCounter Real-Time Analytics</h1>
          <p class="view-subtitle" style="margin: 0;">Monitor live visitor counts, page views, referring websites, and 6-month historical traffic trends for Thanjai Property.</p>
        </div>

        <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
          <a href="${statCounterUrl}" target="_blank" rel="noopener noreferrer" class="os-btn-primary" style="display: inline-flex; align-items: center; gap: 8px; text-decoration: none; padding: 10px 20px;">
            <i class="ri-external-link-line"></i> Launch StatCounter Portal
          </a>
        </div>
      </div>

      <!-- Quick Info Bar -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 24px;">
        <div style="background: #ffffff; border: 1px solid rgba(0,0,0,0.06); border-radius: 14px; padding: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
            <i class="ri-dashboard-3-line" style="color: #eb5e28; font-size: 1.2rem;"></i>
            <span style="font-size: 0.78rem; text-transform: uppercase; color: #777; font-weight: 700;">Reporting Period</span>
          </div>
          <h3 style="font-size: 1.3rem; font-weight: 800; color: #1a1a1a; margin: 0;">Last 6 Months (Daily PVN)</h3>
        </div>

        <div style="background: #ffffff; border: 1px solid rgba(0,0,0,0.06); border-radius: 14px; padding: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
            <i class="ri-shield-keyhole-line" style="color: #38a169; font-size: 1.2rem;"></i>
            <span style="font-size: 0.78rem; text-transform: uppercase; color: #777; font-weight: 700;">Authentication</span>
          </div>
          <h3 style="font-size: 1.3rem; font-weight: 800; color: #38a169; margin: 0;">Authorized Guest Session</h3>
        </div>

        <div style="background: #ffffff; border: 1px solid rgba(0,0,0,0.06); border-radius: 14px; padding: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
            <i class="ri-global-line" style="color: #3182ce; font-size: 1.2rem;"></i>
            <span style="font-size: 0.78rem; text-transform: uppercase; color: #777; font-weight: 700;">Project ID</span>
          </div>
          <h3 style="font-size: 1.3rem; font-weight: 800; color: #1a1a1a; margin: 0;">p12085651 (Account 7287753)</h3>
        </div>
      </div>

      <!-- Embedded Iframe / Portal Container -->
      <div style="background: #ffffff; border: 1px solid rgba(0,0,0,0.08); border-radius: 16px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.03);">
        <div style="padding: 14px 20px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="display: inline-block; width: 10px; height: 10px; background: #38a169; border-radius: 50%; box-shadow: 0 0 0 3px rgba(56, 161, 105, 0.2);"></span>
            <strong style="font-size: 0.9rem; color: #2d3748;">Live StatCounter Web Stream</strong>
          </div>
          <a href="${statCounterUrl}" target="_blank" rel="noopener noreferrer" style="font-size: 0.85rem; font-weight: 700; color: #eb5e28; text-decoration: none; display: inline-flex; align-items: center; gap: 4px;">
            Open full window <i class="ri-arrow-right-up-line"></i>
          </a>
        </div>

        <div style="position: relative; width: 100%; height: calc(100vh - 280px); min-height: 650px; background: #ffffff;">
          <iframe 
            src="${statCounterUrl}" 
            title="StatCounter Analytics Dashboard"
            style="width: 100%; height: 100%; border: none;"
            loading="lazy"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>
  `;
}
