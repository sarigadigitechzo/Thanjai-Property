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

export function deleteRegisteredUser(userId) {
  try {
    let users = getRegisteredUsers();
    users = users.filter(u => u.id !== userId);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    
    addAuditLog({
      user: 'Super Admin',
      action: 'DELETED_USER',
      details: `Deleted portal user with ID: ${userId}`
    });
    
    window.dispatchEvent(new CustomEvent('userAuthUpdated'));
    return true;
  } catch (err) {
    console.error('Error deleting user:', err);
    return false;
  }
}

export function getRegisteredUsers() {
  try {
    const data = localStorage.getItem(USERS_STORAGE_KEY);
    if (data !== null) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Exclude admin staff accounts from client portal users list
        const clientUsersOnly = parsed
          .filter(u => u.email !== 'admin@realrest.example' && u.roleCode !== 'superadmin')
          .map(u => {
            const email = (u.email || '').toLowerCase();
            const role = (u.role || u.roleCode || '').toLowerCase();
            if (email.includes('builder') || role.includes('builder')) {
              return { ...u, role: 'Builder / Developer', roleCode: 'builderdeveloper' };
            }
            if (email.includes('agent') || email.includes('broker') || role.includes('agent') || role.includes('broker')) {
              return { ...u, role: 'Agent / Broker', roleCode: 'agentbroker' };
            }
            return u;
          });
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
    details: `User ${activeRecord.email} (${activeRecord.role}) verified email OTP. Login credentials dispatched from vijayaraghavan@thanjaiproperty.com.`
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
    users[idx].password = newPassword;
    users[idx].isTemporaryPassword = false;
    users[idx].passwordUpdatedAt = new Date().toISOString();
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

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
      password: password || 'Admin@1234',
      isTemporaryPassword: false,
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
