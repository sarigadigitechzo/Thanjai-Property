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

      // Determine backend URL dynamically based on environment
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const backendUrl = isLocal ? 'http://localhost:3000/api/chat' : 'https://thanjaiproperty.com/api/chat';

      // Call the Node.js backend
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, propertiesContext, leadsContext })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      // Remove loading indicator
      const loader = document.getElementById(loadingId);
      if (loader) loader.remove();
      
      // Append AI response
      appendMessage('system', data.reply);

    } catch (error) {
      console.error('Error fetching AI response:', error);
      const loader = document.getElementById(loadingId);
      if (loader) loader.remove();
      appendMessage('system', 'Sorry, I am having trouble connecting to the backend server. Please make sure the Node.js backend is running on port 3000.');
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
