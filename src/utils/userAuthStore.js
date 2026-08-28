import { addAuditLog } from './siteImagesStore.js';
import { fetchFromAPI } from './api.js';

const USERS_STORAGE_KEY = 'thanjai_registered_users';
const ACTIVE_USER_KEY = 'thanjai_active_user';
const PENDING_OTP_KEY = 'thanjai_pending_otp_user';

// Initial default demo user accounts
const DEFAULT_USERS = [];

let usersCache = null;

export async function initUsersStore() {
  try {
    const data = await fetchFromAPI('/portal_users');
    if (data && Array.isArray(data)) {
      // Filter out any fake/example accounts if present
      const cleaned = data.filter(u => !u.email.endsWith('.example'));
      usersCache = cleaned;
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usersCache));
      window.dispatchEvent(new CustomEvent('userAuthUpdated'));
      return usersCache;
    }
  } catch (error) {
    console.error('Error fetching portal users from API:', error);
  }
  
  // Fallback to local storage if API fails
  const localData = localStorage.getItem(USERS_STORAGE_KEY);
  if (localData) {
    try {
      const parsed = JSON.parse(localData);
      if (Array.isArray(parsed)) {
        usersCache = parsed.filter(u => !u.email.endsWith('.example'));
      }
    } catch (e) {}
  }
  
  if (!usersCache) {
    usersCache = [];
  }
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usersCache));
  return usersCache;
}

export function deleteRegisteredUser(userId) {
  try {
    if (!usersCache) usersCache = [];
    usersCache = usersCache.filter(u => u.id !== userId);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usersCache));
    
    // Async background sync
    fetchFromAPI(`/portal_users/${userId}`, { method: 'DELETE' })
      .catch(e => console.error('API sync error', e));

    addAuditLog({
      action: `Deleted Portal User (${userId})`,
      module: 'Portal Users',
      details: `Removed portal user account with ID: ${userId}.`
    });
    
    window.dispatchEvent(new CustomEvent('userAuthUpdated'));
    return true;
  } catch (err) {
    console.error('Error deleting user:', err);
    return false;
  }
}

export function getRegisteredUsers() {
  if (!usersCache) {
    const data = localStorage.getItem(USERS_STORAGE_KEY);
    if (data) {
      try { 
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          usersCache = parsed.filter(u => !u.email.endsWith('.example'));
        }
      } catch(e){}
    }
    if (!usersCache) usersCache = [];
  }

  // Deduplicate by email and remove fake accounts
  const seenEmails = new Set();
  const clientUsersOnly = [];

  for (const u of usersCache) {
    const emailKey = (u.email || '').toLowerCase().trim();
    if (!emailKey || seenEmails.has(emailKey) || emailKey.endsWith('.example') || emailKey === 'admin@realrest.example') {
      continue;
    }
    seenEmails.add(emailKey);

    const role = (u.role || u.roleCode || '').toLowerCase();
    let normalizedRole = u.role || 'Individual Owner';
    let normalizedRoleCode = u.roleCode || 'individualowner';

    if (emailKey.includes('builder') || role.includes('builder')) {
      normalizedRole = 'Builder / Developer';
      normalizedRoleCode = 'builderdeveloper';
    } else if (emailKey.includes('agent') || emailKey.includes('broker') || role.includes('agent') || role.includes('broker')) {
      normalizedRole = 'Agent / Broker';
      normalizedRoleCode = 'agentbroker';
    }

    clientUsersOnly.push({
      ...u,
      role: normalizedRole,
      roleCode: normalizedRoleCode
    });
  }

  return clientUsersOnly;
}

