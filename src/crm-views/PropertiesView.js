import { getProperties, addProperty, updateProperty, deleteProperty, resetPropertiesToDefault } from '../utils/propertiesStore.js';
import { addAuditLog } from '../utils/siteImagesStore.js';

let activeSearch = '';
let activeTypeFilter = 'all';
let activeCategoryFilter = 'all';
let activeStatusFilter = 'all';
let activeMaxPriceFilter = 'all';

let currentViewMode = 'list'; // 'list' or 'form'
let editingPropertyId = null; // null for add, string ID for edit

export function setPropertiesSearchFilter(query) {
  activeSearch = query;
}

// State for active form image gallery & video upload
let formImagesList = [];
let formVideoFileUrl = '';
let leafletMapInstance = null;
let leafletMarkerInstance = null;

export function renderPropertiesView() {
  const allProperties = getProperties();

  if (currentViewMode === 'form') {
    const editingProp = editingPropertyId ? allProperties.find(p => p.id === editingPropertyId) : null;
    return renderFullPagePropertyForm(editingProp);
  }

  const filtered = filterPropertiesList(allProperties);

  return `
    <div class="view-enter properties-view-container" style="padding-bottom: 40px;">
      
      <!-- Top Header Matching Reference Image 2 -->
      <div class="os-module-header" style="
        display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; margin-bottom: 24px;
      ">
        <div style="display: flex; align-items: center; gap: 14px;">
          <div style="
            width: 46px; height: 46px; border-radius: 12px; background: rgba(235,94,40,0.12);
            color: var(--color-orange, #eb5e28); display: flex; align-items: center; justify-content: center; font-size: 1.4rem;
          ">
            <i class="ri-building-4-fill"></i>
          </div>
          <div>
            <a href="#users" style="display: inline-flex; align-items: center; gap: 4px; font-size: 0.82rem; color: #718096; text-decoration: none; font-weight: 700; margin-bottom: 6px; transition: color 0.2s;" onmouseover="this.style.color='#1a202c'" onmouseout="this.style.color='#718096'">
              <i class="ri-arrow-left-line"></i> Back to Registered Users
            </a>
            <h1 style="font-size: 1.5rem; font-weight: 700; color: #1a202c; margin: 0; line-height: 1.2;">Properties Inventory</h1>
            <p style="font-size: 0.88rem; color: #718096; margin: 2px 0 0 0;">Browse, list, and manage your property catalog</p>
          </div>
        </div>

        <!-- Top Right Actions: Export CSV and + Add Property -->
        <div style="display: flex; align-items: center; gap: 12px;">
          <button class="os-btn-secondary" id="export-props-csv-btn" title="Export currently listed properties to CSV" style="display: inline-flex; align-items: center; gap: 6px; padding: 10px 18px; font-size: 0.88rem; border-radius: 10px; border: 1px solid #cbd5e0; background: #ffffff; color: #4a5568; font-weight: 600; cursor: pointer;">
            <i class="ri-download-cloud-line" style="font-size: 1.1rem; color: var(--color-orange, #eb5e28);"></i>
            <span>Export CSV</span>
          </button>

          <button class="os-btn-primary" id="open-add-property-form-btn" style="
            display: inline-flex; align-items: center; gap: 6px; padding: 10px 22px; font-size: 0.9rem; font-weight: 700;
            border-radius: 10px; background: var(--color-orange, #eb5e28); color: #ffffff; border: none; cursor: pointer;
            box-shadow: 0 4px 12px rgba(235,94,40,0.25);
          ">
            <i class="ri-add-line" style="font-size: 1.15rem;"></i>
            <span>Add property</span>
          </button>
        </div>
      </div>

      <!-- Filter Bar -->
      <div style="
        background: #ffffff; border-radius: 16px; padding: 14px 18px; border: 1px solid #e2e8f0;
        box-shadow: 0 2px 8px rgba(0,0,0,0.03); margin-bottom: 28px; display: flex; flex-wrap: wrap; gap: 12px; align-items: center;
      ">
        <div style="position: relative; flex: 1; min-width: 240px;">
          <i class="ri-search-line" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #a0aec0; font-size: 1rem;"></i>
          <input type="text" id="props-search-input" value="${activeSearch}" placeholder="Search title / location..." style="
            width: 100%; padding: 8px 12px 8px 36px; border-radius: 8px; border: 1px solid #cbd5e0; font-size: 0.88rem; outline: none;
          " />
        </div>

        <select id="props-type-filter" style="padding: 8px 14px; border-radius: 8px; border: 1px solid #cbd5e0; background: #fff; font-size: 0.88rem; color: #4a5568;">
          <option value="all" ${activeTypeFilter === 'all' ? 'selected' : ''}>All types</option>
          <option value="Apartment" ${activeTypeFilter === 'Apartment' ? 'selected' : ''}>Apartment</option>
          <option value="Villa" ${activeTypeFilter === 'Villa' ? 'selected' : ''}>Villa</option>
          <option value="Townhouse" ${activeTypeFilter === 'Townhouse' ? 'selected' : ''}>Townhouse</option>
          <option value="Penthouse" ${activeTypeFilter === 'Penthouse' ? 'selected' : ''}>Penthouse</option>
          <option value="Studio" ${activeTypeFilter === 'Studio' ? 'selected' : ''}>Studio</option>
          <option value="Plot" ${activeTypeFilter === 'Plot' ? 'selected' : ''}>Plot</option>
          <option value="Office" ${activeTypeFilter === 'Office' ? 'selected' : ''}>Office</option>
          <option value="Retail" ${activeTypeFilter === 'Retail' ? 'selected' : ''}>Retail</option>
          <option value="Warehouse" ${activeTypeFilter === 'Warehouse' ? 'selected' : ''}>Warehouse</option>
          <option value="Other" ${activeTypeFilter === 'Other' ? 'selected' : ''}>Other</option>
        </select>

        <select id="props-category-filter" style="padding: 8px 14px; border-radius: 8px; border: 1px solid #cbd5e0; background: #fff; font-size: 0.88rem; color: #4a5568;">
          <option value="all" ${activeCategoryFilter === 'all' ? 'selected' : ''}>All categories</option>
          <option value="Sale" ${activeCategoryFilter === 'Sale' ? 'selected' : ''}>Sale</option>
          <option value="Rent" ${activeCategoryFilter === 'Rent' ? 'selected' : ''}>Rent</option>
          <option value="Lease" ${activeCategoryFilter === 'Lease' ? 'selected' : ''}>Lease</option>
          <option value="Commercial" ${activeCategoryFilter === 'Commercial' ? 'selected' : ''}>Commercial</option>
          <option value="Residential" ${activeCategoryFilter === 'Residential' ? 'selected' : ''}>Residential</option>
        </select>

        <select id="props-status-filter" style="padding: 8px 14px; border-radius: 8px; border: 1px solid #cbd5e0; background: #fff; font-size: 0.88rem; color: #4a5568;">
          <option value="all" ${activeStatusFilter === 'all' ? 'selected' : ''}>All statuses</option>
          <option value="Available" ${activeStatusFilter === 'Available' ? 'selected' : ''}>Available</option>
          <option value="Booked" ${activeStatusFilter === 'Booked' ? 'selected' : ''}>Booked</option>
          <option value="Sold" ${activeStatusFilter === 'Sold' ? 'selected' : ''}>Sold</option>
          <option value="Rented" ${activeStatusFilter === 'Rented' ? 'selected' : ''}>Rented</option>
          <option value="Inactive" ${activeStatusFilter === 'Inactive' ? 'selected' : ''}>Inactive</option>
        </select>

        <select id="props-maxprice-filter" style="padding: 8px 14px; border-radius: 8px; border: 1px solid #cbd5e0; background: #fff; font-size: 0.88rem; color: #4a5568;">
          <option value="all" ${activeMaxPriceFilter === 'all' ? 'selected' : ''}>Max price</option>
          <option value="5000000" ${activeMaxPriceFilter === '5000000' ? 'selected' : ''}>Under ₹ 50 Lakhs</option>
          <option value="15000000" ${activeMaxPriceFilter === '15000000' ? 'selected' : ''}>Under ₹ 1.5 Cr</option>
          <option value="30000000" ${activeMaxPriceFilter === '30000000' ? 'selected' : ''}>Under ₹ 3.0 Cr</option>
        </select>
      </div>

      <!-- Properties Grid Matching Reference Image 2 Layout Exactly -->
      ${filtered.length > 0 ? `
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px;">
          ${filtered.map(prop => renderAdminPropertyCard(prop)).join('')}
        </div>
      ` : `
        <div style="text-align: center; padding: 70px 20px; background: #ffffff; border-radius: 20px; border: 1px dashed #cbd5e0;">
          <i class="ri-building-4-line" style="font-size: 3rem; color: #a0aec0; margin-bottom: 12px; display: block;"></i>
          <h3 style="font-size: 1.25rem; font-weight: 700; color: #2d3748; margin-bottom: 8px;">No properties match your filter</h3>
          <p style="color: #718096; font-size: 0.9rem; margin-bottom: 20px;">Try clearing your search query or add a new property listing.</p>
          <button class="os-btn-primary" id="empty-add-prop-btn">
            <i class="ri-add-line"></i> Add property
          </button>
        </div>
      `}

    </div>
  `;
}

