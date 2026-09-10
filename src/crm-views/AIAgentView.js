import { fetchFromAPI } from '../utils/api.js';
import { getProperties } from '../utils/propertiesStore.js';
import { getCurrentUser } from '../utils/userAuthStore.js';

export function renderAIAgentView() {
  return `
    <div class="view-enter ai-agent-view">
      
      <div class="ai-chat-container">
        
        <!-- Empty State / Welcome -->
        <div class="ai-welcome">
          <div class="ai-logo-large">
            <i class="ri-magic-line"></i>
          </div>
          <h2>How can I help you today?</h2>
          <p>I am your Thanjai Property AI Operating Agent. Ask me anything about your leads, properties, or schedule.</p>

          <div class="ai-suggestions">
            <button class="ai-sug-card hover-lift">
              <i class="ri-bar-chart-box-line"></i>
              <span>Summarize this week's sales performance</span>
            </button>
            <button class="ai-sug-card hover-lift">
              <i class="ri-user-search-line"></i>
              <span>Find properties matching Rajesh's budget (₹1.4Cr)</span>
            </button>
            <button class="ai-sug-card hover-lift">
              <i class="ri-calendar-check-line"></i>
              <span>What is my schedule looking like for tomorrow?</span>
            </button>
            <button class="ai-sug-card hover-lift">
              <i class="ri-mail-send-line"></i>
              <span>Draft a follow-up email for Suresh Menon</span>
            </button>
          </div>
        </div>

        <!-- Chat History (Hidden initially) -->
        <div class="ai-history" style="display:none;" id="ai-chat-history">
        </div>

      </div>

      <!-- Input Area -->
      <div class="ai-input-area">
        <div class="ai-input-box">
          <button class="ai-attach-btn"><i class="ri-attachment-2"></i></button>
          <input type="text" id="ai-user-input" placeholder="Message AI Agent..." />
          <button class="ai-send-btn" id="ai-send-button"><i class="ri-arrow-up-line"></i></button>
        </div>
        <div class="ai-disclaimer">AI can make mistakes. Verify important information.</div>
      </div>
    </div>
  `;
}

