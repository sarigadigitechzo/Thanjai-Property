import { addAuditLog } from './siteImagesStore.js';

import { fetchFromAPI } from './api.js';

const ADMIN_USERS_STORAGE_KEY = 'thanjai_admin_users';
let adminUsersCache = null;

export async function initAdminUsersStore() {
  try {
    const data = await fetchFromAPI('/admin_users');
    if (data && Array.isArray(data)) {
      adminUsersCache = data;
      localStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify(adminUsersCache));
    }
  } catch (error) {}
}

export const DEFAULT_ADMIN_USERS = [
  {
    id: 'ADM-001',
    fullName: 'Vijayaraghavan',
    email: 'admin@thanjaiproperty.com',
    phone: '+91 84899 96852',
    password: 'Admin@1234',
    role: 'Super Admin',
    roleCode: 'superadmin',
    status: 'Active',
    allowedModules: ['dashboard', 'leads', 'properties', 'approvals', 'visits', 'partners', 'ai', 'whatsapp', 'pipeline', 'reports', 'analytics', 'settings', 'portal_users', 'audit', 'blog_posts', 'site_images', 'admin_staff'],
    lastLogin: 'Active Now',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'ADM-002',
    fullName: 'Vijayaraghavan',
    email: 'vijayaraghavan@thanjaiproperty.com',
    phone: '+91 84899 96852',
    password: 'Admin@1234',
    role: 'Super Admin',
    roleCode: 'superadmin',
    status: 'Active',
    allowedModules: ['dashboard', 'leads', 'properties', 'approvals', 'visits', 'partners', 'ai', 'whatsapp', 'pipeline', 'reports', 'analytics', 'settings', 'portal_users', 'audit', 'blog_posts', 'site_images', 'admin_staff'],
    lastLogin: 'Active Now',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'ADM-003',
    fullName: 'Aishwarya R.',
    email: 'admin@realrest.example',
    phone: '+91 98401 23456',
    password: 'Admin@1234',
    role: 'Super Admin',
    roleCode: 'superadmin',
    status: 'Active',
    allowedModules: ['dashboard', 'leads', 'properties', 'approvals', 'visits', 'partners', 'ai', 'whatsapp', 'pipeline', 'reports', 'analytics', 'settings', 'portal_users', 'audit', 'blog_posts', 'site_images', 'admin_staff'],
    lastLogin: 'Active Now',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'ADM-004',
    fullName: 'Sales Manager',
    email: 'manager@realrest.example',
    phone: '+91 98401 11111',
    password: 'Admin@1234',
    role: 'Sales Manager',
    roleCode: 'salesmanager',
    status: 'Active',
    allowedModules: ['dashboard', 'leads', 'properties', 'approvals', 'visits', 'partners', 'pipeline', 'reports'],
    lastLogin: 'Active Now',
    createdAt: '2026-01-01T00:00:00.000Z'
  }
];

export function getAdminUsers() {
  if (adminUsersCache && adminUsersCache.length > 0) return adminUsersCache;
  try {
    const data = localStorage.getItem(ADMIN_USERS_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify(DEFAULT_ADMIN_USERS));
      adminUsersCache = [...DEFAULT_ADMIN_USERS];
      return adminUsersCache;
    }
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed) && parsed.length > 0) {
      adminUsersCache = parsed;
    } else {
      adminUsersCache = [...DEFAULT_ADMIN_USERS];
      localStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify(DEFAULT_ADMIN_USERS));
    }
    return adminUsersCache;
  } catch (err) {
    console.error('Error reading admin users:', err);
    adminUsersCache = [...DEFAULT_ADMIN_USERS];
    return adminUsersCache;
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
    allowedModules: Array.isArray(userData.allowedModules) ? userData.allowedModules : [],
    lastLogin: 'Never',
    createdAt: new Date().toISOString()
  };

  users.unshift(newUser);
  adminUsersCache = users;
  localStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify(adminUsersCache));
  
  // Async background sync
  fetchFromAPI('/admin_users', {
    method: 'POST',
    body: JSON.stringify(newUser)
  }).catch(e => console.error("API sync error", e));

  addAuditLog({
    action: `Added Admin Staff (${newUser.fullName})`,
    module: 'Portal Users',
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
    allowedModules: Array.isArray(updatedFields.allowedModules) ? updatedFields.allowedModules : (users[idx].allowedModules || []),
    roleCode: updatedFields.role ? updatedFields.role.toLowerCase().replace(/\s+/g, '') : users[idx].roleCode
  };

  adminUsersCache = users;
  localStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify(adminUsersCache));
  
  // Async background sync
  fetchFromAPI(`/admin_users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(users[idx])
  }).catch(e => console.error("API sync error", e));

  addAuditLog({
    action: `Updated Admin Staff (${users[idx].fullName})`,
    module: 'Portal Users',
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
  
  adminUsersCache = users;
  localStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify(adminUsersCache));
  
  // Async background sync
  fetchFromAPI(`/admin_users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(users[idx])
  }).catch(e => console.error("API sync error", e));

  addAuditLog({
    action: `Toggled Staff Status (${users[idx].fullName})`,
    module: 'Portal Users',
    details: `Toggled admin staff status ${id} to ${users[idx].status}`
  });

  window.dispatchEvent(new CustomEvent('adminUsersUpdated', { detail: users[idx] }));
  return users[idx];
}

export function deleteAdminUser(id) {
  const users = getAdminUsers();
  const target = users.find(u => u.id === id);
  const filtered = users.filter(u => u.id !== id);

  adminUsersCache = filtered;
  localStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify(adminUsersCache));
  
  // Async background sync
  fetchFromAPI(`/admin_users/${id}`, {
    method: 'DELETE'
  }).catch(e => console.error("API sync error", e));

  if (target) {
    addAuditLog({
      action: `Deleted Admin Staff (${target.fullName})`,
      module: 'Portal Users',
      details: `Deleted admin staff account ${id} (${target.fullName})`
    });
  }

  window.dispatchEvent(new CustomEvent('adminUsersUpdated', { detail: id }));
  return true;
}
