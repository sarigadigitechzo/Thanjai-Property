export function renderSiteVisitsView() {
  return `
    <div class="view-enter">
      <div class="view-header-flex">
        <div>
          <h1 class="view-title">Site Visits Planner</h1>
          <p class="view-subtitle">Coordinate property tours and client meetings.</p>
        </div>
        <div class="header-actions-right">
          <button class="os-btn-primary"><i class="ri-add-line"></i> Schedule Visit</button>
        </div>
      </div>

      <div class="visits-layout">
        <!-- Calendar Side -->
        <div class="calendar-side">
          <div class="cal-card">
            <div class="cal-header">
              <button class="cal-nav"><i class="ri-arrow-left-s-line"></i></button>
              <div class="cal-month">August 2026</div>
              <button class="cal-nav"><i class="ri-arrow-right-s-line"></i></button>
            </div>
            <div class="cal-grid">
              <div class="cal-day-name">Su</div><div class="cal-day-name">Mo</div><div class="cal-day-name">Tu</div>
              <div class="cal-day-name">We</div><div class="cal-day-name">Th</div><div class="cal-day-name">Fr</div><div class="cal-day-name">Sa</div>
              
              <div class="cal-day muted">26</div><div class="cal-day muted">27</div><div class="cal-day muted">28</div>
              <div class="cal-day muted">29</div><div class="cal-day muted">30</div><div class="cal-day muted">31</div>
              <div class="cal-day">1</div><div class="cal-day">2</div><div class="cal-day">3</div><div class="cal-day">4</div>
              <div class="cal-day">5</div><div class="cal-day">6</div><div class="cal-day">7</div><div class="cal-day">8</div>
              <div class="cal-day">9</div><div class="cal-day">10</div><div class="cal-day">11</div><div class="cal-day">12</div>
              <div class="cal-day">13</div><div class="cal-day active">14</div><div class="cal-day has-event">15</div><div class="cal-day">16</div>
              <div class="cal-day">17</div><div class="cal-day">18</div><div class="cal-day has-event">19</div><div class="cal-day">20</div>
            </div>
          </div>
        </div>

        <!-- Agenda Side -->
        <div class="agenda-side">
          <h2 class="agenda-title">Today's Visits <span>14 Aug</span></h2>
          
          <div class="visit-card hover-lift">
            <div class="v-time">
              <div class="v-hour">10:00</div>
              <div class="v-ampm">AM</div>
            </div>
            <div class="v-details">
              <div class="v-client">
                <img src="https://ui-avatars.com/api/?name=Ravi+Kumar&background=random" class="v-avatar" />
                <div>
                  <div class="v-name">Ravi Kumar</div>
                  <div class="v-phone">+91 98765 43210</div>
                </div>
              </div>
              <div class="v-prop">
                <i class="ri-building-4-line"></i> Premium Villa, Anna Nagar
              </div>
            </div>
            <div class="v-actions">
              <button class="v-btn whatsapp"><i class="ri-whatsapp-line"></i> Message</button>
              <button class="v-btn map"><i class="ri-map-pin-line"></i> Directions</button>
            </div>
          </div>

          <div class="visit-card hover-lift">
            <div class="v-time">
              <div class="v-hour">02:30</div>
              <div class="v-ampm">PM</div>
            </div>
            <div class="v-details">
              <div class="v-client">
                <img src="https://ui-avatars.com/api/?name=Priya+Sharma&background=random" class="v-avatar" />
                <div>
                  <div class="v-name">Priya Sharma</div>
                  <div class="v-phone">+91 87654 32109</div>
                </div>
              </div>
              <div class="v-prop">
                <i class="ri-store-2-line"></i> Commercial Space, T. Nagar
              </div>
            </div>
            <div class="v-actions">
              <button class="v-btn whatsapp"><i class="ri-whatsapp-line"></i> Message</button>
              <button class="v-btn map"><i class="ri-map-pin-line"></i> Directions</button>
            </div>
          </div>

          <h2 class="agenda-title" style="margin-top: 32px;">Upcoming <span>15 Aug</span></h2>
          
          <div class="visit-card hover-lift" style="opacity: 0.8;">
            <div class="v-time">
              <div class="v-hour">11:00</div>
              <div class="v-ampm">AM</div>
            </div>
            <div class="v-details">
              <div class="v-client">
                <img src="https://ui-avatars.com/api/?name=Karthik+VG&background=random" class="v-avatar" />
                <div>
                  <div class="v-name">Karthik V G</div>
                  <div class="v-phone">8015****59</div>
                </div>
              </div>
              <div class="v-prop">
                <i class="ri-landscape-line"></i> Plot, Madurai
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `;
}
