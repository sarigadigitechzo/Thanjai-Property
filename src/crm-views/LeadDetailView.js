import { fetchFromAPI } from '../utils/api.js';
import { showToast, showAlertModal, showConfirmModal } from '../utils/toast.js';
import { sendWhatsAppMessage, getActiveWhatsAppApiKey } from '../utils/whatsapp.js';
import { canViewAllLeads, filterLeadsForActiveUser, getActiveAdminUser } from '../utils/adminUsersStore.js';
import { getLeads, saveLeads, initLeadsView } from './LeadsView.js';
import { getProperties } from '../utils/propertiesStore.js';
import { addAuditLog } from '../utils/siteImagesStore.js';
import { openPropertyModalById } from '../components/PropertyDetailModal.js';

export function getInquiredPropertiesForLead(lead, allLeads = []) {
  const propIdSet = new Set();
  const allProps = getProperties() || [];

  if (!lead) return [];

  // 1. Direct propertyId / propertyMatch
  if (lead.propertyId) propIdSet.add(String(lead.propertyId).trim().toUpperCase());
  if (lead.propertyMatch) propIdSet.add(String(lead.propertyMatch).trim().toUpperCase());

  // 2. Timeline history of this lead
  const rawTimeline = Array.isArray(lead.timeline) ? lead.timeline : [];
  rawTimeline.forEach(evt => {
    const text = typeof evt === 'string' ? evt : (evt.message || evt.note || '');
    const matches = text.match(/(?:ID:\s*|property\s*|ID\s+)([A-Z]{2}-?\d+)/gi);
    if (matches) {
      matches.forEach(m => {
        const idMatch = m.match(/([A-Z]{2}-?\d+)/i);
        if (idMatch && idMatch[1]) propIdSet.add(idMatch[1].toUpperCase());
      });
    }
  });

  // 3. Notes of this lead
  const rawNotes = Array.isArray(lead.notes) ? lead.notes : [];
  rawNotes.forEach(n => {
    const text = typeof n === 'string' ? n : (n.text || '');
    const matches = text.match(/(?:ID:\s*|property\s*|ID\s+)([A-Z]{2}-?\d+)/gi);
    if (matches) {
      matches.forEach(m => {
        const idMatch = m.match(/([A-Z]{2}-?\d+)/i);
        if (idMatch && idMatch[1]) propIdSet.add(idMatch[1].toUpperCase());
      });
    }
  });

  // 4. Inquiries from other lead rows with same phone (last 10 digits) or email
  const leadPhoneDigits = String(lead.phone || lead.mobile || '').replace(/\D/g, '').slice(-10);
  const leadEmail = String(lead.email || '').trim().toLowerCase();

  if (leadPhoneDigits.length >= 10 || (leadEmail && leadEmail.includes('@'))) {
    allLeads.forEach(otherLead => {
      if (!otherLead) return;
      const otherDigits = String(otherLead.phone || otherLead.mobile || '').replace(/\D/g, '').slice(-10);
      const otherEmail = String(otherLead.email || '').trim().toLowerCase();

      const isSamePhone = leadPhoneDigits.length >= 10 && otherDigits === leadPhoneDigits;
      const isSameEmail = leadEmail && otherEmail && leadEmail === otherEmail;

      if (isSamePhone || isSameEmail) {
        if (otherLead.propertyId) propIdSet.add(String(otherLead.propertyId).trim().toUpperCase());
        if (otherLead.propertyMatch) propIdSet.add(String(otherLead.propertyMatch).trim().toUpperCase());

        const otherTimeline = Array.isArray(otherLead.timeline) ? otherLead.timeline : [];
        otherTimeline.forEach(evt => {
          const text = typeof evt === 'string' ? evt : (evt.message || evt.note || '');
          const matches = text.match(/(?:ID:\s*|property\s*|ID\s+)([A-Z]{2}-?\d+)/gi);
          if (matches) {
            matches.forEach(m => {
              const idMatch = m.match(/([A-Z]{2}-?\d+)/i);
              if (idMatch && idMatch[1]) propIdSet.add(idMatch[1].toUpperCase());
            });
          }
        });
      }
    });
  }

  // Resolve property objects
  const results = [];
  propIdSet.forEach(propId => {
    const found = allProps.find(p => p.id && (p.id.toUpperCase() === propId || p.id.replace('-', '').toUpperCase() === propId.replace('-', '')));
    if (found) {
      results.push(found);
    } else {
      results.push({
        id: propId,
        title: `Property ${propId}`,
        priceFormatted: 'Price on Request',
        location: 'Tamil Nadu',
        images: ['/default-property.jpg'],
        type: 'Property'
      });
    }
  });

  return results;
}

