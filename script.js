// script.js — Animation selection, controls, preview, and Flutter JSON export

document.addEventListener('DOMContentLoaded', () => {

  // ── DOM refs ──────────────────────────────────────────────────────────────
  const sidebarItems  = document.querySelectorAll('.sb-item');
  const searchInput = document.getElementById('searchInput');

  // Filter sidebar items based on search query
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    sidebarItems.forEach(item => {
      const name = item.dataset.name.toLowerCase();
      // Split the name into words and check if any word starts with the query
      const words = name.split(/\s+/);
      const matches = query === '' || words.some(word => word.startsWith(query));
      item.style.display = matches ? 'flex' : 'none';
    });
  });
  const stageEmpty    = document.getElementById('stageEmpty');
  const stageScene    = document.getElementById('stageScene');
  const stageAnimName = document.getElementById('stageAnimName');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const deviceToggleBtn = document.getElementById('deviceToggleBtn');
  const previewStage    = document.getElementById('previewStage');

  // Theme Logic
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
  }

  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const theme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
  });

  // Mobile Layout Toggle Logic
  deviceToggleBtn.addEventListener('click', () => {
    document.querySelector('.app').classList.toggle('mobile-active');
    deviceToggleBtn.classList.toggle('active');
  });

  // Controls
  const durationSlider  = document.getElementById('durationSlider');
  const durationVal     = document.getElementById('durationVal');
  const delaySlider     = document.getElementById('delaySlider');
  const delayVal        = document.getElementById('delayVal');
  const iterVal         = document.getElementById('iterVal');
  const iterMinus       = document.getElementById('iterMinus');
  const iterPlus        = document.getElementById('iterPlus');
  const infiniteToggle  = document.getElementById('infiniteToggle');
  const easingSelect    = document.getElementById('easingSelect');
  const directionSelect = document.getElementById('directionSelect');
  const fillSelect      = document.getElementById('fillSelect');
  const replayBtn       = document.getElementById('replayBtn');

  // Export
  const jsonPreview  = document.getElementById('jsonPreview');
  const copyBtn      = document.getElementById('copyBtn');
  const downloadBtn  = document.getElementById('downloadBtn');
  const copyToast    = document.getElementById('copyToast');

  // ── State ─────────────────────────────────────────────────────────────────
  let currentAnimation = null;
  let iterations = 1;

  // ── Easing → Flutter curve map ────────────────────────────────────────────
  const easingToFlutter = {
    'linear':                       'Curves.linear',
    'ease':                         'Curves.ease',
    'ease-in':                      'Curves.easeIn',
    'ease-out':                     'Curves.easeOut',
    'ease-in-out':                  'Curves.easeInOut',
    'cubic-bezier(0.22,1,0.36,1)':  'Curves.easeOutExpo',
    'cubic-bezier(0.34,1.56,0.64,1)': 'Curves.elasticOut',
    'cubic-bezier(0.4,0,0.2,1)':    'Curves.fastOutSlowIn',
  };

  // ── Animation keyframes map (for JSON export) ─────────────────────────────
  const animationKeyframes = {
    'Slide Up': [
      { offset: 0,   transform: 'translateY(120px)', opacity: 0 },
      { offset: 1,   transform: 'translateY(0)',   opacity: 1 },
    ],
    'Slide Down': [
      { offset: 0,   transform: 'translateY(-120px)', opacity: 0 },
      { offset: 1,   transform: 'translateY(0)',    opacity: 1 },
    ],
    'Spin': [
      { offset: 0,   transform: 'rotate(0deg)' },
      { offset: 1,   transform: 'rotate(360deg)' },
    ],
    'Card Flip': [
      { offset: 0,   transform: 'rotateY(0deg)' },
      { offset: 0.5, transform: 'rotateY(90deg)', opacity: 0.4 },
      { offset: 1,   transform: 'rotateY(0deg)' },
    ],
    'Wobble': [
      { offset: 0,    transform: 'translateX(0)' },
      { offset: 0.15, transform: 'translateX(-14px) rotate(-4deg)' },
      { offset: 0.30, transform: 'translateX(12px) rotate(3deg)' },
      { offset: 0.45, transform: 'translateX(-9px) rotate(-2.5deg)' },
      { offset: 0.60, transform: 'translateX(7px) rotate(1.5deg)' },
      { offset: 0.75, transform: 'translateX(-4px) rotate(-1deg)' },
      { offset: 1,    transform: 'translateX(0)' },
    ],
    'Sidebar Collapse': [
      { offset: 0,   transform: 'scaleX(1)', opacity: 1 },
      { offset: 1,   transform: 'scaleX(0)', opacity: 0 },
    ],
    'Navigation Bar Slide': [
      { offset: 0,   transform: 'translateX(-100%)', opacity: 0 },
      { offset: 1,   transform: 'translateX(0)',      opacity: 1 },
    ],
    'Menu Reveal': [
      { offset: 0,   transform: 'scale(0.88) translateY(-10px)', opacity: 0 },
      { offset: 1,   transform: 'scale(1) translateY(0)',         opacity: 1 },
    ],
    'Image Reveal': [
      { offset: 0,   transform: 'scale(1.08)', opacity: 0, filter: 'blur(16px)' },
      { offset: 1,   transform: 'scale(1)',    opacity: 1, filter: 'blur(0px)' },
    ],
    'Text Reveal': [
      { offset: 0,   transform: 'translateY(24px)', opacity: 0, letterSpacing: '10px' },
      { offset: 1,   transform: 'translateY(0)',    opacity: 1, letterSpacing: 'normal' },
    ],
    'Card Pop': [
      { offset: 0,    transform: 'scale(0.4)', opacity: 0 },
      { offset: 0.65, transform: 'scale(1.1)', opacity: 1 },
      { offset: 1,    transform: 'scale(1)',   opacity: 1 },
    ],
    'Fade In': [
      { offset: 0,   opacity: 0 },
      { offset: 1,   opacity: 1 },
    ],
    'Bounce': [
      { offset: 0,    transform: 'translateY(0)' },
      { offset: 0.5,  transform: 'translateY(-40px)' },
      { offset: 1,    transform: 'translateY(0)' },
    ],
    'Pulse': [
      { offset: 0,    transform: 'scale(1)' },
      { offset: 0.5,  transform: 'scale(1.12)' },
      { offset: 1,    transform: 'scale(1)' },
    ],
    'Shake': [
      { offset: 0,   transform: 'translateX(0)' },
      { offset: 0.1, transform: 'translateX(-8px)' },
      { offset: 0.2, transform: 'translateX(8px)' },
      { offset: 0.3, transform: 'translateX(-8px)' },
      { offset: 0.4, transform: 'translateX(8px)' },
      { offset: 0.5, transform: 'translateX(-8px)' },
      { offset: 0.6, transform: 'translateX(8px)' },
      { offset: 0.7, transform: 'translateX(-8px)' },
      { offset: 0.8, transform: 'translateX(8px)' },
      { offset: 0.9, transform: 'translateX(-8px)' },
      { offset: 1,   transform: 'translateX(0)' },
    ],
    'Shimmer': [
      { offset: 0, backgroundPosition: '-200% 0' },
      { offset: 1, backgroundPosition: '200% 0' },
    ],
    'Glitch': [
      { offset: 0, transform: 'translate(0, 0) skew(0deg)' },
      { offset: 0.2, transform: 'translate(-2px, 2px) skew(-1deg)' },
      { offset: 0.4, transform: 'translate(-2px, -2px) skew(1deg)' },
      { offset: 0.6, transform: 'translate(2px, 2px) skew(0deg)' },
      { offset: 0.8, transform: 'translate(2px, -2px) skew(2deg)' },
      { offset: 1, transform: 'translate(0, 0) skew(0deg)' },
    ],
    'Liquid Float': [
      { offset: 0, transform: 'translateY(0) scale(1) rotate(0deg)' },
      { offset: 0.33, transform: 'translateY(-15px) scale(1.05) rotate(2deg)' },
      { offset: 0.66, transform: 'translateY(5px) scale(0.95) rotate(-2deg)' },
      { offset: 1, transform: 'translateY(0) scale(1) rotate(0deg)' },
    ],
    '3D Tilt': [
      { offset: 0, transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)' },
      { offset: 0.25, transform: 'perspective(1000px) rotateX(10deg) rotateY(-10deg) translateZ(10px)' },
      { offset: 0.5, transform: 'perspective(1000px) rotateX(-10deg) rotateY(10deg) translateZ(15px)' },
      { offset: 0.75, transform: 'perspective(1000px) rotateX(5deg) rotateY(5deg) translateZ(5px)' },
      { offset: 1, transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)' },
    ],
    'Staggered Wave': [
      { offset: 0, transform: 'translateY(0)' },
      { offset: 0.5, transform: 'translateY(-20px)' },
      { offset: 1, transform: 'translateY(0)' },
    ],
    'Neon Glow': [
      { offset: 0, boxShadow: '0 0 5px #ff007f, 0 0 10px #ff007f, 0 0 20px #ff00ff' },
      { offset: 0.5, boxShadow: '0 0 20px #ff007f, 0 0 40px #ff007f, 0 0 60px #ff00ff' },
      { offset: 1, boxShadow: '0 0 5px #ff007f, 0 0 10px #ff007f, 0 0 20px #ff00ff' },
    ],
    'Elastic Slide': [
      { offset: 0, transform: 'translateX(-150%)', opacity: 0 },
      { offset: 0.6, transform: 'translateX(15%)', opacity: 1 },
      { offset: 0.8, transform: 'translateX(-5%)' },
      { offset: 1, transform: 'translateX(0)' },
    ],
    'Reveal Zoom': [
      { offset: 0, transform: 'scale(0.3)', opacity: 0, filter: 'blur(10px)' },
      { offset: 0.7, transform: 'scale(1.05)', opacity: 0.9, filter: 'blur(0px)' },
      { offset: 1, transform: 'scale(1)', opacity: 1 },
    ],
    'Like Burst': [
      { offset: 0, transform: 'scale(1)' },
      { offset: 0.15, transform: 'scale(1.4)' },
      { offset: 0.3, transform: 'scale(0.8)' },
      { offset: 0.45, transform: 'scale(1.2)' },
      { offset: 0.6, transform: 'scale(0.95)' },
      { offset: 1, transform: 'scale(1)' },
    ],
    'Fly to Wishlist': [
      { offset: 0, transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { offset: 0.5, transform: 'translate(12px, -25px) scale(0.7)', opacity: 0.9 },
      { offset: 1, transform: 'translate(25px, -55px) scale(0.2)', opacity: 0 },
    ],
  };

  // ── Unique HTML templates for each animation ─────────────────────────────
  const sceneTemplates = {
    'Slide Up': `
      <div class="anim-target glass-card">
        <div class="card-icon-circle bg-purple">⬆️</div>
        <div class="card-content">
          <h4>Asset Uploaded</h4>
          <p>Processing and optimizing file...</p>
        </div>
      </div>
    `,
    'Slide Down': `
      <div class="anim-target glass-card slide-banner">
        <div class="banner-status-dot"></div>
        <span>Success: Syncing database backup</span>
      </div>
    `,
    'Spin': `
      <div class="anim-target loader-spin-wrap">
        <div class="spinner-ring"></div>
        <div class="spinner-core">✦</div>
      </div>
    `,
    'Card Flip': `
      <div class="anim-target card-flip-wrapper">
        <div class="flip-card-front bg-credit">
          <div class="card-header-logo">✦ PLATINUM</div>
          <div class="card-chip"></div>
          <div class="card-num">•••• •••• •••• 9850</div>
        </div>
      </div>
    `,
    'Wobble': `
      <div class="anim-target alert-wobble">
        <div class="alert-icon">⚠️</div>
        <div class="alert-info">
          <h4>Connection Error</h4>
          <p>Server node unreachable</p>
        </div>
      </div>
    `,
    'Sidebar Collapse': `
      <div class="anim-target collapse-mockup">
        <div class="mockup-sidebar">
          <div class="mockup-item"></div>
          <div class="mockup-item"></div>
          <div class="mockup-item"></div>
        </div>
        <div class="mockup-main">
          <div class="mockup-bar"></div>
        </div>
      </div>
    `,
    'Navigation Bar Slide': `
      <div class="anim-target navbar-slide-mock">
        <div class="nav-mock-header">
          <span class="nav-mock-title">Main Navigation</span>
        </div>
        <div class="nav-mock-links">
          <div class="nav-mock-link active">Home Workspace</div>
          <div class="nav-mock-link">Activity Log</div>
          <div class="nav-mock-link">Team Billing</div>
        </div>
      </div>
    `,
    'Menu Reveal': `
      <div class="anim-target menu-reveal-mock">
        <div class="menu-item-row">Profile Settings</div>
        <div class="menu-item-row">Notifications</div>
        <div class="menu-item-row danger">Sign Out</div>
      </div>
    `,
    'Image Reveal': `
      <div class="anim-target image-reveal-wrapper">
        <div class="reveal-overlay"></div>
        <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop" alt="Abstract Reveal">
        <div class="image-reveal-tag">Abstract Art</div>
      </div>
    `,
    'Text Reveal': `
      <div class="anim-target text-reveal-wrapper">
        <h1 class="reveal-title font-gradient">BUILD BEAUTIFUL</h1>
        <h1 class="reveal-title subtitle">INTERFACES</h1>
      </div>
    `,
    'Card Pop': `
      <div class="anim-target pop-dialog">
        <div class="pop-check">✓</div>
        <h3>Project Ready</h3>
        <p>Your team project workspace has been created successfully.</p>
        <button class="pop-dismiss-btn">Enter Dashboard</button>
      </div>
    `,
    'Fade In': `
      <div class="anim-target fade-in-card">
        <div class="fade-pic"></div>
        <div class="fade-text-placeholder-1"></div>
        <div class="fade-text-placeholder-2"></div>
      </div>
    `,
    'Bounce': `
      <div class="anim-target bounce-group">
        <button class="bounce-btn">Claim Offer Now ⚡</button>
      </div>
    `,
    'Pulse': `
      <div class="anim-target pulse-wrapper">
        <div class="pulse-ring"></div>
        <div class="pulse-ring delay-1"></div>
        <div class="pulse-ring delay-2"></div>
        <div class="heart-icon">❤️</div>
      </div>
    `,
    'Shake': `
      <div class="anim-target shake-alert">
        <div class="shake-top-accent"></div>
        <div class="shake-body">
          <span class="shake-badge">ALERT</span>
          <h4>Critical disk limit reached!</h4>
        </div>
      </div>
    `,
    'Shimmer': `
      <div class="anim-target shimmer-card">
        <div class="shimmer-avatar shimmer-sweep"></div>
        <div class="shimmer-lines">
          <div class="shimmer-line shimmer-sweep l1"></div>
          <div class="shimmer-line shimmer-sweep l2"></div>
        </div>
      </div>
    `,
    'Glitch': `
      <div class="anim-target glitch-wrapper">
        <div class="glitch-text" data-text="CYBERPUNK">CYBERPUNK</div>
      </div>
    `,
    'Liquid Float': `
      <div class="anim-target liquid-container">
        <div class="liquid-bubble b1"></div>
        <div class="liquid-bubble b2"></div>
        <div class="liquid-bubble b3"></div>
        <span class="liquid-label">System Active</span>
      </div>
    `,
    '3D Tilt': `
      <div class="anim-target tilt-card bg-purple">
        <div class="tilt-glow"></div>
        <h4>Analytics Overview</h4>
        <div class="tilt-metric">94.8%</div>
        <p>Efficiency Rate</p>
      </div>
    `,
    'Staggered Wave': `
      <div class="anim-target wave-loader">
        <div class="wave-dot d1"></div>
        <div class="wave-dot d2"></div>
        <div class="wave-dot d3"></div>
        <div class="wave-dot d4"></div>
        <div class="wave-dot d5"></div>
      </div>
    `,
    'Neon Glow': `
      <div class="anim-target neon-button">
        <span>SECURE SYSTEM</span>
      </div>
    `,
    'Elastic Slide': `
      <div class="anim-target glass-card elastic-box">
        <div class="card-icon-circle bg-purple">🏹</div>
        <div class="card-content">
          <h4>Target Lock</h4>
          <p>Elastic alignment verified</p>
        </div>
      </div>
    `,
    'Reveal Zoom': `
      <div class="anim-target zoom-badge">
        <span class="badge-icon">✦</span>
        <span class="badge-title">NEW FEATURE</span>
      </div>
    `,
    'Like Burst': `
      <div class="anim-target mobile-card">
        <div class="card-love-btn liked">❤️</div>
        <div class="card-image bg-orange"></div>
        <div class="card-info-box">
          <h4>Wireless Headphones</h4>
          <p>$199.00</p>
        </div>
      </div>
    `,
    'Fly to Wishlist': `
      <div class="anim-target mobile-card">
        <div class="card-love-btn fly-icon">❤️</div>
        <div class="wishlist-bag-container">
          <span class="wishlist-icon">🛍️</span>
        </div>
        <div class="card-image bg-blue"></div>
        <div class="card-info-box">
          <h4>Leather Sneakers</h4>
          <p>$120.00</p>
        </div>
      </div>
    `
  };

  const toClass = (name) => 'anim-' + name.toLowerCase().replace(/\s+/g, '-');

  // ── Apply animation dynamics to injected target ───────────────────────────
  const applyAnimation = () => {
    if (!currentAnimation) return;

    // Load unique template
    stageScene.innerHTML = sceneTemplates[currentAnimation] || '';
    const animTarget = stageScene.querySelector('.anim-target');
    if (!animTarget) return;

    // Read control parameters
    const dur     = parseInt(durationSlider.value);
    const delay   = parseInt(delaySlider.value);
    const inf     = infiniteToggle.checked;
    const iter    = inf ? 'infinite' : iterations;
    const easing  = easingSelect.value;
    const dir     = directionSelect.value;
    const fill    = fillSelect.value;

    // Clear old inline anim properties to force reflow
    animTarget.style.animation = 'none';
    void animTarget.offsetWidth; // force reflow

    // Apply animation properties
    animTarget.style.animation = '';
    animTarget.classList.add(toClass(currentAnimation));
    animTarget.style.animationDuration       = `${dur}ms`;
    animTarget.style.animationDelay          = `${delay}ms`;
    animTarget.style.animationIterationCount = String(iter);
    animTarget.style.animationTimingFunction = easing;
    animTarget.style.animationDirection      = dir;
    animTarget.style.animationFillMode       = fill;

    updateJSON();
  };

  // ── Update JSON export preview ────────────────────────────────────────────
  const updateJSON = () => {
    if (!currentAnimation) {
      jsonPreview.textContent = '// Select an animation\n// to generate JSON';
      return;
    }

    const dur    = parseInt(durationSlider.value);
    const delay  = parseInt(delaySlider.value);
    const inf    = infiniteToggle.checked;
    const iter   = inf ? -1 : iterations;
    const easing = easingSelect.value;
    const dir    = directionSelect.value;
    const fill   = fillSelect.value;

    const json = {
      animation: {
        name: currentAnimation,
        flutterCurve: easingToFlutter[easing] ?? `Curves.linear /* custom */`,
        duration: `${dur}ms`,
        delay: `${delay}ms`,
        iterationCount: iter,
        direction: dir,
        fillMode: fill,
        keyframes: animationKeyframes[currentAnimation] ?? [],
        flutterHint: buildFlutterHint(currentAnimation, dur, delay, iter, easing, dir),
      }
    };

    const raw = JSON.stringify(json, null, 2);
    jsonPreview.innerHTML = syntaxHighlight(raw);
  };

  const buildFlutterHint = (name, dur, delay, iter, easing, dir) => {
    const curve   = easingToFlutter[easing] ?? 'Curves.linear';
    const repeat  = iter === -1 ? 'repeat: -1' : `repeat: ${iter}`;
    const reverse = dir === 'reverse' || dir === 'alternate-reverse' ? ', reverse: true' : '';
    return [
      `// Flutter usage`,
      `AnimationController(`,
      `  duration: Duration(milliseconds: ${dur}),`,
      `  vsync: this,`,
      `);`,
      `CurvedAnimation(parent: _ctrl, curve: ${curve});`,
      `// delay: Duration(milliseconds: ${delay})`,
      `// ${repeat}${reverse}`,
    ].join('\n');
  };

  const syntaxHighlight = (json) =>
    json
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        (match) => {
          let cls = 'num';
          if (/^"/.test(match)) {
            cls = /:$/.test(match) ? 'key' : 'str';
          } else if (/true|false/.test(match)) {
            cls = 'bool';
          } else if (/null/.test(match)) {
            cls = 'null';
          }
          return `<span class="${cls}">${match}</span>`;
        }
      );

  // ── Select animation ──────────────────────────────────────────────────────
  const selectAnimation = (name) => {
    currentAnimation = name;

    // Toggle Active State classes
    sidebarItems.forEach(item => {
      const isActive = item.dataset.name === name;
      item.classList.toggle('active', isActive);
      item.setAttribute('aria-pressed', String(isActive));
    });

    // Toggle Empty screen vs stage visibility
    stageEmpty.style.display = 'none';
    stageScene.style.display = 'flex';

    // Set animation title in Topbar
    stageAnimName.textContent = name;

    applyAnimation();
  };

  // ── Sidebar clicks ────────────────────────────────────────────────────────
  sidebarItems.forEach(item => {
    item.addEventListener('click', () => selectAnimation(item.dataset.name));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectAnimation(item.dataset.name);
      }
    });
  });

  // ── Sliders ───────────────────────────────────────────────────────────────
  durationSlider.addEventListener('input', () => {
    durationVal.textContent = (durationSlider.value / 1000).toFixed(1) + 's';
    applyAnimation();
  });

  delaySlider.addEventListener('input', () => {
    delayVal.textContent = (delaySlider.value / 1000).toFixed(1) + 's';
    applyAnimation();
  });

  // ── Iterations ────────────────────────────────────────────────────────────
  iterMinus.addEventListener('click', () => {
    if (iterations > 1) {
      iterations--;
      iterVal.textContent = iterations;
      applyAnimation();
    }
  });

  iterPlus.addEventListener('click', () => {
    iterations++;
    iterVal.textContent = iterations;
    applyAnimation();
  });

  infiniteToggle.addEventListener('change', () => {
    iterVal.style.opacity = infiniteToggle.checked ? '0.3' : '1';
    iterMinus.disabled = infiniteToggle.checked;
    iterPlus.disabled  = infiniteToggle.checked;
    applyAnimation();
  });

  // ── Dropdowns ─────────────────────────────────────────────────────────────
  [easingSelect, directionSelect, fillSelect].forEach(el => {
    el.addEventListener('change', applyAnimation);
  });

  // ── Replay ────────────────────────────────────────────────────────────────
  replayBtn.addEventListener('click', applyAnimation);

  // ── Copy JSON ─────────────────────────────────────────────────────────────
  copyBtn.addEventListener('click', () => {
    if (!currentAnimation) return;
    const text = jsonPreview.textContent;
    navigator.clipboard.writeText(text).then(() => {
      copyToast.classList.add('show');
      setTimeout(() => copyToast.classList.remove('show'), 2000);
    });
  });

  // ── Download JSON ─────────────────────────────────────────────────────────
  downloadBtn.addEventListener('click', () => {
    if (!currentAnimation) return;
    const text     = jsonPreview.textContent;
    const blob     = new Blob([text], { type: 'application/json' });
    const url      = URL.createObjectURL(blob);
    const a        = document.createElement('a');
    a.href         = url;
    a.download     = `${currentAnimation.replace(/\s+/g, '_').toLowerCase()}_animation.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // Expose V1 data objects for V2 Studio usage
  window.v1Data = {
    animationKeyframes: typeof animationKeyframes !== 'undefined' ? animationKeyframes : {},
    sceneTemplates: typeof sceneTemplates !== 'undefined' ? sceneTemplates : {},
    easingToFlutter: typeof easingToFlutter !== 'undefined' ? easingToFlutter : {},
    toClass: typeof toClass !== 'undefined' ? toClass : (name) => 'anim-' + name.toLowerCase().replace(/\s+/g, '-'),
    applyAnimation: typeof applyAnimation !== 'undefined' ? applyAnimation : null,
    selectAnimation: typeof selectAnimation !== 'undefined' ? selectAnimation : null
  };

});
