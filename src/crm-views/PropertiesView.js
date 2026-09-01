import { getProperties, addProperty, updateProperty, deleteProperty, resetPropertiesToDefault, formatPropertySize, parsePropertyVideos } from '../utils/propertiesStore.js';
import { addAuditLog } from '../utils/siteImagesStore.js';
import { showToast } from '../utils/toast.js';

let activeSearch = '';
let activeTypeFilter = 'all';
let activeCategoryFilter = 'all';
let activeStatusFilter = 'all';
let activeMaxPriceFilter = 'all';

let currentViewMode = 'list'; // 'list' or 'form'
let editingPropertyId = null; // null for add, string ID for edit
let previewPropertyId = null; // null or string ID for inline admin modal preview
let activeMediaIndex = 0; // State for active preview photo/video index

export function resetPropertiesViewMode() {
  currentViewMode = 'list';
  editingPropertyId = null;
  previewPropertyId = null;
  activeMediaIndex = 0;
}

export function setPropertiesSearchFilter(query) {
  activeSearch = query;
}

// State for active form image gallery & multiple video uploads/links
let formImagesList = [];
let formVideoLinksList = [''];
let formVideoFilesList = [];
let leafletMapInstance = null;
let leafletMarkerInstance = null;

function compressImageFile(file, maxWidth = 1000, maxHeight = 800, quality = 0.75) {
  return new Promise((resolve) => {
    if (!file || !file.type.startsWith('image/')) {
      resolve(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

export function renderPropertiesView() {
  try {
    const allProperties = getProperties() || [];

    if (currentViewMode === 'form') {
      const editingProp = editingPropertyId ? allProperties.find(p => p && p.id === editingPropertyId) : null;
      return renderFullPagePropertyForm(editingProp);
    }

    const filtered = filterPropertiesList(allProperties);

  return `
    <div class="view-enter properties-view-container" style="padding-bottom: 40px; position: relative;">
      
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

        <!-- Top Right Actions: Import CSV, Export CSV and + Add Property -->
        <div style="display: flex; align-items: center; gap: 12px;">
          <input type="file" id="import-props-csv-file" accept=".csv" style="display: none;" />

          <button class="os-btn-secondary" id="import-props-csv-btn" title="Import properties from CSV file" style="display: inline-flex; align-items: center; gap: 6px; padding: 10px 18px; font-size: 0.88rem; border-radius: 10px; border: 1px solid #cbd5e0; background: #ffffff; color: #4a5568; font-weight: 600; cursor: pointer;">
            <i class="ri-upload-cloud-line" style="font-size: 1.1rem; color: #3182ce;"></i>
            <span>Import CSV</span>
          </button>

          <button class="os-btn-secondary" id="export-props-csv-btn" title="Export currently listed properties to CSV" style="display: inline-flex; align-items: center; gap: 6px; padding: 10px 18px; font-size: 0.88rem; border-radius: 10px; border: 1px solid #cbd5e0; background: #ffffff; color: #4a5568; font-weight: 600; cursor: pointer;">
            <i class="ri-download-cloud-line" style="font-size: 1.1rem; color: var(--color-orange, #eb5e28);"></i>
            <span>Export CSV</span>
          </button>

          <button class="os-btn-secondary" id="download-sample-csv-btn" title="Download official sample CSV template" style="display: inline-flex; align-items: center; gap: 6px; padding: 10px 18px; font-size: 0.88rem; border-radius: 10px; border: 1px solid #cbd5e0; background: #ffffff; color: #4a5568; font-weight: 600; cursor: pointer;">
            <i class="ri-file-text-line" style="font-size: 1.1rem; color: #38a169;"></i>
            <span>Sample CSV</span>
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
          <option value="5000000" ${activeMaxPriceFilter === '5000000' ? 'selected' : ''}>₹ 50 Lakhs</option>
          <option value="15000000" ${activeMaxPriceFilter === '15000000' ? 'selected' : ''}>₹ 1.5 Crore</option>
          <option value="30000000" ${activeMaxPriceFilter === '30000000' ? 'selected' : ''}>₹ 3 Crore</option>
          <option value="50000000" ${activeMaxPriceFilter === '50000000' ? 'selected' : ''}>₹ 5 Crore+</option>
        </select>
      </div>

      <!-- Properties Grid -->
      ${filtered.length === 0 ? `
        <div style="
          background: #ffffff; border-radius: 16px; padding: 60px 20px; text-align: center; border: 1px solid #e2e8f0;
        ">
          <i class="ri-building-line" style="font-size: 3rem; color: #a0aec0; margin-bottom: 12px; display: block;"></i>
          <h3 style="font-size: 1.1rem; color: #2d3748; margin-bottom: 6px;">No Properties Match Your Filters</h3>
          <p style="font-size: 0.88rem; color: #718096; margin-bottom: 16px;">Try adjusting your search term, category, status, or price parameters.</p>
          <button class="os-btn-primary" id="empty-add-prop-btn" style="padding: 10px 20px; font-size: 0.88rem; border-radius: 8px; background: var(--color-orange, #eb5e28); color: #fff; border: none; font-weight: 700; cursor: pointer;">
            + Add New Property Listing
          </button>
        </div>
      ` : `
        <div style="
          display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px;
        ">
          ${filtered.map(p => renderPropertyCard(p)).join('')}
        </div>
      `}

    </div>
  `;
  } catch (err) {
    console.error("Error rendering properties view:", err);
    return `
      <div class="view-enter" style="padding: 40px; text-align: center;">
        <h2 style="color: var(--os-charcoal);">Properties Inventory</h2>
        <p style="color: #e53e3e;">Unable to load property inventory. Please refresh the page.</p>
      </div>
    `;
  }
}

function renderPropertyCard(prop) {
  if (!prop) return '';
  const status = prop.status || prop.availability || 'Available';
  const approvalStatus = prop.approvalStatus || (status === 'Pending Approval' ? 'Pending Approval' : 'Approved');
  const statusClass = status.toLowerCase();

  const statusBg = statusClass === 'available' ? '#e6fffa' 
                 : statusClass === 'sold' ? '#fed7d7' 
                 : statusClass === 'booked' ? '#feebc8' 
                 : statusClass === 'rented' ? '#ebf8ff' 
                 : '#fff5f5';

  const statusColor = statusClass === 'available' ? '#234e52' 
                    : statusClass === 'sold' ? '#9b2c2c' 
                    : statusClass === 'booked' ? '#7b341e' 
                    : statusClass === 'rented' ? '#2b6cb0' 
                    : '#742a2a';

  const mainImg = prop.images && prop.images[0] ? prop.images[0] : '/default-property.jpg';

  const specsArray = [];
  if (prop.bedrooms) specsArray.push(`${prop.bedrooms} bed`);
  if (prop.bathrooms) specsArray.push(`${prop.bathrooms} bath`);
  if (prop.size) specsArray.push(formatPropertySize(prop.size));
  if (prop.facing) specsArray.push(prop.facing);
  if (prop.approval) specsArray.push(prop.approval);

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
        
        <!-- Ad Type Interactive Select Dropdown Top Left -->
        <div style="position: absolute; top: 12px; left: 12px; z-index: 2;" title="Change Listing Plan">
          <select class="quick-adtype-select" data-id="${prop.id}" style="
            padding: 4px 8px; border-radius: 6px; font-size: 0.72rem; font-weight: 800;
            letter-spacing: 0.04em; text-transform: uppercase; cursor: pointer; outline: none;
            background: ${prop.adType === 'paid' ? '#EBF8FF' : '#FFF5EB'};
            color: ${prop.adType === 'paid' ? '#2B6CB0' : '#C05621'};
            border: 1px solid ${prop.adType === 'paid' ? '#BEE3F8' : '#FBD38D'};
            box-shadow: 0 2px 6px rgba(0,0,0,0.12);
          ">
            <option value="free" ${prop.adType !== 'paid' ? 'selected' : ''}>🛡️ FREE AD</option>
            <option value="paid" ${prop.adType === 'paid' ? 'selected' : ''}>👑 PAID AD</option>
          </select>
        </div>

        <!-- Status Badge Top Right -->
        <span style="
          position: absolute; top: 12px; right: 12px; padding: 4px 10px; border-radius: 6px;
          font-size: 0.72rem; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase;
          background: ${statusBg}; color: ${statusColor}; box-shadow: 0 2px 6px rgba(0,0,0,0.08);
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
        <p style="font-size: 0.82rem; color: #718096; margin: 0 0 6px 0;">
          ${prop.location || prop.district} • Property • ${prop.categoryRaw || prop.type || 'Sale'}
        </p>

        <!-- Owner Badge -->
        <div style="font-size: 0.8rem; font-weight: 700; color: #4A5568; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
          <i class="${prop.adType === 'paid' ? 'ri-user-star-fill' : 'ri-shield-user-fill'}" style="color: ${prop.adType === 'paid' ? '#3182CE' : '#eb5e28'};"></i>
          <span>${prop.adType === 'paid' ? 'Direct Owner' : 'Listing Desk'}: ${prop.adType === 'paid' ? (prop.ownerName || 'Verified Owner') : 'Thanjai Property'} ${prop.adType === 'paid' ? (prop.ownerPhone ? `(${prop.ownerPhone})` : '') : '(8489996852)'}</span>
        </div>

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
          display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap;
        ">
          <!-- Status Dropdown with "Update availability" Tooltip -->
          <div style="position: relative;" title="Update availability">
            <select class="quick-status-select" data-id="${prop.id}" style="
              padding: 6px 12px; font-size: 0.8rem; font-weight: 700; border-radius: 8px; border: 1px solid #cbd5e0;
              background: #ffffff; color: #2d3748; cursor: pointer; outline: none;
            ">
              <option value="Available" ${status === 'Available' ? 'selected' : ''}>Available</option>
              <option value="Pending Approval" ${status === 'Pending Approval' ? 'selected' : ''}>Pending Approval</option>
              <option value="Booked" ${status === 'Booked' ? 'selected' : ''}>Booked</option>
              <option value="Sold" ${status === 'Sold' ? 'selected' : ''}>Sold</option>
              <option value="Rented" ${status === 'Rented' ? 'selected' : ''}>Rented</option>
              <option value="Inactive" ${status === 'Inactive' ? 'selected' : ''}>Inactive</option>
            </select>
          </div>

          <!-- Icon & Approval Action Buttons -->
          <div style="display: flex; align-items: center; gap: 6px;">
            ${(approvalStatus === 'Pending Approval' || status === 'Pending Approval') ? `
              <button class="quick-approve-prop-btn" data-id="${prop.id}" title="Approve & Publish Live" style="
                padding: 6px 10px; border-radius: 8px; border: none; background: #38A169;
                color: #ffffff; font-weight: 700; font-size: 0.78rem; display: flex; align-items: center; gap: 4px; cursor: pointer;
              ">
                <i class="ri-checkbox-circle-fill"></i> Approve
              </button>
            ` : ''}

            <button class="view-website-prop-btn" data-id="${prop.id}" title="Preview property details" style="
              width: 32px; height: 32px; border-radius: 8px; border: 1px solid #e2e8f0; background: #ffffff;
              color: #718096; display: flex; align-items: center; justify-content: center; cursor: pointer;
            ">
              <i class="ri-eye-line"></i>
            </button>

            <button class="edit-prop-btn" data-id="${prop.id}" title="Edit property details" style="
              width: 32px; height: 32px; border-radius: 8px; border: 1px solid #ebf8ff; background: #ebf8ff;
              color: #3182ce; display: flex; align-items: center; justify-content: center; cursor: pointer;
            ">
              <i class="ri-pencil-line"></i>
            </button>

            <button class="delete-prop-btn" data-id="${prop.id}" title="Delete property listing" style="
              width: 32px; height: 32px; border-radius: 8px; border: 1px solid #fff5f5; background: #fff5f5;
              color: #e53e3e; display: flex; align-items: center; justify-content: center; cursor: pointer;
            ">
              <i class="ri-delete-bin-line"></i>
            </button>
          </div>
        </div>

      </div>
    </div>
  `;
}

function renderAdminPropertyPreviewModal(prop) {
  if (!prop) return '';

  const rawImgs = Array.isArray(prop.images) ? prop.images.filter(Boolean) : [];
  const uniqueImgs = [...new Set(rawImgs)];
  const images = uniqueImgs.length > 0 ? uniqueImgs : ['/default-property.jpg'];
  const status = prop.status || prop.availability || 'Available';

  const videoList = parsePropertyVideos(prop.videoUrl);
  videoList.forEach((vUrl, vIdx) => {
    let isEmbeddableVideo = false;
    let videoEmbedSrc = vUrl;

    if (vUrl.includes('youtube.com') || vUrl.includes('youtu.be')) {
      const videoIdMatch = vUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (videoIdMatch && videoIdMatch[1]) {
        videoEmbedSrc = `https://www.youtube.com/embed/${videoIdMatch[1]}?autoplay=0`;
        isEmbeddableVideo = true;
      }
    } else if (vUrl.includes('facebook.com') || vUrl.includes('fb.watch') || vUrl.includes('fb.com')) {
      videoEmbedSrc = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(vUrl)}&show_text=0&width=560&autoplay=0`;
      isEmbeddableVideo = true;
    }

    allMediaItems.push({
      type: 'video',
      url: videoEmbedSrc,
      rawUrl: vUrl,
      isEmbeddable: isEmbeddableVideo,
      title: videoList.length > 1 ? `Property Video Tour ${vIdx + 1}` : 'Property Video Tour',
      thumb: images[0]
    });
  });

  // Image items
  images.forEach((img, idx) => {
    allMediaItems.push({
      type: 'image',
      url: img,
      title: `Photo ${idx + 1}`,
      thumb: img
    });
  });

  const totalMedia = allMediaItems.length;
  if (activeMediaIndex >= totalMedia) activeMediaIndex = 0;

  const activeItem = allMediaItems[activeMediaIndex] || allMediaItems[0];

  let heroContentHtml = '';
  if (activeItem.type === 'video') {
    if (activeItem.isEmbeddable) {
      heroContentHtml = `<iframe src="${activeItem.url}" style="width: 100%; height: 100%; border: none;" allowfullscreen></iframe>`;
    } else {
      heroContentHtml = `<video src="${activeItem.rawUrl}" controls autoplay style="width: 100%; height: 100%; object-fit: contain; background: #000;"></video>`;
    }
  } else {
    heroContentHtml = `<img src="${activeItem.url}" alt="${prop.title}" style="width: 100%; height: 100%; object-fit: cover; transition: opacity 0.3s ease;" />`;
  }

  return `
    <div id="admin-prop-modal-overlay" style="
      position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important;
      width: 100vw !important; height: 100vh !important; z-index: 999999 !important;
      background: rgba(15, 23, 42, 0.82) !important; backdrop-filter: blur(8px) !important;
      display: flex !important; align-items: center !important; justify-content: center !important;
      padding: 24px !important; box-sizing: border-box !important; margin: 0 !important;
    ">
      <div style="
        background: #ffffff; width: 100%; max-width: 920px; max-height: 90vh; border-radius: 24px;
        overflow: hidden; box-shadow: 0 25px 60px rgba(0,0,0,0.5); border: 1px solid #e2e8f0; display: flex; flex-direction: column;
      ">
        
        <!-- Modal Fixed Top Bar -->
        <div style="padding: 18px 28px; background: #faf8f5; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;">
          <div>
            <span style="font-size: 0.75rem; font-weight: 800; color: #eb5e28; letter-spacing: 0.08em; text-transform: uppercase;">
              ADMIN PROPERTY PREVIEW • ID: ${prop.id}
            </span>
            <h3 style="font-size: 1.3rem; font-weight: 800; color: #1a202c; margin: 2px 0 0 0;">${prop.title}</h3>
          </div>

          <button id="close-admin-prop-preview-btn" style="background: #ffffff; border: 1px solid #cbd5e0; color: #4a5568; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; cursor: pointer; transition: transform 0.2s ease;">
            <i class="ri-close-line"></i>
          </button>
        </div>

        <!-- Scrollable Modal Body -->
        <div style="padding: 24px 28px; overflow-y: auto; display: flex; flex-direction: column; gap: 24px; flex: 1;">
          
          <!-- LUXURY HERO MEDIA VIEWPORT WITH OVERLAY ARROWS & CAROUSEL (REFERENCE IMAGE 2) -->
          <div style="width: 100%;">
            
            <!-- Main Hero Viewport (380px) -->
            <div style="width: 100%; height: 380px; border-radius: 16px; overflow: hidden; background: #f0f4f8; position: relative; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
              ${heroContentHtml}

              <!-- Overlay Top Media Counter Badge -->
              <div style="position: absolute; top: 16px; left: 16px; background: rgba(0,0,0,0.75); color: #ffffff; font-size: 0.8rem; font-weight: 700; padding: 6px 14px; border-radius: 20px; backdrop-filter: blur(4px); display: flex; align-items: center; gap: 6px; z-index: 10;">
                <i class="${activeItem.type === 'video' ? 'ri-video-line' : 'ri-image-line'}" style="color: #eb5e28;"></i>
                <span>${activeItem.type === 'video' ? 'Video Tour' : `Photo ${activeMediaIndex + (prop.videoUrl ? 0 : 1)} of ${totalMedia - (prop.videoUrl ? 1 : 0)}`}</span>
              </div>

              <!-- Overlay Status Badge Top Right -->
              <span style="position: absolute; top: 16px; right: 16px; background: #eb5e28; color: #fff; font-size: 0.78rem; font-weight: 800; padding: 6px 14px; border-radius: 20px; z-index: 10; box-shadow: 0 4px 12px rgba(0,0,0,0.25);">
                ${status.toUpperCase()}
              </span>

              <!-- Left & Right Carousel Arrow Overlay Buttons (Screen 2 Style) -->
              ${totalMedia > 1 ? `
                <button id="prev-preview-media-btn" title="Previous photo/video" style="
                  position: absolute; left: 16px; top: 50%; transform: translateY(-50%); width: 44px; height: 44px; border-radius: 50%;
                  background: rgba(0,0,0,0.65); color: #ffffff; border: 1px solid rgba(255,255,255,0.3); font-size: 1.4rem;
                  display: flex; align-items: center; justify-content: center; cursor: pointer; backdrop-filter: blur(6px);
                  box-shadow: 0 4px 14px rgba(0,0,0,0.4); z-index: 10; transition: background 0.2s ease, transform 0.2s ease;
                ">
                  <i class="ri-arrow-left-s-line"></i>
                </button>

                <button id="next-preview-media-btn" title="Next photo/video" style="
                  position: absolute; right: 16px; top: 50%; transform: translateY(-50%); width: 44px; height: 44px; border-radius: 50%;
                  background: rgba(0,0,0,0.65); color: #ffffff; border: 1px solid rgba(255,255,255,0.3); font-size: 1.4rem;
                  display: flex; align-items: center; justify-content: center; cursor: pointer; backdrop-filter: blur(6px);
                  box-shadow: 0 4px 14px rgba(0,0,0,0.4); z-index: 10; transition: background 0.2s ease, transform 0.2s ease;
                ">
                  <i class="ri-arrow-right-s-line"></i>
                </button>
              ` : ''}
            </div>

            <!-- INTERACTIVE HORIZONTAL CAROUSEL THUMBNAIL BAR (REFERENCE IMAGE 2) -->
            ${totalMedia > 1 ? `
              <div style="
                display: flex; gap: 12px; overflow-x: auto; padding: 14px 4px 6px 4px; scroll-behavior: smooth;
                margin-top: 12px; scrollbar-width: thin; scrollbar-color: #eb5e28 #edf2f7;
              ">
                ${allMediaItems.map((item, idx) => {
                  const isActive = idx === activeMediaIndex;
                  return `
                    <div class="preview-thumb-card" data-index="${idx}" style="
                      position: relative; flex-shrink: 0; width: 110px; height: 74px; border-radius: 10px; overflow: hidden;
                      cursor: pointer; transition: all 0.25s ease; border: ${isActive ? '3px solid #eb5e28' : '2px solid #e2e8f0'};
                      box-shadow: ${isActive ? '0 4px 14px rgba(235,94,40,0.35)' : '0 2px 6px rgba(0,0,0,0.06)'};
                      opacity: ${isActive ? '1' : '0.75'}; transform: ${isActive ? 'scale(1.02)' : 'scale(1)'};
                    ">
                      <img src="${item.thumb}" style="width: 100%; height: 100%; object-fit: cover;" />
                      ${item.type === 'video' ? `
                        <div style="position: absolute; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.5rem;">
                          <i class="ri-play-circle-fill" style="color: #eb5e28;"></i>
                        </div>
                      ` : ''}
                      <div style="position: absolute; bottom: 4px; left: 4px; font-size: 0.65rem; background: rgba(0,0,0,0.7); color: #fff; padding: 1px 6px; border-radius: 4px; font-weight: 700;">
                        ${item.type === 'video' ? 'Video' : `Photo ${idx + (prop.videoUrl ? 0 : 1)}`}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            ` : ''}

          </div>

          <!-- Key Specs Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; background: #faf8f5; padding: 20px; border-radius: 14px; border: 1px solid #e2e8f0;">
            <div>
              <span style="font-size: 0.75rem; font-weight: 800; color: #718096; display: block;">EXPECTED PRICE</span>
              <div style="font-size: 1.3rem; font-weight: 800; color: #eb5e28;">${prop.priceFormatted || '₹ ' + (prop.price || 0).toLocaleString('en-IN')}</div>
            </div>
            <div>
              <span style="font-size: 0.75rem; font-weight: 800; color: #718096; display: block;">TYPE & CATEGORY</span>
              <div style="font-size: 0.95rem; font-weight: 700; color: #1a202c;">${prop.type || 'Property'} • ${prop.categoryRaw || 'Sale'}</div>
            </div>
            <div>
              <span style="font-size: 0.75rem; font-weight: 800; color: #718096; display: block;">LOCATION / DISTRICT</span>
              <div style="font-size: 0.95rem; font-weight: 700; color: #1a202c;">${prop.location || prop.district}</div>
            </div>
            <div>
              <span style="font-size: 0.75rem; font-weight: 800; color: #718096; display: block;">AREA SIZE</span>
              <div style="font-size: 0.95rem; font-weight: 700; color: #1a202c;">${prop.size || 'N/A'}</div>
            </div>
            ${prop.bedrooms ? `
              <div>
                <span style="font-size: 0.75rem; font-weight: 800; color: #718096; display: block;">BEDROOMS / BATHROOMS</span>
                <div style="font-size: 0.95rem; font-weight: 700; color: #1a202c;">${prop.bedrooms} Bed • ${prop.bathrooms || 0} Bath</div>
              </div>
            ` : ''}
            ${prop.floor ? `
              <div>
                <span style="font-size: 0.75rem; font-weight: 800; color: #718096; display: block;">FLOOR NUMBER</span>
                <div style="font-size: 0.95rem; font-weight: 700; color: #1a202c;">${prop.floor}</div>
              </div>
            ` : ''}
            <div>
              <span style="font-size: 0.75rem; font-weight: 800; color: #718096; display: block;">FURNISHING STATUS</span>
              <div style="font-size: 0.95rem; font-weight: 700; color: #1a202c;">${prop.furnishing || 'Not specified'}</div>
            </div>
          </div>

          <!-- Owner Information Box -->
          <div style="background: #FFF; border: 1px solid #E2E8F0; padding: 20px; border-radius: 14px;">
            <h4 style="font-size: 0.85rem; font-weight: 800; color: #4A5568; text-transform: uppercase; margin-bottom: 12px;">OWNER & CONTACT DETAILS</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; font-size: 0.9rem;">
              <div><strong>Owner Name:</strong> ${prop.ownerName || 'Thanjai Property Owner'}</div>
              <div><strong>Contact Phone:</strong> ${prop.ownerPhone || '+91 95857 77772'}</div>
              <div><strong>Listed By:</strong> ${prop.listedBy || 'Aishwarya Raman'}</div>
              <div><strong>Patta Verification:</strong> <span style="color: #38A169; font-weight: 700;">Verified Legal Title</span></div>
            </div>
          </div>

          <!-- Detailed Description & Features -->
          <div>
            <h4 style="font-size: 0.85rem; font-weight: 800; color: #4A5568; text-transform: uppercase; margin-bottom: 8px;">PROPERTY DESCRIPTION</h4>
            <p style="font-size: 0.92rem; color: #4A5568; line-height: 1.6;">${prop.description || `${prop.title} located at ${prop.location}.`}</p>
          </div>

          <!-- Features List -->
          <div>
            <h4 style="font-size: 0.85rem; font-weight: 800; color: #4A5568; text-transform: uppercase; margin-bottom: 10px;">AMENITIES & HIGHLIGHTS</h4>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              ${(prop.features || ['Patta Title Verified', '24/7 Security']).map(f => `
                <span style="background: #EDF2F7; color: #2D3748; font-size: 0.82rem; font-weight: 700; padding: 6px 12px; border-radius: 20px; display: inline-flex; align-items: center; gap: 4px;">
                  <i class="ri-checkbox-circle-fill" style="color: #eb5e28;"></i> ${f}
                </span>
              `).join('')}
            </div>
          </div>

        </div>

        <!-- Modal Fixed Bottom Action Bar -->
        <div style="padding: 18px 28px; background: #faf8f5; border-top: 1px solid #e2e8f0; display: flex; justify-content: flex-end; gap: 12px; flex-shrink: 0; flex-wrap: wrap;">
          <button id="modal-share-wa-btn" data-id="${prop.id}" style="background: #25D366; color: #fff; border: none; padding: 10px 24px; border-radius: 10px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.2);">
            <i class="ri-whatsapp-line"></i> Share via WhatsApp
          </button>
          <button id="modal-edit-prop-btn" data-id="${prop.id}" style="background: #3182CE; color: #fff; border: none; padding: 10px 24px; border-radius: 10px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
            <i class="ri-pencil-line"></i> Edit Property Details
          </button>
          <button id="modal-close-prop-btn" style="background: #ffffff; border: 1px solid #cbd5e0; color: #4a5568; padding: 10px 24px; border-radius: 10px; font-weight: 700; cursor: pointer;">
            Close Preview
          </button>
        </div>

        </div>

        <!-- WhatsApp Share Lead Selector Overlay (Hidden by default) -->
        <div id="wa-share-lead-overlay" style="display: none; position: absolute; inset: 0; background: rgba(255,255,255,0.95); z-index: 100; flex-direction: column; align-items: center; justify-content: center; padding: 32px; text-align: center; backdrop-filter: blur(4px); border-radius: 20px;">
          <div style="background: #fff; padding: 24px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); width: 100%; max-width: 400px; border: 1px solid #e2e8f0;">
            <i class="ri-whatsapp-line" style="font-size: 2.5rem; color: #25D366; margin-bottom: 12px; display: block;"></i>
            <h3 style="margin: 0 0 8px 0; font-size: 1.2rem; color: #1a202c;">Share via CRM</h3>
            <p style="margin: 0 0 20px 0; font-size: 0.9rem; color: #4a5568;">Select a lead to send this property directly via WhatsApp.</p>
            
            <select id="wa-share-lead-select" style="width: 100%; padding: 12px; border: 1px solid #cbd5e0; border-radius: 8px; margin-bottom: 16px; font-size: 0.95rem; outline: none;"></select>
            
            <div style="display: flex; gap: 12px;">
              <button id="wa-share-cancel-btn" style="flex: 1; padding: 10px; background: #edf2f7; color: #4a5568; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Cancel</button>
              <button id="wa-share-confirm-btn" style="flex: 1; padding: 10px; background: #25D366; color: #fff; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
                <i class="ri-send-plane-fill"></i> Send
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
}

// FULL-PAGE INLINE ADD/EDIT PROPERTY FORM
function renderFullPagePropertyForm(prop) {
  const isEdit = Boolean(prop);
  
  if (isEdit && prop?.images) {
    formImagesList = [...prop.images];
  } else if (!isEdit) {
    formImagesList = [];
  }

  const currentType = prop?.type || '';
  const val = currentType.toLowerCase();
  const resKeywords = ['house', 'villa', 'apartment', 'home', 'flat', 'duplex', 'townhouse', 'penthouse', 'building', 'room'];
  const isResidential = resKeywords.some(k => val.includes(k)) || currentType === 'Villa';

  return `
    <div class="view-enter full-page-property-form-container" style="padding-bottom: 60px;">
      
      <!-- Form Navigation Header Bar -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
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
                <input type="text" id="form-prop-title" required value="${isEdit ? prop?.title || '' : ''}" placeholder="e.g. Premium Villa in Anna Nagar" style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #cbd5e0; box-sizing: border-box;" />
              </div>

              <!-- Type Text Input -->
              <div>
                <label style="font-size: 0.82rem; font-weight: 700; color: #4a5568; display: block; margin-bottom: 6px;">Type (Text Input) *</label>
                <input type="text" id="form-prop-type" required value="${isEdit ? prop?.type || '' : ''}" placeholder="e.g. Villa, House, Apartment, Land, Plot..." style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #cbd5e0; box-sizing: border-box;" />
              </div>

              <!-- Category Dropdown -->
              <div>
                <label style="font-size: 0.82rem; font-weight: 700; color: #4a5568; display: block; margin-bottom: 6px;">Category *</label>
                <select id="form-prop-category" required style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #cbd5e0; background: #fff; box-sizing: border-box;">
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
                <input type="text" id="form-prop-location" required value="${isEdit ? prop?.location || '' : ''}" placeholder="e.g. Anna Nagar, Chennai" style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #cbd5e0; box-sizing: border-box;" />
              </div>

              <!-- Facing -->
              <div>
                <label style="font-size: 0.82rem; font-weight: 700; color: #4a5568; display: block; margin-bottom: 6px;">Facing</label>
                <input type="text" id="form-prop-facing" value="${isEdit ? prop?.facing || prop?.address || '' : ''}" placeholder="e.g. North, East, South-East, North-Facing" style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #cbd5e0; box-sizing: border-box;" />
              </div>

              <!-- Area (sqft) -->
              <div>
                <label style="font-size: 0.82rem; font-weight: 700; color: #4a5568; display: block; margin-bottom: 6px;">Area (sqft)</label>
                <input type="text" id="form-prop-size" value="${isEdit ? prop?.size || '' : ''}" placeholder="e.g. 2400 or 2,400 sqft or 6.5 Acres" style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #cbd5e0; box-sizing: border-box;" />
              </div>

              <!-- Approval Status (Optional) -->
              <div>
                <label style="font-size: 0.82rem; font-weight: 700; color: #4a5568; display: block; margin-bottom: 6px;">Approval Status (Optional)</label>
                <input type="text" id="form-prop-approval" value="${isEdit ? prop?.approval || '' : ''}" placeholder="e.g. DTCP Approved, RERA Approved (Optional)" style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #cbd5e0; box-sizing: border-box;" />
              </div>
            </div>

            <!-- DYNAMIC RESIDENTIAL STRUCTURE FIELDS -->
            <div id="residential-specs-section" style="
              margin-top: 20px; display: ${isResidential ? 'grid' : 'none'}; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;
              background: #fdfbf7; padding: 20px; border-radius: 14px; border: 1px dashed #cbd5e0;
            ">
              <div>
                <label style="font-size: 0.82rem; font-weight: 700; color: #4a5568; display: block; margin-bottom: 6px;">Bedrooms</label>
                <input type="number" id="form-prop-bedrooms" value="${isEdit ? prop?.bedrooms || '' : ''}" placeholder="e.g. 4" style="width: 100%; padding: 10px 14px; font-size: 0.9rem; border-radius: 8px; border: 1px solid #cbd5e0; box-sizing: border-box;" />
              </div>

              <div>
                <label style="font-size: 0.82rem; font-weight: 700; color: #4a5568; display: block; margin-bottom: 6px;">Bathrooms</label>
                <input type="number" id="form-prop-bathrooms" value="${isEdit ? prop?.bathrooms || '' : ''}" placeholder="e.g. 4" style="width: 100%; padding: 10px 14px; font-size: 0.9rem; border-radius: 8px; border: 1px solid #cbd5e0; box-sizing: border-box;" />
              </div>

              <div>
                <label style="font-size: 0.82rem; font-weight: 700; color: #4a5568; display: block; margin-bottom: 6px;">Floor Number (Optional)</label>
                <input type="text" id="form-prop-floor" value="${isEdit ? prop?.floor || '' : ''}" placeholder="e.g. 2nd Floor (Optional)" style="width: 100%; padding: 10px 14px; font-size: 0.9rem; border-radius: 8px; border: 1px solid #cbd5e0; box-sizing: border-box;" />
              </div>

              <div>
                <label style="font-size: 0.82rem; font-weight: 700; color: #4a5568; display: block; margin-bottom: 6px;">Furnishing</label>
                <select id="form-prop-furnishing" style="width: 100%; padding: 10px 14px; font-size: 0.9rem; border-radius: 8px; border: 1px solid #cbd5e0; background: #fff; box-sizing: border-box;">
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
                <input type="number" id="form-prop-price-num" required value="${isEdit ? prop?.price || '' : ''}" placeholder="e.g. 13500000" style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #cbd5e0; box-sizing: border-box;" />
              </div>

              <div>
                <label style="font-size: 0.82rem; font-weight: 700; color: #4a5568; display: block; margin-bottom: 6px;">Currency</label>
                <select id="form-prop-currency" style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #cbd5e0; background: #fff; box-sizing: border-box;">
                  <option value="INR" selected>INR</option>
                  <option value="USD">USD</option>
                </select>
              </div>

              <div>
                <label style="font-size: 0.82rem; font-weight: 700; color: #4a5568; display: block; margin-bottom: 6px;">Availability *</label>
                <select id="form-prop-availability" required style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #cbd5e0; background: #fff; box-sizing: border-box;">
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
                <label style="font-size: 0.82rem; font-weight: 700; color: #4a5568; display: block; margin-bottom: 6px;">Listing Plan (Ad Type)</label>
                <select id="form-prop-ad-type" style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #cbd5e0; box-sizing: border-box; background: #fff;">
                  <option value="free" ${isEdit && prop?.adType === 'paid' ? '' : 'selected'}>🛡️ Free Ad (Thanjai Property Desk +91 84899 96852)</option>
                  <option value="paid" ${isEdit && prop?.adType === 'paid' ? 'selected' : ''}>👑 Paid Ad (Direct Owner Contact & Call Enabled)</option>
                </select>
              </div>

              <div>
                <label style="font-size: 0.82rem; font-weight: 700; color: #4a5568; display: block; margin-bottom: 6px;">Owner / Company Name</label>
                <input type="text" id="form-prop-owner-company" value="${isEdit ? prop?.ownerName || '' : ''}" placeholder="e.g. Arun / Thanjai Property" style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #cbd5e0; box-sizing: border-box;" />
              </div>

              <div>
                <label style="font-size: 0.82rem; font-weight: 700; color: #4a5568; display: block; margin-bottom: 6px;">Contact / Listed By</label>
                <input type="text" id="form-prop-contact-name" value="${isEdit ? prop?.listedBy || '' : ''}" placeholder="e.g. Aishwarya Raman" style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #cbd5e0; box-sizing: border-box;" />
              </div>

              <div>
                <label style="font-size: 0.82rem; font-weight: 700; color: #4a5568; display: block; margin-bottom: 6px;">Owner Direct Phone</label>
                <input type="tel" id="form-prop-contact-phone" value="${isEdit ? prop?.ownerPhone || '' : ''}" placeholder="10-digit number" maxlength="10" pattern="[0-9]{10}" oninput="this.value = this.value.replace(/[^0-9]/g, '')" style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #cbd5e0; box-sizing: border-box;" />
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
                <input type="text" id="form-prop-features" value="${isEdit && prop?.features ? prop.features.join(', ') : ''}" placeholder="e.g. Pool, Gym, Parking, Clear Patta Title" style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #cbd5e0; box-sizing: border-box;" />
              </div>

              <div>
                <label style="font-size: 0.82rem; font-weight: 700; color: #4a5568; display: block; margin-bottom: 6px;">Description</label>
                <textarea id="form-prop-desc" rows="4" style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #cbd5e0; box-sizing: border-box;" placeholder="Enter detailed property description...">${isEdit ? prop?.description || '' : ''}</textarea>
              </div>
            </div>
          </div>

          <!-- SECTION 5: MEDIA & LOCATION -->
          <div style="border-top: 1px solid #e2e8f0; padding-top: 24px;">
            <h4 style="font-size: 0.85rem; font-weight: 800; text-transform: uppercase; color: #4a5568; letter-spacing: 0.08em; margin-bottom: 18px;">
              MEDIA & LOCATION
            </h4>

            <div style="display: flex; flex-direction: column; gap: 20px;">
              
              <!-- Multiple Video Links Section -->
              <div style="background: #faf8f5; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
                  <div>
                    <label style="font-size: 0.85rem; font-weight: 800; color: #2d3748; display: block;">YouTube & Facebook Video Links</label>
                    <span style="font-size: 0.78rem; color: #718096;">Add one or multiple video links (YouTube, Facebook Video, Vimeo, etc.)</span>
                  </div>
                  <button type="button" id="add-video-link-row-btn" style="
                    display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 8px;
                    background: #eb5e28; color: #ffffff; border: none; font-size: 0.82rem; font-weight: 700; cursor: pointer;
                  ">
                    <i class="ri-add-line"></i> Add Another Video Link
                  </button>
                </div>

                <div id="video-links-container" style="display: flex; flex-direction: column; gap: 10px;">
                  ${formVideoLinksList.map((vLink, idx) => `
                    <div class="video-link-row" style="display: flex; gap: 8px; align-items: center;">
                      <input type="url" class="form-prop-videolink-input" value="${vLink || ''}" placeholder="e.g. https://youtube.com/watch?v=... or https://facebook.com/.../videos/..." style="flex: 1; padding: 10px 14px; font-size: 0.9rem; border-radius: 8px; border: 1px solid #cbd5e0; background: #fff; box-sizing: border-box;" />
                      ${formVideoLinksList.length > 1 ? `
                        <button type="button" class="remove-video-link-row-btn" data-index="${idx}" style="background: #fed7d7; color: #c53030; border: none; border-radius: 8px; padding: 10px 12px; cursor: pointer; font-size: 0.9rem;" title="Remove this video link">
                          <i class="ri-delete-bin-line"></i>
                        </button>
                      ` : ''}
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- Upload Video Files Section -->
              <div style="background: #faf8f5; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
                  <div>
                    <label style="font-size: 0.85rem; font-weight: 800; color: #2d3748; display: block;">Upload Video Files (.mp4 / .mov)</label>
                    <span style="font-size: 0.78rem; color: #718096;">Upload one or multiple property tour video files</span>
                  </div>
                  <label style="
                    display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 8px;
                    background: #ffffff; border: 1px dashed #cbd5e0; color: #2d3748; font-weight: 700; font-size: 0.82rem; cursor: pointer;
                  ">
                    <i class="ri-video-upload-line" style="color: #eb5e28; font-size: 1.1rem;"></i>
                    <span>Browse Video Files</span>
                    <input type="file" id="form-prop-video-file-input" accept="video/*" multiple style="display: none;" />
                  </label>
                </div>
                
                <div id="video-files-preview-container" style="display: flex; flex-wrap: wrap; gap: 8px;">
                  ${formVideoFilesList.map((vf, idx) => `
                    <span style="display: inline-flex; align-items: center; gap: 6px; background: #EDF2F7; border: 1px solid #CBD5E0; padding: 6px 12px; border-radius: 20px; font-size: 0.82rem; font-weight: 700; color: #2D3748;">
                      <i class="ri-movie-fill" style="color: #eb5e28;"></i>
                      <span>${vf.name || `Video ${idx + 1}`}</span>
                      <button type="button" class="delete-uploaded-video-file-btn" data-index="${idx}" style="background: none; border: none; color: #E53E3E; cursor: pointer; padding: 0; margin-left: 4px;" title="Remove video">
                        <i class="ri-close-circle-fill"></i>
                      </button>
                    </span>
                  `).join('')}
                </div>
              </div>

              <!-- Coordinates Grid -->
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 18px;">
                <div>
                  <label style="font-size: 0.82rem; font-weight: 700; color: #4a5568; display: block; margin-bottom: 6px;">Latitude</label>
                  <input type="text" id="form-prop-latitude" value="${isEdit ? prop?.latitude || '' : ''}" placeholder="e.g. 10.786999" style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #cbd5e0; box-sizing: border-box;" />
                </div>

                <div>
                  <label style="font-size: 0.82rem; font-weight: 700; color: #4a5568; display: block; margin-bottom: 6px;">Longitude</label>
                  <input type="text" id="form-prop-longitude" value="${isEdit ? prop?.longitude || '' : ''}" placeholder="e.g. 79.137827" style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #cbd5e0; box-sizing: border-box;" />
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

              <!-- Interactive Leaflet Map Widget Container -->
              <div id="map-picker-container" style="display: none; border-radius: 14px; overflow: hidden; border: 1px solid #cbd5e0; background: #fff; margin-top: 10px;">
                <div style="padding: 12px 18px; background: #faf8f5; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 0.85rem; font-weight: 700; color: #2d3748; display: flex; align-items: center; gap: 6px;">
                    <i class="ri-map-2-line" style="color: var(--color-orange, #eb5e28);"></i>
                    Click or drag marker pin to capture exact property location
                  </span>
                  <button type="button" id="close-map-picker-btn" style="background: none; border: none; font-size: 1rem; color: #a0aec0; cursor: pointer;">
                    <i class="ri-close-line"></i>
                  </button>
                </div>
                <div id="leaflet-interactive-map" style="width: 100%; height: 320px; z-index: 1;"></div>
              </div>

              <!-- Image URL & Gallery Uploader -->
              <div style="border-top: 1px solid #f0f4f8; padding-top: 18px; display: flex; flex-direction: column; gap: 14px;">
                <div>
                  <label style="font-size: 0.82rem; font-weight: 700; color: #4a5568; display: block; margin-bottom: 6px;">Primary Image URL</label>
                  <input type="url" id="form-prop-img-main" value="${isEdit && prop?.images && prop.images[0] ? prop.images[0] : ''}" placeholder="https://images.unsplash.com/photo-..." style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #cbd5e0; box-sizing: border-box;" />
                </div>

                <div>
                  <label style="font-size: 0.82rem; font-weight: 700; color: #4a5568; display: block; margin-bottom: 6px;">Upload Gallery Photos</label>
                  <label style="
                    display: flex; align-items: center; justify-content: center; gap: 10px; padding: 16px; border-radius: 12px;
                    background: #FAF8F5; border: 2px dashed #cbd5e0; color: #4a5568; font-weight: 700; font-size: 0.9rem; cursor: pointer;
                  ">
                    <i class="ri-image-add-line" style="color: var(--color-orange, #eb5e28); font-size: 1.4rem;"></i>
                    <span>Click to Upload Property Images (.png / .jpg)</span>
                    <input type="file" id="form-prop-gallery-file-input" accept="image/*" multiple style="display: none;" />
                  </label>
                </div>

                <!-- Preview Grid for Uploaded Gallery Images -->
                <div id="uploaded-images-preview-grid" style="display: flex; gap: 14px; flex-wrap: wrap; margin-top: 8px;">
                  ${renderUploadedImagesGallery()}
                </div>
              </div>

            </div>
          </div>

          <!-- SUBMIT BUTTON BAR -->
          <div style="border-top: 1px solid #e2e8f0; padding-top: 24px; display: flex; justify-content: flex-end; gap: 14px;">
            <button type="button" id="cancel-prop-form-btn" style="
              padding: 12px 24px; border-radius: 10px; background: #ffffff; border: 1px solid #cbd5e0;
              color: #4a5568; font-weight: 700; font-size: 0.92rem; cursor: pointer;
            ">
              Cancel
            </button>

            <button type="submit" id="save-prop-form-btn" style="
              padding: 12px 32px; border-radius: 10px; background: var(--color-orange, #eb5e28); border: none;
              color: #ffffff; font-weight: 700; font-size: 0.92rem; cursor: pointer; box-shadow: 0 4px 14px rgba(235,94,40,0.3);
            ">
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
  if (!Array.isArray(list)) return [];
  return list.filter(prop => {
    if (!prop) return false;

    const q = activeSearch ? activeSearch.toLowerCase().trim() : '';
    const cleanQ = q.replace(/[^a-z0-9]/gi, '');
    const propId = String(prop.id || '').toLowerCase();
    const cleanId = propId.replace(/[^a-z0-9]/gi, '');
    const isDirectIdSearch = q.length > 0 && (propId.includes(q) || (cleanQ.length > 0 && cleanId.includes(cleanQ)));

    // Exclude unapproved pending submissions unless explicitly searching by ID
    if (!isDirectIdSearch && (prop.approvalStatus === 'Pending Approval' || prop.status === 'Pending Approval')) {
      return false;
    }

    // 1. Keyword search
    if (activeSearch) {
      const matchTitle = (prop.title || '').toLowerCase().includes(q);
      const matchLoc = (prop.location || '').toLowerCase().includes(q);
      const matchDist = (prop.district || '').toLowerCase().includes(q);
      const matchAddress = (prop.address || '').toLowerCase().includes(q);
      const matchType = (prop.type || '').toLowerCase().includes(q);
      const matchOwner = (prop.ownerName || '').toLowerCase().includes(q) || (prop.ownerPhone || '').includes(q);
      const matchStatus = (prop.status || prop.availability || '').toLowerCase().includes(q);

      if (!isDirectIdSearch && !matchTitle && !matchLoc && !matchDist && !matchAddress && !matchType && !matchOwner && !matchStatus) {
        return false;
      }
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
        isTypeMatch = pType.includes(targetType);
      }
      if (!isTypeMatch) return false;
    }

    // 3. Category Filter
    if (activeCategoryFilter && activeCategoryFilter !== 'all') {
      const pCatRaw = (prop.categoryRaw || prop.category || '').toLowerCase();
      const pPurpose = (prop.purpose || '').toLowerCase();
      const targetCat = activeCategoryFilter.toLowerCase();

      if (targetCat === 'sale' && pCatRaw !== 'sale' && pPurpose !== 'buy') return false;
      if (targetCat === 'rent' && pCatRaw !== 'rent' && pPurpose !== 'rent') return false;
      if (targetCat === 'lease' && pCatRaw !== 'lease') return false;
      if (targetCat === 'commercial' && pCatRaw !== 'commercial') return false;
      if (targetCat === 'residential' && pCatRaw !== 'residential') return false;
    }

    // 4. Status Filter
    if (activeStatusFilter && activeStatusFilter !== 'all') {
      const currentStatus = (prop.status || prop.availability || 'Available').toLowerCase();
      if (currentStatus !== activeStatusFilter.toLowerCase()) return false;
    }

    // 5. Max Price Filter
    if (activeMaxPriceFilter && activeMaxPriceFilter !== 'all') {
      const maxP = parseFloat(activeMaxPriceFilter);
      const propP = prop.price || 0;
      if (propP > maxP) return false;
    }

    return true;
  });
}

function bindModalPreviewListeners() {
  const closePreviewBtn = document.getElementById('close-admin-prop-preview-btn');
  const modalCloseBtn = document.getElementById('modal-close-prop-btn');
  const modalEditBtn = document.getElementById('modal-edit-prop-btn');
  const modalShareWaBtn = document.getElementById('modal-share-wa-btn');
  const waShareOverlay = document.getElementById('wa-share-lead-overlay');
  const waShareCancelBtn = document.getElementById('wa-share-cancel-btn');
  const waShareConfirmBtn = document.getElementById('wa-share-confirm-btn');
  const waShareSelect = document.getElementById('wa-share-lead-select');
  const prevMediaBtn = document.getElementById('prev-preview-media-btn');
  const nextMediaBtn = document.getElementById('next-preview-media-btn');

  const handleClosePreview = () => {
    previewPropertyId = null;
    activeMediaIndex = 0;
    document.getElementById('admin-prop-modal-overlay')?.remove();
    refreshPropertiesView();
  };

  closePreviewBtn?.addEventListener('click', handleClosePreview);
  modalCloseBtn?.addEventListener('click', handleClosePreview);

  modalShareWaBtn?.addEventListener('click', () => {
    const leads = JSON.parse(localStorage.getItem('thanjai_leads')) || [];
    waShareSelect.innerHTML = leads.map(l => `<option value="${l.id}">${l.name} (${l.mobile || l.whatsapp || 'No Phone'})</option>`).join('');
    
    if (leads.length === 0) {
      waShareSelect.innerHTML = '<option value="">No leads available</option>';
      waShareConfirmBtn.disabled = true;
    } else {
      waShareConfirmBtn.disabled = false;
    }

    waShareOverlay.style.display = 'flex';
  });

  waShareCancelBtn?.addEventListener('click', () => {
    waShareOverlay.style.display = 'none';
  });

  waShareConfirmBtn?.addEventListener('click', async () => {
    const leadId = waShareSelect.value;
    if (!leadId) return;
    
    const id = modalShareWaBtn.dataset.id;
    const prop = getProperties().find(p => p.id === id);
    if (!prop) return;

    const leads = JSON.parse(localStorage.getItem('thanjai_leads')) || [];
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    let rawPhone = lead.whatsapp || lead.mobile;
    if (!rawPhone) {
      alert('This lead has no phone number.');
      return;
    }

    let phone = rawPhone.replace(/\D/g, '');
    if (phone.length === 10) phone = '91' + phone;

    const provider = localStorage.getItem('thanjai_wa_provider') || 'aisensy';
    const apiUrl = provider === 'smartping' 
      ? 'https://backend.api-wa.co/campaign/smartping/api/v2' 
      : 'https://backend.aisensy.com/campaign/t1/api/v2';

    if (provider === 'smartping' && !phone.startsWith('+')) {
      phone = '+' + phone;
    }

    const apiKey = localStorage.getItem('thanjai_whatsapp_api_key');
    if (!apiKey) {
      alert('Please go to Settings > Integrations and paste your WhatsApp API Key first.');
      return;
    }

    const originalHtml = waShareConfirmBtn.innerHTML;
    waShareConfirmBtn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i>';
    waShareConfirmBtn.disabled = true;

    try {
      const payload = {
        apiKey: apiKey,
        campaignName: 'initial_contact_intro',
        destination: phone,
        userName: lead.name || "Client",
        templateParams: [lead.name || "Client", prop.title, prop.location, prop.priceFormatted || prop.price]
      };
      
      const propImg = (prop.images && prop.images.length > 0) 
        ? prop.images[0] 
        : "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
        
      payload.media = { url: propImg, filename: "property.jpg" };
      payload.mediaUrl = propImg;

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(`[${provider.toUpperCase()}] ${data.message || data.error || JSON.stringify(data)}`);

      if (!lead.timeline) lead.timeline = [];
      lead.timeline.unshift({
        type: 'whatsapp',
        message: `WhatsApp sent: Property - ${prop.title}`,
        author: localStorage.getItem('thanjai_active_user') ? JSON.parse(localStorage.getItem('thanjai_active_user')).fullName : 'System',
        date: new Date().toISOString()
      });
      
      localStorage.setItem('thanjai_leads', JSON.stringify(leads));
      window.dispatchEvent(new CustomEvent('leadsUpdated'));
      
      if (window.showToast) window.showToast('Property shared via WhatsApp successfully!', 'success');
      waShareOverlay.style.display = 'none';
      
    } catch (e) {
      console.error(e);
      alert('Failed to send WhatsApp message: ' + e.message);
    } finally {
      waShareConfirmBtn.innerHTML = originalHtml;
      waShareConfirmBtn.disabled = false;
    }
  });

  modalEditBtn?.addEventListener('click', () => {
    const id = modalEditBtn.dataset.id;
    previewPropertyId = null;
    activeMediaIndex = 0;
    document.getElementById('admin-prop-modal-overlay')?.remove();
    if (id) {
      editingPropertyId = id;
      currentViewMode = 'form';
      refreshPropertiesView();
    }
  });

  // Carousel Arrow Handlers
  prevMediaBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const activeProp = getProperties().find(p => p.id === previewPropertyId);
    const mediaCount = (activeProp?.images?.length || 1) + (activeProp?.videoUrl ? 1 : 0);
    activeMediaIndex = (activeMediaIndex - 1 + mediaCount) % mediaCount;
    refreshPropertiesView();
  });

  nextMediaBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const activeProp = getProperties().find(p => p.id === previewPropertyId);
    const mediaCount = (activeProp?.images?.length || 1) + (activeProp?.videoUrl ? 1 : 0);
    activeMediaIndex = (activeMediaIndex + 1) % mediaCount;
    refreshPropertiesView();
  });

  // Thumbnail Cards Click Handler
  document.querySelectorAll('.preview-thumb-card').forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.dataset.index, 10);
      if (!isNaN(idx)) {
        activeMediaIndex = idx;
        refreshPropertiesView();
      }
    });
  });
}

export function initPropertiesViewListeners() {
  if (currentViewMode === 'form') {
    initPropertyFormListeners();
    return;
  }

  // Bind Admin Preview Modal Event Handlers if modal is open
  if (previewPropertyId) {
    bindModalPreviewListeners();
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
      previewPropertyId = null;
      activeMediaIndex = 0;
      formImagesList = [];
      formVideoFileUrl = '';
      currentViewMode = 'form';
      refreshPropertiesView();
    });
  });

  // CSV Import Handler
  const importBtn = document.getElementById('import-props-csv-btn');
  const csvInput = document.getElementById('import-props-csv-file');

  importBtn?.addEventListener('click', () => {
    csvInput?.click();
  });

  csvInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target.result;
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
        if (lines.length > 1) {
          // Parse header line to detect column positions
          const headerCols = lines[0].split(',').map(c => c.replace(/^["']|["']$/g, '').trim().toLowerCase());
          
          const getColIdx = (names) => {
            for (let name of names) {
              const idx = headerCols.findIndex(h => h.includes(name));
              if (idx !== -1) return idx;
            }
            return -1;
          };

          const titleIdx = getColIdx(['title', 'property name', 'name']);
          const typeIdx = getColIdx(['type', 'property type']);
          const catIdx = getColIdx(['category']);
          const priceIdx = getColIdx(['price', 'amount', 'cost']);
          const locIdx = getColIdx(['location', 'area', 'corridor']);
          const distIdx = getColIdx(['district', 'city']);
          const addrIdx = getColIdx(['address', 'street']);
          const sizeIdx = getColIdx(['size', 'area size', 'sqft']);
          const bedsIdx = getColIdx(['bedroom', 'beds', 'bhk']);
          const bathsIdx = getColIdx(['bathroom', 'baths']);
          const furnIdx = getColIdx(['furnish']);
          const statusIdx = getColIdx(['status', 'availab']);
          const ownerNameIdx = getColIdx(['owner name', 'owner', 'contact name']);
          const ownerPhoneIdx = getColIdx(['owner phone', 'phone', 'mobile']);
          const descIdx = getColIdx(['desc', 'about', 'details']);

          let importedCount = 0;
          for (let i = 1; i < lines.length; i++) {
            const match = lines[i].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
            const cols = match 
              ? match.map(c => c.replace(/^"|"$/g, '').trim())
              : lines[i].split(',').map(c => c.replace(/^"|"$/g, '').trim());

            const val = (idx, fallback = '') => (idx !== -1 && cols[idx] !== undefined ? cols[idx] : fallback);

            const title = val(titleIdx !== -1 ? titleIdx : 0);
            if (title && title.toLowerCase() !== 'title') {
              const rawType = val(typeIdx !== -1 ? typeIdx : 1, 'Villa');
              const rawCat = val(catIdx !== -1 ? catIdx : 2, 'villas').toLowerCase();
              const rawPrice = parseFloat(val(priceIdx !== -1 ? priceIdx : 3, '5000000').replace(/[^0-9.]/g, '')) || 5000000;
              const location = val(locIdx !== -1 ? locIdx : 4, 'Medical College Road, Thanjavur');
              const district = val(distIdx !== -1 ? distIdx : 5, 'Thanjavur');
              const address = val(addrIdx !== -1 ? addrIdx : 6, location);
              const size = val(sizeIdx !== -1 ? sizeIdx : 7, '2,400 Sq.Ft');
              const beds = parseInt(val(bedsIdx !== -1 ? bedsIdx : 8, '')) || null;
              const baths = parseInt(val(bathsIdx !== -1 ? bathsIdx : 9, '')) || null;
              const furnishing = val(furnIdx !== -1 ? furnIdx : 10, 'Unfurnished');
              const status = val(statusIdx !== -1 ? statusIdx : 11, 'Available');
              const ownerName = val(ownerNameIdx !== -1 ? ownerNameIdx : 12, 'Owner');
              const ownerPhone = val(ownerPhoneIdx !== -1 ? ownerPhoneIdx : 13, '8489996852');
              const description = val(descIdx !== -1 ? descIdx : 14, `Verified property in ${location}`);

              addProperty({
                title: title,
                type: rawType,
                category: rawCat.includes('villa') ? 'villas' : rawCat.includes('house') ? 'houses' : rawCat.includes('apart') ? 'apartments' : rawCat.includes('plot') ? 'plots' : rawCat.includes('agri') || rawCat.includes('farm') ? 'agricultural' : rawCat.includes('comm') ? 'commercial' : 'villas',
                categoryRaw: rawCat,
                price: rawPrice,
                location: location,
                district: district,
                address: address,
                size: size,
                bedrooms: beds,
                bathrooms: baths,
                furnishing: furnishing,
                status: status,
                availability: status,
                approvalStatus: 'Approved',
                ownerName: ownerName,
                ownerPhone: ownerPhone,
                description: description
              });
              importedCount++;
            }
          }
          addAuditLog({ action: 'IMPORT_PROPERTIES_CSV', details: `Imported ${importedCount} properties from CSV file.` });
          showToast(`Successfully imported ${importedCount} property listings!`, 'ri-upload-cloud-line');
          refreshPropertiesView();
        }
      };
      reader.readAsText(file);
    }
  });

  // CSV Export & Sample CSV Template Download
  document.getElementById('export-props-csv-btn')?.addEventListener('click', exportFilteredPropertiesToCSV);
  document.getElementById('download-sample-csv-btn')?.addEventListener('click', downloadSamplePropertiesCSV);

  // Edit Buttons
  document.querySelectorAll('.edit-prop-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      if (id) {
        previewPropertyId = null;
        activeMediaIndex = 0;
        editingPropertyId = id;
        currentViewMode = 'form';
        refreshPropertiesView();
      }
    });
  });

  // Preview Admin Property Details Modal Buttons
  document.querySelectorAll('.view-website-prop-btn').forEach(btn => {
    btn.setAttribute('title', 'Preview property details');
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      if (id) {
        previewPropertyId = id;
        activeMediaIndex = 0;
        refreshPropertiesView();
      }
    });
  });

  // Delete Buttons (CUSTOM PROFESSIONAL CONFIRMATION MODAL)
  document.querySelectorAll('.delete-prop-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const targetProp = getProperties().find(p => p.id === id);
      showAdminDeleteConfirmModal(id, targetProp?.title || '', () => {
        if (previewPropertyId === id) previewPropertyId = null;
        activeMediaIndex = 0;
        deleteProperty(id);
        showToast(`Property ${id} deleted from inventory.`, 'ri-delete-bin-line');
        refreshPropertiesView();
      });
    });
  });

  // Quick Approve Button
  document.querySelectorAll('.quick-approve-prop-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      if (id) {
        updateProperty(id, { status: 'Available', availability: 'Available', approvalStatus: 'Approved' });
        showToast(`Property ${id} approved & published live to website!`, 'ri-checkbox-circle-fill');
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
        if (newStatus === 'Available') {
          updateProperty(id, { status: 'Available', availability: 'Available', approvalStatus: 'Approved' });
          showToast(`Property ${id} approved & published live!`, 'ri-checkbox-circle-fill');
        } else if (newStatus === 'Pending Approval') {
          updateProperty(id, { status: 'Pending Approval', availability: 'Pending Approval', approvalStatus: 'Pending Approval' });
          showToast(`Property ${id} set to Pending Approval.`, 'ri-time-line');
        } else {
          updateProperty(id, { status: newStatus, availability: newStatus });
          showToast(`Property ${id} status updated to ${newStatus}`, 'ri-checkbox-circle-fill');
        }
        refreshPropertiesView();
      }
    });
  });

  // Quick Ad Type Select Dropdown (Free Ad vs Paid Ad)
  document.querySelectorAll('.quick-adtype-select').forEach(sel => {
    sel.addEventListener('change', (e) => {
      const id = sel.dataset.id;
      const newAdType = e.target.value;
      if (id && newAdType) {
        updateProperty(id, { adType: newAdType });
        if (newAdType === 'paid') {
          showToast(`Property ${id} updated to Paid Ad! Direct Owner details & call links enabled.`, 'ri-vip-crown-fill');
        } else {
          showToast(`Property ${id} updated to Free Ad (Thanjai Property Desk +91 84899 96852).`, 'ri-shield-user-fill');
        }
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

  const typeInput = document.getElementById('form-prop-type');
  const resSpecsSection = document.getElementById('residential-specs-section');

  typeInput?.addEventListener('input', () => {
    const val = (typeInput.value || '').toLowerCase().trim();
    const resKeywords = ['house', 'villa', 'apartment', 'home', 'flat', 'duplex', 'townhouse', 'penthouse', 'building', 'room', 'bhk', 'residence', 'cottage', 'bungalow', 'rowhouse', 'manor', 'studio'];
    const isRes = resKeywords.some(k => val.includes(k));

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
          if (leafletMapInstance && leafletMarkerInstance) {
            leafletMarkerInstance.setLatLng([lat, lng]);
            leafletMapInstance.setView([lat, lng], 15);
          }
          showToast(`GPS set to Lat: ${lat}, Lng: ${lng}`, 'ri-map-pin-user-fill');
        },
        (err) => {
          console.warn('Geolocation error:', err);
          showToast('Could not fetch GPS location. Please check browser permissions.', 'ri-error-warning-line');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
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

  // Primary Image URL input listener for live preview sync
  const mainImgInput = document.getElementById('form-prop-img-main');
  mainImgInput?.addEventListener('input', () => {
    const val = mainImgInput.value.trim();
    if (val && !formImagesList.includes(val)) {
      formImagesList.unshift(val);
      formImagesList = [...new Set(formImagesList)];
      refreshGalleryPreviewGrid();
    }
  });

  // Gallery Photos File Input Listener with Canvas Compression
  const galleryFileInput = document.getElementById('form-prop-gallery-file-input');
  galleryFileInput?.addEventListener('change', async (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    showToast(`Compressing ${files.length} photo(s)...`, 'ri-loader-4-line');

    let loadedCount = 0;
    for (const file of files) {
      const compressed = await compressImageFile(file, 1000, 800, 0.75);
      if (compressed) {
        formImagesList.push(compressed);
        loadedCount++;
      }
    }

    formImagesList = [...new Set(formImagesList)];
    if (loadedCount > 0) {
      refreshGalleryPreviewGrid();
      showToast(`${loadedCount} HD photo(s) added to property!`, 'ri-image-add-line');
    }
  });

  // Dynamic Video Link Rows
  const addVideoLinkBtn = document.getElementById('add-video-link-row-btn');
  const videoLinksContainer = document.getElementById('video-links-container');

  function renderVideoLinkRows() {
    if (!videoLinksContainer) return;
    videoLinksContainer.innerHTML = formVideoLinksList.map((vLink, idx) => `
      <div class="video-link-row" style="display: flex; gap: 8px; align-items: center;">
        <input type="url" class="form-prop-videolink-input" data-index="${idx}" value="${vLink || ''}" placeholder="e.g. https://youtube.com/watch?v=... or https://facebook.com/.../videos/..." style="flex: 1; padding: 10px 14px; font-size: 0.9rem; border-radius: 8px; border: 1px solid #cbd5e0; background: #fff; box-sizing: border-box;" />
        ${formVideoLinksList.length > 1 ? `
          <button type="button" class="remove-video-link-row-btn" data-index="${idx}" style="background: #fed7d7; color: #c53030; border: none; border-radius: 8px; padding: 10px 12px; cursor: pointer; font-size: 0.9rem;" title="Remove this video link">
            <i class="ri-delete-bin-line"></i>
          </button>
        ` : ''}
      </div>
    `).join('');

    videoLinksContainer.querySelectorAll('.remove-video-link-row-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index, 10);
        if (!isNaN(idx) && formVideoLinksList.length > 1) {
          formVideoLinksList.splice(idx, 1);
          renderVideoLinkRows();
        }
      });
    });

    videoLinksContainer.querySelectorAll('.form-prop-videolink-input').forEach(inp => {
      inp.addEventListener('input', () => {
        const idx = parseInt(inp.dataset.index, 10);
        if (!isNaN(idx)) {
          formVideoLinksList[idx] = inp.value;
        }
      });
    });
  }

  addVideoLinkBtn?.addEventListener('click', () => {
    formVideoLinksList.push('');
    renderVideoLinkRows();
  });

  renderVideoLinkRows();

  // Multi-Video File Upload Listener
  const videoFileInput = document.getElementById('form-prop-video-file-input');
  const videoFilesContainer = document.getElementById('video-files-preview-container');

  function renderVideoFilesChips() {
    if (!videoFilesContainer) return;
    videoFilesContainer.innerHTML = formVideoFilesList.map((vf, idx) => `
      <span style="display: inline-flex; align-items: center; gap: 6px; background: #EDF2F7; border: 1px solid #CBD5E0; padding: 6px 12px; border-radius: 20px; font-size: 0.82rem; font-weight: 700; color: #2D3748;">
        <i class="ri-movie-fill" style="color: #eb5e28;"></i>
        <span>${vf.name || `Video ${idx + 1}`}</span>
        <button type="button" class="delete-uploaded-video-file-btn" data-index="${idx}" style="background: none; border: none; color: #E53E3E; cursor: pointer; padding: 0; margin-left: 4px;" title="Remove video">
          <i class="ri-close-circle-fill"></i>
        </button>
      </span>
    `).join('');

    videoFilesContainer.querySelectorAll('.delete-uploaded-video-file-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index, 10);
        if (!isNaN(idx)) {
          formVideoFilesList.splice(idx, 1);
          renderVideoFilesChips();
          showToast('Video removed', 'ri-delete-bin-line');
        }
      });
    });
  }

  videoFileInput?.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    showToast(`Loading ${files.length} video(s)...`, 'ri-loader-4-line');
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        formVideoFilesList.push({
          name: file.name,
          dataUrl: evt.target.result
        });
        renderVideoFilesChips();
        showToast(`Video "${file.name}" attached!`, 'ri-video-upload-line');
      };
      reader.readAsDataURL(file);
    });
  });

  renderVideoFilesChips();

  bindGalleryDeleteButtons();

  // Form Submit Handler
  document.getElementById('prop-admin-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('form-prop-title')?.value.trim();
    const type = document.getElementById('form-prop-type')?.value;
    const category = document.getElementById('form-prop-category')?.value;
    const price = document.getElementById('form-prop-price')?.value;
    const location = document.getElementById('form-prop-location')?.value.trim();
    const facing = document.getElementById('form-prop-facing')?.value.trim();
    const size = document.getElementById('form-prop-size')?.value.trim();
    const bedrooms = document.getElementById('form-prop-bedrooms')?.value;
    const bathrooms = document.getElementById('form-prop-bathrooms')?.value;
    const furnishing = document.getElementById('form-prop-furnishing')?.value;
    const status = document.getElementById('form-prop-status')?.value;
    const approval = document.getElementById('form-prop-approval')?.value.trim();
    const featuresStr = document.getElementById('form-prop-features')?.value.trim();
    const description = document.getElementById('form-prop-desc')?.value.trim();
    
    // Collect all video links and video data URLs
    const videoLinkInputs = Array.from(document.querySelectorAll('.form-prop-videolink-input')).map(inp => inp.value.trim()).filter(Boolean);
    const videoFiles = formVideoFilesList.map(vf => vf.dataUrl).filter(Boolean);
    const allVideos = [...new Set([...videoLinkInputs, ...videoFiles])];
    const videoUrl = allVideos.length === 1 ? allVideos[0] : (allVideos.length > 1 ? JSON.stringify(allVideos) : '');

    const rawLatitude = document.getElementById('form-prop-latitude')?.value.trim();
    const rawLongitude = document.getElementById('form-prop-longitude')?.value.trim();
    const latitude = rawLatitude ? String(parseCoordinate(rawLatitude, rawLatitude)) : '';
    const longitude = rawLongitude ? String(parseCoordinate(rawLongitude, rawLongitude)) : '';
    const mainImg = document.getElementById('form-prop-img-main')?.value.trim();

    let finalImages = [...formImagesList];
    if (mainImg && !finalImages.includes(mainImg)) {
      finalImages.unshift(mainImg);
    }
    finalImages = [...new Set(finalImages.filter(Boolean))];

    if (finalImages.length === 0) {
      finalImages.push('/default-property.jpg');
    }

    const featuresArray = featuresStr ? featuresStr.split(',').map(f => f.trim()).filter(Boolean) : [];

    const loc = location || '';
    let parsedDistrict = 'Thanjavur';
    const knownDistricts = ['Thanjavur', 'Trichy', 'Tiruchirappalli', 'Madurai', 'Chennai', 'Coimbatore', 'Kumbakonam', 'Pudukkottai', 'Tiruvarur', 'Nagapattinam', 'Salem', 'Dindigul', 'Karur', 'Perambalur', 'Ariyalur', 'Mayiladuthurai'];
    
    if (loc.includes(',')) {
      const parts = loc.split(',').map(p => p.trim());
      const matched = knownDistricts.find(d => parts.some(p => p.toLowerCase() === d.toLowerCase()));
      if (matched) {
        parsedDistrict = matched;
      } else {
        parsedDistrict = parts[parts.length - 1] || 'Thanjavur';
      }
    } else {
      const matched = knownDistricts.find(d => loc.toLowerCase().includes(d.toLowerCase()));
      parsedDistrict = matched || 'Thanjavur';
    }

    const val = (type || '').toLowerCase();
    const resKeywords = ['house', 'villa', 'apartment', 'home', 'flat', 'duplex', 'townhouse', 'penthouse', 'building', 'room'];
    const isRes = resKeywords.some(k => val.includes(k));

    const formData = {
      title: title || 'Untitled Property',
      type: type || 'Villa',
      category: category || 'Sale',
      price: parseFloat(price) || 0,
      location: location || 'Thanjavur',
      district: parsedDistrict,
      facing: facing || '',
      size: size ? formatPropertySize(size) : '',
      bedrooms: (isRes && bedrooms) ? parseInt(bedrooms, 10) : null,
      bathrooms: (isRes && bathrooms) ? parseInt(bathrooms, 10) : null,
      furnishing: isRes ? (furnishing || 'Not specified') : 'Not specified',
      status: status || 'Available',
      availability: status || 'Available',
      approval: approval || '',
      latitude: latitude,
      longitude: longitude,
      videoUrl: videoUrl,
      images: finalImages,
      features: featuresArray,
      description: description || '',
      ownerName: document.getElementById('form-prop-owner-name')?.value.trim() || 'Aishwarya Raman',
      ownerPhone: document.getElementById('form-prop-owner-phone')?.value.trim() || '8489996852',
      listedBy: 'Aishwarya Raman'
    };

    if (editingPropertyId) {
      updateProperty(editingPropertyId, formData);
      showToast(`Property ${editingPropertyId} updated successfully!`, 'ri-checkbox-circle-fill');
    } else {
      addProperty(formData);
      showToast('New property listing published!', 'ri-checkbox-circle-fill');
    }

    currentViewMode = 'list';
    editingPropertyId = null;
    formImagesList = [];
    formVideoLinksList = [''];
    formVideoFilesList = [];
    refreshPropertiesView();
  });
}

function parseCoordinate(coordStr, defaultVal) {
  if (!coordStr || typeof coordStr !== 'string') return defaultVal;
  const clean = coordStr.trim();
  if (!clean) return defaultVal;

  const dec = parseFloat(clean);
  if (!isNaN(dec) && !clean.includes('°') && !clean.includes("'") && !clean.includes('"')) {
    return dec;
  }

  const dmsMatch = clean.match(/(\d+)[°\s]+(\d+)[`'\s]+([\d.]+)(?:["\s]*([NSEWnsew])?)?/);
  if (dmsMatch) {
    const deg = parseFloat(dmsMatch[1]) || 0;
    const min = parseFloat(dmsMatch[2]) || 0;
    const sec = parseFloat(dmsMatch[3]) || 0;
    const dir = dmsMatch[4] ? dmsMatch[4].toUpperCase() : '';
    let val = deg + (min / 60) + (sec / 3600);
    if (dir === 'S' || dir === 'W') val = -val;
    return parseFloat(val.toFixed(6));
  }

  return !isNaN(dec) ? dec : defaultVal;
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
    script.onload = () => createLeafletMapWidget();
    document.head.appendChild(script);
  } else {
    createLeafletMapWidget();
  }
}

function createLeafletMapWidget() {
  const latInp = document.getElementById('form-prop-latitude');
  const lngInp = document.getElementById('form-prop-longitude');

  let initLat = parseCoordinate(latInp?.value, 10.786999);
  let initLng = parseCoordinate(lngInp?.value, 79.137827);

  if (leafletMapInstance) {
    leafletMapInstance.remove();
    leafletMapInstance = null;
  }

  leafletMapInstance = L.map('leaflet-interactive-map').setView([initLat, initLng], 14);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  }).addTo(leafletMapInstance);

  leafletMarkerInstance = L.marker([initLat, initLng], { draggable: true }).addTo(leafletMapInstance);

  leafletMarkerInstance.on('dragend', (e) => {
    const latlng = e.target.getLatLng();
    if (latInp) latInp.value = latlng.lat.toFixed(6);
    if (lngInp) lngInp.value = latlng.lng.toFixed(6);
    showToast(`Pinpoint updated: ${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}`, 'ri-map-pin-2-fill');
  });

  leafletMapInstance.on('click', (e) => {
    const { lat, lng } = e.latlng;
    leafletMarkerInstance.setLatLng([lat, lng]);
    if (latInp) latInp.value = lat.toFixed(6);
    if (lngInp) lngInp.value = lng.toFixed(6);
    showToast(`Pinpoint moved to clicked location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`, 'ri-map-pin-2-fill');
  });

  setTimeout(() => {
    if (leafletMapInstance) leafletMapInstance.invalidateSize();
  }, 200);
}

function refreshGalleryPreviewGrid() {
  const container = document.getElementById('uploaded-images-preview-grid');
  if (container) {
    container.innerHTML = renderUploadedImagesGallery();
    bindGalleryDeleteButtons();
  }
}

function bindGalleryDeleteButtons() {
  document.querySelectorAll('.delete-uploaded-img-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const index = parseInt(btn.dataset.index, 10);
      if (!isNaN(index) && index >= 0 && index < formImagesList.length) {
        formImagesList.splice(index, 1);
        refreshGalleryPreviewGrid();
        showToast('Photo removed from upload queue', 'ri-delete-bin-line');
      }
    });
  });
}