// Render Property Card Matching Reference Image 2 Layout Exactly
function renderAdminPropertyCard(prop) {
  const status = prop.status || prop.availability || 'Available';
  const statusClass = status.toLowerCase();
  
  const statusColor = statusClass === 'available' ? '#276749' 
                    : statusClass === 'booked' ? '#dd6b20' 
                    : statusClass === 'rented' ? '#3182ce' 
                    : '#e53e3e';
  
  const statusBg = statusClass === 'available' ? '#e6fffa' 
                 : statusClass === 'booked' ? '#feebc8' 
                 : statusClass === 'rented' ? '#ebf8ff' 
                 : '#fff5f5';

  const mainImg = prop.images && prop.images[0] ? prop.images[0] : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80';

  const specsArray = [];
  if (prop.bedrooms) specsArray.push(`${prop.bedrooms} bed`);
  if (prop.bathrooms) specsArray.push(`${prop.bathrooms} bath`);
  if (prop.size) specsArray.push(prop.size);

  return `
    <div class="crm-ref-prop-card" data-id="${prop.id}" style="
      background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;
      box-shadow: 0 4px 16px rgba(0,0,0,0.03); display: flex; flex-direction: column; transition: transform 0.2s ease, box-shadow 0.2s ease;
    ">
      <!-- Card Image Header -->
      <div style="height: 200px; position: relative; overflow: hidden; background: #f0f4f8;">
        <img src="${mainImg}" alt="${prop.title}" style="
          width: 100%; height: 100%; object-fit: cover; object-position: center; display: block;
        " />
        
        <!-- Status Badge Top Right -->
        <span style="
          position: absolute; top: 12px; right: 12px; padding: 4px 10px; border-radius: 6px;
          font-size: 0.72rem; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase;
          background: ${statusBg}; color: ${statusColor}; border: 1px solid ${statusColor}44; box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        ">
          ${status}
        </span>
      </div>

      <!-- Card Body matching Image 2 -->
      <div style="padding: 18px 20px; display: flex; flex-direction: column; flex: 1;">
        
        <!-- Title -->
        <h3 style="font-size: 1.05rem; font-weight: 700; color: #1a202c; margin: 0 0 4px 0; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
          ${prop.title}
        </h3>

        <!-- Location & Type Info Line -->
        <p style="font-size: 0.82rem; color: #718096; margin: 0 0 10px 0;">
          ${prop.location || prop.district} • Property • ${prop.categoryRaw || prop.type || 'Sale'}
        </p>

        <!-- Bold Price -->
        <div style="font-size: 1.35rem; font-weight: 800; color: var(--color-orange, #eb5e28); margin-bottom: 8px;">
          ${prop.priceFormatted || `₹ ${prop.price}`}
        </div>

        <!-- Specs Line -->
        <div style="font-size: 0.82rem; color: #718096; margin-bottom: 18px;">
          ${specsArray.length > 0 ? specsArray.join(' • ') : prop.size || 'Prime Property'}
        </div>

        <!-- Bottom Action Bar Matching Image 2 -->
        <div style="
          margin-top: auto; padding-top: 14px; border-top: 1px solid #edf2f7;
          display: flex; justify-content: space-between; align-items: center;
        ">
          <!-- Status Dropdown with "Update availability" Tooltip -->
          <div style="position: relative;" title="Update availability">
            <select class="quick-status-select" data-id="${prop.id}" style="
              padding: 6px 12px; font-size: 0.8rem; font-weight: 600; border-radius: 8px; border: 1px solid #cbd5e0;
              background: #ffffff; color: #2d3748; cursor: pointer; outline: none;
            ">
              <option value="Available" ${status === 'Available' ? 'selected' : ''}>Available</option>
              <option value="Booked" ${status === 'Booked' ? 'selected' : ''}>Booked</option>
              <option value="Sold" ${status === 'Sold' ? 'selected' : ''}>Sold</option>
              <option value="Rented" ${status === 'Rented' ? 'selected' : ''}>Rented</option>
              <option value="Inactive" ${status === 'Inactive' ? 'selected' : ''}>Inactive</option>
            </select>
          </div>

          <!-- Icon Actions (Eye / Edit / Delete) -->
          <div style="display: flex; gap: 8px; align-items: center;">
            <button class="view-website-prop-btn" data-id="${prop.id}" title="View Property Details" style="
              width: 32px; height: 32px; border-radius: 8px; background: #f7fafc; border: 1px solid #e2e8f0;
              color: #4a5568; display: flex; align-items: center; justify-content: center; cursor: pointer;
            ">
              <i class="ri-eye-line" style="font-size: 0.95rem;"></i>
            </button>

            <button class="edit-prop-btn" data-id="${prop.id}" title="Edit Property" style="
              width: 32px; height: 32px; border-radius: 8px; background: #ebf8ff; border: 1px solid #bee3f8;
              color: #2b6cb0; display: flex; align-items: center; justify-content: center; cursor: pointer;
            ">
              <i class="ri-edit-line" style="font-size: 0.95rem;"></i>
            </button>

            <button class="delete-prop-btn" data-id="${prop.id}" title="Delete Property" style="
              width: 32px; height: 32px; border-radius: 8px; background: #fff5f5; border: 1px solid #fed7d7;
              color: #e53e3e; display: flex; align-items: center; justify-content: center; cursor: pointer;
            ">
              <i class="ri-delete-bin-line" style="font-size: 0.95rem;"></i>
            </button>
          </div>
        </div>

      </div>
    </div>
  `;
}