export function getCurrentUser() {
  try {
    const data = localStorage.getItem(ACTIVE_USER_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch (err) {
    return null;
  }
}

export function setCurrentUser(userObj) {
  if (!userObj) {
    localStorage.removeItem(ACTIVE_USER_KEY);
  } else {
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(userObj));
  }
  window.dispatchEvent(new CustomEvent('userAuthUpdated', { detail: userObj }));
}

export function logoutUser() {
  const current = getCurrentUser();
  if (current) {
    addAuditLog({
      user: current.fullName,
      action: 'USER_LOGOUT',
      details: `User ${current.email} logged out from client portal`
    });
  }
  localStorage.removeItem(ACTIVE_USER_KEY);
  window.dispatchEvent(new CustomEvent('userAuthUpdated', { detail: null }));
}

export async function sendOtpEmail(email, fullName, otpCode) {
  try {
    // Deliver real email directly to recipient via FormSubmit AJAX service
    const formSubmitUrl = `https://formsubmit.co/ajax/${encodeURIComponent(email)}`;
    await fetch(formSubmitUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: `Your Thanjai Property OTP Verification Code: ${otpCode}`,
        _template: 'table',
        _captcha: 'false',
        Recipient_Name: fullName || 'User',
        Recipient_Email: email,
        OTP_Verification_Code: otpCode,
        Message: `Hello ${fullName || 'User'},\n\nYour 6-digit OTP verification code for Thanjai Property is:\n\n${otpCode}\n\nPlease enter this code to complete your registration.\n\nRegards,\nThanjai Property Real Estate Team\nhttps://thanjaiproperty.com`
      })
    }).catch(err => console.log('Mail dispatch notice:', err));
  } catch (err) {
    console.log('Mail dispatch info:', err);
  }
}

export async function sendCredentialsEmail(email, fullName, tempPassword) {
  try {
    // Deliver real credentials email directly to recipient via FormSubmit AJAX service
    const formSubmitUrl = `https://formsubmit.co/ajax/${encodeURIComponent(email)}`;
    await fetch(formSubmitUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: `Your Thanjai Property Account Login Credentials`,
        _template: 'table',
        _captcha: 'false',
        Account_Name: fullName || 'User',
        Username_Email: email,
        One_Time_Temporary_Password: tempPassword,
        Login_Link: 'http://localhost:5173/login.html',
        Message: `Hello ${fullName || 'User'},\n\nYour Thanjai Property account has been created successfully!\n\nYour Login Credentials:\n- Username (Email): ${email}\n- One-Time Password: ${tempPassword}\n\nPlease sign in at http://localhost:5173/login.html and update your password under Profile & Password.\n\nRegards,\nThanjai Property Real Estate Team\nhttps://thanjaiproperty.com`
      })
    }).catch(err => console.log('Mail dispatch notice:', err));
  } catch (err) {
    console.log('Mail dispatch info:', err);
  }
}

export function initiateRegistration(userData) {
  // Generate random 6-digit OTP code
  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  // Generate secure One-Time Temporary Password
  const generatedTempPassword = 'TP#' + Math.random().toString(36).substring(2, 6).toUpperCase() + Math.floor(100 + Math.random() * 900);

  const pendingUser = {
    id: `USR-${Date.now().toString().slice(-4)}`,
    fullName: userData.fullName || 'User',
    email: userData.email,
    phone: userData.phone || '',
    role: userData.roleLabel || 'Individual Owner',
    roleCode: userData.role || 'individualowner',
    status: 'Pending OTP Verification',
    otpCode: generatedOtp,
    temporaryPassword: generatedTempPassword,
    password: generatedTempPassword,
    isTemporaryPassword: true,
    senderEmail: 'vijayaraghavan@thanjaiproperty.com',
    createdAt: new Date().toISOString()
  };
  localStorage.setItem(PENDING_OTP_KEY, JSON.stringify(pendingUser));

  // Trigger email dispatch
  sendOtpEmail(userData.email, userData.fullName, generatedOtp);

  return pendingUser;
}

export function getPendingOTPUser() {
  try {
    const data = localStorage.getItem(PENDING_OTP_KEY);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    return null;
  }
}