function exportFilteredPropertiesToCSV() {
  const allProperties = getProperties();
  const filtered = filterPropertiesList(allProperties);

  if (filtered.length === 0) {
    showToast('No properties available to export under current filters.', 'ri-error-warning-line');
    return;
  }

  const headers = ['Property ID', 'Title', 'Type', 'Category', 'Price (INR)', 'Location', 'District', 'Address', 'Area Size', 'Bedrooms', 'Bathrooms', 'Furnishing', 'Status', 'Owner Name', 'Owner Phone', 'Created At'];
  
  const csvRows = [headers.join(',')];

  filtered.forEach(p => {
    const row = [
      `"${p.id || ''}"`,
      `"${(p.title || '').replace(/"/g, '""')}"`,
      `"${p.type || ''}"`,
      `"${p.categoryRaw || p.category || ''}"`,
      `"${p.price || 0}"`,
      `"${(p.location || '').replace(/"/g, '""')}"`,
      `"${(p.district || '').replace(/"/g, '""')}"`,
      `"${(p.address || '').replace(/"/g, '""')}"`,
      `"${(p.size || '').replace(/"/g, '""')}"`,
      `"${p.bedrooms || ''}"`,
      `"${p.bathrooms || ''}"`,
      `"${p.furnishing || ''}"`,
      `"${p.status || p.availability || ''}"`,
      `"${(p.ownerName || '').replace(/"/g, '""')}"`,
      `"${p.ownerPhone || ''}"`,
      `"${p.createdAt || ''}"`
    ];
    csvRows.push(row.join(','));
  });

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Thanjai_Properties_Export_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  addAuditLog({
    action: 'EXPORT_PROPERTIES_CSV',
    details: `Exported ${filtered.length} property listings matching current filters to CSV file.`
  });

  showToast(`Exported ${filtered.length} filtered property records to CSV`, 'ri-file-download-line');
}