// Render FULL PAGE Inline Property Form
function renderFullPagePropertyForm(prop = null) {
  const isEdit = Boolean(prop);
  
  formImagesList = prop?.images ? [...prop.images] : [];
  formVideoFileUrl = prop?.videoUrl || '';

  const currentType = prop?.type || 'Apartment';
  const isResidential = ['Apartment', 'Villa', 'Townhouse', 'Penthouse', 'Studio', 'villas', 'houses', 'apartments'].includes(currentType);

  return `
    <div class="view-enter full-page-property-form" style="max-width: 980px; margin: 0 auto; padding-bottom: 60px;">
      
      <!-- Top Breadcrumb Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <button id="back-to-props-list-btn" style="
          display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 10px;
          background: #ffffff; border: 1px solid #cbd5e0; color: #2d3748; font-weight: 600; font-size: 0.9rem; cursor: pointer;
        ">
          <i class="ri-arrow-left-line"></i>
          <span>Back to Properties Inventory</span>
        </button>

        <span style="font-size: 0.85rem; color: #718096; font-weight: 600;">
          ${isEdit ? `Editing Property ID: ${prop.id}` : 'Creating New Property Listing'}
        </span>
      </div>

      <!-- Main Form Container -->
      <div style="background: #ffffff; border-radius: 20px; border: 1px solid #e2e8f0; box-shadow: 0 6px 24px rgba(0,0,0,0.04); overflow: hidden;">
        
        <!-- Header Title Banner -->
        <div style="padding: 24px 32px; background: #faf8f5; border-bottom: 1px solid #e2e8f0;">
          <span style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: var(--color-orange, #eb5e28); letter-spacing: 0.08em;">
            PROPERTIES INVENTORY FORM
          </span>
          <h2 style="font-size: 1.6rem; font-weight: 700; color: #1a1a1a; margin: 4px 0 0 0;">
            ${isEdit ? `Edit Property (${prop.id})` : 'Add Property'}
          </h2>
          <p style="font-size: 0.88rem; color: #718096; margin: 4px 0 0 0;">
            ${isEdit ? 'Update property details, photos, video, and map location below' : 'New listing — enter title, category, price, photos, and location details'}
          </p>
        </div>

        <!-- Inline Form -->
        <form id="prop-admin-form" style="padding: 32px; display: flex; flex-direction: column; gap: 32px;">
          
          <!-- SECTION 1: BASICS -->
          <div>
            <h4 style="font-size: 0.85rem; font-weight: 800; text-transform: uppercase; color: #4a5568; letter-spacing: 0.08em; margin-bottom: 18px;">
              BASICS
            </h4>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 18px;">
              <div style="grid-column: span 2;">
                <label style="font-size: 0.82rem; font-weight: 700; color: #4a5568; display: block; margin-bottom: 6px;">Title *</label>
                <input type="text" id="form-prop-title" required value="${isEdit ? prop?.title || '' : ''}" placeholder="e.g. Premium Villa in Anna Nagar" style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #cbd5e0;" />
              </div>

              <!-- Type Dropdown -->
              <div>
                <label style="font-size: 0.82rem; font-weight: 700; color: #4a5568; display: block; margin-bottom: 6px;">Type *</label>
                <select id="form-prop-type" required style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #cbd5e0; background: #fff;">
                  <option value="Apartment" ${currentType === 'Apartment' || currentType === 'apartments' ? 'selected' : ''}>Apartment</option>
                  <option value="Villa" ${currentType === 'Villa' || currentType === 'villas' ? 'selected' : ''}>Villa</option>
                  <option value="Townhouse" ${currentType === 'Townhouse' ? 'selected' : ''}>Townhouse</option>
                  <option value="Penthouse" ${currentType === 'Penthouse' ? 'selected' : ''}>Penthouse</option>
                  <option value="Studio" ${currentType === 'Studio' ? 'selected' : ''}>Studio</option>
                  <option value="Plot" ${currentType === 'Plot' || currentType === 'plots' ? 'selected' : ''}>Plot</option>
                  <option value="Office" ${currentType === 'Office' ? 'selected' : ''}>Office</option>
                  <option value="Retail" ${currentType === 'Retail' ? 'selected' : ''}>Retail</option>
                  <option value="Warehouse" ${currentType === 'Warehouse' ? 'selected' : ''}>Warehouse</option>
                  <option value="Other" ${currentType === 'Other' ? 'selected' : ''}>Other</option>
                </select>
              </div>

              <!-- Category Dropdown -->
              <div>
                <label style="font-size: 0.82rem; font-weight: 700; color: #4a5568; display: block; margin-bottom: 6px;">Category *</label>
                <select id="form-prop-category" required style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #cbd5e0; background: #fff;">
                  <option value="Sale" ${isEdit && (prop?.categoryRaw === 'Sale' || prop?.category === 'Sale' || prop?.purpose === 'buy') ? 'selected' : ''}>Sale</option>
                  <option value="Rent" ${isEdit && (prop?.categoryRaw === 'Rent' || prop?.category === 'Rent' || prop?.purpose === 'rent') ? 'selected' : ''}>Rent</option>
                  <option value="Lease" ${isEdit && prop?.categoryRaw === 'Lease' ? 'selected' : ''}>Lease</option>
                  <option value="Commercial" ${isEdit && prop?.categoryRaw === 'Commercial' ? 'selected' : ''}>Commercial</option>
                  <option value="Residential" ${isEdit && prop?.categoryRaw === 'Residential' ? 'selected' : ''}>Residential</option>
                </select>
              </div>

              <!-- Location -->
              <div>
                <label style="font-size: 0.82rem; font-weight: 700; color: #4a5568; display: block; margin-bottom: 6px;">Location *</label>
                <input type="text" id="form-prop-location" required value="${isEdit ? prop?.location || '' : ''}" placeholder="e.g. Anna Nagar, Chennai" style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #cbd5e0;" />
              </div>

              <!-- Address -->
              <div>
                <label style="font-size: 0.82rem; font-weight: 700; color: #4a5568; display: block; margin-bottom: 6px;">Address</label>
                <input type="text" id="form-prop-address" value="${isEdit ? prop?.address || '' : ''}" placeholder="Street address or landmark" style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #cbd5e0;" />
              </div>

              <!-- Area (sqft) -->
              <div>
                <label style="font-size: 0.82rem; font-weight: 700; color: #4a5568; display: block; margin-bottom: 6px;">Area (sqft)</label>
                <input type="text" id="form-prop-size" value="${isEdit ? prop?.size || '' : ''}" placeholder="e.g. 2,400 sqft or 6.5 Acres" style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #cbd5e0;" />
              </div>
            </div>

            <!-- DYNAMIC RESIDENTIAL STRUCTURE FIELDS -->
            <div id="residential-specs-section" style="
              margin-top: 20px; display: ${isResidential ? 'grid' : 'none'}; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px;
              background: #fdfbf7; padding: 20px; border-radius: 14px; border: 1px dashed #cbd5e0;
            ">
              <div>
                <label style="font-size: 0.82rem; font-weight: 700; color: #4a5568; display: block; margin-bottom: 6px;">Bedrooms</label>
                <input type="number" id="form-prop-bedrooms" value="${isEdit ? prop?.bedrooms || '' : ''}" placeholder="e.g. 4" style="width: 100%; padding: 10px 14px; font-size: 0.9rem; border-radius: 8px; border: 1px solid #cbd5e0;" />
              </div>

              <div>
                <label style="font-size: 0.82rem; font-weight: 700; color: #4a5568; display: block; margin-bottom: 6px;">Bathrooms</label>
                <input type="number" id="form-prop-bathrooms" value="${isEdit ? prop?.bathrooms || '' : ''}" placeholder="e.g. 4" style="width: 100%; padding: 10px 14px; font-size: 0.9rem; border-radius: 8px; border: 1px solid #cbd5e0;" />
              </div>

              <div>
                <label style="font-size: 0.82rem; font-weight: 700; color: #4a5568; display: block; margin-bottom: 6px;">Furnishing</label>
                <select id="form-prop-furnishing" style="width: 100%; padding: 10px 14px; font-size: 0.9rem; border-radius: 8px; border: 1px solid #cbd5e0; background: #fff;">
                  <option value="Not specified" ${isEdit && prop?.furnishing === 'Not specified' ? 'selected' : ''}>Not specified</option>
                  <option value="Fully Furnished" ${isEdit && prop?.furnishing === 'Fully Furnished' ? 'selected' : ''}>Fully Furnished</option>
                  <option value="Semi-Furnished" ${isEdit && prop?.furnishing === 'Semi-Furnished' ? 'selected' : ''}>Semi-Furnished</option>
                  <option value="Unfurnished" ${isEdit && prop?.furnishing === 'Unfurnished' ? 'selected' : ''}>Unfurnished</option>
                </select>
              </div>
            </div>

          </div>

          <!-- SECTION 2: PRICING & AVAILABILITY -->
          <div style="border-top: 1px solid #e2e8f0; padding-top: 24px;">
            <h4 style="font-size: 0.85rem; font-weight: 800; text-transform: uppercase; color: #4a5568; letter-spacing: 0.08em; margin-bottom: 18px;">
              PRICING & AVAILABILITY
            </h4>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 18px;">
              <div>
                <label style="font-size: 0.82rem; font-weight: 700; color: #4a5568; display: block; margin-bottom: 6px;">Price *</label>
                <input type="number" id="form-prop-price-num" required value="${isEdit ? prop?.price || '' : ''}" placeholder="e.g. 13500000" style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #cbd5e0;" />
              </div>

              <div>
                <label style="font-size: 0.82rem; font-weight: 700; color: #4a5568; display: block; margin-bottom: 6px;">Currency</label>
                <select id="form-prop-currency" style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #cbd5e0; background: #fff;">
                  <option value="INR" selected>INR</option>
                  <option value="USD">USD</option>
                </select>
              </div>

              <div>
                <label style="font-size: 0.82rem; font-weight: 700; color: #4a5568; display: block; margin-bottom: 6px;">Availability *</label>
                <select id="form-prop-availability" required style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #cbd5e0; background: #fff;">
                  <option value="Available" ${!isEdit || prop?.availability === 'Available' || prop?.status === 'Available' ? 'selected' : ''}>Available</option>
                  <option value="Booked" ${isEdit && (prop?.availability === 'Booked' || prop?.status === 'Booked') ? 'selected' : ''}>Booked</option>
                  <option value="Sold" ${isEdit && (prop?.availability === 'Sold' || prop?.status === 'Sold') ? 'selected' : ''}>Sold</option>
                  <option value="Rented" ${isEdit && (prop?.availability === 'Rented' || prop?.status === 'Rented') ? 'selected' : ''}>Rented</option>
                  <option value="Inactive" ${isEdit && (prop?.availability === 'Inactive' || prop?.status === 'Inactive') ? 'selected' : ''}>Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <!-- SECTION 3: OWNER & CONTACT -->
          <div style="border-top: 1px solid #e2e8f0; padding-top: 24px;">
            <h4 style="font-size: 0.85rem; font-weight: 800; text-transform: uppercase; color: #4a5568; letter-spacing: 0.08em; margin-bottom: 18px;">
              OWNER & CONTACT
            </h4>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 18px;">
              <div>
                <label style="font-size: 0.82rem; font-weight: 700; color: #4a5568; display: block; margin-bottom: 6px;">Owner / company</label>
                <input type="text" id="form-prop-owner-company" value="${isEdit ? prop?.ownerName || '' : ''}" placeholder="e.g. Arun / Thanjai Property" style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #cbd5e0;" />
              </div>

              <div>
                <label style="font-size: 0.82rem; font-weight: 700; color: #4a5568; display: block; margin-bottom: 6px;">Contact name</label>
                <input type="text" id="form-prop-contact-name" value="${isEdit ? prop?.listedBy || '' : ''}" placeholder="e.g. Aishwarya Raman" style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #cbd5e0;" />
              </div>

              <div>
                <label style="font-size: 0.82rem; font-weight: 700; color: #4a5568; display: block; margin-bottom: 6px;">Contact phone</label>
                <input type="tel" id="form-prop-contact-phone" value="${isEdit ? prop?.ownerPhone || '' : ''}" placeholder="+91 94431 25009" style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #cbd5e0;" />
              </div>
            </div>
          </div>

          <!-- SECTION 4: DETAILS -->
          <div style="border-top: 1px solid #e2e8f0; padding-top: 24px;">
            <h4 style="font-size: 0.85rem; font-weight: 800; text-transform: uppercase; color: #4a5568; letter-spacing: 0.08em; margin-bottom: 18px;">
              DETAILS
            </h4>

            <div style="display: flex; flex-direction: column; gap: 18px;">
              <div>
                <label style="font-size: 0.82rem; font-weight: 700; color: #4a5568; display: block; margin-bottom: 6px;">Amenities (comma separated)</label>
                <input type="text" id="form-prop-features" value="${isEdit && prop?.features ? prop.features.join(', ') : ''}" placeholder="e.g. Pool, Gym, Parking, Clear Patta Title" style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #cbd5e0;" />
              </div>

              <div>
                <label style="font-size: 0.82rem; font-weight: 700; color: #4a5568; display: block; margin-bottom: 6px;">Description</label>
                <textarea id="form-prop-desc" rows="4" style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #cbd5e0;" placeholder="Enter detailed property description...">${isEdit ? prop?.description || '' : ''}</textarea>
              </div>
            </div>
          </div>

          <!-- SECTION 5: MEDIA & LOCATION -->
          <div style="border-top: 1px solid #e2e8f0; padding-top: 24px;">
            <h4 style="font-size: 0.85rem; font-weight: 800; text-transform: uppercase; color: #4a5568; letter-spacing: 0.08em; margin-bottom: 18px;">
              MEDIA & LOCATION
            </h4>

            <div style="display: flex; flex-direction: column; gap: 20px;">
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 18px;">
                <div>
                  <label style="font-size: 0.82rem; font-weight: 700; color: #4a5568; display: block; margin-bottom: 6px;">YouTube Video Link</label>
                  <input type="url" id="form-prop-videolink" value="${isEdit ? prop?.videoUrl || '' : ''}" placeholder="https://youtube.com/watch?v=..." style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #cbd5e0;" />
                </div>

                <div>
                  <label style="font-size: 0.82rem; font-weight: 700; color: #4a5568; display: block; margin-bottom: 6px;">Upload Video File</label>
                  <label style="
                    display: flex; align-items: center; gap: 8px; padding: 10px 16px; border-radius: 10px;
                    background: #f7fafc; border: 1px dashed #cbd5e0; color: #4a5568; font-weight: 600; font-size: 0.88rem; cursor: pointer; height: 44px;
                  ">
                    <i class="ri-video-upload-line" style="color: var(--color-orange, #eb5e28); font-size: 1.2rem;"></i>
                    <span id="video-file-label-text">${formVideoFileUrl ? 'Video Uploaded' : 'Upload Video (.mp4 / .mov)'}</span>
                    <input type="file" id="form-prop-video-file-input" accept="video/*" style="display: none;" />
                  </label>
                </div>

                <div>
                  <label style="font-size: 0.82rem; font-weight: 700; color: #4a5568; display: block; margin-bottom: 6px;">Latitude</label>
                  <input type="text" id="form-prop-latitude" value="${isEdit ? prop?.latitude || '' : ''}" placeholder="e.g. 10.786999" style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #cbd5e0;" />
                </div>

                <div>
                  <label style="font-size: 0.82rem; font-weight: 700; color: #4a5568; display: block; margin-bottom: 6px;">Longitude</label>
                  <input type="text" id="form-prop-longitude" value="${isEdit ? prop?.longitude || '' : ''}" placeholder="e.g. 79.137827" style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #cbd5e0;" />
                </div>
              </div>

              <!-- Location Buttons -->
              <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                <button type="button" id="use-my-location-btn" style="
                  display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 10px;
                  background: #ffffff; border: 1px solid #cbd5e0; color: #2d3748; font-weight: 600; font-size: 0.88rem; cursor: pointer;
                  box-shadow: 0 2px 6px rgba(0,0,0,0.04);
                ">
                  <i class="ri-map-pin-user-fill" style="color: var(--color-orange, #eb5e28); font-size: 1.1rem;"></i>
                  <span>Use my current location</span>
                </button>

                <button type="button" id="select-location-map-btn" style="
                  display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 10px;
                  background: #ffffff; border: 1px solid #cbd5e0; color: #2d3748; font-weight: 600; font-size: 0.88rem; cursor: pointer;
                  box-shadow: 0 2px 6px rgba(0,0,0,0.04);
                ">
                  <i class="ri-compass-3-fill" style="color: #3182ce; font-size: 1.1rem;"></i>
                  <span>Select Location on Interactive Map</span>
                </button>
              </div>

              <!-- Interactive Leaflet Pinpoint Map Container -->
              <div id="map-picker-container" style="display: none; margin-top: 10px; border-radius: 16px; overflow: hidden; border: 1px solid #cbd5e0; background: #ffffff; box-shadow: 0 4px 16px rgba(0,0,0,0.08);">
                <div style="padding: 14px 18px; background: #faf8f5; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 0.88rem; font-weight: 700; color: #2d3748;">
                    <i class="ri-map-pin-line" style="color: var(--color-orange, #eb5e28);"></i> Click anywhere on the map to pinpoint property coordinates
                  </span>
                  <button type="button" id="close-map-picker-btn" style="background: none; border: none; font-size: 0.85rem; color: #e53e3e; cursor: pointer; font-weight: 700;">Close Map</button>
                </div>

                <div id="leaflet-interactive-map" style="height: 340px; width: 100%;"></div>
              </div>

              <!-- Images Upload & Gallery with Delete Buttons -->
              <div>
                <label style="font-size: 0.82rem; font-weight: 700; color: #4a5568; display: block; margin-bottom: 8px;">Images *</label>
                
                <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: flex-start; margin-bottom: 14px;">
                  <!-- Upload Box -->
                  <label style="
                    width: 130px; height: 105px; border-radius: 14px; border: 2px dashed #cbd5e0; background: #f7fafc;
                    display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; gap: 6px; flex-shrink: 0;
                  ">
                    <i class="ri-upload-2-line" style="font-size: 1.5rem; color: #718096;"></i>
                    <span style="font-size: 0.8rem; font-weight: 600; color: #4a5568;">Upload</span>
                    <input type="file" id="form-prop-file-input" accept="image/*" multiple style="display: none;" />
                  </label>

                  <!-- Take Photo Box -->
                  <button type="button" id="take-photo-btn" style="
                    width: 130px; height: 105px; border-radius: 14px; border: 2px dashed #cbd5e0; background: #f7fafc;
                    display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; gap: 6px; flex-shrink: 0;
                  ">
                    <i class="ri-camera-line" style="font-size: 1.5rem; color: #718096;"></i>
                    <span style="font-size: 0.8rem; font-weight: 600; color: #4a5568;">Take photo</span>
                  </button>

                  <!-- Interactive Uploaded Thumbnails Container with Delete Buttons -->
                  <div id="uploaded-images-preview-grid" style="display: flex; gap: 12px; flex-wrap: wrap;">
                    ${renderUploadedImagesGallery()}
                  </div>
                </div>

                <!-- Primary Image URL Input -->
                <div>
                  <input type="url" id="form-prop-img-main" value="${formImagesList[0] || ''}" placeholder="Or paste Image URL (https://images.unsplash.com/...)" style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #cbd5e0;" />
                </div>
              </div>

            </div>
          </div>

          <!-- Bottom Form Actions -->
          <div style="
            background: #ffffff; padding-top: 24px; border-top: 1px solid #e2e8f0;
            display: flex; justify-content: flex-end; gap: 14px;
          ">
            <button type="button" id="cancel-prop-form-btn" class="os-btn-secondary" style="padding: 12px 24px;">Cancel</button>
            <button type="submit" class="os-btn-primary" style="padding: 12px 28px; font-weight: 700; background: var(--color-orange, #eb5e28); color: #ffffff; border: none; border-radius: 10px;">
              <i class="ri-save-line"></i> ${isEdit ? 'Save Property' : 'Create Property'}
            </button>
          </div>

        </form>
      </div>
    </div>
  `;
}

