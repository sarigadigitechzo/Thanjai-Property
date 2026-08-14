export function renderPropertiesView() {
  return `
    <div class="view-enter">
      <div class="view-header-flex">
        <div>
          <h1 class="view-title">Properties Inventory</h1>
          <p class="view-subtitle">Manage your luxury real estate portfolio.</p>
        </div>
        <div class="header-actions-right">
          <div class="view-toggle">
            <button class="active"><i class="ri-grid-fill"></i></button>
            <button><i class="ri-list-check"></i></button>
            <button><i class="ri-map-2-line"></i></button>
          </div>
          <button class="os-btn-primary"><i class="ri-add-line"></i> Add Property</button>
        </div>
      </div>

      <!-- Filters -->
      <div class="os-filter-bar">
        <div class="search-box">
          <i class="ri-search-line"></i>
          <input type="text" placeholder="Search by title, location, ID..." />
        </div>
        <div class="filter-dropdowns">
          <select><option>All Types</option></select>
          <select><option>Status</option></select>
          <select><option>Price Range</option></select>
        </div>
      </div>

      <!-- Luxury Grid -->
      <div class="luxury-property-grid">
        
        <!-- Card 1 -->
        <div class="lux-prop-card hover-lift">
          <div class="lux-prop-img" style="background-image: url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80');">
            <div class="lux-prop-tags">
              <span class="status-tag available">Available</span>
              <span class="type-tag"><i class="ri-building-4-line"></i> Villa</span>
            </div>
            <button class="fav-btn"><i class="ri-heart-line"></i></button>
          </div>
          <div class="lux-prop-content">
            <div class="lux-prop-price">₹4.5 Cr</div>
            <h3 class="lux-prop-title">Premium Villa in Anna Nagar</h3>
            <p class="lux-prop-location"><i class="ri-map-pin-line"></i> Anna Nagar, Chennai</p>
            
            <div class="lux-prop-features">
              <div class="feature"><i class="ri-hotel-bed-line"></i> 4 Beds</div>
              <div class="feature"><i class="ri-showers-line"></i> 4 Baths</div>
              <div class="feature"><i class="ri-layout-masonry-line"></i> 3,200 sqft</div>
            </div>
            
            <div class="lux-prop-footer">
              <div class="agent-info">
                <img src="https://ui-avatars.com/api/?name=Arun+Prakash&background=random" />
                <span>Listed by Arun</span>
              </div>
              <button class="share-btn"><i class="ri-share-forward-line"></i></button>
            </div>
          </div>
        </div>

        <!-- Card 2 -->
        <div class="lux-prop-card hover-lift">
          <div class="lux-prop-img" style="background-image: url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80');">
            <div class="lux-prop-tags">
              <span class="status-tag booked">Booked</span>
              <span class="type-tag"><i class="ri-landscape-line"></i> Plot</span>
            </div>
            <button class="fav-btn"><i class="ri-heart-line"></i></button>
          </div>
          <div class="lux-prop-content">
            <div class="lux-prop-price">₹60 L</div>
            <h3 class="lux-prop-title">Plot for sale in Nanjikottai</h3>
            <p class="lux-prop-location"><i class="ri-map-pin-line"></i> Nanjikottai Road, Thanjavur</p>
            
            <div class="lux-prop-features">
              <div class="feature"><i class="ri-layout-masonry-line"></i> 2,400 sqft</div>
              <div class="feature"><i class="ri-road-map-line"></i> North Facing</div>
            </div>
            
            <div class="lux-prop-footer">
              <div class="agent-info">
                <img src="https://ui-avatars.com/api/?name=Kavitha+Murugan&background=random" />
                <span>Listed by Kavitha</span>
              </div>
              <button class="share-btn"><i class="ri-share-forward-line"></i></button>
            </div>
          </div>
        </div>

        <!-- Card 3 -->
        <div class="lux-prop-card hover-lift">
          <div class="lux-prop-img" style="background-image: url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80');">
            <div class="lux-prop-tags">
              <span class="status-tag available">Available</span>
              <span class="type-tag"><i class="ri-store-2-line"></i> Commercial</span>
            </div>
            <button class="fav-btn"><i class="ri-heart-line"></i></button>
          </div>
          <div class="lux-prop-content">
            <div class="lux-prop-price">₹1.8 L <span class="rent-label">/ month</span></div>
            <h3 class="lux-prop-title">Commercial Office Space</h3>
            <p class="lux-prop-location"><i class="ri-map-pin-line"></i> T. Nagar, Chennai</p>
            
            <div class="lux-prop-features">
              <div class="feature"><i class="ri-layout-masonry-line"></i> 1,500 sqft</div>
              <div class="feature"><i class="ri-car-line"></i> 2 Parking</div>
            </div>
            
            <div class="lux-prop-footer">
              <div class="agent-info">
                <img src="https://ui-avatars.com/api/?name=Arun+Prakash&background=random" />
                <span>Listed by Arun</span>
              </div>
              <button class="share-btn"><i class="ri-share-forward-line"></i></button>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
}
