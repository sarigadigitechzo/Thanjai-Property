

export function renderWhatsAppLogView() {
  return `
    <div class="view-enter whatsapp-view" style="display: flex; height: calc(100vh - 80px); background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
      
      <!-- Left: Conversation List -->
      <div class="wa-sidebar" style="width: 350px; border-right: 1px solid var(--os-border-thin); display: flex; flex-direction: column; background: #f8fafc;">
        <div class="wa-header" style="padding: 20px; border-bottom: 1px solid var(--os-border-thin); display: flex; justify-content: space-between; align-items: center;">
          <h2 style="margin: 0; font-size: 1.2rem; color: var(--os-dark);">WhatsApp Log</h2>
          <button id="wa-refresh-leads" class="os-btn-secondary" style="padding: 6px 12px;"><i class="ri-refresh-line"></i></button>
        </div>
        
        <div class="os-filter-bar" style="margin: 0; box-shadow: none; border-radius: 0; border: none; border-bottom: var(--os-border-thin); padding: 12px 16px;">
          <div class="search-box" style="width: 100%;">
            <i class="ri-search-line"></i>
            <input type="text" id="wa-search-leads" placeholder="Search leads..." />
          </div>
        </div>

        <div id="wa-chat-list" class="wa-chat-list" style="flex: 1; overflow-y: auto;">
          <!-- Leads will be injected here -->
        </div>
      </div>

      <!-- Right: Chat Panel -->
      <div class="wa-main" style="flex: 1; display: flex; flex-direction: column; background: #efeae2;">
        <!-- Empty State -->
        <div id="wa-empty-state" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--os-gray-500);">
          <i class="ri-whatsapp-line" style="font-size: 4rem; color: #25d366; margin-bottom: 16px;"></i>
          <h2>WhatsApp Business Messaging</h2>
          <p>Select a lead from the sidebar to view history or start a chat.</p>
        </div>

        <!-- Chat Container (Hidden by default) -->
        <div id="wa-chat-container" style="display: none; flex-direction: column; height: 100%;">
          <div class="wa-chat-header" style="padding: 16px 20px; background: #f0f2f5; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #d1d7db;">
            <div class="wa-chat-title" style="display: flex; align-items: center; gap: 12px;">
              <div id="wa-active-avatar" style="width: 40px; height: 40px; border-radius: 50%; background: #25d366; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.2rem;"></div>
              <div>
                <h3 id="wa-active-name" style="margin: 0; font-size: 1.1rem; color: #111b21;"></h3>
                <p id="wa-active-phone" style="margin: 2px 0 0 0; font-size: 0.85rem; color: #667781;"></p>
              </div>
            </div>
          </div>

          <div id="wa-chat-history" class="wa-chat-history" style="flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 10px;">
            <!-- Messages injected here -->
          </div>

          <!-- Input Area -->
          <div class="wa-input-area" style="padding: 12px 20px; background: #f0f2f5; display: flex; gap: 12px; align-items: center;">
            <button id="wa-btn-property" class="wa-attach" title="Send Property" style="background: none; border: none; font-size: 1.5rem; color: #54656f; cursor: pointer;"><i class="ri-building-line"></i></button>
            <input type="text" id="wa-msg-input" placeholder="Type a custom message..." style="flex: 1; padding: 12px 16px; border: none; border-radius: 8px; outline: none; font-size: 0.95rem; box-shadow: 0 1px 3px rgba(0,0,0,0.08);" />
            <button id="wa-btn-send" class="wa-send" style="background: none; border: none; font-size: 1.5rem; color: #54656f; cursor: pointer;"><i class="ri-send-plane-fill"></i></button>
          </div>
        </div>
      </div>
    </div>

    <!-- Select Property Modal -->
    <div id="wa-property-modal" class="os-modal">
      <div class="os-modal-content" style="max-width: 500px;">
        <div class="os-modal-header">
          <h2>Send Property Link</h2>
          <button class="os-modal-close" onclick="document.getElementById('wa-property-modal').classList.remove('show')"><i class="ri-close-line"></i></button>
        </div>
        <div class="os-modal-body">
          <input type="text" id="wa-prop-search" class="os-input" placeholder="Search property by title or location..." style="width: 100%; margin-bottom: 12px;" />
          <div id="wa-prop-list" style="max-height: 300px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px;">
          </div>
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
    const filtered = leads.filter(l => 
      (l.name && l.name.toLowerCase().includes(term)) || 
      (l.mobile && l.mobile.includes(term)) || 
      (l.whatsapp && l.whatsapp.includes(term))
    );

    if (filtered.length === 0) {
      chatList.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--os-gray-500);">No leads found</div>';
      return;
    }

    let html = '';
    filtered.forEach(l => {
      const phone = l.whatsapp || l.mobile || 'No Number';
      const initials = (l.name || 'U').substring(0, 2).toUpperCase();
      const timeline = l.timeline || [];
      const waMsgs = timeline.filter(t => t.type === 'whatsapp');
      const lastMsg = waMsgs.length > 0 ? waMsgs[0].message : 'No messages yet';
      const lastTime = waMsgs.length > 0 ? new Date(waMsgs[0].date).toLocaleDateString() : '';

      html += `
        <div class="wa-chat-item hover-lift" data-id="${l.id}" style="padding: 12px 16px; display: flex; gap: 12px; cursor: pointer; border-bottom: 1px solid #f1f5f9; transition: background 0.2s;">
          <div style="width: 48px; height: 48px; min-width: 48px; border-radius: 50%; background: #e2e8f0; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #475569;">
            ${initials}
          </div>
          <div style="flex: 1; overflow: hidden;">
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
              <strong style="color: #1e293b; font-size: 1rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${l.name || 'Unknown'}</strong>
              <span style="font-size: 0.75rem; color: #64748b;">${lastTime}</span>
            </div>
            <div style="font-size: 0.85rem; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 4px;">
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
    activeLeadId = leadId;
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    emptyState.style.display = 'none';
    chatContainer.style.display = 'flex';

    document.getElementById('wa-active-name').textContent = lead.name || 'Unknown User';
    document.getElementById('wa-active-phone').textContent = lead.whatsapp || lead.mobile || 'No Phone Number';
    document.getElementById('wa-active-avatar').textContent = (lead.name || 'U').substring(0, 2).toUpperCase();

    renderChatHistory();
  }

  function renderChatHistory() {
    if (!activeLeadId) return;
    const lead = leads.find(l => l.id === activeLeadId);
    const historyContainer = document.getElementById('wa-chat-history');
    
    const timeline = lead.timeline || [];
    const waMsgs = timeline.filter(t => t.type === 'whatsapp').reverse(); // Oldest first

    if (waMsgs.length === 0) {
      historyContainer.innerHTML = '<div style="text-align: center; color: #667781; margin-top: 20px; font-size: 0.9rem;">Start of conversation. Type a message below to send via WhatsApp.</div>';
      return;
    }

    let html = '';
    waMsgs.forEach(msg => {
      const timeStr = new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      // Outgoing message bubble style
      html += `
        <div style="align-self: flex-end; background: #d9fdd3; padding: 8px 12px; border-radius: 8px; max-width: 70%; box-shadow: 0 1px 1px rgba(0,0,0,0.1); position: relative;">
          <div style="font-size: 0.95rem; color: #111b21; margin-bottom: 12px; word-wrap: break-word;">${msg.message}</div>
          <div style="font-size: 0.7rem; color: #667781; text-align: right; display: flex; align-items: center; justify-content: flex-end; gap: 4px;">
            ${timeStr} <i class="ri-check-double-line" style="color: #53bdeb; font-size: 1rem;"></i>
          </div>
        </div>
      `;
    });
    historyContainer.innerHTML = html;
    historyContainer.scrollTop = historyContainer.scrollHeight;
  }

  searchInput?.addEventListener('input', (e) => renderLeadsSidebar(e.target.value));
  document.getElementById('wa-refresh-leads')?.addEventListener('click', () => {
    // Reload leads array from storage
    const updatedLeads = JSON.parse(localStorage.getItem('thanjai_leads')) || [];
    leads.length = 0;
    leads.push(...updatedLeads);
    renderLeadsSidebar(searchInput?.value || '');
  });

  renderLeadsSidebar();

  // --- Messaging Logic ---
  const btnSend = document.getElementById('wa-btn-send');
  const msgInput = document.getElementById('wa-msg-input');

  async function sendWhatsAppMessage(campaignName, templateParams) {
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
        const dummyImg = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
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
    propModal.classList.add('show');
    renderPropertyModalList('');
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
      html += `
        <div class="wa-prop-item" style="padding: 12px; border: 1px solid var(--os-gray-200); border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-weight: 600; color: var(--os-dark);">${p.title}</div>
            <div style="font-size: 0.8rem; color: var(--os-gray-500); margin-top: 4px;">${p.location} • <strong style="color: #ea580c;">${p.priceFormatted || p.price}</strong></div>
          </div>
          <button class="os-btn-primary send-prop-btn" data-title="${p.title}" data-loc="${p.location}" data-price="${p.priceFormatted || p.price}" style="padding: 6px 12px; font-size: 0.85rem;"><i class="ri-send-plane-fill"></i> Send</button>
        </div>
      `;
    });
    propList.innerHTML = html;

    propList.querySelectorAll('.send-prop-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const title = e.currentTarget.dataset.title;
        const loc = e.currentTarget.dataset.loc;
        const price = e.currentTarget.dataset.price;
        propModal.classList.remove('show');
        
        const lead = leads.find(l => l.id === activeLeadId);
        // Use initial_contact_intro as it takes 4 params for a single property
        sendWhatsAppMessage('initial_contact_intro', [lead.name || "Client", title, loc, price]);
      });
    });
  }

  propSearch?.addEventListener('input', (e) => renderPropertyModalList(e.target.value));
}
