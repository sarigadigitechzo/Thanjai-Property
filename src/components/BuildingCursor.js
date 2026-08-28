// BuildingCursor.js - Luxury Architectural Building Animated Cursor for Public Website

export function initBuildingCursor() {
  // Only enable on desktop / pointer-accurate devices
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
    return;
  }

  // Prevent duplicate injection
  if (document.getElementById('thanjai-cursor-dot')) {
    return;
  }

  // Inject Styles for Custom Building Cursor
  const styleEl = document.createElement('style');
  styleEl.id = 'thanjai-building-cursor-styles';
  styleEl.textContent = `
    /* Luxury Architectural Building Cursor */
    #thanjai-cursor-dot {
      position: fixed;
      top: 0;
      left: 0;
      width: 7px;
      height: 7px;
      background: #eb5e28;
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999999;
      transform: translate(-50%, -50%);
      transition: transform 0.08s ease, opacity 0.2s ease, width 0.2s ease, height 0.2s ease;
      box-shadow: 0 0 10px rgba(235, 94, 40, 0.7);
      opacity: 0;
    }

    #thanjai-cursor-building {
      position: fixed;
      top: 0;
      left: 0;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.88);
      border: 1.5px solid rgba(235, 94, 40, 0.55);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      pointer-events: none;
      z-index: 9999998;
      transform: translate(-50%, -50%);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 18px rgba(235, 94, 40, 0.22), inset 0 0 8px rgba(235, 94, 40, 0.08);
      transition: width 0.25s cubic-bezier(0.16, 1, 0.3, 1), 
                  height 0.25s cubic-bezier(0.16, 1, 0.3, 1), 
                  background 0.25s ease, 
                  border-color 0.25s ease,
                  box-shadow 0.25s ease,
                  opacity 0.25s ease;
      opacity: 0;
    }

    #thanjai-cursor-building svg {
      width: 20px;
      height: 20px;
      fill: #eb5e28;
      transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), fill 0.2s ease;
      filter: drop-shadow(0 1px 2px rgba(235, 94, 40, 0.3));
    }

    /* Hover on Interactive Elements */
    body.cursor-hover #thanjai-cursor-dot {
      width: 0;
      height: 0;
      opacity: 0;
    }

    body.cursor-hover #thanjai-cursor-building {
      width: 52px;
      height: 52px;
      background: rgba(235, 94, 40, 0.92);
      border-color: #eb5e28;
      box-shadow: 0 8px 24px rgba(235, 94, 40, 0.45);
      transform: translate(-50%, -50%) rotate(-4deg);
    }

    body.cursor-hover #thanjai-cursor-building svg {
      fill: #ffffff;
      transform: scale(1.2);
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
    }

    /* Mouse Down Active Click */
    body.cursor-active #thanjai-cursor-building {
      width: 32px;
      height: 32px;
      transform: translate(-50%, -50%) scale(0.85);
      background: #eb5e28;
      box-shadow: 0 2px 10px rgba(235, 94, 40, 0.6);
    }

    body.cursor-active #thanjai-cursor-building svg {
      fill: #ffffff;
      transform: scale(0.9);
    }

    /* Luxury Spark Particles */
    .thanjai-spark {
      position: fixed;
      pointer-events: none;
      z-index: 9999996;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: sparkDisperse var(--duration, 0.65s) cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .thanjai-spark-star {
      position: fixed;
      pointer-events: none;
      z-index: 9999996;
      transform: translate(-50%, -50%);
      animation: starSpark var(--duration, 0.75s) cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes sparkDisperse {
      0% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1) translate(0, 0);
      }
      100% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.1) translate(var(--tx, 0px), var(--ty, 0px));
      }
    }

    @keyframes starSpark {
      0% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(0.4) rotate(0deg) translate(0, 0);
      }
      50% {
        opacity: 0.9;
        transform: translate(-50%, -50%) scale(1.1) rotate(60deg) translate(calc(var(--tx, 0px) * 0.5), calc(var(--ty, 0px) * 0.5));
      }
      100% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0) rotate(140deg) translate(var(--tx, 0px), var(--ty, 0px));
      }
    }

    /* Hide on touch/mobile */
    @media (hover: none) and (pointer: coarse) {
      #thanjai-cursor-dot,
      #thanjai-cursor-building,
      .thanjai-spark,
      .thanjai-spark-star {
        display: none !important;
      }
    }
  `;
  document.head.appendChild(styleEl);

  // Create Cursor Elements
  const dot = document.createElement('div');
  dot.id = 'thanjai-cursor-dot';

  const building = document.createElement('div');
  building.id = 'thanjai-cursor-building';
  // Architectural Building SVG
  building.innerHTML = `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 7v15h20V7L12 2zm0 2.24L19.5 8H4.5L12 4.24zM4 10h3v3H4v-3zm0 5h3v3H4v-3zm5-5h3v3H9v-3zm0 5h3v3H9v-3zm5-5h3v3h-3v-3zm0 5h3v3h-3v-3zm5-5h2v8h-2v-8zM4 20h16v1H4v-1z"/>
    </svg>
  `;

  document.body.appendChild(dot);
  document.body.appendChild(building);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let followerX = mouseX;
  let followerY = mouseY;
  let isVisible = false;
  let lastSparkTime = 0;
  let lastSparkX = mouseX;
  let lastSparkY = mouseY;

  // Spark Colors: Luxury Orange, Golden Amber, Warm White
  const sparkColors = ['#eb5e28', '#f59e0b', '#fbbf24', '#ffedd5', '#f97316'];

  // Spawn a Spark Particle
  const createSpark = (x, y, isBurst = false) => {
    const spark = document.createElement('div');
    const isStar = Math.random() > 0.45;
    const color = sparkColors[Math.floor(Math.random() * sparkColors.length)];
    const duration = isBurst ? (0.55 + Math.random() * 0.3) : (0.45 + Math.random() * 0.3);

    const angle = Math.random() * Math.PI * 2;
    const distance = isBurst ? (20 + Math.random() * 45) : (10 + Math.random() * 25);
    const tx = `${Math.cos(angle) * distance}px`;
    const ty = `${Math.sin(angle) * distance}px`;

    if (isStar) {
      spark.className = 'thanjai-spark-star';
      spark.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="${color}">
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"/>
        </svg>
      `;
    } else {
      spark.className = 'thanjai-spark';
      const size = 3 + Math.floor(Math.random() * 4);
      spark.style.width = `${size}px`;
      spark.style.height = `${size}px`;
      spark.style.background = color;
      spark.style.boxShadow = `0 0 6px ${color}`;
    }

    spark.style.left = `${x}px`;
    spark.style.top = `${y}px`;
    spark.style.setProperty('--tx', tx);
    spark.style.setProperty('--ty', ty);
    spark.style.setProperty('--duration', `${duration}s`);

    document.body.appendChild(spark);

    setTimeout(() => {
      spark.remove();
    }, duration * 1000 + 50);
  };

  // Spark burst effect on click
  const createSparkBurst = (x, y) => {
    const count = 7 + Math.floor(Math.random() * 4);
    for (let i = 0; i < count; i++) {
      createSpark(x, y, true);
    }
  };

  // Track Mouse Movement
  const onMouseMove = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;

    if (!isVisible) {
      isVisible = true;
      dot.style.opacity = '1';
      building.style.opacity = '1';
    }

    // Spark generation throttled by distance & time
    const now = performance.now();
    const dist = Math.hypot(mouseX - lastSparkX, mouseY - lastSparkY);
    if (dist > 16 && (now - lastSparkTime > 35)) {
      createSpark(mouseX + (Math.random() * 6 - 3), mouseY + (Math.random() * 6 - 3));
      lastSparkTime = now;
      lastSparkX = mouseX;
      lastSparkY = mouseY;
    }
  };

  window.addEventListener('mousemove', onMouseMove, { passive: true });

  // Smooth Follower Lerp Animation Loop
  const renderCursor = () => {
    followerX += (mouseX - followerX) * 0.2;
    followerY += (mouseY - followerY) * 0.2;

    building.style.left = `${followerX.toFixed(2)}px`;
    building.style.top = `${followerY.toFixed(2)}px`;

    requestAnimationFrame(renderCursor);
  };
  requestAnimationFrame(renderCursor);

  // Mouse Down / Up Active state + Spark Burst
  window.addEventListener('mousedown', (e) => {
    document.body.classList.add('cursor-active');
    createSparkBurst(e.clientX, e.clientY);
  });

  window.addEventListener('mouseup', () => {
    document.body.classList.remove('cursor-active');
  });

  // Handle Window Leave / Enter
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    building.style.opacity = '0';
    isVisible = false;
  });

  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    building.style.opacity = '1';
    isVisible = true;
  });

  // Hover detection on interactive elements using event delegation
  const interactiveSelectors = 'a, button, input, select, textarea, [role="button"], .prop-card, .category-card, .btn, .view-btn, .fav-btn, .clickable';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelectors)) {
      document.body.classList.add('cursor-hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelectors)) {
      document.body.classList.remove('cursor-hover');
    }
  });
}
