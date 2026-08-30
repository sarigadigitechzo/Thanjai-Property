export function renderWhatsAppLogView() {
  return `
    <div class="view-enter whatsapp-view" style="display: flex; height: calc(100vh - 110px); max-height: calc(100vh - 110px); min-height: 550px; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; position: relative;">
      
      <!-- Left: Conversation List -->
      <div class="wa-sidebar" style="width: 350px; min-width: 350px; border-right: 1px solid #e2e8f0; display: flex; flex-direction: column; background: #ffffff;">
        <div class="wa-header" style="padding: 16px 20px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; background: #f8fafc;">
          <h2 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #1e293b; display: flex; align-items: center; gap: 8px;">
            <i class="ri-whatsapp-fill" style="color: #25D366; font-size: 1.3rem;"></i> WhatsApp Log
          </h2>
          <div style="display: flex; gap: 6px;">
            <button id="wa-refresh-leads" class="os-btn-secondary" title="Refresh conversations" style="padding: 6px 12px; font-size: 0.85rem;"><i class="ri-refresh-line"></i></button>
          </div>
        </div>
        
        <div class="os-filter-bar" style="margin: 0; box-shadow: none; border-radius: 0; border: none; border-bottom: 1px solid #e2e8f0; padding: 10px 16px; background: #ffffff;">
          <div class="search-box" style="width: 100%;">
            <i class="ri-search-line"></i>
            <input type="text" id="wa-search-leads" placeholder="Search contacts by name or phone..." style="font-size: 0.85rem; width: 100%; border: none; outline: none;" />
          </div>
        </div>

        <div id="wa-chat-list" class="wa-chat-list" style="flex: 1; overflow-y: auto;">
          <!-- Conversations injected dynamically -->
        </div>
      </div>

      <!-- Right: Chat Panel -->
      <div class="wa-main" style="flex: 1; display: flex; flex-direction: column; background: #efeae2; overflow: hidden; height: 100%;">
        <!-- Empty State -->
        <div id="wa-empty-state" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--os-gray-500);">
          <i class="ri-whatsapp-line" style="font-size: 4rem; color: #25d366; margin-bottom: 16px;"></i>
          <h2 style="margin: 0 0 8px 0; color: #1e293b;">WhatsApp Live Chat</h2>
          <p style="margin: 0; font-size: 0.9rem;">Select a conversation from the left to view live messages or reply.</p>
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
                <div id="wa-active-property-badge" style="display: none; align-items: center; gap: 6px; font-size: 0.76rem; font-weight: 700; color: #9a3412; background: #ffedd5; padding: 2px 10px; border-radius: 12px; margin-top: 4px; border: 1px solid #fed7aa; max-width: 420px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"></div>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="display: inline-flex; align-items: center; gap: 6px; font-size: 0.75rem; font-weight: 700; color: #059669; background: #ecfdf5; padding: 4px 12px; border-radius: 20px; border: 1px solid #a7f3d0;">
                <span style="width: 8px; height: 8px; border-radius: 50%; background: #10b981; display: inline-block;"></span> Live SmartPing Webhook
              </span>
            </div>
          </div>

          <!-- Chat Stream History -->
          <div id="wa-chat-history" class="wa-chat-history" style="flex: 1; overflow-y: auto; padding: 20px 24px; display: flex; flex-direction: column; gap: 12px;">
            <!-- Messages injected here -->
          </div>

          <!-- Input Area (Bottom) -->
          <div class="wa-input-area" style="padding: 12px 20px; background: #f0f2f5; display: flex; gap: 12px; align-items: center; border-top: 1px solid #d1d7db; flex-shrink: 0;">
            <input type="text" id="wa-msg-input" placeholder="Type a message to reply on WhatsApp..." style="flex: 1; padding: 12px 18px; border: 1px solid #e2e8f0; border-radius: 24px; outline: none; font-size: 0.95rem; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.05);" />
            <button id="wa-btn-send" class="wa-send" title="Send WhatsApp Message" style="background: #25d366; border: none; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; color: #ffffff; cursor: pointer; box-shadow: 0 2px 6px rgba(37,211,102,0.4); flex-shrink: 0;"><i class="ri-send-plane-fill"></i></button>
          </div>
        </div>
      </div>
    </div>
  `;
}

