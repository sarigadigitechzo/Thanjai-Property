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
  const flatPhone = '91' + last10;

  const apiKey = getActiveWhatsAppApiKey();
  const provider = getActiveWhatsAppProvider();

  const defaultMedia = media || {
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    filename: 'thanjai-property.jpg'
  };

  const stringParams = (templateParams || []).map(p => String(p));
  let isDispatched = false;

  // 1. Dispatch to SmartPing endpoint if provider is smartping
  if (provider === 'smartping') {
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
        console.log('✅ WhatsApp message delivered via SmartPing:', resData);
      }
    } catch (err) {
      console.warn('SmartPing dispatch error, attempting fallback:', err);
    }
  }

  // 2. Secondary fallback to AiSensy gateway if SmartPing didn't succeed
  if (!isDispatched) {
    try {
      const aiSensyRes = await fetch('https://backend.aisensy.com/campaign/t1/api/v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: apiKey,
          campaignName: campaignName,
          destination: flatPhone,
          userName: userName || 'Customer',
          templateParams: stringParams,
          media: defaultMedia
        })
      });
      const resData2 = await aiSensyRes.json();
      if (resData2.success === 'true' || resData2.submitted_message_id) {
        isDispatched = true;
        console.log('✅ WhatsApp message delivered via AiSensy gateway:', resData2);
      }
    } catch (err) {
      console.warn('AiSensy gateway dispatch notice:', err);
    }
  }

  // 3. Log to MySQL database and sync via backend relay
  try {
    await fetchFromAPI('/send_whatsapp', {
      method: 'POST',
      body: JSON.stringify({
        campaignName,
        destination: smartPingPhone,
        userName,
        leadId,
        messageText,
        templateParams: stringParams,
        media: defaultMedia
      })
    });
  } catch (err) {}

  return isDispatched;
}
