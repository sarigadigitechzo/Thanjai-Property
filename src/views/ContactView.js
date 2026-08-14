import { renderContactSection, initContactSectionListeners } from '../components/ContactSection.js';

export function renderContactView() {
  return `
    <div class="page-view view-enter contact-page" style="padding-top: 60px;">
      ${renderContactSection()}
    </div>
  `;
}

export function initContactListeners() {
  initContactSectionListeners();
}
