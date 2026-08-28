import { getAllSiteImages, updateSiteImage, resetSiteImage, resetAllSiteImages } from '../utils/siteImagesStore.js';
import { showConfirmModal } from '../utils/toast.js';

export function renderWebsiteImagesView() {
  const imagesMap = getAllSiteImages();
  const imageList = Object.values(imagesMap);

  const categories = Array.from(new Set(imageList.map(img => img.category))).filter(Boolean);

  return `
    <div class="view-enter website-images-view">
      <!-- Header -->
      <div class="view-header-flex" style="margin-bottom: 24px;">
        <div>
          <div style="margin-bottom: 8px;">
            <span style="
              display: inline-flex; align-items: center; gap: 6px;
              font-size: 0.8rem; font-weight: 800; color: var(--os-luxury-orange);
              text-transform: uppercase; letter-spacing: 0.1em;
            ">
              <i class="ri-image-edit-line"></i> SITE ASSETS & BANNER MANAGEMENT
            </span>
          </div>
          <h1 class="view-title">Website Front-End Images</h1>
          <p class="view-subtitle">Customize and replace all static banners, cards, and section images displayed across the website.</p>
        </div>

        <div class="header-actions-right" style="gap: 12px;">
          <a href="/index.html" target="_blank" class="os-btn-secondary" style="display: inline-flex; align-items: center; gap: 8px; text-decoration: none;">
            <i class="ri-external-link-line"></i> View Live Website
          </a>
          <button class="os-btn-secondary" id="reset-all-site-images-btn" style="color: #e53e3e; border-color: rgba(229, 62, 62, 0.3);">
            <i class="ri-refresh-line"></i> Reset All Defaults
          </button>
        </div>
      </div>

      <!-- Info Banner Box explaining Pixel & Size info -->
      <div class="pixel-guidelines-banner" style="
        background: linear-gradient(135deg, rgba(235, 94, 40, 0.08) 0%, rgba(255, 255, 255, 0.9) 100%);
        border: 1px solid rgba(235, 94, 40, 0.25);
        border-radius: 16px;
        padding: 20px 24px;
        margin-bottom: 28px;
        display: flex;
        align-items: flex-start;
        gap: 18px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.03);
      ">
        <div style="
          width: 44px; height: 44px; border-radius: 12px; background: var(--color-orange, #eb5e28);
          color: white; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; flex-shrink: 0;
        ">
          <i class="ri-ruler-2-line"></i>
        </div>
        <div style="flex: 1;">
          <h3 style="font-size: 1.05rem; font-weight: 700; color: #1a1a1a; margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
            Image Resolution & Aspect Ratio Guidelines
          </h3>
          <p style="font-size: 0.9rem; color: #555; line-height: 1.5; margin: 0;">
            To maintain crisp luxury visual quality on high-DPI retina displays and mobile phones, upload images matching the 
            <strong>recommended pixel dimensions (Width × Height)</strong> listed on each card. Uploaded local images or image URLs will automatically update the front-end homepage instantly!
          </p>
        </div>
      </div>
      <!-- Filter Controls & Category Dropdown -->
      <div class="os-filter-bar" style="margin-bottom: 28px; display: flex; gap: 16px;">
        <div class="search-box" style="flex: 1;">
          <i class="ri-search-line"></i>
          <input type="text" id="img-search-input" placeholder="Search by section, banner name, category..." style="width: 100%; border: none; background: transparent; outline: none;" />
        </div>

        <div style="width: 280px;">
          <select id="img-category-dropdown" style="width: 100%; height: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid var(--os-border); background: var(--os-gray-100); color: var(--os-text); font-size: 0.85rem; font-weight: 600; cursor: pointer; outline: none; appearance: none;">
            <option value="all">All Front-End Images (${imageList.length})</option>
            ${categories.map(cat => {
              const count = imageList.filter(img => img.category === cat).length;
              return `<option value="${cat}">${cat} (${count})</option>`;
            }).join('')}
          </select>
        </div>
      </div>

      <!-- Website Images Grid -->
      <div class="website-images-grid" id="website-images-grid" style="
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
        gap: 24px;
      ">
        ${imageList.map(item => renderImageCard(item)).join('')}
      </div>
    </div>
  `;
}