export function renderLeadDetailView(id) {
  const leads = getLeads() || [];
  const cleanTargetId = decodeURIComponent(String(id || '')).trim();
  const cleanTargetLower = cleanTargetId.toLowerCase();
  const targetDigits = cleanTargetId.replace(/\D/g, '');

  let lead = leads.find(l => {
    if (!l) return false;
    const lIdStr = String(l.id || '').trim();
    if (lIdStr === cleanTargetId || lIdStr.toLowerCase() === cleanTargetLower) return true;
    if (targetDigits && targetDigits.length >= 2) {
      const lDigits = lIdStr.replace(/\D/g, '');
      if (lDigits === targetDigits) return true;
    }
    const lPhone = String(l.phone || l.mobile || '').replace(/\D/g, '');
    if (targetDigits && targetDigits.length >= 7 && lPhone.includes(targetDigits)) return true;
    return false;
  });

  if (!lead) {
    lead = {
      id: id,
      name: 'Lead ' + id,
      phone: '',
      mobile: '',
      whatsapp: '',
      email: '',
      country: 'India',
      city: 'Thanjavur',
      area: 'Thanjavur',
      location: 'Thanjavur',
      budgetMin: '',
      budgetMax: '',
      budget: '',
      bedrooms: '',
      notes: [],
      timeline: [],
      type: 'Residential Plot',
      propertyType: 'Residential Plot',
      requirement: 'Residential Plot',
      source: 'CRM',
      assignTo: 'Unassigned',
      assignedTo: 'Unassigned',
      status: 'New Lead',
      followup: '—',
      createdAt: Date.now()
    };
  }

  const activeUser = getActiveAdminUser();
  if (activeUser && !canViewAllLeads(activeUser)) {
    const userFiltered = filterLeadsForActiveUser([lead], activeUser);
    if (userFiltered.length === 0) {
      return `
        <div style="padding: 60px 20px; text-align: center; max-width: 500px; margin: 40px auto; background: var(--os-white); border: var(--os-border-thin); border-radius: var(--os-radius-xl); box-shadow: var(--os-shadow-soft);">
          <div style="width: 56px; height: 56px; border-radius: 50%; background: #fee2e2; color: #ef4444; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin: 0 auto 16px;">
            <i class="ri-lock-2-line"></i>
          </div>
          <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 8px; color: var(--os-dark);">Access Restricted</h2>
          <p style="font-size: 0.9rem; color: var(--os-gray-500); line-height: 1.5; margin-bottom: 24px;">This lead is assigned to another staff member. You only have access to view leads directly assigned to your account.</p>
          <button class="os-btn-primary" onclick="window.location.hash='leads'" style="background: var(--os-luxury-orange); border-color: var(--os-luxury-orange);"><i class="ri-arrow-left-line"></i> Back to My Leads</button>
        </div>
      `;
    }
  }

  // Sanitize notes and timeline (convert strings to arrays to prevent .map crashes)
  let needsSave = false;
  if (typeof lead.notes === 'string') {
    if (lead.notes.trim() !== '') {
      try {
        const parsedNotes = JSON.parse(lead.notes);
        lead.notes = Array.isArray(parsedNotes) ? parsedNotes : [{ text: lead.notes, date: lead.createdAt || new Date().toISOString() }];
      } catch (e) {
        lead.notes = [{ text: lead.notes, date: lead.createdAt || new Date().toISOString() }];
      }
    } else {
      lead.notes = [];
    }
    needsSave = true;
  }
  if (typeof lead.timeline === 'string') {
    if (lead.timeline.trim() !== '' && lead.timeline !== '—') {
      try {
        const parsedTimeline = JSON.parse(lead.timeline);
        lead.timeline = Array.isArray(parsedTimeline) ? parsedTimeline : [{ type: 'pipeline', message: 'Follow-up: ' + lead.timeline, author: lead.assignTo || 'System', date: lead.createdAt || new Date().toISOString() }];
      } catch (e) {
        lead.timeline = [{ type: 'pipeline', message: 'Follow-up: ' + lead.timeline, author: lead.assignTo || 'System', date: lead.createdAt || new Date().toISOString() }];
      }
    } else {
      lead.timeline = [];
    }
    needsSave = true;
  }
  
  if (needsSave) {
    saveAndSyncLeads(leads, id);
  }

  // Load site visits and inspections related to this lead
  let leadVisits = [];
  try {
    const allVisits = JSON.parse(localStorage.getItem('thanjai_visits')) || [];
    leadVisits = allVisits.filter(v => {
      if (!v) return false;
      const vLeadId = String(v.leadId || '');
      const vClientName = String(v.clientName || v.leadName || '');
      const lId = String(lead.id || '');
      const lName = String(lead.name || '');
      if (vLeadId && (vLeadId === lId || vLeadId === lId.replace('LEAD-', '') || (lName && vLeadId.toLowerCase().includes(lName.toLowerCase())))) return true;
      if (vClientName && lName && (vClientName.toLowerCase().includes(lName.toLowerCase()) || lName.toLowerCase().includes(vClientName.toLowerCase()))) return true;
      return false;
    });
  } catch (err) {}

  // Load partner shares related to this lead
  let leadShares = [];
  try {
    let rawShared = JSON.parse(localStorage.getItem('thanjai_shared_leads')) || {};
    let allSharedList = [];
    if (Array.isArray(rawShared)) {
      allSharedList = rawShared;
    } else if (typeof rawShared === 'object') {
      Object.values(rawShared).forEach(val => {
        if (Array.isArray(val)) allSharedList.push(...val);
        else if (val && typeof val === 'object') allSharedList.push(val);
      });
    }

    const partners = JSON.parse(localStorage.getItem('thanjai_partners')) || [];
    const lId = String(lead.id || '');
    const lName = String(lead.name || '').trim().toLowerCase();
    const lPhone = String(lead.phone || lead.mobile || '').replace(/\D/g, '');

    leadShares = allSharedList.filter(s => {
      if (!s) return false;
      const sLeadId = String(s.leadId || '');
      const sName = String(s.name || '').trim().toLowerCase();
      const sPhone = String(s.phone || '').replace(/\D/g, '');

      if (sLeadId && (sLeadId === lId || sLeadId === lId.replace('LEAD-', ''))) return true;
      if (lName && sName && (lName.includes(sName) || sName.includes(lName))) return true;
      if (lPhone && sPhone && lPhone.length >= 7 && (sPhone.includes(lPhone) || lPhone.includes(sPhone))) return true;
      return false;
    }).map(s => {
      const pMatch = partners.find(p => String(p.id) === String(s.partnerId));
      return {
        ...s,
        partnerCompany: (pMatch && (pMatch.company || pMatch.name)) || s.partnerCompany || 'Channel Partner',
        partnerType: (pMatch && (pMatch.type || pMatch.role)) || 'Partner'
      };
    });
  } catch (err) {}

  const formatCurrency = (val) => val ? '₹' + parseInt(val).toLocaleString('en-IN') : '—';

  const formatLeadCreatedDate = (leadObj) => {
    const rawDate = leadObj.createdAt || leadObj.created_at || leadObj.created || leadObj.date;
    if (!rawDate) return '—';
    try {
      const d = typeof rawDate === 'number' ? new Date(rawDate) : (isNaN(Number(rawDate)) ? new Date(rawDate) : new Date(Number(rawDate)));
      if (isNaN(d.getTime())) return String(rawDate);
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch(e) {
      return String(rawDate);
    }
  };

  const getTimelineAuthor = (author, leadObj) => {
    const defaultFallback = (leadObj && (leadObj.assignTo || leadObj.assignedTo) && (leadObj.assignTo !== 'Unassigned' && leadObj.assignedTo !== 'Unassigned'))
      ? (leadObj.assignTo || leadObj.assignedTo)
      : 'System';

    if (!author || author === 'undefined' || author === 'null') return defaultFallback;

    if (typeof author === 'object') {
      return author.name || author.fullName || author.email || defaultFallback;
    }
    if (typeof author === 'string') {
      const trimmed = author.trim();
      if (trimmed === 'undefined' || trimmed === 'null' || !trimmed) return defaultFallback;
      if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
        try {
          const parsed = JSON.parse(trimmed);
          return parsed.name || parsed.fullName || parsed.email || defaultFallback;
        } catch(e) {}
      }
      return trimmed;
    }
    return defaultFallback;
  };

  // Construct Unified 360 Activity Timeline
  const rawTimeline = Array.isArray(lead.timeline) ? lead.timeline : [];
  const unifiedActivities = [];

  // 1. Existing lead timeline events (with deduplication)
  const seenTimelineKeys = new Set();
  rawTimeline.forEach(evt => {
    if (!evt) return;
    const msg = evt.message || evt.action || evt.text || (typeof evt === 'string' ? evt : 'Lead activity recorded');
    const author = getTimelineAuthor(evt.author || evt.by || evt.user, lead);
    const rawD = evt.date || evt.timestamp || evt.createdAt || lead.createdAt;
    const d = new Date(rawD);
    const validDate = isNaN(d.getTime()) ? new Date(lead.createdAt || Date.now()) : d;

    const evtType = evt.type || (msg.toLowerCase().includes('whatsapp') ? 'whatsapp' : (msg.toLowerCase().includes('partner') ? 'partner' : (msg.toLowerCase().includes('visit') ? 'visit' : 'activity')));

    if (evtType === 'visit') {
      const visitKey = (evt.id || evt.visitId || msg).toLowerCase().replace(/[^a-z0-9]/g, '');
      if (seenTimelineKeys.has(visitKey)) return;
      seenTimelineKeys.add(visitKey);
    }

    unifiedActivities.push({
      id: evt.id || evt.visitId || `act-${Math.random()}`,
      type: evtType,
      message: msg,
      details: evt.details || '',
      author: author,
      date: validDate,
      dateFormatted: validDate.toLocaleString('en-GB', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      original: evt
    });
  });

  // 2. Site visits events (auto-merge into timeline only if not already represented)
  leadVisits.forEach(v => {
    if (!v) return;
    const visitDateStr = v.date ? `${v.date} ${v.month || ''}, ${v.hours || ''}:${v.mins || '00'} ${v.ampm || ''}` : (v.visitDate || 'Scheduled');
    const vType = v.visitType || (v.property && v.property.includes('Pre-Inspection') ? 'Staff Site Pre-Inspection' : 'Customer Property Tour');
    const statusText = v.status === 'Completed' ? 'Completed' : (v.status === 'Cancelled' ? 'Cancelled' : 'Scheduled');
    const visitMsg = `${vType} [${statusText}]: ${v.property || 'Property Tour'} (${visitDateStr})`;

    const vIdStr = String(v.id || '');
    const isDup = unifiedActivities.some(a => {
      if (a.type !== 'visit') return false;
      if (vIdStr && (String(a.id) === vIdStr || String(a.original?.id) === vIdStr || String(a.original?.visitId) === vIdStr)) return true;
      const aMsg = (a.message || '').toLowerCase();
      const propClean = (v.property || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      if (propClean && aMsg.replace(/[^a-z0-9]/g, '').includes(propClean)) return true;
      return false;
    });

    if (!isDup) {
      let visitD;
      const rawDateVal = v.createdAt || v.visitDateRaw || v.visitDate;
      if (rawDateVal) {
        visitD = new Date(rawDateVal);
      }
      if (!visitD || isNaN(visitD.getTime())) {
        visitD = new Date(lead.createdAt || lead.created_at || Date.now());
      }
      unifiedActivities.push({
        id: v.id || `visit-${Math.random()}`,
        type: 'visit',
        message: visitMsg,
        details: v.outcome ? `Outcome / Notes: ${v.outcome}` : '',
        author: v.assignedTo || lead.assignTo || 'Site Operations',
        date: visitD,
        dateFormatted: visitD.toLocaleString('en-GB', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        original: v
      });
    }
  });

  // 3. Partner shares events (auto-merge into timeline)
  leadShares.forEach(s => {
    if (!s) return;
    const pName = s.partnerCompany || 'Channel Partner';
    const shareMsg = `Shared requirement with partner "${pName}" (Client contact protected)`;
    const isDup = unifiedActivities.some(a => a.type === 'partner' && (a.message.includes(pName) || (s.id && String(a.original?.id) === String(s.id))));
    if (!isDup) {
      let shareD = s.sharedDate ? new Date(s.sharedDate) : (s.createdAt ? new Date(s.createdAt) : new Date());
      if (isNaN(shareD.getTime())) shareD = new Date();
      unifiedActivities.push({
        id: s.id || `share-${Math.random()}`,
        type: 'partner',
        message: shareMsg,
        details: s.notes ? `Handover note: ${s.notes}` : '',
        author: s.sharedBy || 'Admin',
        date: shareD,
        dateFormatted: shareD.toLocaleString('en-GB', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        original: s
      });
    }
  });

  // Sort activities newest first
  unifiedActivities.sort((a, b) => b.date.getTime() - a.date.getTime());
  
  const allStages = [
    { label: 'New Lead', wa: false },
    { label: 'Initial Contact', wa: true },
    { label: 'Requirement Analysis', wa: false },
    { label: 'Property Matching', wa: false },
    { label: 'Shared To Partner (use Share to partner below)', val: 'Shared To Partner', wa: false, style: 'color: var(--os-gray-400);' },
    { label: 'Property Shared', wa: false },
    { label: 'Follow Up Pending', wa: true },
    { label: 'Site Visit Scheduled', wa: true },
    { label: 'Site Visit Completed', wa: true },
    { label: 'Negotiation', wa: true },
    { label: 'Bank Loan', wa: true },
    { label: 'Registration', wa: true },
    { label: 'Lost Closed', wa: false }
  ];

  let stagesHtml = '';
  const currentStatus = lead.status || 'Requirement Analysis';
  allStages.forEach(s => {
     let optVal = s.val || s.label;
     let isSelected = (optVal === currentStatus) ? 'selected' : '';
     let customStyle = s.style || '';
     let style = isSelected ? 'style="background: #2563eb; color: #fff;"' : (customStyle ? `style="${customStyle}"` : '');
     let waIcon = s.wa ? ' <i class="ri-mail-line" style="font-size: 0.8rem; vertical-align: middle;"></i> sends WhatsApp' : '';
     stagesHtml += `          <div class="select-option ${isSelected}" ${style}>${s.label}${waIcon}</div>\n`;
  });

  const inquiredProps = getInquiredPropertiesForLead(lead, leads);

  return `
    <div class="lead-detail-page">
      <div class="ld-back-nav" style="margin-bottom: 24px;">
        <a href="javascript:void(0)" onclick="if(window.navigateToView) window.navigateToView('leads');" style="color: var(--os-gray-500); text-decoration: none; font-weight: 500; display: inline-flex; align-items: center; gap: 8px;">
          <i class="ri-arrow-left-line"></i> Back to leads
        </a>
      </div>

      <div class="ld-header" style="margin-bottom: 24px;">
        <h1 style="font-size: 1.8rem; font-weight: 700; color: var(--os-dark); margin-bottom: 8px;">${lead.name}</h1>
        <div class="ld-badges" style="display: flex; gap: 12px; align-items: center;">
          <span style="border: 1px solid #14b8a6; color: #14b8a6; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">${lead.status || 'New Lead'}</span>
          <span style="color: var(--os-gray-500); font-size: 0.9rem;">Stage: ${lead.status || 'New Lead'}</span>
        </div>
      </div>

      <div class="ld-stage-selector os-custom-select" style="width: 100%; padding: 0; border: var(--os-border-thin); border-radius: var(--os-radius-sm); margin-bottom: 24px;">
        <div class="select-value" style="padding: 12px 16px; font-weight: 500; color: var(--os-dark);">${lead.status || 'Requirement Analysis'}</div>
        <i class="ri-arrow-down-s-line" style="position: absolute; right: 16px; top: 14px; color: var(--os-gray-500);"></i>
        <div class="select-dropdown" style="top: 100%; left: 0; right: 0; border-radius: 0 0 8px 8px; border: 1px solid var(--os-luxury-orange); margin-top: -1px; box-shadow: var(--os-shadow-md);">
${stagesHtml}        </div>
      </div>

      <div class="ld-action-toolbar" style="display: flex; gap: 12px; margin-bottom: 32px; flex-wrap: wrap;">
        <div class="os-custom-select" id="ld-assign-dropdown" style="min-width: 150px; background: var(--os-white);">
          <div class="select-value">${lead.assignTo && lead.assignTo !== 'Unassigned' ? lead.assignTo : 'Assign to...'}</div>
          <i class="ri-arrow-down-s-line"></i>
          <div class="select-dropdown">
${(() => {
              const adminUsers = JSON.parse(localStorage.getItem('thanjai_admin_users')) || [];
              let html = `<div class="select-option ${(!lead.assignTo || lead.assignTo === 'Unassigned') ? 'selected' : ''}">Assign to...</div>`;
              if (adminUsers.length > 0) {
                adminUsers.filter(u => u.status === 'Active').forEach(u => {
                  html += `<div class="select-option ${lead.assignTo === u.fullName ? 'selected' : ''}">${u.fullName}</div>`;
                });
              } else {
                html += `<div class="select-option" style="color:var(--os-gray-400);">No staff found</div>`;
              }
              return html;
            })()}
          </div>
        </div>
        <button class="os-btn-primary" id="btn-send-whatsapp" style="background: #f97316; border-color: #f97316; display: flex; align-items: center; gap: 8px;">
          <i class="ri-send-plane-fill"></i> Send WhatsApp
        </button>
        <button class="os-btn-secondary" id="btn-schedule-visit" style="background: var(--os-white); display: flex; align-items: center; gap: 8px;">
          <i class="ri-calendar-event-line"></i> Schedule visit
        </button>
        <button class="os-btn-secondary" id="btn-edit-lead" style="background: var(--os-white);">
          Edit
        </button>
        <button class="os-btn-secondary" id="btn-share-partner" style="background: var(--os-white);">
          Share to partner
        </button>
      </div>

      <div class="ld-content-grid" style="display: grid; grid-template-columns: 350px 1fr; gap: 24px; align-items: start;">
        
        <div class="ld-left-col" style="display: flex; flex-direction: column; gap: 24px;">
          <div class="os-card" style="padding: 24px; background: var(--os-white); border-radius: var(--os-radius-xl); box-shadow: var(--os-shadow-soft);">
            <h3 style="font-size: 1rem; font-weight: 600; color: var(--os-dark); margin-bottom: 20px;">Lead details</h3>
            <table class="ld-details-table" style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
              <tbody>
                <tr><td style="padding: 8px 0; color: var(--os-gray-500);">Mobile</td><td style="padding: 8px 0; text-align: right; font-weight: 500;">${lead.mobile || '—'}</td></tr>
                <tr><td style="padding: 8px 0; color: var(--os-gray-500);">WhatsApp</td><td style="padding: 8px 0; text-align: right; font-weight: 500;">${lead.whatsapp || lead.mobile || '—'}</td></tr>
                <tr><td style="padding: 8px 0; color: var(--os-gray-500);">Email</td><td style="padding: 8px 0; text-align: right; font-weight: 500;">${lead.email || '—'}</td></tr>
                <tr><td style="padding: 8px 0; color: var(--os-gray-500);">Country</td><td style="padding: 8px 0; text-align: right; font-weight: 500;">${lead.country || '—'}</td></tr>
                <tr><td style="padding: 8px 0; color: var(--os-gray-500);">City / area</td><td style="padding: 8px 0; text-align: right; font-weight: 500;">${lead.city || lead.area || '—'}</td></tr>
                <tr><td style="padding: 8px 0; color: var(--os-gray-500);">Budget</td><td style="padding: 8px 0; text-align: right; font-weight: 500;">${formatCurrency(lead.budgetMax)}</td></tr>
                <tr><td style="padding: 8px 0; color: var(--os-gray-500);">Property type</td><td style="padding: 8px 0; text-align: right; font-weight: 500;">${lead.type || '—'}</td></tr>
                ${(() => {
                  let rawS = (lead.source || 'MANUAL').toUpperCase();
                  let displayS = rawS;
                  if (rawS.includes('CONTACT') || rawS === 'WEBSITE FORM') displayS = 'CONTACT ENQUIRY';
                  else if (rawS.includes('PROPERTY') || rawS.includes('VISIT')) displayS = 'PROPERTY INQUIRY';
                  return `<tr><td style="padding: 8px 0; color: var(--os-gray-500);">Source</td><td style="padding: 8px 0; text-align: right; font-weight: 500;"><span style="border: 1px solid var(--os-gray-300); color: var(--os-gray-600); padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; text-transform: uppercase;">${displayS}</span></td></tr>`;
                })()}
                ${inquiredProps.length > 0 ? `
                  <tr>
                    <td style="padding: 8px 0; color: var(--os-gray-500); vertical-align: top;">${inquiredProps.length > 1 ? `Properties Inquired (${inquiredProps.length})` : 'Property Inquired'}</td>
                    <td style="padding: 8px 0; text-align: right;">
                      <div style="display: flex; flex-wrap: wrap; gap: 4px; justify-content: flex-end;">
                        ${inquiredProps.map(p => `
                          <span class="prop-id-badge" data-propid="${p.id}" style="background: #fff7ed; color: #ea580c; border: 1px solid #ffedd5; padding: 3px 8px; border-radius: 4px; font-size: 0.78rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;" title="Click to view ${p.title}">
                            <i class="ri-building-line"></i> ${p.id}
                          </span>
                        `).join('')}
                      </div>
                    </td>
                  </tr>
                ` : ''}
                <tr><td style="padding: 8px 0; color: var(--os-gray-500);">Priority</td><td style="padding: 8px 0; text-align: right; font-weight: 500;"><span style="border: 1px solid #3b82f6; color: #3b82f6; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; text-transform: uppercase;">MEDIUM</span></td></tr>
                <tr><td style="padding: 8px 0; color: var(--os-gray-500);">Assigned to</td><td style="padding: 8px 0; text-align: right; font-weight: 500;">${lead.assignTo || 'Unassigned'}</td></tr>
                <tr><td style="padding: 8px 0; color: var(--os-gray-500);">Created</td><td style="padding: 8px 0; text-align: right; font-weight: 500;">${formatLeadCreatedDate(lead)}</td></tr>
              </tbody>
            </table>
          </div>

          <!-- Inquired Properties Portfolio Card (Multi-Property Support) -->
          ${inquiredProps.length > 0 ? `
            <div class="os-card" style="padding: 20px 24px; background: #ffffff; border-radius: var(--os-radius-xl); box-shadow: var(--os-shadow-soft); border: 1px solid #fed7aa;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                <h3 style="font-size: 0.95rem; font-weight: 800; color: #9a3412; margin: 0; display: flex; align-items: center; gap: 8px;">
                  <i class="ri-building-4-fill" style="color: #ea580c;"></i> Inquired Properties (${inquiredProps.length})
                </h3>
                <span style="font-size: 0.72rem; font-weight: 800; background: #fff7ed; color: #ea580c; padding: 2px 8px; border-radius: 6px; border: 1px solid #ffedd5;">
                  ${inquiredProps.length > 1 ? 'Multiple Listings' : 'Single Listing'}
                </span>
              </div>
              <div style="display: flex; flex-direction: column; gap: 10px;">
                ${inquiredProps.map(p => {
                  const pImg = Array.isArray(p.images) && p.images[0] ? p.images[0] : (typeof p.images === 'string' ? p.images : '/default-property.jpg');
                  const pPrice = p.priceFormatted || (p.price ? `₹ ${p.price.toLocaleString('en-IN')}` : 'Price on Request');
                  return `
                    <div class="inquired-prop-card" style="display: flex; gap: 12px; padding: 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; align-items: center; transition: all 0.2s ease;">
                      <img src="${pImg}" alt="${p.title}" style="width: 54px; height: 54px; border-radius: 8px; object-fit: cover; flex-shrink: 0; border: 1px solid #cbd5e1;" />
                      <div style="flex: 1; min-width: 0;">
                        <div style="display: flex; align-items: center; gap: 6px;">
                          <span style="font-size: 0.7rem; font-weight: 800; color: #ea580c; background: #fff7ed; padding: 1px 6px; border-radius: 4px;">${p.id}</span>
                          <span style="font-size: 0.7rem; font-weight: 700; color: #64748b;">${p.type || 'Property'}</span>
                        </div>
                        <h4 style="font-size: 0.85rem; font-weight: 700; color: #1e293b; margin: 3px 0 2px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${p.title}">
                          ${p.title}
                        </h4>
                        <div style="font-size: 0.78rem; font-weight: 800; color: #ea580c;">
                          ${pPrice} <span style="font-size: 0.72rem; font-weight: 600; color: #64748b;">• ${p.location || 'Thanjavur'}</span>
                        </div>
                      </div>
                      <button class="prop-id-badge" data-propid="${p.id}" style="background: #0f172a; color: #ffffff; border: none; padding: 6px 12px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; cursor: pointer; flex-shrink: 0; display: inline-flex; align-items: center; gap: 4px;" title="View full property details">
                        <i class="ri-eye-line"></i> View
                      </button>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          ` : ''}

          <div class="os-card" style="padding: 24px; background: var(--os-white); border-radius: var(--os-radius-xl); box-shadow: var(--os-shadow-soft);">
            <h3 style="font-size: 1rem; font-weight: 600; color: var(--os-dark); margin-bottom: 16px;">Set follow-up</h3>
            <div style="display: flex; gap: 12px;">
              <input type="datetime-local" id="follow-up-datetime" class="os-input" style="flex: 1;" />
              <button id="btn-set-follow-up" class="os-btn-secondary" style="background: #fcd34d; border-color: #fcd34d; color: #92400e;">Set</button>
            </div>
          </div>

          <div class="os-card" style="padding: 24px; background: var(--os-white); border-radius: var(--os-radius-xl); box-shadow: var(--os-shadow-soft);">
            <h3 style="font-size: 1rem; font-weight: 600; color: var(--os-dark); margin-bottom: 16px;">Notes</h3>
            <textarea id="ld-note-input" class="os-input" rows="3" placeholder="Add an internal note..." style="width: 100%; margin-bottom: 12px; resize: vertical;"></textarea>
            <button id="ld-add-note-btn" class="os-btn-secondary" style="background: #fed7aa; border-color: #fed7aa; color: #9a3412;">Add note</button>
            <div id="ld-notes-list" style="margin-top: 16px; max-height: 300px; overflow-y: auto;">
              ${
                Array.isArray(lead.notes) && lead.notes.length > 0 
                ? lead.notes.map((n, i) => `
                    <div style="background: #f8fafc; padding: 12px; border-radius: 6px; margin-bottom: 8px; border-left: 3px solid #fed7aa; position: relative;">
                      <p style="font-size: 0.9rem; color: var(--os-dark); margin-bottom: 8px; padding-right: 40px;">${typeof n === 'string' ? n : n.text}</p>
                      <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 0.75rem; color: var(--os-gray-400);"><i class="ri-calendar-line"></i> ${n.date ? new Date(n.date).toLocaleString([], {year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'}) : 'Just now'}</span>
                        <div style="display: flex; gap: 8px;">
                          <button class="note-action-btn" data-action="edit" data-index="${i}" style="background: none; border: none; cursor: pointer; color: var(--os-gray-500); padding: 2px;" title="Edit Note"><i class="ri-edit-line"></i></button>
                          <button class="note-action-btn" data-action="delete" data-index="${i}" style="background: none; border: none; cursor: pointer; color: var(--os-error); padding: 2px;" title="Delete Note"><i class="ri-delete-bin-line"></i></button>
                        </div>
                      </div>
                    </div>
                  `).join('')
                : (typeof lead.notes === 'string' && lead.notes.trim() !== '' ? `
                    <div style="background: #f8fafc; padding: 12px; border-radius: 6px; margin-bottom: 8px; border-left: 3px solid #fed7aa; position: relative;">
                      <p style="font-size: 0.9rem; color: var(--os-dark); margin-bottom: 8px; padding-right: 40px;">${lead.notes}</p>
                    </div>
                  ` : '<p style="font-size: 0.85rem; color: var(--os-gray-400);">No notes yet.</p>')
              }
            </div>
          </div>
        </div>

        <div class="ld-right-col" style="display: flex; flex-direction: column; gap: 24px;">
          
          <div class="os-card" style="padding: 24px; background: var(--os-white); border-radius: var(--os-radius-xl); box-shadow: var(--os-shadow-soft);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <div>
                <h3 style="font-size: 1rem; font-weight: 700; color: var(--os-dark); margin: 0;">Matching properties</h3>
                <p style="font-size: 0.8rem; color: var(--os-gray-500); margin: 2px 0 0 0;">Search by Property ID (e.g. TP-7780), name or location and send directly to customer WhatsApp</p>
              </div>
              <button class="os-btn-secondary" id="btn-find-matches" style="font-size: 0.85rem; padding: 6px 14px; height: auto; display: flex; align-items: center; gap: 6px;"><i class="ri-sparkling-fill" style="color: #ea580c;"></i> Auto Match</button>
            </div>
            <div style="display: flex; gap: 10px; margin-bottom: 16px;">
              <div style="position: relative; flex: 1;">
                <i class="ri-search-line" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--os-gray-400); font-size: 0.95rem;"></i>
                <input type="text" class="os-input" id="matching-properties-search" placeholder="Search by Property ID (e.g. TP-7780), title, location, type..." style="width: 100%; padding-left: 36px;" />
              </div>
              <button class="os-btn-secondary" id="btn-search-matches" style="padding: 0 16px; font-weight: 600;">Search</button>
            </div>
            <div id="matching-properties-results">
              <p style="font-size: 0.9rem; color: var(--os-gray-500); line-height: 1.5;">Type a Property ID (e.g. TP-7780) or keyword above, or click "Auto Match" to score inventory against this lead's requirement.</p>
            </div>
          </div>

          <div class="os-card" style="background: var(--os-white); border-radius: var(--os-radius-xl); box-shadow: var(--os-shadow-soft); overflow: hidden;">
            <div class="ld-tabs" style="display: flex; border-bottom: 1px solid var(--os-gray-200); padding: 0 16px; overflow-x: auto;">
              <div class="ld-tab active" data-target="pane-timeline" style="padding: 16px; font-size: 0.9rem; font-weight: 500; color: #ea580c; border-bottom: 2px solid #ea580c; cursor: pointer; white-space: nowrap;">Activity timeline</div>
              <div class="ld-tab" data-target="pane-whatsapp" style="padding: 16px; font-size: 0.9rem; font-weight: 500; color: var(--os-gray-500); cursor: pointer; white-space: nowrap;">WhatsApp (${(lead.timeline && lead.timeline.filter(e => e.type === 'whatsapp').length) || 0})</div>
              <div class="ld-tab" data-target="pane-visits" style="padding: 16px; font-size: 0.9rem; font-weight: 500; color: var(--os-gray-500); cursor: pointer; white-space: nowrap;">Site Visits & Inspections (${leadVisits.length})</div>
              <div class="ld-tab" data-target="pane-partner" style="padding: 16px; font-size: 0.9rem; font-weight: 500; color: var(--os-gray-500); cursor: pointer; white-space: nowrap;">Partner shares (${leadShares.length})</div>
              <div class="ld-tab" data-target="pane-pipeline" style="padding: 16px; font-size: 0.9rem; font-weight: 500; color: var(--os-gray-500); cursor: pointer; white-space: nowrap;">Pipeline history</div>
            </div>
            
            <div class="ld-tab-content" style="padding: 24px;">
              
              <!-- Activity Timeline Tab -->
              <div class="ld-tab-pane" id="pane-timeline" style="display: block;">
                ${unifiedActivities.length === 0 ? '<p style="color: var(--os-gray-400); font-size: 0.9rem;">No activity recorded yet.</p>' : `
                <div class="timeline" style="position: relative; padding-left: 20px;">
                  <div style="position: absolute; left: 6px; top: 8px; bottom: 0; width: 2px; background: #fed7aa;"></div>
                  ${unifiedActivities.map(act => {
                    let dotColor = '#ea580c';
                    let titleColor = 'var(--os-dark)';
                    let typeBadge = '';

                    if (act.type === 'whatsapp') {
                      dotColor = '#16a34a';
                      titleColor = '#16a34a';
                    } else if (act.type === 'visit') {
                      dotColor = '#c2410c';
                      titleColor = '#9a3412';
                      typeBadge = '<span style="background: #ffedd5; color: #c2410c; font-size: 0.72rem; font-weight: 700; padding: 1px 6px; border-radius: 4px; margin-left: 6px;">Site Visit</span>';
                    } else if (act.type === 'partner') {
                      dotColor = '#2563eb';
                      titleColor = '#1e40af';
                      typeBadge = '<span style="background: #eff6ff; color: #1d4ed8; font-size: 0.72rem; font-weight: 700; padding: 1px 6px; border-radius: 4px; margin-left: 6px;">Partner Share</span>';
                    }

                    return `
                      <div class="timeline-item" style="position: relative; margin-bottom: 24px;">
                        <div style="position: absolute; left: -20px; top: 4px; width: 10px; height: 10px; border-radius: 50%; background: ${dotColor}; border: 2px solid var(--os-white); box-shadow: 0 0 0 2px rgba(0,0,0,0.05);"></div>
                        <div style="font-weight: 600; color: ${titleColor}; font-size: 0.95rem; margin-bottom: 4px;">
                          ${act.message} ${typeBadge}
                        </div>
                        ${act.details ? `
                          <div style="font-size: 0.82rem; color: #475569; background: #f8fafc; padding: 4px 10px; border-radius: 4px; border-left: 2px solid ${dotColor}; margin: 4px 0 6px 0;">
                            ${act.details}
                          </div>
                        ` : ''}
                        <div style="font-size: 0.8rem; color: var(--os-gray-400);">
                          ${act.author} - ${act.dateFormatted}
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
                `}
              </div>

              <!-- WhatsApp Tab -->
              <div class="ld-tab-pane" id="pane-whatsapp" style="display: none; background: #eae6df; padding: 20px; border-radius: 8px;">
                ${(!lead.timeline || !lead.timeline.find(e => e.type === 'whatsapp')) ? '<p style="text-align: center; color: #555; font-size: 0.9rem;">No WhatsApp history.</p>' : `
                <div style="text-align: center; margin-bottom: 16px;">
                  <span style="background: #fff; padding: 4px 12px; border-radius: 12px; font-size: 0.8rem; color: #555;">Logs</span>
                </div>
                ${lead.timeline.filter(e => e.type === 'whatsapp').map(event => `
                  <div style="background: #dcf8c6; padding: 12px; border-radius: 8px; margin-bottom: 16px; position: relative;">
                    <div style="font-size: 0.8rem; color: #16a34a; margin-bottom: 4px;">Sent by ${getTimelineAuthor(event.author, lead)}</div>
                    <div style="font-size: 0.95rem; color: #1f2937; line-height: 1.4;">${event.message}</div>
                    <div style="text-align: right; font-size: 0.75rem; color: #6b7280; margin-top: 4px;">${new Date(event.date).toLocaleString([], {year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})} <span style="color: #16a34a; font-weight: bold; margin-left: 4px;">✓</span></div>
                  </div>
                `).join('')}
                `}
              </div>

              <!-- Site Visits & Inspections Tab -->
              <div class="ld-tab-pane" id="pane-visits" style="display: none;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                  <div>
                    <h3 style="font-size: 1rem; font-weight: 700; color: var(--os-dark); margin: 0;">Site Visits & Inspections</h3>
                    <p style="font-size: 0.8rem; color: var(--os-gray-500); margin: 2px 0 0 0;">Customer tours and staff site pre-inspections for this lead</p>
                  </div>
                  <button class="os-btn-primary" id="btn-tab-schedule-visit" style="font-size: 0.82rem; padding: 6px 14px; background: var(--os-luxury-orange); border: none; border-radius: 6px; color: #fff; cursor: pointer; display: flex; align-items: center; gap: 6px;"><i class="ri-add-line"></i> Schedule Visit</button>
                </div>
                ${leadVisits.length === 0 ? `
                  <div style="padding: 32px 20px; text-align: center; background: #f8fafc; border-radius: 8px; border: 1px dashed var(--os-border-light);">
                    <i class="ri-calendar-event-line" style="font-size: 2rem; color: var(--os-gray-400); margin-bottom: 8px; display: block;"></i>
                    <p style="color: var(--os-gray-500); font-size: 0.9rem; margin-bottom: 12px;">No site visits scheduled for this customer yet.</p>
                    <button class="os-btn-primary" id="btn-empty-schedule-visit" style="font-size: 0.85rem; padding: 6px 16px; background: var(--os-luxury-orange); border: none; color: #fff; border-radius: 6px; cursor: pointer;">Schedule First Visit</button>
                  </div>
                ` : `
                  <div style="display: flex; flex-direction: column; gap: 12px;">
                    ${leadVisits.map(v => {
                      const isPreInspection = (v.visitType === 'Staff Site Pre-Inspection' || (v.property && v.property.includes('Pre-Inspection')));
                      const typeBadge = isPreInspection
                        ? `<span style="background: #f3e8ff; color: #7e22ce; font-size: 0.75rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; display: inline-flex; align-items: center; gap: 4px;"><i class="ri-search-eye-line"></i> Staff Pre-Inspection</span>`
                        : `<span style="background: #ffedd5; color: #c2410c; font-size: 0.75rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; display: inline-flex; align-items: center; gap: 4px;"><i class="ri-user-star-line"></i> Customer Tour</span>`;
                      const statusBadge = (v.status === 'Completed')
                        ? `<span style="background: #dcfce7; color: #15803d; font-size: 0.75rem; font-weight: 700; padding: 2px 8px; border-radius: 4px;">Completed</span>`
                        : (v.status === 'Cancelled' ? `<span style="background: #fee2e2; color: #b91c1c; font-size: 0.75rem; font-weight: 700; padding: 2px 8px; border-radius: 4px;">Cancelled</span>`
                        : `<span style="background: #e0f2fe; color: #0369a1; font-size: 0.75rem; font-weight: 700; padding: 2px 8px; border-radius: 4px;">${v.status || 'Scheduled'}</span>`);
                      
                      const dateDisplay = v.date ? `${v.date} ${v.month || ''}, ${v.hours || ''}:${v.mins || '00'} ${v.ampm || ''}` : (v.visitDate || 'Scheduled');

                      return `
                        <div style="background: #f8fafc; border: 1px solid var(--os-border-light); border-radius: 8px; padding: 14px 16px;">
                          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                              ${typeBadge}
                              ${statusBadge}
                              <span style="font-weight: 700; font-size: 0.92rem; color: var(--os-dark);"><i class="ri-calendar-line" style="color: var(--os-luxury-orange);"></i> ${dateDisplay}</span>
                            </div>
                            <span style="font-size: 0.8rem; color: var(--os-gray-500);"><i class="ri-user-follow-line"></i> ${v.assignedTo || lead.assignTo || 'Assigned Staff'}</span>
                          </div>
                          <div style="font-size: 0.88rem; color: var(--os-dark); margin-bottom: 6px;">
                            <i class="ri-map-pin-2-line" style="color: var(--os-luxury-orange);"></i> <strong>Property:</strong> ${v.property || v.propertyId || 'General Requirement'}
                          </div>
                          ${v.outcome ? `
                            <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 12px; margin-top: 8px; font-size: 0.85rem; color: #334155;">
                              <strong>Outcome / Inspection Findings:</strong> ${v.outcome}
                            </div>
                          ` : ''}
                        </div>
                      `;
                    }).join('')}
                  </div>
                `}
              </div>

              <!-- Pipeline History Tab -->
              <div class="ld-tab-pane" id="pane-pipeline" style="display: none;">
                ${(!lead.timeline || !lead.timeline.find(e => e.type === 'pipeline')) ? '<p style="color: var(--os-gray-400); font-size: 0.9rem;">No pipeline history.</p>' : `
                  ${lead.timeline.filter(e => e.type === 'pipeline').map(event => {
                     const parts = event.message.replace('Moved from ', '').split(' to ');
                     return `
                     <div style="margin-bottom: 16px;">
                       <span style="color: var(--os-gray-500);">${parts[0] || ''} <i class="ri-arrow-right-line" style="vertical-align: middle;"></i></span> <span style="color: var(--os-dark); font-weight: 500;">${parts[1] || ''}</span>
                       <span style="color: var(--os-gray-400); font-size: 0.85rem; margin-left: 8px;">${getTimelineAuthor(event.author, lead)} · ${new Date(event.date).toLocaleString([], {year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})}</span>
                     </div>
                     `;
                  }).join('')}
                `}
              </div>

              <!-- Partner shares Tab -->
              <div class="ld-tab-pane" id="pane-partner" style="display: none;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                  <div>
                    <h3 style="font-size: 1rem; font-weight: 700; color: var(--os-dark); margin: 0;">Partner Network Shares</h3>
                    <p style="font-size: 0.8rem; color: var(--os-gray-500); margin: 2px 0 0 0;">Qualified requirements transferred to verified channel partners</p>
                  </div>
                  <button class="os-btn-primary" id="btn-tab-share-partner" style="font-size: 0.82rem; padding: 6px 14px; background: var(--os-luxury-orange); border: none; border-radius: 6px; color: #fff; cursor: pointer; display: flex; align-items: center; gap: 6px;"><i class="ri-share-forward-line"></i> Share with Partner</button>
                </div>
                ${leadShares.length === 0 ? `
                  <div style="padding: 32px 20px; text-align: center; background: #f8fafc; border-radius: 8px; border: 1px dashed var(--os-border-light);">
                    <i class="ri-user-shared-line" style="font-size: 2rem; color: var(--os-gray-400); margin-bottom: 8px; display: block;"></i>
                    <p style="color: var(--os-gray-500); font-size: 0.9rem; margin-bottom: 12px;">No partner shares recorded for this lead yet.</p>
                    <button class="os-btn-primary" id="btn-empty-share-partner" style="font-size: 0.85rem; padding: 6px 16px; background: var(--os-luxury-orange); border: none; color: #fff; border-radius: 6px; cursor: pointer;">Share with First Partner</button>
                  </div>
                ` : `
                  <div style="display: flex; flex-direction: column; gap: 12px;">
                    ${leadShares.map(s => `
                      <div style="background: #f8fafc; border: 1px solid var(--os-border-light); border-radius: 8px; padding: 14px 16px;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                            <span style="background: #eff6ff; color: #1d4ed8; font-size: 0.75rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; display: inline-flex; align-items: center; gap: 4px;">
                              <i class="ri-briefcase-4-line"></i> ${s.partnerType || 'Channel Partner'}
                            </span>
                            <span style="background: #ecfdf5; color: #047857; font-size: 0.75rem; font-weight: 700; padding: 2px 8px; border-radius: 4px;">
                              ${s.status || 'Shared'}
                            </span>
                            <span style="font-weight: 700; font-size: 0.95rem; color: var(--os-dark);">
                              <i class="ri-building-2-line" style="color: var(--os-luxury-orange);"></i> ${s.partnerCompany}
                            </span>
                          </div>
                          <span style="font-size: 0.8rem; color: var(--os-gray-500);">
                            <i class="ri-time-line"></i> ${s.sharedDate || 'Recently shared'}
                          </span>
                        </div>
                        <div style="font-size: 0.86rem; color: #334155; margin-bottom: 6px; display: flex; gap: 16px; flex-wrap: wrap;">
                          <span><i class="ri-map-pin-line" style="color: #ea580c;"></i> <strong>Area:</strong> ${s.location || 'Thanjavur'}</span>
                          <span><i class="ri-home-4-line" style="color: #ea580c;"></i> <strong>Type:</strong> ${s.propertyType || 'Property'}</span>
                          <span><i class="ri-money-rupee-circle-line" style="color: #ea580c;"></i> <strong>Budget:</strong> ${s.budget || '—'}</span>
                        </div>
                        ${s.notes ? `
                          <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 12px; margin-top: 8px; font-size: 0.84rem; color: #475569;">
                            <strong>Handover Note:</strong> ${s.notes}
                          </div>
                        ` : ''}
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; font-size: 0.78rem; color: var(--os-gray-400); border-top: 1px solid #f1f5f9; padding-top: 8px;">
                          <span>Shared by <strong>${s.sharedBy || 'Admin'}</strong></span>
                          <span style="color: #059669; font-weight: 600;"><i class="ri-shield-check-line"></i> Client phone protected</span>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                `}
              </div>

            </div>
          </div>

            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Modals for Lead Detail -->
    <!-- Edit Lead Modal -->
    <div class="os-modal-overlay" id="edit-lead-modal">
      <div class="os-modal-card">
        <div class="os-modal-header">
          <h2>Edit lead</h2>
          <button class="os-modal-close" id="close-edit-modal"><i class="ri-close-line"></i></button>
        </div>
        <div class="os-modal-body">
          <form id="edit-lead-form">
            <input type="hidden" id="edit-lead-id" value="${lead.id}" />
            <!-- CONTACT -->
            <div class="form-section-title">CONTACT</div>
            <div class="form-row">
              <div class="form-group">
                <label>Full name *</label>
                <input type="text" id="edit-lead-name" required value="${lead.name || ''}" />
              </div>
              <div class="form-group">
                <label>Mobile *</label>
                <input type="text" id="edit-lead-mobile" placeholder="10-digit number" required value="${lead.mobile || lead.phone || ''}" maxlength="10" pattern="[0-9]{10}" oninput="this.value = this.value.replace(/[^0-9]/g, '')" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>WhatsApp number</label>
                <input type="text" id="edit-lead-whatsapp" placeholder="defaults to mobile" value="${lead.whatsapp || ''}" maxlength="10" pattern="[0-9]{10}" oninput="this.value = this.value.replace(/[^0-9]/g, '')" />
              </div>
              <div class="form-group">
                <label>Email</label>
                <input type="email" id="edit-lead-email" value="${lead.email || ''}" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Country</label>
                <input type="text" id="edit-lead-country" value="${lead.country || 'India'}" />
              </div>
              <div class="form-group">
                <label>City</label>
                <input type="text" id="edit-lead-city" value="${lead.city || 'Thanjavur'}" />
              </div>
            </div>

            <!-- REQUIREMENT -->
            <div class="form-section-title">REQUIREMENT</div>
            <div class="form-row">
              <div class="form-group">
                <label>Preferred area</label>
                <input type="text" id="edit-lead-area" value="${lead.area || ''}" />
              </div>
              <div class="form-group">
                <label>Property type</label>
                <div class="os-custom-select modal-select" id="edit-lead-type-select">
                  <div class="select-value">${lead.type || 'Any'}</div>
                  <i class="ri-arrow-down-s-line"></i>
                  <div class="select-dropdown">
                    <div class="select-option ${(lead.type === 'Any' || !lead.type) ? 'selected' : ''}">Any</div>
                    <div class="select-option ${lead.type === 'Apartment' ? 'selected' : ''}">Apartment</div>
                    <div class="select-option ${lead.type === 'Villa' ? 'selected' : ''}">Villa</div>
                    <div class="select-option ${lead.type === 'Townhouse' ? 'selected' : ''}">Townhouse</div>
                    <div class="select-option ${lead.type === 'Penthouse' ? 'selected' : ''}">Penthouse</div>
                    <div class="select-option ${lead.type === 'Studio' ? 'selected' : ''}">Studio</div>
                    <div class="select-option ${lead.type === 'Plot' || lead.type === 'Residential Plot' ? 'selected' : ''}">Plot</div>
                    <div class="select-option ${lead.type === 'Office' ? 'selected' : ''}">Office</div>
                    <div class="select-option ${lead.type === 'Retail' ? 'selected' : ''}">Retail</div>
                    <div class="select-option ${lead.type === 'Warehouse' ? 'selected' : ''}">Warehouse</div>
                    <div class="select-option ${lead.type === 'Other' ? 'selected' : ''}">Other</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Budget min</label>
                <input type="text" id="edit-lead-budget-min" value="${lead.budgetMin || ''}" />
              </div>
              <div class="form-group">
                <label>Budget max</label>
                <input type="text" id="edit-lead-budget-max" value="${lead.budgetMax || lead.budget || ''}" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Currency</label>
                <div class="os-custom-select modal-select" id="edit-lead-currency-select">
                  <div class="select-value">INR</div>
                  <i class="ri-arrow-down-s-line"></i>
                  <div class="select-dropdown">
                    <div class="select-option selected">INR</div>
                    <div class="select-option">USD</div>
                    <div class="select-option">EUR</div>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label>Bedrooms</label>
                <input type="text" id="edit-lead-bedrooms" value="${lead.bedrooms || ''}" />
              </div>
            </div>

            <!-- TRACKING -->
            <div class="form-section-title">TRACKING</div>
            <div class="form-row">
              <div class="form-group">
                <label>Source</label>
                <input type="text" id="edit-lead-source" placeholder="e.g. Manual, Walk-in, Referral, Instagram, Meta Ads..." value="${lead.source || 'Manual'}" />
              </div>
              <div class="form-group">
                <label>Priority</label>
                <div class="os-custom-select modal-select" id="edit-lead-priority-select">
                  <div class="select-value">Medium</div>
                  <i class="ri-arrow-down-s-line"></i>
                  <div class="select-dropdown">
                    <div class="select-option">High</div>
                    <div class="select-option selected">Medium</div>
                    <div class="select-option">Low</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Assign to</label>
                <div class="os-custom-select modal-select" id="edit-lead-assign-select">
                  <div class="select-value">${lead.assignTo || lead.assignedTo || 'Unassigned'}</div>
                  <i class="ri-arrow-down-s-line"></i>
                  <div class="select-dropdown">
                    <div class="select-option ${(!lead.assignTo || lead.assignTo === 'Unassigned') ? 'selected' : ''}">Unassigned</div>
${(() => {
              const adminUsers = JSON.parse(localStorage.getItem('thanjai_admin_users')) || [];
              let html = '';
              if (adminUsers.length > 0) {
                adminUsers.filter(u => u.status === 'Active').forEach(u => {
                  const isSel = (lead.assignTo === u.fullName || lead.assignedTo === u.fullName) ? 'selected' : '';
                  html += `<div class="select-option ${isSel}">${u.fullName}</div>`;
                });
              } else {
                html += `<div class="select-option" style="color:var(--os-gray-400);">No staff found</div>`;
              }
              return html;
            })()}
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label>Follow-up Date</label>
                <input type="date" id="edit-lead-followup" value="${lead.followup && lead.followup !== '—' ? lead.followup : ''}" style="color: var(--os-gray-600);" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group" style="width: 100%;">
                <label>Requirement notes</label>
                <textarea id="edit-lead-notes" rows="3" style="width: 100%; border: var(--os-border-thin); border-radius: var(--os-radius-sm); padding: 12px; font-family: inherit; resize: vertical;">${typeof lead.notes === 'string' ? lead.notes : ''}</textarea>
              </div>
            </div>
          </form>
        </div>
        <div class="os-modal-footer">
          <button class="os-btn-secondary" id="cancel-edit-btn">Cancel</button>
          <button class="os-btn-primary" id="btn-save-edit" style="background: var(--os-luxury-orange); border-color: var(--os-luxury-orange);">Save Changes</button>
        </div>
      </div>
    </div>
    <div class="os-modal-overlay" id="schedule-visit-modal">
      <div class="os-modal-card" style="max-width: 480px;">
        <div class="os-modal-header">
          <h2>Schedule site visit / inspection</h2>
          <button class="os-modal-close" id="close-schedule-modal"><i class="ri-close-line"></i></button>
        </div>
        <div class="os-modal-body">
          <div class="form-group" style="margin-bottom: 16px;">
            <label style="font-size: 0.85rem; font-weight: 600; margin-bottom: 8px; display: block; color: var(--os-dark);">Visit Type *</label>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <label style="display: flex; align-items: center; gap: 8px; padding: 10px; border: 1px solid var(--os-border-light); border-radius: 8px; cursor: pointer; background: #fff;">
                <input type="radio" name="crm-sv-type" value="Customer Property Tour" checked style="accent-color: var(--os-luxury-orange);" />
                <span style="font-size: 0.85rem; font-weight: 600; color: var(--os-dark);">👥 Customer Tour</span>
              </label>
              <label style="display: flex; align-items: center; gap: 8px; padding: 10px; border: 1px solid var(--os-border-light); border-radius: 8px; cursor: pointer; background: #fff;">
                <input type="radio" name="crm-sv-type" value="Staff Site Pre-Inspection" style="accent-color: #8b5cf6;" />
                <span style="font-size: 0.85rem; font-weight: 600; color: var(--os-dark);">🔍 Pre-Inspection</span>
              </label>
            </div>
          </div>
          <div class="form-group" style="margin-bottom: 16px;">
            <label style="font-size: 0.85rem; font-weight: 600; margin-bottom: 6px; display: block; color: var(--os-dark);">Visit date & time *</label>
            <input type="datetime-local" id="crm-sv-datetime" class="os-input" style="width: 100%;" />
          </div>
          <div class="form-group" style="margin-bottom: 16px;">
            <label style="font-size: 0.85rem; font-weight: 600; margin-bottom: 6px; display: block; color: var(--os-dark);">Assigned Staff Specialist</label>
            <input type="text" id="crm-sv-staff" class="os-input" value="${lead.assignTo || lead.assignedTo || 'Unassigned'}" style="width: 100%;" />
          </div>
          <div class="form-group">
            <label style="font-size: 0.85rem; font-weight: 600; margin-bottom: 6px; display: block; color: var(--os-dark);">Inspection / Visit Notes</label>
            <textarea id="crm-sv-notes" class="os-input" rows="2" placeholder="Key aspects to check, property requirements, or client preferences..." style="width: 100%; resize: vertical;"></textarea>
          </div>
        </div>
        <div class="os-modal-footer">
          <button class="os-btn-secondary" id="cancel-schedule-modal">Cancel</button>
          <button class="os-btn-primary" id="confirm-schedule-modal" style="background: var(--os-luxury-orange); border-color: var(--os-luxury-orange); color: #fff;"><i class="ri-calendar-check-line"></i> Confirm & Schedule</button>
        </div>
      </div>
    </div>

    <div class="os-modal-overlay" id="share-partner-modal">
      <div class="os-modal-card" style="max-width: 500px;">
        <div class="os-modal-header">
          <h2>Share lead with partner company</h2>
          <button class="os-modal-close" id="close-share-modal"><i class="ri-close-line"></i></button>
        </div>
        <div class="os-modal-body">
          <div class="form-group">
            <label>Partner company</label>
            <div class="os-custom-select" style="width: 100%;" id="partner-share-dropdown">
              <div class="select-value">Broadcast to All Partners</div>
              <i class="ri-arrow-down-s-line"></i>
              <div class="select-dropdown" id="partner-share-options">
                <!-- Dynamically populated -->
              </div>
            </div>
          </div>
          <div class="form-group" style="margin-top: 16px;">
            <label>Notes to share</label>
            <textarea id="share-partner-notes" class="os-input" rows="3" placeholder="Context for the partner team..." style="width: 100%; resize: vertical;"></textarea>
          </div>
          <label style="display: flex; align-items: start; gap: 8px; margin-top: 16px; cursor: pointer;">
            <input type="checkbox" id="share-partner-wa" checked style="margin-top: 4px;" />
            <span style="font-size: 0.9rem; color: var(--os-gray-600); line-height: 1.4;">Send requirement & shortlisted properties to the partner on WhatsApp</span>
          </label>
        </div>
        <div class="os-modal-footer">
          <button class="os-btn-secondary" id="cancel-share-modal">Cancel</button>
          <button class="os-btn-primary" id="confirm-share-modal" style="background: var(--os-luxury-orange); border-color: var(--os-luxury-orange); color: #fff;">Share lead</button>
        </div>
      </div>
    </div>

    <!-- Send WhatsApp Modal -->
    <div class="os-modal-overlay" id="send-whatsapp-modal">
      <div class="os-modal-card" style="max-width: 500px;">
        <div class="os-modal-header">
          <h2>Send WhatsApp</h2>
          <button class="os-modal-close" id="close-whatsapp-modal"><i class="ri-close-line"></i></button>
        </div>
        <div class="os-modal-body" style="padding-top: 16px;">
          <div style="font-size: 0.9rem; color: var(--os-gray-600); margin-bottom: 20px;">
            To <span style="font-weight: 500; color: var(--os-dark);">${lead.whatsapp || lead.mobile || '9566321457'}</span>
          </div>
          
          <div class="wa-tab-group" style="display: flex; background: var(--os-white); border: 1px solid var(--os-gray-200); border-radius: 8px; margin-bottom: 24px; overflow: hidden;">
            <button class="wa-tab-btn active" data-tab="template" style="flex: 1; padding: 12px; border: none; background: #e27c3e; color: #fff; font-weight: 500; cursor: pointer; transition: all 0.2s ease;">Use a template</button>
            <button class="wa-tab-btn" data-tab="custom" style="flex: 1; padding: 12px; border: none; background: transparent; color: var(--os-gray-600); font-weight: 500; cursor: pointer; transition: all 0.2s ease;">Write custom message</button>
          </div>

          <!-- Template Tab -->
          <div class="wa-tab-content active" id="wa-tab-template">
            <div class="form-group">
              <label>Template</label>
              <div class="os-custom-select" style="width: 100%;">
                <div class="select-value">Welcome message</div>
                <i class="ri-arrow-down-s-line"></i>
                <div class="select-dropdown" style="max-height: 240px; overflow-y: auto;">
                  <div class="select-option selected">Welcome message</div>
                  <div class="select-option">Initial contact intro</div>
                  <div class="select-option">Property follow-up check-in</div>
                  <div class="select-option">Site visit confirmation</div>
                  <div class="select-option">Site visit reminder</div>
                  <div class="select-option">Site visit feedback request</div>
                  <div class="select-option">Negotiation check-in</div>
                  <div class="select-option">Bank loan assistance</div>
                  <div class="select-option">Partner transfer notification</div>
                  <div class="select-option">Registration testimonial & review</div>
                  <div class="select-option">General property update</div>
                </div>
              </div>
            </div>
            
            <div class="form-group" style="margin-top: 16px;">
              <label>Language</label>
              <div class="os-custom-select" style="width: 100%;">
                <div class="select-value">English</div>
                <i class="ri-arrow-down-s-line"></i>
                <div class="select-dropdown">
                  <div class="select-option selected">English</div>
                  <div class="select-option">Tamil · தமிழ்</div>
                  <div class="select-option">Hindi · हिन्दी</div>
                  <div class="select-option">Telugu · తెలుగు</div>
                  <div class="select-option">Kannada · ಕನ್ನಡ</div>
                  <div class="select-option">Malayalam · മലയാളം</div>
                </div>
              </div>
            </div>

            <!-- Dynamic Template Parameter Customizer -->
            <div id="wa-template-params-container" style="margin-top: 16px; background: #faf8f5; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px;">
              <div style="font-size: 0.8rem; font-weight: 700; color: #4a5568; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                <i class="ri-equalizer-line" style="color: #e27c3e;"></i> Template Parameters (Editable)
              </div>
              <div id="wa-params-fields" style="display: flex; flex-direction: column; gap: 10px;">
                <!-- Injected dynamically -->
              </div>
            </div>
          </div>

          <!-- Custom Tab -->
          <div class="wa-tab-content" id="wa-tab-custom" style="display: none;">
            <div class="form-group">
              <label>Message</label>
              <textarea class="os-input" rows="5" placeholder="Type your message..." style="width: 100%; resize: vertical;"></textarea>
            </div>
            <div class="form-group" style="margin-top: 16px;">
              <label>Language</label>
              <div class="os-custom-select" style="width: 100%;">
                <div class="select-value">English</div>
                <i class="ri-arrow-down-s-line"></i>
                <div class="select-dropdown">
                  <div class="select-option selected">English</div>
                  <div class="select-option">Tamil · தமிழ்</div>
                  <div class="select-option">Hindi · हिन्दी</div>
                  <div class="select-option">Telugu · తెలుగు</div>
                  <div class="select-option">Kannada · ಕನ್ನಡ</div>
                  <div class="select-option">Malayalam · മലയാളം</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="os-modal-footer">
          <button class="os-btn-secondary" id="cancel-whatsapp-modal" style="border: 1px solid var(--os-gray-200); padding: 8px 16px; border-radius: 8px; font-weight: 500; cursor: pointer; color: var(--os-gray-700); background: #fff;">Cancel</button>
          <button class="os-btn-primary" id="confirm-send-whatsapp" style="background: #e27c3e; border: none; border-radius: 8px; padding: 8px 16px; color: #fff; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 8px;">
            <i class="ri-send-plane-fill"></i> Send
          </button>
        </div>
      </div>
    </div>
  `;
}

export async function initLeadDetailView(id) {
  try {
    await initLeadsView();
    try {
      const apiVisits = await fetchFromAPI('/site_visits');
      if (apiVisits && Array.isArray(apiVisits)) {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const parsedVisits = apiVisits.map(v => {
          const vd = new Date(v.visitDate || v.createdAt || Date.now());
          const hours = vd.getHours();
          const mins = vd.getMinutes().toString().padStart(2, '0');
          const ampm = hours >= 12 ? 'PM' : 'AM';
          const h12 = hours % 12 || 12;

          let clientName = v.leadId || '';
          let property = v.propertyId || '';
          let assignedTo = v.assignedTo || 'Unassigned';
          let visitType = v.visitType || 'Customer Property Tour';
          let outcome = v.outcome || '';
          let notesVal = '';
          try { 
            if (v.notes) { 
              const n = typeof v.notes === 'string' && v.notes.startsWith('{') ? JSON.parse(v.notes) : v.notes; 
              clientName = n.clientName || clientName; 
              property = n.property || property; 
              assignedTo = n.assignedTo || assignedTo;
              visitType = n.visitType || visitType;
              notesVal = n.notes || notesVal;
            } 
          } catch(e){}

          return {
            id: v.id,
            leadId: v.leadId,
            date: vd.getDate().toString(),
            month: monthNames[vd.getMonth()],
            hours: h12.toString().padStart(2, '0'),
            mins: mins,
            ampm: ampm,
            clientName: clientName,
            phone: v.phone || 'Site Visit',
            property: property,
            assignedTo: assignedTo,
            visitType: visitType,
            outcome: outcome || notesVal,
            status: v.status || 'Scheduled',
            createdAt: v.createdAt || v.created_at || v.visitDate || new Date().toISOString(),
            visitDate: v.visitDate || null,
            visitDateRaw: v.visitDate || null
          };
        });
        localStorage.setItem('thanjai_visits', JSON.stringify(parsedVisits));
      }
    } catch(err) {}

    const contentEl = document.getElementById('os-content');
    if (contentEl) {
      contentEl.innerHTML = renderLeadDetailView(id);
    }
  } catch(e) {}

  const shareDropdownWrap = document.getElementById('partner-share-dropdown');
  const shareDropdownOptions = document.getElementById('partner-share-options');
  if (shareDropdownWrap && shareDropdownOptions) {
    const partners = JSON.parse(localStorage.getItem('thanjai_partners')) || [];
    let optionsHtml = '<div class="select-option selected" data-id="ALL">Broadcast to All Partners <i class="ri-broadcast-line" style="margin-left:8px; color:var(--os-luxury-orange);"></i></div>';
    partners.forEach(p => {
      if ((p.status || 'Active').toLowerCase() === 'active') {
        optionsHtml += `<div class="select-option" data-id="${p.id}">${p.company || p.name}</div>`;
      }
    });
    shareDropdownOptions.innerHTML = optionsHtml;
    
    // Custom dropdown logic for partner share modal
    const selected = shareDropdownWrap.querySelector('.select-value');
    selected.dataset.id = 'ALL';
    selected.addEventListener('click', (e) => {
      e.stopPropagation();
      shareDropdownWrap.classList.toggle('open');
    });
    shareDropdownOptions.querySelectorAll('.select-option').forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        shareDropdownOptions.querySelectorAll('.select-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        selected.innerHTML = opt.innerHTML;
        selected.dataset.id = opt.dataset.id;
        shareDropdownWrap.classList.remove('open');
      });
    });
    window.addEventListener('click', (e) => {
      if (!shareDropdownWrap.contains(e.target)) {
        shareDropdownWrap.classList.remove('open');
      }
    });
  }

  const scheduleModal = document.getElementById('schedule-visit-modal');
  const btnSchedule = document.getElementById('btn-schedule-visit');
  const btnTabSchedule = document.getElementById('btn-tab-schedule-visit');
  const btnEmptySchedule = document.getElementById('btn-empty-schedule-visit');
  const closeSchedule = document.getElementById('close-schedule-modal');
  const cancelSchedule = document.getElementById('cancel-schedule-modal');
  const confirmSchedule = document.getElementById('confirm-schedule-modal');

  const openSchedModal = () => {
    if (scheduleModal) scheduleModal.classList.add('show');
  };

  if (btnSchedule) btnSchedule.addEventListener('click', openSchedModal);
  if (btnTabSchedule) btnTabSchedule.addEventListener('click', openSchedModal);
  if (btnEmptySchedule) btnEmptySchedule.addEventListener('click', openSchedModal);
  if (closeSchedule) closeSchedule.addEventListener('click', () => scheduleModal.classList.remove('show'));
  if (cancelSchedule) cancelSchedule.addEventListener('click', () => scheduleModal.classList.remove('show'));
  if (confirmSchedule) {
    confirmSchedule.addEventListener('click', () => {
      const datetime = document.getElementById('crm-sv-datetime').value;
      if (!datetime) {
        showToast("Please select a visit date and time.", "warning");
        return;
      }

      const selectedTypeEl = document.querySelector('input[name="crm-sv-type"]:checked');
      const visitType = selectedTypeEl ? selectedTypeEl.value : 'Customer Property Tour';
      const staffVal = (document.getElementById('crm-sv-staff')?.value || '').trim() || lead.assignTo || lead.assignedTo || 'Unassigned';
      const notesVal = (document.getElementById('crm-sv-notes')?.value || '').trim();

      // Fetch lead info
      const leads = getLeads() || [];
      const currentLead = leads.find(l => String(l.id) === String(id)) || lead;
      if (!currentLead) return;

      const dateObj = new Date(datetime);
      const day = dateObj.getDate().toString();
      let hours = dateObj.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      const mins = dateObj.getMinutes().toString().padStart(2, '0');
      
      const propertyText = (currentLead.area || '') + ' ' + (currentLead.type || '');
      
      const visitData = {
        id: 'SV-' + Date.now(),
        leadId: currentLead.id || currentLead.name,
        propertyId: propertyText.trim() || 'TBD',
        visitDate: datetime.replace('T', ' ') + ':00',
        status: 'Scheduled',
        assignedTo: staffVal,
        visitType: visitType,
        outcome: notesVal ? `[${visitType}] Notes: ${notesVal}` : `[${visitType}] Scheduled`,
        notes: JSON.stringify({ clientName: currentLead.name, property: propertyText.trim() || 'TBD', phone: currentLead.mobile, visitType, notes: notesVal })
      };

      fetchFromAPI('/site_visits', {
        method: 'POST',
        body: JSON.stringify(visitData)
      }).catch(err => console.warn("API site visit save:", err));

      // Always save locally to thanjai_visits
      let visits = JSON.parse(localStorage.getItem('thanjai_visits')) || [];
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const nowIso = new Date().toISOString();
      visits.push({
        id: visitData.id,
        visitId: visitData.id,
        leadId: currentLead.id,
        date: day,
        month: monthNames[dateObj.getMonth()],
        hours: hours.toString(),
        mins: mins,
        ampm: ampm,
        clientName: currentLead.name,
        phone: currentLead.mobile || 'Site Visit',
        property: propertyText.trim() || 'TBD',
        assignedTo: staffVal,
        visitType: visitType,
        outcome: notesVal,
        status: 'Scheduled',
        createdAt: nowIso,
        visitDate: visitData.visitDate,
        visitDateRaw: visitData.visitDate,
        isNew: true
      });
      localStorage.setItem('thanjai_visits', JSON.stringify(visits));

      // Append to lead timeline
      const visitDateFormatted = `${day} ${monthNames[dateObj.getMonth()]} ${dateObj.getFullYear()}, ${hours}:${mins} ${ampm}`;
      if (!currentLead.timeline) currentLead.timeline = [];
      currentLead.timeline.unshift({
        id: visitData.id,
        visitId: visitData.id,
        type: 'visit',
        message: `${visitType} scheduled: ${propertyText.trim() || 'Property'} (${visitDateFormatted})`,
        details: notesVal ? `Notes: ${notesVal}` : '',
        author: staffVal,
        date: nowIso,
        createdAt: nowIso
      });
      saveAndSyncLeads(leads, id);

      scheduleModal.classList.remove('show');
      showToast(`${visitType} scheduled for ${currentLead.name}!`, 'success');

      // Re-render the detail view to reflect new visit
      const osContent = document.getElementById('os-content');
      if (osContent) {
        osContent.innerHTML = renderLeadDetailView(id);
        initLeadDetailView(id);
        // Switch to visits tab automatically
        const visitsTab = document.querySelector('.ld-tab[data-target="pane-visits"]');
        if (visitsTab) visitsTab.click();
      }
    });
  }

  const shareModal = document.getElementById('share-partner-modal');
  const btnShare = document.getElementById('btn-share-partner');
  const btnTabShare = document.getElementById('btn-tab-share-partner');
  const btnEmptyShare = document.getElementById('btn-empty-share-partner');
  const closeShare = document.getElementById('close-share-modal');
  const cancelShare = document.getElementById('cancel-share-modal');
  const confirmShare = document.getElementById('confirm-share-modal');

  const openShareModal = () => {
    if (shareModal) shareModal.classList.add('show');
  };

  if (btnShare) btnShare.addEventListener('click', openShareModal);
  if (btnTabShare) btnTabShare.addEventListener('click', openShareModal);
  if (btnEmptyShare) btnEmptyShare.addEventListener('click', openShareModal);
  if (closeShare) closeShare.addEventListener('click', () => shareModal.classList.remove('show'));
  if (cancelShare) cancelShare.addEventListener('click', () => shareModal.classList.remove('show'));
  if (confirmShare) {
    confirmShare.addEventListener('click', async () => {
      let partners = JSON.parse(localStorage.getItem('thanjai_partners')) || [];
      const selectedValue = document.querySelector('#partner-share-dropdown .select-value');
      let partnerId = selectedValue ? selectedValue.dataset.id : null;
      const selectedText = (selectedValue ? (selectedValue.innerText || selectedValue.textContent) : '').trim();

      if (!partnerId || partnerId === 'ALL') {
        if (selectedText.toLowerCase().includes('broadcast')) {
          partnerId = 'ALL';
        } else {
          const match = partners.find(p => (p.company || p.name || '').trim().toLowerCase() === selectedText.toLowerCase());
          if (match) {
            partnerId = match.id;
          }
        }
      }

      if (!partnerId && partners.length > 0) {
        const match = partners.find(p => selectedText.toLowerCase().includes((p.company || p.name || '').toLowerCase()));
        partnerId = match ? match.id : partners[0].id;
      }

      const notes = document.getElementById('share-partner-notes')?.value || '';
      const sendWa = document.getElementById('share-partner-wa')?.checked ?? true;
      
      const leads = getLeads() || [];
      const currentLead = leads.find(l => String(l.id) === String(id)) || lead;
      if (!currentLead) return;

      let sharedLeadsData = JSON.parse(localStorage.getItem('thanjai_shared_leads')) || {};
      const activeUser = JSON.parse(localStorage.getItem('thanjai_active_user')) || { fullName: 'Aishwarya Raman' };
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) + ', ' + now.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });

      // Mask client direct phone number to protect lead privacy
      const maskedPhone = 'Protected by Desk (+91 84899 96852)';
      const clientLoc = currentLead.location || currentLead.city || currentLead.area || 'Thanjavur';
      const clientReq = currentLead.requirement || currentLead.type || 'Residential Plot / Villa';
      const clientBudget = currentLead.budget || (currentLead.budgetMax ? '₹ ' + currentLead.budgetMax : '₹ 25 - 50 Lakhs');

      const newSharedRecord = {
        id: `SL-${Date.now()}`,
        leadId: currentLead.id,
        name: currentLead.name || 'Client',
        phone: maskedPhone,
        location: clientLoc,
        propertyType: clientReq,
        budget: clientBudget,
        sharedBy: activeUser.fullName || 'Admin',
        sharedDate: dateStr,
        notes: notes,
        status: 'Shared'
      };

      // Helper function to dispatch WhatsApp message to a partner via official WhatsApp API (8489996852)
      const sendWhatsAppToPartner = async (partner) => {
        let pPhone = (partner.phone || partner.whatsapp || '').replace(/\D/g, '');
        if (!pPhone) return;
        if (pPhone.length === 10) pPhone = '+91' + pPhone;
        else if (pPhone.length === 12 && pPhone.startsWith('91')) pPhone = '+' + pPhone;
        else if (!pPhone.startsWith('+')) pPhone = '+' + pPhone;

        const partnerName = partner.company || partner.name || partner.contact || 'Partner';
        const clientName = currentLead.name || 'Client';
        const preferredLoc = clientLoc || 'Thanjavur';
        const reqType = clientReq || 'Residential Plot / Villa';
        const budget = clientBudget || 'Contact for Budget';
        const handoverNotes = notes || 'Requirement from CRM';

        const templateMessage = `Hello ${partnerName},\n\nA new qualified buyer requirement has been assigned to you from Thanjai Property:\n\n👤 Client Name: ${clientName}\n📍 Preferred Location: ${preferredLoc}\n🏡 Requirement: ${reqType}\n💰 Budget Range: ${budget}\n\n📝 Notes: ${handoverNotes}\n\nFor client coordination, please connect through our official desk: +91 84899 96852.\n\nWarm regards,\nThanjai Property Partner Network`;

        // Save to whatsapp_logs table in database
        fetchFromAPI('/whatsapp_logs', {
          method: 'POST',
          body: JSON.stringify({
            id: `WA-${Date.now()}`,
            leadId: currentLead.id,
            phone: pPhone,
            sender: 'Super Admin',
            recipientName: partnerName,
            message: templateMessage,
            type: 'outbound'
          })
        }).catch(() => {});

        addAuditLog({
          action: `Assigned Lead to Partner (${partnerName})`,
          module: 'WhatsApp Log',
          details: `Sent partner_lead_assignment template to ${partnerName} (${pPhone}) for client ${clientName}.`
        });

        try {
          const res = await sendWhatsAppMessage({
            campaignName: 'partner_lead_assignment',
            destination: pPhone,
            userName: partnerName,
            leadId: currentLead.id,
            templateParams: [
              partnerName,
              clientName,
              preferredLoc,
              reqType,
              budget,
              handoverNotes
            ]
          });
          if (res.success) {
            showToast(`WhatsApp sent to partner ${partnerName}!`, 'ri-checkbox-circle-fill');
          } else {
            console.warn("SmartPing partner dispatch notice:", res.error);
            showToast(`SmartPing: ${res.error || 'Check campaign status in SmartPing'}`, 'ri-alert-line');
          }
        } catch (err) {
          console.warn("Partner WhatsApp dispatch error:", err);
        }
      };

      // Helper function to dispatch partner transfer notification to the client
      const sendWhatsAppToClient = async (partner) => {
        let cPhone = (currentLead.whatsapp || currentLead.mobile || currentLead.phone || '').replace(/\D/g, '');
        if (!cPhone) return;
        if (cPhone.length === 10) cPhone = '+91' + cPhone;
        else if (cPhone.length === 12 && cPhone.startsWith('91')) cPhone = '+' + cPhone;
        else if (!cPhone.startsWith('+')) cPhone = '+' + cPhone;

        const partnerName = partner ? (partner.company || partner.name || partner.contact || 'our specialist partner') : 'our specialist partner';
        const clientName = currentLead.name || 'Client';
        const preferredLoc = clientLoc || 'Thanjavur';

        const clientTemplateMessage = `Hello ${clientName},\n\nYour property requirement in ${preferredLoc} has been assigned to our senior partner specialist ${partnerName}.\n\nOur team and specialist will assist you with exclusive listings, verified Patta documents, and on-site visits.\n\nFor any direct assistance, contact our official desk at +91 84899 96852.\n\nBest regards,\nThanjai Property`;

        // Save to whatsapp_logs table in database
        fetchFromAPI('/whatsapp_logs', {
          method: 'POST',
          body: JSON.stringify({
            id: `WA-${Date.now()}-client`,
            leadId: currentLead.id,
            phone: cPhone,
            sender: 'Super Admin',
            recipientName: clientName,
            message: clientTemplateMessage,
            type: 'outbound'
          })
        }).catch(() => {});

        addAuditLog({
          action: `Notified Client on Partner Transfer (${clientName})`,
          module: 'WhatsApp Log',
          details: `Sent partner_transfer_notification to client ${clientName} (${cPhone}) assigned to ${partnerName}.`
        });

        try {
          const res = await sendWhatsAppMessage({
            campaignName: 'partner_transfer_notification',
            destination: cPhone,
            userName: clientName,
            leadId: currentLead.id,
            templateParams: [
              clientName,
              preferredLoc,
              partnerName,
              '+91 84899 96852'
            ]
          });
          if (res.success) {
            showToast(`WhatsApp notification sent to client ${clientName}!`, 'ri-checkbox-circle-fill');
          } else {
            console.warn("SmartPing client dispatch notice:", res.error);
          }
        } catch (err) {
          console.warn("Client WhatsApp dispatch error:", err);
        }
      };

      if (partnerId === 'ALL') {
        const activePartners = partners.filter(p => (p.status || 'Active').toLowerCase() === 'active');
        
        for (const p of activePartners) {
          const pSharedRecord = { ...newSharedRecord, id: `SL-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`, partnerId: String(p.id) };
          try {
            await fetchFromAPI('/shared_leads', { method: 'POST', body: JSON.stringify(pSharedRecord) });
          } catch (err) {
            console.error("Failed to save shared lead to DB:", err);
          }

          if (typeof sharedLeadsData !== 'object' || Array.isArray(sharedLeadsData)) {
            sharedLeadsData = {};
          }
          if (!sharedLeadsData[p.id]) sharedLeadsData[p.id] = [];
          sharedLeadsData[p.id].push(pSharedRecord);

          p.leads = (p.leads || 0) + 1;
          if (sendWa) sendWhatsAppToPartner(p);
        }
        
        if (sendWa) sendWhatsAppToClient(null);

        localStorage.setItem('thanjai_shared_leads', JSON.stringify(sharedLeadsData));
        localStorage.setItem('thanjai_partners', JSON.stringify(partners));

        // Add timeline
        if (!currentLead.timeline) currentLead.timeline = [];
        currentLead.timeline.unshift({
          type: 'partner',
          message: 'Broadcasted requirement to ALL channel partners (Client contact protected)',
          details: notes ? `Notes: ${notes}` : '',
          author: activeUser.fullName || 'Admin',
          date: new Date().toISOString()
        });
        saveAndSyncLeads(leads, id);

        shareModal.classList.remove('show');
        showToast(`Lead requirement broadcasted to ${activePartners.length} partners via official WhatsApp (+91 84899 96852).`, 'ri-checkbox-circle-fill');
        const content = document.getElementById('os-content');
        if (content) {
          content.innerHTML = renderLeadDetailView(id);
          initLeadDetailView(id);
          const partnerTab = document.querySelector('.ld-tab[data-target="pane-partner"]');
          if (partnerTab) partnerTab.click();
        }
      } else if (partnerId) {
        newSharedRecord.partnerId = String(partnerId);
        try {
          await fetchFromAPI('/shared_leads', { method: 'POST', body: JSON.stringify(newSharedRecord) });
        } catch (err) {
          console.error("Failed to save shared lead to DB:", err);
        }

        if (typeof sharedLeadsData !== 'object' || Array.isArray(sharedLeadsData)) {
          sharedLeadsData = {};
        }
        if (!sharedLeadsData[partnerId]) sharedLeadsData[partnerId] = [];
        sharedLeadsData[partnerId].push(newSharedRecord);
        localStorage.setItem('thanjai_shared_leads', JSON.stringify(sharedLeadsData));

        const partnerIdx = partners.findIndex(p => String(p.id) === String(partnerId));
        let partnerName = 'Partner';
        if (partnerIdx !== -1) {
          partnerName = partners[partnerIdx].company || partners[partnerIdx].name;
          partners[partnerIdx].leads = (partners[partnerIdx].leads || 0) + 1;
          localStorage.setItem('thanjai_partners', JSON.stringify(partners));
          if (sendWa) {
            await sendWhatsAppToPartner(partners[partnerIdx]);
            await sendWhatsAppToClient(partners[partnerIdx]);
          }
        }

        // Add timeline
        if (!currentLead.timeline) currentLead.timeline = [];
        currentLead.timeline.unshift({
          type: 'partner',
          message: `Shared requirement with partner "${partnerName}" (Client contact protected)`,
          details: notes ? `Handover note: ${notes}` : '',
          author: activeUser.fullName || 'Admin',
          date: new Date().toISOString()
        });
        saveAndSyncLeads(leads, id);

        shareModal.classList.remove('show');
        showToast(`Lead requirement for "${currentLead.name}" shared with ${partnerName} via official WhatsApp!`, 'ri-checkbox-circle-fill');
        const content = document.getElementById('os-content');
        if (content) {
          content.innerHTML = renderLeadDetailView(id);
          initLeadDetailView(id);
          const partnerTab = document.querySelector('.ld-tab[data-target="pane-partner"]');
          if (partnerTab) partnerTab.click();
        }
      } else {
        showToast('Please select a partner company or Broadcast option.', 'ri-alert-line');
      }
    });
  }

  // Close modals on outside click
  window.addEventListener('click', (e) => {
    const editModal = document.getElementById('edit-lead-modal');
    const waModal = document.getElementById('send-whatsapp-modal');
    if (e.target === scheduleModal) scheduleModal.classList.remove('show');
    if (e.target === shareModal) shareModal.classList.remove('show');
    if (editModal && e.target === editModal) editModal.classList.remove('show');
    if (waModal && e.target === waModal) waModal.classList.remove('show');
  });

  // WhatsApp Modal Logic
  const waModal = document.getElementById('send-whatsapp-modal');
  const btnWA = document.getElementById('btn-send-whatsapp');
  const closeWA = document.getElementById('close-whatsapp-modal');
  const cancelWA = document.getElementById('cancel-whatsapp-modal');
  const confirmWA = document.getElementById('confirm-send-whatsapp') || document.getElementById('confirm-whatsapp-modal');
  const waTabBtns = document.querySelectorAll('.wa-tab-btn');
  const waTabContents = document.querySelectorAll('.wa-tab-content');

  function getCampaignKey(templateText) {
    const campaignMap = {
      "Initial contact intro (Single property showcase)": "initial_contact_intro",
      "Welcome message (Intro)": "welcome_message",
      "Welcome message": "welcome_message",
      "Initial contact intro": "initial_contact_intro",
      "Property follow-up check-in": "property_follow_up",
      "Site visit confirmation": "site_visit_confirmation",
      "Site visit reminder (Today)": "site_visit_reminder",
      "Site visit reminder": "site_visit_reminder",
      "Site visit feedback request": "site_visit_feedback",
      "Site visit feedback": "site_visit_feedback",
      "Negotiation check-in": "negotiation_check_in",
      "Bank loan assistance": "bank_loan_assistance",
      "Partner transfer notification (client)": "partner_transfer_notification",
      "Partner transfer notification": "partner_transfer_notification",
      "Registration testimonial & review": "registration_testimonial_referral",
      "General property update": "general_property_update",
      // Backwards-compatible aliases
      "Initial contact intro (auto)": "initial_contact_intro",
      "Welcome message": "welcome_message",
      "Follow-up nurture message": "property_follow_up",
      "Follow-up message": "property_follow_up",
      "Site visit scheduled (auto)": "site_visit_confirmation",
      "Site visit confirmation (auto)": "site_visit_confirmation",
      "Site visit feedback request (auto)": "site_visit_feedback",
      "Site visit reminder": "site_visit_reminder",
      "Negotiation check-in (auto)": "negotiation_check_in",
      "Bank loan assistance (auto)": "bank_loan_assistance",
      "Registration testimonial & deal won (auto)": "registration_testimonial_referral",
      "Registration testimonial & referral (auto)": "registration_testimonial_referral",
      "General property update (direct)": "general_property_update",
      "No template (auto message)": "general_property_update"
    };
    return campaignMap[templateText] || templateText.replace('(auto)', '').trim().toLowerCase().replace(/[\s-]/g, '_');
  }

  function renderTemplateParamsFields(templateKey, currentLead) {
    const container = document.getElementById('wa-params-fields');
    if (!container) return;

    const allProps = getProperties() || JSON.parse(localStorage.getItem('thanjai_properties')) || [];
    
    // Bidirectional property lookup checking ID and Title
    let matchedProp = null;
    const reqStr = (currentLead.propertyMatch || currentLead.propertyId || currentLead.requirement || '').trim();
    if (reqStr) {
      matchedProp = allProps.find(p => 
        String(p.id).toLowerCase() === reqStr.toLowerCase() || 
        p.title.toLowerCase() === reqStr.toLowerCase() ||
        (p.id && reqStr.toUpperCase().includes(p.id.toUpperCase()))
      );
    }
    if (!matchedProp && currentLead.propertyId) {
      matchedProp = allProps.find(p => String(p.id) === String(currentLead.propertyId));
    }
    if (!matchedProp && allProps.length > 0) {
      matchedProp = allProps[0];
    }

    const clientName = currentLead.name || "Client";
    const isIdString = /^TP-?\d+$/i.test(reqStr);
    const propTitle = matchedProp ? matchedProp.title : (!isIdString && reqStr ? reqStr : (currentLead.type || "DTCP Approved Plot"));
    const propLoc = (matchedProp && matchedProp.location) ? matchedProp.location : (currentLead.city || currentLead.location || "Thanjavur");
    const propPrice = (matchedProp && (matchedProp.priceFormatted || matchedProp.price)) ? (matchedProp.priceFormatted || `₹ ${parseInt(matchedProp.price).toLocaleString('en-IN')}`) : "₹ 25 - 50 Lakhs";

    let fieldsHtml = '';

    const propSelectHtml = `
      <div style="margin-bottom: 8px;">
        <label style="font-size:0.75rem; font-weight:700; color:#4a5568; display:block; margin-bottom:4px;">
          <i class="ri-building-line" style="color:#e27c3e;"></i> Choose Property from Inventory (Auto-fills values)
        </label>
        <select id="wa-quick-prop-select" class="os-input" style="width: 100%; padding: 6px 10px; font-size: 0.85rem; background: #ffffff;">
          ${allProps.map(p => {
            const isSel = matchedProp && String(matchedProp.id) === String(p.id);
            return `<option value="${p.id}" data-title="${p.title}" data-loc="${p.location || 'Thanjavur'}" data-price="${p.priceFormatted || ''}" ${isSel ? 'selected' : ''}>
              [${p.id}] ${p.title} (${p.location || 'Thanjavur'})
            </option>`;
          }).join('')}
        </select>
      </div>
    `;

    switch (templateKey) {
      case "initial_contact_intro":
        fieldsHtml = `
          ${propSelectHtml}
          <div>
            <label style="font-size:0.75rem; font-weight:700; color:#4a5568; display:block; margin-bottom:4px;">{{1}} Client Name</label>
            <input type="text" id="wa-p1" class="os-input" value="${clientName}" style="width:100%; padding:6px 10px; font-size:0.85rem;" />
          </div>
          <div style="margin-top:8px;">
            <label style="font-size:0.75rem; font-weight:700; color:#4a5568; display:block; margin-bottom:4px;">{{2}} Property Title</label>
            <input type="text" id="wa-p2" class="os-input" value="${propTitle}" style="width:100%; padding:6px 10px; font-size:0.85rem;" />
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:8px;">
            <div>
              <label style="font-size:0.75rem; font-weight:700; color:#4a5568; display:block; margin-bottom:4px;">{{3}} Location</label>
              <input type="text" id="wa-p3" class="os-input" value="${propLoc}" style="width:100%; padding:6px 10px; font-size:0.85rem;" />
            </div>
            <div>
              <label style="font-size:0.75rem; font-weight:700; color:#4a5568; display:block; margin-bottom:4px;">{{4}} Price</label>
              <input type="text" id="wa-p4" class="os-input" value="${propPrice}" style="width:100%; padding:6px 10px; font-size:0.85rem;" />
            </div>
          </div>
        `;
        break;

      case "welcome_message":
        fieldsHtml = `
          <div>
            <label style="font-size:0.75rem; font-weight:700; color:#4a5568; display:block; margin-bottom:4px;">{{1}} Client Name</label>
            <input type="text" id="wa-p1" class="os-input" value="${clientName}" style="width:100%; padding:6px 10px; font-size:0.85rem;" />
          </div>
        `;
        break;

      case "property_follow_up":
        fieldsHtml = `
          ${propSelectHtml}
          <div>
            <label style="font-size:0.75rem; font-weight:700; color:#4a5568; display:block; margin-bottom:4px;">{{1}} Client Name</label>
            <input type="text" id="wa-p1" class="os-input" value="${clientName}" style="width:100%; padding:6px 10px; font-size:0.85rem;" />
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:8px;">
            <div>
              <label style="font-size:0.75rem; font-weight:700; color:#4a5568; display:block; margin-bottom:4px;">{{2}} Property Title</label>
              <input type="text" id="wa-p2" class="os-input" value="${propTitle}" style="width:100%; padding:6px 10px; font-size:0.85rem;" />
            </div>
            <div>
              <label style="font-size:0.75rem; font-weight:700; color:#4a5568; display:block; margin-bottom:4px;">{{3}} Location</label>
              <input type="text" id="wa-p3" class="os-input" value="${propLoc}" style="width:100%; padding:6px 10px; font-size:0.85rem;" />
            </div>
          </div>
        `;
        break;

      case "site_visit_confirmation":
        fieldsHtml = `
          ${propSelectHtml}
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <div>
              <label style="font-size:0.75rem; font-weight:700; color:#4a5568; display:block; margin-bottom:4px;">{{1}} Client Name</label>
              <input type="text" id="wa-p1" class="os-input" value="${clientName}" style="width:100%; padding:6px 10px; font-size:0.85rem;" />
            </div>
            <div>
              <label style="font-size:0.75rem; font-weight:700; color:#4a5568; display:block; margin-bottom:4px;">{{2}} Property Title</label>
              <input type="text" id="wa-p2" class="os-input" value="${propTitle}" style="width:100%; padding:6px 10px; font-size:0.85rem;" />
            </div>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:8px;">
            <div>
              <label style="font-size:0.75rem; font-weight:700; color:#4a5568; display:block; margin-bottom:4px;">{{3}} Date & Time</label>
              <input type="text" id="wa-p3" class="os-input" value="Tomorrow at 10:30 AM" style="width:100%; padding:6px 10px; font-size:0.85rem;" />
            </div>
            <div>
              <label style="font-size:0.75rem; font-weight:700; color:#4a5568; display:block; margin-bottom:4px;">{{4}} Location</label>
              <input type="text" id="wa-p4" class="os-input" value="${propLoc}" style="width:100%; padding:6px 10px; font-size:0.85rem;" />
            </div>
          </div>
          <div style="margin-top:8px;">
            <label style="font-size:0.75rem; font-weight:700; color:#4a5568; display:block; margin-bottom:4px;">{{5}} Google Maps Link</label>
            <input type="text" id="wa-p5" class="os-input" value="https://maps.google.com/?q=${encodeURIComponent(propLoc + ' Thanjavur')}" style="width:100%; padding:6px 10px; font-size:0.85rem;" />
          </div>
        `;
        break;

      case "site_visit_reminder":
        fieldsHtml = `
          ${propSelectHtml}
          <div>
            <label style="font-size:0.75rem; font-weight:700; color:#4a5568; display:block; margin-bottom:4px;">{{1}} Client Name</label>
            <input type="text" id="wa-p1" class="os-input" value="${clientName}" style="width:100%; padding:6px 10px; font-size:0.85rem;" />
          </div>
          <div style="margin-top:8px;">
            <label style="font-size:0.75rem; font-weight:700; color:#4a5568; display:block; margin-bottom:4px;">{{2}} Property Title</label>
            <input type="text" id="wa-p2" class="os-input" value="${propTitle}" style="width:100%; padding:6px 10px; font-size:0.85rem;" />
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:8px;">
            <div>
              <label style="font-size:0.75rem; font-weight:700; color:#4a5568; display:block; margin-bottom:4px;">{{3}} Time</label>
              <input type="text" id="wa-p3" class="os-input" value="10:30 AM" style="width:100%; padding:6px 10px; font-size:0.85rem;" />
            </div>
            <div>
              <label style="font-size:0.75rem; font-weight:700; color:#4a5568; display:block; margin-bottom:4px;">{{4}} Meeting Point</label>
              <input type="text" id="wa-p4" class="os-input" value="${propLoc} Site Location" style="width:100%; padding:6px 10px; font-size:0.85rem;" />
            </div>
          </div>
        `;
        break;

      case "site_visit_feedback":
        fieldsHtml = `
          ${propSelectHtml}
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <div>
              <label style="font-size:0.75rem; font-weight:700; color:#4a5568; display:block; margin-bottom:4px;">{{1}} Client Name</label>
              <input type="text" id="wa-p1" class="os-input" value="${clientName}" style="width:100%; padding:6px 10px; font-size:0.85rem;" />
            </div>
            <div>
              <label style="font-size:0.75rem; font-weight:700; color:#4a5568; display:block; margin-bottom:4px;">{{2}} Property Title</label>
              <input type="text" id="wa-p2" class="os-input" value="${propTitle}" style="width:100%; padding:6px 10px; font-size:0.85rem;" />
            </div>
          </div>
        `;
        break;

      case "negotiation_check_in":
        fieldsHtml = `
          ${propSelectHtml}
          <div>
            <label style="font-size:0.75rem; font-weight:700; color:#4a5568; display:block; margin-bottom:4px;">{{1}} Client Name</label>
            <input type="text" id="wa-p1" class="os-input" value="${clientName}" style="width:100%; padding:6px 10px; font-size:0.85rem;" />
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:8px;">
            <div>
              <label style="font-size:0.75rem; font-weight:700; color:#4a5568; display:block; margin-bottom:4px;">{{2}} Property Title</label>
              <input type="text" id="wa-p2" class="os-input" value="${propTitle}" style="width:100%; padding:6px 10px; font-size:0.85rem;" />
            </div>
            <div>
              <label style="font-size:0.75rem; font-weight:700; color:#4a5568; display:block; margin-bottom:4px;">{{3}} Proposed Meeting Date / Time</label>
              <input type="text" id="wa-p3" class="os-input" value="This Week at Our Office" style="width:100%; padding:6px 10px; font-size:0.85rem;" />
            </div>
          </div>
        `;
        break;

      case "bank_loan_assistance":
        fieldsHtml = `
          ${propSelectHtml}
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <div>
              <label style="font-size:0.75rem; font-weight:700; color:#4a5568; display:block; margin-bottom:4px;">{{1}} Client Name</label>
              <input type="text" id="wa-p1" class="os-input" value="${clientName}" style="width:100%; padding:6px 10px; font-size:0.85rem;" />
            </div>
            <div>
              <label style="font-size:0.75rem; font-weight:700; color:#4a5568; display:block; margin-bottom:4px;">{{2}} Property Title</label>
              <input type="text" id="wa-p2" class="os-input" value="${propTitle}" style="width:100%; padding:6px 10px; font-size:0.85rem;" />
            </div>
          </div>
        `;
        break;

      case "partner_transfer_notification":
        fieldsHtml = `
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <div>
              <label style="font-size:0.75rem; font-weight:700; color:#4a5568; display:block; margin-bottom:4px;">{{1}} Client Name</label>
              <input type="text" id="wa-p1" class="os-input" value="${clientName}" style="width:100%; padding:6px 10px; font-size:0.85rem;" />
            </div>
            <div>
              <label style="font-size:0.75rem; font-weight:700; color:#4a5568; display:block; margin-bottom:4px;">{{2}} Location / Area</label>
              <input type="text" id="wa-p2" class="os-input" value="${propLoc}" style="width:100%; padding:6px 10px; font-size:0.85rem;" />
            </div>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:8px;">
            <div>
              <label style="font-size:0.75rem; font-weight:700; color:#4a5568; display:block; margin-bottom:4px;">{{3}} Executive Name</label>
              <input type="text" id="wa-p3" class="os-input" value="${currentLead.assignTo || 'Area Specialist'}" style="width:100%; padding:6px 10px; font-size:0.85rem;" />
            </div>
            <div>
              <label style="font-size:0.75rem; font-weight:700; color:#4a5568; display:block; margin-bottom:4px;">{{4}} Mobile Number</label>
              <input type="text" id="wa-p4" class="os-input" value="+91 84899 96852" style="width:100%; padding:6px 10px; font-size:0.85rem;" />
            </div>
          </div>
        `;
        break;

      case "registration_testimonial_referral":
        fieldsHtml = `
          ${propSelectHtml}
          <div>
            <label style="font-size:0.75rem; font-weight:700; color:#4a5568; display:block; margin-bottom:4px;">{{1}} Client Name</label>
            <input type="text" id="wa-p1" class="os-input" value="${clientName}" style="width:100%; padding:6px 10px; font-size:0.85rem;" />
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:8px;">
            <div>
              <label style="font-size:0.75rem; font-weight:700; color:#4a5568; display:block; margin-bottom:4px;">{{2}} Property Title</label>
              <input type="text" id="wa-p2" class="os-input" value="${propTitle}" style="width:100%; padding:6px 10px; font-size:0.85rem;" />
            </div>
            <div>
              <label style="font-size:0.75rem; font-weight:700; color:#4a5568; display:block; margin-bottom:4px;">{{3}} Review Link</label>
              <input type="text" id="wa-p3" class="os-input" value="https://g.page/r/thanjai-property/review" style="width:100%; padding:6px 10px; font-size:0.85rem;" />
            </div>
          </div>
        `;
        break;

      case "general_property_update":
      default:
        fieldsHtml = `
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <div>
              <label style="font-size:0.75rem; font-weight:700; color:#4a5568; display:block; margin-bottom:4px;">{{1}} Client Name</label>
              <input type="text" id="wa-p1" class="os-input" value="${clientName}" style="width:100%; padding:6px 10px; font-size:0.85rem;" />
            </div>
            <div>
              <label style="font-size:0.75rem; font-weight:700; color:#4a5568; display:block; margin-bottom:4px;">{{2}} Property Title / Ref</label>
              <input type="text" id="wa-p2" class="os-input" value="${propTitle}" style="width:100%; padding:6px 10px; font-size:0.85rem;" />
            </div>
          </div>
          <div style="margin-top:8px;">
            <label style="font-size:0.75rem; font-weight:700; color:#4a5568; display:block; margin-bottom:4px;">{{3}} Custom Message Content</label>
            <input type="text" id="wa-p3" class="os-input" value="Thank you for your inquiry with Thanjai Property desk." style="width:100%; padding:6px 10px; font-size:0.85rem;" />
          </div>
        `;
        break;
    }

    container.innerHTML = fieldsHtml;

    // Attach listener to Quick Property Select dropdown if rendered
    const quickSelect = container.querySelector('#wa-quick-prop-select');
    if (quickSelect) {
      quickSelect.addEventListener('change', (e) => {
        const opt = e.target.selectedOptions[0];
        if (opt) {
          const selTitle = opt.dataset.title || '';
          const selLoc = opt.dataset.loc || '';
          const selPrice = opt.dataset.price || '';
          const p2Input = container.querySelector('#wa-p2');
          const p3Input = container.querySelector('#wa-p3');
          const p4Input = container.querySelector('#wa-p4');

          if (p2Input) p2Input.value = selTitle;
          if (templateKey === 'initial_contact_intro') {
            if (p3Input) p3Input.value = selLoc;
            if (p4Input) p4Input.value = selPrice || '₹ 25 - 50 Lakhs';
          } else if (templateKey === 'property_follow_up') {
            if (p3Input) p3Input.value = selLoc;
          } else if (templateKey === 'site_visit_confirmation') {
            if (p4Input) p4Input.value = selLoc;
            const p5Input = container.querySelector('#wa-p5');
            if (p5Input) p5Input.value = `https://maps.google.com/?q=${encodeURIComponent(selLoc + ' Thanjavur')}`;
          }
        }
      });
    }
  }

  // Hook into template select dropdown changes to re-render params
  const templateSelect = document.querySelector('#wa-tab-template .os-custom-select');
  if (templateSelect) {
    const options = templateSelect.querySelectorAll('.select-option');
    options.forEach(opt => {
      opt.addEventListener('click', () => {
        const leads = getLeads() || [];
        const activeLead = leads.find(l => String(l.id) === String(id)) || { id, name: 'Client' };
        const key = getCampaignKey(opt.innerText.trim());
        renderTemplateParamsFields(key, activeLead);
      });
    });
  }

  if (btnWA) {
    btnWA.addEventListener('click', () => {
      const leads = getLeads() || [];
      const activeLead = leads.find(l => String(l.id) === String(id)) || { id, name: 'Client' };
      const currentTemplateText = document.querySelector('#wa-tab-template .os-custom-select .select-value')?.innerText.trim() || 'Welcome message';
      renderTemplateParamsFields(getCampaignKey(currentTemplateText), activeLead);
      waModal.classList.add('show');
    });
  }
  
  if (closeWA) closeWA.addEventListener('click', () => waModal.classList.remove('show'));
  if (cancelWA) cancelWA.addEventListener('click', () => waModal.classList.remove('show'));
  
  if (confirmWA) {
    confirmWA.addEventListener('click', async () => {
      let leads = getLeads() || [];
      const idx = leads.findIndex(l => String(l.id) === String(id));
      const activeLead = (idx !== -1 ? leads[idx] : null) || leads.find(l => String(l.id) === String(id)) || { id, name: 'Client', phone: '', mobile: '', whatsapp: '' };

      const isCustom = document.querySelector('.wa-tab-btn[data-tab="custom"]').classList.contains('active');
      let campaignName = '';
      let templateParams = [];
      
      if (isCustom) {
        const customText = document.querySelector('#wa-tab-custom textarea').value;
        if (!customText.trim()) {
          showToast('Please enter a custom message.', 'warning');
          return;
        }
        campaignName = 'general_property_update';
        templateParams = [activeLead.name || "Client", "Direct Message", customText];
      } else {
        const templateText = document.querySelector('#wa-tab-template .os-custom-select .select-value').innerText.trim();
        campaignName = getCampaignKey(templateText);
        
        // --- Language Logic ---
        const langDropdown = document.querySelectorAll('#wa-tab-template .os-custom-select')[1];
        if (langDropdown) {
          const langText = langDropdown.querySelector('.select-value').innerText.trim();
          const langSuffix = {
            "Tamil · தமிழ்": "_ta",
            "Hindi · हिन्दी": "_hi",
            "Telugu · తెలుగు": "_te",
            "Kannada · ಕನ್ನಡ": "_kn",
            "Malayalam · മലയാളം": "_ml"
          }[langText] || "";
          campaignName += langSuffix;
        }

        // Collect custom edited parameter values from fields if present
        const p1 = document.getElementById('wa-p1')?.value.trim() || activeLead.name || "Client";
        const p2 = document.getElementById('wa-p2')?.value.trim() || "DTCP Approved Plot";
        const p3 = document.getElementById('wa-p3')?.value.trim() || activeLead.location || "Thanjavur";
        const p4 = document.getElementById('wa-p4')?.value.trim() || "₹ 25 - 50 Lakhs";
        const p5 = document.getElementById('wa-p5')?.value.trim() || "https://maps.google.com/?q=Thanjavur";
        const p6 = document.getElementById('wa-p6')?.value.trim() || activeLead.notes || "Immediate requirement.";

        const cName = campaignName.replace(/(_ta|_hi|_te|_kn|_ml)$/, ''); 
        
        // Exact parameter count matching SmartPing approved template signatures
        switch (cName) {
          case "welcome_message":
            templateParams = [p1];
            break;

          case "site_visit_feedback":
          case "bank_loan_assistance":
            templateParams = [p1, p2];
            break;

          case "property_follow_up":
          case "negotiation_check_in":
          case "registration_testimonial_referral":
          case "general_property_update":
            templateParams = [p1, p2, p3];
            break;

          case "initial_contact_intro":
          case "site_visit_reminder":
          case "partner_transfer_notification":
            templateParams = [p1, p2, p3, p4];
            break;

          case "site_visit_confirmation":
            templateParams = [p1, p2, p3, p4, p5];
            break;

          default:
            templateParams = [p1, p2, p3, p4].filter(Boolean);
            break;
        }
      }

      let rawPhone = activeLead.whatsapp || activeLead.mobile || activeLead.phone || '';
      let phone = rawPhone.replace(/\D/g, '');
      const last10Digits = phone.slice(-10);
      phone = '91' + last10Digits;
      
      const originalBtnText = confirmWA.innerHTML;
      confirmWA.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Sending...';
      confirmWA.disabled = true;

      let customMedia = undefined;
      if (campaignName.includes('initial_contact_intro')) {
        const allProps = JSON.parse(localStorage.getItem('thanjai_properties')) || [];
        const selectedPropTitle = templateParams[1] || '';
        const matchedProp = allProps.find(p => p.title === selectedPropTitle) || allProps[0];
        let propImg = (matchedProp && matchedProp.images && matchedProp.images[0]) ? matchedProp.images[0] : "";
        if (!propImg || !propImg.startsWith('http')) {
          propImg = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
        }
        customMedia = { url: propImg, filename: "property.jpg" };
      }

      if (campaignName.includes('property_shortlist')) {
        const clientName = activeLead.name || "Client";
        templateParams = [clientName];
      }

      try {
        const dispatchRes = await sendWhatsAppMessage({
          campaignName: campaignName,
          destination: phone,
          userName: activeLead.name || "Client",
          templateParams: templateParams,
          media: customMedia,
          messageText: isCustom ? templateParams[1] : undefined,
          leadId: activeLead.id
        });

        confirmWA.innerHTML = originalBtnText;
        confirmWA.disabled = false;
        waModal.classList.remove('show');
        
        let authorName = 'Super Admin';
        try {
          const userObj = JSON.parse(localStorage.getItem('thanjai_active_user'));
          if (userObj) authorName = userObj.fullName || userObj.name || authorName;
        } catch(e) {}

        if (idx !== -1) {
          if (!leads[idx].timeline) leads[idx].timeline = [];
          const isShortlist = campaignName.includes('property_shortlist');
          const checkedTitles = Array.from(document.querySelectorAll('.wa-prop-checkbox:checked')).map(cb => cb.dataset.title);
          const shortlistNote = (isShortlist && checkedTitles.length > 0) ? ` [Shortlist: ${checkedTitles.join(', ')}]` : '';
          
          if (isShortlist && checkedTitles.length > 0) {
            leads[idx].shortlistedProperties = Array.from(document.querySelectorAll('.wa-prop-checkbox:checked')).map(cb => ({
              title: cb.dataset.title,
              price: cb.dataset.price,
              location: cb.dataset.loc
            }));
          }

          const isSuccess = dispatchRes && (dispatchRes.success === true || dispatchRes.success === 'true');
          const statusPrefix = isSuccess ? 'WhatsApp sent' : 'WhatsApp failed to deliver';
          const errorDetail = (!isSuccess && dispatchRes?.error) ? ` (${dispatchRes.error})` : '';

          leads[idx].timeline.unshift({
            type: 'whatsapp',
            message: `${statusPrefix}: ${isCustom ? 'Custom message' : campaignName}${shortlistNote}${errorDetail}`,
            author: authorName,
            date: new Date().toISOString()
          });
          saveAndSyncLeads(leads, id);

          if (isSuccess) {
            showToast('WhatsApp message sent & logged in chat!', 'ri-checkbox-circle-fill');
          } else {
            showToast(`SmartPing status: ${dispatchRes?.error || 'Message dispatched to queue'}`, 'ri-information-line');
          }
          window.dispatchEvent(new HashChangeEvent('hashchange'));
        } else {
          if (dispatchRes && (dispatchRes.success === true || dispatchRes.success === 'true')) {
            showToast('WhatsApp message sent!', 'ri-checkbox-circle-fill');
          } else {
            showToast(`SmartPing: ${dispatchRes?.error || 'Message dispatched'}`, 'ri-information-line');
          }
        }
      } catch (err) {
        confirmWA.innerHTML = originalBtnText;
        confirmWA.disabled = false;
        alert('Failed to send WhatsApp message:\n' + err.message);
      }
    });
  }

  waTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      waTabBtns.forEach(b => {
        b.classList.remove('active');
        b.style.background = 'transparent';
        b.style.color = 'var(--os-gray-600)';
      });
      btn.classList.add('active');
      btn.style.background = '#e27c3e';
      btn.style.color = '#fff';

      waTabContents.forEach(c => c.style.display = 'none');
      document.getElementById('wa-tab-' + btn.dataset.tab).style.display = 'block';
    });
  });


  // Set Follow-up Logic
  const btnFollowUp = document.getElementById('btn-set-follow-up');
  const followUpInput = document.getElementById('follow-up-datetime');
  if (btnFollowUp && followUpInput) {
    btnFollowUp.addEventListener('click', () => {
      const datetime = followUpInput.value;
      if (!datetime) {
        alert("Please select a date and time for the follow-up.");
        return;
      }
      
      let leads = getLeads() || [];
      const idx = leads.findIndex(l => String(l.id) === String(id));
      if (idx !== -1) {
        const oldStatus = leads[idx].status || 'New Lead';
        leads[idx].status = 'FOLLOW_UP_PENDING';
        leads[idx].followUpDate = datetime;
        
        if (!leads[idx].timeline) leads[idx].timeline = [];
        leads[idx].timeline.unshift({
          type: 'system',
          message: `Follow-up set for ${new Date(datetime).toLocaleString([], {year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})}`,
          author: localStorage.getItem('thanjai_active_user') || 'Aishwarya Raman',
          date: new Date().toISOString()
        });
        
        if (oldStatus !== 'FOLLOW_UP_PENDING') {
          leads[idx].timeline.unshift({
            type: 'pipeline',
            message: `Moved from ${oldStatus.toUpperCase().replace(/\s+/g, '_')} to FOLLOW_UP_PENDING`,
            author: localStorage.getItem('thanjai_active_user') || 'Aishwarya Raman',
            date: new Date().toISOString()
          });
        }
        saveAndSyncLeads(leads, id);
        
        // Show success and refresh view
        alert(`Follow-up set for ${new Date(datetime).toLocaleString()}`);
        const content = document.getElementById('os-content');
        if (content) {
          content.innerHTML = renderLeadDetailView(id);
          initLeadDetailView(id);
        }
      }
    });
  }

  // Notes Logic
  const btnAddNote = document.getElementById('ld-add-note-btn');
  const noteInput = document.getElementById('ld-note-input');
  if (btnAddNote && noteInput) {
    btnAddNote.addEventListener('click', () => {
      const text = noteInput.value.trim();
      if (!text) return;
      
      let leads = getLeads() || [];
      const idx = leads.findIndex(l => String(l.id) === String(id));
      if (idx !== -1) {
        if (!leads[idx].notes) leads[idx].notes = [];
        leads[idx].notes.unshift({
          text: text,
          date: new Date().toISOString()
        });
        saveAndSyncLeads(leads, id);
        const content = document.getElementById('os-content');
        if (content) {
          content.innerHTML = renderLeadDetailView(id);
          initLeadDetailView(id);
        }
      }
    });
  }

  // Edit/Delete Note Logic
  const notesList = document.getElementById('ld-notes-list');
  if (notesList) {
    notesList.addEventListener('click', (e) => {
      const btn = e.target.closest('.note-action-btn');
      if (!btn) return;
      
      const noteIndex = parseInt(btn.dataset.index, 10);
      let leads = getLeads() || [];
      const idx = leads.findIndex(l => String(l.id) === String(id));
      if (idx === -1 || !leads[idx].notes) return;
      
      const action = btn.dataset.action;
      
      if (action === 'delete') {
        showConfirmModal({
          title: 'Delete Note',
          message: 'Are you sure you want to delete this timeline note?',
          confirmText: 'Delete Note',
          isDestructive: true,
          onConfirm: () => {
            leads[idx].notes.splice(noteIndex, 1);
            saveAndSyncLeads(leads, id);
            const content = document.getElementById('os-content');
            if (content) {
              content.innerHTML = renderLeadDetailView(id);
              initLeadDetailView(id);
            }
            showToast('Note deleted successfully', 'ri-delete-bin-line');
          }
        });
      } else if (action === 'edit') {
        const noteToEdit = leads[idx].notes[noteIndex];
        if (noteToEdit) {
           const currentText = typeof noteToEdit === 'string' ? noteToEdit : (noteToEdit.text || '');
           const newText = prompt('Edit note:', currentText);
           if (newText !== null && newText.trim() !== '') {
             if (typeof noteToEdit === 'string') {
               leads[idx].notes[noteIndex] = { text: newText.trim(), date: new Date().toISOString() };
             } else {
               noteToEdit.text = newText.trim();
             }
             saveAndSyncLeads(leads, id);
             const content = document.getElementById('os-content');
             if (content) {
               content.innerHTML = renderLeadDetailView(id);
               initLeadDetailView(id);
             }
           }
        }
      }
    });
  }

  // Matching Properties Logic
  const btnFindMatches = document.getElementById('btn-find-matches');
  const btnSearchMatches = document.getElementById('btn-search-matches');
  const searchInput = document.getElementById('matching-properties-search');
  const resultsContainer = document.getElementById('matching-properties-results');

  function renderMatchingProperties(results, currentQuery = '') {
    if (!results || results.length === 0) {
      if (resultsContainer) {
        resultsContainer.innerHTML = `
          <div style="text-align: center; padding: 24px 16px; background: #f8fafc; border-radius: 8px; border: 1px dashed #cbd5e1; margin-top: 12px;">
            <i class="ri-search-eye-line" style="font-size: 1.8rem; color: #94a3b8; display: block; margin-bottom: 6px;"></i>
            <p style="font-size: 0.88rem; color: var(--os-gray-500); margin: 0;">No matching properties found ${currentQuery ? `for "${currentQuery}"` : ''}.</p>
            <p style="font-size: 0.78rem; color: var(--os-gray-400); margin: 4px 0 0 0;">Try searching by Property ID (e.g. TP-7780, TPC-001), road name, or area.</p>
          </div>
        `;
      }
      return;
    }

    const leads = getLeads() || [];
    const currentLead = leads.find(l => String(l.id) === String(id)) || lead;
    const clientPhone = (currentLead?.whatsapp || currentLead?.mobile || currentLead?.phone || '').replace(/\D/g, '');
    const phoneDisplay = clientPhone.length >= 10 ? `+91 ${clientPhone.slice(-10)}` : 'No mobile number';

    let html = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px; margin-bottom: 8px;">
        <span style="font-size: 0.82rem; font-weight: 700; color: #475569;">
          Found <span style="color: #ea580c;">${results.length}</span> matching propert${results.length === 1 ? 'y' : 'ies'}
        </span>
        <div style="display: flex; gap: 8px;">
          <button type="button" id="btn-select-all-props" style="background: none; border: none; font-size: 0.78rem; color: #ea580c; font-weight: 600; cursor: pointer; text-decoration: underline;">Select all</button>
          <span style="color: #cbd5e1;">|</span>
          <button type="button" id="btn-deselect-all-props" style="background: none; border: none; font-size: 0.78rem; color: #64748b; font-weight: 600; cursor: pointer; text-decoration: underline;">Deselect</button>
        </div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 8px; max-height: 320px; overflow-y: auto; padding-right: 4px;">
    `;

    results.forEach(p => {
      const pImg = Array.isArray(p.images) && p.images[0] ? p.images[0] : (typeof p.images === 'string' ? p.images : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80');
      const cleanPrice = (p.priceFormatted || (p.price ? `₹ ${parseInt(p.price).toLocaleString('en-IN')}` : 'Price on Request'))
        .replace(/â,¹/g, '₹')
        .replace(/â‚¹/g, '₹');

      html += `
        <label class="match-prop-item" data-propid="${p.id}" style="display: flex; gap: 10px; padding: 10px 12px; border: 1px solid #e2e8f0; border-radius: 8px; align-items: center; cursor: pointer; background: #ffffff; transition: all 0.2s ease;">
          <input type="checkbox" class="match-prop-checkbox" value="${p.id}" style="width: 17px; height: 17px; accent-color: #ea580c; cursor: pointer; flex-shrink: 0;" />
          <img src="${pImg}" alt="${p.title}" style="width: 46px; height: 46px; border-radius: 6px; object-fit: cover; flex-shrink: 0; border: 1px solid #cbd5e1;" />
          <div style="flex: 1; min-width: 0;">
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 2px;">
              <span style="font-size: 0.72rem; font-weight: 800; color: #ea580c; background: #fff7ed; border: 1px solid #fed7aa; padding: 1px 6px; border-radius: 4px; font-family: monospace;">${p.id}</span>
              <span style="font-size: 0.7rem; font-weight: 700; color: #475569; background: #f1f5f9; padding: 1px 6px; border-radius: 4px;">${p.type || p.categoryLabel || 'Property'}</span>
            </div>
            <div style="font-weight: 700; font-size: 0.86rem; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${p.title}">${p.title}</div>
            <div style="font-size: 0.78rem; color: #64748b; margin-top: 2px; display: flex; align-items: center; gap: 6px;">
              <span style="color: #ea580c; font-weight: 800;">${cleanPrice}</span>
              <span>•</span>
              <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.location || 'Thanjavur'}</span>
              ${p.size ? `<span style="color: #94a3b8; font-size: 0.72rem;">(${p.size})</span>` : ''}
            </div>
          </div>
        </label>
      `;
    });
    html += '</div>';
    
    html += `
      <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
        <div style="font-size: 0.78rem; color: #64748b;">
          <i class="ri-whatsapp-fill" style="color: #25d366; vertical-align: middle;"></i> Target: <strong>${phoneDisplay}</strong>
        </div>
        <button id="inline-send-wa-btn" class="os-btn-primary" style="background: #25d366; border-color: #25d366; font-weight: 700; font-size: 0.85rem; padding: 8px 16px; display: inline-flex; align-items: center; gap: 6px; color: #fff; cursor: pointer; border-radius: 6px; box-shadow: 0 2px 4px rgba(37,211,102,0.2);">
          <i class="ri-whatsapp-line" style="font-size: 1.05rem;"></i> Send Selected via WhatsApp
        </button>
      </div>
    `;

    if (resultsContainer) {
      resultsContainer.innerHTML = html;

      // Select All / Deselect Listeners
      const btnSelectAll = document.getElementById('btn-select-all-props');
      const btnDeselectAll = document.getElementById('btn-deselect-all-props');
      const checkboxes = document.querySelectorAll('.match-prop-checkbox');

      const updateItemStyles = () => {
        checkboxes.forEach(cb => {
          const itemLabel = cb.closest('.match-prop-item');
          if (itemLabel) {
            if (cb.checked) {
              itemLabel.style.borderColor = '#ea580c';
              itemLabel.style.background = '#fffaf5';
            } else {
              itemLabel.style.borderColor = '#e2e8f0';
              itemLabel.style.background = '#ffffff';
            }
          }
        });
      };

      if (btnSelectAll) {
        btnSelectAll.addEventListener('click', () => {
          checkboxes.forEach(cb => { cb.checked = true; });
          updateItemStyles();
        });
      }

      if (btnDeselectAll) {
        btnDeselectAll.addEventListener('click', () => {
          checkboxes.forEach(cb => { cb.checked = false; });
          updateItemStyles();
        });
      }

      checkboxes.forEach(cb => {
        cb.addEventListener('change', updateItemStyles);
      });

      // Send via WhatsApp Button Handler
      const inlineBtn = document.getElementById('inline-send-wa-btn');
      if (inlineBtn) {
        inlineBtn.addEventListener('click', async () => {
          const checkedBoxes = Array.from(document.querySelectorAll('.match-prop-checkbox:checked'));
          if (checkedBoxes.length === 0) {
            showToast('Please select at least one property to send.', 'warning');
            return;
          }

          const leads = getLeads() || [];
          const currentLead = leads.find(l => String(l.id) === String(id)) || lead;
          if (!currentLead) return;

          const rawPhone = currentLead.whatsapp || currentLead.mobile || currentLead.phone || '';
          const digits = rawPhone.replace(/\D/g, '');
          if (!digits || digits.length < 10) {
            showToast(`No valid 10-digit mobile number found for ${currentLead.name || 'this lead'}.`, 'warning');
            return;
          }
          const destPhone = '+91' + digits.slice(-10);

          const allProps = getProperties() || JSON.parse(localStorage.getItem('thanjai_properties')) || [];
          const selectedPropIds = checkedBoxes.map(cb => cb.value);
          const selectedProps = selectedPropIds.map(pId => allProps.find(p => String(p.id) === String(pId))).filter(Boolean);

          if (selectedProps.length === 0) {
            showToast('Selected properties could not be loaded.', 'warning');
            return;
          }

          const clientName = currentLead.name || 'Valued Client';
          const count = selectedProps.length;

          // Format property recommendation message with clean pricing and direct discovery link
          const baseUrl = window.location.origin;
          const propListText = selectedProps.map((p, idx) => {
            const cleanPrice = (p.priceFormatted || (p.price ? `₹ ${parseInt(p.price).toLocaleString('en-IN')}` : 'Contact Desk'))
              .replace(/â,¹/g, '₹')
              .replace(/â‚¹/g, '₹');
            return `${idx + 1}. *[${p.id}] ${p.title}*\n   📍 Location: ${p.location || 'Thanjavur'}\n   💰 Price: ${cleanPrice}${p.size ? `\n   📐 Size: ${p.size}` : ''}\n   🔗 Details: ${baseUrl}/#discover?id=${encodeURIComponent(p.id)}`;
          }).join('\n\n');

          const singleProp = count === 1 ? selectedProps[0] : null;
          const cleanSinglePrice = singleProp ? (singleProp.priceFormatted || (singleProp.price ? `₹ ${parseInt(singleProp.price).toLocaleString('en-IN')}` : '₹ 25 - 50 Lakhs')).replace(/â,¹/g, '₹').replace(/â‚¹/g, '₹') : '';

          const messageText = count === 1
            ? `Vanakkam ${clientName} 🌾\n\nHere are the details for ${singleProp.title}:\n📍 Location: ${singleProp.location || 'Thanjavur'}\n💰 Price: ${cleanSinglePrice}\n\nWith reference to your reply, we can discuss further to get more information!\n\nBest regards,\nThanjai Property Team`
            : `Hello ${clientName},\n\nHere are ${count} handpicked properties matching your requirement from Thanjai Property:\n\n${propListText}\n\nFor site visits, verified Patta documents, or direct negotiations, please connect with our official desk at +91 84899 96852.\n\nWarm regards,\nThanjai Property`;

          const originalBtnHtml = inlineBtn.innerHTML;
          inlineBtn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Sending WhatsApp...';
          inlineBtn.disabled = true;

          try {
            let targetCampaign = count === 1 ? 'initial_contact_intro' : 'general_property_update';
            let targetParams = count === 1
              ? [clientName, singleProp.title, singleProp.location || 'Thanjavur', cleanSinglePrice]
              : [clientName, `${count} Matching Properties Recommended`, messageText];

            let customMedia = undefined;
            if (count === 1 && singleProp.images && singleProp.images[0]) {
              customMedia = { url: singleProp.images[0], filename: 'property.jpg' };
            }

            // Dispatch via official SmartPing relay
            const dispatchRes = await sendWhatsAppMessage({
              campaignName: targetCampaign,
              destination: destPhone,
              userName: clientName,
              leadId: currentLead.id,
              messageText: messageText,
              templateParams: targetParams,
              media: customMedia
            });

            let authorName = 'Super Admin';
            try {
              const activeUser = JSON.parse(localStorage.getItem('thanjai_active_user'));
              if (activeUser) authorName = activeUser.fullName || activeUser.name || authorName;
            } catch(e) {}

            // 1. Post to whatsapp_logs table in database
            fetchFromAPI('/whatsapp_logs', {
              method: 'POST',
              body: JSON.stringify({
                id: `WA-${Date.now()}`,
                leadId: currentLead.id,
                phone: destPhone,
                sender: authorName,
                recipientName: clientName,
                message: messageText,
                type: 'outbound'
              })
            }).catch(err => console.warn("Log API notice:", err));

            // 2. Add to Audit Log
            addAuditLog({
              action: `Sent Property Match (${selectedPropIds.join(', ')})`,
              module: 'WhatsApp Log',
              details: `Sent ${count} property links to ${clientName} (${destPhone}).`
            });

            // 3. Update shortlistedProperties on Lead
            if (!currentLead.shortlistedProperties) currentLead.shortlistedProperties = [];
            selectedProps.forEach(p => {
              if (!currentLead.shortlistedProperties.some(sp => String(sp.id) === String(p.id) || sp.title === p.title)) {
                currentLead.shortlistedProperties.push({
                  id: p.id,
                  title: p.title,
                  price: p.priceFormatted || p.price,
                  location: p.location
                });
              }
            });

            // 4. Append to Lead Timeline
            if (!currentLead.timeline) currentLead.timeline = [];
            const isSuccess = dispatchRes && (dispatchRes.success === true || dispatchRes.success === 'true');
            currentLead.timeline.unshift({
              type: 'whatsapp',
              message: `Sent ${count} matching properties (${selectedProps.map(p => p.id).join(', ')}) via WhatsApp to ${destPhone}`,
              details: selectedProps.map(p => `• [${p.id}] ${p.title} (${p.location || 'Thanjavur'})`).join('\n'),
              author: authorName,
              date: new Date().toISOString()
            });

            saveAndSyncLeads(leads, id);

            if (isSuccess) {
              showToast(`WhatsApp sent to ${clientName} with ${count} property link(s)!`, 'ri-checkbox-circle-fill');
            } else {
              showToast(`WhatsApp dispatched via SmartPing to ${destPhone}!`, 'ri-checkbox-circle-fill');
            }

            // Re-render Lead Detail View to refresh timeline & WhatsApp tab counter
            const osContent = document.getElementById('os-content');
            if (osContent) {
              osContent.innerHTML = renderLeadDetailView(id);
              initLeadDetailView(id);
              // Preserve search results if a search was performed
              if (currentQuery) {
                const newSearchInput = document.getElementById('matching-properties-search');
                if (newSearchInput) {
                  newSearchInput.value = currentQuery;
                  doSearch(currentQuery);
                }
              }
            }
          } catch (err) {
            console.error("WhatsApp dispatch error:", err);
            showToast('Failed to dispatch WhatsApp: ' + err.message, 'warning');
          } finally {
            if (inlineBtn) {
              inlineBtn.innerHTML = originalBtnHtml;
              inlineBtn.disabled = false;
            }
          }
        });
      }
    }
  }

  function doSearch(query) {
    const allProps = getProperties() || JSON.parse(localStorage.getItem('thanjai_properties')) || [];
    const trimmed = (query || '').trim().toLowerCase();
    if (!trimmed) {
      if (resultsContainer) {
        resultsContainer.innerHTML = `<p style="font-size: 0.9rem; color: var(--os-gray-500); line-height: 1.5;">Type a Property ID (e.g. TP-7780, TPC-001), title, location or type to search, or click "Auto Match".</p>`;
      }
      return;
    }

    const cleanNumOnly = trimmed.replace(/\D/g, '');

    const matches = allProps.filter(p => {
      if (!p) return false;
      const pId = String(p.id || '').toLowerCase();
      const pIdNum = pId.replace(/\D/g, '');
      const pTitle = String(p.title || '').toLowerCase();
      const pLoc = String(p.location || '').toLowerCase();
      const pDistrict = String(p.district || '').toLowerCase();
      const pAddress = String(p.address || '').toLowerCase();
      const pType = String(p.type || '').toLowerCase();
      const pCat = String(p.category || '').toLowerCase();
      const pCatLabel = String(p.categoryLabel || '').toLowerCase();
      const pDesc = String(p.description || '').toLowerCase();
      const pPriceStr = String(p.priceFormatted || p.price || '').toLowerCase();

      // Check ID match (full string or numeric portion)
      if (pId.includes(trimmed)) return true;
      if (cleanNumOnly && cleanNumOnly.length >= 2 && pIdNum && pIdNum.includes(cleanNumOnly)) return true;

      // Check all descriptive fields
      return pTitle.includes(trimmed) ||
             pLoc.includes(trimmed) ||
             pDistrict.includes(trimmed) ||
             pAddress.includes(trimmed) ||
             pType.includes(trimmed) ||
             pCat.includes(trimmed) ||
             pCatLabel.includes(trimmed) ||
             pDesc.includes(trimmed) ||
             pPriceStr.includes(trimmed);
    });

    renderMatchingProperties(matches, trimmed);
  }

  if (btnSearchMatches) {
    btnSearchMatches.addEventListener('click', () => {
      doSearch(searchInput ? searchInput.value : '');
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      doSearch(searchInput.value || '');
    });
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        doSearch(searchInput.value || '');
      }
    });
  }

  if (btnFindMatches) {
    btnFindMatches.addEventListener('click', () => {
      const allProps = getProperties() || JSON.parse(localStorage.getItem('thanjai_properties')) || [];
      
      const leads = getLeads() || [];
      const currentLead = leads.find(l => String(l.id) === String(id)) || lead;
      if (!currentLead) return;

      const typeFilter = (currentLead.type || currentLead.requirement || '').toLowerCase().trim();
      const areaFilter = (currentLead.city || currentLead.area || currentLead.location || '').toLowerCase().trim();
      const budgetMax = currentLead.budgetMax ? parseInt(currentLead.budgetMax) : 9999999999;
      
      const matches = allProps.filter(p => {
        if (!p) return false;
        const pType = (p.type || '').toLowerCase();
        const pCategory = (p.category || '').toLowerCase();
        const pCategoryLabel = (p.categoryLabel || '').toLowerCase();
        const pLoc = (p.location || '').toLowerCase();
        const pDistrict = (p.district || '').toLowerCase();

        const isTypeMatch = !typeFilter || pType.includes(typeFilter) || pCategory.includes(typeFilter) || pCategoryLabel.includes(typeFilter) || typeFilter.includes(pType);
        const isAreaMatch = !areaFilter || pLoc.includes(areaFilter) || pDistrict.includes(areaFilter) || areaFilter.includes(pLoc);
        
        let pPrice = p.price || 0;
        if (typeof pPrice === 'string') pPrice = parseInt(pPrice.replace(/\D/g, '')) || 0;
        
        const isBudgetMatch = pPrice <= budgetMax;
        return (isTypeMatch || isAreaMatch) && isBudgetMatch;
      });

      renderMatchingProperties(matches.length > 0 ? matches : allProps.slice(0, 10));
    });
  }
  const editModal = document.getElementById('edit-lead-modal');
  const btnEdit = document.getElementById('btn-edit-lead');
  const closeEdit = document.getElementById('close-edit-modal');
  const cancelEdit = document.getElementById('cancel-edit-btn');
  const saveEdit = document.getElementById('btn-save-edit');

  if (btnEdit) btnEdit.addEventListener('click', () => { if (editModal) editModal.classList.add('show'); });
  if (closeEdit) closeEdit.addEventListener('click', () => { if (editModal) editModal.classList.remove('show'); });
  if (cancelEdit) cancelEdit.addEventListener('click', () => { if (editModal) editModal.classList.remove('show'); });

  if (saveEdit) {
    saveEdit.addEventListener('click', async () => {
      const name = document.getElementById('edit-lead-name')?.value.trim();
      const mobile = document.getElementById('edit-lead-mobile')?.value.trim();
      
      if (!name || !mobile) {
        showAlertModal({
          title: 'Missing Required Fields',
          message: 'Please enter both the <strong>Lead Name</strong> and <strong>Mobile Phone Number</strong> to proceed.',
          type: 'warning'
        });
        return;
      }

      let leads = getLeads() || [];
      const idx = leads.findIndex(l => String(l.id) === String(id));
      
      if (idx !== -1) {
        const leadToUpdate = leads[idx];
        const type = document.getElementById('edit-lead-type-select')?.querySelector('.select-value')?.textContent.trim() || leadToUpdate.type || 'Any';
        const source = document.getElementById('edit-lead-source')?.value.trim() || leadToUpdate.source || 'Manual';
        const assignTo = document.getElementById('edit-lead-assign-select')?.querySelector('.select-value')?.textContent.trim() || leadToUpdate.assignTo || 'Unassigned';
        const area = document.getElementById('edit-lead-area')?.value.trim() || '';
        const city = document.getElementById('edit-lead-city')?.value.trim() || '';
        const country = document.getElementById('edit-lead-country')?.value.trim() || 'India';
        const locationStr = [area, city, country].filter(Boolean).join(', ');
        const beds = document.getElementById('edit-lead-bedrooms')?.value.trim() || '';
        const requirementStr = beds ? `${type} - ${beds} Beds` : type;
        const bMin = document.getElementById('edit-lead-budget-min')?.value.trim() || '';
        const bMax = document.getElementById('edit-lead-budget-max')?.value.trim() || '';
        const budgetStr = bMin && bMax ? `${bMin} - ${bMax}` : (bMax || bMin || '');
        const whatsapp = document.getElementById('edit-lead-whatsapp')?.value.trim() || mobile;
        const email = document.getElementById('edit-lead-email')?.value.trim() || '';
        const followup = document.getElementById('edit-lead-followup')?.value || '—';
        const notes = document.getElementById('edit-lead-notes')?.value || '';

        leads[idx] = {
          ...leadToUpdate,
          name,
          phone: mobile,
          mobile,
          whatsapp,
          email,
          country,
          city,
          area,
          location: locationStr || leadToUpdate.location,
          type,
          propertyType: type,
          requirement: requirementStr,
          budgetMin: bMin,
          budgetMax: bMax,
          budget: budgetStr || leadToUpdate.budget,
          bedrooms: beds,
          source,
          assignTo,
          assignedTo: assignTo,
          followup,
          notes: notes || leadToUpdate.notes
        };
        
        saveLeads(leads);

        addAuditLog({
          action: `Updated Lead (${name})`,
          module: 'CRM Pipeline',
          details: `Updated details for ${name} (${mobile}) from Lead Details view.`
        });

        if (editModal) editModal.classList.remove('show');
        showToast(`Lead "${name}" updated successfully!`, 'ri-checkbox-circle-fill');

        await saveAndSyncLeads(leads, id);

        const content = document.getElementById('os-content');
        if (content) {
          content.innerHTML = renderLeadDetailView(id);
          initLeadDetailView(id);
        }
      }
    });
  }

  // Tab switching logic
  const tabs = document.querySelectorAll('.ld-tab');
  const panes = document.querySelectorAll('.ld-tab-pane');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.style.color = 'var(--os-gray-500)';
        t.style.borderBottom = 'none';
      });
      tab.classList.add('active');
      tab.style.color = '#ea580c';
      tab.style.borderBottom = '2px solid #ea580c';

      panes.forEach(p => p.style.display = 'none');
      const text = tab.textContent;
      if (text.includes('Activity')) document.getElementById('pane-timeline').style.display = 'block';
      else if (text.includes('WhatsApp')) document.getElementById('pane-whatsapp').style.display = 'block';
      else if (text.includes('Pipeline')) document.getElementById('pane-pipeline').style.display = 'block';
    });
  });

  // Custom Select Dropdown logic for LeadDetailView
  const customSelects = document.querySelectorAll('.lead-detail-page .os-custom-select, #share-partner-modal .os-custom-select, #send-whatsapp-modal .os-custom-select, #edit-lead-modal .os-custom-select');
  customSelects.forEach(select => {
    const valueEl = select.querySelector('.select-value');
    const dropdown = select.querySelector('.select-dropdown');
    if (!dropdown) return;

    select.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = select.classList.contains('open');
      customSelects.forEach(s => s.classList.remove('open'));
      if (!isOpen) select.classList.add('open');
    });

    const options = select.querySelectorAll('.select-option');
    options.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        valueEl.innerHTML = option.innerHTML; // preserve icons if any
        if (option.dataset.id) {
          valueEl.dataset.id = option.dataset.id;
        }
        options.forEach(opt => {
          opt.classList.remove('selected');
          opt.style.background = '';
          opt.style.color = '';
        });
        option.classList.add('selected');
        // If it's the main stage selector, it has blue styling when selected
        if (select.classList.contains('ld-stage-selector')) {
           option.style.background = '#2563eb';
           option.style.color = '#fff';
        }
        select.classList.remove('open');

        // Persist to in-memory store if it's the Assign To or Stage dropdown
        let leads = getLeads() || [];
        const idx = leads.findIndex(l => l.id == id);
        if (idx !== -1) {
          if (select.id === 'ld-assign-dropdown') {
             const val = option.textContent.trim();
             const newAssignee = (val === 'Assign to...') ? 'Unassigned' : val;
             if (leads[idx].assignTo !== newAssignee || leads[idx].assignedTo !== newAssignee) {
               leads[idx].assignTo = newAssignee;
               leads[idx].assignedTo = newAssignee;
               if (!leads[idx].timeline) leads[idx].timeline = [];
               leads[idx].timeline.unshift({
                 type: 'system',
                 message: `Assigned to ${newAssignee}`,
                 author: localStorage.getItem('thanjai_active_user') || 'Aishwarya Raman',
                 date: new Date().toISOString()
               });
               saveAndSyncLeads(leads, id);
               const content = document.getElementById('os-content');
               if (content) {
                 content.innerHTML = renderLeadDetailView(id);
                 initLeadDetailView(id);
               }
             }
          } else if (select.classList.contains('ld-stage-selector')) {
             let rawStatus = option.textContent.trim();
             if (rawStatus.includes('sends WhatsApp')) {
                rawStatus = rawStatus.split('sends WhatsApp')[0].trim();
             }
             if (leads[idx].status !== rawStatus) {
               const oldStatus = leads[idx].status || 'New Lead';
               leads[idx].status = rawStatus;
               if (!leads[idx].timeline) leads[idx].timeline = [];
               leads[idx].timeline.unshift({
                 type: 'pipeline',
                 message: `Moved from ${oldStatus.toUpperCase().replace(/\s+/g, '_')} to ${rawStatus.toUpperCase().replace(/\s+/g, '_')}`,
                 author: localStorage.getItem('thanjai_active_user') || 'Aishwarya Raman',
                 date: new Date().toISOString()
               });
               saveAndSyncLeads(leads, id);
               const content = document.getElementById('os-content');
               if (content) {
                 content.innerHTML = renderLeadDetailView(id);
                 initLeadDetailView(id);
               }
             }
          }
        }
      });
    });
  });
  const ldTabs = document.querySelectorAll('.ld-tab');
  const ldPanes = document.querySelectorAll('.ld-tab-pane');
  
  ldTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      ldTabs.forEach(t => {
        t.classList.remove('active');
        t.style.color = 'var(--os-gray-500)';
        t.style.borderBottom = 'none';
      });
      tab.classList.add('active');
      tab.style.color = '#ea580c';
      tab.style.borderBottom = '2px solid #ea580c';
      
      ldPanes.forEach(pane => pane.style.display = 'none');
      
      const targetId = tab.getAttribute('data-target');
      if (targetId) {
        const targetPane = document.getElementById(targetId);
        if (targetPane) targetPane.style.display = 'block';
      }
    });
  });

  // Inquired Property modal trigger
  document.querySelectorAll('.prop-id-badge').forEach(badge => {
    badge.addEventListener('click', (e) => {
      e.stopPropagation();
      const pId = badge.dataset.propid;
      if (pId) {
        openPropertyModalById(pId);
      }
    });
  });

  document.addEventListener('click', () => {
    customSelects.forEach(select => select.classList.remove('open'));
  });
}

async function saveAndSyncLeads(leads, changedLeadId = null) {
  if (Array.isArray(leads)) {
    saveLeads(leads);
  }
  if (changedLeadId) {
    const lead = leads.find(l => l.id == changedLeadId);
    if (lead) {
      try {
        const payload = {
          ...lead,
          phone: lead.phone || lead.mobile || lead.whatsapp || '',
          budget: lead.budgetMax ? lead.budgetMax : (lead.budgetMin || ''),
          requirement: lead.type || '',
          location: lead.city || lead.area || '',
          source: lead.source || '',
          status: lead.status || '',
          assignedTo: lead.assignTo || '',
          notes: typeof lead.notes === 'string' ? lead.notes : JSON.stringify(lead.notes || []),
          timeline: typeof lead.timeline === 'string' ? lead.timeline : JSON.stringify(lead.timeline || []),
          followup: lead.followUpDate || lead.followup || ''
        };
        await fetchFromAPI('/leads?id=' + encodeURIComponent(changedLeadId), {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      } catch (err) {
        console.error('Failed to sync lead update to backend:', err);
      }
    }
  }
}