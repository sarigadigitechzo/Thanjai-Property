import { addAuditLog } from './siteImagesStore.js';

const ADMIN_USERS_STORAGE_KEY = 'thanjai_admin_users';

const DEFAULT_ADMIN_USERS = [
  {
    id: 'ADM-1001',
    fullName: 'Aishwarya R.',
    email: 'admin@realrest.example',
    phone: '+91 94431 25009',
    password: 'Admin@1234',
    role: 'Super Admin',
    roleCode: 'superadmin',
    status: 'Active',
    lastLogin: 'Today, 17:00',
    createdAt: '2026-08-01T10:00:00Z'
  },
  {
    id: 'ADM-1002',
    fullName: 'Sales Manager Desk',
    email: 'manager@realrest.example',
    phone: '+91 94431 25010',
    password: 'Admin@1234',
    role: 'Sales Manager',
    roleCode: 'salesmanager',
    status: 'Active',
    lastLogin: 'Yesterday, 14:20',
    createdAt: '2026-08-05T11:30:00Z'
  },
  {
    id: 'ADM-1003',
    fullName: 'Kavitha S.',
    email: 'kavitha@realrest.example',
    phone: '+91 98401 99881',
    password: 'Admin@1234',
    role: 'Sales Executive',
    roleCode: 'salesexecutive',
    status: 'Active',
    lastLogin: '18 Aug, 11:45',
    createdAt: '2026-08-10T09:15:00Z'
  },
  {
    id: 'ADM-1004',
    fullName: 'Arun Prakash',
    email: 'arun@realrest.example',
    phone: '+91 98401 99882',
    password: 'Admin@1234',
    role: 'Sales Executive',
    roleCode: 'salesexecutive',
    status: 'Active',
    lastLogin: '17 Aug, 09:30',
    createdAt: '2026-08-12T14:20:00Z'
  },
  {
    id: 'ADM-1005',
    fullName: 'Priya K.',
    email: 'priya@realrest.example',
    phone: '+91 98401 99883',
    password: 'Admin@1234',
    role: 'Property Staff',
    roleCode: 'propertystaff',
    status: 'Active',
    lastLogin: '16 Aug, 16:10',
    createdAt: '2026-08-14T16:00:00Z'
  }
];

export function getAdminUsers() {
  try {
    const data = localStorage.getItem(ADMIN_USERS_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify(DEFAULT_ADMIN_USERS));
      return DEFAULT_ADMIN_USERS;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading admin users:', err);
    return DEFAULT_ADMIN_USERS;
  }
}

export function addAdminUser(userData) {
  const users = getAdminUsers();
  const newUser = {
    id: `ADM-${Date.now().toString().slice(-4)}`,
    fullName: userData.fullName || 'Admin User',
    email: userData.email,
    phone: userData.phone || '+91 98401 00000',
    password: userData.password || 'Admin@1234',
    role: userData.role || 'Sales Executive',
    roleCode: (userData.role || 'Sales Executive').toLowerCase().replace(/\s+/g, ''),
    status: userData.status || 'Active',
    lastLogin: 'Never',
    createdAt: new Date().toISOString()
  };

  users.unshift(newUser);
  localStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify(users));

  addAuditLog({
    user: 'Aishwarya R.',
    action: 'ADMIN_USER_CREATED',
    details: `Created new admin staff account: ${newUser.fullName} (${newUser.role}) - ${newUser.email}`
  });

  window.dispatchEvent(new CustomEvent('adminUsersUpdated', { detail: newUser }));
  return newUser;
}

export function updateAdminUser(id, updatedFields) {
  const users = getAdminUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return null;

  users[idx] = {
    ...users[idx],
    ...updatedFields,
    roleCode: updatedFields.role ? updatedFields.role.toLowerCase().replace(/\s+/g, '') : users[idx].roleCode
  };

  localStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify(users));

  addAuditLog({
    user: 'Aishwarya R.',
    action: 'ADMIN_USER_UPDATED',
    details: `Updated admin staff account ${id}: ${users[idx].fullName} (${users[idx].role})`
  });

  window.dispatchEvent(new CustomEvent('adminUsersUpdated', { detail: users[idx] }));
  return users[idx];
}

export function toggleAdminUserStatus(id) {
  const users = getAdminUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return null;

  users[idx].status = users[idx].status === 'Active' ? 'Inactive' : 'Active';
  localStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify(users));

  addAuditLog({
    user: 'Aishwarya R.',
    action: 'ADMIN_USER_STATUS_TOGGLED',
    details: `Toggled admin staff status ${id} to ${users[idx].status}`
  });

  window.dispatchEvent(new CustomEvent('adminUsersUpdated', { detail: users[idx] }));
  return users[idx];
}

export function deleteAdminUser(id) {
  const users = getAdminUsers();
  const target = users.find(u => u.id === id);
  const filtered = users.filter(u => u.id !== id);

  localStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify(filtered));

  if (target) {
    addAuditLog({
      user: 'Aishwarya R.',
      action: 'ADMIN_USER_DELETED',
      details: `Deleted admin staff account ${id} (${target.fullName})`
    });
  }

  window.dispatchEvent(new CustomEvent('adminUsersUpdated', { detail: id }));
  return true;
}
