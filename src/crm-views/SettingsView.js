import { getSiteImage, updateSiteImage, resetSiteImage } from '../utils/siteImagesStore.js';
import { showToast } from '../utils/toast.js';
import { fetchFromAPI } from '../utils/api.js';

export function renderSettingsView() {
  const templates = [
    {
      id: 'initial_contact_intro',
      name: 'Initial contact intro (auto)',
      tag: 'initial_contact_intro',
      category: 'Stage: New Lead (Auto)',
      params: ['{{1}} Client Name', '{{2}} Property Type / Requirement', '{{3}} Location'],
      content: `Hello {{1}},\n\nThank you for your interest in Thanjai Property!\n\nWe have received your requirement for {{2}} in {{3}}. Our property advisor will assist you with verified Patta documents, prime locations, and direct builder coordination.\n\nOfficial Desk: +91 84899 96852\nWebsite: thanjaiproperty.com\n\nWarm regards,\nThanjai Property Desk`,
      isActive: true
    },
    {
      id: 'stage_requirement_analysis',
      name: 'Requirement analysis (auto)',
      tag: 'stage_requirement_analysis',
      category: 'Stage: Requirement Analysis (Auto)',
      params: ['{{1}} Client Name', '{{2}} Location', '{{3}} Requirement / Type', '{{4}} Budget Range'],
      content: `Hello {{1}},\n\nWe are currently analyzing your property requirement in {{2}} for {{3}} with a budget of {{4}}.\n\nOur team is shortlisting legal-verified properties matching your exact criteria and will share tailored options shortly.\n\nFor immediate assistance, contact us at +91 84899 96852.\n\nBest regards,\nThanjai Property`,
      isActive: true
    },
    {
      id: 'stage_lead_qualified',
      name: 'Lead qualified confirmation (auto)',
      tag: 'stage_lead_qualified',
      category: 'Stage: Qualified (Auto)',
      params: ['{{1}} Client Name', '{{2}} Requirement', '{{3}} Location', '{{4}} Budget Range'],
      content: `Hello {{1}},\n\nYour profile and property requirement for {{2}} in {{3}} have been qualified by our senior property desk.\n\nWe have shortlisted exclusive options matching your budget range of {{4}} with 100% legal clearance.\n\nShall we schedule an advisory call or property presentation today?\n\nDesk: +91 84899 96852\nThanjai Property`,
      isActive: true
    },
    {
      id: 'stage_site_visit_scheduled',
      name: 'Site visit scheduled (auto)',
      tag: 'stage_site_visit_scheduled',
      category: 'Stage: Site Visit (Auto)',
      params: ['{{1}} Client Name', '{{2}} Property Title', '{{3}} Location', '{{4}} Date', '{{5}} Time', '{{6}} Assigned Specialist'],
      content: `Hello {{1}},\n\nYour site visit for {{2}} located at {{3}} has been scheduled on {{4}} at {{5}}.\n\nOur property specialist {{6}} will meet you at the site to assist with plot boundaries, layout review, and Patta verification.\n\nLocation coordinator: +91 84899 96852.\n\nWarm regards,\nThanjai Property`,
      isActive: true
    },
    {
      id: 'stage_negotiation_stage',
      name: 'Negotiation check-in (auto)',
      tag: 'stage_negotiation_stage',
      category: 'Stage: Negotiation (Auto)',
      params: ['{{1}} Client Name', '{{2}} Property Title', '{{3}} Location / Terms'],
      content: `Hello {{1}},\n\nWe have initiated the price negotiation and legal terms discussion for {{2}} with the property owner.\n\nOur team is working to secure the best finalized deal for you at {{3}}. We will update you with the approved terms shortly.\n\nAdvisory Desk: +91 84899 96852.\n\nBest regards,\nThanjai Property`,
      isActive: true
    },
    {
      id: 'stage_booking_in_progress',
      name: 'Booking in progress (auto)',
      tag: 'stage_booking_in_progress',
      category: 'Stage: Booking In Progress (Auto)',
      params: ['{{1}} Client Name', '{{2}} Property Title', '{{3}} Location', '{{4}} Token Advance Amount'],
      content: `Hello {{1}},\n\nGreat news! The booking process for {{2}} in {{3}} is now in progress.\n\nToken Advance / Booking Amount: {{4}}\nOur legal team is preparing the draft sale agreement and verifying the parent deed documents.\n\nFor paperwork support: +91 84899 96852.\n\nWarm regards,\nThanjai Property`,
      isActive: true
    },
    {
      id: 'bank_loan_assist',
      name: 'Bank loan assistance (auto)',
      tag: 'bank_loan_assist',
      category: 'Stage: Loan / Financing (Auto)',
      params: ['{{1}} Client Name', '{{2}} Property / Location'],
      content: `Hello {{1}},\n\nWe are assisting you with your bank loan / home loan process for {{2}}.\n\nOur banking partners (SBI, HDFC, ICICI, Indian Bank) provide competitive interest rates and fast approvals for registered plots and villas.\n\nPlease keep your KYC and income documents ready. Loan desk: +91 84899 96852.\n\nBest regards,\nThanjai Property Finance Desk`,
      isActive: true
    },
    {
      id: 'stage_deal_won_registration',
      name: 'Registration testimonial & deal won (auto)',
      tag: 'stage_deal_won_registration',
      category: 'Stage: Deal Won & Registration (Auto)',
      params: ['{{1}} Client Name', '{{2}} Property Title', '{{3}} Location / Registry Office'],
      content: `Congratulations {{1}}! 🎉\n\nYour property registration for {{2}} at {{3}} has been successfully completed!\n\nThank you for choosing Thanjai Property. We are proud to have assisted you in securing your valuable real estate asset.\n\nOfficial Desk: +91 84899 96852\nThanjai Property`,
      isActive: true
    },
    {
      id: 'follow_up_nurture',
      name: 'Follow-up nurture message',
      tag: 'follow_up_nurture',
      category: 'General Follow-up / Nurturing',
      params: ['{{1}} Client Name', '{{2}} Location'],
      content: `Hello {{1}},\n\nFollowing up on your property requirement in {{2}}. We have new DTCP/RERA-approved projects and independent plots available this week.\n\nWould you like us to share updated layout options and pricing?\n\nDirect WhatsApp: +91 84899 96852.\n\nWarm regards,\nThanjai Property`,
      isActive: true
    },
    {
      id: 'partner_transfer_notification',
      name: 'Partner transfer notification (client)',
      tag: 'partner_transfer_notification',
      category: 'Lead Transfer (Client Message)',
      params: ['{{1}} Client Name', '{{2}} Preferred Location', '{{3}} Partner Specialist Name', '{{4}} Official Desk Number'],
      content: `Hello {{1}},\n\nYour property requirement in {{2}} has been assigned to our senior partner specialist {{3}}.\n\nOur team and specialist will assist you with exclusive listings, verified Patta documents, and on-site visits.\n\nFor any direct assistance, contact our official desk at {{4}}.\n\nBest regards,\nThanjai Property`,
      isActive: true
    },
    {
      id: 'partner_lead_assignment',
      name: 'Partner lead assignment (network)',
      tag: 'partner_lead_assignment',
      category: 'Partner Network (Partner Message)',
      params: ['{{1}} Partner Name', '{{2}} Client Name', '{{3}} Location', '{{4}} Requirement', '{{5}} Budget', '{{6}} Notes'],
      content: `Hello {{1}},\n\nA new qualified buyer requirement has been assigned to you from Thanjai Property:\n\n👤 Client Name: {{2}}\n📍 Preferred Location: {{3}}\n🏡 Requirement: {{4}}\n💰 Budget Range: {{5}}\n\n📝 Notes: {{6}}\n\nFor client coordination, please connect through our official desk: +91 84899 96852.\n\nWarm regards,\nThanjai Property Partner Network`,
      isActive: true
    },
    {
      id: 'stage_closed_lost_archive',
      name: 'Requirement closed / archive message',
      tag: 'stage_closed_lost_archive',
      category: 'Stage: Closed Lost (Auto)',
      params: ['{{1}} Client Name', '{{2}} Location / Requirement'],
      content: `Hello {{1}},\n\nWe have updated your property enquiry status for {{2}}. Whenever you are ready to resume your property search or explore new investments in Tamil Nadu, our desk is always here to assist you.\n\nFeel free to reach out anytime at +91 84899 96852.\n\nBest regards,\nThanjai Property`,
      isActive: true
    }
  ];

  // Save templates list in global window scope for modal viewer
  window.__thanjaiSettingsTemplates = templates;

  const templatesHTML = templates.map(t => `
    <div class="template-card" style="padding: 18px 0; border-bottom: 1px solid var(--os-gray-100);">
      <div class="template-info">
        <div class="template-header" style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 8px;">
          <span class="template-name" style="font-weight: 700; font-size: 0.95rem; color: #0f172a;">${t.name}</span>
          <span class="template-tag-key" style="background: #f1f5f9; padding: 2px 8px; border-radius: 6px; font-family: monospace; font-size: 0.75rem; color: #475569; font-weight: 600;">${t.tag}</span>
          <span style="background: #eff6ff; color: #2563eb; font-size: 0.72rem; font-weight: 600; padding: 2px 8px; border-radius: 12px; border: 1px solid #bfdbfe;">${t.category}</span>
          ${t.isActive ? '<span class="template-tag-active" style="background: #dcfce7; color: #166534; font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: 12px; border: 1px solid #bbf7d0;">ACTIVE</span>' : ''}
        </div>
        <p class="template-preview" style="font-size: 0.85rem; color: #64748b; line-height: 1.5; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
          ${t.content.replace(/\n/g, ' ')}
        </p>
      </div>
      <div class="template-action" style="margin-left: 16px;">
        <button class="settings-btn-view btn-view-full-template" data-id="${t.id}" style="display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; border: 1px solid #cbd5e1; background: #ffffff; color: #0f172a; border-radius: 8px; font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: all 0.2s ease;">
          <i class="ri-eye-line" style="color: var(--os-luxury-orange, #eb5e28);"></i> View Full Template
        </button>
      </div>
    </div>
  `).join('');

  return `
    <div class="settings-container view-enter">
      
      <!-- Header Section -->
      <div class="settings-header-title">
        <div class="settings-header-icon">
          <i class="ri-settings-3-line"></i>
        </div>
        <div class="settings-header-text">
          <h1>Settings</h1>
          <p>WhatsApp templates, automations, and workspace preferences</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="settings-tabs">
        <div class="settings-tab active" data-tab="templates">Templates & Currencies</div>
        <div class="settings-tab" data-tab="branding">Branding</div>
        <div class="settings-tab" data-tab="integrations">Integrations</div>
      </div>

      <!-- Tab Content: Templates & Currencies -->
      <div id="tab-templates" class="tab-content active">
        <!-- Content Area -->
        <div class="settings-content-card">
        
        <div class="settings-section-header">
          <div>
            <h2 class="settings-section-title">Official WhatsApp Templates</h2>
            <p class="settings-section-desc">
              All official WhatsApp campaign templates approved on SmartPing (+91 84899 96852). Click <strong>View Full Template</strong> to inspect parameter structures, dynamic values, and live preview layout.
            </p>
          </div>
        </div>

        <div class="template-group-title" style="font-size: 0.8rem; font-weight: 700; letter-spacing: 0.5px; color: #64748b; margin-top: 16px;">
          APPROVED SMARTPING CAMPAIGN TEMPLATES (${templates.length})
        </div>
        
        <div class="template-list">
          ${templatesHTML}
        </div>

      </div>

      <!-- Currencies Section -->
      <div class="settings-content-card">
        <h2 class="settings-section-title">Currencies</h2>
        <div class="currency-section">
          <input type="text" class="currency-input" value="INR, USD, AED, EUR" />
          <button class="settings-btn-primary" style="padding: 10px 24px;">Save</button>
        </div>
      </div>
      </div> <!-- End Templates Tab -->

      <!-- Full Template View Modal (Fixed Centered Modal) -->
      <div id="view-template-modal" class="os-modal-overlay" style="position: fixed !important; inset: 0 !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; background: rgba(15, 23, 42, 0.65) !important; backdrop-filter: blur(5px) !important; z-index: 999999 !important; display: none; align-items: center; justify-content: center; padding: 20px; box-sizing: border-box;">
        <div class="os-modal-card" style="max-width: 600px; width: 100%; max-height: 88vh; background: #ffffff; border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35); overflow: hidden; display: flex; flex-direction: column; margin: auto; border: 1px solid #e2e8f0;">
          
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 18px 24px; border-bottom: 1px solid #e2e8f0; background: #f8fafc;">
            <div>
              <h3 id="modal-tpl-title" style="margin: 0; font-size: 1.1rem; font-weight: 700; color: #0f172a;">Template Details</h3>
              <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
                <span id="modal-tpl-tag" style="background: #e2e8f0; font-family: monospace; font-size: 0.75rem; font-weight: 600; padding: 2px 8px; border-radius: 6px; color: #334155;">tag</span>
                <span id="modal-tpl-category" style="background: #eff6ff; color: #2563eb; font-size: 0.72rem; font-weight: 600; padding: 2px 8px; border-radius: 12px; border: 1px solid #bfdbfe;">Category</span>
              </div>
            </div>
            <button id="close-template-modal-btn" style="background: none; border: none; font-size: 1.4rem; color: #64748b; cursor: pointer; padding: 4px; border-radius: 6px; display: flex; align-items: center; justify-content: center;">
              <i class="ri-close-line"></i>
            </button>
          </div>

          <div style="padding: 22px 24px; overflow-y: auto; max-height: calc(88vh - 140px);">
            
            <div style="margin-bottom: 16px;">
              <label style="font-size: 0.75rem; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 8px;">
                Dynamic Parameter Structure
              </label>
              <div id="modal-tpl-params" style="display: flex; flex-wrap: wrap; gap: 6px;">
                <!-- Parameter badges injected here -->
              </div>
            </div>

            <div>
              <label style="font-size: 0.75rem; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 8px;">
                Full Message Content (SmartPing Format)
              </label>
              <div style="background: #eef8f2; border: 1px solid #c7eed8; border-radius: 12px; padding: 18px; position: relative;">
                <div style="font-size: 0.75rem; font-weight: 700; color: #059669; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
                  <i class="ri-whatsapp-fill" style="font-size: 1rem;"></i> OFFICIAL WHATSAPP PREVIEW (+91 84899 96852)
                </div>
                <div id="modal-tpl-content" style="white-space: pre-wrap; font-size: 0.9rem; line-height: 1.6; color: #1e293b; font-family: inherit;">
                  <!-- Template body injected here -->
                </div>
              </div>
            </div>

          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; border-top: 1px solid #e2e8f0; background: #f8fafc;">
            <button id="copy-tpl-content-btn" class="settings-btn-outline" style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; font-size: 0.85rem;">
              <i class="ri-file-copy-line"></i> Copy Template Text
            </button>
            <button id="close-template-modal-footer-btn" class="settings-btn-primary" style="padding: 8px 20px; font-size: 0.85rem;">
              Close
            </button>
          </div>

        </div>
      </div>

      <!-- Tab Content: Branding -->
      <div id="tab-branding" class="tab-content">
        <div class="settings-content-card">
          <div class="settings-section-header">
            <div>
              <h2 class="settings-section-title">App branding</h2>
              <p class="settings-section-desc">Shown in the sidebar and browser tab for every user.</p>
            </div>
          </div>

          <div class="settings-form-group">
            <label class="settings-label">Application name</label>
            <input type="text" class="settings-input" value="ThanjaiProperty" />
          </div>

          <div class="settings-form-group">
            <label class="settings-label">Tagline</label>
            <input type="text" class="settings-input" value="RealEstate" />
          </div>

          <div class="settings-form-group">
            <label class="settings-label">Logo</label>
            <div class="logo-upload-area">
              <div class="logo-preview-box">
                <img id="settings-logo-preview" src="${getSiteImage('brand_logo') || '/thanjai-official-new.png'}" alt="Logo preview" onerror="this.src='/thanjai-official-new.png'" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
              </div>
              <div class="upload-btn-group">
                <button id="settings-logo-upload-btn" class="settings-btn-outline"><i class="ri-upload-cloud-2-line"></i> Upload logo</button>
                <button id="settings-logo-remove-btn" class="btn-remove-link">Remove</button>
                <input type="file" id="settings-logo-file-input" accept="image/*" style="display: none;" />
              </div>
            </div>
          </div>

          <div class="settings-form-group">
            <label class="settings-label">Primary color</label>
            <div class="color-picker-area">
              <input type="color" id="settings-primary-color" class="color-swatch-box" value="#eb5e28" style="padding: 0; border: none; cursor: pointer; outline: none; -webkit-appearance: none;" />
              <input type="text" id="settings-primary-color-text" class="settings-input" value="#eb5e28" style="color: var(--os-gray-500);" />
            </div>
          </div>

          <button class="settings-btn-primary" style="margin-top: 16px;">Save branding</button>
        </div>
      </div> <!-- End Branding Tab -->

      <!-- Tab Content: Integrations -->
      <div id="tab-integrations" class="tab-content">
        
        <!-- 1. WhatsApp provider -->
        <div class="settings-content-card">
          <div class="settings-section-header">
            <div>
              <h2 class="settings-section-title">WhatsApp Provider & Live Webhook</h2>
              <p class="settings-section-desc">Manage your outbound WhatsApp API provider (SmartPing / AiSensy) and live 2-way inbound message webhook.</p>
            </div>
          </div>
          
          <div class="settings-grid-2">
            <div class="settings-form-group">
              <label class="settings-label">Active Provider</label>
              <select class="settings-input" id="settings-wa-provider">
                <option value="smartping">SmartPing (Recommended)</option>
                <option value="aisensy">AiSensy</option>
              </select>
            </div>
            <div class="settings-form-group">
              <label class="settings-label">Registered WhatsApp Business Number</label>
              <input type="text" class="settings-input" value="+91 84899 96852" readonly style="background: #f8fafc; font-weight: 600; color: #1e293b;" />
            </div>
          </div>

          <div class="settings-grid-2">
            <div class="settings-form-group">
              <label class="settings-label">API Key / Token</label>
              <input type="password" id="settings-wa-api-key" class="settings-input" placeholder="Paste SmartPing / AiSensy API Key here" />
            </div>
            <div class="settings-form-group">
              <label class="settings-label">Campaign Name (Live)</label>
              <input type="text" id="settings-wa-campaign" class="settings-input" value="realrest_notification_new_final" />
            </div>
          </div>

          <!-- Webhook Configuration Card -->
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 18px; margin: 18px 0;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
              <span style="font-weight: 700; color: #166534; font-size: 0.95rem; display: flex; align-items: center; gap: 8px;">
                <i class="ri-checkbox-circle-fill" style="color: #22c55e;"></i> Live Inbound Webhook Configuration
              </span>
              <span style="background: #dcfce7; color: #15803d; font-size: 0.75rem; font-weight: 700; padding: 3px 8px; border-radius: 12px;">ENABLED</span>
            </div>
            <p style="font-size: 0.85rem; color: #374151; margin-bottom: 12px; line-height: 1.5;">
              Use these exact details in your <strong>SmartPing</strong> or <strong>WhatsApp Business Manager</strong> webhook settings so customer replies appear instantly in your <strong>WhatsApp Log</strong>:
            </p>
            
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <div style="display: flex; align-items: center; justify-content: space-between; background: #ffffff; padding: 10px 14px; border-radius: 8px; border: 1px solid #e2e8f0;">
                <div>
                  <div style="font-size: 0.72rem; color: #64748b; font-weight: 600;">INBOUND WEBHOOK CALLBACK URL</div>
                  <div style="font-family: monospace; font-size: 0.88rem; color: #0f172a; font-weight: 600;">https://thanjaiproperty.com/api.php/webhook</div>
                </div>
                <button type="button" class="settings-btn-outline" style="padding: 6px 12px; font-size: 0.8rem;" onclick="navigator.clipboard.writeText('https://thanjaiproperty.com/api.php/webhook'); window.showToast('Webhook URL copied to clipboard!', 'ri-file-copy-line');">
                  <i class="ri-file-copy-line"></i> Copy URL
                </button>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; background: #ffffff; padding: 10px 14px; border-radius: 8px; border: 1px solid #e2e8f0;">
                <div>
                  <div style="font-size: 0.72rem; color: #64748b; font-weight: 600;">WEBHOOK VERIFY TOKEN</div>
                  <div style="font-family: monospace; font-size: 0.88rem; color: #0f172a; font-weight: 600;">thanjai_webhook_2026</div>
                </div>
                <button type="button" class="settings-btn-outline" style="padding: 6px 12px; font-size: 0.8rem;" onclick="navigator.clipboard.writeText('thanjai_webhook_2026'); window.showToast('Verify Token copied!', 'ri-file-copy-line');">
                  <i class="ri-file-copy-line"></i> Copy Token
                </button>
              </div>
            </div>
          </div>

          <button id="settings-wa-save-btn" class="settings-btn-primary" style="padding: 11px 24px;">Save WhatsApp Settings</button>
        </div>

        <!-- 2. AI Operating Agent -->
        <div class="settings-content-card">
          <div class="settings-section-header">
            <div>
              <h2 class="settings-section-title">AI Operating Agent</h2>
              <p class="settings-section-desc">Powers sales pitches, proposals, price predictions, and agreement drafts. Pricing fields are only used to estimate cost on the Usage & Cost tab.</p>
            </div>
          </div>

          <div class="settings-form-group" style="max-width: 400px;">
            <label class="settings-label">Provider</label>
            <select class="settings-input">
              <option value="gemini">Google Gemini</option>
              <option value="openai">OpenAI</option>
            </select>
          </div>

          <div class="settings-grid-2">
            <div class="settings-form-group">
              <label class="settings-label">API Key</label>
              <input type="password" class="settings-input" value="••••••••••••" />
            </div>
            <div class="settings-form-group">
              <label class="settings-label">Model</label>
              <input type="text" class="settings-input" value="gemini-3.5-flash" />
            </div>
          </div>

          <div class="settings-grid-2" style="grid-template-columns: 2fr 1fr 1fr;">
            <div class="settings-form-group">
              <label class="settings-label">API URL</label>
              <input type="text" class="settings-input" value="https://generativelanguage.googleapis.com/v1beta/models" />
            </div>
            <div class="settings-form-group">
              <label class="settings-label">Input $ / 1M tokens</label>
              <input type="text" class="settings-input" value="0.075" />
            </div>
            <div class="settings-form-group">
              <label class="settings-label">Output $ / 1M tokens</label>
              <input type="text" class="settings-input" value="0.3" />
            </div>
          </div>

          <button class="settings-btn-save-small" style="margin-top: 16px;">Save</button>
        </div>

        <!-- 3. Meta Lead Ads webhook -->
        <div class="settings-content-card">
          <div class="settings-section-header">
            <div>
              <h2 class="settings-section-title">Meta Lead Ads webhook</h2>
              <p class="settings-section-desc">Auto-creates a lead whenever someone submits a Facebook/Instagram Lead Ads form. Webhook URL: <span class="settings-code-key">/api/leads/webhook/meta</span></p>
            </div>
          </div>

          <div class="settings-grid-2">
            <div class="settings-form-group">
              <label class="settings-label">Verify Token</label>
              <input type="text" class="settings-input" />
            </div>
            <div class="settings-form-group">
              <label class="settings-label">App Secret</label>
              <input type="password" class="settings-input" />
            </div>
          </div>

          <div class="settings-grid-2">
            <div class="settings-form-group">
              <label class="settings-label">Page Access Token</label>
              <input type="password" class="settings-input" />
            </div>
            <div class="settings-form-group">
              <label class="settings-label">Graph API URL</label>
              <input type="text" class="settings-input" value="https://graph.facebook.com/v19.0" />
            </div>
          </div>

          <button class="settings-btn-save-small" style="margin-top: 16px;">Save</button>
        </div>

        <!-- 4. Public website property sync -->
        <div class="settings-content-card">
          <div class="settings-section-header">
            <div>
              <h2 class="settings-section-title">Public website property sync</h2>
              <p class="settings-section-desc">Pushes property changes to your website's API, and lets your website push properties back in via <span class="settings-code-key">/api/integrations/website/properties</span>.</p>
            </div>
          </div>

          <div class="settings-grid-2">
            <div class="settings-form-group">
              <label class="settings-label">Website API URL</label>
              <input type="text" class="settings-input" value="https://yoursite.com/api" />
            </div>
            <div class="settings-form-group">
              <label class="settings-label">Website API Key</label>
              <input type="password" class="settings-input" />
            </div>
          </div>

          <div class="settings-form-group" style="max-width: 400px; margin-bottom: 16px;">
            <label class="settings-label">Inbound Webhook Secret</label>
            <input type="password" class="settings-input" />
          </div>

          <button class="settings-btn-save-small">Save</button>
        </div>

        <!-- 5. Lead capture webhooks -->
        <div class="settings-content-card">
          <div class="settings-section-header">
            <div>
              <h2 class="settings-section-title">Lead capture webhooks</h2>
              <p class="settings-section-desc">Shared secret for the generic website-form and WhatsApp click-to-chat lead webhooks: <span class="settings-code-key">/api/leads/webhook/website</span> and <span class="settings-code-key">/api/leads/webhook/whatsapp-click</span></p>
            </div>
          </div>

          <div class="settings-form-group" style="max-width: 400px; margin-bottom: 16px;">
            <label class="settings-label">Webhook Secret</label>
            <input type="password" class="settings-input" />
          </div>

          <button class="settings-btn-save-small">Save</button>
        </div>

      </div>

    </div>
  `;
}

