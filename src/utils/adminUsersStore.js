import { addAuditLog } from './siteImagesStore.js';

import { fetchFromAPI } from './api.js';

const ADMIN_USERS_STORAGE_KEY = 'thanjai_admin_users';
let adminUsersCache = null;

export function normalizeAdminUser(u) {
  if (!u) return u;
  let allowed = u.allowedModules;
  if (typeof allowed === 'string') {
    try {
      allowed = JSON.parse(allowed);
    } catch(e) {
      allowed = allowed.split(',').map(s => s.trim()).filter(Boolean);
    }
  }
  if (!Array.isArray(allowed)) {
    allowed = [];
  }
  return {
    ...u,
    allowedModules: allowed
  };
}

export async function initAdminUsersStore() {
  try {
    const data = await fetchFromAPI('/admin_users');
    if (data && Array.isArray(data)) {
      adminUsersCache = data.map(normalizeAdminUser);
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
    allowedModules: ['dashboard', 'leads', 'properties', 'approvals', 'visits', 'partners', 'ai', 'whatsapp', 'pipeline', 'reports', 'analytics', 'settings', 'portal_users', 'audit', 'blog_posts', 'site_images', 'admin_staff', 'popups'],
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
    allowedModules: ['dashboard', 'leads', 'properties', 'approvals', 'visits', 'partners', 'ai', 'whatsapp', 'pipeline', 'reports', 'analytics', 'settings', 'portal_users', 'audit', 'blog_posts', 'site_images', 'admin_staff', 'popups'],
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
    allowedModules: ['dashboard', 'leads', 'properties', 'approvals', 'visits', 'partners', 'ai', 'whatsapp', 'pipeline', 'reports', 'analytics', 'settings', 'portal_users', 'audit', 'blog_posts', 'site_images', 'admin_staff', 'popups'],
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
  if (adminUsersCache && adminUsersCache.length > 0) return adminUsersCache.map(normalizeAdminUser);
  try {
    const data = localStorage.getItem(ADMIN_USERS_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify(DEFAULT_ADMIN_USERS));
      adminUsersCache = [...DEFAULT_ADMIN_USERS].map(normalizeAdminUser);
      return adminUsersCache;
    }
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed) && parsed.length > 0) {
      adminUsersCache = parsed.map(normalizeAdminUser);
    } else {
      adminUsersCache = [...DEFAULT_ADMIN_USERS].map(normalizeAdminUser);
      localStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify(DEFAULT_ADMIN_USERS));
    }
    return adminUsersCache;
  } catch (err) {
    console.error('Error reading admin users:', err);
    adminUsersCache = [...DEFAULT_ADMIN_USERS].map(normalizeAdminUser);
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

export function getActiveAdminUser() {
  try {
    const raw = localStorage.getItem('thanjai_active_user');
    if (!raw) return null;
    let parsed = JSON.parse(raw);
    if (!parsed) return null;
    parsed = normalizeAdminUser(parsed);

    // Check if we can enrich with latest thanjai_admin_users record
    try {
      const allStaff = getAdminUsers();
      if (Array.isArray(allStaff) && allStaff.length > 0) {
        const match = allStaff.find(u => 
          (u.email && parsed.email && u.email.toLowerCase().trim() === parsed.email.toLowerCase().trim()) ||
          (u.id && parsed.id && u.id === parsed.id) ||
          (u.fullName && parsed.fullName && u.fullName.toLowerCase().trim() === parsed.fullName.toLowerCase().trim())
        );
        if (match) {
          return {
            ...parsed,
            ...match,
            role: match.role || parsed.role,
            roleCode: match.roleCode || parsed.roleCode,
            allowedModules: Array.isArray(match.allowedModules) ? match.allowedModules : (Array.isArray(parsed.allowedModules) ? parsed.allowedModules : [])
          };
        }
      }
    } catch(e) {}

    return parsed;
  } catch (e) {}
  return null;
}

export function canViewAllLeads(user = null) {
  const active = user || getActiveAdminUser();
  if (!active) return false;

  const roleName = String(active.role || active.roleCode || '').toLowerCase().trim();
  const email = (active.email || '').toLowerCase().trim();

  // Super Admins ALWAYS have full access
  if (
    roleName === 'super admin' || 
    roleName === 'superadmin' || 
    roleName === 'super_admin' || 
    email === 'admin@realrest.example' || 
    email === 'admin@thanjaiproperty.com' || 
    email === 'vijayaraghavan@thanjaiproperty.com'
  ) {
    return true;
  }

  // All 16 system module checkboxes in Admin Staff management
  const ALL_SYSTEM_MODULES = [
    'dashboard', 'leads', 'properties', 'property-approvals', 'visits',
    'partners', 'ai', 'whatsapp', 'pipeline', 'reports', 'settings',
    'users', 'audit', 'blog-cms', 'images', 'admin-users'
  ];

  const allowed = Array.isArray(active.allowedModules) ? active.allowedModules : [];
  if (allowed.length === 0) return false;

  const normAllowed = allowed.map(m => String(m).toLowerCase().replace(/[-_]/g, ''));
  const hasEveryModule = ALL_SYSTEM_MODULES.every(mod => normAllowed.includes(mod.replace(/[-_]/g, '')));

  // ONLY staff who have EVERY SINGLE module checked get full organization-wide CRM lead access
  return hasEveryModule;
}

export function filterLeadsForActiveUser(leads = [], user = null) {
  if (!Array.isArray(leads)) return [];
  const active = user || getActiveAdminUser();
  if (!active) return [];
  if (canViewAllLeads(active)) return leads;

  const activeName = (active.fullName || active.name || '').trim().toLowerCase();
  const activeFirstName = activeName.split(' ')[0] || '';
  const activeEmail = (active.email || '').trim().toLowerCase();

  return leads.filter(lead => {
    if (!lead) return false;
    const assigned = (lead.assignTo || lead.assignedTo || '').trim().toLowerCase();
    const assignedEmail = (lead.assignedEmail || lead.staffEmail || '').trim().toLowerCase();
    
    // Ignore unassigned markers - staff should NEVER see unassigned leads unless explicitly assigned
    if (!assigned || assigned === '—' || assigned === '-' || assigned === 'unassigned' || assigned === 'none') {
      if (assignedEmail && assignedEmail === activeEmail) return true;
      return false;
    }

    if (assignedEmail && assignedEmail === activeEmail) return true;
    if (assigned === activeName || (activeFirstName && assigned === activeFirstName)) return true;
    if (activeName && (assigned.includes(activeName) || activeName.includes(assigned))) return true;
    if (activeFirstName && activeFirstName.length >= 3 && (assigned.includes(activeFirstName) || activeFirstName.includes(assigned))) return true;

    return false;
  });
}
