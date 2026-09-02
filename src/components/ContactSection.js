import { getSiteImage } from '../utils/siteImagesStore.js';
import { fetchFromAPI } from '../utils/api.js';

export function renderContactSection() {
  const contactBg = getSiteImage('contact_bg');

  return `
    <section class="contact-section" id="contact" style="background: #FAF6F0; padding-bottom: 80px;">

      <!-- ═══════════════════════════════════════════════════════════════ -->
      <!-- BREADCRUMB & PAGE HERO HEADER                                   -->
      <!-- ═══════════════════════════════════════════════════════════════ -->
      <div style="background: #2A1808; color: #FFFFFF; padding: 48px 0 40px; position: relative; overflow: hidden; margin-bottom: 40px;">
        <div style="position: absolute; inset: 0; opacity: 0.15; background-image: radial-gradient(#eb5e28 1px, transparent 1px); background-size: 24px 24px;"></div>
        <div class="container" style="position: relative; z-index: 2;">
          <div style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.15em; color: var(--color-orange, #eb5e28); margin-bottom: 10px; font-weight: 800;">
            CONTACT US
          </div>
          <h1 style="font-family: var(--font-serif, 'DM Serif Display', serif); font-size: clamp(2.2rem, 4vw, 3.2rem); font-weight: 400; line-height: 1.15; margin-bottom: 12px;">
            Get in Touch With Thanjai Property
          </h1>
          <p style="font-size: 1.05rem; color: rgba(255,255,255,0.85); max-width: 720px; line-height: 1.65;">
            Whether you are searching for a residential house, plot, agricultural land or commercial space, or looking to sell your property, our team is ready to assist you. Reach out to us with your requirements or inquiries.
          </p>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════════════ -->
      <!-- SECTION 1 — HERO INQUIRY FORM + OFFICIAL OFFICE & TEAM PANEL   -->
      <!-- ═══════════════════════════════════════════════════════════════ -->
      <div class="contact-body" id="contact-form-area">
        <div class="container">
          <div class="contact-body-grid">

            <!-- LEFT: Editorial Property Brief Form -->
            <div class="contact-form-col" id="contact-form-col">

              <div class="contact-form-editorial-header" style="margin-bottom: 24px;">
                <span class="contact-form-step-label" style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.12em; color: #eb5e28; font-weight: 700; display: block; margin-bottom: 6px;">
                  01 — YOUR PROPERTY BRIEF
                </span>
                <h2 class="contact-form-heading" style="font-family: var(--font-serif, 'DM Serif Display', serif); font-size: clamp(1.5rem, 3vw, 1.8rem); color: #1a1a1a; margin-bottom: 8px;">
                  Tell us what you're looking for.
                </h2>
                <p class="contact-form-subtext" style="font-size: 0.92rem; color: #666;">
                  Share your requirements and our local specialists will curate handpicked verified properties for you.
                </p>
              </div>

              <form class="contact-form" id="contact-form" novalidate style="display: flex; flex-direction: column; gap: 20px;">

                <!-- Row 1: Name & Phone -->
                <div class="cf-row">
                  <div class="cf-field">
                    <label class="cf-label" for="cf-name" style="font-size: 0.82rem; font-weight: 700; color: #333; display: block; margin-bottom: 6px;">Full Name *</label>
                    <div class="cf-input-wrap" style="position: relative;">
                      <i class="ri-user-3-line cf-icon" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #888;"></i>
                      <input type="text" id="cf-name" name="name" class="cf-input" placeholder="Your full name" required style="width: 100%; padding: 12px 14px 12px 42px; border-radius: 10px; border: 1px solid #d1d5db; font-size: 0.92rem; box-sizing: border-box;" />
                    </div>
                  </div>
                  <div class="cf-field">
                    <label class="cf-label" for="cf-phone" style="font-size: 0.82rem; font-weight: 700; color: #333; display: block; margin-bottom: 6px;">Phone / WhatsApp *</label>
                    <div class="cf-input-wrap" style="position: relative;">
                      <i class="ri-phone-line cf-icon" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #888;"></i>
                      <input type="tel" id="cf-phone" name="phone" class="cf-input" placeholder="e.g. 9578311506" required maxlength="10" pattern="[0-9]{10}" style="width: 100%; padding: 12px 14px 12px 42px; border-radius: 10px; border: 1px solid #d1d5db; font-size: 0.92rem; box-sizing: border-box;" oninput="this.value = this.value.replace(/[^0-9]/g, '')" />
                    </div>
                  </div>
                </div>

                <!-- Row 2: Email & Property Interest -->
                <div class="cf-row">
                  <div class="cf-field">
                    <label class="cf-label" for="cf-email" style="font-size: 0.82rem; font-weight: 700; color: #333; display: block; margin-bottom: 6px;">Email Address</label>
                    <div class="cf-input-wrap" style="position: relative;">
                      <i class="ri-mail-line cf-icon" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #888;"></i>
                      <input type="email" id="cf-email" name="email" class="cf-input" placeholder="you@example.com" style="width: 100%; padding: 12px 14px 12px 42px; border-radius: 10px; border: 1px solid #d1d5db; font-size: 0.92rem; box-sizing: border-box;" />
                    </div>
                  </div>
                  <div class="cf-field" style="position: relative; z-index: 10;">
                    <label class="cf-label" for="cf-interest" style="font-size: 0.82rem; font-weight: 700; color: #333; display: block; margin-bottom: 6px;">Property Purpose / Type</label>
                    <div class="custom-select-wrapper" id="custom-property-type" style="position: relative;">
                      <input type="hidden" name="interest" id="cf-interest" value="">
                      <div class="cf-input cf-input-wrap custom-select-trigger" id="custom-select-trigger" style="width: 100%; padding: 12px 14px 12px 42px; border-radius: 10px; border: 1px solid #d1d5db; font-size: 0.92rem; background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: space-between; box-sizing: border-box;">
                        <i class="ri-home-4-line cf-icon" style="position: absolute; left: 14px; color: #888;"></i>
                        <span class="custom-select-text" id="custom-select-text" style="color: #666;">Select requirement</span>
                        <i class="ri-arrow-down-s-line cf-select-arrow" style="color: #888;"></i>
                      </div>
                      <div class="custom-select-options" style="display: none; position: absolute; top: 100%; left: 0; right: 0; background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; box-shadow: 0 10px 25px rgba(0,0,0,0.15); z-index: 50; margin-top: 4px; overflow: hidden;">
                        <div class="custom-option" data-value="villa" style="padding: 10px 16px; cursor: pointer; font-size: 0.9rem;" onmouseenter="this.style.background='#f7fafc'" onmouseleave="this.style.background='transparent'">Luxury Villa</div>
                        <div class="custom-option" data-value="apartment" style="padding: 10px 16px; cursor: pointer; font-size: 0.9rem;" onmouseenter="this.style.background='#f7fafc'" onmouseleave="this.style.background='transparent'">Apartment / Flat</div>
                        <div class="custom-option" data-value="plot" style="padding: 10px 16px; cursor: pointer; font-size: 0.9rem;" onmouseenter="this.style.background='#f7fafc'" onmouseleave="this.style.background='transparent'">Residential Plot (DTCP / RERA)</div>
                        <div class="custom-option" data-value="farm" style="padding: 10px 16px; cursor: pointer; font-size: 0.9rem;" onmouseenter="this.style.background='#f7fafc'" onmouseleave="this.style.background='transparent'">Agricultural Farmland</div>
                        <div class="custom-option" data-value="commercial" style="padding: 10px 16px; cursor: pointer; font-size: 0.9rem;" onmouseenter="this.style.background='#f7fafc'" onmouseleave="this.style.background='transparent'">Commercial Space / Land</div>
                        <div class="custom-option" data-value="sell" style="padding: 10px 16px; cursor: pointer; font-size: 0.9rem;" onmouseenter="this.style.background='#f7fafc'" onmouseleave="this.style.background='transparent'">Post Property to Sell / Rent</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Location -->
                <div class="cf-field">
                  <label class="cf-label" for="cf-location" style="font-size: 0.82rem; font-weight: 700; color: #333; display: block; margin-bottom: 6px;">Preferred District / Location</label>
                  <div class="cf-input-wrap" style="position: relative;">
                    <i class="ri-map-pin-2-line cf-icon" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #888;"></i>
                    <input type="text" id="cf-location" name="location" class="cf-input" placeholder="e.g. Thanjavur, Kumbakonam, Trichy, Chennai..." style="width: 100%; padding: 12px 14px 12px 42px; border-radius: 10px; border: 1px solid #d1d5db; font-size: 0.92rem; box-sizing: border-box;" />
                  </div>
                </div>

                <!-- Budget Pills -->
                <div class="cf-field">
                  <label class="cf-label" style="font-size: 0.82rem; font-weight: 700; color: #333; display: block; margin-bottom: 6px;">Target Budget Range</label>
                  <div class="cf-budget-pills" id="cf-budget-pills" style="display: flex; gap: 8px; flex-wrap: wrap;">
                    <button type="button" class="cf-budget-pill" data-value="under-50l" style="padding: 8px 14px; border-radius: 20px; border: 1px solid #d1d5db; background: #fff; font-size: 0.82rem; font-weight: 600; cursor: pointer;">Under ₹50L</button>
                    <button type="button" class="cf-budget-pill" data-value="50l-1cr" style="padding: 8px 14px; border-radius: 20px; border: 1px solid #d1d5db; background: #fff; font-size: 0.82rem; font-weight: 600; cursor: pointer;">₹50L – ₹1Cr</button>
                    <button type="button" class="cf-budget-pill" data-value="1cr-3cr" style="padding: 8px 14px; border-radius: 20px; border: 1px solid #d1d5db; background: #fff; font-size: 0.82rem; font-weight: 600; cursor: pointer;">₹1Cr – ₹3Cr</button>
                    <button type="button" class="cf-budget-pill" data-value="above-3cr" style="padding: 8px 14px; border-radius: 20px; border: 1px solid #d1d5db; background: #fff; font-size: 0.82rem; font-weight: 600; cursor: pointer;">Above ₹3Cr</button>
                  </div>
                  <input type="hidden" id="cf-budget" name="budget" value="" />
                </div>

                <!-- Message Textarea -->
                <div class="cf-field">
                  <label class="cf-label" for="cf-message" style="font-size: 0.82rem; font-weight: 700; color: #333; display: block; margin-bottom: 6px;">Your Message / Specific Requirements</label>
                  <div class="cf-input-wrap cf-textarea-wrap" style="position: relative;">
                    <i class="ri-chat-3-line cf-icon" style="position: absolute; left: 14px; top: 14px; color: #888;"></i>
                    <textarea id="cf-message" name="message" class="cf-input cf-textarea" placeholder="Provide any details regarding preferred land size, road width, legal verification..." rows="4" style="width: 100%; padding: 12px 14px 12px 42px; border-radius: 10px; border: 1px solid #d1d5db; font-size: 0.92rem; font-family: inherit; box-sizing: border-box;"></textarea>
                  </div>
                </div>

                <!-- Submit Button -->
                <button type="submit" class="cf-submit" id="cf-submit-btn" style="background: var(--color-orange, #eb5e28); color: #fff; padding: 14px 28px; border-radius: 12px; border: none; font-size: 0.95rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 8px 20px rgba(235,94,40,0.25); transition: all 0.2s ease;">
                  <span class="cf-submit-text">Send Property Brief</span>
                  <i class="ri-arrow-right-line cf-submit-arrow"></i>
                </button>

                <!-- Success Alert -->
                <div class="cf-success" id="cf-success" style="display:none; background: #f0fff4; border: 1px solid #c6f6d5; padding: 14px; border-radius: 10px; align-items: center; gap: 12px;">
                  <i class="ri-checkbox-circle-fill" style="color: #38a169; font-size: 1.4rem; flex-shrink: 0;"></i>
                  <div>
                    <strong style="color: #22543d; font-size: 0.9rem;">Brief Received Successfully!</strong>
                    <p style="color: #2f855a; font-size: 0.82rem; margin-top: 2px;">Our senior property specialist will contact you within 24 hours.</p>
                  </div>
                </div>

              </form>
            </div>

            <!-- RIGHT: Official Office & Executive Team Panel -->
            <div class="contact-panel-col" id="contact-panel-col">
              <div class="contact-dark-panel">

                <span style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--color-orange, #eb5e28); font-weight: 700; display: block; margin-bottom: 6px;">
                  02 — DIRECT OFFICE & TEAM CONTACTS
                </span>
                <h3 class="contact-panel-heading" style="font-family: var(--font-serif, 'DM Serif Display', serif); font-size: 1.6rem; margin-bottom: 6px; color: #fff;">
                  Speak With Our Executive Desk
                </h3>
                <p class="contact-panel-subtext" style="font-size: 0.88rem; color: rgba(255,255,255,0.7); margin-bottom: 20px;">
                  Direct office address, executive phone support, and instant WhatsApp advisory.
                </p>

                <div style="height: 1px; background: rgba(255,255,255,0.1); margin-bottom: 20px;"></div>

                <!-- Office Address Card -->
                <div style="display: flex; gap: 14px; margin-bottom: 20px;">
                  <div style="width: 40px; height: 40px; border-radius: 10px; background: rgba(235,94,40,0.15); color: #eb5e28; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0;">
                    <i class="ri-map-pin-2-fill"></i>
                  </div>
                  <div>
                    <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; color: rgba(255,255,255,0.5); font-weight: 700; margin-bottom: 4px;">OFFICE ADDRESS</div>
                    <div style="font-size: 0.9rem; line-height: 1.4; color: #fff; font-weight: 600;">
                      Thanjai Property<br>
                      Flat No B1, 2nd Floor, Sivasakthi Apartment,<br>
                      Raja Nagar, Behind HDFC Bank,<br>
                      Near New Bus Stand, Thanjavur – 613005
                    </div>
                  </div>
                </div>

                <div style="height: 1px; background: rgba(255,255,255,0.1); margin-bottom: 20px;"></div>

                <!-- Key Executive Support Desk -->
                <div style="margin-bottom: 20px;">
                  <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; color: rgba(255,255,255,0.5); font-weight: 700; margin-bottom: 12px;">
                    EXECUTIVE LEADERSHIP & HELP DESK
                  </div>

                  <div style="display: flex; flex-direction: column; gap: 12px;">
                    <!-- S. Vijayaraghavan: Managing Director -->
                    <div style="background: rgba(235,94,40,0.1); padding: 14px; border-radius: 14px; border: 1px solid rgba(235,94,40,0.3); display: flex; flex-direction: column; gap: 10px; max-width: 100%; box-sizing: border-box; overflow: hidden;">
                      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
                        <div>
                          <strong style="font-size: 1rem; color: #fff; display: block;">S. Vijayaraghavan</strong>
                          <span style="font-size: 0.78rem; color: #eb5e28; font-weight: 700;">Managing Director</span>
                        </div>
                        <a href="tel:+919578311506" style="background: #eb5e28; color: #fff; padding: 6px 12px; border-radius: 8px; font-size: 0.8rem; font-weight: 700; text-decoration: none; display: flex; align-items: center; gap: 4px; flex-shrink: 0;">
                          <i class="ri-phone-line"></i> +91 95783 11506
                        </a>
                      </div>

                      <!-- Priority Founder Email Box -->
                      <div style="background: rgba(0,0,0,0.3); padding: 10px 12px; border-radius: 8px; display: flex; align-items: center; justify-content: space-between; border: 1px solid rgba(235,94,40,0.2); flex-wrap: wrap; gap: 8px; max-width: 100%; box-sizing: border-box;">
                        <div style="display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1 1 180px;">
                          <i class="ri-mail-star-line" style="color: #eb5e28; font-size: 1.1rem; flex-shrink: 0;"></i>
                          <div style="min-width: 0; overflow: hidden;">
                            <span style="font-size: 0.65rem; color: rgba(255,255,255,0.6); text-transform: uppercase; font-weight: 800; display: block;">DIRECT SUPPORT EMAIL</span>
                            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=vijayaraghavan@thanjaiproperty.com" target="_blank" style="color: #fff; font-size: 0.8rem; font-weight: 700; text-decoration: none; word-break: break-all; overflow-wrap: anywhere; display: block;">
                              vijayaraghavan@thanjaiproperty.com
                            </a>
                          </div>
                        </div>
                        <a href="https://mail.google.com/mail/?view=cm&fs=1&to=vijayaraghavan@thanjaiproperty.com" target="_blank" style="background: rgba(255,255,255,0.15); color: #fff; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; text-decoration: none; flex-shrink: 0;">
                          Email
                        </a>
                      </div>
                    </div>

                    <!-- Radhakrishnan: Co-Partner -->
                    <div style="background: rgba(255,255,255,0.05); padding: 14px; border-radius: 14px; display: flex; align-items: center; justify-content: space-between; border: 1px solid rgba(255,255,255,0.08); flex-wrap: wrap; gap: 8px;">
                      <div>
                        <strong style="font-size: 0.95rem; color: #fff; display: block;">Radhakrishnan</strong>
                        <span style="font-size: 0.78rem; color: #38a169; font-weight: 700;">Co-Partner</span>
                      </div>
                      <a href="tel:+919585777772" style="background: rgba(255,255,255,0.15); color: #fff; padding: 6px 12px; border-radius: 8px; font-size: 0.8rem; font-weight: 700; text-decoration: none; display: flex; align-items: center; gap: 4px; flex-shrink: 0;">
                        <i class="ri-phone-line"></i> +91 95857 77772
                      </a>
                    </div>

                    <!-- Admin Desk -->
                    <div style="background: rgba(255,255,255,0.05); padding: 14px; border-radius: 14px; display: flex; align-items: center; justify-content: space-between; border: 1px solid rgba(255,255,255,0.08); flex-wrap: wrap; gap: 8px;">
                      <div>
                        <strong style="font-size: 0.95rem; color: #fff; display: block;">Admin</strong>
                        <span style="font-size: 0.78rem; color: rgba(255,255,255,0.6); font-weight: 700;">Admin</span>
                      </div>
                      <a href="tel:+919585598263" style="background: rgba(255,255,255,0.15); color: #fff; padding: 6px 12px; border-radius: 8px; font-size: 0.8rem; font-weight: 700; text-decoration: none; display: flex; align-items: center; gap: 4px; flex-shrink: 0;">
                        <i class="ri-phone-line"></i> +91 95855 98263
                      </a>
                    </div>
                  </div>
                </div>

                <!-- Direct WhatsApp Chat Button -->
                <a href="https://wa.me/919578311506?text=Hi%20Thanjai%20Property,%20I%20want%20to%20enquire%20about%20properties%20in%20Tamil%20Nadu" target="_blank" style="background: #25D366; color: #fff; padding: 14px 20px; border-radius: 12px; font-size: 0.95rem; font-weight: 700; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 8px 20px rgba(37,211,102,0.3); margin-bottom: 16px;">
                  <i class="ri-whatsapp-line" style="font-size: 1.3rem;"></i>
                  <span>Chat with WhatsApp Support</span>
                </a>

                <!-- Hours -->
                <div style="font-size: 0.8rem; color: rgba(255,255,255,0.6); text-align: center;">
                  <i class="ri-time-line" style="color: #eb5e28;"></i> Working Hours: Mon – Sun: 9:00 AM – 7:00 PM (Appointments Preferred)
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════════════ -->
      <!-- SECTION 2 — OFFICIAL BANKING & TRUST VERIFICATION CREDENTIALS  -->
      <!-- ═══════════════════════════════════════════════════════════════ -->
      <div style="margin-top: 56px;">
        <div class="container">
          <div style="margin-bottom: 28px;">
            <span style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.12em; color: #eb5e28; font-weight: 700; display: block; margin-bottom: 6px;">
              03 — OFFICIAL BANK & PAYMENT DETAILS
            </span>
            <h2 style="font-family: var(--font-serif, 'DM Serif Display', serif); font-size: 2rem; color: #1a1a1a; margin-bottom: 6px;">
              Official Bank Accounts & Digital Pay
            </h2>
            <p style="font-size: 0.92rem; color: #666; max-width: 640px;">
              Verified accounts for booking token payments, legal Patta verification fees, and official property escrow deposits.
            </p>
          </div>

          <!-- Straight Line 4-Column Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; align-items: stretch;">

            <!-- GPay / PhonePe Instant Card -->
            <div style="background: linear-gradient(135deg, #1a1a1a, #2D2721); color: #fff; border-radius: 16px; padding: 24px; box-shadow: 0 8px 24px rgba(0,0,0,0.08); border: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <i class="ri-qr-code-line" style="font-size: 1.4rem; color: #eb5e28;"></i>
                    <strong style="font-size: 0.95rem; color: #fff;">Online / GPay / PhonePe</strong>
                  </div>
                  <span style="background: rgba(235,94,40,0.2); color: #eb5e28; font-size: 0.68rem; padding: 3px 8px; border-radius: 6px; font-weight: 800;">INSTANT</span>
                </div>
                <div style="font-size: 0.8rem; color: rgba(255,255,255,0.7); margin-bottom: 8px;">GPay & PhonePe Number:</div>
                <div style="background: rgba(255,255,255,0.08); padding: 12px 14px; border-radius: 10px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                  <span style="font-size: 1.1rem; font-weight: 800; letter-spacing: 0.05em; color: #fff;">9578311506</span>
                  <button class="copy-bank-btn" data-text="9578311506" style="background: #eb5e28; border: none; color: #fff; padding: 6px 12px; border-radius: 6px; font-size: 0.78rem; font-weight: 700; cursor: pointer;">
                    Copy
                  </button>
                </div>
              </div>
              <div style="font-size: 0.75rem; color: rgba(255,255,255,0.5); padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.1);">
                A/C Holder: <strong>S. Vijayaraghavan</strong>
              </div>
            </div>

            <!-- Union Bank of India Card -->
            <div style="background: #ffffff; border: 1px solid #E7E0D8; border-radius: 16px; padding: 24px; box-shadow: 0 4px 16px rgba(0,0,0,0.02); display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                  <strong style="font-size: 0.95rem; color: #1a1a1a; display: flex; align-items: center; gap: 8px;">
                    <i class="ri-bank-line" style="color: #0056b3;"></i> Union Bank of India
                  </strong>
                  <span style="font-size: 0.72rem; color: #777;">Cauvery Nagar</span>
                </div>
                <div style="font-size: 0.82rem; color: #555; display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px;">
                  <div>Account Name: <strong>Thanjai Property</strong></div>
                  <div>Account No: <strong style="color: #1a1a1a;">510101000770751</strong></div>
                  <div>RTGS / IFSC: <strong style="color: #eb5e28;">UBIN0903728</strong></div>
                </div>
              </div>
              <div style="display: flex; gap: 8px; padding-top: 10px; border-top: 1px solid #f0f4f8;">
                <button class="copy-bank-btn" data-text="510101000770751" style="flex: 1; background: #f0f4f8; border: 1px solid #cbd5e0; padding: 8px; border-radius: 8px; font-size: 0.75rem; font-weight: 700; cursor: pointer;">
                  Copy A/C No
                </button>
                <button class="copy-bank-btn" data-text="UBIN0903728" style="flex: 1; background: #f0f4f8; border: 1px solid #cbd5e0; padding: 8px; border-radius: 8px; font-size: 0.75rem; font-weight: 700; cursor: pointer;">
                  Copy IFSC
                </button>
              </div>
            </div>

            <!-- State Bank of India (SBI) Card -->
            <div style="background: #ffffff; border: 1px solid #E7E0D8; border-radius: 16px; padding: 24px; box-shadow: 0 4px 16px rgba(0,0,0,0.02); display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                  <strong style="font-size: 0.95rem; color: #1a1a1a; display: flex; align-items: center; gap: 8px;">
                    <i class="ri-bank-line" style="color: #28a745;"></i> State Bank of India
                  </strong>
                  <span style="font-size: 0.72rem; color: #777;">Karanthattangudi</span>
                </div>
                <div style="font-size: 0.82rem; color: #555; display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px;">
                  <div>Account Name: <strong>Thanjai Property</strong></div>
                  <div>Account No: <strong style="color: #1a1a1a;">32946233761</strong></div>
                  <div>RTGS / IFSC: <strong style="color: #eb5e28;">SBIN0008178</strong></div>
                </div>
              </div>
              <div style="display: flex; gap: 8px; padding-top: 10px; border-top: 1px solid #f0f4f8;">
                <button class="copy-bank-btn" data-text="32946233761" style="flex: 1; background: #f0f4f8; border: 1px solid #cbd5e0; padding: 8px; border-radius: 8px; font-size: 0.75rem; font-weight: 700; cursor: pointer;">
                  Copy A/C No
                </button>
                <button class="copy-bank-btn" data-text="SBIN0008178" style="flex: 1; background: #f0f4f8; border: 1px solid #cbd5e0; padding: 8px; border-radius: 8px; font-size: 0.75rem; font-weight: 700; cursor: pointer;">
                  Copy IFSC
                </button>
              </div>
            </div>

            <!-- HDFC Bank Card -->
            <div style="background: #ffffff; border: 1px solid #E7E0D8; border-radius: 16px; padding: 24px; box-shadow: 0 4px 16px rgba(0,0,0,0.02); display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                  <strong style="font-size: 0.95rem; color: #1a1a1a; display: flex; align-items: center; gap: 8px;">
                    <i class="ri-bank-line" style="color: #dc3545;"></i> HDFC Bank
                  </strong>
                  <span style="font-size: 0.72rem; color: #777;">New Bus Stand</span>
                </div>
                <div style="font-size: 0.82rem; color: #555; display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px;">
                  <div>Account Name: <strong>Thanjai Property</strong></div>
                  <div>Account No: <strong style="color: #1a1a1a;">50200062317303</strong></div>
                  <div>RTGS / IFSC: <strong style="color: #eb5e28;">HDFC0009164</strong></div>
                </div>
              </div>
              <div style="display: flex; gap: 8px; padding-top: 10px; border-top: 1px solid #f0f4f8;">
                <button class="copy-bank-btn" data-text="50200062317303" style="flex: 1; background: #f0f4f8; border: 1px solid #cbd5e0; padding: 8px; border-radius: 8px; font-size: 0.75rem; font-weight: 700; cursor: pointer;">
                  Copy A/C No
                </button>
                <button class="copy-bank-btn" data-text="HDFC0009164" style="flex: 1; background: #f0f4f8; border: 1px solid #cbd5e0; padding: 8px; border-radius: 8px; font-size: 0.75rem; font-weight: 700; cursor: pointer;">
                  Copy IFSC
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════════════ -->
      <!-- SECTION 3 — PREMIER INTERACTIVE MAP LOCATION SECTION             -->
      <!-- ═══════════════════════════════════════════════════════════════ -->
      <div style="margin-top: 56px;">
        <div class="container">
          <div style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px;">
            <div>
              <span style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.12em; color: #eb5e28; font-weight: 700; display: block; margin-bottom: 6px;">
                04 — VISIT OUR THANJAVUR HEADQUARTERS
              </span>
              <h2 style="font-family: var(--font-serif, 'DM Serif Display', serif); font-size: 2rem; color: #1a1a1a; margin-bottom: 4px;">
                📍 Our Location
              </h2>
              <p style="font-size: 0.92rem; color: #666;">
                Sivasakthi Apartment, Raja Nagar, Behind HDFC Bank, Near New Bus Stand, Thanjavur – 613005
              </p>
            </div>

            <a href="https://maps.google.com/?q=Sivasakthi+Apartment+Raja+Nagar+Thanjavur+613005" target="_blank" style="background: #1a1a1a; color: #fff; padding: 12px 24px; border-radius: 12px; font-size: 0.88rem; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 14px rgba(0,0,0,0.15);">
              <i class="ri-navigation-fill" style="color: #eb5e28;"></i> Get Directions on Map
            </a>
          </div>

          <!-- Premier Interactive Location Map Frame -->
          <div style="background: #ffffff; border-radius: 24px; padding: 12px; border: 1px solid #E7E0D8; box-shadow: 0 16px 40px rgba(0,0,0,0.06); position: relative; overflow: hidden; height: 420px;">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.140224163589!2d79.13038621480287!3d10.74100919234857!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baabf9f5b66d489%3A0xc68297b69c4c7304!2sNew%20Bus%20Stand%2C%20Thanjavur!5e0!3m2!1sen!2sin!4v1691234567890"
              style="width: 100%; height: 100%; border: none; border-radius: 16px;"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title="Thanjavur Advisory Desk Headquarters"
            ></iframe>

            <!-- Location Overlay Badge -->
            <div style="position: absolute; bottom: 24px; left: 24px; background: rgba(42,24,8,0.92); backdrop-filter: blur(12px); color: #fff; padding: 14px 20px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.15); display: flex; align-items: center; gap: 14px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); max-width: 380px;">
              <div style="width: 12px; height: 12px; border-radius: 50%; background: #eb5e28; box-shadow: 0 0 0 4px rgba(235,94,40,0.4); flex-shrink: 0;"></div>
              <div>
                <strong style="font-size: 0.92rem; display: block; color: #fff;">Thanjavur Headquarters</strong>
                <span style="font-size: 0.78rem; color: rgba(255,255,255,0.7);">Sivasakthi Apt, Raja Nagar, New Bus Stand</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  `;
}