function renderUploadedImagesGallery() {
  if (!formImagesList || formImagesList.length === 0) return '';

  return formImagesList.map((imgUrl, index) => `
    <div class="img-preview-thumb-item" style="
      position: relative; width: 130px; height: 105px; border-radius: 14px; overflow: hidden; border: 1px solid #cbd5e0; background: #111; flex-shrink: 0;
    ">
      <img src="${imgUrl}" style="width: 100%; height: 100%; object-fit: cover;" />
      
      <!-- Red Delete Button -->
      <button type="button" class="delete-uploaded-img-btn" data-index="${index}" title="Remove photo" style="
        position: absolute; top: 6px; right: 6px; width: 26px; height: 26px; border-radius: 50%;
        background: rgba(229, 62, 62, 0.9); color: #ffffff; border: none; font-size: 0.9rem;
        display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      ">
        <i class="ri-close-line"></i>
      </button>
    </div>
  `).join('');
}

function filterPropertiesList(list) {
  return list.filter(prop => {
    // 1. Keyword search
    if (activeSearch) {
      const q = activeSearch.toLowerCase().trim();
      const matchTitle = (prop.title || '').toLowerCase().includes(q);
      const matchLoc = (prop.location || '').toLowerCase().includes(q);
      const matchDist = (prop.district || '').toLowerCase().includes(q);
      const matchId = (prop.id || '').toLowerCase().includes(q);
      const matchType = (prop.type || '').toLowerCase().includes(q);
      if (!matchTitle && !matchLoc && !matchDist && !matchId && !matchType) return false;
    }

    // 2. Type Filter
    if (activeTypeFilter && activeTypeFilter !== 'all') {
      const pType = (prop.type || '').toLowerCase();
      const pCatLabel = (prop.categoryLabel || '').toLowerCase();
      const pCat = (prop.category || '').toLowerCase();
      const targetType = activeTypeFilter.toLowerCase();

      let isTypeMatch = false;
      if (targetType === 'apartment') {
        isTypeMatch = pType.includes('apartment') || pCatLabel.includes('apartment') || pCat.includes('apartment');
      } else if (targetType === 'villa') {
        isTypeMatch = pType.includes('villa') || pCatLabel.includes('villa') || pCat.includes('villa');
      } else if (targetType === 'townhouse') {
        isTypeMatch = pType.includes('townhouse') || pCatLabel.includes('townhouse');
      } else if (targetType === 'penthouse') {
        isTypeMatch = pType.includes('penthouse') || pCatLabel.includes('penthouse');
      } else if (targetType === 'studio') {
        isTypeMatch = pType.includes('studio') || pCatLabel.includes('studio');
      } else if (targetType === 'plot') {
        isTypeMatch = pType.includes('plot') || pType.includes('land') || pCatLabel.includes('plot') || pCat.includes('plot') || pCat.includes('agricultural');
      } else if (targetType === 'office') {
        isTypeMatch = pType.includes('office') || pCatLabel.includes('office') || pCat.includes('commercial');
      } else if (targetType === 'retail') {
        isTypeMatch = pType.includes('retail') || pCatLabel.includes('retail');
      } else if (targetType === 'warehouse') {
        isTypeMatch = pType.includes('warehouse') || pCatLabel.includes('warehouse');
      } else {
        isTypeMatch = pType === targetType || pCat === targetType;
      }

      if (!isTypeMatch) return false;
    }

    // 3. Category Filter
    if (activeCategoryFilter && activeCategoryFilter !== 'all') {
      const pCatRaw = (prop.categoryRaw || '').toLowerCase();
      const pCat = (prop.category || '').toLowerCase();
      const pPurpose = (prop.purpose || '').toLowerCase();
      const targetCat = activeCategoryFilter.toLowerCase();

      let isCatMatch = false;
      if (targetCat === 'sale') {
        isCatMatch = pCatRaw === 'sale' || pPurpose === 'buy' || pCatRaw === '';
      } else if (targetCat === 'rent') {
        isCatMatch = pCatRaw === 'rent' || pPurpose === 'rent';
      } else if (targetCat === 'lease') {
        isCatMatch = pCatRaw === 'lease';
      } else if (targetCat === 'commercial') {
        isCatMatch = pCatRaw === 'commercial' || pCat === 'commercial';
      } else if (targetCat === 'residential') {
        isCatMatch = pCatRaw === 'residential' || pCat === 'villas' || pCat === 'houses' || pCat === 'apartments';
      } else {
        isCatMatch = pCatRaw === targetCat || pCat === targetCat;
      }

      if (!isCatMatch) return false;
    }

    // 4. Status Filter
    if (activeStatusFilter && activeStatusFilter !== 'all') {
      const pStatus = (prop.status || prop.availability || 'Available').toLowerCase();
      const targetStatus = activeStatusFilter.toLowerCase();
      if (pStatus !== targetStatus) return false;
    }

    // 5. Max Price Filter
    if (activeMaxPriceFilter && activeMaxPriceFilter !== 'all') {
      const maxP = parseFloat(activeMaxPriceFilter);
      if (prop.price > maxP) return false;
    }

    return true;
  });
}

