// src/utils/whatsapp.js - SmartPing & Multi-Provider WhatsApp Dispatcher
import { fetchFromAPI } from './api.js';

// Permanent Default Master Key (Never gets lost or deleted)
export const DEFAULT_WHATSAPP_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NjYxNjVmODFhMDg2MTIzZWY5MWQ5MCIsIm5hbWUiOiJUaGFuamFpIFByb3BlcnR5IiwiYXBwTmFtZSI6IkFpU2Vuc3kiLCJjbGllbnRJZCI6IjY5NjYxNjVmODFhMDg2MTIzZWY5MWQ4OSIsImFjdGl2ZVBsYW4iOiJQUk9fTU9OVEhMWSIsImlhdCI6MTc4NzcyNDczOX0.8SQSQDJdxrAivj8FAkWvjSk_qx4yE0dENDh70US75G0';

export function getActiveWhatsAppApiKey() {
  const customKey = (typeof localStorage !== 'undefined') ? localStorage.getItem('thanjai_whatsapp_api_key') : '';
  return (customKey && customKey.trim().length > 10) ? customKey.trim() : DEFAULT_WHATSAPP_API_KEY;
}

export function getActiveWhatsAppProvider() {
  const provider = (typeof localStorage !== 'undefined') ? localStorage.getItem('thanjai_wa_provider') : '';
  return provider || 'smartping';
}

export async function sendWhatsAppMessage({ campaignName, destination, userName, templateParams, media, messageText, leadId }) {
  const digits = String(destination || '').replace(/\D/g, '');
  const last10 = digits.slice(-10);
  const smartPingPhone = '+91' + last10;

  const apiKey = getActiveWhatsAppApiKey();

  const defaultMedia = media || {
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    filename: 'thanjai-property.jpg'
  };

  const stringParams = (templateParams || []).map(p => String(p));
  let isDispatched = false;

  // PRIMARY: Route through backend PHP relay — avoids browser CORS blocking completely.
  // PHP server-side cURL sends the request to SmartPing with the master API key.
  try {
    const relayRes = await fetchFromAPI('/send_whatsapp', {
      method: 'POST',
      body: JSON.stringify({
        campaignName,
        destination: smartPingPhone,
        userName: userName || 'Customer',
        leadId,
        messageText,
        templateParams: stringParams,
        media: defaultMedia,
        apiKey
      })
    });
    if (relayRes && (relayRes.success === true || relayRes.success === 'true')) {
      isDispatched = true;
    }
  } catch (err) {
    console.warn('Backend relay notice:', err);
  }

  // FALLBACK: Direct browser dispatch only if backend relay fails (CORS may block this)
  if (!isDispatched) {
    try {
      const smartPingRes = await fetch('https://backend.api-wa.co/campaign/smartping/api/v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: apiKey,
          campaignName: campaignName,
          destination: smartPingPhone,
          userName: userName || 'Customer',
          templateParams: stringParams,
          media: defaultMedia
        })
      });
      const resData = await smartPingRes.json();
      if (resData.status === 'success' || resData.success === 'true' || resData.submitted_message_id) {
        isDispatched = true;
      }
    } catch (err) {
      // Browser CORS may block direct dispatch — backend relay is the reliable path
    }
  }

  return isDispatched;
}

