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
            Founded in 2009, Thanjai Property began its journey in Thanjavur with a simple vision — to make property discovery more transparent, accessible and reliable. Today, we help buyers, sellers, investors and property owners explore residential properties, plots, agricultural land and commercial opportunities across Tamil Nadu. With strong local knowledge and a customer-first approach, we continue to connect people with property opportunities that match their needs and long-term goals.
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
                We believe finding the right property is about more than location and price. It requires the right information, clear communication and an understanding of the property's potential. Our approach combines local real-estate knowledge, property information and modern digital search to make the property journey simpler and more informed.
              </p>

              <!-- 3 Philosophy Value Cards -->
              <div style="display: flex; flex-direction: column; gap: 16px;">
                <div style="background: #faf8f5; border-left: 4px solid #eb5e28; padding: 16px 20px; border-radius: 0 12px 12px 0;">
                  <strong style="font-size: 1rem; color: #1a1a1a; display: block; margin-bottom: 4px;">Trust</strong>
                  <span style="font-size: 0.9rem; color: #555; line-height: 1.5;">We believe property decisions should begin with clear and relevant information.</span>
                </div>
                <div style="background: #faf8f5; border-left: 4px solid #eb5e28; padding: 16px 20px; border-radius: 0 12px 12px 0;">
                  <strong style="font-size: 1rem; color: #1a1a1a; display: block; margin-bottom: 4px;">Local Expertise</strong>
                  <span style="font-size: 0.9rem; color: #555; line-height: 1.5;">Our roots in Thanjavur and our presence across Tamil Nadu help us understand diverse property markets and locations.</span>
                </div>
                <div style="background: #faf8f5; border-left: 4px solid #eb5e28; padding: 16px 20px; border-radius: 0 12px 12px 0;">
                  <strong style="font-size: 1rem; color: #1a1a1a; display: block; margin-bottom: 4px;">Long-Term Value</strong>
                  <span style="font-size: 0.9rem; color: #555; line-height: 1.5;">We look beyond the immediate transaction and focus on properties that can support future plans and investment goals.</span>
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
              <div style="
                position: absolute; bottom: -24px; left: -24px; background: #2A1808; color: #F8F4EC;
                padding: 24px 28px; border-radius: 16px; max-width: 280px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);
              ">
                <div style="font-family: var(--font-serif); font-size: 2.2rem; font-weight: 700; color: var(--color-orange, #eb5e28);">Since 2009</div>
                <div style="font-size: 0.85rem; font-weight: 600; opacity: 0.9; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px;">
                  15+ Years of Dedicated Real Estate Service
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
                  S. Vijayaraghavan has been instrumental in shaping the vision of Thanjai Property since its foundation in 2009. He oversees administrative operations, corporate governance, legal title verification, and Patta clearance standards, ensuring every transaction delivers unmatched legal security, transparency, and clarity for property buyers across Tamil Nadu.
                </p>
              </div>

              <div style="padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.12); display: flex; gap: 10px; flex-wrap: wrap;">
                <a href="tel:+919578311506" style="flex: 1; background: #eb5e28; color: #fff; padding: 12px 16px; border-radius: 12px; font-size: 0.88rem; font-weight: 700; text-decoration: none; text-align: center; display: inline-flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 4px 14px rgba(235,94,40,0.3);">
                  <i class="ri-phone-line"></i> +91 95783 11506
                </a>
                <a href="mailto:vijayaraghavan@thanjaiproperty.com" style="flex: 1; background: rgba(255,255,255,0.12); color: #fff; padding: 12px 16px; border-radius: 12px; font-size: 0.88rem; font-weight: 700; text-decoration: none; text-align: center; display: inline-flex; align-items: center; justify-content: center; gap: 6px;">
                  <i class="ri-mail-line"></i> Direct Email
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
                  <h3 style="font-family: var(--font-serif); font-size: 1.75rem; font-weight: 700; color: #ffffff; line-height: 1.25; margin-bottom: 6px;">Radhakrishnan</h3>
                  <p style="font-size: 0.92rem; color: #38a169; font-weight: 800; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">Co-Partner</p>
                </div>

                <!-- Justified Bio Text -->
                <p style="font-size: 0.92rem; color: rgba(255,255,255,0.85); line-height: 1.75; margin-bottom: 22px; text-align: justify; text-justify: inter-word;">
                  Radhakrishnan drives strategic sales, client relations, property marketing, and buyer advisory operations across Tamil Nadu. His dynamic approach brings buyers, plot investors, and NRI clients closer to prime real estate opportunities, guiding every customer with tailored property selection, site visit coordination, and market insights.
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

      <!-- 4. OUR DISTRICT PRESENCE SECTION (VISUAL CITY DESTINATION CARDS) -->
      <section style="padding: 95px 0; background: #faf8f5; border-top: 1px solid rgba(0,0,0,0.05);">
        <div class="container">
          <div style="text-align: center; max-width: 760px; margin: 0 auto 55px auto;">
            <span class="eyebrow" style="color: var(--color-orange, #eb5e28); font-weight: 800; letter-spacing: 0.12em;">OUR DISTRICT PRESENCE</span>
            <h2 class="heading-section" style="margin-top: 12px; font-size: clamp(2rem, 3.5vw, 2.8rem);">
              Property Opportunities Across Tamil Nadu
            </h2>
            <p style="color: #666; font-size: 1.05rem; margin-top: 12px; line-height: 1.65;">
              From established cities to emerging locations, Tamil Nadu offers diverse opportunities for homebuyers, investors and property owners. Thanjai Property helps users explore properties across key locations based on their preferred district, property type and requirements.
            </p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 28px;">
            <!-- Thanjavur (Home Base) -->
            <div class="hover-lift" style="
              background: #ffffff; border-radius: 22px; padding: 28px;
              border: 1px solid rgba(235,94,40,0.25); box-shadow: 0 6px 20px rgba(235,94,40,0.06);
              display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden;
              transition: all 0.35s ease;
            ">
              <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: #eb5e28;"></div>
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                  <span style="background: rgba(235,94,40,0.12); color: #eb5e28; font-size: 0.72rem; font-weight: 800; padding: 5px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.06em;">
                    HOME BASE
                  </span>
                  <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(235,94,40,0.1); color: #eb5e28; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
                    <i class="ri-government-line"></i>
                  </div>
                </div>
                <h3 style="font-family: var(--font-serif); font-size: 1.45rem; font-weight: 700; color: #1a1a1a; margin-bottom: 8px;">Thanjavur</h3>
                <p style="font-size: 0.92rem; color: #555; line-height: 1.6; margin: 0;">Our home base, with opportunities across residential properties, plots, farmland and commercial spaces.</p>
              </div>
            </div>

            <!-- Trichy (Central Corridor) -->
            <div class="hover-lift" style="
              background: #ffffff; border-radius: 22px; padding: 28px;
              border: 1px solid rgba(56,161,105,0.25); box-shadow: 0 6px 20px rgba(56,161,105,0.06);
              display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden;
              transition: all 0.35s ease;
            ">
              <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: #38a169;"></div>
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                  <span style="background: rgba(56,161,105,0.12); color: #38a169; font-size: 0.72rem; font-weight: 800; padding: 5px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.06em;">
                    CENTRAL CORRIDOR
                  </span>
                  <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(56,161,105,0.1); color: #38a169; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
                    <i class="ri-building-2-line"></i>
                  </div>
                </div>
                <h3 style="font-family: var(--font-serif); font-size: 1.45rem; font-weight: 700; color: #1a1a1a; margin-bottom: 8px;">Trichy</h3>
                <p style="font-size: 0.92rem; color: #555; line-height: 1.6; margin: 0;">A growing central Tamil Nadu market with residential and commercial property opportunities.</p>
              </div>
            </div>

            <!-- Madurai (Cultural & Commercial) -->
            <div class="hover-lift" style="
              background: #ffffff; border-radius: 22px; padding: 28px;
              border: 1px solid rgba(128,90,213,0.25); box-shadow: 0 6px 20px rgba(128,90,213,0.06);
              display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden;
              transition: all 0.35s ease;
            ">
              <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: #805ad5;"></div>
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                  <span style="background: rgba(128,90,213,0.12); color: #805ad5; font-size: 0.72rem; font-weight: 800; padding: 5px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.06em;">
                    CULTURAL HUB
                  </span>
                  <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(128,90,213,0.1); color: #805ad5; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
                    <i class="ri-ancient-gate-line"></i>
                  </div>
                </div>
                <h3 style="font-family: var(--font-serif); font-size: 1.45rem; font-weight: 700; color: #1a1a1a; margin-bottom: 8px;">Madurai</h3>
                <p style="font-size: 0.92rem; color: #555; line-height: 1.6; margin: 0;">A major cultural and commercial centre offering diverse residential and investment possibilities.</p>
              </div>
            </div>

            <!-- Chennai (Metropolitan Market) -->
            <div class="hover-lift" style="
              background: #ffffff; border-radius: 22px; padding: 28px;
              border: 1px solid rgba(49,130,206,0.25); box-shadow: 0 6px 20px rgba(49,130,206,0.06);
              display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden;
              transition: all 0.35s ease;
            ">
              <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: #3182ce;"></div>
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                  <span style="background: rgba(49,130,206,0.12); color: #3182ce; font-size: 0.72rem; font-weight: 800; padding: 5px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.06em;">
                    METROPOLITAN
                  </span>
                  <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(49,130,206,0.1); color: #3182ce; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
                    <i class="ri-hotel-line"></i>
                  </div>
                </div>
                <h3 style="font-family: var(--font-serif); font-size: 1.45rem; font-weight: 700; color: #1a1a1a; margin-bottom: 8px;">Chennai</h3>
                <p style="font-size: 0.92rem; color: #555; line-height: 1.6; margin: 0;">A leading metropolitan property market with opportunities across residential and commercial segments.</p>
              </div>
            </div>

            <!-- Coimbatore (Industrial Hub) -->
            <div class="hover-lift" style="
              background: #ffffff; border-radius: 22px; padding: 28px;
              border: 1px solid rgba(221,107,32,0.25); box-shadow: 0 6px 20px rgba(221,107,32,0.06);
              display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden;
              transition: all 0.35s ease;
            ">
              <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: #dd6b20;"></div>
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                  <span style="background: rgba(221,107,32,0.12); color: #dd6b20; font-size: 0.72rem; font-weight: 800; padding: 5px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.06em;">
                    INDUSTRIAL HUB
                  </span>
                  <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(221,107,32,0.1); color: #dd6b20; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
                    <i class="ri-factory-line"></i>
                  </div>
                </div>
                <h3 style="font-family: var(--font-serif); font-size: 1.45rem; font-weight: 700; color: #1a1a1a; margin-bottom: 8px;">Coimbatore</h3>
                <p style="font-size: 0.92rem; color: #555; line-height: 1.6; margin: 0;">A growing business and residential destination with diverse property options.</p>
              </div>
            </div>

            <!-- Kumbakonam (Cauvery Delta) -->
            <div class="hover-lift" style="
              background: #ffffff; border-radius: 22px; padding: 28px;
              border: 1px solid rgba(43,108,176,0.25); box-shadow: 0 6px 20px rgba(43,108,176,0.06);
              display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden;
              transition: all 0.35s ease;
            ">
              <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: #2b6cb0;"></div>
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                  <span style="background: rgba(43,108,176,0.12); color: #2b6cb0; font-size: 0.72rem; font-weight: 800; padding: 5px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.06em;">
                    CAUVERY DELTA
                  </span>
                  <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(43,108,176,0.1); color: #2b6cb0; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
                    <i class="ri-landscape-line"></i>
                  </div>
                </div>
                <h3 style="font-family: var(--font-serif); font-size: 1.45rem; font-weight: 700; color: #1a1a1a; margin-bottom: 8px;">Kumbakonam</h3>
                <p style="font-size: 0.92rem; color: #555; line-height: 1.6; margin: 0;">A prominent Cauvery Delta location with residential, land and agricultural property opportunities.</p>
              </div>
            </div>
          </div>

          <div style="text-align: center; margin-top: 48px;">
            <button class="btn btn-primary story-explore-districts-btn" style="padding: 15px 38px; border-radius: 12px; font-size: 1rem; box-shadow: 0 6px 20px rgba(235,94,40,0.3);">
              <i class="ri-compass-3-line" style="font-size: 1.2rem;"></i>
              <span>Explore Properties by Location</span>
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
  document.getElementById('story-cta-post-btn')?.addEventListener('click', () => {
    window.location.href = '/user-dashboard.html';
  });
}