export function initPropertiesListeners() {
  if (currentViewMode === 'form') {
    initPropertyFormListeners();
    return;
  }

  // Search Input
  document.getElementById('props-search-input')?.addEventListener('input', (e) => {
    activeSearch = e.target.value;
    refreshPropertiesView();
  });

  // Filters
  document.getElementById('props-type-filter')?.addEventListener('change', (e) => {
    activeTypeFilter = e.target.value;
    refreshPropertiesView();
  });

  document.getElementById('props-category-filter')?.addEventListener('change', (e) => {
    activeCategoryFilter = e.target.value;
    refreshPropertiesView();
  });

  document.getElementById('props-status-filter')?.addEventListener('change', (e) => {
    activeStatusFilter = e.target.value;
    refreshPropertiesView();
  });

  document.getElementById('props-maxprice-filter')?.addEventListener('change', (e) => {
    activeMaxPriceFilter = e.target.value;
    refreshPropertiesView();
  });

  // Open Full-Page Add Form Button
  const openFormBtns = [
    document.getElementById('open-add-property-form-btn'),
    document.getElementById('empty-add-prop-btn')
  ];

  openFormBtns.forEach(btn => {
    btn?.addEventListener('click', () => {
      editingPropertyId = null;
      formImagesList = [];
      formVideoFileUrl = '';
      currentViewMode = 'form';
      refreshPropertiesView();
    });
  });

  // CSV Export ONLY Filtered / Listed Properties
  document.getElementById('export-props-csv-btn')?.addEventListener('click', exportFilteredPropertiesToCSV);

  // Edit Buttons
  document.querySelectorAll('.edit-prop-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      if (id) {
        editingPropertyId = id;
        currentViewMode = 'form';
        refreshPropertiesView();
      }
    });
  });

  // View Website Property Details Buttons
  document.querySelectorAll('.view-website-prop-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      window.open(`/#discover`, '_blank');
    });
  });

  // Delete Buttons
  document.querySelectorAll('.delete-prop-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      if (id && confirm(`Are you sure you want to delete property listing ${id}?`)) {
        deleteProperty(id);
        showToast(`Property ${id} deleted from inventory.`, 'ri-delete-bin-line');
        refreshPropertiesView();
      }
    });
  });

  // Quick Status Select Dropdown
  document.querySelectorAll('.quick-status-select').forEach(sel => {
    sel.addEventListener('change', (e) => {
      const id = sel.dataset.id;
      const newStatus = e.target.value;
      if (id && newStatus) {
        updateProperty(id, { status: newStatus, availability: newStatus });
        showToast(`Property ${id} status updated to ${newStatus}`, 'ri-checkbox-circle-fill');
        refreshPropertiesView();
      }
    });
  });
}