import { fetchFromAPI } from '../utils/api.js';
import { showToast } from '../utils/toast.js';
import { addAuditLog } from '../utils/siteImagesStore.js';
import { sendWhatsAppMessage } from '../utils/whatsapp.js';

function cleanPhoneDigits(phone) {
  if (!phone) return '';
  return String(phone).replace(/\D/g, '').slice(-10);
}

function formatPhoneDisplay(phone) {
  const p = String(phone || '');
  if (p.startsWith('+')) return p;
  const digits = p.replace(/\D/g, '');
  if (digits.length === 10) return `+91 ${digits}`;
  if (digits.length > 10) return `+${digits}`;
  return p;
}

function formatSidebarTime(d) {

  if (!d || isNaN(d.getTime()) || d.getTime() === 0) return '';
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === d.toDateString();
  if (isYesterday) return 'Yesterday';
  return d.toLocaleDateString([], { day: 'numeric', month: 'short' });
}

function formatMsgDate(d) {
  if (!d || isNaN(d.getTime())) return '';
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (isToday) return timeStr;
  return `${d.toLocaleDateString([], { day: 'numeric', month: 'short' })}, ${timeStr}`;
}


function parseTimeline(timeline) {
  if (!timeline) return [];
  if (Array.isArray(timeline)) return timeline;
  if (typeof timeline === 'string') {
    try {
      const p = JSON.parse(timeline);
      return Array.isArray(p) ? p : [];
    } catch(e) {
      return [];
    }
  }
  return [];
}

function expandTemplateKeyToFullText(msg, clientName = 'Client') {
  if (!msg) return '';
  const clean = String(msg).trim();
  
  if (clean === 'bank_loan_assist' || clean === 'bank_loan_assistance') {
    return `Hello ${clientName}, Thanjai Property offers complete bank loan facilitation with leading nationalized and private banks (SBI, HDFC, ICICI, Indian Bank) at competitive interest rates with instant Patta verification support. Desk: +91 84899 96852.`;
  }
  if (clean === 'property_follow_up' || clean === 'follow_up_nurture') {
    return `Hello ${clientName}, We are following up regarding your property requirement in Thanjavur. Our advisors have new verified listings that match your criteria. Let us know when you'd like to review.`;
  }
  if (clean === 'welcome_message') {
    return `Hello ${clientName}, Welcome to Thanjai Property! What type of property or location are you looking for in Thanjavur? Let us know your requirement and our property advisory desk will assist you.`;
  }
  if (clean === 'initial_contact_intro') {
    return `Hello ${clientName}, Thank you for your interest in Thanjai Property! We have received your requirement. Our property advisors will assist you shortly with verified documents, prime locations, and direct builder coordination. Official Desk: +91 84899 96852.`;
  }
  if (clean === 'stage_requirement_analysis') {
    return `Hello ${clientName}, We are currently analyzing your property requirement. Our team is shortlisting legal-verified properties matching your exact criteria. Advisory Desk: +91 84899 96852.`;
  }
  if (clean === 'stage_lead_qualified') {
    return `Hello ${clientName}, Your property requirement has been successfully qualified and matched with verified inventory. Our specialist will coordinate the legal Patta documents.`;
  }
  if (clean === 'stage_site_visit_scheduled') {
    return `Hello ${clientName}, Your site visit has been scheduled. Our field manager will assist you with plot boundaries, layout review, and Patta verification. Location coordinator: +91 84899 96852.`;
  }
  if (clean === 'stage_negotiation_stage') {
    return `Hello ${clientName}, We have initiated price negotiation and legal terms discussion with the property owner on your behalf. We will update you with the approved terms shortly.`;
  }
  if (clean === 'stage_booking_in_progress') {
    return `Hello ${clientName}, Your property booking token documentation is now in progress with legal stamp verification. Our registration desk will guide you on the next milestone.`;
  }
  if (clean === 'stage_deal_won_registration') {
    return `Congratulations ${clientName}! Your property registration has been completed successfully at the Sub-Registrar Office. Thank you for choosing Thanjai Property!`;
  }
  if (clean === 'partner_transfer_notification') {
    return `Hello ${clientName}, Your property requirement has been assigned to our verified Area Specialist Partner for dedicated on-ground coordination.`;
  }
  if (clean === 'partner_lead_assignment') {
    return `New Lead Assigned: Please coordinate with client ${clientName} for property inspection and advisory.`;
  }
  if (clean === 'stage_closed_lost_archive') {
    return `Hello ${clientName}, Thank you for connecting with Thanjai Property. Your requirement file has been archived. We are always here whenever you plan your next real estate journey.`;
  }

  return clean;
}

