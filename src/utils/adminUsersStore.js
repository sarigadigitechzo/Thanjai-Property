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

export function getAdminUsers() {
  if (adminUsersCache) return adminUsersCache;
  try {
    const data = localStorage.getItem(ADMIN_USERS_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify([]));
      adminUsersCache = [];
      return adminUsersCache;
    }
    adminUsersCache = JSON.parse(data);
    return adminUsersCache;
  } catch (err) {
    console.error('Error reading admin users:', err);
    adminUsersCache = [];
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
  
  adminUsersCache = users;
  localStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify(adminUsersCache));
  
  // Async background sync
  fetchFromAPI(`/admin_users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(users[idx])
  }).catch(e => console.error("API sync error", e));

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

  adminUsersCache = filtered;
  localStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify(adminUsersCache));
  
  // Async background sync
  fetchFromAPI(`/admin_users/${id}`, {
    method: 'DELETE'
  }).catch(e => console.error("API sync error", e));

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
