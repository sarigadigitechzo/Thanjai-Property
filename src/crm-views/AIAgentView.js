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
        <div class="ai-history" style="display:none;">
          <div class="ai-msg user">
            <div class="ai-msg-bubble">Find properties matching Rajesh's budget (₹1.4Cr)</div>
          </div>
          <div class="ai-msg system">
            <div class="ai-avatar"><i class="ri-magic-line"></i></div>
            <div class="ai-msg-bubble">
              <p>I found 3 properties matching Rajesh's budget of ₹1.4Cr in Coimbatore:</p>
              <div class="ai-prop-card">
                <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=100&q=80" />
                <div>
                  <h4>Premium Villa, Saravanampatti</h4>
                  <span>₹1.4 Cr &middot; 4 Beds</span>
                </div>
              </div>
              <button class="os-btn-secondary" style="margin-top:12px;">Share via WhatsApp</button>
            </div>
          </div>
        </div>

      </div>

      <!-- Input Area -->
      <div class="ai-input-area">
        <div class="ai-input-box">
          <button class="ai-attach-btn"><i class="ri-attachment-2"></i></button>
          <input type="text" placeholder="Message AI Agent..." />
          <button class="ai-send-btn"><i class="ri-arrow-up-line"></i></button>
        </div>
        <div class="ai-disclaimer">AI can make mistakes. Verify important information.</div>
      </div>
    </div>
  `;
}

export function initAIAgentView() {
  const sendBtn = document.querySelector('.ai-send-btn');
  const inputField = document.querySelector('.ai-input-box input');
  const sugCards = document.querySelectorAll('.ai-sug-card');
  const welcomeScreen = document.querySelector('.ai-welcome');
  const historyScreen = document.querySelector('.ai-history');

  function simulateChat(text) {
    if (!text.trim()) return;
    
    // Hide welcome, show history
    welcomeScreen.style.display = 'none';
    historyScreen.style.display = 'block';

    // Clear input
    inputField.value = '';
    
    // In a real app, we would append the new message to the history and auto-scroll.
    // For this prototype, we'll just show the hardcoded history which demonstrates the layout.
    // We can also update the user's bubble text to match what they typed/clicked.
    const userBubble = historyScreen.querySelector('.ai-msg.user .ai-msg-bubble');
    if (userBubble) {
      userBubble.textContent = text;
    }
  }

  if (sendBtn && inputField) {
    sendBtn.addEventListener('click', () => simulateChat(inputField.value));
    inputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') simulateChat(inputField.value);
    });
  }

  sugCards.forEach(card => {
    card.addEventListener('click', () => {
      const text = card.querySelector('span').textContent;
      simulateChat(text);
    });
  });
}
