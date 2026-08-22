export function renderTermsView() {
  return `
    <div class="view-enter terms-view" style="background: #f8fafc;">
      <!-- Dark Luxury Header -->
      <section style="background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); padding: 140px 0 80px; color: white;">
        <div class="container">
          
          <div style="display: inline-flex; align-items: center; gap: 8px; color: #ff6b6b; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 24px;">
            <i class="ri-scales-3-line"></i> LEGAL & POLICY
          </div>

          <h1 style="font-family: var(--font-primary, 'DM Serif Display', serif); font-size: 3rem; line-height: 1.2; margin-bottom: 24px; color: #ffffff;">
            Terms of Use & Policies
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

      <!-- Terms Content Section with Sidebar -->
      <section style="padding: 60px 0 100px;">
        <div class="container" style="display: grid; grid-template-columns: 300px 1fr; gap: 64px; align-items: start;">
          
          <!-- Sticky Sidebar -->
          <aside style="position: sticky; top: 120px; background: #ffffff; padding: 32px; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 10px 30px rgba(0,0,0,0.03);">
            <h4 style="font-family: var(--font-primary, 'DM Serif Display', serif); font-size: 1.25rem; color: var(--color-dark, #0f172a); margin-bottom: 24px; border-bottom: 2px solid var(--color-orange, #eb5e28); padding-bottom: 12px; display: inline-block;">
              Quick Navigation
            </h4>
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 16px; font-size: 0.95rem; font-weight: 500;">
              <li><a href="#term-agreement" class="term-nav-link">1. Agreement & Definitions</a></li>
              <li><a href="#term-fees" class="term-nav-link">2. Subscription Fees & Payment</a></li>
              <li><a href="#term-cancellation" class="term-nav-link">3. Cancellation</a></li>
              <li><a href="#term-prohibited" class="term-nav-link">4. Prohibited Actions</a></li>
              <li><a href="#term-security" class="term-nav-link">5. Confidentiality & Security</a></li>
              <li><a href="#term-termination" class="term-nav-link">6. Termination & Suspension</a></li>
              <li><a href="#term-disclaimer" class="term-nav-link">7. Disclaimer & Liability</a></li>
              <li><a href="#term-privacy" class="term-nav-link">8. Privacy Policy</a></li>
              <li><a href="#term-misc" class="term-nav-link">9. Miscellaneous</a></li>
            </ul>
          </aside>

          <!-- Main Content -->
          <div id="terms-scroll-container" style="background: #ffffff; padding: 48px; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 10px 30px rgba(0,0,0,0.03); font-family: var(--font-secondary, 'Inter', sans-serif); color: #475569; line-height: 1.8; font-size: 1.05rem;">
            
            <p style="font-size: 1.15rem; color: #0f172a; font-weight: 500; margin-bottom: 40px; padding-bottom: 24px; border-bottom: 1px solid #e2e8f0;">
              Thanjai property Real Estate Land Promoters and Constructions in Thanjavur to buy sale and house land plot commercial industrial apartment. Unless otherwise specified, the capitalized words shall have the meanings as defined herein below:
            </p>

            <style>
              .term-nav-link {
                color: #475569;
                text-decoration: none;
                transition: all 0.2s ease;
                display: block;
              }
              .term-nav-link:hover {
                color: var(--color-orange, #eb5e28);
              }
              .term-nav-link.active-term-link {
                color: var(--color-orange, #eb5e28);
                font-weight: 700;
                transform: translateX(4px);
              }
              .term-heading {
                font-family: var(--font-primary, 'DM Serif Display', serif);
                color: var(--color-dark, #0f172a);
                font-size: 2rem;
                margin: 64px 0 24px;
                display: flex;
                align-items: center;
                gap: 16px;
              }
              .term-heading::before {
                content: '';
                display: block;
                width: 32px;
                height: 4px;
                background-color: var(--color-orange, #eb5e28);
                border-radius: 2px;
              }
              .term-para {
                margin-bottom: 24px;
              }
            </style>

            <h3 id="term-agreement" class="term-heading" style="margin-top: 0;">Agreement & Definitions</h3>
            <p class="term-para"><strong>Agreement:</strong> Shall mean and include the completed application form, its attachment(s) and the terms and conditions stated herein.</p>
            <p class="term-para"><strong>Date of Commencement:</strong> Is the date indicating the acceptance of the application by the Client to the service. It shall be specified by the company in its notice to the Client either through e-mail or conventional mail. Words referring to masculine include the feminine and the singular include the plural and vice versa as the context admits or requires; and Words importing persons includes individuals, bodies corporate and unincorporated.</p>
            <p class="term-para"><strong>Registration Data:</strong> Is the database of all the particulars and information supplied by the Client on initial application and subscription, including but without limiting to the Client's name, telephone number, mailing address, account and email address.</p>
            <p class="term-para"><strong>My Subscriptions:</strong> Contains time to time information and description of the Services for the Client provided by the Company in writing or contained in the website Thanjaiproperty.com</p>
            <p class="term-para"><strong>Date of Termination:</strong> Is the date of expiry mentioned in the notice or/and the letter of termination.</p>
            <p class="term-para"><strong>Changes:</strong> We may periodically change the Terms and the Site without notice, and you are responsible for checking these Terms periodically for revisions. All amended Terms become effective upon our posting to the Site, and any use of the site after such revisions have been posted signifies your consent to the changes.</p>
            <p class="term-para"><strong>Services:</strong> Service to the Client wishing to post their profile or listing for the purpose of sale/rental of their property, and for Client providing property services etc., and its Internet links. Service to the Client who wishes to receive advertisements and promotional messages on www.Thanjaiproperty.com and through emails.</p>
            <p class="term-para"><strong>Thanjaiproperty.com:</strong> Is defined as the Internet web site of the Company at Thanjavur.</p>

            <h3 id="term-fees" class="term-heading">Subscription Fees & Payment</h3>
            <p class="term-para"><strong>Subscription Fees:</strong> The applicable rate of the Subscription Fees for the Service provided shall be such as mentioned in the "My Subscriptions" page or as may be prescribed by the Company from time to time Liability for the Subscription Fees shall accrue from the Date of Commencement. All individual Client who access or make postings of information at Thanjaiproperty.com for the purpose of buying property shall be exempted from the application of this clause.</p>
            <p class="term-para"><strong>Payment:</strong> The Subscription Fees shall be paid by the Client on demand. In case the Client disputes the same for any reason whatsoever, he shall make the payment towards the Subscription Fees accrued subject to the decision of the Company on the dispute. In the event of Company's deciding the dispute in the Client's favour, the Company shall refund to the Client any excess amount paid by the Client free of interest. Any delay in the payment by the Client of any sums due under this Agreement, the Company shall have the right to charge interest on the outstanding amount from the date the payment became due until the date of final payment by the Client.</p>

            <h3 id="term-cancellation" class="term-heading">Cancellation</h3>
            <p class="term-para">Thanjaiproperty.com shall reserve the exclusive right to cancel any content whatsoever from being published or reflected on its website or in any other mode. The cancellation charges payable to the Client shall be at the applicable rates laid down in the cancellation and refund policy. For Premium listing packages, there shall be no cancellation or refund of orders booked / payments made via online payment options (except in the case of Cheque & Demand Draft). Cancellations requests for orders placed via cheque/demand draft can be made only before such payment is realized by Thanjaiproperty.com. Obligations of Client/Subscriber (Client) The accuracy of the Registration Data given to Thanjaiproperty.com on initial application for the Service shall be the sole responsibility of the Client. The Client will ensure compliance with all notices or instructions given by the Company from time to time to enable the use of the Service. The Client shall be solely responsible for all information retrieved, stored and transmitted through the Service by him. Any licenses or other rights as may be required for using the Service shall be obtained by the Client at his own cost. Client is responsible for all applicable taxes and for all costs that are incurred in using the Thanjaiproperty.com service.</p>

            <h3 id="term-prohibited" class="term-heading">Prohibited Actions</h3>
            <p class="term-para">Client is restrained from allowing any person other than the authorized person(s) named in the application form to use the Service. The Client undertakes not to resell or assign his/her rights or obligations under these Terms & Conditions. Client also agrees not to make any unauthorized commercial use of the Service. The Client shall use the Service only for the purpose for which it is subscribed. The Client shall comply with all applicable laws (and shall not contravene any applicable law) of India relating to the Services, including any regulation made pursuant thereto.</p>
            <p class="term-para">The Client shall not to print, download, duplicate or otherwise copy, delete, vary or amend or use any data or personal information posted by any Client on Thanjaiproperty.com except such data and information which is posted by the particular Client himself. The Client shall not share the Service with any person without the prior written approval of the Company. The Client shall not use the Service for any unlawful purpose including without limitation criminal purposes.</p>

            <h3 id="term-security" class="term-heading">Confidentiality & Security</h3>
            <p class="term-para">To protect the secrecy of his Client Identification and/or password the Client shall take all such measures as may be necessary (including but without limiting to changing his password from time to time and shall not reveal the same to any other person(s). Since a Client identification is necessary to access the Service; the Client shall use only his own Client Identification. It is agreed by the Client that he acquire s no rights to any mailbox number or/and the Client identification or/and circuit reference or/and any codes assigned to him by the Company.</p>
            <p class="term-para">The Company may at its sole discretion and without assigning any reason whatsoever at any time deactivate or/and suspend the Client's access to Thanjaiproperty.com and/or the Services (as the case may be) without notice to carry out system maintenance or/and upgrading or/and testing or/and repairs or/and other related work. Without prejudice to any other provisions of this Agreement, the Company shall not be liable for any loss or/and damage or/and costs or/and expense that the Client may suffer or incur, and no fees or/and charges payable by the Client to the Company shall be deducted or refunded or rebated, as a result of such deactivation or/and suspension.</p>

            <h3 id="term-termination" class="term-heading">Termination & Suspension</h3>
            <p class="term-para">Either party to this agreement may terminate this Agreement by giving prior notice of 30 days in writing. It shall be on the discretion of the Company that the period of notice of 30 days may be waived or a shorter period of notice may be accepted in writing from the Client. However, the Company irrespective of any clause above may terminate this Agreement with immediate effect, without prior notice to the Client and without assigning any reason/s whatsoever.</p>
            <p class="term-para">If any monies payable by the Client to the Company are not paid on the due date, the Company may without prejudice to any other rights or remedies that may be available to it suspend the Service provided to the Client. When the Service subscribed for is suspended, it shall be deemed to be terminated. The date shall be such as stipulated by the Company and the Client shall be liable for all the charges and fees incurred upto the date.</p>

            <h3 id="term-disclaimer" class="term-heading">Disclaimer & Liability</h3>
            <p class="term-para">The Client shall agree that use of the service e is at the Client's sole risk. The service is provided on an "as is" or/and on an "as available" basis. Thanjaiproperty.com expressly disclaims all warranties of any kind, whether express or implied, including, but not limited to the implied warranties of merchantability, fitness for a particular purpose and non-infringement. Thanjaiproperty.com makes no warranty that the service shall meet Client's requirements, that the service shall be uninterrupted or/and timely or/and secure or/and error free.</p>
            <p class="term-para">Client agrees that neither Thanjaiproperty.com nor any of its providers of information shall be liable for any direct or/and indirect or/and incidental or/and special or/and consequential or/and exemplary damages, resulting from the use or/and the inability to use the service or/and for cost of procurement of substitute goods or/and services or resulting from any goods or/and data or/and information or/and services purchased or/and obtained or/and messages received or/and transactions entered into through or/and from the service or/and resulting from unauthorized access to or/and alteration of Client's transmissions or/and data.</p>

            <h3 id="term-privacy" class="term-heading">Privacy Policy</h3>
            <p class="term-para">Thanjaiproperty.com respects the privacy of its Client and is committed to its protection Thanjaiproperty.com through its various advertising campaigns collects information about the Client. This information is voluntarily provided by the Client and is collected in the database of Thanjaiproperty.com. The information so collected in the database through these campaigns refers to the property details, email address and names of the Client. Thanjaiproperty.com uses third-party advertising companies to display/serve their ads on various other internet sites for reaching out to its prospective Client/buyers/sellers. The data collected is for the exclusive use of Thanjaiproperty.com and Thanjaiproperty.com reserves its right to allow access to its client for the purposes of purchase and disposing of properties only, and any unauthorized use or sharing of information by any third party shall invite appropriate legal action by Thanjaiproperty.com against the erring party, including indemnification for third party claims for damages.</p>

            <h3 id="term-misc" class="term-heading">Miscellaneous</h3>
            <p class="term-para">These Terms will be governed by and construed in accordance with the Indian laws, without giving effect to its conflict of laws provisions or your actual state or country of residence, and you agree to submit to personal jurisdiction in Thanjavur Only. You agree to exclude, in its entirety, the application to these Terms of the United Nations Convention on Contracts for the International Sale of Goods. You are responsible for compliance with applicable laws.</p>
            
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

export function initTermsListeners() {
  const termsView = document.querySelector('.terms-view');
  if (termsView) {
    termsView.addEventListener('copy', (e) => e.preventDefault());
    termsView.addEventListener('cut', (e) => e.preventDefault());
    termsView.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  const sidebarLinks = document.querySelectorAll('.terms-view aside a');
  
  // Handle click to scroll and active state
  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Remove active class from all
      sidebarLinks.forEach(l => l.classList.remove('active-term-link'));
      // Add active class to clicked
      link.classList.add('active-term-link');

      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
        history.pushState(null, null, `#${targetId}`);
      }
    });
  });

  // Handle active state on scroll using IntersectionObserver
  const headings = document.querySelectorAll('.term-heading');
  const observerOptions = {
    root: null,
    rootMargin: '-80px 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        sidebarLinks.forEach(link => {
          link.classList.remove('active-term-link');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active-term-link');
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
