import { getSiteImage, updateSiteImage, resetSiteImage } from '../utils/siteImagesStore.js';
import { showToast } from '../utils/toast.js';

export function renderSettingsView() {
  const templates = [
    {
      name: 'Bank loan assistance (auto)',
      tag: 'bank_loan_assist',
      preview: 'Hi {{name}}, we\'re now at the loan/financing stage. {{agent}} can help coordinate with the bank and paperwork — let us know if you need any assistance!',
      isActive: true
    },
    {
      name: 'Follow-up message',
      tag: 'follow_up',
      preview: 'Hi {{name}}, just following up on the properties I shared earlier. Did any of them catch your eye? Happy to arrange a viewing. — {{agent}}',
      isActive: true
    },
    {
      name: 'Initial contact intro (auto)',
      tag: 'initial_contact_intro',
      preview: 'Hi {{name}}! 👋 I\'m {{agent}} from Thanjai Property, following up on your enquiry. I\'d love to understand your requirements better — what are you looking for?',
      isActive: true
    },
    {
      name: 'Negotiation check-in (auto)',
      tag: 'negotiation_update',
      preview: 'Hi {{name}}, let\'s finalize the best terms for your new property. {{agent}} is ready to discuss pricing and next steps whenever you are!',
      isActive: true
    },
    {
      name: 'Partner transfer notification',
      tag: 'partner_transfer',
      preview: 'Hi {{name}}, to serve you better we\'ve connected you with our specialist partner team. They will contact you shortly with tailored options. — {{agent}}',
      isActive: true
    },
    {
      name: 'Property shortlist',
      tag: 'property_shortlist',
      preview: 'Hi {{name}}, based on your requirements here are some properties I think you\'ll love:\\n...',
      isActive: true
    },
    {
      name: 'Registration testimonial & referral (auto)',
      tag: 'registration_testimonial',
      preview: 'Congratulations {{name}} on your new home! 🎉 We\'d be grateful for a short testimonial, and if you know anyone else house-hunting, we\'d love an introduction. — {{agent}}',
      isActive: true
    },
    {
      name: 'Site visit confirmation (auto)',
      tag: 'site_visit_before',
      preview: 'Hi {{name}}! 👋 Confirming your site visit scheduled for {{time}}. {{agent}} will meet you there — see you soon!',
      isActive: true
    },
    {
      name: 'Site visit feedback request (auto)',
      tag: 'site_visit_feedback',
      preview: 'Hi {{name}}, thanks for visiting the property today! We\'d love your feedback — what did you think, and are you considering it further? — {{agent}}',
      isActive: true
    },
    {
      name: 'Site visit reminder',
      tag: 'site_visit_reminder',
      preview: 'Hi {{name}}, a gentle reminder about your upcoming site visit. Please let me know if you need to reschedule. — {{agent}}',
      isActive: true
    },
    {
      name: 'Welcome message',
      tag: 'welcome',
      preview: 'Hi {{name}}! 👋 Thank you for your interest. I\'m {{agent}} from Thanjai Property. I\'ll help you find the right property for your requirements. When is a good time to talk?',
      isActive: true
    }
  ];

  const templatesHTML = templates.map(t => `
    <div class="template-card">
      <div class="template-info">
        <div class="template-header">
          <span class="template-name">${t.name}</span>
          <span class="template-tag-key">${t.tag}</span>
          ${t.isActive ? '<span class="template-tag-active">ACTIVE</span>' : ''}
        </div>
        <p class="template-preview">${t.preview}</p>
      </div>
      <div class="template-action">
        <button class="settings-btn-edit">Edit</button>
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
            <h2 class="settings-section-title">WhatsApp templates</h2>
            <p class="settings-section-desc">
              Client templates use <span class="settings-code-key">{{name}}</span>, <span class="settings-code-key">{{agent}}</span>, <span class="settings-code-key">{{properties}}</span>, <span class="settings-code-key">{{time}}</span>. Keys <span class="settings-code-key">initial_contact_intro</span>, <span class="settings-code-key">follow_up</span>, <span class="settings-code-key">site_visit_before</span>, <span class="settings-code-key">site_visit_feedback</span>, <span class="settings-code-key">negotiation_update</span>, <span class="settings-code-key">bank_loan_assist</span>, and <span class="settings-code-key">registration_testimonial</span> fire automatically on lead stage changes. Vendor templates use <span class="settings-code-key">{{vendor_name}}</span>, <span class="settings-code-key">{{location}}</span>, <span class="settings-code-key">{{property_type}}</span>, <span class="settings-code-key">{{budget}}</span>, <span class="settings-code-key">{{size}}</span>, <span class="settings-code-key">{{date}}</span>, <span class="settings-code-key">{{time}}</span>. Keys <span class="settings-code-key">vendor_property_request</span>, <span class="settings-code-key">vendor_more_details</span>, <span class="settings-code-key">vendor_shortlisted</span>, <span class="settings-code-key">vendor_site_visit</span>, <span class="settings-code-key">vendor_negotiation</span>, and <span class="settings-code-key">vendor_thank_you</span> fire automatically on vendor stage changes; <span class="settings-code-key">vendor_availability</span> is manual-only. Partner templates use <span class="settings-code-key">{{partner_name}}</span>, <span class="settings-code-key">{{lead_name}}</span>, <span class="settings-code-key">{{location}}</span>, <span class="settings-code-key">{{property_type}}</span>, <span class="settings-code-key">{{budget}}</span>, <span class="settings-code-key">{{notes}}</span>, <span class="settings-code-key">{{properties}}</span>, <span class="settings-code-key">{{brand}}</span>, <span class="settings-code-key">{{agent}}</span>. Only the key <span class="settings-code-key">partner_referral</span> is used — it fires when a lead is shared to a partner company with "Send WhatsApp" checked; without one, a built-in default message is sent instead.
            </p>
          </div>
          <div class="settings-actions">
            <button class="settings-btn-outline"><i class="ri-download-2-line"></i> Export CSV</button>
            <button class="settings-btn-primary">+ New template</button>
          </div>
        </div>

        <div class="template-group-title">CLIENT TEMPLATES</div>
        
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
              <h2 class="settings-section-title">WhatsApp provider</h2>
              <p class="settings-section-desc">How outbound WhatsApp messages (property shares, stage automations) are actually sent.</p>
            </div>
          </div>
          
          <div class="settings-form-group" style="max-width: 400px;">
            <label class="settings-label">Provider</label>
            <select class="settings-input">
              <option value="smartping">SmartPing</option>
              <option value="aisensy">AiSensy</option>
            </select>
          </div>

          <div class="settings-grid-2">
            <div class="settings-form-group">
              <label class="settings-label">API Key</label>
              <input type="password" class="settings-input" value="••••••••••••" />
            </div>
            <div class="settings-form-group">
              <label class="settings-label">Campaign Name (Live, not the template name)</label>
              <input type="text" class="settings-input" value="realrest_notification_new_final" />
            </div>
          </div>

          <p class="settings-section-desc" style="margin: 16px 0;">
            Delivery-status webhook — lets "Sent" update to Delivered/Read/Failed once the provider confirms it, instead of staying "Sent" forever. URL: <span class="settings-code-key">/api/whatsapp/webhook/status</span>. Meta Cloud API verifies itself via the App Secret above; other providers (SmartPing/AiSensy, MSG91) need this secret pasted into their dashboard's webhook config as an <span class="settings-code-key">X-Webhook-Secret</span> header.
          </p>

          <div class="settings-form-group" style="max-width: 400px; margin-bottom: 16px;">
            <label class="settings-label">Status Webhook Secret</label>
            <input type="password" class="settings-input" value="••••••••••••" />
          </div>

          <button class="settings-btn-save-small">Save</button>
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
}
