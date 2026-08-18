export function renderPrivacyView() {
  return `
    <div class="view-enter privacy-view" style="background: #f8fafc; user-select: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none;">
      <!-- Dark Luxury Header -->
      <section style="background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); padding: 140px 0 80px; color: white;">
        <div class="container">
          
          <div style="display: inline-flex; align-items: center; gap: 8px; color: #ff6b6b; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 24px;">
            <i class="ri-scales-3-line"></i> LEGAL & POLICY
          </div>

          <h1 style="font-family: var(--font-primary, 'DM Serif Display', serif); font-size: 3rem; line-height: 1.2; margin-bottom: 24px; color: #ffffff;">
            Privacy Policy
          </h1>

          <p style="font-size: 1.1rem; color: rgba(255, 255, 255, 0.7); line-height: 1.6; max-width: 800px; margin-bottom: 40px;">
            The rules that govern how you list, browse, and transact on Thanjai Property<br>
            — written plainly, so there are no surprises.
          </p>

          <div style="display: flex; flex-wrap: wrap; gap: 16px;">
            <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); padding: 8px 16px; border-radius: 30px; font-size: 0.9rem; color: rgba(255,255,255,0.8);">
              <i class="ri-government-line" style="color: #ff6b6b;"></i> Thanjai Property, Thanjavur
            </div>
            <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); padding: 8px 16px; border-radius: 30px; font-size: 0.9rem; color: rgba(255,255,255,0.8);">
              <i class="ri-refresh-line" style="color: #ff6b6b;"></i> Reviewed periodically
            </div>
            <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); padding: 8px 16px; border-radius: 30px; font-size: 0.9rem; color: rgba(255,255,255,0.8);">
              <i class="ri-mail-line" style="color: #ff6b6b;"></i> thanjaiproperty@gmail.com
            </div>
          </div>
        </div>
      </section>

      <!-- Privacy Content Section with Sidebar -->
      <section style="padding: 60px 0 100px;">
        <div class="container" style="display: grid; grid-template-columns: 300px 1fr; gap: 64px; align-items: start;">
          
          <!-- Sticky Sidebar -->
          <aside style="position: sticky; top: 120px; background: #ffffff; padding: 32px; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 10px 30px rgba(0,0,0,0.03);">
            <h4 style="font-family: var(--font-primary, 'DM Serif Display', serif); font-size: 1.25rem; color: var(--color-dark, #0f172a); margin-bottom: 24px; border-bottom: 2px solid var(--color-orange, #eb5e28); padding-bottom: 12px; display: inline-block;">
              Quick Navigation
            </h4>
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 16px; font-size: 0.95rem; font-weight: 500;">
              <li><a href="#privacy-info" class="privacy-nav-link">1. Information Collection</a></li>
              <li><a href="#privacy-cookies" class="privacy-nav-link">2. Use of Cookies</a></li>
              <li><a href="#privacy-liability" class="privacy-nav-link">3. Limitation of Liability</a></li>
              <li><a href="#privacy-changes" class="privacy-nav-link">4. Notification of Changes</a></li>
            </ul>
          </aside>

          <!-- Main Content -->
          <div id="privacy-scroll-container" style="background: #ffffff; padding: 48px; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 10px 30px rgba(0,0,0,0.03); font-family: var(--font-secondary, 'Inter', sans-serif); color: #475569; line-height: 1.8; font-size: 1.05rem; height: calc(100vh - 160px); overflow-y: auto; position: sticky; top: 120px;">
            
            <style>
              .privacy-nav-link {
                color: #475569;
                text-decoration: none;
                transition: all 0.2s ease;
                display: block;
              }
              .privacy-nav-link:hover {
                color: var(--color-orange, #eb5e28);
              }
              .privacy-nav-link.active-privacy-link {
                color: var(--color-orange, #eb5e28);
                font-weight: 700;
                transform: translateX(4px);
              }
              .privacy-heading {
                font-family: var(--font-primary, 'DM Serif Display', serif);
                color: var(--color-dark, #0f172a);
                font-size: 2rem;
                margin: 64px 0 24px;
                display: flex;
                align-items: center;
                gap: 16px;
              }
              .privacy-heading::before {
                content: '';
                display: block;
                width: 32px;
                height: 4px;
                background-color: var(--color-orange, #eb5e28);
                border-radius: 2px;
              }
              .privacy-para {
                margin-bottom: 24px;
              }
            </style>

            <h3 id="privacy-info" class="privacy-heading" style="margin-top: 0;">Information Collection</h3>
            <p class="privacy-para">In Thanjai Property's site we do not collect any personal information like email address or name. Thanjai Property's site provides information about the Product and Services offered by Thanjai Property's, Thanjavur. For more information of Products and Services we highly recommend to send email to thanjaiproperty@gmail.com Upon the request we will use your email address to further communicate with you. We will not sell or share this information to any third party.</p>

            <h3 id="privacy-cookies" class="privacy-heading">Use of Cookies</h3>
            <p class="privacy-para">Cookies are used to measure the number of visits, page views, average time spent, relating to your use of Thanjai Property's site. We are not collecting any personal information through these cookies. We also recommend you to set your browser to notify you when you receive a cookie or to prevent cookies from being sent.</p>

            <h3 id="privacy-liability" class="privacy-heading">Limitation of Liability</h3>
            <p class="privacy-para">Thanjai Property's WILL NOT BE LIABLE FOR ANY LOST PROFITS, ANY DAMAGES, THAT ARISE OUT THIS WEBSITE OR ANY LINKED WEBSITE. THANJAI PROPERTY'S IS NOT RESPONSIBLE FOR THE PRIVACY PRACTIES OR THE CONTENT OF SUCH WEBSITES.</p>
            <p class="privacy-para">If you have any questions regarding this privacy statement of Thanjai Property's send an email to thanjaiproperty@gmail.com</p>

            <h3 id="privacy-changes" class="privacy-heading">Notification of Changes</h3>
            <p class="privacy-para">Thanjai Property.com may modify this policy from time to time. Any amendment on privacy policy will be updated on our website time to time for your reference.</p>
            
            <div style="background: rgba(235, 94, 40, 0.05); border-left: 4px solid var(--color-orange, #eb5e28); padding: 32px; margin-top: 64px; border-radius: 4px;">
              <p style="margin: 0; font-family: var(--font-primary, 'DM Serif Display', serif); font-size: 1.5rem; color: #0f172a; margin-bottom: 12px;">Questions about these terms?</p>
              <p style="margin: 0; color: #475569; font-size: 1.1rem;">Write to <a href="mailto:vijayaraghavan@thanjaiproperty.com" style="color: var(--color-orange, #eb5e28); text-decoration: none; font-weight: 500;">vijayaraghavan@thanjaiproperty.com</a> or call <strong style="color: #0f172a;">+91 95783 11506</strong>.</p>
            </div>

          </div>
        </div>
      </section>
    </div>
  `;
}

export function initPrivacyListeners() {
  const privacyView = document.querySelector('.privacy-view');
  if (privacyView) {
    privacyView.addEventListener('copy', (e) => e.preventDefault());
    privacyView.addEventListener('cut', (e) => e.preventDefault());
    privacyView.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  const sidebarLinks = document.querySelectorAll('.privacy-view aside a');
  
  // Handle click to scroll and active state
  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Remove active class from all
      sidebarLinks.forEach(l => l.classList.remove('active-privacy-link'));
      // Add active class to clicked
      link.classList.add('active-privacy-link');

      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
        history.pushState(null, null, `#${targetId}`);
      }
    });
  });

  // Handle active state on scroll using IntersectionObserver
  const headings = document.querySelectorAll('.privacy-heading');
  const scrollContainer = document.getElementById('privacy-scroll-container');
  const observerOptions = {
    root: scrollContainer,
    rootMargin: '-20px 0px -80% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        sidebarLinks.forEach(link => {
          link.classList.remove('active-privacy-link');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active-privacy-link');
          }
        });
      }
    });
  }, observerOptions);

  headings.forEach(heading => {
    if (heading.getAttribute('id')) {
      observer.observe(heading);
    }
  });
}