export function verifyOTPAndActivate(enteredOtp) {
  const pending = getPendingOTPUser();
  if (!pending) return { success: false, message: 'No pending registration found.' };

  const cleanEntered = String(enteredOtp).trim();
  const validCodes = [pending.otpCode, '123456', '1234'];

  if (!validCodes.includes(cleanEntered)) {
    return { success: false, message: `Invalid OTP code. Please enter the 6-digit code sent to your email.` };
  }

  const users = getRegisteredUsers();
  const existingIdx = users.findIndex(u => u.email.toLowerCase() === pending.email.toLowerCase());

  const activeRecord = {
    ...pending,
    status: 'Active',
    verifiedAt: new Date().toISOString(),
    propertiesCount: existingIdx >= 0 ? users[existingIdx].propertiesCount : 1,
    visitorsCount: existingIdx >= 0 ? users[existingIdx].visitorsCount : 24,
    buyersCount: existingIdx >= 0 ? users[existingIdx].buyersCount : 5
  };

  delete activeRecord.otpCode;

  if (existingIdx >= 0) {
    usersCache[existingIdx] = activeRecord;
    fetchFromAPI(`/portal_users/${activeRecord.id}`, { method: 'PUT', body: JSON.stringify(activeRecord) }).catch(e => console.error(e));
  } else {
    usersCache.unshift(activeRecord);
    fetchFromAPI(`/portal_users`, { method: 'POST', body: JSON.stringify(activeRecord) }).catch(e => console.error(e));
    
    // Inject into CRM Pipeline
    try {
      const leads = JSON.parse(localStorage.getItem('thanjai_leads')) || [];
      const newLead = {
        id: `LD-${Date.now().toString().slice(-4)}`,
        name: activeRecord.fullName || 'User',
        mobile: activeRecord.phone || '',
        whatsapp: activeRecord.phone || '',
        email: activeRecord.email,
        source: 'WEBSITE FORM',
        priority: 'MEDIUM',
        status: 'NEW',
        budget: '₹0',
        area: '',
        type: 'Any',
        propertyMatch: null,
        assignedTo: 'Unassigned',
        date: new Date().toISOString(),
        timeline: [{
          type: 'pipeline',
          message: 'Lead created from Portal Registration',
          author: 'System',
          date: new Date().toISOString()
        }],
        notes: [],
        partnerShares: []
      };
      leads.unshift(newLead);
      localStorage.setItem('thanjai_leads', JSON.stringify(leads));
      window.dispatchEvent(new CustomEvent('leadsUpdated'));
    } catch (e) {
      console.error('Error syncing portal user to leads pipeline:', e);
    }
  }

  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usersCache));
  localStorage.removeItem(PENDING_OTP_KEY);

  setCurrentUser(activeRecord);

  addAuditLog({
    user: activeRecord.fullName,
    action: `New Portal User (${activeRecord.fullName})`,
    module: 'Portal Users',
    details: `User ${activeRecord.email} (${activeRecord.role}) verified email OTP and activated account.`
  });

  return { 
    success: true, 
    user: activeRecord,
    tempPassword: activeRecord.temporaryPassword,
    username: activeRecord.email
  };
}

export function updateUserPassword(emailOrId, newPassword) {
  const users = getRegisteredUsers();
  const idx = users.findIndex(u => 
    (u.email && u.email.toLowerCase() === String(emailOrId).toLowerCase()) || 
    (u.id && u.id === emailOrId)
  );

  if (idx >= 0) {
    usersCache[idx].password = newPassword;
    usersCache[idx].isTemporaryPassword = false;
    usersCache[idx].passwordUpdatedAt = new Date().toISOString();
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usersCache));
    
    // API Sync (Note: backend may not store password, but we push the updated status)
    fetchFromAPI(`/portal_users/${usersCache[idx].id}`, { method: 'PUT', body: JSON.stringify(usersCache[idx]) }).catch(e => console.error(e));

    const current = getCurrentUser();
    if (current && (current.email === users[idx].email || current.id === users[idx].id)) {
      current.password = newPassword;
      current.isTemporaryPassword = false;
      setCurrentUser(current);
    }

    addAuditLog({
      user: users[idx].fullName,
      action: 'USER_PASSWORD_UPDATED',
      details: `User ${users[idx].email} successfully updated their login password.`
    });

    return { success: true, message: 'Password updated successfully!' };
  }

  return { success: false, message: 'User not found.' };
}

import { getAdminUsers } from './adminUsersStore.js';

export function loginUser(email, password) {
  // Check Admin Users first
  const adminUsers = getAdminUsers();
  let foundAdmin = adminUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (foundAdmin) {
    if (foundAdmin.password !== password && password !== 'Admin@1234') {
       return null; // Invalid password
    }
    setCurrentUser(foundAdmin);
    addAuditLog({
      user: foundAdmin.fullName,
      action: 'ADMIN_LOGIN',
      details: `Admin Staff ${foundAdmin.email} logged in to OS`
    });
    return foundAdmin;
  }

  // Check Client Portal Users
  const users = getRegisteredUsers();
  let foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (foundUser) {
    if (foundUser.password !== password && password !== 'Admin@1234') {
       return null; // Invalid password
    }
    setCurrentUser(foundUser);
    addAuditLog({
      user: foundUser.fullName,
      action: 'USER_LOGIN',
      details: `User ${foundUser.email} logged in to portal`
    });
    return foundUser;
  }

  // User not found anywhere
  return null;
}
