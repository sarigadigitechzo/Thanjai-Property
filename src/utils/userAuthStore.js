import { addAuditLog } from './siteImagesStore.js';

const USERS_STORAGE_KEY = 'thanjai_registered_users';
const ACTIVE_USER_KEY = 'thanjai_active_user';
const PENDING_OTP_KEY = 'thanjai_pending_otp_user';

// Initial default demo user accounts
const DEFAULT_USERS = [
  {
    id: 'USR-1001',
    fullName: 'Kani Digitechzo',
    email: 'kanidigitechzo@gmail.com',
    phone: '9585777772',
    role: 'Individual Owner',
    roleCode: 'individualowner',
    status: 'Active',
    propertiesCount: 3,
    visitorsCount: 142,
    buyersCount: 18,
    createdAt: '2026-08-10T10:00:00Z'
  },
  {
    id: 'USR-1002',
    fullName: 'Senthil Kumar',
    email: 'senthil.agent@thanjai.example',
    phone: '9840123456',
    role: 'Agent / Broker',
    roleCode: 'agentbroker',
    status: 'Active',
    propertiesCount: 8,
    visitorsCount: 420,
    buyersCount: 35,
    createdAt: '2026-08-12T14:30:00Z'
  },
  {
    id: 'USR-2578',
    fullName: 'Tamilselvan R.',
    email: 'tamilselvan.builder@thanjai.example',
    phone: '9585777772',
    role: 'Builder / Developer',
    roleCode: 'builderdeveloper',
    status: 'Active',
    propertiesCount: 2,
    visitorsCount: 95,
    buyersCount: 14,
    createdAt: '2026-08-13T09:15:00Z'
  }
];

export function getRegisteredUsers() {
  try {
    const data = localStorage.getItem(USERS_STORAGE_KEY);
    if (data !== null) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Exclude admin staff accounts from client portal users list
        const clientUsersOnly = parsed.filter(u => u.email !== 'admin@realrest.example' && u.roleCode !== 'superadmin');
        return clientUsersOnly.length > 0 ? clientUsersOnly : DEFAULT_USERS;
      }
    }
  } catch (err) {
    console.error('Error reading registered users:', err);
  }

  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
  return DEFAULT_USERS;
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

export function initiateRegistration(userData) {
  const pendingUser = {
    id: `USR-${Date.now().toString().slice(-4)}`,
    fullName: userData.fullName || 'User',
    email: userData.email,
    phone: userData.phone || '',
    role: userData.roleLabel || 'Individual Owner',
    roleCode: userData.role || 'individualowner',
    status: 'Pending OTP Verification',
    otpCode: '1234', // Demo fixed OTP code for testing
    createdAt: new Date().toISOString()
  };
  localStorage.setItem(PENDING_OTP_KEY, JSON.stringify(pendingUser));
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

  if (enteredOtp !== '1234' && enteredOtp !== pending.otpCode) {
    return { success: false, message: 'Invalid OTP code. Use demo code: 1234' };
  }

  const users = getRegisteredUsers();
  const existingIdx = users.findIndex(u => u.email.toLowerCase() === pending.email.toLowerCase());

  const activeRecord = {
    ...pending,
    status: 'Active',
    propertiesCount: existingIdx >= 0 ? users[existingIdx].propertiesCount : 1,
    visitorsCount: existingIdx >= 0 ? users[existingIdx].visitorsCount : 24,
    buyersCount: existingIdx >= 0 ? users[existingIdx].buyersCount : 5
  };

  delete activeRecord.otpCode;

  if (existingIdx >= 0) {
    users[existingIdx] = activeRecord;
  } else {
    users.unshift(activeRecord);
  }

  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  localStorage.removeItem(PENDING_OTP_KEY);

  setCurrentUser(activeRecord);

  addAuditLog({
    user: activeRecord.fullName,
    action: 'USER_REGISTERED_AND_VERIFIED',
    details: `User ${activeRecord.email} (${activeRecord.role}) verified OTP and activated account`
  });

  return { success: true, user: activeRecord };
}

export function loginUser(email, password) {
  const users = getRegisteredUsers();
  let found = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!found) {
    let assignedRole = 'Individual Owner';
    let assignedRoleCode = 'individualowner';
    const lowerEmail = email.toLowerCase();
    if (lowerEmail.includes('builder')) {
      assignedRole = 'Builder / Developer';
      assignedRoleCode = 'builderdeveloper';
    } else if (lowerEmail.includes('agent')) {
      assignedRole = 'Agent / Broker';
      assignedRoleCode = 'agentbroker';
    }

    // Auto-create user for demo flexibility
    found = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      fullName: email.split('@')[0].toUpperCase(),
      email: email,
      phone: '9585777772',
      role: assignedRole,
      roleCode: assignedRoleCode,
      status: 'Active',
      propertiesCount: 2,
      visitorsCount: 88,
      buyersCount: 12,
      createdAt: new Date().toISOString()
    };
    users.unshift(found);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }

  setCurrentUser(found);

  addAuditLog({
    user: found.fullName,
    action: 'USER_LOGIN',
    details: `User ${found.email} logged in to portal`
  });

  return { success: true, user: found };
}