function initPropertyFormListeners() {
  const backBtns = [
    document.getElementById('back-to-props-list-btn'),
    document.getElementById('cancel-prop-form-btn')
  ];

  backBtns.forEach(btn => {
    btn?.addEventListener('click', () => {
      currentViewMode = 'list';
      refreshPropertiesView();
    });
  });

  const typeSelect = document.getElementById('form-prop-type');
  const resSpecsSection = document.getElementById('residential-specs-section');

  typeSelect?.addEventListener('change', (e) => {
    const selectedType = e.target.value;
    const isRes = ['Apartment', 'Villa', 'Townhouse', 'Penthouse', 'Studio', 'villas', 'houses', 'apartments'].includes(selectedType);
    if (resSpecsSection) {
      resSpecsSection.style.display = isRes ? 'grid' : 'none';
    }
  });

  document.getElementById('use-my-location-btn')?.addEventListener('click', () => {
    if ('geolocation' in navigator) {
      showToast('Fetching current GPS coordinates...', 'ri-compass-line');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(6);
          const lng = position.coords.longitude.toFixed(6);
          const latInput = document.getElementById('form-prop-latitude');
          const lngInput = document.getElementById('form-prop-longitude');
          if (latInput) latInput.value = lat;
          if (lngInput) lngInput.value = lng;
          showToast(`GPS set to Lat: ${lat}, Lng: ${lng}`, 'ri-map-pin-user-fill');
        },
        (err) => {
          console.warn('Geolocation error:', err);
          showToast('Could not fetch GPS. Set default coordinates.', 'ri-error-warning-line');
        }
      );
    } else {
      showToast('Geolocation is not supported by your browser.', 'ri-error-warning-line');
    }
  });

  const mapPickerBtn = document.getElementById('select-location-map-btn');
  const mapPickerContainer = document.getElementById('map-picker-container');
  const closeMapBtn = document.getElementById('close-map-picker-btn');

  mapPickerBtn?.addEventListener('click', () => {
    if (!mapPickerContainer) return;
    const isHidden = mapPickerContainer.style.display === 'none';
    mapPickerContainer.style.display = isHidden ? 'block' : 'none';

    if (isHidden) {
      initInteractiveLeafletMap();
    }
  });

  closeMapBtn?.addEventListener('click', () => {
    if (mapPickerContainer) mapPickerContainer.style.display = 'none';
  });

  const fileInput = document.getElementById('form-prop-file-input');
  const mainImgInput = document.getElementById('form-prop-img-main');

  fileInput?.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    files.forEach(file => {
      if (file.size > 10 * 1024 * 1024) {
        showToast(`File ${file.name} exceeds 10MB limit.`, 'ri-error-warning-line');
        return;
      }

      const reader = new FileReader();
      reader.onload = function(evt) {
        const rawDataUrl = evt.target.result;
        compressImage(rawDataUrl, 1000, 0.75).then(compressedUrl => {
          formImagesList.push(compressedUrl);
          if (mainImgInput && !mainImgInput.value) {
            mainImgInput.value = compressedUrl;
          }
          updateImagesPreviewGrid();
          showToast('Photo uploaded & optimized! Click Save to publish.', 'ri-checkbox-circle-fill');
        });
      };
      reader.readAsDataURL(file);
    });
  });

  const videoInput = document.getElementById('form-prop-video-file-input');
  videoInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const labelText = document.getElementById('video-file-label-text');
    if (labelText) labelText.textContent = `Video Uploaded (${file.name.slice(0, 15)}...)`;
    
    const reader = new FileReader();
    reader.onload = function(evt) {
      formVideoFileUrl = evt.target.result;
      showToast('Video file attached successfully!', 'ri-video-line');
    };
    reader.readAsDataURL(file);
  });

  document.getElementById('take-photo-btn')?.addEventListener('click', () => {
    fileInput?.click();
  });

  attachImageDeleteListeners();

  const form = document.getElementById('prop-admin-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('form-prop-title')?.value.trim();
    const type = document.getElementById('form-prop-type')?.value;
    const category = document.getElementById('form-prop-category')?.value;
    const location = document.getElementById('form-prop-location')?.value.trim();
    const address = document.getElementById('form-prop-address')?.value.trim();
    const size = document.getElementById('form-prop-size')?.value.trim();

    const isRes = ['Apartment', 'Villa', 'Townhouse', 'Penthouse', 'Studio', 'villas', 'houses', 'apartments'].includes(type);
    const bedrooms = isRes ? document.getElementById('form-prop-bedrooms')?.value : null;
    const bathrooms = isRes ? document.getElementById('form-prop-bathrooms')?.value : null;
    const furnishing = isRes ? document.getElementById('form-prop-furnishing')?.value : 'Not specified';

    const priceNum = document.getElementById('form-prop-price-num')?.value;
    const availability = document.getElementById('form-prop-availability')?.value;

    const ownerName = document.getElementById('form-prop-owner-company')?.value.trim();
    const listedBy = document.getElementById('form-prop-contact-name')?.value.trim();
    const ownerPhone = document.getElementById('form-prop-contact-phone')?.value.trim();

    const featuresStr = document.getElementById('form-prop-features')?.value.trim();
    const description = document.getElementById('form-prop-desc')?.value.trim();

    const videoUrl = document.getElementById('form-prop-videolink')?.value.trim() || formVideoFileUrl;
    const latitude = document.getElementById('form-prop-latitude')?.value.trim();
    const longitude = document.getElementById('form-prop-longitude')?.value.trim();
    const mainImg = document.getElementById('form-prop-img-main')?.value.trim();

    let finalImages = [...formImagesList];
    if (mainImg && !finalImages.includes(mainImg)) {
      finalImages.unshift(mainImg);
    }

    if (finalImages.length === 0) {
      finalImages.push('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80');
    }

    const featuresArray = featuresStr ? featuresStr.split(',').map(f => f.trim()).filter(Boolean) : [];

    const locStr = location || '';
    let parsedDistrict = 'Thanjavur';
    if (locStr.includes(',')) {
      const parts = locStr.split(',');
      parsedDistrict = parts[parts.length - 1].trim() || parts[0].trim();
    } else if (locStr.trim() !== '') {
      parsedDistrict = locStr.trim();
    }

    const formData = {
      title: title || 'Untitled Property',
      type: type || 'Villa',
      category: category || 'Sale',
      location: locStr || 'Thanjavur',
      district: parsedDistrict,
      address: address || '',
      size: size || '',
      bedrooms: bedrooms ? parseInt(bedrooms, 10) : null,
      bathrooms: bathrooms ? parseInt(bathrooms, 10) : null,
      furnishing: furnishing || 'Not specified',
      price: parseFloat(priceNum) || 0,
      availability: availability || 'Available',
      status: availability || 'Available',
      ownerName: ownerName || '',
      listedBy: listedBy || '',
      ownerPhone: ownerPhone || '',
      videoUrl: videoUrl || '',
      latitude: latitude || '',
      longitude: longitude || '',
      images: finalImages,
      description: description || '',
      features: featuresArray
    };

    // CRITICAL: Reset ALL state BEFORE calling store actions.
    // addProperty/updateProperty dispatch 'propertiesUpdated', which triggers dashboard.js
    // to call handleHashChange() → renderPropertiesView(). If currentViewMode is still 'form'
    // at that point, the view re-renders as the form (not the list), swallowing the new card.
    const wasEditing = editingPropertyId;
    editingPropertyId = null;
    activeSearch = '';
    activeTypeFilter = 'all';
    activeCategoryFilter = 'all';
    activeStatusFilter = 'all';
    activeMaxPriceFilter = 'all';
    currentViewMode = 'list';

    // NOW call the store action — propertiesUpdated fires with currentViewMode already 'list'
    if (wasEditing) {
      updateProperty(wasEditing, formData);
      showToast(`Property listing updated successfully!`, 'ri-checkbox-circle-fill');
    } else {
      const created = addProperty(formData);
      showToast(`New property ${created.id} published to website!`, 'ri-checkbox-circle-fill');
    }

    // Direct refresh as an additional guarantee
    refreshPropertiesView();
  });
}

