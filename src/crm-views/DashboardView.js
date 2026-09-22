// src/crm-views/DashboardView.js — Interactive CRM Command Center
import { getProperties } from '../utils/propertiesStore.js';
import { getRegisteredUsers } from '../utils/userAuthStore.js';
import { filterLeadsForActiveUser, canViewAllLeads, getActiveAdminUser, getAdminUsers } from '../utils/adminUsersStore.js';
import { fetchFromAPI } from '../utils/api.js';
import { getLeads, consolidateLeadsByBuyer } from './LeadsView.js';
import { openPropertyModalById } from '../components/PropertyDetailModal.js';

function isSameDay(date1, date2) {
  if (!date1 || !date2) return false;
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return false;
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
}

function formatTimeOnly(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatCurrencyDisplay(val) {
  if (!val) return '—';
  const str = String(val).trim();
  if (str.includes('₹') || str.includes('Cr') || str.includes('Lakh')) return str;
  const num = parseFloat(str.replace(/[^0-9.]/g, ''));
  if (isNaN(num) || num <= 0) return str;
  if (num >= 10000000) return '₹ ' + (num / 10000000).toFixed(2).replace(/\.00$/, '') + ' Cr';
  if (num >= 100000) return '₹ ' + (num / 100000).toFixed(2).replace(/\.00$/, '') + ' L';
  return '₹ ' + num.toLocaleString('en-IN');
}

export function renderDashboardView() {
  const activeUser = getActiveAdminUser() || JSON.parse(localStorage.getItem('thanjai_active_user')) || { fullName: 'Admin', role: 'Super Admin' };
  const firstName = (activeUser.fullName || activeUser.name || 'Admin').split(' ')[0];
  
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  // Synchronously compute initial metrics so there is ZERO delay or placeholder flash
  let rawLeads = getLeads() || [];
  const consolidatedLeads = consolidateLeadsByBuyer(rawLeads);
  const visibleLeads = filterLeadsForActiveUser(consolidatedLeads, activeUser);

  const todayLeads = visibleLeads.filter(l => {
    if (!l) return false;
    if (l.createdAt && isSameDay(l.createdAt, now)) return true;
    if (l.date && isSameDay(l.date, now)) return true;
    return false;
  });

  let overdueFups = 0;
  let todayFups = 0;
  let upcomingFups = 0;
  visibleLeads.forEach(l => {
    if (!l) return;
    if (l.followup && l.followup !== '—' && l.followup !== '-') {
      const fDate = new Date(l.followup);
      if (!isNaN(fDate.getTime())) {
        if (isSameDay(fDate, now)) todayFups++;
        else if (fDate < now) overdueFups++;
        else upcomingFups++;
      }
    }
  });

  const hotLeads = visibleLeads.filter(l => {
    const p = (l.priority || '').toUpperCase();
    const s = (l.status || '').toLowerCase();
    return p === 'HIGH' || s === 'hot' || s === 'interested';
  });

  const stages = [
    { id: 'New', label: 'New Inquiries', icon: 'ri-sparkling-fill', color: '#0d9488', bg: '#f0fdfa' },
    { id: 'Contacted', label: 'Contacted', icon: 'ri-phone-fill', color: '#2563eb', bg: '#eff6ff' },
    { id: 'Property Shared', label: 'Property Shared', icon: 'ri-share-forward-fill', color: '#9333ea', bg: '#faf5ff' },
    { id: 'Follow Up', label: 'Follow Up', icon: 'ri-time-fill', color: '#ea580c', bg: '#fff7ed' },
    { id: 'Site Visit / Tour', label: 'Site Visit / Tour', icon: 'ri-map-pin-user-fill', color: '#d97706', bg: '#fffbeb' },
    { id: 'Negotiation', label: 'Negotiation', icon: 'ri-scales-3-fill', color: '#0284c7', bg: '#f0f9ff' },
    { id: 'Converted', label: 'Closed / Won', icon: 'ri-trophy-fill', color: '#16a34a', bg: '#f0fdf4' }
  ];
  const totalPipelineCount = visibleLeads.length || 1;
  const rawProps = getProperties() || [];
  const staffMembers = getAdminUsers().filter(u => u.status === 'Active' || !u.status);

  const totalPropsCount = rawProps.length;
  const availableCount = rawProps.filter(p => (p.status || '').toLowerCase() === 'available' && p.approvalStatus !== 'Pending Approval').length;
  const pendingCount = rawProps.filter(p => p.approvalStatus === 'Pending Approval' || (p.status || '').toLowerCase() === 'pending approval').length;
  const bookedCount = rawProps.filter(p => (p.status || '').toLowerCase() === 'booked').length;
  const soldCount = rawProps.filter(p => (p.status || '').toLowerCase() === 'sold').length;
  const inactiveCount = rawProps.filter(p => (p.status || '').toLowerCase() === 'inactive').length;

  const todayProps = rawProps.filter(p => {
    if (!p) return false;
    if (p.createdAt && isSameDay(p.createdAt, now)) return true;
    return false;
  });

  const displayRecentProps = [...rawProps].sort((a, b) => {
    const isAvailA = (a.status || '').toLowerCase() === 'available' ? 1 : 0;
    const isAvailB = (b.status || '').toLowerCase() === 'available' ? 1 : 0;
    if (isAvailA !== isAvailB) return isAvailB - isAvailA;
    const timeA = a && a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b && b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return timeB - timeA;
  }).slice(0, 5);

  const totalWonCount = visibleLeads.filter(l => ['converted', 'registration'].includes((l.status || '').toLowerCase())).length;

  return `
    <div class="view-enter command-center-view">
      <!-- 1. Top Luxury Header & Greeting -->
      <div class="os-hero command-hero">
        <div class="hero-text">
          <div class="hero-date-badge">
            <i class="ri-calendar-check-line"></i> ${dateFormatted}
          </div>
          <h1>Good Day,<br/>${firstName}</h1>
          <p class="hero-subtext">Real-Time CRM Command Center. Click any metric or card to drill down directly into records.</p>
        </div>
        
        <!-- Dynamic AI Morning Brief -->
        <div class="hero-ai-summary">
          <div class="ai-summary-title">
            <i class="ri-sparkling-fill" style="color: #f59e0b;"></i> AI Business Intelligence Brief
          </div>
          <ul class="ai-summary-list" id="dashboard-ai-brief-list">
            <li id="ai-brief-item-1"><i class="ri-fire-fill" style="color: #ef4444; flex-shrink: 0; margin-top: 2px;"></i> <span><strong>${hotLeads.length} high-priority leads</strong> requiring executive attention today.</span></li>
            <li id="ai-brief-item-2"><i class="ri-calendar-event-line" style="color: #3b82f6; flex-shrink: 0; margin-top: 2px;"></i> <span><strong>0 site visits</strong> scheduled for today across verified properties.</span></li>
            <li id="ai-brief-item-3"><i class="ri-time-line" style="color: #f59e0b; flex-shrink: 0; margin-top: 2px;"></i> <span><strong>${todayFups} follow-up conversations</strong> due today with prospective buyers${overdueFups > 0 ? ` (${overdueFups} overdue)` : ''}.</span></li>
          </ul>
        </div>
      </div>

      <!-- 2. Today's Key Actionable Metrics (5 Core KPI Cards) -->
      <div class="command-section-title">
        <span><i class="ri-flashlight-fill" style="color: #eb5e28;"></i> Today's Focus & Action Metrics</span>
        <small style="font-weight: 500; color: #64748b;">Click any card to open the filtered CRM list</small>
      </div>

      <div class="kpi-grid command-kpi-grid">
        <!-- 1. Today's Leads -->
        <div class="kpi-card command-kpi-card hover-lift" data-action="navigate" data-route="leads" data-query="date=today" title="Click to view today's leads in CRM Pipeline">
          <div class="kpi-header">
            <span class="kpi-title">TODAY'S LEADS</span>
            <div class="kpi-icon" style="background: #e6fffa; color: #0d9488;"><i class="ri-user-add-line"></i></div>
          </div>
          <div class="kpi-value-row">
            <div class="kpi-value count-up" id="kpi-today-leads">${todayLeads.length}</div>
            <span class="command-drilldown-pill"><i class="ri-arrow-right-up-line"></i> View</span>
          </div>
          <div class="kpi-subtext" id="kpi-today-leads-sub">${todayLeads.length === 0 ? 'No new leads today' : `${todayLeads.length} new lead${todayLeads.length > 1 ? 's' : ''} received`}</div>
        </div>

        <!-- 2. Follow-ups Due Today -->
        <div class="kpi-card command-kpi-card hover-lift" data-action="navigate" data-route="leads" data-query="followup=today" title="Click to view leads requiring follow-up today">
          <div class="kpi-header">
            <span class="kpi-title">FOLLOW-UPS DUE TODAY</span>
            <div class="kpi-icon" style="background: #fff7ed; color: #ea580c;"><i class="ri-calendar-event-fill"></i></div>
          </div>
          <div class="kpi-value-row">
            <div class="kpi-value count-up" id="kpi-followups-due">${todayFups}</div>
            <span class="command-drilldown-pill"><i class="ri-arrow-right-up-line"></i> View</span>
          </div>
          <div class="kpi-subtext" id="kpi-followups-due-sub">${todayFups === 0 ? (overdueFups > 0 ? `${overdueFups} in pending follow-up queue` : 'No follow-ups due today') : `${todayFups} follow-up${todayFups > 1 ? 's' : ''} due today`}</div>
        </div>

        <!-- 3. Properties Posted Today -->
        <div class="kpi-card command-kpi-card hover-lift" data-action="navigate" data-route="properties" data-query="date=today" title="Click to view properties posted today">
          <div class="kpi-header">
            <span class="kpi-title">PROPERTIES POSTED TODAY</span>
            <div class="kpi-icon" style="background: #faf5ff; color: #9333ea;"><i class="ri-community-line"></i></div>
          </div>
          <div class="kpi-value-row">
            <div class="kpi-value count-up" id="kpi-today-props">${todayProps.length}</div>
            <span class="command-drilldown-pill"><i class="ri-arrow-right-up-line"></i> View</span>
          </div>
          <div class="kpi-subtext" id="kpi-today-props-sub">${todayProps.length === 0 ? 'No properties posted today' : `${todayProps.length} property posted today`}</div>
        </div>

        <!-- 4. Site Visits Today -->
        <div class="kpi-card command-kpi-card hover-lift" data-action="navigate" data-route="visits" data-query="date=today" title="Click to view appointments scheduled for today">
          <div class="kpi-header">
            <span class="kpi-title">SITE VISITS TODAY</span>
            <div class="kpi-icon" style="background: #eff6ff; color: #2563eb;"><i class="ri-map-pin-user-fill"></i></div>
          </div>
          <div class="kpi-value-row">
            <div class="kpi-value count-up" id="kpi-today-visits">0</div>
            <span class="command-drilldown-pill"><i class="ri-arrow-right-up-line"></i> View</span>
          </div>
          <div class="kpi-subtext" id="kpi-today-visits-sub">Ready for site appointments</div>
        </div>

        <!-- 5. High Priority / Hot Leads -->
        <div class="kpi-card command-kpi-card hover-lift" data-action="navigate" data-route="leads" data-query="priority=High" title="Click to view high priority hot leads">
          <div class="kpi-header">
            <span class="kpi-title">HIGH PRIORITY LEADS</span>
            <div class="kpi-icon" style="background: #fef2f2; color: #dc2626;"><i class="ri-fire-fill"></i></div>
          </div>
          <div class="kpi-value-row">
            <div class="kpi-value count-up" id="kpi-hot-leads">${hotLeads.length}</div>
            <span class="command-drilldown-pill"><i class="ri-arrow-right-up-line"></i> View</span>
          </div>
          <div class="kpi-subtext" id="kpi-hot-leads-sub">${hotLeads.length === 0 ? 'All leads prioritized' : `${hotLeads.length} hot lead${hotLeads.length > 1 ? 's' : ''} ready`}</div>
        </div>
      </div>

      <!-- 3. Overall CRM & Interactive Lead Pipeline Overview -->
      <div class="os-chart-card command-pipeline-card">
        <div class="os-chart-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
          <div style="display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 1.05rem; color: #1e293b;">
            <i class="ri-node-tree" style="color: #eb5e28;"></i> Overall CRM Portfolio & Live Pipeline Overview
          </div>
          <button class="os-btn-secondary command-action-btn" data-action="navigate" data-route="leads" style="padding: 6px 14px; font-size: 0.82rem;">
            <i class="ri-team-line"></i> Open CRM Pipeline
          </button>
        </div>
        <p class="chart-subtext" style="margin: 4px 0 16px 0; color: #64748b; font-size: 0.88rem;">
          High-level operational overview across all CRM leads, property portfolio, scheduled visits, and active conversion stages.
        </p>

        <!-- Overall CRM Performance Summary Row -->
        <div class="crm-overall-summary-bar">
          <div class="crm-summary-item" data-action="navigate" data-route="leads" title="Click to view all CRM leads">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
              <i class="ri-team-fill"></i>
            </div>
            <div>
              <div style="font-size: 0.74rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Total CRM Leads</div>
              <div style="font-size: 1.25rem; font-weight: 800; color: #1e293b;" id="crm-total-leads">${visibleLeads.length}</div>
            </div>
          </div>

          <div class="crm-summary-item" data-action="navigate" data-route="properties" title="Click to view all properties">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #fdf4ff; color: #9333ea; display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
              <i class="ri-building-fill"></i>
            </div>
            <div>
              <div style="font-size: 0.74rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Total Properties</div>
              <div style="font-size: 1.25rem; font-weight: 800; color: #1e293b;" id="crm-total-props">${totalPropsCount}</div>
            </div>
          </div>

          <div class="crm-summary-item" data-action="navigate" data-route="visits" data-query="filter=all" title="Click to view all site visits">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #fff7ed; color: #ea580c; display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
              <i class="ri-map-pin-user-fill"></i>
            </div>
            <div>
              <div style="font-size: 0.74rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Total Site Visits</div>
              <div style="font-size: 1.25rem; font-weight: 800; color: #1e293b;" id="crm-total-visits">0</div>
            </div>
          </div>

          <div class="crm-summary-item" data-action="navigate" data-route="leads" data-query="status=Converted" title="Click to view closed / won leads">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: #f0fdf4; color: #16a34a; display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
              <i class="ri-trophy-fill"></i>
            </div>
            <div>
              <div style="font-size: 0.74rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Closed / Won Deals</div>
              <div style="font-size: 1.25rem; font-weight: 800; color: #16a34a;" id="crm-total-won">${totalWonCount}</div>
            </div>
          </div>
        </div>

        <div class="pipeline-stages-grid" id="pipeline-stages-container">
          ${stages.map(st => {
            const count = visibleLeads.filter(l => {
              const s = (l.status || '').toLowerCase().trim();
              if (st.id === 'New') return s === 'new' || s === 'new lead' || s.startsWith('new') || s.includes('inquir');
              if (st.id === 'Contacted') return s === 'contacted' || s === 'initial contact';
              if (st.id === 'Property Shared') return s === 'property shared' || s === 'property matching' || s.includes('shared') || s.includes('requirement');
              if (st.id === 'Follow Up') return s === 'follow up' || s === 'follow up pending' || s.includes('follow') || s.includes('callback');
              if (st.id === 'Site Visit / Tour' || st.id === 'Interested') return s === 'interested' || s === 'site visit scheduled' || s === 'site visit completed' || s.includes('site visit') || s.includes('tour');
              if (st.id === 'Negotiation') return s === 'negotiation' || s === 'bank loan' || s.includes('loan');
              if (st.id === 'Converted') return s === 'converted' || s === 'registration' || s.includes('won') || s.includes('closed');
              return false;
            }).length;
            const pct = Math.round((count / totalPipelineCount) * 100);
            return `
              <div class="stage-card hover-lift" data-action="navigate" data-route="leads" data-query="status=${encodeURIComponent(st.id)}" style="background: ${st.bg}; border-color: ${st.color}33;" title="Click to open '${st.label}' in CRM Pipeline">
                <div class="stage-header">
                  <span class="stage-name" style="color: ${st.color}; font-weight: 800;">
                    <i class="${st.icon}"></i> ${st.label}
                  </span>
                  <span class="stage-pct" style="background: ${st.color}18; color: ${st.color};">${pct}%</span>
                </div>
                <div class="stage-count" style="color: #1e293b;">${count}</div>
                <div class="stage-footer">
                  <span style="font-size: 0.74rem; color: #64748b;">${count === 0 ? 'No leads in stage' : `${count} active lead${count > 1 ? 's' : ''}`}</span>
                  <i class="ri-arrow-right-line" style="color: ${st.color}; font-size: 0.9rem;"></i>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- 4. Two-Column Layout: Today's Leads Table + Today's Site Visits & Follow-ups -->
      <div class="command-dual-grid">
        
        <!-- Left: Today's Leads Detailed Table -->
        <div class="os-chart-card command-table-card">
          <div class="os-chart-header" style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 1rem; color: #1e293b;">
              <i class="ri-user-follow-line" style="color: #0d9488;"></i> Today's Inbound Leads (<span id="today-leads-table-count">${todayLeads.length}</span>)
            </div>
            <button class="os-btn-secondary" data-action="navigate" data-route="leads" data-query="date=today" style="padding: 5px 12px; font-size: 0.8rem;">
              View All Today's Leads <i class="ri-arrow-right-line"></i>
            </button>
          </div>

          <div class="table-responsive" style="margin-top: 12px; max-height: 380px; overflow-y: auto;">
            <table class="command-data-table today-leads-table" style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.84rem;">
              <thead>
                <tr style="border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 0.73rem; text-transform: uppercase; background: #f8fafc;">
                  <th style="padding: 8px 10px;">Lead Name</th>
                  <th style="padding: 8px 10px;">Phone</th>
                  <th style="padding: 8px 10px;">Requirement</th>
                  <th style="padding: 8px 8px;">Source</th>
                  <th style="padding: 8px 8px;">Stage</th>
                  <th style="padding: 8px 10px;">Assigned</th>
                  <th style="padding: 8px 10px; text-align: right;">Time</th>
                </tr>
              </thead>
              <tbody id="today-leads-tbody">
                ${todayLeads.length === 0 ? `
                  <tr>
                    <td colspan="7" style="padding: 32px 16px; text-align: center; color: #64748b;">
                      <i class="ri-inbox-line" style="font-size: 2rem; color: #cbd5e1; display: block; margin-bottom: 8px;"></i>
                      <strong>No new leads received today yet.</strong>
                      <p style="margin: 4px 0 0 0; font-size: 0.8rem; color: #94a3b8;">New website inquiries, WhatsApp contacts, and portal registrations will appear here in real time.</p>
                    </td>
                  </tr>
                ` : todayLeads.slice(0, 10).map(l => {
                  const timeStr = formatTimeOnly(l.createdAt || l.date) || 'Today';
                  const assignedStaff = l.assignedTo || l.assignTo || 'Unassigned';
                  return `
                    <tr class="interactive-table-row" data-action="navigate" data-route="lead/${l.id}" title="Click to view lead details" style="cursor: pointer; border-bottom: 1px solid #f1f5f9; transition: background 0.15s;">
                      <td style="padding: 8px 10px; font-weight: 700; color: #1e293b; white-space: nowrap;">${l.name || 'Anonymous Lead'}</td>
                      <td style="padding: 8px 10px; color: #475569; font-family: monospace; font-size: 0.8rem; white-space: nowrap;">${l.phone || l.mobile || '—'}</td>
                      <td style="padding: 8px 10px; color: #64748b; max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                        ${l.propertyId ? `<span class="prop-id-badge" data-propid="${l.propertyId}" style="cursor:pointer; color:#eb5e28; font-weight:700;">${l.propertyId}</span> ` : ''}
                        ${l.requirement || l.type || 'Property Inquiry'}
                      </td>
                      <td style="padding: 8px 8px; white-space: nowrap;"><span class="os-badge" style="background: #f1f5f9; color: #475569; font-size: 0.7rem; padding: 2px 5px; border-radius: 4px;">${l.source || 'Website'}</span></td>
                      <td style="padding: 8px 8px; white-space: nowrap;"><span class="os-badge" style="background: #e6fffa; color: #0d9488; font-weight: 700; font-size: 0.72rem; padding: 2px 6px; border-radius: 6px;">${l.status || 'New'}</span></td>
                      <td style="padding: 8px 10px; color: #334155; font-weight: 600; font-size: 0.8rem; white-space: nowrap;">${assignedStaff}</td>
                      <td style="padding: 8px 10px; text-align: right; color: #94a3b8; font-size: 0.75rem; white-space: nowrap;">${timeStr}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Right: Today's Site Visits & Follow-Up Tracking -->
        <div style="display: flex; flex-direction: column; gap: 20px;">
          
          <!-- Today's Site Visits -->
          <div class="os-chart-card" style="padding: 20px;">
            <div class="os-chart-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <div style="display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 0.98rem; color: #1e293b;">
                <i class="ri-map-pin-range-line" style="color: #2563eb;"></i> Today's Site Visits (<span id="today-visits-badge-count">0</span>)
              </div>
              <button class="os-btn-secondary" data-action="navigate" data-route="visits" data-query="date=today" style="padding: 4px 10px; font-size: 0.78rem;">
                Open Schedule <i class="ri-arrow-right-line"></i>
              </button>
            </div>
            
            <div id="today-visits-list" style="display: flex; flex-direction: column; gap: 10px; max-height: 200px; overflow-y: auto;">
              <div class="empty-state-card" style="padding: 16px; text-align: center; background: #f8fafc; border-radius: 8px; border: 1px dashed #cbd5e1; color: #64748b; font-size: 0.84rem;">
                <i class="ri-calendar-todo-line" style="font-size: 1.4rem; color: #94a3b8; display: block; margin-bottom: 4px;"></i>
                No site visits scheduled for today. Ready for appointments.
              </div>
            </div>
          </div>

          <!-- Follow-Up Overview (Overdue, Due Today, Upcoming) -->
          <div class="os-chart-card" style="padding: 20px;">
            <div class="os-chart-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <div style="display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 0.98rem; color: #1e293b;">
                <i class="ri-time-line" style="color: #ea580c;"></i> Follow-Up Status Tracker
              </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
              <div class="followup-box overdue hover-lift" data-action="navigate" data-route="leads" data-query="followup=overdue" title="Click to view overdue follow-ups">
                <span class="fup-label">Overdue</span>
                <span class="fup-count" id="fup-overdue-count">${overdueFups}</span>
                <small class="fup-hint">Scheduled Queue</small>
              </div>

              <div class="followup-box today hover-lift" data-action="navigate" data-route="leads" data-query="followup=today" title="Click to view follow-ups scheduled for today">
                <span class="fup-label">Due Today</span>
                <span class="fup-count" id="fup-today-count">${todayFups}</span>
                <small class="fup-hint">Today's Queue</small>
              </div>

              <div class="followup-box upcoming hover-lift" data-action="navigate" data-route="leads" data-query="followup=upcoming" title="Click to view upcoming follow-ups">
                <span class="fup-label">Upcoming</span>
                <span class="fup-count" id="fup-upcoming-count">${upcomingFups}</span>
                <small class="fup-hint">Next 7 Days</small>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- 5. Staff Performance Matrix -->
      <div class="os-chart-card command-staff-card">
        <div class="os-chart-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
          <div style="display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 1.05rem; color: #1e293b;">
            <i class="ri-user-star-line" style="color: #9333ea;"></i> Staff Performance & Operational Workload
          </div>
          <span style="font-size: 0.78rem; background: #f3e8ff; color: #7e22ce; padding: 4px 12px; border-radius: 20px; font-weight: 800;">
            Click any metric to view that staff member's records
          </span>
        </div>
        <p class="chart-subtext" style="margin: 4px 0 16px 0; color: #64748b; font-size: 0.88rem;">
          Real-time workload metrics computed directly from active properties, assigned leads, follow-ups, and site visits.
        </p>

        <div class="table-responsive">
          <table class="command-data-table staff-perf-table" style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.88rem;">
            <thead>
              <tr style="border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 0.76rem; text-transform: uppercase; background: #f8fafc;">
                <th style="padding: 12px 16px;">Staff Member</th>
                <th style="padding: 12px 16px;">Role</th>
                <th style="padding: 12px 16px; text-align: center;">Properties Listed</th>
                <th style="padding: 12px 16px; text-align: center;">Total Leads</th>
                <th style="padding: 12px 16px; text-align: center;">Follow-ups Due</th>
                <th style="padding: 12px 16px; text-align: center;">Site Visits</th>
                <th style="padding: 12px 16px; text-align: center;">Converted / Won</th>
                <th style="padding: 12px 16px; text-align: right;">Drill-Down Action</th>
              </tr>
            </thead>
            <tbody id="staff-perf-tbody">
              ${staffMembers.length === 0 ? `
                <tr><td colspan="8" style="padding: 24px; text-align: center; color: #94a3b8;">No staff members configured in admin settings.</td></tr>
              ` : staffMembers.map(staff => {
                const sName = staff.fullName || staff.name || 'Staff';
                const sRole = staff.role || 'Sales Executive';
                const propsCount = rawProps.filter(p => {
                  const lBy = (p.listedBy || '').toLowerCase();
                  const own = (p.ownerName || p.actualOwnerName || '').toLowerCase();
                  const uId = String(p.userId || '');
                  const target = sName.toLowerCase();
                  return lBy.includes(target) || own.includes(target) || uId === String(staff.id);
                }).length;
                const staffLeads = visibleLeads.filter(l => (l.assignedTo || l.assignTo || '').toLowerCase().includes(sName.toLowerCase()));
                const leadsCount = staffLeads.length;
                const staffFups = staffLeads.filter(l => {
                  if (l.followup && l.followup !== '—' && l.followup !== '-') {
                    const d = new Date(l.followup);
                    if (!isNaN(d.getTime())) return isSameDay(d, now) || d < now;
                  }
                  return false;
                }).length;
                const staffWon = staffLeads.filter(l => ['converted', 'registration'].includes((l.status || '').toLowerCase())).length;

                return `
                  <tr style="border-bottom: 1px solid #f1f5f9; transition: background 0.15s;">
                    <td style="padding: 12px 16px; font-weight: 700; color: #1e293b;">
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="width: 28px; height: 28px; border-radius: 50%; background: #e0e7ff; color: #4338ca; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.78rem;">
                          ${sName.charAt(0).toUpperCase()}
                        </div>
                        <span>${sName}</span>
                      </div>
                    </td>
                    <td style="padding: 12px 16px; color: #64748b; font-size: 0.82rem;">${sRole}</td>
                    
                    <td style="padding: 12px 16px; text-align: center;">
                      <span class="command-metric-click" data-route="properties" data-query="search=${encodeURIComponent(sName)}" title="Filter properties posted by ${sName}">
                        ${propsCount > 0 ? `<strong style="color: #0284c7;">${propsCount}</strong>` : '<span style="color:#cbd5e1;">0</span>'}
                      </span>
                    </td>

                    <td style="padding: 12px 16px; text-align: center;">
                      <span class="command-metric-click" data-route="leads" data-query="staff=${encodeURIComponent(sName)}" title="Filter leads assigned to ${sName}">
                        ${leadsCount > 0 ? `<strong style="color: #0d9488;">${leadsCount}</strong>` : '<span style="color:#cbd5e1;">0</span>'}
                      </span>
                    </td>

                    <td style="padding: 12px 16px; text-align: center;">
                      <span class="command-metric-click" data-route="leads" data-query="staff=${encodeURIComponent(sName)}&due=true" title="Filter pending follow-ups for ${sName}">
                        ${staffFups > 0 ? `<strong style="color: #ea580c;">${staffFups}</strong>` : '<span style="color:#cbd5e1;">0</span>'}
                      </span>
                    </td>

                    <td style="padding: 12px 16px; text-align: center;">
                      <span class="command-metric-click staff-visits-cell" data-staff="${encodeURIComponent(sName)}" data-route="visits" data-query="staff=${encodeURIComponent(sName)}" title="Filter site visits for ${sName}">
                        <span style="color:#cbd5e1;">0</span>
                      </span>
                    </td>

                    <td style="padding: 12px 16px; text-align: center;">
                      <span class="command-metric-click" data-route="leads" data-query="staff=${encodeURIComponent(sName)}&status=Converted" title="Filter converted leads for ${sName}">
                        ${staffWon > 0 ? `<strong style="color: #16a34a;">${staffWon}</strong>` : '<span style="color:#cbd5e1;">0</span>'}
                      </span>
                    </td>

                    <td style="padding: 12px 16px; text-align: right;">
                      <button class="os-btn-secondary" data-action="navigate" data-route="leads" data-query="staff=${encodeURIComponent(sName)}" style="padding: 4px 10px; font-size: 0.75rem;">
                        View Pipeline <i class="ri-arrow-right-s-line"></i>
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- 6. Property Inventory Breakdown & Recently Posted Properties -->
      <div class="command-dual-grid">
        
        <!-- Left: Property Inventory Status Breakdown -->
        <div class="os-chart-card" style="padding: 24px;">
          <div class="os-chart-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <div style="display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 1.05rem; color: #1e293b;">
              <i class="ri-building-line" style="color: #0284c7;"></i> Property Inventory Status
            </div>
            <button class="os-btn-secondary" data-action="navigate" data-route="properties" style="padding: 5px 12px; font-size: 0.8rem;">
              Full Inventory <i class="ri-arrow-right-line"></i>
            </button>
          </div>

          <div class="property-status-grid" id="property-status-counters">
            <div class="prop-status-card total hover-lift" data-action="navigate" data-route="properties" title="View all properties in inventory">
              <div class="psc-icon" style="color: #7e22ce;"><i class="ri-community-line"></i></div>
              <div class="psc-count" id="prop-count-total" style="color: #7e22ce;">${totalPropsCount}</div>
              <div class="psc-label" style="color: #7e22ce;">Total Listings</div>
            </div>

            <div class="prop-status-card available hover-lift" data-action="navigate" data-route="properties" data-query="status=available" title="View available live properties">
              <div class="psc-icon"><i class="ri-checkbox-circle-fill"></i></div>
              <div class="psc-count" id="prop-count-available">${availableCount}</div>
              <div class="psc-label">Available</div>
            </div>

            <div class="prop-status-card pending hover-lift" data-action="navigate" data-route="approvals" title="View properties pending approval">
              <div class="psc-icon"><i class="ri-time-fill"></i></div>
              <div class="psc-count" id="prop-count-pending">${pendingCount}</div>
              <div class="psc-label">Pending Approval</div>
            </div>

            <div class="prop-status-card booked hover-lift" data-action="navigate" data-route="properties" data-query="status=booked" title="View booked properties">
              <div class="psc-icon"><i class="ri-bookmark-fill"></i></div>
              <div class="psc-count" id="prop-count-booked">${bookedCount}</div>
              <div class="psc-label">Booked</div>
            </div>

            <div class="prop-status-card inactive hover-lift" data-action="navigate" data-route="properties" data-query="status=inactive" title="View inactive listings">
              <div class="psc-icon" style="color: #64748b;"><i class="ri-archive-line"></i></div>
              <div class="psc-count" id="prop-count-inactive" style="color: #475569;">${inactiveCount}</div>
              <div class="psc-label" style="color: #64748b;">Inactive / Draft</div>
            </div>
          </div>

          <!-- WhatsApp Activity Summary Preview -->
          <div class="wa-dashboard-preview-card" style="margin-top: 20px; padding: 16px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 40px; height: 40px; border-radius: 50%; background: #22c55e; color: white; display: flex; align-items: center; justify-content: center; font-size: 1.3rem;">
                <i class="ri-whatsapp-fill"></i>
              </div>
              <div>
                <div style="font-weight: 800; font-size: 0.92rem; color: #166534;">WhatsApp Live Activity</div>
                <div style="font-size: 0.8rem; color: #15803d;" id="wa-dashboard-status-text">Connected to live SmartPing webhook</div>
              </div>
            </div>
            <button class="os-btn-primary" data-action="navigate" data-route="whatsapp" style="background: #22c55e; border-color: #22c55e; padding: 6px 14px; font-size: 0.82rem;">
              Open WhatsApp Inbox <i class="ri-chat-3-line"></i>
            </button>
          </div>
        </div>

        <!-- Right: Recently Posted Properties -->
        <div class="os-chart-card" style="padding: 24px;">
          <div class="os-chart-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 1.05rem; color: #1e293b;">
              <i class="ri-history-line" style="color: #eb5e28;"></i> Recently Posted Properties
            </div>
            <button class="os-btn-secondary" data-action="navigate" data-route="properties" style="padding: 5px 12px; font-size: 0.8rem;">
              View All <i class="ri-arrow-right-line"></i>
            </button>
          </div>

          <div id="recent-properties-list" style="display: flex; flex-direction: column; gap: 10px;">
            ${displayRecentProps.length === 0 ? `
              <div class="empty-state-card" style="padding: 16px; text-align: center; color: #94a3b8;">No properties in inventory.</div>
            ` : displayRecentProps.map(p => {
              const thumb = (p.images && p.images.length > 0) ? p.images[0] : '/default-property.jpg';
              const priceStr = p.priceFormatted || formatCurrencyDisplay(p.price);
              const statusBadgeBg = p.status === 'Available' ? '#f0fdf4' : '#fff7ed';
              const statusBadgeColor = p.status === 'Available' ? '#16a34a' : '#ea580c';
              return `
                <div class="recent-prop-row hover-lift" data-propid="${p.id}">
                  <div class="recent-prop-info">
                    <img src="${thumb}" alt="${p.title || 'Property'}" class="recent-prop-thumb" onerror="this.src='/default-property.jpg'" />
                    <div class="recent-prop-details">
                      <div class="recent-prop-title">${p.title || 'Untitled Property'}</div>
                      <div class="recent-prop-sub">${p.location || 'Thanjavur'} • <span style="color: #eb5e28; font-weight: 600;">${p.id || ''}</span></div>
                    </div>
                  </div>
                  <div class="recent-prop-meta">
                    <div class="recent-prop-price">${priceStr}</div>
                    <span class="os-badge" style="background: ${statusBadgeBg}; color: ${statusBadgeColor}; font-size: 0.72rem; padding: 2px 6px; border-radius: 4px;">${p.status || 'Available'}</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

      </div>

    </div>
  `;
}

export function initDashboardListeners() {
  // 1. Bind all generic navigation triggers
  document.querySelectorAll('[data-action="navigate"]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const route = el.dataset.route;
      const query = el.dataset.query;
      if (route) {
        const fullHash = route + (query ? `?${query}` : '');
        if (typeof window.navigateToView === 'function') {
          window.navigateToView(route, query);
        }
        window.location.hash = '#' + fullHash;
      }
    });
  });

  // 2. Bind metric clicks
  document.querySelectorAll('.command-metric-click').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const route = btn.dataset.route;
      const query = btn.dataset.query;
      if (route) {
        window.location.hash = '#' + route + (query ? `?${query}` : '');
      }
    });
  });

  // 3. Bind recent property clicks to open detail modal
  document.querySelectorAll('.recent-prop-row').forEach(row => {
    row.addEventListener('click', () => {
      const propId = row.dataset.propid;
      if (propId) openPropertyModalById(propId);
    });
  });

  // 4. Load and compute all real live data
  loadCommandCenterData();
}