function renderImageCard(item) {
  return `
    <div class="site-img-card ${item.isCustom ? 'custom-active' : ''}" data-id="${item.id}" data-category="${item.category}" style="
      background: #ffffff;
      border: 1px solid rgba(0,0,0,0.08);
      border-radius: 16px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 4px 14px rgba(0,0,0,0.04);
      transition: all 0.25s ease;
    ">
      <!-- Card Top Info Header -->
      <div style="padding: 16px 20px 12px 20px; border-bottom: 1px solid rgba(0,0,0,0.05); display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <span style="
            font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-orange, #eb5e28);
          ">${item.category}</span>
          <h3 style="font-size: 1.05rem; font-weight: 700; color: #222; margin-top: 2px;">${item.title}</h3>
        </div>
        <span class="status-pill ${item.isCustom ? 'custom' : 'default'}" style="
          font-size: 0.75rem; font-weight: 600; padding: 4px 10px; border-radius: 20px;
          background: ${item.isCustom ? '#e6fffa' : '#f7fafc'};
          color: ${item.isCustom ? '#234e52' : '#718096'};
          border: 1px solid ${item.isCustom ? '#b2f5ea' : '#e2e8f0'};
          display: inline-flex; align-items: center; gap: 4px;
        ">
          <i class="${item.isCustom ? 'ri-edit-line' : 'ri-check-line'}"></i>
          ${item.isCustom ? 'Custom Image' : 'Default'}
        </span>
      </div>

      <!-- Preview Image Frame -->
      <div class="preview-img-container" style="
        position: relative; width: 100%; height: 190px; background: #1a1a1a; overflow: hidden;
      ">
        <img 
          src="${item.currentUrl}" 
          alt="${item.title}" 
          id="preview-img-${item.id}"
          style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease;"
          onerror="this.src='https://via.placeholder.com/800x450?text=Invalid+Image+URL';"
        />

        <!-- Overlay Badge for Dimensions -->
        <div style="
          position: absolute; bottom: 10px; right: 10px;
          background: rgba(0,0,0,0.75); backdrop-filter: blur(8px);
          color: #ffffff; font-size: 0.78rem; font-weight: 600; padding: 4px 10px;
          border-radius: 6px; display: flex; align-items: center; gap: 6px;
        ">
          <i class="ri-aspect-ratio-line" style="color: #ff9f1c;"></i>
          <span>${item.recommendedWidth} × ${item.recommendedHeight} px (${item.aspectRatio})</span>
        </div>
      </div>

      <!-- Specifications Box (Required Info of Size / Pixels) -->
      <div style="padding: 14px 20px; background: #fdfbf7; border-bottom: 1px solid rgba(0,0,0,0.05);">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.82rem;">
          <div>
            <span style="color: #777; display: block; font-size: 0.72rem; text-transform: uppercase;">Pixel Size</span>
            <strong style="color: #222; font-weight: 700;">${item.recommendedWidth} × ${item.recommendedHeight} px</strong>
          </div>
          <div>
            <span style="color: #777; display: block; font-size: 0.72rem; text-transform: uppercase;">Aspect Ratio</span>
            <strong style="color: #222; font-weight: 700;">${item.aspectRatio}</strong>
          </div>
          <div>
            <span style="color: #777; display: block; font-size: 0.72rem; text-transform: uppercase;">Format</span>
            <strong style="color: #222; font-weight: 600;">${item.format}</strong>
          </div>
          <div>
            <span style="color: #777; display: block; font-size: 0.72rem; text-transform: uppercase;">Max File Size</span>
            <strong style="color: #222; font-weight: 600;">${item.maxSize}</strong>
          </div>
        </div>
        <p style="font-size: 0.8rem; color: #666; margin-top: 10px; margin-bottom: 0; line-height: 1.4;">
          ${item.description}
        </p>
      </div>

      <!-- Controls Form Area -->
      <div style="padding: 16px 20px; display: flex; flex-direction: column; gap: 12px; margin-top: auto;">
        
        <!-- URL Input -->
        <div>
          <label style="font-size: 0.78rem; font-weight: 700; color: #444; margin-bottom: 4px; display: block;">
            Image URL
          </label>
          <input 
            type="url" 
            id="input-url-${item.id}" 
            value="${item.currentUrl}" 
            placeholder="https://example.com/image.jpg"
            style="
              width: 100%; padding: 8px 12px; font-size: 0.85rem; border-radius: 8px;
              border: 1px solid #cbd5e0; background: #ffffff; outline: none; transition: border-color 0.2s;
            "
          />
        </div>

        <!-- File Upload Button & Action Controls -->
        <div style="display: flex; gap: 8px; align-items: center;">
          <!-- Custom File Input -->
          <label style="
            flex: 1; cursor: pointer; padding: 8px 12px; border-radius: 8px;
            background: #f7fafc; border: 1px dashed #cbd5e0; color: #4a5568;
            font-size: 0.82rem; font-weight: 600; display: inline-flex; align-items: center; justify-content: center; gap: 6px;
            transition: background 0.2s;
          " class="file-upload-label" title="Upload image file from your computer">
            <i class="ri-upload-cloud-2-line" style="font-size: 1.05rem; color: var(--color-orange, #eb5e28);"></i>
            <span>Upload File</span>
            <input type="file" id="file-input-${item.id}" accept="image/*" style="display: none;" class="site-img-file-input" data-id="${item.id}" />
          </label>

          <!-- Apply / Save Button -->
          <button 
            class="os-btn-primary save-img-btn" 
            data-id="${item.id}"
            style="padding: 8px 16px; font-size: 0.85rem; height: 36px;"
          >
            <i class="ri-save-line"></i> Save
          </button>

          <!-- Reset Button -->
          ${item.isCustom ? `
            <button 
              class="reset-img-btn" 
              data-id="${item.id}"
              title="Reset to default image"
              style="
                width: 36px; height: 36px; border-radius: 8px; border: 1px solid #e2e8f0;
                background: #ffffff; color: #e53e3e; display: flex; align-items: center; justify-content: center;
                cursor: pointer; transition: all 0.2s;
              "
            >
              <i class="ri-refresh-line"></i>
            </button>
          ` : ''}
        </div>

      </div>
    </div>
  `;
}

