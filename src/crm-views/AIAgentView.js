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

import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';
import { fetchFromAPI } from '../utils/api.js';
import { getCurrentUser } from '../utils/userAuthStore.js';

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
    
    // Use marked if available for system messages to render markdown properly
    const content = isUser ? text : marked.parse(text);
    
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
    if (!text.trim()) return;
    
    // Hide welcome, show history
    welcomeScreen.style.display = 'none';
    historyScreen.style.display = 'flex';
    historyScreen.style.flexDirection = 'column';
    historyScreen.style.gap = '16px';

    // Clear input
    inputField.value = '';
    
    // Append user message
    appendMessage('user', text);
    
    // Add loading indicator
    const loadingId = 'loading-' + Date.now();
    const loadingWrapper = document.createElement('div');
    loadingWrapper.className = 'ai-msg system';
    loadingWrapper.id = loadingId;
    loadingWrapper.innerHTML = `
      <div class="ai-avatar"><i class="ri-magic-line"></i></div>
      <div class="ai-msg-bubble" style="color: var(--os-gray-400);">Thinking...</div>
    `;
    historyScreen.appendChild(loadingWrapper);
    historyScreen.scrollTop = historyScreen.scrollHeight;

    try {
      // Gather context
      const propertiesContext = JSON.parse(localStorage.getItem('thanjai_properties')) || [];
      const leadsContext = JSON.parse(localStorage.getItem('thanjai_leads')) || [];

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      let reply = "";
      const lowerText = text.toLowerCase();
      
      // Basic AI Simulation Logic
      if (lowerText.includes('summarize') && (lowerText.includes('performance') || lowerText.includes('sales'))) {
        const totalLeads = leadsContext.length;
        const newLeads = leadsContext.filter(l => l.status === 'new').length;
        reply = `**Weekly Sales Performance Summary:**\n\n- **Total Active Leads:** ${totalLeads}\n- **New Inquiries:** ${newLeads}\n\n*Overall pipeline is looking healthy. Focus on converting the ${newLeads} new leads in your queue.*`;
      } else if (lowerText.includes('rajesh') || lowerText.includes('budget') || lowerText.includes('1.4cr')) {
        const matching = propertiesContext.filter(p => p.price <= 14000000 && p.price >= 10000000);
        reply = `I found **${matching.length} properties** matching Rajesh's budget of ₹1.4Cr:\n\n` + 
          matching.slice(0, 3).map(p => `- **${p.title}** (${p.location}) - ${p.priceFormatted}`).join('\n') + 
          `\n\n*Should I draft an email to Rajesh with these options?*`;
      } else if (lowerText.includes('schedule') || lowerText.includes('tomorrow')) {
        reply = `**Your Schedule for Tomorrow:**\n\n- **10:00 AM:** Site visit at Kaveri Riverfront Villas with Mr. Karthik.\n- **02:30 PM:** Follow-up call with Suresh Menon.\n- **04:00 PM:** Partner meeting with Chennai Prime Realty.\n\n*Would you like me to set reminders for these?*`;
      } else if (lowerText.includes('suresh')) {
        reply = `**Draft Email for Suresh Menon:**\n\nSubject: Follow-up regarding your property inquiry\n\nDear Suresh,\n\nI hope this email finds you well. I wanted to follow up on our previous conversation regarding the luxury apartments in Thanjavur. Please let me know if you are available for a quick site visit this weekend.\n\nBest regards,\nS. Vijayaraghavan\n\n*(You can edit this draft before sending)*`;
      } else {
        reply = `I am your AI Operating Agent simulator. I see you have **${propertiesContext.length} properties** and **${leadsContext.length} leads** in your CRM database.\n\nSince this is a simulated demo environment, I can respond to specific queries like:\n- Summarize this week's sales performance\n- Find properties matching Rajesh's budget (₹1.4Cr)\n- What is my schedule looking like for tomorrow?\n- Draft a follow-up email for Suresh Menon`;
      }

      // Remove loading indicator
      const loader = document.getElementById(loadingId);
      if (loader) loader.remove();
      
      // Append AI response
      appendMessage('system', reply);

      // Save log to database
      const user = getCurrentUser();
      const userId = user ? (user.email || user.username || 'admin') : 'system';
      fetchFromAPI('/ai_logs', {
        method: 'POST',
        body: JSON.stringify({
          id: `AI-${Date.now()}`,
          user_id: userId,
          prompt: text,
          response: reply
        })
      }).catch(err => console.warn('Failed to log AI conversation', err));

    } catch (error) {
      console.error('Error in AI simulator:', error);
      const loader = document.getElementById(loadingId);
      if (loader) loader.remove();
      appendMessage('system', 'Sorry, an error occurred in the AI simulator.');
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