async function loadCommandCenterData() {
  const now = new Date();
  let siteVisits = [];
  let todayVisitsList = [];

  const updateAiBrief = (visitsCount = 0) => {
    const aiBriefList = document.getElementById('dashboard-ai-brief-list');
    const rawLeads = getLeads() || [];
    const activeAdmin = getActiveAdminUser() || { fullName: 'Admin' };
    const visibleLeads = filterLeadsForActiveUser(consolidateLeadsByBuyer(rawLeads), activeAdmin);
    const hotLeads = visibleLeads.filter(l => {
      const p = (l.priority || '').toUpperCase();
      const s = (l.status || '').toLowerCase();
      return p === 'HIGH' || s === 'hot' || s === 'interested';
    });
    let todayFups = 0;
    let overdueFups = 0;
    visibleLeads.forEach(l => {
      if (l && l.followup && l.followup !== '—' && l.followup !== '-') {
        const fDate = new Date(l.followup);
        if (!isNaN(fDate.getTime())) {
          if (isSameDay(fDate, now)) todayFups++;
          else if (fDate < now) overdueFups++;
        }
      }
    });

    if (aiBriefList) {
      aiBriefList.innerHTML = `
        <li><i class="ri-fire-fill" style="color: #ef4444; flex-shrink: 0; margin-top: 2px;"></i> <span><strong>${hotLeads.length} high-priority leads</strong> requiring executive attention today.</span></li>
        <li><i class="ri-calendar-event-line" style="color: #3b82f6; flex-shrink: 0; margin-top: 2px;"></i> <span><strong>${visitsCount} site visits</strong> scheduled for today across verified properties.</span></li>
        <li><i class="ri-time-line" style="color: #f59e0b; flex-shrink: 0; margin-top: 2px;"></i> <span><strong>${todayFups} follow-up conversations</strong> due today with prospective buyers${overdueFups > 0 ? ` (${overdueFups} overdue)` : ''}.</span></li>
      `;
    }
  };

  // Sync Properties live status counters
  try {
    const updatedProps = getProperties() || [];
    const tCount = updatedProps.length;
    const aCount = updatedProps.filter(p => (p.status || '').toLowerCase() === 'available' && p.approvalStatus !== 'Pending Approval').length;
    const pCount = updatedProps.filter(p => p.approvalStatus === 'Pending Approval' || (p.status || '').toLowerCase() === 'pending approval').length;
    const bCount = updatedProps.filter(p => (p.status || '').toLowerCase() === 'booked').length;
    const sCount = updatedProps.filter(p => (p.status || '').toLowerCase() === 'sold').length;
    const iCount = updatedProps.filter(p => (p.status || '').toLowerCase() === 'inactive').length;

    const elTotal = document.getElementById('prop-count-total');
    const elAvail = document.getElementById('prop-count-available');
    const elPending = document.getElementById('prop-count-pending');
    const elBooked = document.getElementById('prop-count-booked');
    const elInactive = document.getElementById('prop-count-inactive');

    if (elTotal) elTotal.textContent = tCount;
    if (elAvail) elAvail.textContent = aCount;
    if (elPending) elPending.textContent = pCount;
    if (elBooked) elBooked.textContent = bCount;
    if (elInactive) elInactive.textContent = iCount;

    // Update today's posted properties KPI card
    const todayPropsLive = updatedProps.filter(p => p && p.createdAt && isSameDay(p.createdAt, now));
    const kpiTodayProps = document.getElementById('kpi-today-props');
    const kpiTodayPropsSub = document.getElementById('kpi-today-props-sub');
    if (kpiTodayProps) kpiTodayProps.textContent = todayPropsLive.length;
    if (kpiTodayPropsSub) {
      kpiTodayPropsSub.textContent = todayPropsLive.length === 0 ? 'No properties posted today' : `${todayPropsLive.length} property posted today`;
    }

    // Update Overall CRM summary counters
    const crmTotalPropsEl = document.getElementById('crm-total-props');
    if (crmTotalPropsEl) crmTotalPropsEl.textContent = tCount;

    const rawLeadsLive = getLeads() || [];
    const crmTotalLeadsEl = document.getElementById('crm-total-leads');
    if (crmTotalLeadsEl) crmTotalLeadsEl.textContent = rawLeadsLive.length;

    const crmTotalWonEl = document.getElementById('crm-total-won');
    if (crmTotalWonEl) {
      crmTotalWonEl.textContent = rawLeadsLive.filter(l => ['converted', 'registration'].includes((l.status || '').toLowerCase())).length;
    }

    // Refresh Recent Properties list with active/verified listings
    const recentListEl = document.getElementById('recent-properties-list');
    if (recentListEl && updatedProps.length > 0) {
      const topRecent = [...updatedProps].sort((a, b) => {
        const isAvailA = (a.status || '').toLowerCase() === 'available' ? 1 : 0;
        const isAvailB = (b.status || '').toLowerCase() === 'available' ? 1 : 0;
        if (isAvailA !== isAvailB) return isAvailB - isAvailA;
        const timeA = a && a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b && b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      }).slice(0, 5);

      recentListEl.innerHTML = topRecent.map(p => {
        const thumb = (p.images && p.images.length > 0) ? p.images[0] : '/default-property.jpg';
        const priceStr = p.priceFormatted || formatCurrencyDisplay(p.price);
        const statusBadgeBg = p.status === 'Available' ? '#f0fdf4' : '#fff7ed';
        const statusBadgeColor = p.status === 'Available' ? '#16a34a' : '#ea580c';
        return `
          <div class="recent-prop-row hover-lift" data-propid="${p.id}" style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; cursor: pointer;">
            <div style="display: flex; align-items: center; gap: 12px; overflow: hidden;">
              <img src="${thumb}" alt="${p.title || 'Property'}" style="width: 44px; height: 44px; border-radius: 8px; object-fit: cover; flex-shrink: 0;" onerror="this.src='/default-property.jpg'" />
              <div style="overflow: hidden;">
                <div style="font-weight: 700; color: #1e293b; font-size: 0.88rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.title || 'Untitled Property'}</div>
                <div style="font-size: 0.78rem; color: #64748b;">${p.location || 'Thanjavur'} • <span style="color: #eb5e28; font-weight: 600;">${p.id || ''}</span></div>
              </div>
            </div>
            <div style="text-align: right; flex-shrink: 0; margin-left: 8px;">
              <div style="font-weight: 800; color: #1e293b; font-size: 0.88rem;">${priceStr}</div>
              <span class="os-badge" style="background: ${statusBadgeBg}; color: ${statusBadgeColor}; font-size: 0.72rem; padding: 2px 6px; border-radius: 4px;">${p.status || 'Available'}</span>
            </div>
          </div>
        `;
      }).join('');

      recentListEl.querySelectorAll('.recent-prop-row').forEach(row => {
        row.addEventListener('click', () => {
          const propId = row.dataset.propid;
          if (propId) openPropertyModalById(propId);
        });
      });
    }
  } catch (err) {
    console.warn('Property status live update error:', err);
  }

  // Background Async Fetch for Live Visits and WhatsApp Messages
  try {
    const visitsData = await fetchFromAPI('/site_visits');
    if (Array.isArray(visitsData)) {
      siteVisits = visitsData;
      todayVisitsList = siteVisits.filter(v => v && v.visitDate && isSameDay(v.visitDate, now));

      const kpiVisitsEl = document.getElementById('kpi-today-visits');
      const kpiVisitsSub = document.getElementById('kpi-today-visits-sub');
      if (kpiVisitsEl) kpiVisitsEl.textContent = todayVisitsList.length;
      if (kpiVisitsSub) {
        kpiVisitsSub.textContent = todayVisitsList.length === 0 ? 'No site visits today' : `${todayVisitsList.length} appointment${todayVisitsList.length > 1 ? 's' : ''} today`;
      }

      const crmTotalVisitsEl = document.getElementById('crm-total-visits');
      if (crmTotalVisitsEl) crmTotalVisitsEl.textContent = siteVisits.length;

      const todayVisitsBadge = document.getElementById('today-visits-badge-count');
      if (todayVisitsBadge) todayVisitsBadge.textContent = todayVisitsList.length;

      const todayVisitsContainer = document.getElementById('today-visits-list');
      if (todayVisitsContainer && todayVisitsList.length > 0) {
        todayVisitsContainer.innerHTML = todayVisitsList.map(v => {
          let clientName = v.leadId;
          let property = v.propertyId;
          let assignedTo = v.assignedTo || 'Staff';
          try {
            if (v.notes) {
              const n = typeof v.notes === 'string' ? JSON.parse(v.notes) : v.notes;
              clientName = n.clientName || clientName;
              property = n.property || property;
              assignedTo = n.assignedTo || assignedTo;
            }
          } catch(e){}
          const timeFormatted = formatTimeOnly(v.visitDate) || 'Today';
          return `
            <div class="today-visit-item hover-lift" data-action="navigate" data-route="visits" data-query="staff=${encodeURIComponent(assignedTo)}" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer;">
              <div>
                <div style="font-weight: 700; color: #1e293b; font-size: 0.88rem;">${clientName || 'Client'}</div>
                <div style="font-size: 0.78rem; color: #64748b;">${property || 'Thanjavur Property'} • <strong style="color: #2563eb;">${assignedTo}</strong></div>
              </div>
              <div style="text-align: right;">
                <span class="os-badge" style="background: #eff6ff; color: #2563eb; font-weight: 700; font-size: 0.75rem; padding: 2px 8px; border-radius: 6px;">${timeFormatted}</span>
              </div>
            </div>
          `;
        }).join('');

        todayVisitsContainer.querySelectorAll('.today-visit-item').forEach(el => {
          el.addEventListener('click', () => {
            window.location.hash = '#visits?date=today';
          });
        });
      }

      // Update staff visit counts in staff matrix
      document.querySelectorAll('.staff-visits-cell').forEach(cell => {
        const staffName = decodeURIComponent(cell.dataset.staff || '').toLowerCase();
        const vCount = siteVisits.filter(v => {
          const a = (v.assignedTo || '').toLowerCase();
          return a.includes(staffName) || staffName.includes(a);
        }).length;
        cell.textContent = vCount;
      });
    }
  } catch (err) {
    console.warn('Live visits background fetch skipped:', err);
  }

  updateAiBrief(todayVisitsList.length);

  // WhatsApp Messages Live Status
  try {
    const waMessages = await fetchFromAPI('/whatsapp_messages');
    const waStatusText = document.getElementById('whatsapp-live-status-text');
    if (waStatusText && Array.isArray(waMessages)) {
      if (waMessages.length > 0) {
        const todayWa = waMessages.filter(m => isSameDay(m.createdAt, now));
        waStatusText.textContent = `${waMessages.length} total messages logged (${todayWa.length} active today)`;
      } else {
        waStatusText.textContent = 'Ready to send and receive WhatsApp messages';
      }
    }
  } catch (err) {
    console.warn('WhatsApp background fetch skipped:', err);
  }
}