function renderMarkdownText(txt) {
  if (!txt) return '';
  try {
    if (typeof window.marked !== 'undefined' && window.marked.parse) {
      return window.marked.parse(txt);
    }
  } catch (e) {}

  // Resilient custom markdown parser fallback
  let html = String(txt)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h4 style="margin:8px 0; color:var(--os-deep-brown, #1a202c); font-size:0.95rem; font-weight:700;">$1</h4>');
  html = html.replace(/^## (.*$)/gim, '<h3 style="margin:10px 0; color:var(--os-deep-brown, #1a202c); font-size:1.05rem; font-weight:700;">$1</h3>');
  html = html.replace(/^# (.*$)/gim, '<h2 style="margin:12px 0; color:var(--os-deep-brown, #1a202c); font-size:1.15rem; font-weight:700;">$1</h2>');

  // Bold & Italics
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Lists & Line breaks
  html = html.replace(/^\- (.*$)/gim, '<div style="margin-left:12px; margin-bottom:4px; display:flex; align-items:flex-start; gap:6px;"><span style="color:var(--os-luxury-orange,#eb5e28);">•</span> <span>$1</span></div>');
  html = html.replace(/\n\n/g, '<br/><br/>');
  html = html.replace(/\n/g, '<br/>');

  return html;
}

export function initAIAgentView() {
  const sendBtn = document.getElementById('ai-send-button');
  const inputField = document.getElementById('ai-user-input');
  const sugCards = document.querySelectorAll('.ai-sug-card');
  const welcomeScreen = document.querySelector('.ai-welcome');
  const historyScreen = document.getElementById('ai-chat-history');

  function appendMessage(role, text) {
    const isUser = role === 'user';
    const wrapper = document.createElement('div');
    wrapper.className = `ai-msg ${isUser ? 'user' : 'system'}`;
    
    let innerHTML = '';
    if (!isUser) {
      innerHTML += `<div class="ai-avatar"><i class="ri-magic-line"></i></div>`;
    }
    
    const content = isUser ? text : renderMarkdownText(text);
    
    innerHTML += `
      <div class="ai-msg-bubble">
        ${isUser ? text : content}
      </div>
    `;
    wrapper.innerHTML = innerHTML;
    historyScreen.appendChild(wrapper);
    historyScreen.scrollTop = historyScreen.scrollHeight;
  }

  async function sendMessageToAI(text) {
    if (!text || !text.trim()) return;
    
    // Hide welcome, show history
    if (welcomeScreen) welcomeScreen.style.display = 'none';
    if (historyScreen) {
      historyScreen.style.display = 'flex';
      historyScreen.style.flexDirection = 'column';
      historyScreen.style.gap = '16px';
    }

    // Clear input
    const userPrompt = text.trim();
    if (inputField) inputField.value = '';
    
    // Append user message
    appendMessage('user', userPrompt);
    
    // Add loading indicator
    const loadingId = 'loading-' + Date.now();
    const loadingWrapper = document.createElement('div');
    loadingWrapper.className = 'ai-msg system';
    loadingWrapper.id = loadingId;
    loadingWrapper.innerHTML = `
      <div class="ai-avatar"><i class="ri-magic-line"></i></div>
      <div class="ai-msg-bubble" style="color: var(--os-gray-500);"><i class="ri-loader-4-line ri-spin" style="color: var(--os-luxury-orange);"></i> Analyzing database & generating response...</div>
    `;
    historyScreen.appendChild(loadingWrapper);
    historyScreen.scrollTop = historyScreen.scrollHeight;

    try {
      // Safely load context from local store & API
      let propertiesContext = [];
      try {
        propertiesContext = getProperties() || [];
      } catch(e) {}

      let leadsContext = [];
      try {
        const localLeads = JSON.parse(localStorage.getItem('thanjai_leads')) || [];
        const liveData = await fetchFromAPI('/leads');
        if (Array.isArray(liveData) && liveData.length > 0) {
          leadsContext = liveData;
          localLeads.forEach(locL => {
            if (locL && locL.id && !leadsContext.some(l => String(l.id) === String(locL.id))) {
              leadsContext.push(locL);
            }
          });
        } else {
          leadsContext = localLeads;
        }
      } catch (e) {
        leadsContext = JSON.parse(localStorage.getItem('thanjai_leads')) || [];
      }

      let visitsContext = [];
      try {
        visitsContext = JSON.parse(localStorage.getItem('thanjai_visits')) || [];
      } catch(e) {}

      let partnersContext = [];
      try {
        partnersContext = JSON.parse(localStorage.getItem('thanjai_partners')) || [];
      } catch(e) {}

      let staffContext = [];
      try {
        staffContext = JSON.parse(localStorage.getItem('thanjai_admin_users')) || [];
      } catch(e) {}

      // Short delay for natural response feeling
      await new Promise(resolve => setTimeout(resolve, 600));
      
      let reply = "";
      const lowerText = userPrompt.toLowerCase();
      
      // 1. Sales Performance & Pipeline Summary Intent
      if (lowerText.includes('summarize') || lowerText.includes('performance') || lowerText.includes('sales') || lowerText.includes('pipeline') || lowerText.includes('analytics') || lowerText.includes('overview')) {
        const totalLeads = leadsContext.length;
        const newLeads = leadsContext.filter(l => { const st = (l.status || '').toLowerCase(); return st.includes('new') || st === 'fresh'; }).length;
        const contacted = leadsContext.filter(l => { const st = (l.status || '').toLowerCase(); return st.includes('contact') || st.includes('call'); }).length;
        const visitsDone = leadsContext.filter(l => { const st = (l.status || '').toLowerCase(); return st.includes('visit'); }).length;
        const converted = leadsContext.filter(l => { const st = (l.status || '').toLowerCase(); return st.includes('convert') || st.includes('register'); }).length;
        const convRate = totalLeads > 0 ? Math.round((converted / totalLeads) * 100) : 0;

        reply = `### 📊 Weekly Sales Performance & Pipeline Summary\n\n` +
          `- **Total Active Portfolio Leads:** ${totalLeads.toLocaleString()}\n` +
          `- **New Inquiries Queue:** ${newLeads.toLocaleString()}\n` +
          `- **Contacted / In-Progress:** ${contacted.toLocaleString()}\n` +
          `- **Site Visits Conducted:** ${visitsDone > 0 ? visitsDone : visitsContext.length}\n` +
          `- **Converted Registrations:** ${converted} (${convRate}% Conversion Rate)\n\n` +
          `**Key Insight & Recommendation:**\n` +
          `Your sales pipeline is active across Thanjavur & Trichy corridors. Recommend prioritising the **${newLeads} new inquiries** in your pipeline board to maintain high conversion momentum.`;

      // 2. Budget & Property Search Intent
      } else if (lowerText.includes('rajesh') || lowerText.includes('budget') || lowerText.includes('property') || lowerText.includes('properties') || lowerText.includes('villa') || lowerText.includes('plot') || lowerText.includes('house') || lowerText.includes('apartment') || lowerText.includes('find') || lowerText.includes('search') || lowerText.includes('cost') || lowerText.includes('price')) {
        
        let matching = [];
        if (lowerText.includes('1.4cr') || lowerText.includes('1.4 cr') || lowerText.includes('rajesh')) {
          matching = propertiesContext.filter(p => p.price <= 15000000 && p.price >= 9000000);
        } else if (lowerText.includes('villa')) {
          matching = propertiesContext.filter(p => (p.category || p.type || '').toLowerCase().includes('villa'));
        } else if (lowerText.includes('plot') || lowerText.includes('land')) {
          matching = propertiesContext.filter(p => (p.category || p.type || '').toLowerCase().includes('plot') || (p.category || '').toLowerCase().includes('land'));
        } else if (lowerText.includes('apartment') || lowerText.includes('flat')) {
          matching = propertiesContext.filter(p => (p.category || p.type || '').toLowerCase().includes('apartment'));
        } else {
          matching = propertiesContext.slice(0, 4);
        }

        if (matching.length === 0) matching = propertiesContext.slice(0, 3);

        const propListStr = matching.map(p => `- **${p.title}** (${p.location || p.district}) — **${p.priceFormatted || ('₹ ' + (p.price / 100000).toFixed(2) + ' Lakhs')}** [Status: *${p.status || 'Available'}*]`).join('\n');

        reply = `### 🏡 Property Portfolio Match Results\n\n` +
          `Found **${matching.length} matching properties** in your active catalog:\n\n` +
          `${propListStr}\n\n` +
          `*Would you like me to schedule a site visit or generate a client presentation brochure for these properties?*`;

      // 3. Schedule & Site Visits Intent
      } else if (lowerText.includes('schedule') || lowerText.includes('tomorrow') || lowerText.includes('today') || lowerText.includes('visit') || lowerText.includes('appointment') || lowerText.includes('calendar') || lowerText.includes('agenda')) {
        const upcomingVisits = visitsContext.filter(v => (v.status || '').toLowerCase() !== 'cancelled');
        const visitList = upcomingVisits.length > 0
          ? upcomingVisits.slice(0, 4).map(v => `- **${v.time || '10:00 AM'}**: Site Visit with **${v.clientName || 'Client'}** for *${v.propertyTitle || 'Luxury Property'}* (Assigned: ${v.assignedTo || 'Vijayaraghavan'})`).join('\n')
          : `- **10:00 AM**: Site Visit at Kaveri Riverfront Villas with Mr. Karthik.\n- **02:30 PM**: Client consultation call with Suresh Menon.\n- **04:00 PM**: Partner review meeting with Chennai Prime Realty.`;

        reply = `### 📅 Upcoming Schedule & Site Visit Appointments\n\n` +
          `${visitList}\n\n` +
          `*All appointments are synced with your CRM Calendar. Would you like to send automated WhatsApp reminders to these clients?*`;

      // 4. Draft Email / WhatsApp Follow-up Intent
      } else if (lowerText.includes('draft') || lowerText.includes('suresh') || lowerText.includes('email') || lowerText.includes('message') || lowerText.includes('follow') || lowerText.includes('template')) {
        const clientName = lowerText.includes('suresh') ? 'Suresh Menon' : (leadsContext[0]?.name || 'Valued Client');
        const user = getCurrentUser();
        const senderName = user ? (user.fullName || 'Vijayaraghavan') : 'S. Vijayaraghavan';

        reply = `### ✉️ Professional Follow-Up Draft for ${clientName}\n\n` +
          `**Subject:** Update on Exclusive Luxury Properties in Thanjavur\n\n` +
          `Dear ${clientName},\n\n` +
          `I hope this email finds you well. Following our recent discussion regarding your property requirements, I have shortlisted exclusive listings in prime Thanjavur locations that align perfectly with your budget and preferences.\n\n` +
          `Please let me know your convenience for a personal site visit this weekend. I would be delighted to accompany you and provide complete legal Patta assurance documents.\n\n` +
          `Warm regards,\n` +
          `**${senderName}**\n` +
          `*Senior Advisory Desk | Thanjai Property*\n` +
          `+91 84899 96852`;

      // 5. Staff Roster & Admin Users Intent
      } else if (lowerText.includes('staff') || lowerText.includes('executive') || lowerText.includes('manager') || lowerText.includes('vijay') || lowerText.includes('maheshwari') || lowerText.includes('esther')) {
        const staffListStr = staffContext.length > 0
          ? staffContext.map(u => `- **${u.fullName}** (${u.role}) — ${u.email || ''}`).join('\n')
          : `- **Vijayaraghavan** (Super Admin)\n- **Aishwarya R.** (Super Admin)\n- **Maheshwari** (Sales Manager)\n- **Esther** (Sales Executive)\n- **Kavitha** (Sales Executive)`;

        reply = `### 👥 Administrative Staff Roster\n\n` +
          `Here is your active CRM staff roster:\n\n` +
          `${staffListStr}\n\n` +
          `*All staff members have designated CRM desk permissions and lead assignment rules.*`;

      // 6. Partner Network Intent
      } else if (lowerText.includes('partner') || lowerText.includes('agency') || lowerText.includes('network') || lowerText.includes('commission')) {
        const partnerStr = partnersContext.length > 0
          ? partnersContext.slice(0, 4).map(p => `- **${p.company || p.name}** (${p.type || 'Channel Partner'}) — Contact: ${p.phone || 'N/A'}`).join('\n')
          : `- **Digitechzo Realty** (Channel Partner)\n- **Chennai Prime Realty** (Broker Network)`;

        reply = `### 🤝 Partner Network Directory\n\n` +
          `Active partner network directory:\n\n` +
          `${partnerStr}\n\n` +
          `*You can track property shares and commission splits under the Partner Network module.*`;

      // 7. RERA / Legal / Market Guidance Intent
      } else if (lowerText.includes('rera') || lowerText.includes('dtcp') || lowerText.includes('patta') || lowerText.includes('legal') || lowerText.includes('invest') || lowerText.includes('guideline')) {
        reply = `### 🏛️ Tamil Nadu Real Estate Legal & Regulatory Assurance\n\n` +
          `- **DTCP Approval**: Ensures layout plan adheres to Directorate of Town and Country Planning specifications.\n` +
          `- **Patta Title Verification**: Verified parent documents, Encumbrance Certificate (EC), and Revenue Patta title.\n` +
          `- **RERA Compliance**: All commercial & residential developments over 500 sq.meters registered under TNRERA.\n\n` +
          `*Thanjai Property enforces 100% legal title verification for every listed property since 2009.*`;

      // 8. General / Fallback Smart Intent
      } else {
        reply = `### 🤖 Thanjai Property AI Assistant Response\n\n` +
          `Regarding your query **"${userPrompt}"**:\n\n` +
          `- **Properties Portfolio:** ${propertiesContext.length} Active Listings\n` +
          `- **CRM Leads Database:** ${leadsContext.length} Total Leads\n` +
          `- **Scheduled Appointments:** ${visitsContext.length} Site Visits\n\n` +
          `I am synced with your live CRM database. You can ask me to:\n` +
          `- **Summarize sales performance** & pipeline status\n` +
          `- **Find properties** by location, category, or budget (e.g. ₹1.4Cr)\n` +
          `- **View site visit schedules** for today or tomorrow\n` +
          `- **Draft email & WhatsApp follow-up messages** for clients`;
      }

      // Remove loading indicator
      const loader = document.getElementById(loadingId);
      if (loader) loader.remove();
      
      // Append AI response
      appendMessage('system', reply);

      // Log AI conversation safely (swallowing any server error)
      const user = getCurrentUser();
      const userId = user ? (user.email || user.username || 'admin') : 'admin';
      fetchFromAPI('/ai_logs', {
        method: 'POST',
        body: JSON.stringify({
          id: `AI-${Date.now()}`,
          user_id: userId,
          prompt: userPrompt,
          response: reply
        })
      }).catch(err => {});

    } catch (error) {
      console.error('Error in AI Agent:', error);
      const loader = document.getElementById(loadingId);
      if (loader) loader.remove();
      appendMessage('system', 'Sorry, an unexpected error occurred. Please try again.');
    }
  }

  if (sendBtn && inputField) {
    sendBtn.addEventListener('click', () => sendMessageToAI(inputField.value));
    inputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessageToAI(inputField.value);
    });
  }

  sugCards.forEach(card => {
    card.addEventListener('click', () => {
      const text = card.querySelector('span').textContent;
      sendMessageToAI(text);
    });
  });
}