function downloadSamplePropertiesCSV() {
  const headers = [
    'Title',
    'Type',
    'Category',
    'Price (INR)',
    'Location',
    'District',
    'Address',
    'Area Size',
    'Bedrooms',
    'Bathrooms',
    'Furnishing',
    'Status',
    'Owner Name',
    'Owner Phone',
    'Description'
  ];

  const sampleRows = [
    [
      '"4 BHK Luxury Courtyard Villa - Medical College Road"',
      '"Villa"',
      '"villas"',
      '"13500000"',
      '"Medical College Road, Thanjavur"',
      '"Thanjavur"',
      '"Plot 42, Green Avenue, Medical College Road"',
      '"2,600 Sq.Ft"',
      '"4"',
      '"4"',
      '"Fully Furnished"',
      '"Available"',
      '"R. Sundaram"',
      '"9585777772"',
      '"Brand new luxury courtyard villa with DTCP approval, modular kitchen, and private borewell."'
    ],
    [
      '"DTCP Approved Corner Plot - Trichy Highway"',
      '"Plot"',
      '"plots"',
      '"2800000"',
      '"Trichy Road, Thanjavur"',
      '"Thanjavur"',
      '"Near New Bus Stand Bypass, Trichy Road"',
      '"1,800 Sq.Ft"',
      '""',
      '""',
      '""',
      '"Available"',
      '"K. Mohan"',
      '"9842412345"',
      '"Prime corner residential plot with 40ft blacktop road, clear Patta, and instant bank loan approval."'
    ],
    [
      '"5 Acres Fertile Kaveri Delta Coconut Farmland"',
      '"Other"',
      '"agricultural"',
      '"7500000"',
      '"Pattukottai Bypass, Thanjavur"',
      '"Thanjavur"',
      '"Pattukkottai Main Road, Thanjavur District"',
      '"5.0 Acres"',
      '""',
      '""',
      '""',
      '"Available"',
      '"M. Radhakrishnan"',
      '"9443198765"',
      '"Fertile agricultural farmland with 350 yield coconut trees, Kaveri canal water connectivity, and EB service."'
    ]
  ];

  const csvContent = [headers.join(','), ...sampleRows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'Thanjai_Properties_Sample_Template.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast('Downloaded sample CSV template successfully!', 'ri-file-download-line');
}

export function refreshPropertiesView() {
  // Remove any stale overlay attached directly to document.body
  document.getElementById('admin-prop-modal-overlay')?.remove();

  const contentArea = document.getElementById('os-content');
  if (contentArea) {
    contentArea.innerHTML = renderPropertiesView();
    initPropertiesViewListeners();

    // If modal is active, mount directly on document.body to bypass CSS animation transform containing block
    if (previewPropertyId) {
      const allProps = getProperties();
      const previewProp = allProps.find(p => p.id === previewPropertyId);
      if (previewProp) {
        const wrapperDiv = document.createElement('div');
        wrapperDiv.innerHTML = renderAdminPropertyPreviewModal(previewProp);
        const modalElement = wrapperDiv.firstElementChild;
        if (modalElement) {
          document.body.appendChild(modalElement);
          bindModalPreviewListeners();
        }
      }
    }
  }
}

function showAdminDeleteConfirmModal(propId, propTitle, onConfirm) {
  document.getElementById('admin-custom-confirm-overlay')?.remove();

  const overlay = document.createElement('div');
  overlay.id = 'admin-custom-confirm-overlay';
  overlay.style.cssText = `
    position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important;
    width: 100vw !important; height: 100vh !important; z-index: 999999 !important;
    background: rgba(15, 23, 42, 0.75) !important; backdrop-filter: blur(6px) !important;
    display: flex !important; align-items: center !important; justify-content: center !important;
    padding: 20px !important; box-sizing: border-box !important; margin: 0 !important;
  `;

  overlay.innerHTML = `
    <div style="
      background: #ffffff; width: 100%; max-width: 440px; border-radius: 20px;
      padding: 32px 28px 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.3); text-align: center;
      box-sizing: border-box; border: 1px solid #E2E8F0;
    ">
      <div style="
        width: 60px; height: 60px; border-radius: 50%; background: #FFF5F5;
        border: 2px solid #FED7D7; color: #E52E3D; display: flex; align-items: center;
        justify-content: center; font-size: 1.8rem; margin: 0 auto 20px;
      ">
        <i class="ri-delete-bin-line"></i>
      </div>

      <h3 style="font-size: 1.25rem; font-weight: 800; color: #1A202C; margin: 0 0 8px 0;">Delete Property Listing?</h3>
      
      <p style="font-size: 0.9rem; color: #718096; line-height: 1.5; margin: 0 0 20px 0;">
        Are you sure you want to permanently delete <strong style="color: #E52E3D;">${propId}</strong> (${propTitle || 'this listing'})? This action cannot be undone.
      </p>

      <div style="display: flex; gap: 12px; justify-content: center;">
        <button id="cancel-admin-delete-btn" style="
          flex: 1; padding: 12px 18px; border-radius: 12px; border: 1px solid #CBD5E0;
          background: #EDF2F7; color: #4A5568; font-weight: 700; font-size: 0.9rem; cursor: pointer;
        ">Cancel</button>
        <button id="confirm-admin-delete-btn" style="
          flex: 1; padding: 12px 18px; border-radius: 12px; border: none;
          background: #E52E3D; color: #ffffff; font-weight: 700; font-size: 0.9rem; cursor: pointer;
          box-shadow: 0 4px 12px rgba(229, 46, 61, 0.3);
        ">Yes, Delete</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const closeConfirm = () => overlay.remove();

  document.getElementById('cancel-admin-delete-btn')?.addEventListener('click', closeConfirm);
  document.getElementById('confirm-admin-delete-btn')?.addEventListener('click', () => {
    closeConfirm();
    onConfirm();
  });
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeConfirm();
  });
}

export { initPropertiesViewListeners as initPropertiesListeners };