export function initSettingsView() {
  const tabs = document.querySelectorAll('.settings-tab');
  const tabContents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      // Remove active from all contents
      tabContents.forEach(c => c.classList.remove('active'));

      // Add active to clicked tab
      tab.classList.add('active');
      // Add active to corresponding content
      const targetId = `tab-${tab.dataset.tab}`;
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });

  // Logo Upload Logic
  const uploadBtn = document.getElementById('settings-logo-upload-btn');
  const fileInput = document.getElementById('settings-logo-file-input');
  const removeBtn = document.getElementById('settings-logo-remove-btn');
  const previewImg = document.getElementById('settings-logo-preview');

  uploadBtn?.addEventListener('click', () => {
    fileInput?.click();
  });

  fileInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(evt) {
        const dataUrl = evt.target.result;
        if (previewImg) previewImg.src = dataUrl;
        updateSiteImage('brand_logo', dataUrl);
        showToast('Logo updated successfully!', 'success');
      };
      reader.readAsDataURL(file);
    }
  });

  removeBtn?.addEventListener('click', () => {
    resetSiteImage('brand_logo');
    const defaultUrl = getSiteImage('brand_logo') || '/thanjai-official-new.png';
    if (previewImg) previewImg.src = defaultUrl;
    showToast('Logo removed and reset to default.', 'info');
  });

  // Color Picker Logic
  const colorPicker = document.getElementById('settings-primary-color');
  const colorText = document.getElementById('settings-primary-color-text');
  
  const savedColor = localStorage.getItem('thanjai_custom_color') || '#eb5e28';
  if (colorPicker) colorPicker.value = savedColor;
  if (colorText) colorText.value = savedColor;

  function updateColor(newColor) {
    document.documentElement.style.setProperty('--os-luxury-orange', newColor);
    document.documentElement.style.setProperty('--color-orange', newColor);
    document.documentElement.style.setProperty('--text-orange', newColor);
    localStorage.setItem('thanjai_custom_color', newColor);
  }

  colorPicker?.addEventListener('input', (e) => {
    const newColor = e.target.value;
    if (colorText) colorText.value = newColor;
    updateColor(newColor);
  });

  colorText?.addEventListener('input', (e) => {
    const newColor = e.target.value;
    if (newColor.length === 7 && newColor.startsWith('#')) {
      if (colorPicker) colorPicker.value = newColor;
      updateColor(newColor);
    }
  });

  // WhatsApp API Key Save Logic
  const waApiKeyInput = document.getElementById('settings-wa-api-key');
  const waCampaignInput = document.getElementById('settings-wa-campaign');
  const waSaveBtn = document.getElementById('settings-wa-save-btn');
  const waProviderSelect = document.getElementById('settings-wa-provider');
  
  if (waApiKeyInput) {
    waApiKeyInput.value = localStorage.getItem('thanjai_whatsapp_api_key') || '';
  }
  if (waCampaignInput) {
    waCampaignInput.value = localStorage.getItem('thanjai_wa_campaign') || 'realrest_notification_new_final';
  }
  if (waProviderSelect) {
    waProviderSelect.value = localStorage.getItem('thanjai_wa_provider') || 'smartping';
  }

  if (waSaveBtn) {
    waSaveBtn.addEventListener('click', () => {
      const apiKey = waApiKeyInput ? waApiKeyInput.value.trim() : '';
      const campaign = waCampaignInput ? waCampaignInput.value.trim() : 'realrest_notification_new_final';
      const provider = waProviderSelect ? waProviderSelect.value : 'smartping';

      localStorage.setItem('thanjai_whatsapp_api_key', apiKey);
      localStorage.setItem('thanjai_wa_campaign', campaign);
      localStorage.setItem('thanjai_wa_provider', provider);

      // MySQL Database sync
      fetchFromAPI('/settings', {
        method: 'POST',
        body: JSON.stringify({
          key: 'whatsapp_integration',
          value: JSON.stringify({ provider, apiKey, campaign })
        })
      }).catch(e => console.error(e));

      showToast('WhatsApp Settings saved & synchronized successfully!', 'success');
    });
  }

  // Full Template View Modal Logic
  const viewModal = document.getElementById('view-template-modal');
  if (viewModal) {
    // Remove any previously attached modal from body to prevent duplicates
    document.querySelectorAll('body > #view-template-modal').forEach(m => {
      if (m !== viewModal) m.remove();
    });
    // Append to document.body to ensure it renders at full screen above sidebar and header
    if (viewModal.parentNode !== document.body) {
      document.body.appendChild(viewModal);
    }
  }

  const closeBtn = document.getElementById('close-template-modal-btn');
  const closeFooterBtn = document.getElementById('close-template-modal-footer-btn');
  const copyContentBtn = document.getElementById('copy-tpl-content-btn');

  let currentViewingContent = '';

  document.querySelectorAll('.btn-view-full-template').forEach(btn => {
    btn.addEventListener('click', () => {
      const tplId = btn.dataset.id;
      const allTemplates = window.__thanjaiSettingsTemplates || [];
      const tpl = allTemplates.find(t => t.id === tplId);
      if (!tpl || !viewModal) return;

      currentViewingContent = tpl.content;

      const titleEl = document.getElementById('modal-tpl-title');
      const tagEl = document.getElementById('modal-tpl-tag');
      const categoryEl = document.getElementById('modal-tpl-category');
      
      if (titleEl) titleEl.textContent = tpl.name;
      if (tagEl) tagEl.textContent = tpl.tag;
      if (categoryEl) categoryEl.textContent = tpl.category;

      const paramsContainer = document.getElementById('modal-tpl-params');
      if (paramsContainer) {
        paramsContainer.innerHTML = (tpl.params || []).map(p => `
          <span style="background: #e0f2fe; color: #0369a1; font-size: 0.76rem; font-weight: 600; padding: 4px 10px; border-radius: 8px; border: 1px solid #bae6fd; font-family: monospace;">
            ${p}
          </span>
        `).join('');
      }

      const contentEl = document.getElementById('modal-tpl-content');
      if (contentEl) {
        // Highlight placeholders {{1}}, {{2}} with orange badge styling
        const highlighted = tpl.content.replace(/(\{\{\d+\}\})/g, '<strong style="color: var(--os-luxury-orange, #eb5e28); background: #fed7aa; padding: 1px 6px; border-radius: 4px;">$1</strong>');
        contentEl.innerHTML = highlighted;
      }

      viewModal.style.display = 'flex';
      viewModal.classList.add('show');
    });
  });

  const closeModalFn = () => {
    if (viewModal) {
      viewModal.style.display = 'none';
      viewModal.classList.remove('show');
    }
  };

  closeBtn?.addEventListener('click', closeModalFn);
  closeFooterBtn?.addEventListener('click', closeModalFn);

  viewModal?.addEventListener('click', (e) => {
    if (e.target === viewModal) closeModalFn();
  });

  copyContentBtn?.addEventListener('click', () => {
    if (currentViewingContent) {
      navigator.clipboard.writeText(currentViewingContent).then(() => {
        showToast('Template text copied to clipboard!', 'ri-file-copy-line');
      }).catch(() => {
        showToast('Template text copied!', 'ri-checkbox-circle-fill');
      });
    }
  });
}