export function initContactSectionListeners() {
  // Budget Pill Toggle
  const pills = document.querySelectorAll('.cf-budget-pill');
  const budgetInput = document.getElementById('cf-budget');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => {
        p.style.background = '#fff';
        p.style.color = '#333';
        p.style.borderColor = '#d1d5db';
      });
      pill.style.background = 'var(--color-orange, #eb5e28)';
      pill.style.color = '#fff';
      pill.style.borderColor = 'var(--color-orange, #eb5e28)';
      if (budgetInput) budgetInput.value = pill.dataset.value;
    });
  });

  // Custom Dropdown Trigger
  const dropdownWrapper = document.getElementById('custom-property-type');
  const dropdownTrigger = document.getElementById('custom-select-trigger');
  const dropdownOptions = document.querySelectorAll('.custom-option');
  const hiddenInput = document.getElementById('cf-interest');
  const selectText = document.getElementById('custom-select-text');

  if (dropdownWrapper && dropdownTrigger) {
    dropdownTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const optionsContainer = dropdownWrapper.querySelector('.custom-select-options');
      dropdownWrapper.classList.toggle('open');
      if (optionsContainer) {
        optionsContainer.style.display = dropdownWrapper.classList.contains('open') ? 'block' : 'none';
      }
    });

    dropdownOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        const value = option.getAttribute('data-value');
        const text = option.textContent;
        if (hiddenInput) hiddenInput.value = value;
        if (selectText) {
          selectText.textContent = text;
          selectText.style.color = '#1a1a1a';
          selectText.style.fontWeight = '600';
        }
        dropdownWrapper.classList.remove('open');
        const optionsContainer = dropdownWrapper.querySelector('.custom-select-options');
        if (optionsContainer) optionsContainer.style.display = 'none';
      });
    });

    document.addEventListener('click', () => {
      dropdownWrapper.classList.remove('open');
      const optionsContainer = dropdownWrapper.querySelector('.custom-select-options');
      if (optionsContainer) optionsContainer.style.display = 'none';
    });
  }

  // Copy to Clipboard buttons for Banking section
  document.querySelectorAll('.copy-bank-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.dataset.text;
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          const originalText = btn.textContent;
          btn.textContent = 'Copied!';
          btn.style.background = '#38a169';
          btn.style.color = '#fff';
          setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = originalText.includes('A/C') || originalText.includes('IFSC') ? '#f0f4f8' : '#eb5e28';
            btn.style.color = originalText.includes('A/C') || originalText.includes('IFSC') ? '#333' : '#fff';
          }, 2000);
        });
      }
    });
  });

  // Form Submit Handler
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('cf-submit-btn');
  const successMsg = document.getElementById('cf-success');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('cf-name')?.value.trim();
    const phone = document.getElementById('cf-phone')?.value.trim();
    const email = document.getElementById('cf-email')?.value.trim() || '';
    const reqLocation = document.getElementById('cf-location')?.value.trim() || 'Thanjavur';
    const message = document.getElementById('cf-message')?.value.trim() || '';

    if (!name || !phone) {
      document.getElementById('cf-name')?.focus();
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.querySelector('.cf-submit-text').textContent = 'Sending Property Brief...';
    }

    const cleanDigits = phone.replace(/\D/g, '');
    const formattedPhone = cleanDigits.length === 10 ? `+91${cleanDigits}` : `+${cleanDigits}`;
    const leadId = 'L-' + Math.floor(1000 + Math.random() * 9000);
    const reqType = hiddenInput ? hiddenInput.value : 'General Enquiry';
    const reqBudget = budgetInput ? budgetInput.value : 'Any Budget';

    // Create Lead Object for CRM
    const newLead = {
      id: leadId,
      name: name,
      phone: formattedPhone,
      mobile: formattedPhone,
      email: email,
      type: reqType,
      location: reqLocation,
      budget: reqBudget,
      source: 'Property Inquiry',
      date: new Date().toISOString().split('T')[0],
      stage: 'New Lead',
      assignedTo: 'Unassigned',
      priority: 'High',
      timeline: [
        {
          type: 'whatsapp_incoming',
          date: new Date().toISOString(),
          message: `📩 Web Brief: ${reqType} in ${reqLocation} (${reqBudget}). Note: ${message || 'No additional note'}`,
          note: message
        },
        {
          type: 'whatsapp',
          date: new Date().toISOString(),
          message: `🤖 Auto-sent WhatsApp Welcome Intro to ${name} (${formattedPhone})`,
          note: 'Campaign: initial_contact_intro'
        }
      ]
    };

    // Save to localStorage
    try {
      let existingLeads = JSON.parse(localStorage.getItem('thanjai_leads')) || [];
      existingLeads.unshift(newLead);
      localStorage.setItem('thanjai_leads', JSON.stringify(existingLeads));
      window.dispatchEvent(new Event('storage')); 
    } catch (e) {
      console.error('Error saving lead to storage:', e);
    }

    // Save to MySQL backend
    try {
      await fetchFromAPI('/leads', {
        method: 'POST',
        body: JSON.stringify(newLead)
      });
    } catch (e) {}

    // Log to WhatsApp Logs
    try {
      await fetchFromAPI('/whatsapp_incoming', {
        method: 'POST',
        body: JSON.stringify({
          from_phone: formattedPhone,
          from_name: name,
          message: `[Website Contact Brief] ${reqType} in ${reqLocation} (${reqBudget}) - ${message}`,
          message_type: 'text'
        })
      });

      await fetchFromAPI('/whatsapp_logs', {
        method: 'POST',
        body: JSON.stringify({
          id: `WA-${Date.now()}`,
          leadId: leadId,
          phone: formattedPhone,
          sender: 'Super Admin',
          recipientName: name,
          message: `Hello ${name}, Thank you for your interest in Thanjai Property! We have received your requirement for ${reqType} in ${reqLocation}. Our property advisors will assist you shortly. Official Desk: +91 84899 96852.`,
          type: 'outbound'
        })
      });
    } catch (e) {}

    // Dispatch SmartPing Welcome Template
    try {
      await fetchFromAPI('/send_whatsapp', {
        method: 'POST',
        body: JSON.stringify({
          campaignName: 'initial_contact_intro',
          destination: formattedPhone,
          userName: name,
          leadId: leadId,
          templateParams: [name, reqLocation, reqType, 'our Executive Desk at +91 84899 96852']
        })
      });
    } catch (e) {}

    form.reset();
    pills.forEach(p => {
      p.style.background = '#fff';
      p.style.color = '#333';
      p.style.borderColor = '#d1d5db';
    });
    if (budgetInput) budgetInput.value = '';
    if (selectText) {
      selectText.textContent = 'Select requirement';
      selectText.style.color = '#666';
      selectText.style.fontWeight = 'normal';
    }

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.querySelector('.cf-submit-text').textContent = 'Send Property Brief';
    }

    if (successMsg) {
      successMsg.style.display = 'flex';
      setTimeout(() => { successMsg.style.display = 'none'; }, 6000);
    }
  });
}
