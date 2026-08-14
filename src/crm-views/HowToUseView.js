export function renderHowToUseView() {
  return `
    <div class="view-header">
      <h1 class="view-title"><div class="metric-icon" style="position:relative; top:0; left:0; width: 32px; height: 32px; background: #ffedd5; color: #d97706; font-size: 1rem;"><i class="ri-question-line"></i></div> How to Use</h1>
      <p class="view-subtitle">A quick walkthrough of every part of the CRM</p>
    </div>

    <div class="howto-card">
      <div class="howto-header">
        <div class="howto-header-left">
          <i class="ri-group-line"></i> Leads (CRM Pipeline)
        </div>
        <i class="ri-arrow-up-s-line" style="color: #64748b;"></i>
      </div>
      <div class="howto-body">
        <ul class="howto-list">
          <li>
            <div class="howto-num">1</div>
            <div>Click "+ New lead" on the CRM Pipeline page, or import many at once with "Import CSV" (download "Sample CSV" first to see the exact column format).</div>
          </li>
          <li>
            <div class="howto-num">2</div>
            <div>Every lead moves through stages left to right: New &rarr; Initial Contact &rarr; ... &rarr; Registration (won) or Lost/Closed. Change a lead's stage from the dropdown on its detail page, or drag its card on the Pipeline Board.</div>
          </li>
          <li>
            <div class="howto-num">3</div>
            <div>Stages marked <i class="ri-mail-line"></i> in the dropdown automatically send the client a WhatsApp message when you move a lead there &mdash; you don't need to send anything manually for those.</div>
          </li>
          <li>
            <div class="howto-num">4</div>
            <div>"Site Visit Scheduled" and the "Schedule visit" button both ask you to pick the actual date/time first, so the automated confirmation message says the right time.</div>
          </li>
          <li>
            <div class="howto-num">5</div>
            <div>Use "Find matches" to see properties in your inventory that fit the lead's requirements, tick the ones you want, then either "Save shortlist" or "Send N via WhatsApp".</div>
          </li>
          <li>
            <div class="howto-num">6</div>
            <div>Set a follow-up reminder date on the left side of the lead page &mdash; you'll get a notification when it's due.</div>
          </li>
        </ul>
      </div>
    </div>

    <div class="howto-card">
      <div class="howto-header" style="background: #fff; border-bottom: none; border-radius: 12px;">
        <div class="howto-header-left">
          <i class="ri-whatsapp-line" style="color: #22c55e; background: #dcfce7;"></i> WhatsApp — sending & replies
        </div>
        <i class="ri-arrow-down-s-line" style="color: #64748b;"></i>
      </div>
    </div>
  `;
}
