// src/crm-views/HowToUseView.js - Comprehensive Interactive System User Guide

export function renderHowToUseView() {
  return `
    <div class="view-enter howto-view" style="max-width: 1100px; margin: 0 auto; padding-bottom: 40px;">
      
      <!-- Header Banner -->
      <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: #ffffff; border-radius: 16px; padding: 28px 32px; margin-bottom: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.15); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
        <div>
          <div style="display: inline-flex; align-items: center; gap: 6px; background: rgba(235, 94, 40, 0.2); color: #eb5e28; font-size: 0.78rem; font-weight: 800; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; border: 1px solid rgba(235,94,40,0.3);">
            <i class="ri-book-open-line"></i> User Manual & System Guide
          </div>
          <h1 style="margin: 0 0 6px 0; font-size: 1.8rem; font-weight: 800; color: #ffffff;">How to Use Thanjai Property CRM</h1>
          <p style="margin: 0; color: #94a3b8; font-size: 0.95rem;">Complete visual walkthrough and operational instructions for all CRM OS modules.</p>
        </div>
        <div style="display: flex; gap: 8px;">
          <button id="howto-expand-all" class="os-btn-secondary" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #ffffff; padding: 8px 16px; font-size: 0.85rem; border-radius: 8px; cursor: pointer;">
            <i class="ri-arrow-down-double-line"></i> Expand All
          </button>
          <button id="howto-collapse-all" class="os-btn-secondary" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #ffffff; padding: 8px 16px; font-size: 0.85rem; border-radius: 8px; cursor: pointer;">
            <i class="ri-arrow-up-double-line"></i> Collapse All
          </button>
        </div>
      </div>

      <!-- Quick Nav Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; margin-bottom: 24px;">
        <a href="#guide-pipeline" class="howto-quick-card" style="text-decoration: none; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 16px; display: flex; align-items: center; gap: 12px; transition: all 0.2s; box-shadow: 0 2px 5px rgba(0,0,0,0.03);">
          <div style="width: 38px; height: 38px; border-radius: 10px; background: #fff7ed; color: #ea580c; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0;"><i class="ri-kanban-view"></i></div>
          <div>
            <div style="font-weight: 700; color: #1e293b; font-size: 0.9rem;">1. CRM Pipeline</div>
            <div style="font-size: 0.76rem; color: #64748b;">Leads & Stages</div>
          </div>
        </a>

        <a href="#guide-properties" class="howto-quick-card" style="text-decoration: none; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 16px; display: flex; align-items: center; gap: 12px; transition: all 0.2s; box-shadow: 0 2px 5px rgba(0,0,0,0.03);">
          <div style="width: 38px; height: 38px; border-radius: 10px; background: #ecfdf5; color: #059669; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0;"><i class="ri-building-4-line"></i></div>
          <div>
            <div style="font-weight: 700; color: #1e293b; font-size: 0.9rem;">2. Property Inventory</div>
            <div style="font-size: 0.76rem; color: #64748b;">Add & GPS Map Pin</div>
          </div>
        </a>

        <a href="#guide-whatsapp" class="howto-quick-card" style="text-decoration: none; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 16px; display: flex; align-items: center; gap: 12px; transition: all 0.2s; box-shadow: 0 2px 5px rgba(0,0,0,0.03);">
          <div style="width: 38px; height: 38px; border-radius: 10px; background: #f0fdf4; color: #16a34a; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0;"><i class="ri-whatsapp-line"></i></div>
          <div>
            <div style="font-weight: 700; color: #1e293b; font-size: 0.9rem;">3. WhatsApp Log</div>
            <div style="font-size: 0.76rem; color: #64748b;">SmartPing Live Chat</div>
          </div>
        </a>

        <a href="#guide-visits" class="howto-quick-card" style="text-decoration: none; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 16px; display: flex; align-items: center; gap: 12px; transition: all 0.2s; box-shadow: 0 2px 5px rgba(0,0,0,0.03);">
          <div style="width: 38px; height: 38px; border-radius: 10px; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0;"><i class="ri-calendar-check-line"></i></div>
          <div>
            <div style="font-weight: 700; color: #1e293b; font-size: 0.9rem;">4. Site Visits</div>
            <div style="font-size: 0.76rem; color: #64748b;">Scheduling & Appts</div>
          </div>
        </a>
      </div>

      <!-- Modules Accordions -->
      <div style="display: flex; flex-direction: column; gap: 16px;">

        <!-- MODULE 1: CRM Pipeline & Lead Management -->
        <div class="howto-accordion-card" id="guide-pipeline" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
          <div class="howto-accordion-header" style="padding: 18px 22px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; background: #fafafa; border-bottom: 1px solid #f1f5f9;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 36px; height: 36px; border-radius: 8px; background: #fff7ed; color: #ea580c; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;"><i class="ri-kanban-view"></i></div>
              <div>
                <h3 style="margin: 0; font-size: 1.05rem; font-weight: 700; color: #1e293b;">1. CRM Pipeline & Lead Management</h3>
                <p style="margin: 2px 0 0 0; font-size: 0.8rem; color: #64748b;">Managing buyer inquiries, Kanban board movement, and sending WhatsApp updates</p>
              </div>
            </div>
            <i class="ri-arrow-down-s-line howto-arrow" style="font-size: 1.3rem; color: #94a3b8; transition: transform 0.2s;"></i>
          </div>
          <div class="howto-accordion-body" style="padding: 22px 24px; font-size: 0.92rem; color: #334155; line-height: 1.6;">
            <h4 style="margin: 0 0 10px 0; color: #0f172a; font-size: 0.95rem;">Key Steps:</h4>
            <ol style="margin: 0 0 16px 20px; padding: 0;">
              <li><strong>Adding New Leads:</strong> Click the <code>+ New Lead</code> button on the top-right of CRM Pipeline or click <code>Import CSV</code> to bulk upload.</li>
              <li><strong>Lead Stages:</strong> Move cards through <code>New Lead</code> ➔ <code>Contacted</code> ➔ <code>Property Shared</code> ➔ <code>Site Visit Scheduled</code> ➔ <code>Negotiation</code> ➔ <code>Won / Registration</code>. You can drag cards across Kanban columns or change the stage inside the Lead Detail page.</li>
              <li><strong>Lead Details:</strong> Click any lead's name to view their full profile, contact info, assigned executive, budget, and activity history.</li>
              <li><strong>Send WhatsApp:</strong> Click the orange <code>Send WhatsApp</code> button inside any lead's detail page to dispatch verified template messages (Follow-ups, Property Shortlists, Site Visit reminders). Messages will automatically sync into the <strong>WhatsApp Log</strong> chat history.</li>
              <li><strong>Matching Properties:</strong> The CRM automatically scores active listings against the client's preferred location, budget, and property type.</li>
            </ol>
            <div style="background: #f8fafc; border-left: 4px solid #ea580c; padding: 12px 16px; border-radius: 0 8px 8px 0; font-size: 0.85rem; color: #475569;">
              <i class="ri-information-line" style="color: #ea580c; font-weight: 700;"></i> <strong>Pro Tip:</strong> When new customers message your WhatsApp number, the system automatically creates a new lead entry in your CRM pipeline!
            </div>
          </div>
        </div>

        <!-- MODULE 2: Property Inventory Management -->
        <div class="howto-accordion-card" id="guide-properties" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
          <div class="howto-accordion-header" style="padding: 18px 22px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; background: #fafafa; border-bottom: 1px solid #f1f5f9;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 36px; height: 36px; border-radius: 8px; background: #ecfdf5; color: #059669; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;"><i class="ri-building-4-line"></i></div>
              <div>
                <h3 style="margin: 0; font-size: 1.05rem; font-weight: 700; color: #1e293b;">2. Properties Inventory (CRUD & GPS Map)</h3>
                <p style="margin: 2px 0 0 0; font-size: 0.8rem; color: #64748b;">Creating listings, uploading galleries, and pinpointing OpenStreetMap GPS coordinates</p>
              </div>
            </div>
            <i class="ri-arrow-down-s-line howto-arrow" style="font-size: 1.3rem; color: #94a3b8; transition: transform 0.2s;"></i>
          </div>
          <div class="howto-accordion-body" style="padding: 22px 24px; font-size: 0.92rem; color: #334155; line-height: 1.6;">
            <h4 style="margin: 0 0 10px 0; color: #0f172a; font-size: 0.95rem;">How to Add or Edit a Property:</h4>
            <ol style="margin: 0 0 16px 20px; padding: 0;">
              <li><strong>Open Full-Page Form:</strong> Go to <strong>Properties Inventory</strong> and click <code>+ Add Property</code> (or click Edit on an existing property row).</li>
              <li><strong>Smart Dynamic Fields:</strong>
                <ul>
                  <li>For <strong>Apartments / Villas / Houses</strong>: Bedrooms, Bathrooms, and Furnishing fields are automatically displayed.</li>
                  <li>For <strong>Plots / Land / Farmlands</strong>: Residential room fields are automatically hidden, leaving land area and frontage specs.</li>
                </ul>
              </li>
              <li><strong>Interactive Leaflet Map Pinpoint:</strong> Click the map widget to drop a pinpoint marker or drag the pin to capture exact GPS Latitude & Longitude automatically.</li>
              <li><strong>Photo Gallery Upload:</strong> Upload high-res images. Hover over any uploaded thumbnail to click the red delete button to remove images before saving.</li>
              <li><strong>Export Filtered CSV:</strong> Use search filters (Type, District, Purpose, Price) and click <code>Export CSV</code> to download only matching listings.</li>
            </ol>
          </div>
        </div>

        <!-- MODULE 3: WhatsApp Log & Live Webhook -->
        <div class="howto-accordion-card" id="guide-whatsapp" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
          <div class="howto-accordion-header" style="padding: 18px 22px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; background: #fafafa; border-bottom: 1px solid #f1f5f9;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 36px; height: 36px; border-radius: 8px; background: #f0fdf4; color: #16a34a; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;"><i class="ri-whatsapp-line"></i></div>
              <div>
                <h3 style="margin: 0; font-size: 1.05rem; font-weight: 700; color: #1e293b;">3. WhatsApp Log & Live Chat</h3>
                <p style="margin: 2px 0 0 0; font-size: 0.8rem; color: #64748b;">Live conversations, incoming SmartPing webhooks, and manual CRM replies</p>
              </div>
            </div>
            <i class="ri-arrow-down-s-line howto-arrow" style="font-size: 1.3rem; color: #94a3b8; transition: transform 0.2s;"></i>
          </div>
          <div class="howto-accordion-body" style="padding: 22px 24px; font-size: 0.92rem; color: #334155; line-height: 1.6;">
            <h4 style="margin: 0 0 10px 0; color: #0f172a; font-size: 0.95rem;">How WhatsApp Messaging Works:</h4>
            <ol style="margin: 0 0 16px 20px; padding: 0;">
              <li><strong>Real-time Inbound Messages:</strong> When customers text your WhatsApp Business number (<code>+91 84899 96852</code>), messages arrive in real-time via SmartPing Webhook and appear in your contact sidebar.</li>
              <li><strong>Replying to Chats:</strong> Select any conversation on the left, type your message in the bottom input bar, and press Enter or click the green Send button.</li>
              <li><strong>Official Automated Greeting:</strong> New customers receive the official Thanjai Property welcome greeting template automatically (protected with a 24-hour single-send limit so customers are never spammed).</li>
              <li><strong>Single Source of Truth:</strong> All chats (both inbound from WhatsApp and outbound replies from the CRM) are stored in the unified <code>whatsapp_messages</code> database table.</li>
            </ol>
          </div>
        </div>

        <!-- MODULE 4: Site Visits & Appointments -->
        <div class="howto-accordion-card" id="guide-visits" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
          <div class="howto-accordion-header" style="padding: 18px 22px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; background: #fafafa; border-bottom: 1px solid #f1f5f9;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 36px; height: 36px; border-radius: 8px; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;"><i class="ri-calendar-check-line"></i></div>
              <div>
                <h3 style="margin: 0; font-size: 1.05rem; font-weight: 700; color: #1e293b;">4. Site Visits & Appointments</h3>
                <p style="margin: 2px 0 0 0; font-size: 0.8rem; color: #64748b;">Scheduling on-ground property tours, assigning drivers/executives, and status tracking</p>
              </div>
            </div>
            <i class="ri-arrow-down-s-line howto-arrow" style="font-size: 1.3rem; color: #94a3b8; transition: transform 0.2s;"></i>
          </div>
          <div class="howto-accordion-body" style="padding: 22px 24px; font-size: 0.92rem; color: #334155; line-height: 1.6;">
            <ol style="margin: 0 0 16px 20px; padding: 0;">
              <li><strong>Scheduling a Visit:</strong> From the Lead Details page or Site Visits page, click <code>Schedule visit</code>, select the client, target property, date, and appointment time.</li>
              <li><strong>Assigning Staff:</strong> Assign the field visit to a dedicated sales manager or executive for on-ground plot boundary showing and legal Patta review.</li>
              <li><strong>Status Updates:</strong> Mark visits as <code>Scheduled</code> ➔ <code>Completed</code> ➔ <code>Follow-up Required</code> or <code>Cancelled</code>.</li>
            </ol>
          </div>
        </div>

        <!-- MODULE 5: Partner Network & Channel Leads -->
        <div class="howto-accordion-card" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
          <div class="howto-accordion-header" style="padding: 18px 22px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; background: #fafafa; border-bottom: 1px solid #f1f5f9;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 36px; height: 36px; border-radius: 8px; background: #fdf4ff; color: #c026d3; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;"><i class="ri-briefcase-4-line"></i></div>
              <div>
                <h3 style="margin: 0; font-size: 1.05rem; font-weight: 700; color: #1e293b;">5. Partner Network & Commissions</h3>
                <p style="margin: 2px 0 0 0; font-size: 0.8rem; color: #64748b;">Managing real estate brokers, channel partners, and shared lead distributions</p>
              </div>
            </div>
            <i class="ri-arrow-down-s-line howto-arrow" style="font-size: 1.3rem; color: #94a3b8; transition: transform 0.2s;"></i>
          </div>
          <div class="howto-accordion-body" style="padding: 22px 24px; font-size: 0.92rem; color: #334155; line-height: 1.6;">
            <ol style="margin: 0 0 16px 20px; padding: 0;">
              <li><strong>Add Partners:</strong> Register verified brokers with company name, phone, email, and commission percentages.</li>
              <li><strong>Share Leads:</strong> From any lead page, click <code>Share to partner</code> to broadcast or assign customer requirements to specific regional specialists.</li>
            </ol>
          </div>
        </div>

        <!-- MODULE 6: AI Operating Agent & Prompt Simulator -->
        <div class="howto-accordion-card" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
          <div class="howto-accordion-header" style="padding: 18px 22px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; background: #fafafa; border-bottom: 1px solid #f1f5f9;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 36px; height: 36px; border-radius: 8px; background: #fef2f2; color: #dc2626; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;"><i class="ri-magic-line"></i></div>
              <div>
                <h3 style="margin: 0; font-size: 1.05rem; font-weight: 700; color: #1e293b;">6. AI Operating Agent</h3>
                <p style="margin: 2px 0 0 0; font-size: 0.8rem; color: #64748b;">Natural language prompt simulator for real estate analytics and buyer matching</p>
              </div>
            </div>
            <i class="ri-arrow-down-s-line howto-arrow" style="font-size: 1.3rem; color: #94a3b8; transition: transform 0.2s;"></i>
          </div>
          <div class="howto-accordion-body" style="padding: 22px 24px; font-size: 0.92rem; color: #334155; line-height: 1.6;">
            <p>The AI Agent allows you to query your business in plain English (e.g. <em>"Show all leads interested in Trichy Road plots under 30 Lakhs"</em> or <em>"Draft follow-up for hot buyer Kaniga"</em>).</p>
          </div>
        </div>

        <!-- MODULE 7: Website Images, CMS & Settings -->
        <div class="howto-accordion-card" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
          <div class="howto-accordion-header" style="padding: 18px 22px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; background: #fafafa; border-bottom: 1px solid #f1f5f9;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 36px; height: 36px; border-radius: 8px; background: #f1f5f9; color: #475569; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;"><i class="ri-settings-3-line"></i></div>
              <div>
                <h3 style="margin: 0; font-size: 1.05rem; font-weight: 700; color: #1e293b;">7. Website CMS, Staff & Settings</h3>
                <p style="margin: 2px 0 0 0; font-size: 0.8rem; color: #64748b;">Dynamic homepage image replacement, Blog articles, staff permissions, and API keys</p>
              </div>
            </div>
            <i class="ri-arrow-down-s-line howto-arrow" style="font-size: 1.3rem; color: #94a3b8; transition: transform 0.2s;"></i>
          </div>
          <div class="howto-accordion-body" style="padding: 22px 24px; font-size: 0.92rem; color: #334155; line-height: 1.6;">
            <ol style="margin: 0 0 16px 20px; padding: 0;">
              <li><strong>Website Images:</strong> Change any public website banner or photo directly from the CRM without editing code. Changes are logged to the immutable <strong>Audit Log</strong>.</li>
              <li><strong>Blog CMS:</strong> Publish property guides, legal Patta advice, and RERA checklists to the public blog.</li>
              <li><strong>Admin Staff:</strong> Create staff logins and assign role-based access to specific CRM modules.</li>
              <li><strong>Settings:</strong> View and manage your SmartPing WhatsApp API keys, webhook URLs, and system configurations.</li>
            </ol>
          </div>
        </div>

      </div>

    </div>
  `;
}

export function initHowToUseListeners() {
  const cards = document.querySelectorAll('.howto-accordion-card');
  cards.forEach(card => {
    const header = card.querySelector('.howto-accordion-header');
    const body = card.querySelector('.howto-accordion-body');
    const arrow = card.querySelector('.howto-arrow');

    header?.addEventListener('click', () => {
      const isOpen = body.style.display === 'none';
      body.style.display = isOpen ? 'block' : 'none';
      if (arrow) arrow.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
    });
  });

  document.getElementById('howto-expand-all')?.addEventListener('click', () => {
    cards.forEach(card => {
      const body = card.querySelector('.howto-accordion-body');
      const arrow = card.querySelector('.howto-arrow');
      if (body) body.style.display = 'block';
      if (arrow) arrow.style.transform = 'rotate(180deg)';
    });
  });

  document.getElementById('howto-collapse-all')?.addEventListener('click', () => {
    cards.forEach(card => {
      const body = card.querySelector('.howto-accordion-body');
      const arrow = card.querySelector('.howto-arrow');
      if (body) body.style.display = 'none';
      if (arrow) arrow.style.transform = 'rotate(0deg)';
    });
  });
}