function initInteractiveLeafletMap() {
  const mapElement = document.getElementById('leaflet-interactive-map');
  if (!mapElement) return;

  if (!window.L) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => setupLeafletMapInstance(mapElement);
    document.head.appendChild(script);
  } else {
    setupLeafletMapInstance(mapElement);
  }
}

function setupLeafletMapInstance(mapElement) {
  if (leafletMapInstance) {
    leafletMapInstance.remove();
    leafletMapInstance = null;
  }

  const latInput = document.getElementById('form-prop-latitude');
  const lngInput = document.getElementById('form-prop-longitude');

  const startLat = parseFloat(latInput?.value) || 10.786999;
  const startLng = parseFloat(lngInput?.value) || 79.137827;

  leafletMapInstance = window.L.map(mapElement).setView([startLat, startLng], 12);

  window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(leafletMapInstance);

  leafletMarkerInstance = window.L.marker([startLat, startLng], { draggable: true }).addTo(leafletMapInstance);

  function updateCoords(lat, lng) {
    if (latInput) latInput.value = lat.toFixed(6);
    if (lngInput) lngInput.value = lng.toFixed(6);
    showToast(`Location set to Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`, 'ri-map-pin-2-fill');
  }

  leafletMapInstance.on('click', (e) => {
    const { lat, lng } = e.latlng;
    leafletMarkerInstance.setLatLng([lat, lng]);
    updateCoords(lat, lng);
  });

  leafletMarkerInstance.on('dragend', (e) => {
    const { lat, lng } = e.target.getLatLng();
    updateCoords(lat, lng);
  });
}

