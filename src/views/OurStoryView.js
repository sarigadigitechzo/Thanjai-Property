import { LOCATIONS } from '../data/locations.js';
import { getSiteImage } from '../utils/siteImagesStore.js';

export function renderOurStoryView(onNavigateToDiscover) {
  const founderImg = getSiteImage('leader_founder');
  const partnerImg = getSiteImage('leader_partner');

  return `
    <div class="page-view view-enter story-page">
      
      <!-- 1. EDITORIAL HERO -->
      <section class="story-hero" style="
        position: relative;
        padding: 130px 0 90px 0;
        background: linear-gradient(135deg, #1c1007 0%, #2a1808 60%, #150b04 100%);
        color: #ffffff;
        overflow: hidden;
      ">
        <div style="
          position: absolute; inset: 0;
          background-image: url('${getSiteImage('our_story_hero_bg')}');
          background-size: cover; background-position: center; opacity: 0.22;
        "></div>

        <div class="container" style="position: relative; z-index: 2; max-width: 900px; text-align: center;">
          <div style="
            display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px; border-radius: 30px;
            background: rgba(235, 94, 40, 0.15); border: 1px solid rgba(235, 94, 40, 0.4);
            color: var(--color-orange, #eb5e28); font-size: 0.8rem; font-weight: 800; letter-spacing: 0.12em; margin-bottom: 24px;
          ">
            <i class="ri-shield-star-line"></i> OUR STORY
          </div>

          <h1 class="heading-display-light" style="font-size: clamp(2.5rem, 5vw, 4.2rem); margin-bottom: 24px; color: #ffffff; line-height: 1.15;">
            Connecting People With<br>the Right Property.
          </h1>

          <p style="font-size: clamp(1.05rem, 2vw, 1.25rem); color: rgba(255, 255, 255, 0.88); line-height: 1.7; font-weight: 400; max-width: 820px; margin: 0 auto 36px auto;">
            Founded in Thanjavur in 2009, Thanjai Property simplifies real estate discovery across Tamil Nadu. Backed by deep local expertise, we connect buyers, sellers, and investors with verified residential, agricultural, and commercial properties tailored to their long-term goals.
          </p>
        </div>
      </section>

      <!-- 2. PHILOSOPHY & JOURNEY SECTION -->
      <section style="padding: 90px 0; background: #ffffff;">
        <div class="container">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 60px; align-items: center; margin-bottom: 80px;">
            <div>
              <span class="eyebrow" style="color: var(--color-orange, #eb5e28); font-weight: 800; letter-spacing: 0.12em;">OUR PHILOSOPHY</span>
              <h2 class="heading-section" style="margin-top: 12px; margin-bottom: 20px;">
                Where Local Knowledge Meets Modern Property Search.
              </h2>
              <p style="font-size: 1.05rem; color: #555; line-height: 1.75; margin-bottom: 24px;">
                We believe finding the right property goes beyond just location and price. It demands accurate data, clear communication, and an eye for future potential. By combining on-the-ground market expertise with modern digital search, we make every step of your property journey seamless, transparent, and informed.
              </p>

              <!-- 3 Philosophy Value Cards -->
              <div style="display: flex; flex-direction: column; gap: 16px;">
                <div style="background: #faf8f5; border-left: 4px solid #eb5e28; padding: 16px 20px; border-radius: 0 12px 12px 0;">
                  <strong style="font-size: 1rem; color: #1a1a1a; display: block; margin-bottom: 4px;">Trust</strong>
                  <span style="font-size: 0.9rem; color: #555; line-height: 1.5;">Sound property decisions start with honest guidance, verified documentation, and complete transparency.</span>
                </div>
                <div style="background: #faf8f5; border-left: 4px solid #eb5e28; padding: 16px 20px; border-radius: 0 12px 12px 0;">
                  <strong style="font-size: 1rem; color: #1a1a1a; display: block; margin-bottom: 4px;">Local Expertise</strong>
                  <span style="font-size: 0.9rem; color: #555; line-height: 1.5;">Deeply rooted in Thanjavur with a growing footprint across Tamil Nadu, we provide sharp insights into micro-markets and emerging corridors.</span>
                </div>
                <div style="background: #faf8f5; border-left: 4px solid #eb5e28; padding: 16px 20px; border-radius: 0 12px 12px 0;">
                  <strong style="font-size: 1rem; color: #1a1a1a; display: block; margin-bottom: 4px;">Long-Term Value</strong>
                  <span style="font-size: 0.9rem; color: #555; line-height: 1.5;">We look beyond the single transaction, focusing on properties that protect your capital and support your future lifestyle or investment goals.</span>
                </div>
              </div>
            </div>

            <div style="position: relative;">
              <div style="
                border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.12);
                border: 1px solid rgba(0,0,0,0.06);
              ">
                <img src="${getSiteImage('our_philosophy_img')}" alt="Thanjai Heritage Architecture" style="width: 100%; height: auto; display: block;" />
              </div>
              <div class="story-since-badge" style="
                position: absolute; bottom: -24px; left: -24px; background: #2A1808; color: #F8F4EC;
                padding: 24px 28px; border-radius: 16px; max-width: 280px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);
              ">
                <div style="font-family: var(--font-serif); font-size: 2.2rem; font-weight: 700; color: var(--color-orange, #eb5e28);">Since 2009</div>
                <div style="font-size: 0.85rem; font-weight: 600; opacity: 0.9; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px;">
                  17+ Years of Dedicated Real Estate Service
                </div>
              </div>
            </div>
          </div>

          <!-- OUR JOURNEY SECTION (INTERACTIVE 3-STEP GROWTH MILESTONE ROADMAP) -->
          <div style="background: linear-gradient(135deg, #1C1007 0%, #2A1808 60%, #150B04 100%); border-radius: 28px; padding: 50px 40px; color: #ffffff; position: relative; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.15);">
            <div style="position: absolute; inset: 0; opacity: 0.1; background-image: radial-gradient(#eb5e28 1px, transparent 1px); background-size: 24px 24px;"></div>

            <div style="position: relative; z-index: 2;">
              <div style="text-align: center; max-width: 720px; margin: 0 auto 48px auto;">
                <span class="eyebrow" style="color: var(--color-orange, #eb5e28); font-weight: 800; letter-spacing: 0.15em; font-size: 0.8rem;">OUR JOURNEY</span>
                <h2 style="font-family: var(--font-serif); font-size: 2.2rem; font-weight: 800; color: #ffffff; margin-top: 8px; margin-bottom: 14px;">
                  From Thanjavur to Tamil Nadu
                </h2>
                <p style="font-size: 1rem; color: rgba(255,255,255,0.85); line-height: 1.65; margin: 0;">
                  What started in Thanjavur has grown into a wider property platform serving property seekers across Tamil Nadu. Our journey continues with one purpose: making property discovery easier, clearer and more connected.
                </p>
              </div>

              <!-- 3-Step Growth Milestone Roadmap Grid -->
              <div style="position: relative; display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 28px;">
                
                <!-- Step 1: 2009 -->
                <div class="hover-lift" style="
                  background: rgba(255,255,255,0.06); border: 1px solid rgba(235,94,40,0.4);
                  border-radius: 20px; padding: 28px 24px; backdrop-filter: blur(10px);
                  position: relative; transition: all 0.35s ease;
                ">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
                    <span style="background: #eb5e28; color: #ffffff; font-size: 0.8rem; font-weight: 800; padding: 4px 14px; border-radius: 20px; letter-spacing: 0.05em;">
                      2009
                    </span>
                    <i class="ri-flag-2-line" style="font-size: 1.5rem; color: #eb5e28;"></i>
                  </div>
                  <h3 style="font-family: var(--font-serif); font-size: 1.3rem; font-weight: 700; color: #ffffff; margin-bottom: 8px;">Founding Roots in Thanjavur</h3>
                  <p style="font-size: 0.88rem; color: rgba(255,255,255,0.8); line-height: 1.6; margin: 0;">
                    Started with a simple vision to make property discovery transparent, accessible and reliable with 100% legal Patta verification.
                  </p>
                </div>

                <!-- Step 2: 2018 -->
                <div class="hover-lift" style="
                  background: rgba(255,255,255,0.06); border: 1px solid rgba(56,161,105,0.4);
                  border-radius: 20px; padding: 28px 24px; backdrop-filter: blur(10px);
                  position: relative; transition: all 0.35s ease;
                ">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
                    <span style="background: #38a169; color: #ffffff; font-size: 0.8rem; font-weight: 800; padding: 4px 14px; border-radius: 20px; letter-spacing: 0.05em;">
                      2018
                    </span>
                    <i class="ri-compass-3-line" style="font-size: 1.5rem; color: #38a169;"></i>
                  </div>
                  <h3 style="font-family: var(--font-serif); font-size: 1.3rem; font-weight: 700; color: #ffffff; margin-bottom: 8px;">Regional Footprint Expansion</h3>
                  <p style="font-size: 0.88rem; color: rgba(255,255,255,0.8); line-height: 1.6; margin: 0;">
                    Extended property services across key growth corridors including Trichy, Madurai, Kumbakonam, and the Cauvery Delta region.
                  </p>
                </div>

                <!-- Step 3: 2026 Today -->
                <div class="hover-lift" style="
                  background: rgba(255,255,255,0.06); border: 1px solid rgba(128,90,213,0.4);
                  border-radius: 20px; padding: 28px 24px; backdrop-filter: blur(10px);
                  position: relative; transition: all 0.35s ease;
                ">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
                    <span style="background: #805ad5; color: #ffffff; font-size: 0.8rem; font-weight: 800; padding: 4px 14px; border-radius: 20px; letter-spacing: 0.05em;">
                      2026 TODAY
                    </span>
                    <i class="ri-global-line" style="font-size: 1.5rem; color: #805ad5;"></i>
                  </div>
                  <h3 style="font-family: var(--font-serif); font-size: 1.3rem; font-weight: 700; color: #ffffff; margin-bottom: 8px;">Pan-Tamil Nadu Digital Ecosystem</h3>
                  <p style="font-size: 0.88rem; color: rgba(255,255,255,0.8); line-height: 1.6; margin: 0;">
                    Serving property seekers across all 38 districts of Tamil Nadu with multi-category search, NRI desk, and real-estate insights.
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. MEET OUR LEADERSHIP SECTION (CLASSIC & PREMIER EXECUTIVE DESIGN) -->
      <section style="padding: 100px 0; background: linear-gradient(135deg, #1C1007 0%, #2A1808 60%, #150B04 100%); color: #ffffff; position: relative; overflow: hidden;">
        <div style="position: absolute; inset: 0; opacity: 0.12; background-image: radial-gradient(#eb5e28 1px, transparent 1px); background-size: 28px 28px;"></div>
        <div class="container" style="position: relative; z-index: 2;">
          
          <div style="text-align: center; max-width: 800px; margin: 0 auto 60px auto;">
            <span class="eyebrow" style="color: var(--color-orange, #eb5e28); font-weight: 800; letter-spacing: 0.15em; font-size: 0.82rem; text-transform: uppercase;">
              MEET OUR LEADERSHIP
            </span>
            <h2 style="font-family: var(--font-serif, 'DM Serif Display', serif); font-size: clamp(2.2rem, 4vw, 3.4rem); margin-top: 10px; color: #ffffff; line-height: 1.25;">
              Experience Behind Every<br>Property Journey
            </h2>
            <p style="color: rgba(255,255,255,0.85); font-size: 1.08rem; margin-top: 14px; line-height: 1.6;">
              Our leadership brings together real-estate understanding, local knowledge and a strong focus on customer trust.
            </p>
          </div>
          <div style="width: 100%; display: flex; justify-content: space-evenly; gap: 40px; flex-wrap: wrap; align-items: stretch;">
            
            <!-- MANAGING DIRECTOR CARD (ADMINISTRATIVE & LEGAL GOVERNANCE) -->
            <div class="story-leader-card hover-lift" style="
              width: 100%; max-width: 420px; flex: 1 1 360px;
              background: linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%);
              border: 1px solid rgba(235,94,40,0.35); border-radius: 28px; padding: 30px 24px;
              backdrop-filter: blur(16px); box-shadow: 0 20px 50px rgba(0,0,0,0.4);
              display: flex; flex-direction: column; justify-content: space-between; text-align: center;
              transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            ">
              <div>
                <!-- Centered Photo Frame (Blended Studio Backdrop + Uniform 24px Corner Radius) -->
                <div style="
                  width: 100%; aspect-ratio: 1 / 1; margin: 0 auto 20px auto;
                  border-radius: 24px; overflow: hidden; background: #000000;
                  border: 2.5px solid #eb5e28; box-shadow: 0 12px 30px rgba(0,0,0,0.5); position: relative;
                ">
                  <img src="${founderImg}" alt="S. Vijayaraghavan" style="width: 100%; height: 100%; object-fit: cover; object-position: top center; display: block; border-radius: 24px; mix-blend-mode: lighten;" onerror="this.src='/images/vijayaraghavan.jpg'" />
                  <div style="position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 35%, transparent 45%, rgba(0,0,0,0.85) 90%, #000000 100%); pointer-events: none;"></div>
                </div>

                <!-- Centered Name & Role -->
                <div style="margin-bottom: 14px;">
                  <h3 style="font-family: var(--font-serif); font-size: 1.75rem; font-weight: 700; color: #ffffff; line-height: 1.25; margin-bottom: 6px;">S. Vijayaraghavan</h3>
                  <p style="font-size: 0.92rem; color: #eb5e28; font-weight: 800; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">Managing Director</p>
                </div>

                <!-- Justified Bio Text -->
                <p style="font-size: 0.92rem; color: rgba(255,255,255,0.85); line-height: 1.75; margin-bottom: 22px; text-align: justify; text-justify: inter-word;">
                  S. Vijayaraghavan has been instrumental in shaping the vision of Thanjai Property since its foundation in 2009. He oversees operations, corporate governance, legal title verification, and Patta clearance standards, ensuring every transaction delivers unmatched legal security and transparency for property buyers across Tamil Nadu.
                </p>
              </div>

              <div style="padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.12); display: flex; gap: 10px; flex-wrap: wrap;">
                <a href="tel:+919578311506" style="flex: 1; background: rgba(255,255,255,0.12); color: #fff; padding: 12px 16px; border-radius: 12px; font-size: 0.88rem; font-weight: 700; text-decoration: none; text-align: center; display: inline-flex; align-items: center; justify-content: center; gap: 6px;">
                  <i class="ri-phone-line"></i> +91 95783 11506
                </a>
                <a href="https://wa.me/919578311506" target="_blank" style="flex: 1; background: #25D366; color: #fff; padding: 12px 16px; border-radius: 12px; font-size: 0.88rem; font-weight: 700; text-decoration: none; text-align: center; display: inline-flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 4px 14px rgba(37,211,102,0.3);">
                  <i class="ri-whatsapp-line"></i> WhatsApp
                </a>
              </div>
            </div>

            <!-- CO-PARTNER CARD (SALES & MARKETING LEADERSHIP) -->
            <div class="story-leader-card hover-lift" style="
              width: 100%; max-width: 420px; flex: 1 1 360px;
              background: linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%);
              border: 1px solid rgba(56,161,105,0.35); border-radius: 28px; padding: 30px 24px;
              backdrop-filter: blur(16px); box-shadow: 0 20px 50px rgba(0,0,0,0.4);
              display: flex; flex-direction: column; justify-content: space-between; text-align: center;
              transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            ">
              <div>
                <!-- Centered Photo Frame (Blended Studio Backdrop + Uniform 24px Corner Radius) -->
                <div style="
                  width: 100%; aspect-ratio: 1 / 1; margin: 0 auto 20px auto;
                  border-radius: 24px; overflow: hidden; background: #000000;
                  border: 2.5px solid #38a169; box-shadow: 0 12px 30px rgba(0,0,0,0.5); position: relative;
                ">
                  <img src="${partnerImg}" alt="Radhakrishnan" style="width: 100%; height: 100%; object-fit: cover; object-position: top center; display: block; border-radius: 24px; mix-blend-mode: lighten;" onerror="this.src='/images/radhakrishnan.jpg'" />
                  <div style="position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 35%, transparent 45%, rgba(0,0,0,0.85) 90%, #000000 100%); pointer-events: none;"></div>
                </div>

                <!-- Centered Name & Role -->
                <div style="margin-bottom: 14px;">
                  <h3 style="font-family: var(--font-serif); font-size: 1.75rem; font-weight: 700; color: #ffffff; line-height: 1.25; margin-bottom: 6px;">G. Radhakrishnan</h3>
                  <p style="font-size: 0.92rem; color: #38a169; font-weight: 800; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">Managing Partner</p>
                </div>

                <!-- Justified Bio Text -->
                <p style="font-size: 0.92rem; color: rgba(255,255,255,0.85); line-height: 1.75; margin-bottom: 22px; text-align: justify; text-justify: inter-word;">
                  G. Radhakrishnan leads strategic sales, investor relations, and property advisory across Tamil Nadu. Bringing a dynamic, customer-centric approach, he connects homebuyers, plot investors, and NRI clients with prime real estate opportunities through personalized property matching, curated site visits, and actionable market insights.
                </p>
              </div>

              <div style="padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.12); display: flex; gap: 10px; flex-wrap: wrap;">
                <a href="tel:+919585777772" style="flex: 1; background: rgba(255,255,255,0.12); color: #fff; padding: 12px 16px; border-radius: 12px; font-size: 0.88rem; font-weight: 700; text-decoration: none; text-align: center; display: inline-flex; align-items: center; justify-content: center; gap: 6px;">
                  <i class="ri-phone-line"></i> +91 95857 77772
                </a>
                <a href="https://wa.me/919585777772" target="_blank" style="flex: 1; background: #25D366; color: #fff; padding: 12px 16px; border-radius: 12px; font-size: 0.88rem; font-weight: 700; text-decoration: none; text-align: center; display: inline-flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 4px 14px rgba(37,211,102,0.3);">
                  <i class="ri-whatsapp-line"></i> WhatsApp
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>

      <!-- 4. OUR THANJAVUR FOOTPRINT SECTION (UNIQUE ZONAL CORRIDOR DIRECTORY) -->
      <section style="padding: 95px 0; background: #faf8f5; border-top: 1px solid rgba(0,0,0,0.05);">
        <div class="container">
          <div style="text-align: center; max-width: 800px; margin: 0 auto 55px auto;">
            <span class="eyebrow" style="color: var(--color-orange, #eb5e28); font-weight: 800; letter-spacing: 0.12em;">PRIMARY OPERATIONS HUB — THANJAVUR</span>
            <h2 class="heading-section" style="margin-top: 12px; font-size: clamp(2rem, 3.5vw, 2.8rem);">
              Our Local Footprint Across Thanjavur
            </h2>
            <p style="color: #666; font-size: 1.05rem; margin-top: 12px; line-height: 1.65;">
              Since 2009, Thanjai Property has maintained an unmatched local presence across Thanjavur. Explore our verified property footprint categorized by strategic growth corridors.
            </p>
          </div>

          <!-- ZONAL CLUSTERS (11 INDIVIDUAL LOCATION CARDS IN ZIG-ZAG TIMELINE) -->
          <div class="story-zigzag-timeline" style="position: relative; max-width: 1040px; margin: 0 auto;">
            
            <!-- Central Vertical Spine Line -->
            <div class="timeline-center-spine"></div>

            ${[
              { num: 1, name: 'Medical College Road', category: 'Arterial Corridor', accent: '#eb5e28', icon: 'ri-hospital-line', desc: 'Healthcare & Premium Residential Hub • Multi-specialty hospitals & DTCP layouts' },
              { num: 2, name: 'Trichy Road', category: 'Arterial Highway', accent: '#eb5e28', icon: 'ri-road-map-line', desc: 'Major Commercial Highway & Gated Villas • Direct connectivity to Trichy (NH 83)' },
              { num: 3, name: 'Pudukkottai Road', category: 'Educational Belt', accent: '#eb5e28', icon: 'ri-book-open-line', desc: 'Educational Belt & Residential Plot Layouts • Schools & Tamil University sector' },
              { num: 4, name: 'Madhakottai Road', category: 'Prime Residential', accent: '#38a169', icon: 'ri-home-4-line', desc: 'Rapid Urban Expansion & Modern Villas • Contemporary villa developments' },
              { num: 5, name: 'Nanjikottai Road', category: 'Residential Enclave', accent: '#38a169', icon: 'ri-community-line', desc: 'Serene Residential Enclaves & Townhouses • Top schools & sweet groundwater' },
              { num: 6, name: 'Villar Road', category: 'Suburban Growth', accent: '#3182ce', icon: 'ri-plant-line', desc: 'Suburban Growth & Investment Plot Layouts • Budget-friendly house sites' },
              { num: 7, name: 'Pattukottai Bypass', category: 'Ring Road Bypass', accent: '#805ad5', icon: 'ri-compass-3-line', desc: 'Ring Road Outer Corridor & Commercial Land • Prime highway frontage' },
              { num: 8, name: 'Mariyamman Kovil Road', category: 'Heritage Corridor', accent: '#d69e2e', icon: 'ri-ancient-gate-line', desc: 'Heritage & Temple Neighborhood Corridor • Near Punnainallur Temple' },
              { num: 9, name: 'Srinivasapuram', category: 'Upscale Residential', accent: '#38a169', icon: 'ri-building-line', desc: 'Established Upscale Neighborhood • Luxury independent homes & civic layout' },
              { num: 10, name: 'Reddipalayam Road', category: 'Modern Residential', accent: '#38a169', icon: 'ri-home-gear-line', desc: 'Gated Community & Modern Layouts • RERA approved house sites' },
              { num: 11, name: 'Kumbakonam Bypass', category: 'Delta Highway', accent: '#3182ce', icon: 'ri-map-pin-line', desc: 'Delta Highway & Strategic Land Assets • Thanjavur to Kumbakonam link' }
            ].map((c, idx) => {
              const isLeft = idx % 2 === 0;
              if (isLeft) {
                return `
                  <div class="zigzag-row left-row">
                    <div class="zigzag-card-container">
                      <div class="zigzag-box hover-lift" style="
                        background: #ffffff; border-radius: 18px; padding: 20px 22px;
                        border: 1px solid #e2e8f0; border-left: 5px solid ${c.accent};
                        box-shadow: 0 8px 24px rgba(0,0,0,0.04); position: relative;
                      ">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; flex-wrap: wrap; gap: 8px;">
                          <div style="display: flex; align-items: center; gap: 10px;">
                            <div style="width: 32px; height: 32px; border-radius: 8px; background: ${c.accent}18; color: ${c.accent}; display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">
                              <i class="${c.icon}"></i>
                            </div>
                            <h3 style="font-family: var(--font-serif); font-size: 1.15rem; font-weight: 800; color: #1a1a1a; margin: 0;">${c.num}. ${c.name}</h3>
                          </div>
                          <span class="badge" style="background: ${c.accent}15; color: ${c.accent}; font-size: 0.72rem; font-weight: 800; padding: 3px 10px; border-radius: 14px;">${c.category}</span>
                        </div>
                        <p style="font-size: 0.83rem; color: #555; line-height: 1.5; margin: 0 0 10px 0;">${c.desc}</p>
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                          <span style="font-size: 0.72rem; font-weight: 700; color: #38a169; background: rgba(56,161,105,0.1); padding: 3px 8px; border-radius: 6px; display: inline-flex; align-items: center; gap: 4px;">
                            <i class="ri-checkbox-circle-fill"></i> Clear Patta Assured
                          </span>
                          <span style="font-size: 0.75rem; font-weight: 700; color: var(--color-orange); cursor: pointer;" class="story-explore-loc-link" data-loc="${c.name}">
                            View Area <i class="ri-arrow-right-line" style="vertical-align: middle;"></i>
                          </span>
                        </div>
                      </div>
                      <div class="zigzag-arrow-pointer to-right" style="border-left-color: ${c.accent};"></div>
                    </div>

                    <div class="zigzag-node-badge" style="border-color: ${c.accent}; color: ${c.accent};">
                      <span class="node-num" style="font-weight: 800; font-size: 0.95rem;">${c.num}</span>
                    </div>

                    <div class="zigzag-spacer"></div>
                  </div>
                `;
              } else {
                return `
                  <div class="zigzag-row right-row">
                    <div class="zigzag-spacer"></div>

                    <div class="zigzag-node-badge" style="border-color: ${c.accent}; color: ${c.accent};">
                      <span class="node-num" style="font-weight: 800; font-size: 0.95rem;">${c.num}</span>
                    </div>

                    <div class="zigzag-card-container">
                      <div class="zigzag-arrow-pointer to-left" style="border-right-color: ${c.accent};"></div>
                      <div class="zigzag-box hover-lift" style="
                        background: #ffffff; border-radius: 18px; padding: 20px 22px;
                        border: 1px solid #e2e8f0; border-left: 5px solid ${c.accent};
                        box-shadow: 0 8px 24px rgba(0,0,0,0.04); position: relative;
                      ">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; flex-wrap: wrap; gap: 8px;">
                          <div style="display: flex; align-items: center; gap: 10px;">
                            <div style="width: 32px; height: 32px; border-radius: 8px; background: ${c.accent}18; color: ${c.accent}; display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">
                              <i class="${c.icon}"></i>
                            </div>
                            <h3 style="font-family: var(--font-serif); font-size: 1.15rem; font-weight: 800; color: #1a1a1a; margin: 0;">${c.num}. ${c.name}</h3>
                          </div>
                          <span class="badge" style="background: ${c.accent}15; color: ${c.accent}; font-size: 0.72rem; font-weight: 800; padding: 3px 10px; border-radius: 14px;">${c.category}</span>
                        </div>
                        <p style="font-size: 0.83rem; color: #555; line-height: 1.5; margin: 0 0 10px 0;">${c.desc}</p>
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                          <span style="font-size: 0.72rem; font-weight: 700; color: #38a169; background: rgba(56,161,105,0.1); padding: 3px 8px; border-radius: 6px; display: inline-flex; align-items: center; gap: 4px;">
                            <i class="ri-checkbox-circle-fill"></i> Clear Patta Assured
                          </span>
                          <span style="font-size: 0.75rem; font-weight: 700; color: var(--color-orange); cursor: pointer;" class="story-explore-loc-link" data-loc="${c.name}">
                            View Area <i class="ri-arrow-right-line" style="vertical-align: middle;"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                `;
              }
            }).join('')}

          </div>

          <div style="text-align: center; margin-top: 50px;">
            <button class="btn btn-primary story-explore-districts-btn" style="padding: 16px 40px; border-radius: 12px; font-size: 1rem; box-shadow: 0 6px 20px rgba(235,94,40,0.3);">
              <i class="ri-map-pin-line" style="font-size: 1.2rem;"></i>
              <span>View More Properties</span>
            </button>
          </div>
        </div>
      </section>

      <!-- 5. OUR PORTFOLIO PILLARS SECTION (EDITORIAL NUMBERED TIMELINE DECK 01, 02, 03, 04) -->
      <section style="padding: 100px 0; background: linear-gradient(180deg, #ffffff 0%, #FAF6F0 100%); border-top: 1px solid rgba(0,0,0,0.06); position: relative;">
        <div class="container">
          <div style="text-align: center; max-width: 680px; margin: 0 auto 65px auto;">
            <span class="eyebrow" style="color: var(--color-orange, #eb5e28); font-weight: 800; letter-spacing: 0.12em;">OUR PORTFOLIO PILLARS</span>
            <h2 class="heading-section" style="margin-top: 12px; font-size: clamp(2rem, 3.5vw, 2.8rem);">
              What We Look for in a Property
            </h2>
            <p style="color: #666; font-size: 1.05rem; margin-top: 12px; line-height: 1.65;">
              Every property evaluation focuses on four core standards.
            </p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 32px;">
            
            <!-- Pillar 01 -->
            <div class="hover-lift" style="
              background: #ffffff; padding: 36px 30px; border-radius: 24px;
              border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 10px 30px rgba(0,0,0,0.04);
              position: relative; overflow: hidden; transition: all 0.4s ease;
            ">
              <div style="position: absolute; top: 0; left: 0; right: 0; height: 5px; background: linear-gradient(90deg, #eb5e28 0%, #dd6b20 100%);"></div>
              
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <div style="
                  width: 52px; height: 52px; border-radius: 50%; background: rgba(235,94,40,0.12);
                  color: #eb5e28; display: flex; align-items: center; justify-content: center;
                  font-family: var(--font-serif); font-size: 1.4rem; font-weight: 800; border: 1px solid rgba(235,94,40,0.3);
                ">
                  01
                </div>
                <i class="ri-map-pin-user-line" style="font-size: 1.8rem; color: #eb5e28;"></i>
              </div>

              <h3 style="font-family: var(--font-serif); font-size: 1.35rem; font-weight: 700; color: #1a1a1a; margin-bottom: 12px;">
                Thoughtful Locations
              </h3>
              <p style="font-size: 0.93rem; color: #555; line-height: 1.65; margin: 0;">
                We focus on locations that offer accessibility, convenience and relevance to the property's intended purpose.
              </p>
            </div>

            <!-- Pillar 02 -->
            <div class="hover-lift" style="
              background: #ffffff; padding: 36px 30px; border-radius: 24px;
              border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 10px 30px rgba(0,0,0,0.04);
              position: relative; overflow: hidden; transition: all 0.4s ease;
            ">
              <div style="position: absolute; top: 0; left: 0; right: 0; height: 5px; background: linear-gradient(90deg, #dd6b20 0%, #d69e2e 100%);"></div>
              
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <div style="
                  width: 52px; height: 52px; border-radius: 50%; background: rgba(221,107,32,0.12);
                  color: #dd6b20; display: flex; align-items: center; justify-content: center;
                  font-family: var(--font-serif); font-size: 1.4rem; font-weight: 800; border: 1px solid rgba(221,107,32,0.3);
                ">
                  02
                </div>
                <i class="ri-compasses-2-line" style="font-size: 1.8rem; color: #dd6b20;"></i>
              </div>

              <h3 style="font-family: var(--font-serif); font-size: 1.35rem; font-weight: 700; color: #1a1a1a; margin-bottom: 12px;">
                Exceptional Design
              </h3>
              <p style="font-size: 0.93rem; color: #555; line-height: 1.65; margin: 0;">
                We value residential spaces that combine practical planning, functionality and modern living requirements.
              </p>
            </div>

            <!-- Pillar 03 -->
            <div class="hover-lift" style="
              background: #ffffff; padding: 36px 30px; border-radius: 24px;
              border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 10px 30px rgba(0,0,0,0.04);
              position: relative; overflow: hidden; transition: all 0.4s ease;
            ">
              <div style="position: absolute; top: 0; left: 0; right: 0; height: 5px; background: linear-gradient(90deg, #38a169 0%, #319795 100%);"></div>
              
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <div style="
                  width: 52px; height: 52px; border-radius: 50%; background: rgba(56,161,105,0.12);
                  color: #38a169; display: flex; align-items: center; justify-content: center;
                  font-family: var(--font-serif); font-size: 1.4rem; font-weight: 800; border: 1px solid rgba(56,161,105,0.3);
                ">
                  03
                </div>
                <i class="ri-shield-check-line" style="font-size: 1.8rem; color: #38a169;"></i>
              </div>

              <h3 style="font-family: var(--font-serif); font-size: 1.35rem; font-weight: 700; color: #1a1a1a; margin-bottom: 12px;">
                Legal & Documentation
              </h3>
              <p style="font-size: 0.93rem; color: #555; line-height: 1.65; margin: 0;">
                Property information, ownership records, approvals and documentation are important parts of an informed property decision.
              </p>
            </div>

            <!-- Pillar 04 -->
            <div class="hover-lift" style="
              background: #ffffff; padding: 36px 30px; border-radius: 24px;
              border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 10px 30px rgba(0,0,0,0.04);
              position: relative; overflow: hidden; transition: all 0.4s ease;
            ">
              <div style="position: absolute; top: 0; left: 0; right: 0; height: 5px; background: linear-gradient(90deg, #805ad5 0%, #6b46c1 100%);"></div>
              
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <div style="
                  width: 52px; height: 52px; border-radius: 50%; background: rgba(128,90,213,0.12);
                  color: #805ad5; display: flex; align-items: center; justify-content: center;
                  font-family: var(--font-serif); font-size: 1.4rem; font-weight: 800; border: 1px solid rgba(128,90,213,0.3);
                ">
                  04
                </div>
                <i class="ri-line-chart-line" style="font-size: 1.8rem; color: #805ad5;"></i>
              </div>

              <h3 style="font-family: var(--font-serif); font-size: 1.35rem; font-weight: 700; color: #1a1a1a; margin-bottom: 12px;">
                Long-Term Potential
              </h3>
              <p style="font-size: 0.93rem; color: #555; line-height: 1.65; margin: 0;">
                We look beyond today's transaction and consider how a property can support future lifestyle, business or investment goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- 6. OUR COMMITMENT & CLOSING CTA -->
      <section style="padding: 100px 0; background: #2A1808; color: #ffffff; text-align: center;">
        <div class="container" style="max-width: 840px;">
          <span class="eyebrow eyebrow-dark" style="margin-bottom: 16px;">OUR COMMITMENT</span>
          <h2 class="heading-display-light" style="font-size: clamp(2rem, 4vw, 3.2rem); margin-bottom: 20px; color: #ffffff;">
            Built on Trust. Driven by Property Expertise.
          </h2>
          <p style="color: rgba(255,255,255,0.85); font-size: 1.08rem; line-height: 1.7; margin-bottom: 40px;">
            At Thanjai Property, our commitment is simple — provide a property discovery experience that is clear, convenient and customer-focused. Whether you are buying a home, searching for land, investing in property or selling an existing asset, we aim to help you move forward with better information and greater confidence.
          </p>

          <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); border-radius: 24px; padding: 36px; margin-top: 20px;">
            <h3 style="font-family: var(--font-serif); font-size: 1.6rem; color: #ffffff; margin-bottom: 10px;">READY TO FIND YOUR PROPERTY?</h3>
            <p style="color: rgba(255,255,255,0.8); font-size: 1rem; margin-bottom: 24px;">Your Next Property Could Be Closer Than You Think. Explore residential properties, plots, agricultural land and commercial opportunities across Tamil Nadu.</p>
            
            <div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
              <button class="btn btn-primary story-discover-btn" id="story-cta-discover-btn" style="padding: 14px 32px; font-size: 1rem; border-radius: 12px;">
                <span>Explore Properties</span>
                <i class="ri-arrow-right-line"></i>
              </button>
              <button class="btn btn-outline-light" id="story-cta-post-btn" style="padding: 14px 32px; font-size: 1rem; border-radius: 12px; color: #fff; border: 1px solid rgba(255,255,255,0.4);">
                <i class="ri-add-circle-line"></i> Post Your Property
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  `;
}

export function initOurStoryListeners(onNavigateToDiscover) {
  document.getElementById('story-cta-discover-btn')?.addEventListener('click', onNavigateToDiscover);
  document.querySelectorAll('.story-explore-districts-btn').forEach(btn => {
    btn.addEventListener('click', onNavigateToDiscover);
  });
  document.querySelectorAll('.story-explore-loc-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const loc = e.currentTarget.dataset.loc;
      if (loc && onNavigateToDiscover) {
        onNavigateToDiscover(loc);
      } else if (onNavigateToDiscover) {
        onNavigateToDiscover();
      }
    });
  });
  document.getElementById('story-cta-post-btn')?.addEventListener('click', () => {
    window.location.href = '/user-dashboard.html';
  });
}

