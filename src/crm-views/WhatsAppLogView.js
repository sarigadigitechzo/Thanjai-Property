export function renderWhatsAppLogView() {
  return `
    <div class="view-enter whatsapp-view">
      
      <!-- Left: Conversation List -->
      <div class="wa-sidebar">
        <div class="wa-header">
          <h2>WhatsApp Business</h2>
          <button class="os-btn-secondary" style="padding: 6px 12px;"><i class="ri-edit-box-line"></i></button>
        </div>
        
        <div class="os-filter-bar" style="margin: 0; box-shadow: none; border-radius: 0; border: none; border-bottom: var(--os-border-thin); padding: 12px 16px;">
          <div class="search-box" style="width: 100%;">
            <i class="ri-search-line"></i>
            <input type="text" placeholder="Search chats..." />
          </div>
        </div>

        <div class="wa-chat-list">
          <div class="wa-chat-item active hover-lift">
            <img src="https://ui-avatars.com/api/?name=Ravi+Kumar&background=random" class="wa-avatar" />
            <div class="wa-chat-info">
              <div class="wa-chat-top">
                <span class="wa-name">Ravi Kumar</span>
                <span class="wa-time">10:42 AM</span>
              </div>
              <div class="wa-chat-preview">
                <span class="wa-last-msg">Yes, 4 PM works for the site visit.</span>
                <span class="wa-badge">2</span>
              </div>
            </div>
          </div>
          
          <div class="wa-chat-item hover-lift">
            <img src="https://ui-avatars.com/api/?name=Suresh+Menon&background=random" class="wa-avatar" />
            <div class="wa-chat-info">
              <div class="wa-chat-top">
                <span class="wa-name">Suresh Menon</span>
                <span class="wa-time">Yesterday</span>
              </div>
              <div class="wa-chat-preview">
                <span class="wa-last-msg"><i class="ri-check-double-line" style="color: #3b82f6;"></i> I'll review the brochure.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Chat Panel -->
      <div class="wa-main">
        <div class="wa-chat-header">
          <div class="wa-chat-title">
            <img src="https://ui-avatars.com/api/?name=Ravi+Kumar&background=random" class="wa-avatar" />
            <div>
              <h3>Ravi Kumar</h3>
              <p>Looking for a Villa in Anna Nagar</p>
            </div>
          </div>
          <div class="wa-chat-actions">
            <button class="wa-icon-btn"><i class="ri-phone-line"></i></button>
            <button class="wa-icon-btn"><i class="ri-search-line"></i></button>
            <button class="wa-icon-btn"><i class="ri-more-2-fill"></i></button>
          </div>
        </div>

        <div class="wa-chat-history">
          <div class="wa-date-divider">Today</div>
          
          <div class="wa-msg sent">
            <div class="wa-bubble">
              Hi Ravi, are we still on for the site visit to the Anna Nagar Villa today?
              <span class="wa-meta">10:30 AM <i class="ri-check-double-line" style="color: #3b82f6;"></i></span>
            </div>
          </div>
          
          <div class="wa-msg received">
            <div class="wa-bubble">
              Yes, 4 PM works for the site visit.
              <span class="wa-meta">10:42 AM</span>
            </div>
          </div>

          <!-- Property Preview Injection -->
          <div class="wa-msg sent">
            <div class="wa-bubble prop-preview">
              <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=300&q=80" />
              <div class="prop-info">
                <h4>Premium Villa, Anna Nagar</h4>
                <p>₹4.5 Cr &middot; 4 Beds</p>
                <button class="os-btn-secondary" style="width: 100%; margin-top: 8px;">View Details</button>
              </div>
              <span class="wa-meta">10:43 AM <i class="ri-check-line"></i></span>
            </div>
          </div>
        </div>

        <!-- AI Suggested Replies -->
        <div class="wa-ai-suggestions">
          <div class="ai-label"><i class="ri-magic-line"></i> AI Suggestions:</div>
          <button class="ai-pill">Great, see you at 4 PM!</button>
          <button class="ai-pill">Would you like me to send location directions?</button>
        </div>

        <!-- Input Area -->
        <div class="wa-input-area">
          <button class="wa-attach"><i class="ri-add-line"></i></button>
          <input type="text" placeholder="Type a message..." />
          <button class="wa-send"><i class="ri-send-plane-fill"></i></button>
        </div>
      </div>

    </div>
  `;
}
