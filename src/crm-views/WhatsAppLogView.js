

export function renderWhatsAppLogView() {
  return `
    <div class="view-enter whatsapp-view" style="display: flex; height: calc(100vh - 110px); max-height: calc(100vh - 110px); min-height: 550px; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; position: relative;">
      
      <!-- Left: Conversation List -->
      <div class="wa-sidebar" style="width: 340px; min-width: 340px; border-right: 1px solid #e2e8f0; display: flex; flex-direction: column; background: #ffffff;">
        <div class="wa-header" style="padding: 16px 20px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; background: #f8fafc;">
          <h2 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #1e293b; display: flex; align-items: center; gap: 8px;">
            <i class="ri-whatsapp-fill" style="color: #25D366; font-size: 1.3rem;"></i> WhatsApp Log
          </h2>
          <button id="wa-refresh-leads" class="os-btn-secondary" title="Refresh conversations" style="padding: 6px 12px; font-size: 0.85rem;"><i class="ri-refresh-line"></i></button>
        </div>
        
        <div class="os-filter-bar" style="margin: 0; box-shadow: none; border-radius: 0; border: none; border-bottom: 1px solid #e2e8f0; padding: 10px 16px; background: #ffffff;">
          <div class="search-box" style="width: 100%;">
            <i class="ri-search-line"></i>
            <input type="text" id="wa-search-leads" placeholder="Search leads by name or phone..." style="font-size: 0.85rem; width: 100%; border: none; outline: none;" />
          </div>
        </div>

        <div id="wa-chat-list" class="wa-chat-list" style="flex: 1; overflow-y: auto;">
          <!-- Leads will be injected here -->
        </div>
      </div>

      <!-- Right: Chat Panel -->
      <div class="wa-main" style="flex: 1; display: flex; flex-direction: column; background: #efeae2; overflow: hidden; height: 100%;">
        <!-- Empty State -->
        <div id="wa-empty-state" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--os-gray-500);">
          <i class="ri-whatsapp-line" style="font-size: 4rem; color: #25d366; margin-bottom: 16px;"></i>
          <h2 style="margin: 0 0 8px 0; color: #1e293b;">WhatsApp Live Chat</h2>
          <p style="margin: 0; font-size: 0.9rem;">Select a conversation from the sidebar to view messages or reply.</p>
        </div>

        <!-- Chat Container (Hidden by default) -->
        <div id="wa-chat-container" style="display: none; flex-direction: column; height: 100%; width: 100%; overflow: hidden;">
          <!-- Top Bar Header (Sticky) -->
          <div class="wa-chat-header" style="padding: 12px 20px; background: #f0f2f5; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #d1d7db; min-height: 64px; flex-shrink: 0; z-index: 10;">
            <div class="wa-chat-title" style="display: flex; align-items: center; gap: 12px;">
              <div id="wa-active-avatar" style="width: 42px; height: 42px; min-width: 42px; border-radius: 50%; background: #25d366; color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.1rem; box-shadow: 0 2px 5px rgba(0,0,0,0.1);"></div>
              <div>
                <h3 id="wa-active-name" style="margin: 0; font-size: 1.05rem; font-weight: 700; color: #111b21;"></h3>
                <p id="wa-active-phone" style="margin: 2px 0 0 0; font-size: 0.82rem; color: #667781; font-weight: 500;"></p>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="display: inline-flex; align-items: center; gap: 6px; font-size: 0.75rem; font-weight: 700; color: #059669; background: #ecfdf5; padding: 4px 12px; border-radius: 20px; border: 1px solid #a7f3d0;">
                <span style="width: 8px; height: 8px; border-radius: 50%; background: #10b981; display: inline-block;"></span> Live Connected
              </span>
            </div>
          </div>

          <!-- Chat Stream History -->
          <div id="wa-chat-history" class="wa-chat-history" style="flex: 1; overflow-y: auto; padding: 20px 24px; display: flex; flex-direction: column; gap: 12px;">
            <!-- Messages injected here -->
          </div>

          <!-- Input Area (Bottom) -->
          <div class="wa-input-area" style="padding: 12px 20px; background: #f0f2f5; display: flex; gap: 12px; align-items: center; border-top: 1px solid #d1d7db; flex-shrink: 0;">
            <button id="wa-btn-property" class="wa-attach" title="Send Property Card" style="background: none; border: none; font-size: 1.4rem; color: #54656f; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 6px; border-radius: 50%;"><i class="ri-building-line"></i></button>
            <input type="text" id="wa-msg-input" placeholder="Type a message to reply on WhatsApp..." style="flex: 1; padding: 12px 18px; border: 1px solid #e2e8f0; border-radius: 24px; outline: none; font-size: 0.95rem; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.05);" />
            <button id="wa-btn-send" class="wa-send" title="Send WhatsApp Message" style="background: #25d366; border: none; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; color: #ffffff; cursor: pointer; box-shadow: 0 2px 6px rgba(37,211,102,0.4); flex-shrink: 0;"><i class="ri-send-plane-fill"></i></button>
          </div>
        </div>
      </div>
    </div>

    <!-- Select Property Modal (Hidden Overlay) -->
    <div id="wa-property-modal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.65); z-index: 999999; align-items: center; justify-content: center; backdrop-filter: blur(4px);">
      <div style="max-width: 500px; width: 90%; background: #ffffff; border-radius: 16px; padding: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.25); max-height: 85vh; display: flex; flex-direction: column;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h2 style="margin: 0; font-size: 1.2rem; font-weight: 700; color: #1e293b;"><i class="ri-building-line" style="color: #ea580c;"></i> Send Property Recommendation</h2>
          <button id="wa-property-modal-close" style="background: none; border: none; font-size: 1.4rem; color: #64748b; cursor: pointer;"><i class="ri-close-line"></i></button>
        </div>
        <div style="margin-bottom: 14px;">
          <input type="text" id="wa-prop-search" placeholder="Search property by title or location..." style="width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; outline: none;" />
        </div>
        <div id="wa-prop-list" style="max-height: 320px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px;">
        </div>
      </div>
    </div>
  `;
}