function updateImagesPreviewGrid() {
  const container = document.getElementById('uploaded-images-preview-grid');
  if (container) {
    container.innerHTML = renderUploadedImagesGallery();
    attachImageDeleteListeners();
  }
}

function attachImageDeleteListeners() {
  document.querySelectorAll('.delete-uploaded-img-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const index = parseInt(btn.dataset.index, 10);
      if (!isNaN(index) && index >= 0 && index < formImagesList.length) {
        formImagesList.splice(index, 1);
        updateImagesPreviewGrid();
        showToast('Image removed from listing.', 'ri-delete-bin-line');
      }
    });
  });
}

function refreshPropertiesView() {
  const contentArea = document.getElementById('os-content');
  if (contentArea) {
    contentArea.innerHTML = renderPropertiesView();
    initPropertiesListeners();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// CSV Export Logic: Exports ONLY Currently Filtered / Displayed Properties
function exportFilteredPropertiesToCSV() {
  const all = getProperties();
  const props = filterPropertiesList(all);

  if (!props || props.length === 0) {
    showToast('No properties in current filter to export.', 'ri-error-warning-line');
    return;
  }

  const headers = ['ID', 'Title', 'Type', 'Category', 'Price', 'Location', 'District', 'Size', 'Bedrooms', 'Bathrooms', 'Availability', 'Latitude', 'Longitude'];
  const rows = props.map(p => [
    `"${p.id}"`,
    `"${(p.title || '').replace(/"/g, '""')}"`,
    `"${p.type || p.category || ''}"`,
    `"${p.categoryRaw || p.category || p.purpose || ''}"`,
    `"${p.price || 0}"`,
    `"${(p.location || '').replace(/"/g, '""')}"`,
    `"${(p.district || '').replace(/"/g, '""')}"`,
    `"${p.size || ''}"`,
    `"${p.bedrooms || ''}"`,
    `"${p.bathrooms || ''}"`,
    `"${p.availability || p.status || ''}"`,
    `"${p.latitude || ''}"`,
    `"${p.longitude || ''}"`
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `thanjai_properties_filtered_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();

  showToast(`Exported ${props.length} filtered properties to CSV!`, 'ri-file-download-line');
}

function showToast(msg, icon = 'ri-notification-line') {
  let toastContainer = document.getElementById('os-toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'os-toast-container';
    toastContainer.style.cssText = `
      position: fixed; bottom: 24px; right: 24px; z-index: 99999;
      display: flex; flex-direction: column; gap: 10px; pointer-events: none;
    `;
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.style.cssText = `
    background: #1a1a1a; color: #ffffff; padding: 12px 20px; border-radius: 10px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.25); font-size: 0.9rem; font-weight: 500;
    display: flex; align-items: center; gap: 10px; pointer-events: auto;
    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  `;
  toast.innerHTML = `<i class="${icon}" style="color: var(--color-orange, #eb5e28); font-size: 1.15rem;"></i> <span>${msg}</span>`;

  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function compressImage(dataUrl, maxDim = 1000, quality = 0.75) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let w = img.width;
      let h = img.height;
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}