export function initWebsiteImagesListeners() {
  // Combined Filter Function
  const searchInput = document.getElementById('img-search-input');
  const categoryDropdown = document.getElementById('img-category-dropdown');

  function applyFilters() {
    const query = (searchInput?.value || '').toLowerCase().trim();
    const activeCategory = categoryDropdown?.value || 'all';
    const cards = document.querySelectorAll('.site-img-card');

    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      const cardCategory = card.dataset.category;
      
      const matchesSearch = query === '' || text.includes(query);
      const matchesCategory = activeCategory === 'all' || cardCategory === activeCategory;

      if (matchesSearch && matchesCategory) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  // 1. Search Filter Listener
  searchInput?.addEventListener('input', applyFilters);

  // 2. Category Dropdown Listener
  categoryDropdown?.addEventListener('change', applyFilters);

  // 3. File Input Change Handler (Converts File to Data URL)
  document.querySelectorAll('.site-img-file-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      const id = input.dataset.id;
      if (!file || !id) return;

      if (file.size > 5 * 1024 * 1024) {
        showToast('Image file size exceeds 5MB limit. Please upload a smaller image.', 'ri-error-warning-line');
        return;
      }

      const reader = new FileReader();
      reader.onload = function(evt) {
        const dataUrl = evt.target.result;
        const urlInput = document.getElementById(`input-url-${id}`);
        const previewImg = document.getElementById(`preview-img-${id}`);

        if (urlInput) urlInput.value = dataUrl;
        if (previewImg) previewImg.src = dataUrl;

        showToast(`Image loaded from file. Click 'Save' to apply changes.`, 'ri-check-line');
      };
      reader.readAsDataURL(file);
    });
  });

  // 4. Save Image Buttons
  document.querySelectorAll('.save-img-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const urlInput = document.getElementById(`input-url-${id}`);
      if (!id || !urlInput) return;

      const newUrl = urlInput.value.trim();
      if (!newUrl) {
        showToast('Please provide a valid image URL or upload a file.', 'ri-alert-line');
        return;
      }

      const success = updateSiteImage(id, newUrl);
      if (success) {
        showToast('Website image updated successfully!', 'ri-checkbox-circle-fill');
        // Re-render view to refresh state & custom badge
        const contentArea = document.getElementById('os-content');
        if (contentArea) {
          contentArea.innerHTML = renderWebsiteImagesView();
          initWebsiteImagesListeners();
        }
      }
    });
  });

  // 5. Reset Image Buttons
  document.querySelectorAll('.reset-img-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      if (!id) return;

      const success = resetSiteImage(id);
      if (success) {
        showToast('Image restored to default!', 'ri-refresh-line');
        const contentArea = document.getElementById('os-content');
        if (contentArea) {
          contentArea.innerHTML = renderWebsiteImagesView();
          initWebsiteImagesListeners();
        }
      }
    });
  });

  // 6. Reset All Images Button
  document.getElementById('reset-all-site-images-btn')?.addEventListener('click', () => {
    showConfirmModal({
      title: 'Reset All Website Images',
      message: 'Are you sure you want to reset <strong>ALL custom website images</strong> back to factory defaults? Any custom uploaded banners will be replaced.',
      confirmText: 'Reset Defaults',
      cancelText: 'Keep Current',
      confirmIcon: 'ri-refresh-line',
      isDanger: true,
      onConfirm: () => {
        resetAllSiteImages();
        showToast('All website images restored to factory defaults.', 'ri-refresh-line');
        const contentArea = document.getElementById('os-content');
        if (contentArea) {
          contentArea.innerHTML = renderWebsiteImagesView();
          initWebsiteImagesListeners();
        }
      }
    });
  });
}

function showToast(msg, icon = 'ri-notification-line') {
  let toastContainer = document.getElementById('os-toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'os-toast-container';
    toastContainer.style.cssText = `
      position: fixed; bottom: 24px; right: 24px; z-index: 9999;
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
