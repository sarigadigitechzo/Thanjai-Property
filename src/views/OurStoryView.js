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
            <i class="ri-shield-star-line"></i> THANJAI PROPERTY • SINCE 2009
          </div>

          <h1 class="heading-display-light" style="font-size: clamp(2.5rem, 5vw, 4.2rem); margin-bottom: 24px; color: #ffffff; line-height: 1.15;">
            Crafting Living Legacies<br>Across Tamil Nadu.
          </h1>

          <p style="font-size: clamp(1.1rem, 2vw, 1.3rem); color: rgba(255, 255, 255, 0.88); line-height: 1.7; font-weight: 400; max-width: 780px; margin: 0 auto 36px auto;">
            For over 15 years, Thanjai Property has connected families, investors, and business leaders with Tamil Nadu’s most exceptional residential, Kaveri agricultural farmlands, and prime commercial real estate.
          </p>
        </div>
      </section>

      <!-- 2. PHILOSOPHY & FOUNDING STORY -->
      <section style="padding: 90px 0; background: #ffffff;">
        <div class="container">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 60px; align-items: center;">
            <div>
              <span class="eyebrow" style="color: var(--color-orange, #eb5e28); font-weight: 800; letter-spacing: 0.12em;">OUR PHILOSOPHY</span>
              <h2 class="heading-section" style="margin-top: 12px; margin-bottom: 24px;">
                Where Heritage Meets Modern Luxury.
              </h2>
              <p style="font-size: 1.05rem; color: #555; line-height: 1.75; margin-bottom: 20px;">
                Founded in 2009 in Thanjavur — the cultural capital and heart of the Kaveri delta — Thanjai Property was built on a simple, uncompromising promise: to bring complete title transparency, legal Patta verification, and architectural distinction to Tamil Nadu real estate.
              </p>
              <p style="font-size: 1.05rem; color: #555; line-height: 1.75;">
                We view real estate not as transactional square footage, but as the physical foundation where families build memories, multi-generational wealth is preserved, and communities flourish.
              </p>
            </div>

            <div style="position: relative;">
              <div style="
                border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.12);
                border: 1px solid rgba(0,0,0,0.06);
              ">
                <img src="${getSiteImage('our_philosophy_img')}" alt="Thanjai Heritage Architecture" style="width: 100%; height: auto; display: block;" />
              </div>
              <div style="
                position: absolute; bottom: -24px; left: -24px; background: #2A1808; color: #F8F4EC;
                padding: 24px 28px; border-radius: 16px; max-width: 280px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);
              ">
                <div style="font-family: var(--font-serif); font-size: 2.2rem; font-weight: 700; color: var(--color-orange, #eb5e28);">15+</div>
                <div style="font-size: 0.85rem; font-weight: 600; opacity: 0.9; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px;">
                  Years of Uncompromised Trust & Guidance
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2.5 FOUNDER & PARTNER EXECUTIVE LEADERSHIP SECTION -->
      <section style="padding: 90px 0; background: #2A1808; color: #ffffff; position: relative; overflow: hidden;">
        <div style="position: absolute; inset: 0; opacity: 0.1; background-image: radial-gradient(#eb5e28 1px, transparent 1px); background-size: 24px 24px;"></div>
        <div class="container" style="position: relative; z-index: 2;">
          
          <div style="text-align: center; max-width: 760px; margin: 0 auto 60px auto;">
            <span class="eyebrow" style="color: var(--color-orange, #eb5e28); font-weight: 800; letter-spacing: 0.15em; font-size: 0.8rem; text-transform: uppercase;">
              EXECUTIVE LEADERSHIP & VISION
            </span>
            <h2 style="font-family: var(--font-serif, 'DM Serif Display', serif); font-size: clamp(2.2rem, 4vw, 3.2rem); margin-top: 12px; color: #ffffff;">
              Meet Our Leadership
            </h2>
            <p style="color: rgba(255,255,255,0.85); font-size: 1.05rem; margin-top: 14px; line-height: 1.6;">
              Driven by over 15+ years of real estate integrity, legal Patta title assurance, and client-first dedication across Tamil Nadu.
            </p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 36px;">
            
            <!-- MANAGING DIRECTOR CARD -->
            <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); border-radius: 24px; padding: 28px; backdrop-filter: blur(12px); box-shadow: 0 16px 40px rgba(0,0,0,0.3); display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <!-- Spacious Photo Frame -->
                <div style="width: 100%; height: 260px; border-radius: 16px; overflow: hidden; margin-bottom: 20px; background: rgba(0,0,0,0.4); border: 1px solid rgba(235,94,40,0.3); position: relative; box-shadow: 0 8px 24px rgba(0,0,0,0.2);">
                  <img src="${founderImg}" alt="S. Vijayaraghavan" style="width: 100%; height: 100%; object-fit: cover; object-position: top center; display: block;" onerror="this.src='https://ui-avatars.com/api/?name=S+Vijayaraghavan&background=eb5e28&color=ffffff&size=256'" />
                  <span style="position: absolute; bottom: 12px; left: 12px; background: rgba(0,0,0,0.75); backdrop-filter: blur(8px); color: #eb5e28; font-size: 0.72rem; font-weight: 800; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.08em; border: 1px solid rgba(235,94,40,0.4);">
                    MANAGING DIRECTOR
                  </span>
                </div>

                <div style="margin-bottom: 16px;">
                  <h3 style="font-family: var(--font-serif); font-size: 1.7rem; font-weight: 700; color: #ffffff; line-height: 1.2;">S. Vijayaraghavan</h3>
                  <p style="font-size: 0.85rem; color: rgba(255,255,255,0.7); margin-top: 4px; font-weight: 600;">Managing Director & Chief Promoter</p>
                </div>

                <div style="font-size: 0.92rem; color: rgba(255,255,255,0.85); line-height: 1.65; margin-bottom: 24px; font-style: italic; border-left: 3px solid #eb5e28; padding-left: 14px;">
                  "Pioneered Thanjai Property in 2009 with an uncompromising vision to bring 100% legal Patta title verification and land security to every home buyer and investor across Tamil Nadu."
                </div>
              </div>

              <div style="padding-top: 18px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; gap: 12px; flex-wrap: wrap;">
                <a href="tel:+919578311506" style="flex: 1; background: #eb5e28; color: #fff; padding: 10px 16px; border-radius: 10px; font-size: 0.85rem; font-weight: 700; text-decoration: none; text-align: center; display: inline-flex; align-items: center; justify-content: center; gap: 6px;">
                  <i class="ri-phone-line"></i> +91 95783 11506
                </a>
                <a href="mailto:vijayaraghavan@thanjaiproperty.com" style="flex: 1; background: rgba(255,255,255,0.12); color: #fff; padding: 10px 16px; border-radius: 10px; font-size: 0.85rem; font-weight: 700; text-decoration: none; text-align: center; display: inline-flex; align-items: center; justify-content: center; gap: 6px;">
                  <i class="ri-mail-line"></i> Direct Email
                </a>
              </div>
            </div>

            <!-- CO-PARTNER CARD -->
            <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); border-radius: 24px; padding: 28px; backdrop-filter: blur(12px); box-shadow: 0 16px 40px rgba(0,0,0,0.3); display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <!-- Spacious Photo Frame -->
                <div style="width: 100%; height: 260px; border-radius: 16px; overflow: hidden; margin-bottom: 20px; background: rgba(0,0,0,0.4); border: 1px solid rgba(56,161,105,0.3); position: relative; box-shadow: 0 8px 24px rgba(0,0,0,0.2);">
                  <img src="${partnerImg}" alt="Radhakrishnan" style="width: 100%; height: 100%; object-fit: cover; object-position: top center; display: block;" onerror="this.src='https://ui-avatars.com/api/?name=Radhakrishnan&background=38a169&color=ffffff&size=256'" />
                  <span style="position: absolute; bottom: 12px; left: 12px; background: rgba(0,0,0,0.75); backdrop-filter: blur(8px); color: #38a169; font-size: 0.72rem; font-weight: 800; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.08em; border: 1px solid rgba(56,161,105,0.4);">
                    CO-PARTNER
                  </span>
                </div>

                <div style="margin-bottom: 16px;">
                  <h3 style="font-family: var(--font-serif); font-size: 1.7rem; font-weight: 700; color: #ffffff; line-height: 1.2;">Radhakrishnan</h3>
                  <p style="font-size: 0.85rem; color: rgba(255,255,255,0.7); margin-top: 4px; font-weight: 600;">Co-Partner & Legal Specialist</p>
                </div>

                <div style="font-size: 0.92rem; color: rgba(255,255,255,0.85); line-height: 1.65; margin-bottom: 24px; font-style: italic; border-left: 3px solid #38a169; padding-left: 14px;">
                  "Co-partner overseeing revenue record verification, DTCP/RERA approvals, field survey coordination, and customer partnership growth across Tamil Nadu's 32 districts."
                </div>
              </div>

              <div style="padding-top: 18px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; gap: 12px; flex-wrap: wrap;">
                <a href="tel:+919585777772" style="flex: 1; background: rgba(255,255,255,0.15); color: #fff; padding: 10px 16px; border-radius: 10px; font-size: 0.85rem; font-weight: 700; text-decoration: none; text-align: center; display: inline-flex; align-items: center; justify-content: center; gap: 6px;">
                  <i class="ri-phone-line"></i> +91 95857 77772
                </a>
                <a href="https://wa.me/919585777772" target="_blank" style="flex: 1; background: #25D366; color: #fff; padding: 10px 16px; border-radius: 10px; font-size: 0.85rem; font-weight: 700; text-decoration: none; text-align: center; display: inline-flex; align-items: center; justify-content: center; gap: 6px;">
                  <i class="ri-whatsapp-line"></i> WhatsApp
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>

      <!-- 3. BRIEF DISTRICT PRESENCE & PLOT LAYOUTS SECTION -->
      <section style="padding: 90px 0; background: #faf8f5; border-top: 1px solid rgba(0,0,0,0.05);">
        <div class="container">
          <div style="text-align: center; max-width: 700px; margin: 0 auto 50px auto;">
            <span class="eyebrow" style="color: var(--color-orange, #eb5e28); font-weight: 800; letter-spacing: 0.12em;">REGIONAL DISTRICT FOOTPRINT</span>
            <h2 class="heading-section" style="margin-top: 12px;">
              District Plots & Farmland Presence
            </h2>
            <p style="color: #666; font-size: 1.05rem; margin-top: 12px; line-height: 1.6;">
              A brief overview of key Tamil Nadu growth corridors where Thanjai Property develops and curates verified plot layouts and land estates.
            </p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 28px;">
            ${LOCATIONS.map(loc => `
              <div class="story-district-card hover-lift" style="
                background: #ffffff; border-radius: 20px; padding: 24px;
                border: 1px solid rgba(0,0,0,0.07); box-shadow: 0 4px 18px rgba(0,0,0,0.03);
                display: flex; flex-direction: column; justify-content: space-between;
              ">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <span class="badge badge-orange" style="font-size: 0.72rem; font-weight: 800;">${loc.propertiesCount}+ LISTED PLOTS & RESIDENCES</span>
                    <i class="ri-map-pin-2-fill" style="color: var(--color-orange, #eb5e28); font-size: 1.2rem;"></i>
                  </div>
                  <h3 style="font-family: var(--font-serif); font-size: 1.35rem; font-weight: 700; color: #1a1a1a; margin-bottom: 6px;">
                    ${loc.name}
                  </h3>
                  <p style="font-size: 0.85rem; font-weight: 600; color: var(--color-orange, #eb5e28); margin-bottom: 10px;">
                    ${loc.tagline}
                  </p>
                  <p style="font-size: 0.9rem; color: #666; line-height: 1.5; margin-bottom: 16px;">
                    ${loc.description}
                  </p>
                </div>

                <div style="padding-top: 14px; border-top: 1px solid rgba(0,0,0,0.06); font-size: 0.82rem; color: #777;">
                  <strong>Key Corridors:</strong> ${loc.popularAreas.slice(0, 3).join(', ')}
                </div>
              </div>
            `).join('')}
          </div>

          <div style="text-align: center; margin-top: 44px;">
            <button class="btn btn-outline-dark story-explore-districts-btn" style="padding: 12px 32px; border-radius: 10px; font-size: 0.95rem;">
              <i class="ri-compass-3-line"></i> Filter Properties by District in Discover
            </button>
          </div>
        </div>
      </section>

      <!-- 4. WHAT DEFINES US (4 PILLARS) -->
      <section style="padding: 90px 0; background: #ffffff; border-top: 1px solid rgba(0,0,0,0.05);">
        <div class="container">
          <div style="text-align: center; max-width: 680px; margin: 0 auto 60px auto;">
            <span class="eyebrow" style="color: var(--color-orange, #eb5e28); font-weight: 800; letter-spacing: 0.12em;">THE PILLARS OF THANJAI</span>
            <h2 class="heading-section" style="margin-top: 12px;">
              What Defines Our Portfolio
            </h2>
            <p style="color: #666; font-size: 1.05rem; margin-top: 12px; line-height: 1.6;">
              Every property accepted into our collection must meet four non-negotiable criteria.
            </p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 28px;">
            <!-- Pillar 1 -->
            <div class="pillar-box" style="
              background: #faf8f5; padding: 32px 28px; border-radius: 20px;
              border: 1px solid rgba(0,0,0,0.06); box-shadow: 0 4px 18px rgba(0,0,0,0.03);
            ">
              <div style="
                width: 52px; height: 52px; border-radius: 14px; background: rgba(235, 94, 40, 0.12);
                color: var(--color-orange, #eb5e28); display: flex; align-items: center; justify-content: center;
                font-size: 1.5rem; margin-bottom: 20px;
              ">
                <i class="ri-map-pin-2-fill"></i>
              </div>
              <h3 style="font-family: var(--font-serif); font-size: 1.3rem; font-weight: 700; color: #1a1a1a; margin-bottom: 12px;">
                Thoughtful Locations
              </h3>
              <p style="font-size: 0.92rem; color: #666; line-height: 1.6;">
                Prime positions in Thanjavur, Kaveri Delta, Trichy, Madurai, and coastal Chennai chosen for connectivity and high-growth potential.
              </p>
            </div>

            <!-- Pillar 2 -->
            <div class="pillar-box" style="
              background: #faf8f5; padding: 32px 28px; border-radius: 20px;
              border: 1px solid rgba(0,0,0,0.06); box-shadow: 0 4px 18px rgba(0,0,0,0.03);
            ">
              <div style="
                width: 52px; height: 52px; border-radius: 14px; background: rgba(235, 94, 40, 0.12);
                color: var(--color-orange, #eb5e28); display: flex; align-items: center; justify-content: center;
                font-size: 1.5rem; margin-bottom: 20px;
              ">
                <i class="ri-draft-fill"></i>
              </div>
              <h3 style="font-family: var(--font-serif); font-size: 1.3rem; font-weight: 700; color: #1a1a1a; margin-bottom: 12px;">
                Exceptional Design
              </h3>
              <p style="font-size: 0.92rem; color: #666; line-height: 1.6;">
                Architectural excellence blending classic Dravidian courtyard elements with modern VRV automation, floor-to-ceiling glass, and natural light.
              </p>
            </div>

            <!-- Pillar 3 -->
            <div class="pillar-box" style="
              background: #faf8f5; padding: 32px 28px; border-radius: 20px;
              border: 1px solid rgba(0,0,0,0.06); box-shadow: 0 4px 18px rgba(0,0,0,0.03);
            ">
              <div style="
                width: 52px; height: 52px; border-radius: 14px; background: rgba(235, 94, 40, 0.12);
                color: var(--color-orange, #eb5e28); display: flex; align-items: center; justify-content: center;
                font-size: 1.5rem; margin-bottom: 20px;
              ">
                <i class="ri-shield-check-fill"></i>
              </div>
              <h3 style="font-family: var(--font-serif); font-size: 1.3rem; font-weight: 700; color: #1a1a1a; margin-bottom: 12px;">
                Legal Patta Assurance
              </h3>
              <p style="font-size: 0.92rem; color: #666; line-height: 1.6;">
                100% verified legal titles, clear Patta records, and DTCP/RERA approvals so buyers invest with total peace of mind.
              </p>
            </div>

            <!-- Pillar 4 -->
            <div class="pillar-box" style="
              background: #faf8f5; padding: 32px 28px; border-radius: 20px;
              border: 1px solid rgba(0,0,0,0.06); box-shadow: 0 4px 18px rgba(0,0,0,0.03);
            ">
              <div style="
                width: 52px; height: 52px; border-radius: 14px; background: rgba(235, 94, 40, 0.12);
                color: var(--color-orange, #eb5e28); display: flex; align-items: center; justify-content: center;
                font-size: 1.5rem; margin-bottom: 20px;
              ">
                <i class="ri-line-chart-fill"></i>
              </div>
              <h3 style="font-family: var(--font-serif); font-size: 1.3rem; font-weight: 700; color: #1a1a1a; margin-bottom: 12px;">
                Long-Term Wealth
              </h3>
              <p style="font-size: 0.92rem; color: #666; line-height: 1.6;">
                Focus on assets that deliver stable capital appreciation and generational security for families and NRI investors.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- 5. CLOSING CTA -->
      <section style="padding: 100px 0; background: #2A1808; color: #ffffff; text-align: center;">
        <div class="container" style="max-width: 760px;">
          <span class="eyebrow eyebrow-dark" style="margin-bottom: 16px;">BEGIN YOUR JOURNEY</span>
          <h2 class="heading-display-light" style="font-size: clamp(2rem, 4vw, 3.2rem); margin-bottom: 20px; color: #ffffff;">
            Ready to Find Your Place?
          </h2>
          <p style="color: rgba(255,255,255,0.85); font-size: 1.1rem; line-height: 1.6; margin-bottom: 36px;">
            Explore our curated portfolio of architectural villas, Kaveri farmlands, and DTCP plot layouts across Tamil Nadu.
          </p>

          <button class="btn btn-primary story-discover-btn" id="story-cta-discover-btn" style="padding: 16px 36px; font-size: 1.05rem; border-radius: 12px;">
            <span>Discover Our Properties</span>
            <i class="ri-arrow-right-line"></i>
          </button>
        </div>
      </section>

    </div>
  `;
}

export function initOurStoryListeners(onNavigateToDiscover) {
  document.getElementById('story-cta-discover-btn')?.addEventListener('click', onNavigateToDiscover);
  document.querySelector('.story-explore-districts-btn')?.addEventListener('click', onNavigateToDiscover);
}