export async function initWhatsAppLogView() {
  const chatList = document.getElementById('wa-chat-list');
  const searchInput = document.getElementById('wa-search-leads');
  const emptyState = document.getElementById('wa-empty-state');
  const chatContainer = document.getElementById('wa-chat-container');
  const btnSend = document.getElementById('wa-btn-send');
  const msgInput = document.getElementById('wa-msg-input');

  let activePhone10 = null;
  let conversationsMap = new Map();

  async function loadAllMessagesAndConversations() {
    // Load leads to get contact names and phones (for sidebar contacts list)
    let leads = [];
    try {
      const apiLeads = await fetchFromAPI('/leads');
      if (apiLeads && Array.isArray(apiLeads)) leads = apiLeads;
    } catch(e) {}
    if (leads.length === 0) {
      leads = JSON.parse(localStorage.getItem('thanjai_leads')) || [];
    }

    // SINGLE SOURCE OF TRUTH: fetch from unified whatsapp_messages table only
    let allMessages = [];
    try {
      const msgs = await fetchFromAPI('/whatsapp_messages');
      if (msgs && Array.isArray(msgs)) allMessages = msgs;
    } catch(e) {}

    const newMap = new Map();

    // Build conversation stubs from leads (contact name + phone — no fake messages)
    leads.forEach(l => {
      const rawPhone = l.phone || l.mobile || l.whatsapp || '';
      const p10 = cleanPhoneDigits(rawPhone);
      if (!p10) return;

      newMap.set(p10, {
        id: l.id || `C-${p10}`,
        name: l.name || `Client (+91 ${p10})`,
        phone: formatPhoneDisplay(rawPhone),
        phone10: p10,
        messages: [],
        lastTime: '',
        lastDate: new Date(0),
        lastMessage: 'No messages yet'
      });
    });

    // Process all messages from the unified table
    allMessages.forEach(row => {
      const msgRaw = row.message || '';
      const phone = row.customer_phone || '';
      const p10 = cleanPhoneDigits(phone);
      if (!p10) return;

      // Create conversation entry if not exists (customer who isn't a lead yet)
      if (!newMap.has(p10)) {
        newMap.set(p10, {
          id: `WA-${p10}`,
          name: row.customer_name || `WhatsApp (+91 ${p10})`,
          phone: formatPhoneDisplay(phone),
          phone10: p10,
          messages: [],
          lastTime: '',
          lastDate: new Date(0),
          lastMessage: ''
        });
      }

      const conv = newMap.get(p10);

      // Update name from message data if lead entry had generic name
      if (row.customer_name && conv.name.startsWith('Client (')) {
        conv.name = row.customer_name;
      }

      const dir = (row.direction || 'inbound').toLowerCase();
      const msgDirection = dir === 'outbound' ? 'out' : 'in';
      const msgDate = new Date(row.createdAt || Date.now());
      const msgText = expandTemplateKeyToFullText(msgRaw, conv.name);

      // Deduplicate: skip exact same message within 5 seconds
      if (!conv.messages.some(m =>
        m.direction === msgDirection &&
        m.message === msgText &&
        Math.abs(m.date - msgDate) < 5000
      )) {
        conv.messages.push({ direction: msgDirection, message: msgText, date: msgDate, source: row.source });
      }
    });

    // Sort each conversation chronologically and compute sidebar preview
    newMap.forEach(conv => {
      conv.messages.sort((a, b) => a.date - b.date);
      if (conv.messages.length > 0) {
        const last = conv.messages[conv.messages.length - 1];
        conv.lastDate = last.date;
        conv.lastMessage = last.message;
        conv.lastTime = formatSidebarTime(last.date);
      }
    });

    conversationsMap = newMap;
    renderSidebar(searchInput?.value || '');
    if (activePhone10) {
      renderChatHistory(activePhone10, true);
    }
  }


  function renderSidebar(filter = '') {
    const term = filter.toLowerCase();
    const list = Array.from(conversationsMap.values()).sort((a, b) => b.lastDate - a.lastDate);

    const filtered = list.filter(c => {
      return c.name.toLowerCase().includes(term) || c.phone.toLowerCase().includes(term) || c.phone10.includes(term);
    });

    if (filtered.length === 0) {
      chatList.innerHTML = '<div style="padding: 24px; text-align: center; color: #64748b; font-size: 0.9rem;">No WhatsApp chats found.</div>';
      return;
    }

    let html = '';
    filtered.forEach(c => {
      const initials = (c.name || 'W').substring(0, 2).toUpperCase();
      const isActive = c.phone10 === activePhone10;
      const bg = isActive ? '#e2e8f0' : 'transparent';
      const lastSnippet = c.lastMessage || 'Start conversation';

      html += `
        <div class="wa-chat-item hover-lift" data-phone10="${c.phone10}" style="padding: 14px 16px; display: flex; gap: 12px; cursor: pointer; border-bottom: 1px solid #f1f5f9; background: ${bg}; transition: background 0.2s;">
          <div style="width: 44px; height: 44px; min-width: 44px; border-radius: 50%; background: #25D366; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #ffffff; font-size: 0.95rem; box-shadow: 0 2px 5px rgba(37,211,102,0.3);">
            ${initials}
          </div>
          <div style="flex: 1; overflow: hidden;">
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
              <strong style="color: #1e293b; font-size: 0.95rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${c.name}</strong>
              <span style="font-size: 0.72rem; color: #94a3b8; font-weight: 600;">${c.lastTime}</span>
            </div>
            <div style="font-size: 0.8rem; color: #64748b; margin-top: 2px;">
              ${c.phone}
            </div>
            <div style="font-size: 0.8rem; color: #475569; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 4px; font-weight: 500;">
              ${lastSnippet}
            </div>
          </div>
        </div>
      `;
    });

    chatList.innerHTML = html;

    chatList.querySelectorAll('.wa-chat-item').forEach(item => {
      item.addEventListener('click', () => {
        const p10 = item.dataset.phone10;
        openChatByPhone10(p10);
      });
    });
  }

  function openChatByPhone10(phone10) {
    activePhone10 = phone10;
    const conv = conversationsMap.get(phone10);
    if (!conv) return;

    emptyState.style.display = 'none';
    chatContainer.style.display = 'flex';

    document.getElementById('wa-active-name').textContent = conv.name;
    document.getElementById('wa-active-phone').textContent = conv.phone;
    document.getElementById('wa-active-avatar').textContent = (conv.name || 'W').substring(0, 2).toUpperCase();

    // Check if the user inquired about a specific property
    const badgeEl = document.getElementById('wa-active-property-badge');
    const inqMsg = (conv.messages || []).find(m => m.message && m.message.includes('[Property Inquiry]'));
    if (inqMsg && badgeEl) {
      const cleanInq = inqMsg.message.replace('[Property Inquiry]', '').trim();
      badgeEl.style.display = 'inline-flex';
      badgeEl.innerHTML = `<i class="ri-home-4-line" style="color: #eb5e28;"></i> <span title="${cleanInq}">${cleanInq}</span>`;
    } else if (badgeEl) {
      badgeEl.style.display = 'none';
    }

    renderSidebar(searchInput?.value || '');
    renderChatHistory(phone10, false);
  }

  function formatBubbleText(raw) {
    if (!raw) return '';
    let t = raw.replace('WhatsApp sent: ', '').replace('Customer replied: ', '');
    return t.replace(/\n/g, '<br/>');
  }

  function renderChatHistory(phone10, isSilent = false) {
    const historyContainer = document.getElementById('wa-chat-history');
    if (!historyContainer) return;

    const conv = conversationsMap.get(phone10);
    if (!conv) return;

    if (conv.messages.length === 0) {
      historyContainer.innerHTML = '<div style="text-align: center; color: #667781; margin-top: 30px; font-size: 0.9rem;">Start of conversation. Type a message below to send via WhatsApp.</div>';
      return;
    }

    const wasAtBottom = historyContainer.scrollHeight - historyContainer.scrollTop <= historyContainer.clientHeight + 60;

    let html = '';
    conv.messages.forEach(msg => {
      const timeStr = formatMsgDate(msg.date);

      if (msg.direction === 'out') {
        html += `
          <div style="align-self: flex-end; background: #d9fdd3; padding: 10px 14px; border-radius: 12px 12px 0 12px; max-width: 75%; min-width: 160px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #c7f2c0;">
            <div style="font-size: 0.92rem; color: #111b21; margin-bottom: 6px; word-wrap: break-word; line-height: 1.4;">
              ${formatBubbleText(msg.message)}
            </div>
            <div style="font-size: 0.7rem; color: #667781; text-align: right; display: flex; align-items: center; justify-content: flex-end; gap: 4px; margin-top: 4px;">
              <span>${timeStr}</span>
              <i class="ri-check-double-line" style="color: #53bdeb; font-size: 1rem;"></i>
            </div>
          </div>
        `;
      } else {
        html += `
          <div style="align-self: flex-start; background: #ffffff; padding: 10px 14px; border-radius: 12px 12px 12px 0; max-width: 75%; min-width: 160px; box-shadow: 0 1px 3px rgba(0,0,0,0.12); border: 1px solid #e2e8f0;">
            <div style="font-size: 0.75rem; font-weight: 800; color: #06c167; margin-bottom: 4px; display: flex; align-items: center; gap: 4px;">
              <i class="ri-user-smile-fill"></i> Customer Reply
            </div>
            <div style="font-size: 0.95rem; color: #111b21; margin-bottom: 6px; word-wrap: break-word; font-weight: 500;">
              ${formatBubbleText(msg.message)}
            </div>
            <div style="font-size: 0.7rem; color: #667781; text-align: left; margin-top: 2px;">${timeStr}</div>
          </div>
        `;
      }
    });


    historyContainer.innerHTML = html;
    if (!isSilent || wasAtBottom) {
      historyContainer.scrollTop = historyContainer.scrollHeight;
    }
  }

  async function sendMessage() {
    if (!activePhone10) return;
    const conv = conversationsMap.get(activePhone10);
    if (!conv) return;

    const text = msgInput.value.trim();
    if (!text) return;

    const originalIcon = btnSend.innerHTML;
    btnSend.innerHTML = '<i class="ri-loader-4-line ri-spin"></i>';
    btnSend.disabled = true;

    try {
      const formattedPhone = '+91' + conv.phone10;

      // 1. Dispatch via server-relay sendWhatsAppMessage
      await sendWhatsAppMessage({
        campaignName: 'property_follow_up',
        destination: formattedPhone,
        userName: conv.name,
        messageText: text,
        templateParams: [conv.name, 'Thanjavur', text],
        media: {
          url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
          filename: 'property.jpg'
        }
      });

      const newMsg = {
        direction: 'out',
        message: text,
        date: new Date()
      };
      conv.messages.push(newMsg);
      conv.lastDate = new Date();
      conv.lastMessage = text;
      conv.lastTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      addAuditLog({
        action: `Sent WhatsApp to ${conv.name}`,
        module: 'WhatsApp Log',
        details: `Sent message to ${conv.phone}: "${text.length > 50 ? text.slice(0, 48) + '...' : text}"`
      });

      msgInput.value = '';
      renderSidebar(searchInput?.value || '');
      renderChatHistory(activePhone10, false);
      showToast('Message sent on WhatsApp!', 'ri-checkbox-circle-fill');
    } catch(err) {
      showToast('Message logged to conversation', 'ri-information-line');
    } finally {
      btnSend.innerHTML = originalIcon;
      btnSend.disabled = false;
    }
  }

  btnSend?.addEventListener('click', sendMessage);
  msgInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  });

  searchInput?.addEventListener('input', (e) => renderSidebar(e.target.value));
  document.getElementById('wa-refresh-leads')?.addEventListener('click', () => {
    loadAllMessagesAndConversations();
    showToast('WhatsApp Log refreshed!', 'ri-refresh-line');
  });

  await loadAllMessagesAndConversations();

  const firstPhone = conversationsMap.keys().next().value;
  if (firstPhone) {
    openChatByPhone10(firstPhone);
  }

  if (window.waLivePollTimer) clearInterval(window.waLivePollTimer);
  window.waLivePollTimer = setInterval(() => {
    if (document.getElementById('wa-chat-history')) {
      loadAllMessagesAndConversations();
    } else {
      clearInterval(window.waLivePollTimer);
    }
  }, 3000);
}