export function initWhatsAppLogView() {
  const leads = JSON.parse(localStorage.getItem('thanjai_leads')) || [];
  const chatList = document.getElementById('wa-chat-list');
  const searchInput = document.getElementById('wa-search-leads');
  const emptyState = document.getElementById('wa-empty-state');
  const chatContainer = document.getElementById('wa-chat-container');
  
  let activeLeadId = null;

  function renderLeadsSidebar(filter = '') {
    const term = filter.toLowerCase();
    const filtered = leads.filter(l => {
      const p = (l.phone || l.whatsapp || l.mobile || '').toLowerCase();
      const n = (l.name || '').toLowerCase();
      return n.includes(term) || p.includes(term);
    });

    if (filtered.length === 0) {
      chatList.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--os-gray-500);">No leads found</div>';
      return;
    }

    let html = '';
    filtered.forEach(l => {
      const rawPhone = l.phone || l.whatsapp || l.mobile || 'No Number';
      const phoneDisplay = rawPhone.startsWith('+') ? rawPhone : (rawPhone.replace(/\D/g, '').length === 10 ? `+91 ${rawPhone.replace(/\D/g, '')}` : rawPhone);
      const initials = (l.name || 'U').substring(0, 2).toUpperCase();
      const timeline = l.timeline || [];
      const waMsgs = timeline.filter(t => t.type === 'whatsapp' || t.type === 'whatsapp_incoming');
      const lastRaw = waMsgs.length > 0 ? (waMsgs[0].note || waMsgs[0].message) : 'No messages yet';
      const lastMsg = lastRaw.replace('WhatsApp sent: ', '').replace('Customer replied: ', '');
      const lastTime = waMsgs.length > 0 ? new Date(waMsgs[0].date).toLocaleDateString([], { month: 'short', day: 'numeric' }) : '';

      html += `
        <div class="wa-chat-item hover-lift" data-id="${l.id}" style="padding: 14px 16px; display: flex; gap: 12px; cursor: pointer; border-bottom: 1px solid #f1f5f9; transition: background 0.2s;">
          <div style="width: 44px; height: 44px; min-width: 44px; border-radius: 50%; background: #25D366; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #ffffff; font-size: 0.95rem;">
            ${initials}
          </div>
          <div style="flex: 1; overflow: hidden;">
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
              <strong style="color: #1e293b; font-size: 0.95rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${l.name || 'Unknown'}</strong>
              <span style="font-size: 0.72rem; color: #94a3b8; font-weight: 600;">${lastTime}</span>
            </div>
            <div style="font-size: 0.8rem; color: #64748b; margin-top: 2px;">
              ${phoneDisplay}
            </div>
            <div style="font-size: 0.8rem; color: #475569; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 4px; font-weight: 500;">
              ${lastMsg}
            </div>
          </div>
        </div>
      `;
    });
    chatList.innerHTML = html;

    // Attach click listeners
    const items = chatList.querySelectorAll('.wa-chat-item');
    items.forEach(item => {
      item.addEventListener('click', () => {
        items.forEach(i => i.style.background = 'transparent');
        item.style.background = '#e2e8f0';
        openChat(item.dataset.id);
      });
    });
  }

  function openChat(leadId) {
    if (window.waChatPollTimer) {
      clearInterval(window.waChatPollTimer);
    }

    activeLeadId = leadId;
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    emptyState.style.display = 'none';
    chatContainer.style.display = 'flex';

    const rawPhone = lead.phone || lead.whatsapp || lead.mobile || lead.phoneNumber || '';
    const phoneDisplay = rawPhone ? (rawPhone.startsWith('+') ? rawPhone : `+91 ${rawPhone.replace(/\D/g, '').slice(-10)}`) : 'No Phone Number';

    document.getElementById('wa-active-name').textContent = lead.name || 'Unknown User';
    document.getElementById('wa-active-phone').textContent = phoneDisplay;
    document.getElementById('wa-active-avatar').textContent = (lead.name || 'U').substring(0, 2).toUpperCase();

    renderChatHistory();

    // Live auto-polling every 5 seconds for incoming WhatsApp messages
    window.waChatPollTimer = setInterval(() => {
      if (document.getElementById('wa-chat-history') && activeLeadId) {
        renderChatHistory(true);
      } else {
        clearInterval(window.waChatPollTimer);
      }
    }, 5000);
  }

  function formatBubbleContent(rawText) {
    if (!rawText) return '';
    if (rawText.startsWith('WhatsApp sent: ')) {
      const content = rawText.replace('WhatsApp sent: ', '').trim();
      if (content.startsWith('Custom message: ')) {
        return content.replace('Custom message: ', '').replace(/^"|"$/g, '');
      }
      if (content.startsWith('site_visit_confirmation')) {
        return '<div style="font-weight:700; color:#1a202c; margin-bottom:4px;"><i class="ri-calendar-check-fill" style="color:#25D366;"></i> Site Visit Confirmation</div><div style="font-size:0.85rem; color:#4a5568;">Your site visit appointment details and map directions have been sent.</div>';
      }
      if (content.startsWith('site_visit_reminder')) {
        return '<div style="font-weight:700; color:#1a202c; margin-bottom:4px;"><i class="ri-time-fill" style="color:#e27c3e;"></i> Site Visit Reminder</div><div style="font-size:0.85rem; color:#4a5568;">Gentle reminder for your upcoming site visit today.</div>';
      }
      if (content.startsWith('site_visit_feedback')) {
        return '<div style="font-weight:700; color:#1a202c; margin-bottom:4px;"><i class="ri-star-fill" style="color:#f59e0b;"></i> Site Visit Feedback</div><div style="font-size:0.85rem; color:#4a5568;">Thank you for visiting! How was your site visit experience?</div>';
      }
      if (content.startsWith('welcome_message')) {
        return '<div style="font-weight:700; color:#1a202c; margin-bottom:4px;"><i class="ri-hand-heart-fill" style="color:#25D366;"></i> Welcome to Thanjai Property</div><div style="font-size:0.85rem; color:#4a5568;">Hello! Thank you for connecting with Thanjai Property advisory team.</div>';
      }
      if (content.startsWith('property_shortlist')) {
        const extra = content.includes('[Shortlist:') ? content.split('[Shortlist:')[1].replace(']', '').trim() : '';
        return `<div style="font-weight:700; color:#1a202c; margin-bottom:4px;"><i class="ri-building-4-fill" style="color:#3b82f6;"></i> Property Shortlist Recommendations</div><div style="font-size:0.85rem; color:#4a5568;">Handpicked verified properties based on your requirements.${extra ? `<div style="margin-top:4px; font-size:0.8rem; color:#6b7280;"><strong>Selected:</strong> ${extra}</div>` : ''}</div>`;
      }
      if (content.startsWith('initial_contact_intro')) {
        return '<div style="font-weight:700; color:#1a202c; margin-bottom:4px;"><i class="ri-image-2-fill" style="color:#8b5cf6;"></i> Property Details & Photos</div><div style="font-size:0.85rem; color:#4a5568;">Verified property details and pricing overview sent.</div>';
      }
      if (content.startsWith('property_follow_up')) {
        return '<div style="font-weight:700; color:#1a202c; margin-bottom:4px;"><i class="ri-customer-service-2-fill" style="color:#10b981;"></i> Property Follow-up</div><div style="font-size:0.85rem; color:#4a5568;">Following up on your preferred property options and next steps.</div>';
      }
      if (content.startsWith('negotiation_check_in')) {
        return '<div style="font-weight:700; color:#1a202c; margin-bottom:4px;"><i class="ri-shake-hands-fill" style="color:#f97316;"></i> Price & Deal Discussion</div><div style="font-size:0.85rem; color:#4a5568;">Checking in regarding property price negotiations and closing terms.</div>';
      }
      if (content.startsWith('bank_loan_assistance')) {
        return '<div style="font-weight:700; color:#1a202c; margin-bottom:4px;"><i class="ri-bank-fill" style="color:#0ea5e9;"></i> Bank Loan Assistance</div><div style="font-size:0.85rem; color:#4a5568;">Home loan documentation support from our banking partners.</div>';
      }
      if (content.startsWith('registration_testimonial_referral')) {
        return '<div style="font-weight:700; color:#1a202c; margin-bottom:4px;"><i class="ri-medal-fill" style="color:#ec4899;"></i> Registration & Review</div><div style="font-size:0.85rem; color:#4a5568;">Congratulations on your property registration! Please share your review.</div>';
      }
      if (content.startsWith('general_property_update')) {
        return '<div style="font-weight:700; color:#1a202c; margin-bottom:4px;"><i class="ri-notification-3-fill" style="color:#6366f1;"></i> Property Status Update</div><div style="font-size:0.85rem; color:#4a5568;">Important update regarding your property inquiry.</div>';
      }
      return content;
    }
    return rawText;
  }

  async function renderChatHistory(isSilentPoll = false) {
    if (!activeLeadId) return;
    const lead = leads.find(l => l.id === activeLeadId);
    if (!lead) return;
    const historyContainer = document.getElementById('wa-chat-history');
    if (!historyContainer) return;
    
    const timeline = lead.timeline || [];

    // Fetch incoming messages from backend
    let incomingMsgs = [];
    try {
      const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'https://thanjaiproperty.com/api.php'
        : '/api.php';
      const rawPhone = lead.phone || lead.whatsapp || lead.mobile || lead.phoneNumber || '';
      const phone = rawPhone.replace(/\D/g, '');
      if (phone) {
        const res = await fetch(`${API_BASE}/whatsapp_incoming?phone=${phone}&t=${Date.now()}`);
        if (res.ok) incomingMsgs = await res.json();
      }
    } catch(e) {}

    // Merge outgoing (from timeline) + incoming from DB into one timeline
    const outgoing = timeline
      .filter(t => t.type === 'whatsapp' || t.type === 'whatsapp_incoming')
      .map(t => ({
        direction: t.type === 'whatsapp_incoming' ? 'in' : 'out',
        date: new Date(t.date),
        message: t.type === 'whatsapp_incoming' ? (t.note || t.message) : t.message
      }));

    const incoming = incomingMsgs.map(m => ({
      direction: 'in',
      date: new Date(m.createdAt),
      message: m.message || '[media]'
    }));

    // Combine and sort by date
    const allMsgs = [...outgoing, ...incoming].sort((a, b) => a.date - b.date);

    if (allMsgs.length === 0) {
      historyContainer.innerHTML = '<div style="text-align: center; color: #667781; margin-top: 20px; font-size: 0.9rem;">Start of conversation. Type a message below to send via WhatsApp.</div>';
      return;
    }

    const wasScrolledToBottom = historyContainer.scrollHeight - historyContainer.scrollTop <= historyContainer.clientHeight + 50;

    let html = '';
    allMsgs.forEach(msg => {
      const timeStr = msg.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      if (msg.direction === 'out') {
        // Outgoing - green right bubble
        html += `
          <div style="align-self: flex-end; background: #d9fdd3; padding: 10px 14px; border-radius: 12px 12px 0 12px; max-width: 75%; min-width: 180px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #c7f2c0;">
            <div style="font-size: 0.92rem; color: #111b21; margin-bottom: 6px; word-wrap: break-word; line-height: 1.4;">
              ${formatBubbleContent(msg.message)}
            </div>
            <div style="font-size: 0.7rem; color: #667781; text-align: right; display: flex; align-items: center; justify-content: flex-end; gap: 4px; margin-top: 4px;">
              <span>${timeStr}</span>
              <i class="ri-check-double-line" style="color: #53bdeb; font-size: 1rem;"></i>
            </div>
          </div>
        `;
      } else {
        // Incoming - white left bubble
        html += `
          <div style="align-self: flex-start; background: #ffffff; padding: 10px 14px; border-radius: 12px 12px 12px 0; max-width: 75%; min-width: 180px; box-shadow: 0 1px 3px rgba(0,0,0,0.12); border: 1px solid #e2e8f0;">
            <div style="font-size: 0.75rem; font-weight: 800; color: #06c167; margin-bottom: 4px; display: flex; align-items: center; gap: 4px;">
              <i class="ri-user-smile-fill"></i> Customer Reply
            </div>
            <div style="font-size: 0.95rem; color: #111b21; margin-bottom: 6px; word-wrap: break-word; font-weight: 500;">
              ${msg.message.replace('Customer replied: ', '')}
            </div>
            <div style="font-size: 0.7rem; color: #667781; text-align: left; margin-top: 2px;">${timeStr}</div>
          </div>
        `;
      }
    });
    historyContainer.innerHTML = html;
    if (!isSilentPoll || wasScrolledToBottom) {
      historyContainer.scrollTop = historyContainer.scrollHeight;
    }
  }

  searchInput?.addEventListener('input', (e) => renderLeadsSidebar(e.target.value));
  document.getElementById('wa-refresh-leads')?.addEventListener('click', () => {
    // Reload leads array from storage
    const updatedLeads = JSON.parse(localStorage.getItem('thanjai_leads')) || [];
    leads.length = 0;
    leads.push(...updatedLeads);
    renderLeadsSidebar(searchInput?.value || '');
    if (activeLeadId) renderChatHistory();
  });

  renderLeadsSidebar();

  // Auto-open first lead on load
  if (leads.length > 0) {
    const firstItem = chatList.querySelector('.wa-chat-item');
    if (firstItem) {
      firstItem.style.background = '#e2e8f0';
      openChat(leads[0].id);
    }
  }

  // --- Messaging Logic ---
  const btnSend = document.getElementById('wa-btn-send');
  const msgInput = document.getElementById('wa-msg-input');

  async function sendWhatsAppMessage(campaignName, templateParams, mediaUrl = null) {
    if (!activeLeadId) return;
    const lead = leads.find(l => l.id === activeLeadId);
    let rawPhone = lead.whatsapp || lead.mobile;
    if (!rawPhone) {
      alert('This lead has no phone number.');
      return;
    }

    let phone = rawPhone.replace(/\D/g, '');
    if (phone.length === 10) phone = '91' + phone;

    const provider = localStorage.getItem('thanjai_wa_provider') || 'aisensy';
    const apiUrl = provider === 'smartping' 
      ? 'https://backend.api-wa.co/campaign/smartping/api/v2' 
      : 'https://backend.aisensy.com/campaign/t1/api/v2';

    if (provider === 'smartping' && !phone.startsWith('+')) {
      phone = '+' + phone;
    }

    const apiKey = localStorage.getItem('thanjai_whatsapp_api_key');
    if (!apiKey) {
      alert('Please go to Settings > Integrations and paste your WhatsApp API Key first.');
      return;
    }

    const originalIcon = btnSend.innerHTML;
    btnSend.innerHTML = '<i class="ri-loader-4-line ri-spin"></i>';
    btnSend.disabled = true;

    try {
      const payload = {
        apiKey: apiKey,
        campaignName: campaignName,
        destination: phone,
        userName: lead.name || "Client",
        templateParams: templateParams
      };
      
      if (campaignName.includes('initial_contact_intro')) {
        const dummyImg = mediaUrl || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
        payload.media = { url: dummyImg, filename: "property.jpg" };
        payload.mediaUrl = dummyImg;
      }

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(`[${provider.toUpperCase()}] ${data.message || data.error || JSON.stringify(data)}`);

      // Success
      if (!lead.timeline) lead.timeline = [];
      const sentMsg = campaignName === 'welcome_message' 
        ? `WhatsApp sent: Custom message: "${templateParams[0]}"` 
        : `WhatsApp sent: Property - ${templateParams[0]}`;

      lead.timeline.unshift({
        type: 'whatsapp',
        message: sentMsg,
        author: localStorage.getItem('thanjai_active_user') ? JSON.parse(localStorage.getItem('thanjai_active_user')).fullName : 'System',
        date: new Date().toISOString()
      });
      
      localStorage.setItem('thanjai_leads', JSON.stringify(leads));
      window.dispatchEvent(new CustomEvent('leadsUpdated'));
      msgInput.value = '';
      renderChatHistory();
      renderLeadsSidebar(searchInput.value);

    } catch (err) {
      alert('Failed to send WhatsApp message:\n' + err.message);
    } finally {
      btnSend.innerHTML = originalIcon;
      btnSend.disabled = false;
    }
  }

  // Send Custom Message
  btnSend?.addEventListener('click', () => {
    const text = msgInput.value.trim();
    if (!text) return;
    // We use the welcome_message template with the custom text as param, same as LeadDetailView
    sendWhatsAppMessage('welcome_message', [text]);
  });

  msgInput?.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') btnSend.click();
  });

  // --- Send Property Feature ---
  const btnProperty = document.getElementById('wa-btn-property');
  const propModal = document.getElementById('wa-property-modal');
  const propSearch = document.getElementById('wa-prop-search');
  const propList = document.getElementById('wa-prop-list');

  btnProperty?.addEventListener('click', () => {
    if (!activeLeadId) {
      alert('Please select a lead first.');
      return;
    }
    if (propModal) propModal.style.display = 'flex';
    renderPropertyModalList('');
  });

  document.getElementById('wa-property-modal-close')?.addEventListener('click', () => {
    if (propModal) propModal.style.display = 'none';
  });

  propModal?.addEventListener('click', (e) => {
    if (e.target === propModal) propModal.style.display = 'none';
  });

  function renderPropertyModalList(query) {
    const allProps = JSON.parse(localStorage.getItem('thanjai_properties')) || [];
    const term = query.toLowerCase();
    const filtered = allProps.filter(p => 
      (p.title && p.title.toLowerCase().includes(term)) ||
      (p.location && p.location.toLowerCase().includes(term))
    );

    if (filtered.length === 0) {
      propList.innerHTML = '<p style="text-align: center; color: var(--os-gray-500);">No properties found.</p>';
      return;
    }

    let html = '';
    filtered.forEach(p => {
      const img = p.images && p.images[0] ? p.images[0] : '';
      html += `
        <div class="wa-prop-item" style="padding: 12px; border: 1px solid var(--os-gray-200); border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-weight: 600; color: var(--os-dark);">${p.title}</div>
            <div style="font-size: 0.8rem; color: var(--os-gray-500); margin-top: 4px;">${p.location} • <strong style="color: #ea580c;">${p.priceFormatted || p.price}</strong></div>
          </div>
          <button class="os-btn-primary send-prop-btn" data-title="${p.title}" data-loc="${p.location}" data-price="${p.priceFormatted || p.price}" data-img="${img}" style="padding: 6px 12px; font-size: 0.85rem;"><i class="ri-send-plane-fill"></i> Send</button>
        </div>
      `;
    });
    propList.innerHTML = html;

    propList.querySelectorAll('.send-prop-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const title = e.currentTarget.dataset.title;
        const loc = e.currentTarget.dataset.loc;
        const price = e.currentTarget.dataset.price;
        const imgUrl = e.currentTarget.dataset.img;
        if (propModal) propModal.style.display = 'none';
        
        const lead = leads.find(l => l.id === activeLeadId);
        const userName = lead ? (lead.name || "Client") : "Client";
        
        // initial_contact_intro accepts: Client, Title, Location, Price
        sendWhatsAppMessage('initial_contact_intro', [userName, title, loc, price], imgUrl);
      });
    });
  }

  propSearch?.addEventListener('input', (e) => renderPropertyModalList(e.target.value));
}
