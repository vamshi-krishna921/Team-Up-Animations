// studio.js — Animation Studio V2 engine

document.addEventListener('DOMContentLoaded', () => {
  // Ensure we fail-safe if V1 data isn't loaded
  const v1 = window.v1Data || {
    animationKeyframes: {},
    sceneTemplates: {},
    easingToFlutter: {},
    toClass: (name) => 'anim-' + name.toLowerCase().replace(/\s+/g, '-'),
    applyAnimation: null,
    selectAnimation: null
  };

  // State Management
  const state = {
    activeMode: 'studio', // 'quick-preview' (V1) or 'studio' (V2)
    project: {
      name: "New Animation Studio Project",
      assets: []
    },
    scenes: [
      {
        id: 'scene_1',
        name: 'Scene 1',
        transition: 'fade',
        layers: [
          {
            id: 'layer_bg',
            type: 'shape',
            shapeType: 'rectangle',
            name: '#Background',
            x: 0, y: 0,
            width: 800, height: 600,
            fill: '#0a0a14',
            radius: 0,
            opacity: 1, visible: true, locked: true,
            animations: []
          },
          {
            id: 'layer_glow1',
            type: 'shape',
            shapeType: 'circle',
            name: 'Glow Left',
            x: -60, y: 180,
            width: 420, height: 420,
            fill: 'radial-gradient(circle, rgba(124,58,237,0.28) 0%, transparent 68%)',
            radius: 210,
            opacity: 1, visible: true, locked: false,
            animations: [
              { id: 'anim_gl1', name: 'Liquid Float', start: 0, duration: 5000,
                easing: 'cubic-bezier(0.22,1,0.36,1)', infinite: false, direction: 'normal', fill: 'forwards' }
            ]
          },
          {
            id: 'layer_glow2',
            type: 'shape',
            shapeType: 'circle',
            name: 'Glow Right',
            x: 460, y: 60,
            width: 340, height: 340,
            fill: 'radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 68%)',
            radius: 170,
            opacity: 1, visible: true, locked: false,
            animations: [
              { id: 'anim_gl2', name: 'Liquid Float', start: 500, duration: 4500,
                easing: 'cubic-bezier(0.22,1,0.36,1)', infinite: false, direction: 'normal', fill: 'forwards' }
            ]
          },
          {
            id: 'layer_pepsi_card',
            type: 'ui',
            name: 'Hero Card',
            x: 462, y: 96,
            width: 320, height: 380,
            html: `<div style="width:100%;height:100%;background:linear-gradient(145deg,rgba(20,20,35,0.95) 0%,rgba(30,20,50,0.9) 100%);border:1px solid rgba(124,58,237,0.3);border-radius:24px;backdrop-filter:blur(16px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:28px;box-sizing:border-box;box-shadow:0 24px 64px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.06);">
              <div style="width:80px;height:80px;background:linear-gradient(135deg,#7c3aed,#6366f1);border-radius:20px;display:flex;align-items:center;justify-content:center;font-size:36px;box-shadow:0 8px 32px rgba(124,58,237,0.45);">✦</div>
              <div style="color:#fff;font-size:19px;font-weight:800;text-align:center;line-height:1.25;letter-spacing:-0.3px;">Animation<br/>Studio</div>
              <div style="color:rgba(255,255,255,0.45);font-size:12px;text-align:center;line-height:1.55;">Create stunning motion<br/>for any platform</div>
              <div style="display:flex;gap:7px;margin-top:2px;flex-wrap:wrap;justify-content:center;">
                <div style="padding:5px 13px;background:rgba(124,58,237,0.28);border:1px solid rgba(124,58,237,0.45);border-radius:20px;color:#a78bfa;font-size:10px;font-weight:700;letter-spacing:0.2px;">Flutter</div>
                <div style="padding:5px 13px;background:rgba(99,102,241,0.28);border:1px solid rgba(99,102,241,0.45);border-radius:20px;color:#818cf8;font-size:10px;font-weight:700;letter-spacing:0.2px;">React</div>
                <div style="padding:5px 13px;background:rgba(236,72,153,0.18);border:1px solid rgba(236,72,153,0.35);border-radius:20px;color:#f472b6;font-size:10px;font-weight:700;letter-spacing:0.2px;">CSS</div>
              </div>
            </div>`,
            opacity: 1, visible: true, locked: false,
            animations: [
              { id: 'anim_pepsi1', name: 'Slide Up', start: 300, duration: 1100,
                easing: 'cubic-bezier(0.22,1,0.36,1)', infinite: false, direction: 'normal', fill: 'forwards' }
            ]
          },
          {
            id: 'layer_badge',
            type: 'ui',
            name: 'Live Badge',
            x: 474, y: 74,
            width: 116, height: 30,
            html: `<div style="width:100%;height:100%;background:linear-gradient(90deg,#7c3aed,#6366f1);border-radius:20px;display:flex;align-items:center;justify-content:center;gap:6px;font-size:10px;font-weight:800;color:#fff;box-shadow:0 4px 18px rgba(124,58,237,0.55);letter-spacing:0.4px;">
              <div style="width:6px;height:6px;background:#4ade80;border-radius:50%;box-shadow:0 0 6px #4ade80;flex-shrink:0;"></div>LIVE STUDIO</div>`,
            opacity: 1, visible: true, locked: false,
            animations: [
              { id: 'anim_badge1', name: 'Fade In', start: 1500, duration: 700,
                easing: 'ease-out', infinite: false, direction: 'normal', fill: 'forwards' }
            ]
          },
          {
            id: 'layer_title',
            type: 'text',
            name: 'Title Text',
            x: 36, y: 130,
            width: 400, height: 110,
            content: 'Animate\nBeautifully',
            fontSize: 54,
            fontWeight: '800',
            fontFamily: 'Inter',
            color: '#ffffff',
            letterSpacing: '-1.5px',
            lineHeight: '1.08',
            alignment: 'left',
            opacity: 1, visible: true, locked: false,
            animations: [
              { id: 'anim_title1', name: 'Slide Up', start: 0, duration: 1000,
                easing: 'cubic-bezier(0.22,1,0.36,1)', infinite: false, direction: 'normal', fill: 'forwards' }
            ]
          },
          {
            id: 'layer_subtitle',
            type: 'text',
            name: 'Subtitle Text',
            x: 36, y: 262,
            width: 370, height: 68,
            content: 'Design, animate and export\nstunning animations to any platform',
            fontSize: 14,
            fontWeight: '400',
            fontFamily: 'Inter',
            color: 'rgba(255,255,255,0.52)',
            letterSpacing: '0px',
            lineHeight: '1.62',
            alignment: 'left',
            opacity: 1, visible: true, locked: false,
            animations: [
              { id: 'anim_sub1', name: 'Fade In', start: 550, duration: 900,
                easing: 'ease-out', infinite: false, direction: 'normal', fill: 'forwards' }
            ]
          },
          {
            id: 'layer_button',
            type: 'ui',
            name: 'Button',
            x: 36, y: 362,
            width: 176, height: 50,
            html: `<button style="width:100%;height:100%;cursor:default;background:linear-gradient(135deg,#7c3aed,#6366f1);color:#fff;border:none;border-radius:14px;font-weight:700;font-size:14px;box-shadow:0 8px 28px rgba(124,58,237,0.48);letter-spacing:0.2px;">Get Started →</button>`,
            opacity: 1, visible: true, locked: false,
            animations: [
              { id: 'anim_btn1', name: 'Pulse', start: 1050, duration: 1400,
                easing: 'cubic-bezier(0.22,1,0.36,1)', infinite: false, direction: 'normal', fill: 'forwards' }
            ]
          },
          {
            id: 'layer_stats',
            type: 'ui',
            name: 'Stats Row',
            x: 36, y: 442,
            width: 360, height: 58,
            html: `<div style="width:100%;height:100%;display:flex;gap:20px;align-items:center;">
              <div style="text-align:left;">
                <div style="color:#fff;font-size:21px;font-weight:800;line-height:1;">25+</div>
                <div style="color:rgba(255,255,255,0.38);font-size:10px;margin-top:3px;letter-spacing:0.2px;">Animations</div>
              </div>
              <div style="width:1px;height:34px;background:rgba(255,255,255,0.09);"></div>
              <div style="text-align:left;">
                <div style="color:#fff;font-size:21px;font-weight:800;line-height:1;">3</div>
                <div style="color:rgba(255,255,255,0.38);font-size:10px;margin-top:3px;letter-spacing:0.2px;">Platforms</div>
              </div>
              <div style="width:1px;height:34px;background:rgba(255,255,255,0.09);"></div>
              <div style="text-align:left;">
                <div style="color:#fff;font-size:21px;font-weight:800;line-height:1;">∞</div>
                <div style="color:rgba(255,255,255,0.38);font-size:10px;margin-top:3px;letter-spacing:0.2px;">Possibilities</div>
              </div>
            </div>`,
            opacity: 1, visible: true, locked: false,
            animations: [
              { id: 'anim_stats1', name: 'Fade In', start: 1350, duration: 900,
                easing: 'ease-out', infinite: false, direction: 'normal', fill: 'forwards' }
            ]
          },
          {
            id: 'layer_icons',
            type: 'ui',
            name: 'Floating Icons',
            x: 32, y: 530,
            width: 210, height: 36,
            html: `<div style="display:flex;gap:7px;align-items:center;">
              <div style="width:30px;height:30px;background:rgba(124,58,237,0.2);border:1px solid rgba(124,58,237,0.38);border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:13px;">🎨</div>
              <div style="width:30px;height:30px;background:rgba(99,102,241,0.2);border:1px solid rgba(99,102,241,0.38);border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:13px;">⚡</div>
              <div style="width:30px;height:30px;background:rgba(236,72,153,0.18);border:1px solid rgba(236,72,153,0.3);border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:13px;">🚀</div>
              <div style="color:rgba(255,255,255,0.28);font-size:11px;margin-left:4px;font-weight:500;">v2.0 Studio</div>
            </div>`,
            opacity: 1, visible: true, locked: false,
            animations: [
              { id: 'anim_icons1', name: 'Slide Up', start: 1750, duration: 800,
                easing: 'cubic-bezier(0.22,1,0.36,1)', infinite: false, direction: 'normal', fill: 'forwards' }
            ]
          }
        ]
      },
      {
        id: 'scene_2',
        name: 'Scene 2',
        transition: 'fade',
        layers: []
      },
      {
        id: 'scene_3',
        name: 'Scene 3',
        transition: 'fade',
        layers: []
      },
      {
        id: 'scene_4',
        name: 'Scene 4',
        transition: 'fade',
        layers: []
      }
    ],
    currentSceneId: 'scene_1',
    selectedLayerId: null,
    selectedLayerIds: [],
    history: [],
    historyIndex: -1,
    zoom: 1.0,
    panX: 0,
    panY: 0,
    canvasWidth: 800,
    canvasHeight: 600,
    isPlaying: false,
    currentTime: 0,
    duration: 5000,
    playbackSpeed: 1.0,
    isPanning: false,
    dragStart: { x: 0, y: 0 },
    activeDragElement: null,
    dragOffset: { x: 0, y: 0 },
    snapGrid: true,
    gridSize: 20
  };

  const escapeHTML = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  function getLayerDisplayName(layer) {
    if (layer.type === 'text') {
      const contentName = String(layer.content || '').trim().split(/\r?\n/)[0];
      if (contentName) return contentName;
    }
    return layer.name || 'Layer';
  }

  // Element Templates for Toolbox Drop
  const componentTemplates = {
    // Text elements
    'Heading': { type: 'text', content: 'Double click to edit Heading', width: 280, height: 50, fontSize: 32, fontWeight: '700', fontFamily: 'Inter', color: '#ffffff', letterSpacing: '0px', lineHeight: '1.2', alignment: 'center' },
    'Subheading': { type: 'text', content: 'Double click to edit Subheading', width: 240, height: 35, fontSize: 20, fontWeight: '600', fontFamily: 'Inter', color: '#a0a0b5', letterSpacing: '0px', lineHeight: '1.2', alignment: 'center' },
    'Paragraph': { type: 'text', content: 'This is a description text layer that you can write long paragraphs inside.', width: 260, height: 80, fontSize: 13, fontWeight: '400', fontFamily: 'Inter', color: '#c0c0d5', letterSpacing: '0px', lineHeight: '1.5', alignment: 'left' },
    'Button Text': { type: 'text', content: 'CLICK ME', width: 140, height: 30, fontSize: 12, fontWeight: '700', fontFamily: 'Inter', color: '#ffffff', letterSpacing: '1px', lineHeight: '1.2', alignment: 'center' },
    
    // Shapes
    'Rectangle': { type: 'shape', shapeType: 'rectangle', width: 150, height: 100, fill: '#7c3aed', stroke: 'transparent', strokeWidth: 0, radius: 8, shadow: 10 },
    'Circle': { type: 'shape', shapeType: 'circle', width: 100, height: 100, fill: '#ef4444', stroke: 'transparent', strokeWidth: 0, radius: 50, shadow: 10 },
    'Triangle': { type: 'shape', shapeType: 'triangle', width: 100, height: 100, fill: '#f59e0b', stroke: 'transparent', strokeWidth: 0, shadow: 10 },
    'Line': { type: 'shape', shapeType: 'line', width: 200, height: 8, fill: '#10b981', stroke: 'transparent', strokeWidth: 0, radius: 4 },
    'Image Frame': { type: 'imageframe', width: 200, height: 200, radius: 0, imgUrl: '', imgScale: 1, imgX: 0, imgY: 0 },
    
    // UI Elements — fields stored in state, html built dynamically via buildUIHtml()
    'Card': {
      type: 'ui', template: 'card', width: 280, height: 160,
      cardTitle: 'Modern UI Card', cardSubtitle: 'Draggable UI Component',
      cardIcon: '✦', cardBg: '#1a1a2e', cardAccent: '#7c3aed'
    },
    'Button': {
      type: 'ui', template: 'button', width: 180, height: 48,
      btnLabel: 'Action Button ⚡', btnBg: '#7c3aed', btnColor: '#ffffff',
      btnRadius: 14, btnFontSize: 15
    },
    'Avatar': {
      type: 'ui', template: 'avatar', width: 80, height: 80,
      avatarUrl: '', avatarInitials: 'AB', avatarBg: '#7c3aed', avatarRadius: 50
    },
    'Notification': {
      type: 'ui', template: 'notification', width: 300, height: 72,
      notifTitle: 'Sync Complete', notifBody: 'All files are up to date.',
      notifIcon: '✅', notifBg: 'rgba(26,26,46,0.95)', notifAccent: '#4ade80'
    }
  };


  // Build live HTML from a UI layer's structured fields
  function buildUIHtml(layer) {
    const t = layer.template;
    if (t === 'card') {
      const bg     = layer.cardBg     || '#1a1a2e';
      const accent = layer.cardAccent || '#7c3aed';
      const icon   = layer.cardIcon   || '✦';
      const title  = layer.cardTitle  || 'Card';
      const sub    = layer.cardSubtitle || '';
      return `<div style="width:100%;height:100%;box-sizing:border-box;background:${bg};border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:16px;display:flex;flex-direction:column;justify-content:space-between;overflow:hidden;"><div style="display:flex;align-items:center;gap:10px;"><div style="width:36px;height:36px;border-radius:10px;background:${accent};display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">${icon}</div><div style="overflow:hidden;"><div style="color:#fff;font-weight:700;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${title}</div><div style="color:rgba(255,255,255,0.45);font-size:11px;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${sub}</div></div></div><div style="height:3px;background:linear-gradient(90deg,${accent},transparent);border-radius:2px;margin-top:10px;"></div></div>`;
    }
    if (t === 'button') {
      const bg     = layer.btnBg      || '#7c3aed';
      const color  = layer.btnColor   || '#fff';
      const label  = layer.btnLabel   || 'Button';
      const radius = layer.btnRadius  != null ? layer.btnRadius : 14;
      const fs     = layer.btnFontSize || 15;
      return `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:${bg};border-radius:${radius}px;cursor:default;box-shadow:0 6px 20px rgba(0,0,0,0.25);"><span style="color:${color};font-weight:700;font-size:${fs}px;pointer-events:none;">${label}</span></div>`;
    }
    if (t === 'avatar') {
      const url      = layer.avatarUrl      || '';
      const initials = layer.avatarInitials || '?';
      const bg       = layer.avatarBg       || '#7c3aed';
      const radius   = layer.avatarRadius   != null ? layer.avatarRadius : 50;
      const borderR  = radius + '%';
      if (url) {
        return `<div style="width:100%;height:100%;border-radius:${borderR};overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.35);"><img src="${url}" style="width:100%;height:100%;object-fit:cover;display:block;" draggable="false"/></div>`;
      }
      return `<div style="width:100%;height:100%;border-radius:${borderR};background:${bg};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:28px;color:#fff;box-shadow:0 4px 16px rgba(0,0,0,0.35);">${initials}</div>`;
    }
    if (t === 'notification') {
      const bg     = layer.notifBg     || 'rgba(26,26,46,0.95)';
      const accent = layer.notifAccent || '#4ade80';
      const icon   = layer.notifIcon   || '🔔';
      const title  = layer.notifTitle  || 'Notification';
      const body   = layer.notifBody   || '';
      return `<div style="width:100%;height:100%;box-sizing:border-box;background:${bg};border:1px solid rgba(255,255,255,0.1);border-radius:14px;padding:10px 14px;display:flex;align-items:center;gap:10px;overflow:hidden;"><div style="width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,0.07);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;">${icon}</div><div style="flex:1;overflow:hidden;"><div style="color:#fff;font-weight:700;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${title}</div><div style="color:rgba(255,255,255,0.45);font-size:11px;margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${body}</div></div><div style="width:8px;height:8px;border-radius:50%;background:${accent};flex-shrink:0;box-shadow:0 0 8px ${accent};"></div></div>`;
    }
    return layer.html || '';
  }

  // Asset defaults
  const defaultAssets = [
    { id: 'asset_1', name: 'Abstract Art', type: 'image', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop' },
    { id: 'asset_2', name: 'Tech Cover', type: 'image', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=300&auto=format&fit=crop' }
  ];
  state.project.assets = [...defaultAssets];

  // DOM Refs
  let app, mainContent, sidebar, rootNode;
  
  function initStudioDOM() {
    app = document.querySelector('.app');
    mainContent = document.querySelector('.main-content');
    sidebar = document.querySelector('.sidebar');
    
    // Set native draggable properties and listeners on V1 animation items
    document.querySelectorAll('.sb-item').forEach(item => {
      item.setAttribute('draggable', 'true');
      item.addEventListener('dragstart', (e) => {
        currentDragType = 'animation';
        currentDragData = item.dataset.name;
      });
    });

    // Left Sidebar Upgrades (Scene Manager + Tabs for components/assets)
    const sidebarLogo = document.querySelector('.sb-logo');
    const studioSidebarHeader = document.createElement('div');
    studioSidebarHeader.className = 'studio-sidebar-header studio-only';
    studioSidebarHeader.innerHTML = `
      <div class="studio-sidebar-title">Scenes</div>
      <div class="scenes-list" id="scenesList"></div>
      <button class="add-scene-btn" id="btnAddScene"><span>+</span> Add Scene</button>
      
      <div class="sidebar-tabs">
        <button class="tab-btn active" id="tabBtnAnims">Animations</button>
        <button class="tab-btn" id="tabBtnComps">Toolbox</button>
        <button class="tab-btn" id="tabBtnAssets">Assets</button>
      </div>
    `;
    // Insert after the log/header block
    sidebar.insertBefore(studioSidebarHeader, document.querySelector('.sb-sep').nextSibling);

    // Left Panel Tab contents container
    const tabContents = document.createElement('div');
    tabContents.className = 'studio-only draggable-list';
    tabContents.id = 'studioTabContent';
    sidebar.appendChild(tabContents);

    // Adjust visibility tags for existing items
    document.querySelector('.sb-section-lbl').classList.add('preview-only');
    document.querySelector('.search-container').classList.add('preview-only');
    document.querySelector('.sb-nav').classList.add('preview-only');
    
    // Canvas Workspace wrapping elements
    const previewStage = document.getElementById('previewStage');
    previewStage.classList.add('preview-only'); // V1 only

    const canvasWrapper = document.createElement('div');
    canvasWrapper.className = 'canvas-wrapper studio-only';
    canvasWrapper.id = 'canvasWrapper';
    canvasWrapper.innerHTML = `
      <div class="canvas-ruler canvas-ruler-x" id="rulerX"></div>
      <div class="canvas-ruler canvas-ruler-y" id="rulerY"></div>
      <div class="studio-canvas" id="studioCanvas">
        <div class="canvas-viewport-frame" id="canvasViewport"></div>
      </div>
      <div class="canvas-controls">
        <button class="canvas-ctrl-btn" id="btnZoomOut">−</button>
        <span class="canvas-zoom-val" id="zoomVal">100%</span>
        <button class="canvas-ctrl-btn" id="btnZoomIn">+</button>
        <button class="canvas-ctrl-btn" id="btnZoomFit">Fit</button>
        <button class="canvas-ctrl-btn" id="btnSnapToggle" style="color:#7c3aed;">Snap Grid</button>
        <div style="width:1px;height:16px;background:rgba(255,255,255,0.12);margin:0 2px;"></div>
        <button class="canvas-ctrl-btn" id="btnCanvasResize" title="Resize Canvas">⬚ <span id="canvasSizeLabel">800×600</span></button>
      </div>

      <!-- Canvas Resize Modal -->
      <div id="canvasResizeModal" style="display:none;position:absolute;bottom:52px;right:12px;
        background:var(--bg-sidebar);border:1px solid var(--card-border);border-radius:12px;
        padding:1rem;width:240px;z-index:200;box-shadow:0 8px 32px rgba(0,0,0,0.4);">
        <div style="font-size:0.72rem;font-weight:700;color:#a78bfa;margin-bottom:0.75rem;text-transform:uppercase;letter-spacing:0.5px;">Canvas Size</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:0.75rem;">
          <button class="canvas-preset-btn" data-w="800" data-h="600">800×600</button>
          <button class="canvas-preset-btn" data-w="1920" data-h="1080">1920×1080</button>
          <button class="canvas-preset-btn" data-w="1080" data-h="1920">1080×1920</button>
          <button class="canvas-preset-btn" data-w="1080" data-h="1080">1080×1080</button>
          <button class="canvas-preset-btn" data-w="390" data-h="844">390×844 (iOS)</button>
          <button class="canvas-preset-btn" data-w="360" data-h="800">360×800 (Android)</button>
        </div>
        <div style="display:flex;gap:6px;align-items:center;margin-bottom:0.5rem;">
          <input type="number" id="canvasCustomW" placeholder="W" min="100" max="4000" value="800"
            style="width:70px;padding:5px 8px;background:rgba(255,255,255,0.06);border:1px solid var(--card-border);
            border-radius:6px;color:var(--text-primary);font-size:0.75rem;"/>
          <span style="color:var(--text-muted);font-size:0.75rem;">×</span>
          <input type="number" id="canvasCustomH" placeholder="H" min="100" max="4000" value="600"
            style="width:70px;padding:5px 8px;background:rgba(255,255,255,0.06);border:1px solid var(--card-border);
            border-radius:6px;color:var(--text-primary);font-size:0.75rem;"/>
          <button id="btnApplyCanvasSize"
            style="flex:1;padding:5px 8px;background:#7c3aed;color:#fff;border:none;border-radius:6px;
            font-size:0.72rem;font-weight:700;cursor:pointer;">Apply</button>
        </div>
        <div style="font-size:0.62rem;color:var(--text-muted);">Resizing scales the viewport frame only. Layers keep their positions.</div>
      </div>
    `;
    mainContent.insertBefore(canvasWrapper, document.querySelector('.bottom-panel'));

    // Right Side Inspector Panel
    const rightPanel = document.createElement('aside');
    rightPanel.className = 'studio-right-panel studio-only';
    rightPanel.innerHTML = `
      <div class="inspector-tabs">
        <button class="tab-btn active" style="padding:0.75rem 0;">Inspector</button>
      </div>
      <div class="inspector-section" style="flex:1;">
        <div class="inspector-sec-title">Properties</div>
        <div id="inspectorContent">// Select a layer to edit properties</div>
      </div>
      <div class="layers-manager-panel">
        <div class="inspector-tabs"><button class="tab-btn active" style="padding:0.75rem 0;">Layers</button></div>
        <div class="layers-list" id="layersList"></div>
      </div>
    `;
    app.appendChild(rightPanel);

    // Timeline bottom Panel
    const timelinePanel = document.createElement('div');
    timelinePanel.className = 'studio-timeline-container studio-only';
    timelinePanel.innerHTML = `
      <div class="timeline-header">
        <div class="timeline-title-sec">
          <span>Timeline</span>
          <span style="font-size:0.65rem; color:var(--text-muted);" id="timelineTimeVal">0.0s / 5.0s</span>
        </div>
        <div class="timeline-controls">
          <button class="timeline-ctrl-btn" id="tlPlayBtn">▶ Play</button>
          <button class="timeline-ctrl-btn" id="tlStopBtn">■ Reset</button>
          <select class="timeline-speed-sel" id="tlSpeedSel">
            <option value="0.5">0.5x</option>
            <option value="1" selected>1.0x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2.0x</option>
          </select>
        </div>
      </div>
      <div class="timeline-content">
        <div class="timeline-track-names" id="tlTrackNames"></div>
        <div class="timeline-tracks-area" id="tlTracksArea">
          <div class="timeline-ruler-seconds" id="tlRuler"></div>
          <div id="tlTrackRows"></div>
          <div class="timeline-playhead-line" id="tlPlayheadLine" style="left:0px;"></div>
          <div class="timeline-playhead-handle" id="tlPlayheadHandle" style="left:0px;"></div>
        </div>
      </div>
    `;
    mainContent.appendChild(timelinePanel);

    // Dynamic actions toast
    const toast = document.createElement('div');
    toast.className = 'studio-action-toast';
    toast.id = 'studioToast';
    document.body.appendChild(toast);
  }

  // Toast Notification
  function showToast(msg) {
    const el = document.getElementById('studioToast');
    if (el) {
      el.textContent = msg;
      el.classList.add('show');
      setTimeout(() => el.classList.remove('show'), 2000);
    }
  }

  // --- Undo/Redo Engine ---
  function saveState() {
    const snapshot = JSON.stringify({
      scenes: state.scenes,
      currentSceneId: state.currentSceneId,
      selectedLayerId: state.selectedLayerId
    });
    
    // Prune forward history if we were in middle of undo stack
    if (state.historyIndex < state.history.length - 1) {
      state.history = state.history.slice(0, state.historyIndex + 1);
    }
    
    state.history.push(snapshot);
    state.historyIndex = state.history.length - 1;
  }

  // Recompile _lkfCompiled for every layer after a state restore (undo/redo/load)
  function recompileAllLayerKeyframes() {
    state.scenes.forEach(scene => {
      scene.layers.forEach(layer => {
        if (layer.layerKeyframes && layer.layerKeyframes.length >= 2) {
          applyLayerKeyframeAnimation(layer);
        } else {
          layer._lkfCompiled = null;
        }
        // Recurse into groups
        if (layer.children) {
          layer.children.forEach(child => {
            if (child.layerKeyframes && child.layerKeyframes.length >= 2) {
              applyLayerKeyframeAnimation(child);
            } else {
              child._lkfCompiled = null;
            }
          });
        }
      });
    });
  }

  function undo() {
    if (state.historyIndex > 0) {
      state.historyIndex--;
      const snapshot = JSON.parse(state.history[state.historyIndex]);
      state.scenes = snapshot.scenes;
      state.currentSceneId = snapshot.currentSceneId;
      state.selectedLayerId = snapshot.selectedLayerId;
      recompileAllLayerKeyframes();
      renderAll();
      showToast("Undo");
    }
  }

  function redo() {
    if (state.historyIndex < state.history.length - 1) {
      state.historyIndex++;
      const snapshot = JSON.parse(state.history[state.historyIndex]);
      state.scenes = snapshot.scenes;
      state.currentSceneId = snapshot.currentSceneId;
      state.selectedLayerId = snapshot.selectedLayerId;
      recompileAllLayerKeyframes();
      renderAll();
      showToast("Redo");
    }
  }

  // --- Keyboard Shortcuts ---
  window.addEventListener('keydown', (e) => {
    if (state.activeMode !== 'studio') return;
    const tag = document.activeElement.tagName;
    const editable = document.activeElement.contentEditable === 'true';
    
    // Undo / Redo
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      undo();
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
      e.preventDefault();
      redo();
    }

    // Group / Ungroup
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'G') {
      e.preventDefault();
      const scene = getActiveScene();
      const layer = state.selectedLayerId && scene.layers.find(l => l.id === state.selectedLayerId);
      if (layer && layer.type === 'group') ungroupLayer(state.selectedLayerId);
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
      e.preventDefault();
      groupSelectedLayers();
      return;
    }

    // Duplicate
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
      if (tag === 'INPUT' || tag === 'TEXTAREA' || editable) return;
      e.preventDefault();
      if (state.selectedLayerId) duplicateLayer(state.selectedLayerId);
      return;
    }
    
    // Delete selected layer
    if ((e.key === 'Delete' || e.key === 'Backspace') && state.selectedLayerId) {
      if (tag === 'INPUT' || tag === 'TEXTAREA' || editable) return;
      e.preventDefault();
      deleteLayer(state.selectedLayerId);
    }
  });

  // Mode Toggler Actions
  function setupModeToggles() {
    document.getElementById('modeBtnQuick').addEventListener('click', () => {
      state.activeMode = 'quick-preview';
      app.className = 'app mode-quick-preview';
      document.getElementById('modeBtnQuick').classList.add('active');
      document.getElementById('modeBtnStudio').classList.remove('active');
      
      const sbNav = document.querySelector('.sb-nav');
      if (sbNav) {
        sbNav.style.display = '';
        sbNav.classList.remove('preview-only');
      }
    });

    document.getElementById('modeBtnStudio').addEventListener('click', () => {
      state.activeMode = 'studio';
      app.className = 'app mode-studio';
      document.getElementById('modeBtnStudio').classList.add('active');
      document.getElementById('modeBtnQuick').classList.remove('active');
      
      // Initialize view rendering
      saveState(); // Capture initial snapshot
      renderAll();

      // Trigger current active tab click to show the proper sidebar panel
      const activeTab = document.querySelector('.sidebar-tabs .tab-btn.active');
      if (activeTab) {
        activeTab.click();
      }
    });
  }

  // --- Scene Manager ---
  function getActiveScene() {
    return state.scenes.find(s => s.id === state.currentSceneId) || state.scenes[0];
  }

  function renderScenes() {
    const container = document.getElementById('scenesList');
    container.innerHTML = '';
    
    state.scenes.forEach((scene, index) => {
      const activeClass = scene.id === state.currentSceneId ? 'active' : '';
      const div = document.createElement('div');
      div.className = `scene-item ${activeClass}`;
      div.dataset.id = scene.id;
      div.innerHTML = `
        <span class="scene-meta-name">${scene.name}</span>
        <div class="scene-actions">
          <button class="scene-act-btn btn-dup" title="Duplicate">❐</button>
          <button class="scene-act-btn btn-del" title="Delete">🗑</button>
        </div>
      `;
      
      // Switch active scene on single click (but don't steal from dblclick)
      let clickTimer = null;
      div.addEventListener('click', (e) => {
        if (e.target.closest('.scene-actions') || e.target.closest('input')) return;
        // Delay the click so a double-click on the name can cancel it
        if (e.target === nameSpan || e.target.closest('.scene-meta-name')) {
          clearTimeout(clickTimer);
          clickTimer = setTimeout(() => {
            state.currentSceneId = scene.id;
            state.selectedLayerId = null;
            state.selectedLayerIds = [];
            renderAll();
          }, 220); // just above typical dblclick interval
        } else {
          state.currentSceneId = scene.id;
          state.selectedLayerId = null;
          state.selectedLayerIds = [];
          renderAll();
        }
      });

      // Double-click to rename scene
      const nameSpan = div.querySelector('.scene-meta-name');
      nameSpan.title = 'Double-click to rename';
      nameSpan.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        clearTimeout(clickTimer); // cancel the pending single-click
        const input = document.createElement('input');
        input.type = 'text';
        input.value = scene.name;
        input.className = 'scene-rename-input';
        input.style.cssText = `
          font-size: inherit;
          font-family: inherit;
          font-weight: inherit;
          width: 140px;
          max-width: 140px;
          background: rgba(124,58,237,0.15);
          color: var(--text-primary);
          border: 1.5px solid rgba(124,58,237,0.6);
          border-radius: 5px;
          padding: 2px 6px;
          outline: none;
          box-shadow: 0 0 0 2px rgba(124,58,237,0.15);
        `;

        nameSpan.replaceWith(input);
        input.focus();
        input.select();

        let saved = false;
        const saveRename = () => {
          if (saved) return;
          saved = true;
          const newName = input.value.trim();
          if (newName && newName !== scene.name) {
            scene.name = newName;
            saveState();
            renderAll();
          } else {
            input.replaceWith(nameSpan);
          }
        };
        const cancelRename = () => {
          if (saved) return;
          saved = true;
          input.replaceWith(nameSpan);
        };

        input.addEventListener('blur', saveRename);
        input.addEventListener('keydown', (evt) => {
          if (evt.key === 'Enter') { evt.preventDefault(); saveRename(); }
          if (evt.key === 'Escape') { evt.preventDefault(); cancelRename(); }
        });
      });

      // Actions
      div.querySelector('.btn-dup').addEventListener('click', () => {
        duplicateScene(scene.id);
      });
      div.querySelector('.btn-del').addEventListener('click', () => {
        deleteScene(scene.id);
      });

      container.appendChild(div);
    });
  }

  function addScene() {
    const id = 'scene_' + Date.now();
    const name = `Scene ${state.scenes.length + 1}`;
    state.scenes.push({ id, name, transition: 'fade', layers: [] });
    state.currentSceneId = id;
    selectLayer(null);
    saveState();
    renderAll();
  }

  function duplicateScene(sceneId) {
    const scene = state.scenes.find(s => s.id === sceneId);
    if (!scene) return;
    const newId = 'scene_' + Date.now();
    const copy = JSON.parse(JSON.stringify(scene));
    copy.id = newId;
    copy.name = `${copy.name} (Copy)`;
    state.scenes.push(copy);
    state.currentSceneId = newId;
    selectLayer(null);
    saveState();
    renderAll();
  }

  function deleteScene(sceneId) {
    if (state.scenes.length <= 1) {
      showToast("Cannot delete the only scene!");
      return;
    }
    state.scenes = state.scenes.filter(s => s.id !== sceneId);
    if (state.currentSceneId === sceneId) {
      state.currentSceneId = state.scenes[0].id;
    }
    selectLayer(null);
    saveState();
    renderAll();
  }

  // --- Layers & Canvas rendering ---
  function deleteLayer(layerId) {
    const scene = getActiveScene();
    scene.layers = scene.layers.filter(l => l.id !== layerId);
    if (state.selectedLayerIds.includes(layerId)) {
      selectLayer(null);
    }
    saveState();
    renderAll();
  }

  function duplicateLayer(layerId) {
    const scene = getActiveScene();
    const layer = scene.layers.find(l => l.id === layerId);
    if (!layer) return;
    const copy = JSON.parse(JSON.stringify(layer));
    copy.id = 'layer_' + Date.now();
    copy.name = `${copy.name} (Copy)`;
    copy.x += 20;
    copy.y += 20;
    scene.layers.push(copy);
    selectLayer(copy.id, false);
    saveState();
    renderAll();
  }

  // --- Marquee Selection & Grouping ---
  const marqueeState = { active: false, startX: 0, startY: 0, el: null };

  function groupSelectedLayers() {
    const scene = getActiveScene();
    const ids = state.selectedLayerIds;
    if (ids.length < 2) { showToast('Select 2+ layers to group'); return; }

    const layers = ids.map(id => scene.layers.find(l => l.id === id)).filter(Boolean);
    const minX = Math.min(...layers.map(l => l.x));
    const minY = Math.min(...layers.map(l => l.y));
    const maxX = Math.max(...layers.map(l => l.x + l.width));
    const maxY = Math.max(...layers.map(l => l.y + l.height));

    // Deep-clone each child so the group snapshot is independent of state mutations
    const deepClone = obj => JSON.parse(JSON.stringify(obj));

    // Collect all animations from children — first child's anims become the group default
    const firstChildAnims = deepClone(layers[0].animations || []);

    const groupId = 'group_' + Date.now();
    const group = {
      id: groupId,
      type: 'group',
      name: `Group (${layers.length})`,
      x: minX, y: minY,
      width: maxX - minX, height: maxY - minY,
      opacity: 1, visible: true, locked: false, rotation: 0,
      // Inherit animations from the first selected layer
      animations: firstChildAnims.map(a => ({ ...a, id: 'anim_' + Date.now() + Math.random() })),
      children: layers.map(l => ({
        ...deepClone(l),
        x: l.x - minX,
        y: l.y - minY
      }))
    };

    const firstIdx = Math.min(...layers.map(l => scene.layers.indexOf(l)));
    scene.layers = scene.layers.filter(l => !ids.includes(l.id));
    scene.layers.splice(firstIdx, 0, group);

    selectLayer(groupId, false);
    saveState();
    renderAll();

    // Show animation inheritance info
    if (firstChildAnims.length > 0) {
      showToast(`Grouped — inherited ${firstChildAnims.length} animation(s) from "${layers[0].name}"`);
    } else {
      showToast(`Layers grouped — drag an animation from the catalog to animate the group`);
    }
  }

  function ungroupLayer(groupId) {
    const scene = getActiveScene();
    const idx = scene.layers.findIndex(l => l.id === groupId);
    const group = scene.layers[idx];
    if (!group || group.type !== 'group') return;

    const ungrouped = group.children.map(c => ({
      ...c,
      x: group.x + c.x,
      y: group.y + c.y,
      id: c.id || 'layer_' + Date.now() + Math.random()
    }));
    scene.layers.splice(idx, 1, ...ungrouped);
    selectLayer(null);
    saveState();
    renderAll();
    showToast('Group ungrouped');
  }

  function renderSidebarTab(tabName) {
    const container = document.getElementById('studioTabContent');
    const sbNav = document.querySelector('.sb-nav');
    container.innerHTML = '';
    
    if (tabName === 'anims') {
      if (sbNav) {
        sbNav.classList.remove('preview-only');
        sbNav.style.display = 'flex';
      }
      container.style.display = 'none';
    } else {
      if (sbNav) {
        sbNav.style.display = 'none';
      }
      container.style.display = 'flex';
      
      if (tabName === 'comps') {
        Object.keys(componentTemplates).forEach(name => {
          const div = document.createElement('div');
          div.className = 'draggable-comp-item';
          div.draggable = true;
          div.innerHTML = `
            <span class="comp-icon">✦</span>
            <span>${name}</span>
          `;
          
          div.addEventListener('dragstart', (e) => {
            currentDragType = 'component';
            currentDragData = JSON.stringify({ ...componentTemplates[name], _componentName: name });
          });
          
          div.addEventListener('click', () => {
            addComponentToScene(componentTemplates[name], name);
          });

          container.appendChild(div);
        });
      } else if (tabName === 'assets') {
        // Asset manager panel
        const uploadBtn = document.createElement('button');
        uploadBtn.className = 'add-scene-btn';
        uploadBtn.innerHTML = '📁 Upload Asset';
        uploadBtn.addEventListener('click', () => {
          const fileInput = document.createElement('input');
          fileInput.type = 'file';
          fileInput.accept = 'image/*';
          fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                const newAsset = {
                  id: 'asset_' + Date.now(),
                  name: file.name,
                  type: 'image',
                  url: e.target.result
                };
                state.project.assets.push(newAsset);
                renderSidebarTab('assets');
              };
              reader.readAsDataURL(file);
            }
          });
          fileInput.click();
        });
        container.appendChild(uploadBtn);

        const grid = document.createElement('div');
        grid.className = 'assets-grid';
        state.project.assets.forEach(asset => {
          const card = document.createElement('div');
          card.className = 'asset-card';
          card.draggable = true;
          card.innerHTML = `
            <img src="${asset.url}" class="asset-preview-img" alt=""/>
            <div class="asset-name">${asset.name}</div>
          `;
          card.addEventListener('dragstart', () => {
            currentDragType = 'component';
            currentDragData = JSON.stringify({ type: 'image', url: asset.url, width: 200, height: 150 });
          });
          card.addEventListener('click', () => {
            addComponentToScene({ type: 'image', url: asset.url, width: 200, height: 150 });
          });
          grid.appendChild(card);
        });
        container.appendChild(grid);
      }
    }
  }

  function addComponentToScene(template, componentName) {
    const scene = getActiveScene();
    const id = 'layer_' + Date.now();
    // Use provided component name, fallback to type-based name
    const baseName = componentName || template._componentName || 
      (template.type.charAt(0).toUpperCase() + template.type.slice(1));
    const { _componentName, ...cleanTemplate } = template; // strip internal key
    const newLayer = {
      id,
      name: baseName,
      x: 100 + (scene.layers.length * 10) % 200,
      y: 100 + (scene.layers.length * 10) % 200,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      animations: [],
      ...cleanTemplate
    };
    scene.layers.push(newLayer);
    selectLayer(id, false);
    saveState();
    renderAll();
  }

  function applyAnimToLayer(layerId, animName) {
    const scene = getActiveScene();
    const layer = scene.layers.find(l => l.id === layerId);
    if (!layer) return;

    // Place new animation after the end of the last existing one — no overlap
    const lastEnd = layer.animations.reduce((max, a) => Math.max(max, a.start + a.duration), 0);

    layer.animations.push({
      id: 'anim_' + Date.now(),
      name: animName,
      start: lastEnd,
      duration: 1000,
      easing: 'ease-out',
      infinite: false,
      direction: 'normal',
      fill: 'forwards'
    });

    saveState();
    renderAll();
    showToast(`Applied ${animName}`);
  }

  // Draw Layers List
  function renderLayersPanel() {
    const container = document.getElementById('layersList');
    container.innerHTML = '';
    const scene = getActiveScene();
    
    // Render list in reverse order so top layers are visible on top of list
    const layersCopy = [...scene.layers].reverse();
    
    layersCopy.forEach((layer) => {
      const activeClass = state.selectedLayerIds.includes(layer.id) ? 'active' : '';
      const div = document.createElement('div');
      div.className = `layer-item ${activeClass}`;
      div.draggable = true;
      
      div.innerHTML = `
        <div class="layer-item-left">
          <span class="layer-name-lbl">${escapeHTML(getLayerDisplayName(layer))}</span>
        </div>
        <div class="layer-item-actions">
          <button class="layer-btn btn-vis ${!layer.visible ? 'active-state' : ''}" title="Toggle Visibility">${layer.visible ? '👁' : '🕶'}</button>
          <button class="layer-btn btn-lock ${layer.locked ? 'active-state' : ''}" title="Toggle Lock">${layer.locked ? '🔒' : '🔓'}</button>
          <button class="layer-btn btn-del" title="Delete">🗑</button>
        </div>
      `;
      
      div.addEventListener('click', (e) => {
        if (e.target.closest('.layer-btn')) return;
        selectLayer(layer.id, e.shiftKey);
      });

      div.querySelector('.btn-vis').addEventListener('click', () => {
        layer.visible = !layer.visible;
        saveState();
        renderAll();
      });

      div.querySelector('.btn-lock').addEventListener('click', () => {
        layer.locked = !layer.locked;
        saveState();
        renderAll();
      });

      div.querySelector('.btn-del').addEventListener('click', () => {
        deleteLayer(layer.id);
      });

      // Drag and drop sorting inside list
      div.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', layer.id);
      });
      div.addEventListener('dragover', (e) => e.preventDefault());
      div.addEventListener('drop', (e) => {
        e.preventDefault();
        const draggedId = e.dataTransfer.getData('text/plain');
        if (draggedId !== layer.id) {
          reorderLayers(draggedId, layer.id);
        }
      });

      container.appendChild(div);
    });
  }

  function reorderLayers(draggedId, targetId) {
    const scene = getActiveScene();
    const draggedIndex = scene.layers.findIndex(l => l.id === draggedId);
    const targetIndex = scene.layers.findIndex(l => l.id === targetId);
    
    if (draggedIndex !== -1 && targetIndex !== -1) {
      const [draggedLayer] = scene.layers.splice(draggedIndex, 1);
      scene.layers.splice(targetIndex, 0, draggedLayer);
      saveState();
      renderAll();
    }
  }

  // --- Infinite Canvas Viewport Operations ---
  // NOTE: These are assigned AFTER initStudioDOM() creates the elements (called below at line ~2015)
  let canvasNode = null;
  let viewportNode = null;
  function initCanvasRefs() {
    canvasNode = document.getElementById('studioCanvas');
    viewportNode = document.getElementById('canvasViewport');
  }

  function selectLayer(layerId, isShift = false) {
    if (!layerId) {
      state.selectedLayerIds = [];
      state.selectedLayerId = null;
    } else {
      if (isShift) {
        if (state.selectedLayerIds.includes(layerId)) {
          state.selectedLayerIds = state.selectedLayerIds.filter(id => id !== layerId);
        } else {
          state.selectedLayerIds.push(layerId);
        }
      } else {
        state.selectedLayerIds = [layerId];
      }
      state.selectedLayerId = state.selectedLayerIds.length > 0 ? state.selectedLayerIds[state.selectedLayerIds.length - 1] : null;
    }
    
    // Toggle active state classes in DOM without rebuilding
    viewportNode.querySelectorAll('.canvas-element').forEach(el => {
      el.classList.toggle('selected', state.selectedLayerIds.includes(el.dataset.id));
    });
    
    renderLayersPanel();
    renderPropertyPanel();
  }

  function finishTextEdit(textNode, layer) {
    textNode.contentEditable = 'false';
    textNode.classList.remove('editing');
    const nextContent = textNode.textContent;
    if (layer.content !== nextContent) {
      layer.content = nextContent;
      saveState();
    }
    renderLayersPanel();
    renderPropertyPanel();
  }

  function beginTextEdit(textNode, layer) {
    selectLayer(layer.id);
    textNode.contentEditable = 'true';
    textNode.classList.add('editing');
    textNode.spellcheck = false;
    textNode.focus();

    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(textNode);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  function initCanvasControls() {
    const wrapper = document.getElementById('canvasWrapper');
    
    // Zoom commands
    document.getElementById('btnZoomIn').addEventListener('click', () => adjustZoom(0.1));
    document.getElementById('btnZoomOut').addEventListener('click', () => adjustZoom(-0.1));
    document.getElementById('btnZoomFit').addEventListener('click', () => {
      state.zoom = 1.0;
      state.panX = 0;
      state.panY = 0;
      applyCanvasTransform();
    });

    document.getElementById('btnSnapToggle').addEventListener('click', () => {
      state.snapGrid = !state.snapGrid;
      document.getElementById('btnSnapToggle').style.color = state.snapGrid ? '#7c3aed' : 'var(--text-muted)';
    });

    // Canvas resize modal toggle
    const resizeModal = document.getElementById('canvasResizeModal');
    document.getElementById('btnCanvasResize').addEventListener('click', (e) => {
      e.stopPropagation();
      resizeModal.style.display = resizeModal.style.display === 'none' ? 'block' : 'none';
    });
    document.addEventListener('click', (e) => {
      if (!resizeModal.contains(e.target) && e.target.id !== 'btnCanvasResize') {
        resizeModal.style.display = 'none';
      }
    });

    // Preset buttons
    resizeModal.querySelectorAll('.canvas-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        applyCanvasSize(parseInt(btn.dataset.w), parseInt(btn.dataset.h));
        resizeModal.style.display = 'none';
      });
    });

    // Custom apply
    document.getElementById('btnApplyCanvasSize').addEventListener('click', () => {
      const w = parseInt(document.getElementById('canvasCustomW').value);
      const h = parseInt(document.getElementById('canvasCustomH').value);
      if (w >= 100 && h >= 100) {
        applyCanvasSize(w, h);
        resizeModal.style.display = 'none';
      }
    });

    // Mouse wheel Zoom
    wrapper.addEventListener('wheel', (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const factor = e.deltaY < 0 ? 0.1 : -0.1;
        adjustZoom(factor);
      }
    });

    // Panning control
    wrapper.addEventListener('mousedown', (e) => {
      // Middle mouse button or Space key
      if (e.button === 1 || e.target === wrapper || e.target === canvasNode) {
        state.isPanning = true;
        state.dragStart = { x: e.clientX, y: e.clientY };
      }
    });

    // Marquee selection — drag on viewport background to rubber-band select
    viewportNode.addEventListener('mousedown', (e) => {
      if (e.target !== viewportNode) return; // only on background
      e.preventDefault();
      const rect = viewportNode.getBoundingClientRect();
      marqueeState.active = true;
      marqueeState.startX = (e.clientX - rect.left) / state.zoom;
      marqueeState.startY = (e.clientY - rect.top)  / state.zoom;

      if (!marqueeState.el) {
        const m = document.createElement('div');
        m.id = 'marqueeRect';
        m.style.cssText = `position:absolute;border:1.5px dashed #7c3aed;background:rgba(124,58,237,0.08);
          pointer-events:none;z-index:9999;border-radius:3px;`;
        viewportNode.appendChild(m);
        marqueeState.el = m;
      }
      marqueeState.el.style.display = 'block';
      marqueeState.el.style.left   = marqueeState.startX + 'px';
      marqueeState.el.style.top    = marqueeState.startY + 'px';
      marqueeState.el.style.width  = '0px';
      marqueeState.el.style.height = '0px';
    });

    window.addEventListener('mousemove', (e) => {
      if (state.isPanning) {
        const dx = e.clientX - state.dragStart.x;
        const dy = e.clientY - state.dragStart.y;
        state.panX += dx;
        state.panY += dy;
        state.dragStart = { x: e.clientX, y: e.clientY };
        applyCanvasTransform();
      }

      // Marquee drag
      if (marqueeState.active && marqueeState.el) {
        const rect = viewportNode.getBoundingClientRect();
        const curX = (e.clientX - rect.left) / state.zoom;
        const curY = (e.clientY - rect.top)  / state.zoom;
        const x = Math.min(curX, marqueeState.startX);
        const y = Math.min(curY, marqueeState.startY);
        const w = Math.abs(curX - marqueeState.startX);
        const h = Math.abs(curY - marqueeState.startY);
        marqueeState.el.style.left   = x + 'px';
        marqueeState.el.style.top    = y + 'px';
        marqueeState.el.style.width  = w + 'px';
        marqueeState.el.style.height = h + 'px';
      }

      // Element dragging
      if (state.isDraggingElements && state.dragStartPositions) {
        const dx = (e.clientX - state.dragStartMouse.x) / state.zoom;
        const dy = (e.clientY - state.dragStartMouse.y) / state.zoom;
        const snap = (v, size) => state.snapGrid ? Math.round(v / size) * size : v;
        const scene = getActiveScene();
        Object.entries(state.dragStartPositions).forEach(([id, startPos]) => {
          const l = scene.layers.find(ly => ly.id === id);
          if (l) {
            l.x = snap(startPos.x + dx, state.gridSize);
            l.y = snap(startPos.y + dy, state.gridSize);
          }
        });
        renderCanvas();
        renderPropertyPanel();
      }
    });

    window.addEventListener('mouseup', (e) => {
      state.isPanning = false;

      // Finish marquee — hit-test layers
      if (marqueeState.active) {
        marqueeState.active = false;
        if (marqueeState.el) marqueeState.el.style.display = 'none';

        const rect = viewportNode.getBoundingClientRect();
        const curX = (e.clientX - rect.left) / state.zoom;
        const curY = (e.clientY - rect.top)  / state.zoom;
        const rx = Math.min(curX, marqueeState.startX);
        const ry = Math.min(curY, marqueeState.startY);
        const rw = Math.abs(curX - marqueeState.startX);
        const rh = Math.abs(curY - marqueeState.startY);

        if (rw > 4 && rh > 4) {
          const scene = getActiveScene();
          const hit = scene.layers.filter(l => l.visible && !l.locked &&
            l.x < rx + rw && l.x + l.width  > rx &&
            l.y < ry + rh && l.y + l.height > ry
          ).map(l => l.id);

          if (hit.length > 0) {
            state.selectedLayerIds = hit;
            state.selectedLayerId  = hit[hit.length - 1];
            renderAll();
          }
        }
      }

      // Finish element drag
      if (state.isDraggingElements) {
        state.isDraggingElements = false;
        state.dragStartPositions = null;
        saveState();
      }
    });

    // Drag Over to add components
    viewportNode.addEventListener('dragenter', (e) => {
      e.preventDefault();
      viewportNode.classList.add('drag-over');
    });
    viewportNode.addEventListener('dragover', (e) => {
      e.preventDefault();
    });
    viewportNode.addEventListener('dragleave', (e) => {
      // Only remove if leaving the viewport entirely (not entering a child)
      if (!viewportNode.contains(e.relatedTarget)) {
        viewportNode.classList.remove('drag-over');
      }
    });

    // Also accept drops on the canvas background itself
    canvasNode.addEventListener('dragover', (e) => { e.preventDefault(); });
    canvasNode.addEventListener('drop', (e) => {
      // Re-dispatch to viewportNode drop handler logic
      e.preventDefault();
      viewportNode.classList.remove('drag-over');
      const rect = viewportNode.getBoundingClientRect();
      const rawX = (e.clientX - rect.left) / state.zoom;
      const rawY = (e.clientY - rect.top) / state.zoom;
      const snap = (v) => state.snapGrid ? Math.round(v / state.gridSize) * state.gridSize : v;
      const x = snap(rawX);
      const y = snap(rawY);
      if (currentDragType === 'component') {
        const rawTemplate = JSON.parse(currentDragData);
        const { _componentName, ...template } = rawTemplate;
        const scene = getActiveScene();
        const id = 'layer_' + Date.now();
        const baseName = _componentName || (template.type.charAt(0).toUpperCase() + template.type.slice(1));
        const newLayer = { id, name: baseName, x, y, rotation: 0, opacity: 1, visible: true, locked: false, animations: [], ...template };
        scene.layers.push(newLayer);
        selectLayer(id, false);
        saveState();
        renderAll();
      }
    });

    wrapper.addEventListener('dragover', (e) => { e.preventDefault(); });

    viewportNode.addEventListener('drop', (e) => {
      e.preventDefault();
      viewportNode.classList.remove('drag-over');
      const rect = viewportNode.getBoundingClientRect();
      const rawX = (e.clientX - rect.left) / state.zoom;
      const rawY = (e.clientY - rect.top) / state.zoom;
      
      const snap = (v) => state.snapGrid ? Math.round(v / state.gridSize) * state.gridSize : v;
      const x = snap(rawX);
      const y = snap(rawY);

      if (currentDragType === 'component') {
        const rawTemplate = JSON.parse(currentDragData);
        const { _componentName, ...template } = rawTemplate;
        const scene = getActiveScene();
        const id = 'layer_' + Date.now();
        const baseName = _componentName ||
          (template.type.charAt(0).toUpperCase() + template.type.slice(1));
        const newLayer = {
          id,
          name: baseName,
          x,
          y,
          rotation: 0,
          opacity: 1,
          visible: true,
          locked: false,
          animations: [],
          ...template
        };
        scene.layers.push(newLayer);
        selectLayer(id, false);
        saveState();
        renderAll();
      } else if (currentDragType === 'animation') {
        // Dragging animation from sidebar to elements
        const elementNode = document.elementFromPoint(e.clientX, e.clientY);
        const canvasEl = elementNode ? elementNode.closest('.canvas-element') : null;
        if (canvasEl) {
          applyAnimToLayer(canvasEl.dataset.id, currentDragData);
        }
      }
    });
  }

  function adjustZoom(factor) {
    state.zoom = Math.max(0.2, Math.min(3.0, state.zoom + factor));
    applyCanvasTransform();
  }

  // Fit the 800x600 viewport frame perfectly centered in the canvas wrapper
  function fitViewportToWrapper(animate) {
    const wrapper = document.getElementById('canvasWrapper');
    if (!wrapper) return;
    const ww = wrapper.clientWidth;
    const wh = wrapper.clientHeight;

    // The viewport frame is 800x600, centered at (1500,1500) inside the 3000x3000 canvas
    const frameW = 800, frameH = 600;
    const frameCX = 1500, frameCY = 1500; // center of frame in canvas coords

    // Fit with 10% padding on each side
    const padding = 0.82;
    const zoomX = (ww / frameW) * padding;
    const zoomY = (wh / frameH) * padding;
    const zoom = Math.min(zoomX, zoomY, 1.2); // cap at 120% to avoid huge on large screens

    // Pan so the frame center maps to the wrapper center
    // canvas transforms: screenX = panX + canvasX * zoom
    // We want frameCX * zoom + panX = ww/2  =>  panX = ww/2 - frameCX * zoom
    const panX = ww / 2 - frameCX * zoom;
    const panY = wh / 2 - frameCY * zoom;

    if (animate) {
      canvasNode.style.transition = 'transform 0.5s cubic-bezier(0.22,1,0.36,1)';
      setTimeout(() => { canvasNode.style.transition = ''; }, 550);
    }

    state.zoom = zoom;
    state.panX = panX;
    state.panY = panY;
    applyCanvasTransform();
  }

  function applyCanvasTransform() {
    canvasNode.style.transform = `translate(${state.panX}px, ${state.panY}px) scale(${state.zoom})`;
    document.getElementById('zoomVal').textContent = `${Math.round(state.zoom * 100)}%`;
    renderRulers();
  }

  // Apply a new canvas size — updates the viewport frame and re-centers
  function applyCanvasSize(w, h) {
    state.canvasWidth  = w;
    state.canvasHeight = h;
    const vp = document.getElementById('canvasViewport');
    if (vp) {
      vp.style.width  = w + 'px';
      vp.style.height = h + 'px';
    }
    document.getElementById('canvasSizeLabel').textContent = `${w}×${h}`;
    document.getElementById('canvasCustomW').value = w;
    document.getElementById('canvasCustomH').value = h;
    centerCanvas();
    renderRulers();
    showToast(`Canvas: ${w}×${h}`);
  }

  // Fit the canvas into the wrapper with padding, perfectly centered
  function centerCanvas() {
    const wrapper = document.getElementById('canvasWrapper');
    if (!wrapper) return false;

    const wW = wrapper.clientWidth;
    const wH = wrapper.clientHeight;
    if (wW < 100 || wH < 100) return false;

    const CANVAS_W = state.canvasWidth  || 800;
    const CANVAS_H = state.canvasHeight || 600;
    const PADDING  = 64;

    const fitZoom = Math.min(
      (wW - PADDING * 2) / CANVAS_W,
      (wH - PADDING * 2) / CANVAS_H
    );
    state.zoom = Math.max(0.1, Math.min(2, parseFloat(fitZoom.toFixed(3))));

    const scaledW = CANVAS_W * state.zoom;
    const scaledH = CANVAS_H * state.zoom;
    state.panX = Math.round((wW - scaledW) / 2);
    state.panY = Math.round((wH - scaledH) / 2);

    applyCanvasTransform();
    return true;
  }

  function renderRulers() {
    const rx = document.getElementById('rulerX');
    const ry = document.getElementById('rulerY');
    rx.innerHTML = '';
    ry.innerHTML = '';
    
    // Draw simplified incremental ruler markings to fit canvas bounds
    for (let i = 0; i < 1500; i += 100) {
      const tx = document.createElement('div');
      tx.className = 'ruler-tick major';
      tx.style.left = `${i}px`;
      tx.style.height = '12px';
      tx.innerHTML = `<span style="position:absolute;left:2px;bottom:2px;">${i}</span>`;
      rx.appendChild(tx);

      const ty = document.createElement('div');
      ty.className = 'ruler-tick major';
      ty.style.top = `${i}px`;
      ty.style.width = '12px';
      ty.innerHTML = `<span style="position:absolute;top:2px;left:2px;writing-mode:vertical-rl;">${i}</span>`;
      ry.appendChild(ty);
    }
  }

  // Draw elements on canvas
  function renderCanvas() {
    const scene = getActiveScene();
    
    // Clear old elements (keep the viewport border node), cancelling any WAAPI snapshot anims
    const oldElems = viewportNode.querySelectorAll('.canvas-element');
    oldElems.forEach(el => {
      if (el._snapAnim) { try { el._snapAnim.cancel(); } catch(e) {} }
      // Cancel all cached WAAPI animations
      if (el._animCache) {
        Object.values(el._animCache).forEach(wa => { try { wa.cancel(); } catch(e) {} });
      }
      el.remove();
    });

    scene.layers.forEach((layer) => {
      if (!layer.visible) return;

      const div = document.createElement('div');
      const isSelected = state.selectedLayerIds.includes(layer.id);
      const isPrimary  = layer.id === state.selectedLayerId;
      div.className = `canvas-element${isPrimary ? ' selected' : isSelected ? ' multi-selected' : ''}`;
      div.dataset.id = layer.id;
      div.style.left = `${layer.x}px`;
      div.style.top = `${layer.y}px`;
      div.style.width = `${layer.width}px`;
      div.style.height = `${layer.height}px`;
      div.style.transform = `rotate(${layer.rotation}deg)`;
      div.style.opacity = layer.opacity;

      // Handle custom inner HTML types
      if (layer.type === 'text') {
        const textDiv = document.createElement('div');
        textDiv.className = 'element-text';
        textDiv.contentEditable = 'false';
        textDiv.spellcheck = false;
        textDiv.style.fontSize = `${layer.fontSize}px`;
        textDiv.style.fontWeight = layer.fontWeight;
        textDiv.style.fontFamily = layer.fontFamily;
        textDiv.style.color = layer.color;
        textDiv.style.letterSpacing = layer.letterSpacing;
        textDiv.style.lineHeight = layer.lineHeight;
        textDiv.style.textAlign = layer.alignment;
        textDiv.textContent = layer.content;
        
        textDiv.addEventListener('input', () => {
          layer.content = textDiv.textContent;
          renderLayersPanel();
          renderPropertyPanel();
        });
        textDiv.addEventListener('blur', () => finishTextEdit(textDiv, layer));
        textDiv.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            e.preventDefault();
            textDiv.textContent = layer.content;
            textDiv.blur();
          }
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            textDiv.blur();
          }
        });
        div.appendChild(textDiv);
      } else if (layer.type === 'shape') {
        const shapeDiv = document.createElement('div');
        shapeDiv.className = 'element-shape';
        shapeDiv.style.background = layer.fill;
        shapeDiv.style.borderRadius = layer.shapeType === 'circle' ? '50%' : `${layer.radius || 0}px`;
        div.appendChild(shapeDiv);
      } else if (layer.type === 'image') {
        const img = document.createElement('img');
        img.className = 'element-image';
        img.src = layer.url;
        if (layer.radius !== undefined) {
          img.style.borderRadius = `${layer.radius}px`;
        }
        div.appendChild(img);
      } else if (layer.type === 'imageframe') {
        // Rectangle image frame with overflow:hidden clipping, pan & zoom
        div.style.borderRadius = `${layer.radius || 0}px`;
        div.style.overflow = 'hidden';
        div.style.background = 'rgba(255,255,255,0.05)';
        div.style.border = layer.imgUrl ? 'none' : '2px dashed rgba(167,139,250,0.4)';

        const inner = document.createElement('div');
        inner.className = 'image-frame-inner';
        inner.style.borderRadius = `${layer.radius || 0}px`;

        if (layer.imgUrl) {
          const img = document.createElement('img');
          img.src = layer.imgUrl;
          img.draggable = false;
          const scale = layer.imgScale || 1;
          const ox = layer.imgX || 0;
          const oy = layer.imgY || 0;
          img.style.cssText = `
            position:absolute;
            width:${100 * scale}%;
            height:${100 * scale}%;
            left:50%; top:50%;
            transform: translate(calc(-50% + ${ox}px), calc(-50% + ${oy}px));
            object-fit:cover;
            pointer-events:none;
            user-select:none;
          `;
          inner.appendChild(img);
        } else {
          inner.innerHTML = `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;
            width:100%;height:100%;color:rgba(167,139,250,0.6);font-size:13px;gap:6px;pointer-events:none;">
            <span style="font-size:28px;">🖼️</span>
            <span>Image Frame</span>
            <span style="font-size:10px;opacity:0.6;">Select & upload in Inspector</span>
          </div>`;
        }
        div.appendChild(inner);
      } else if (layer.type === 'ui') {
        const uiDiv = document.createElement('div');
        uiDiv.className = 'element-ui';
        uiDiv.innerHTML = buildUIHtml(layer);
        div.appendChild(uiDiv);
      } else if (layer.type === 'group') {
        div.style.border = '1.5px dashed rgba(124,58,237,0.45)';
        div.style.borderRadius = '4px';
        div.style.background = 'rgba(124,58,237,0.03)';
        div.style.overflow = 'visible'; // children may have shadows/overflow

        const label = document.createElement('div');
        label.style.cssText = `position:absolute;top:-20px;left:0;font-size:9px;font-weight:700;
          color:#a78bfa;background:rgba(124,58,237,0.18);padding:2px 7px;border-radius:3px;
          white-space:nowrap;pointer-events:none;z-index:1;`;
        label.textContent = layer.name;
        div.appendChild(label);

        // Render every child fully — same logic as top-level layer rendering
        (layer.children || []).forEach(child => {
          const cd = document.createElement('div');
          cd.style.cssText = `position:absolute;left:${child.x}px;top:${child.y}px;
            width:${child.width}px;height:${child.height}px;pointer-events:none;box-sizing:border-box;`;

          if (child.type === 'text') {
            cd.style.cssText += `font-size:${child.fontSize || 16}px;font-weight:${child.fontWeight || '400'};
              color:${child.color || '#fff'};line-height:${child.lineHeight || '1.4'};
              text-align:${child.alignment || 'left'};white-space:pre-wrap;overflow:hidden;`;
            cd.textContent = child.content || '';

          } else if (child.type === 'shape') {
            const isCircle = child.shapeType === 'circle';
            cd.style.background = child.fill || '#666';
            cd.style.borderRadius = isCircle ? '50%' : (child.radius || 0) + 'px';

          } else if (child.type === 'ui') {
            // Use buildUIHtml so structured-field components (card, button, avatar, notification)
            // render correctly — child.html no longer exists for new components
            const uiWrap = document.createElement('div');
            uiWrap.className = 'element-ui';
            uiWrap.style.cssText = 'width:100%;height:100%;';
            uiWrap.innerHTML = buildUIHtml(child);
            cd.appendChild(uiWrap);

          } else if (child.type === 'image') {
            const img = document.createElement('img');
            img.src = child.url || '';
            img.style.cssText = `width:100%;height:100%;object-fit:cover;
              border-radius:${child.radius || 0}px;display:block;`;
            img.draggable = false;
            cd.appendChild(img);
          }

          div.appendChild(cd);
        });
      }

      // Add selection and resize corners using insertAdjacentHTML to preserve text listeners
      div.insertAdjacentHTML('beforeend', `
        <div class="resize-handle tl"></div>
        <div class="resize-handle tr"></div>
        <div class="resize-handle bl"></div>
        <div class="resize-handle br"></div>
        <div class="rotate-handle"></div>
      `);

      // Select Action
      div.addEventListener('mousedown', (e) => {
        if (layer.locked) return;

        // If clicking inside an actively-edited text node, don't interfere
        if (e.target.closest('.element-text.editing')) {
          e.stopPropagation();
          return;
        }
        
        // Don't start drag from resize/rotate handles
        if (e.target.classList.contains('resize-handle') || e.target.classList.contains('rotate-handle')) return;
        
        e.stopPropagation();
        
        const isShift = e.shiftKey;
        // If clicking an unselected element without Shift, select it immediately
        if (!state.selectedLayerIds.includes(layer.id) && !isShift) {
          selectLayer(layer.id, false);
        } else if (isShift) {
          selectLayer(layer.id, true);
        }

        // Initialize drag for all selected layers
        state.isDraggingElements = true;
        state.dragStartMouse = { x: e.clientX, y: e.clientY };
        state.dragStartPositions = {};
        
        state.selectedLayerIds.forEach(id => {
          const l = getActiveScene().layers.find(ly => ly.id === id);
          if (l && !l.locked && l.visible) {
            state.dragStartPositions[id] = { x: l.x, y: l.y };
          }
        });
      });
      
      // Double-click to edit text
      div.addEventListener('dblclick', (e) => {
        if (layer.type !== 'text' || layer.locked) return;
        const textNode = div.querySelector('.element-text');
        if (!textNode) return;
        e.preventDefault();
        e.stopPropagation();
        beginTextEdit(textNode, layer);
      });

      // Drag & drop animations onto this layer
      div.addEventListener('dragover', (e) => {
        if (currentDragType === 'animation') {
          e.preventDefault();
          div.classList.add('drag-hover');
        }
      });
      div.addEventListener('dragleave', () => {
        div.classList.remove('drag-hover');
      });
      div.addEventListener('drop', (e) => {
        if (currentDragType === 'animation') {
          e.preventDefault();
          div.classList.remove('drag-hover');
          applyAnimToLayer(layer.id, currentDragData);
        }
      });

      // Handle Resize / Rotation mouse bindings
      bindHandles(div, layer);

      viewportNode.appendChild(div);
    });
  }

  function bindHandles(divNode, layer) {
    const handles = divNode.querySelectorAll('.resize-handle');
    const rotateHandle = divNode.querySelector('.rotate-handle');

    handles.forEach(handle => {
      handle.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        e.preventDefault();
        
        const isRight = handle.classList.contains('tr') || handle.classList.contains('br');
        const isBottom = handle.classList.contains('bl') || handle.classList.contains('br');
        const isLeft = handle.classList.contains('tl') || handle.classList.contains('bl');
        const isTop = handle.classList.contains('tl') || handle.classList.contains('tr');
        
        const startX = e.clientX;
        const startY = e.clientY;
        const originalWidth = layer.width;
        const originalHeight = layer.height;
        const originalX = layer.x;
        const originalY = layer.y;
        
        const onMouseMove = (moveEvt) => {
          const dx = (moveEvt.clientX - startX) / state.zoom;
          const dy = (moveEvt.clientY - startY) / state.zoom;
          
          if (isRight) {
            layer.width = Math.max(20, originalWidth + dx);
          } else if (isLeft) {
            const nextWidth = Math.max(20, originalWidth - dx);
            layer.x = originalX + (originalWidth - nextWidth);
            layer.width = nextWidth;
          }
          if (isBottom) {
            layer.height = Math.max(20, originalHeight + dy);
          } else if (isTop) {
            const nextHeight = Math.max(20, originalHeight - dy);
            layer.y = originalY + (originalHeight - nextHeight);
            layer.height = nextHeight;
          }
          renderCanvas();
          renderPropertyPanel();
        };

        const onMouseUp = () => {
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
          saveState();
          renderAll();
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
      });
    });

    rotateHandle.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      e.preventDefault();
      
      const rect = divNode.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const onMouseMove = (moveEvt) => {
        const rad = Math.atan2(moveEvt.clientY - cy, moveEvt.clientX - cx);
        let deg = rad * (180 / Math.PI) - 90; // subtract 90 since rotate handle is top-centered
        layer.rotation = Math.round(deg);
        renderCanvas();
        renderPropertyPanel();
      };

      const onMouseUp = () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        saveState();
        renderAll();
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    });
  }

  // Handle Dragging Canvas Elements
  window.addEventListener('mousemove', (e) => {
    if (state.isDraggingElements) {
      const dx = (e.clientX - state.dragStartMouse.x) / state.zoom;
      const dy = (e.clientY - state.dragStartMouse.y) / state.zoom;
      
      const snap = (v) => state.snapGrid ? Math.round(v / state.gridSize) * state.gridSize : v;
      
      state.selectedLayerIds.forEach(id => {
        const startPos = state.dragStartPositions[id];
        const l = getActiveScene().layers.find(ly => ly.id === id);
        if (l && startPos) {
          l.x = snap(startPos.x + dx);
          l.y = snap(startPos.y + dy);
        }
      });
      renderCanvas();
      renderPropertyPanel();
    }
  });

  // --- Property Inspector Renderer ---
  function renderPropertyPanel() {
    const container = document.getElementById('inspectorContent');
    const scene = getActiveScene();

    // Multi-selection panel
    if (state.selectedLayerIds.length > 1) {
      container.innerHTML = `
        <div style="padding:0.5rem 0;">
          <div style="font-size:0.72rem;font-weight:700;color:#a78bfa;margin-bottom:0.75rem;">
            ${state.selectedLayerIds.length} layers selected
          </div>
          <button id="btnGroupLayers" style="width:100%;padding:0.55rem;background:linear-gradient(135deg,#7c3aed,#6366f1);
            color:#fff;border:none;border-radius:8px;font-weight:700;font-size:0.78rem;cursor:pointer;
            box-shadow:0 4px 12px rgba(124,58,237,0.35);margin-bottom:0.5rem;">
            ⬡ Group Layers (Ctrl+G)
          </button>
          <div style="font-size:0.68rem;color:var(--text-muted);line-height:1.5;">
            ${state.selectedLayerIds.map(id => {
              const l = scene.layers.find(x => x.id === id);
              return l ? `<div style="padding:2px 0;">· ${l.name}</div>` : '';
            }).join('')}
          </div>
        </div>`;
      document.getElementById('btnGroupLayers')?.addEventListener('click', groupSelectedLayers);
      return;
    }

    const layer = scene.layers.find(l => l.id === state.selectedLayerId);
    
    if (!layer) {
      container.innerHTML = `<span style="color:var(--text-muted);font-size:0.75rem;">Select a canvas layer to edit properties</span>`;
      return;
    }

    let fields = `
        <div class="property-group">
          <label class="property-lbl">Name</label>
        <input type="text" class="property-input prop-change" data-prop="name" value="${escapeHTML(layer.name)}"/>
      </div>
      <div class="property-row-split">
        <div class="property-group">
          <label class="property-lbl">X Position</label>
          <input type="number" class="property-input prop-change" data-prop="x" value="${layer.x}"/>
        </div>
        <div class="property-group">
          <label class="property-lbl">Y Position</label>
          <input type="number" class="property-input prop-change" data-prop="y" value="${layer.y}"/>
        </div>
      </div>
      <div class="property-row-split">
        <div class="property-group">
          <label class="property-lbl">Width</label>
          <input type="number" class="property-input prop-change" data-prop="width" value="${layer.width}"/>
        </div>
        <div class="property-group">
          <label class="property-lbl">Height</label>
          <input type="number" class="property-input prop-change" data-prop="height" value="${layer.height}"/>
        </div>
      </div>
      <div class="property-row-split">
        <div class="property-group">
          <label class="property-lbl">Rotation (deg)</label>
          <input type="number" class="property-input prop-change" data-prop="rotation" value="${layer.rotation}"/>
        </div>
        <div class="property-group">
          <label class="property-lbl">Opacity</label>
          <input type="number" class="property-input prop-change" data-prop="opacity" min="0" max="1" step="0.1" value="${layer.opacity}"/>
        </div>
      </div>
    `;

    // Type specific options
    if (layer.type === 'text') {
      fields += `
        <div class="property-group">
          <label class="property-lbl">Content</label>
          <textarea class="property-input prop-change" data-prop="content" rows="3">${escapeHTML(layer.content)}</textarea>
        </div>
        <div class="property-row-split">
          <div class="property-group">
            <label class="property-lbl">Font Size (px)</label>
            <input type="number" class="property-input prop-change" data-prop="fontSize" value="${layer.fontSize}"/>
          </div>
          <div class="property-group">
            <label class="property-lbl">Font Weight</label>
            <select class="property-input prop-change" data-prop="fontWeight">
              <option value="300" ${layer.fontWeight == '300' ? 'selected' : ''}>Light (300)</option>
              <option value="400" ${layer.fontWeight == '400' ? 'selected' : ''}>Regular (400)</option>
              <option value="500" ${layer.fontWeight == '500' ? 'selected' : ''}>Medium (500)</option>
              <option value="600" ${layer.fontWeight == '600' ? 'selected' : ''}>SemiBold (600)</option>
              <option value="700" ${layer.fontWeight == '700' ? 'selected' : ''}>Bold (700)</option>
            </select>
          </div>
        </div>
        <div class="property-row-split">
          <div class="property-group">
            <label class="property-lbl">Font Family</label>
            <select class="property-input prop-change" data-prop="fontFamily">
              <option value="Inter" ${layer.fontFamily === 'Inter' ? 'selected' : ''}>Inter</option>
              <option value="Arial" ${layer.fontFamily === 'Arial' ? 'selected' : ''}>Arial</option>
              <option value="sans-serif" ${layer.fontFamily === 'sans-serif' ? 'selected' : ''}>Sans-Serif</option>
              <option value="serif" ${layer.fontFamily === 'serif' ? 'selected' : ''}>Serif</option>
              <option value="monospace" ${layer.fontFamily === 'monospace' ? 'selected' : ''}>Monospace</option>
            </select>
          </div>
          <div class="property-group">
            <label class="property-lbl">Alignment</label>
            <select class="property-input prop-change" data-prop="alignment">
              <option value="left" ${layer.alignment === 'left' ? 'selected' : ''}>Left</option>
              <option value="center" ${layer.alignment === 'center' ? 'selected' : ''}>Center</option>
              <option value="right" ${layer.alignment === 'right' ? 'selected' : ''}>Right</option>
            </select>
          </div>
        </div>
        <div class="property-group">
          <label class="property-lbl">Color</label>
          <div class="property-color-picker">
            <input type="color" class="prop-color-input" data-prop="color" value="${escapeHTML(layer.color)}"/>
            <input type="text" class="property-input prop-change" data-prop="color" value="${escapeHTML(layer.color)}" style="flex:1;"/>
          </div>
        </div>
      `;
    } else if (layer.type === 'shape') {
      fields += `
        <div class="property-group">
          <label class="property-lbl">Fill Color</label>
          <div class="property-color-picker">
              <input type="color" class="prop-color-input" data-prop="fill" value="${escapeHTML(layer.fill)}"/>
              <input type="text" class="property-input prop-change" data-prop="fill" value="${escapeHTML(layer.fill)}" style="flex:1;"/>
          </div>
        </div>
        <div class="property-group">
          <label class="property-lbl">Border Radius</label>
          <input type="number" class="property-input prop-change" data-prop="radius" value="${layer.radius || 0}"/>
        </div>
      `;
    } else if (layer.type === 'image') {
      fields += `
        <div class="property-group">
          <label class="property-lbl">Image URL</label>
          <input type="text" class="property-input prop-change" data-prop="url" value="${escapeHTML(layer.url)}"/>
        </div>
        <div class="property-group">
          <label class="property-lbl">Border Radius</label>
          <input type="number" class="property-input prop-change" data-prop="radius" value="${layer.radius || 0}"/>
        </div>
      `;
    } else if (layer.type === 'imageframe') {
      fields += `
        <div class="inspector-sec-title">Image Frame</div>
        <div id="imgframeDropZone" style="border:2px dashed rgba(124,58,237,0.4);border-radius:10px;
          padding:14px;text-align:center;cursor:pointer;margin-bottom:0.5rem;
          background:rgba(124,58,237,0.05);transition:all 0.2s;">
          <div style="font-size:1.5rem;">🖼️</div>
          <div style="font-size:0.68rem;color:var(--text-muted);margin-top:4px;">Drop image or click to upload</div>
          <input type="file" id="imgframeFileInput" accept="image/*" style="display:none;"/>
        </div>
        ${layer.imgUrl ? `<div style="display:flex;justify-content:center;margin-bottom:0.5rem;">
          <img src="${escapeHTML(layer.imgUrl)}" style="width:72px;height:54px;border-radius:${layer.radius||0}px;object-fit:cover;border:2px solid rgba(124,58,237,0.4);"/>
        </div>` : ''}
        <div class="property-group">
          <label class="property-lbl">Image URL</label>
          <input type="text" class="property-input imgframe-prop" data-prop="imgUrl"
            placeholder="https://... or upload above"
            value="${escapeHTML(layer.imgUrl||'')}"/>
        </div>
        <div class="inspector-sec-title" style="margin-top:0.5rem;">Image Position & Scale</div>
        <div class="property-group">
          <label class="property-lbl">Scale (1 = fit, &gt;1 = zoom in)</label>
          <div style="display:flex;align-items:center;gap:8px;">
            <input type="range" class="property-input imgframe-prop" data-prop="imgScale"
              min="0.5" max="4" step="0.05" value="${layer.imgScale||1}" style="flex:1;"/>
            <span style="font-size:0.72rem;color:#a78bfa;min-width:32px;" id="imgScaleVal">${(layer.imgScale||1).toFixed(2)}×</span>
          </div>
        </div>
        <div class="property-row-split">
          <div class="property-group">
            <label class="property-lbl">Pan X (px)</label>
            <input type="number" class="property-input imgframe-prop" data-prop="imgX" value="${layer.imgX||0}"/>
          </div>
          <div class="property-group">
            <label class="property-lbl">Pan Y (px)</label>
            <input type="number" class="property-input imgframe-prop" data-prop="imgY" value="${layer.imgY||0}"/>
          </div>
        </div>
        <div class="property-group">
          <label class="property-lbl">Corner Radius (px)</label>
          <input type="number" class="property-input imgframe-prop" data-prop="radius" value="${layer.radius||0}"/>
        </div>
      `;
    
    } else if (layer.type === 'ui') {
      const t = layer.template;

      if (t === 'card') {
        fields += `
          <div class="inspector-sec-title">Card Content</div>
          <div class="property-group">
            <label class="property-lbl">Icon / Emoji</label>
            <input type="text" class="property-input ui-prop" data-prop="cardIcon" value="${escapeHTML(layer.cardIcon||'✦')}"/>
          </div>
          <div class="property-group">
            <label class="property-lbl">Title</label>
            <input type="text" class="property-input ui-prop" data-prop="cardTitle" value="${escapeHTML(layer.cardTitle||'')}"/>
          </div>
          <div class="property-group">
            <label class="property-lbl">Subtitle</label>
            <input type="text" class="property-input ui-prop" data-prop="cardSubtitle" value="${escapeHTML(layer.cardSubtitle||'')}"/>
          </div>
          <div class="inspector-sec-title" style="margin-top:0.75rem;">Card Style</div>
          <div class="property-row-split">
            <div class="property-group">
              <label class="property-lbl">Background</label>
              <div class="property-color-picker">
                <input type="color" class="prop-color-input ui-color-prop" data-prop="cardBg" value="${layer.cardBg||'#1a1a2e'}"/>
                <input type="text" class="property-input ui-prop" data-prop="cardBg" value="${escapeHTML(layer.cardBg||'#1a1a2e')}" style="flex:1;"/>
              </div>
            </div>
            <div class="property-group">
              <label class="property-lbl">Accent</label>
              <div class="property-color-picker">
                <input type="color" class="prop-color-input ui-color-prop" data-prop="cardAccent" value="${layer.cardAccent||'#7c3aed'}"/>
                <input type="text" class="property-input ui-prop" data-prop="cardAccent" value="${escapeHTML(layer.cardAccent||'#7c3aed')}" style="flex:1;"/>
              </div>
            </div>
          </div>`;
      }

      if (t === 'button') {
        fields += `
          <div class="inspector-sec-title">Button Content</div>
          <div class="property-group">
            <label class="property-lbl">Label Text</label>
            <input type="text" class="property-input ui-prop" data-prop="btnLabel" value="${escapeHTML(layer.btnLabel||'Button')}"/>
          </div>
          <div class="inspector-sec-title" style="margin-top:0.75rem;">Button Style</div>
          <div class="property-row-split">
            <div class="property-group">
              <label class="property-lbl">Background</label>
              <div class="property-color-picker">
                <input type="color" class="prop-color-input ui-color-prop" data-prop="btnBg" value="${layer.btnBg||'#7c3aed'}"/>
                <input type="text" class="property-input ui-prop" data-prop="btnBg" value="${escapeHTML(layer.btnBg||'#7c3aed')}" style="flex:1;"/>
              </div>
            </div>
            <div class="property-group">
              <label class="property-lbl">Text Color</label>
              <div class="property-color-picker">
                <input type="color" class="prop-color-input ui-color-prop" data-prop="btnColor" value="${layer.btnColor||'#ffffff'}"/>
                <input type="text" class="property-input ui-prop" data-prop="btnColor" value="${escapeHTML(layer.btnColor||'#ffffff')}" style="flex:1;"/>
              </div>
            </div>
          </div>
          <div class="property-row-split">
            <div class="property-group">
              <label class="property-lbl">Border Radius</label>
              <input type="number" class="property-input ui-prop" data-prop="btnRadius" value="${layer.btnRadius??14}"/>
            </div>
            <div class="property-group">
              <label class="property-lbl">Font Size</label>
              <input type="number" class="property-input ui-prop" data-prop="btnFontSize" value="${layer.btnFontSize||15}"/>
            </div>
          </div>`;
      }

      if (t === 'avatar') {
        fields += `
          <div class="inspector-sec-title">Avatar Image</div>
          <div class="property-group">
            <label class="property-lbl">Image URL</label>
            <input type="text" class="property-input ui-prop" data-prop="avatarUrl"
              placeholder="https://... or drop an image file below"
              value="${escapeHTML(layer.avatarUrl||'')}"/>
          </div>
          <div id="avatarDropZone" style="border:2px dashed rgba(124,58,237,0.4);border-radius:10px;
            padding:14px;text-align:center;cursor:pointer;margin-bottom:0.5rem;
            background:rgba(124,58,237,0.05);transition:all 0.2s;">
            <div style="font-size:1.5rem;">🖼️</div>
            <div style="font-size:0.68rem;color:var(--text-muted);margin-top:4px;">Drop image or click to upload</div>
            <input type="file" id="avatarFileInput" accept="image/*" style="display:none;"/>
          </div>
          ${layer.avatarUrl ? `<div style="display:flex;justify-content:center;margin-bottom:0.5rem;">
            <img src="${escapeHTML(layer.avatarUrl)}" style="width:56px;height:56px;border-radius:${layer.avatarRadius??50}%;object-fit:cover;border:2px solid rgba(124,58,237,0.4);"/>
          </div>` : ''}
          <div class="inspector-sec-title" style="margin-top:0.5rem;">Fallback (no image)</div>
          <div class="property-row-split">
            <div class="property-group">
              <label class="property-lbl">Initials</label>
              <input type="text" class="property-input ui-prop" data-prop="avatarInitials" maxlength="3" value="${escapeHTML(layer.avatarInitials||'AB')}"/>
            </div>
            <div class="property-group">
              <label class="property-lbl">BG Color</label>
              <div class="property-color-picker">
                <input type="color" class="prop-color-input ui-color-prop" data-prop="avatarBg" value="${layer.avatarBg||'#7c3aed'}"/>
                <input type="text" class="property-input ui-prop" data-prop="avatarBg" value="${escapeHTML(layer.avatarBg||'#7c3aed')}" style="flex:1;"/>
              </div>
            </div>
          </div>
          <div class="property-group">
            <label class="property-lbl">Shape Roundness (0=square, 50=circle)</label>
            <input type="range" class="property-input ui-prop" data-prop="avatarRadius" min="0" max="50" value="${layer.avatarRadius??50}" style="width:100%;"/>
          </div>`;
      }

      if (t === 'notification') {
        fields += `
          <div class="inspector-sec-title">Notification Content</div>
          <div class="property-group">
            <label class="property-lbl">Icon / Emoji</label>
            <input type="text" class="property-input ui-prop" data-prop="notifIcon" value="${escapeHTML(layer.notifIcon||'🔔')}"/>
          </div>
          <div class="property-group">
            <label class="property-lbl">Title</label>
            <input type="text" class="property-input ui-prop" data-prop="notifTitle" value="${escapeHTML(layer.notifTitle||'')}"/>
          </div>
          <div class="property-group">
            <label class="property-lbl">Body Text</label>
            <input type="text" class="property-input ui-prop" data-prop="notifBody" value="${escapeHTML(layer.notifBody||'')}"/>
          </div>
          <div class="inspector-sec-title" style="margin-top:0.75rem;">Notification Style</div>
          <div class="property-row-split">
            <div class="property-group">
              <label class="property-lbl">Background</label>
              <div class="property-color-picker">
                <input type="color" class="prop-color-input ui-color-prop" data-prop="notifBg" value="${layer.notifBg&&layer.notifBg.startsWith('#')?layer.notifBg:'#1a1a2e'}"/>
                <input type="text" class="property-input ui-prop" data-prop="notifBg" value="${escapeHTML(layer.notifBg||'rgba(26,26,46,0.95)')}" style="flex:1;"/>
              </div>
            </div>
            <div class="property-group">
              <label class="property-lbl">Dot Color</label>
              <div class="property-color-picker">
                <input type="color" class="prop-color-input ui-color-prop" data-prop="notifAccent" value="${layer.notifAccent||'#4ade80'}"/>
                <input type="text" class="property-input ui-prop" data-prop="notifAccent" value="${escapeHTML(layer.notifAccent||'#4ade80')}" style="flex:1;"/>
              </div>
            </div>
          </div>`;
      }
    }

    // Group-specific controls
    if (layer.type === 'group') {
      // Summarise what's inside the group
      const childNames = (layer.children || []).map(c => c.name).join(', ');
      const childAnims = (layer.children || []).flatMap(c => c.animations || []);

      fields += `
        <div style="background:rgba(124,58,237,0.07);border:1px solid rgba(124,58,237,0.2);
          border-radius:8px;padding:0.6rem 0.75rem;margin-bottom:0.75rem;font-size:0.68rem;
          color:var(--text-secondary);line-height:1.5;">
          <div style="font-weight:700;color:#a78bfa;margin-bottom:3px;">Group contains ${(layer.children||[]).length} layers</div>
          <div style="color:var(--text-muted);">${childNames}</div>
        </div>`;

      // If group has no animations but children do, offer to inherit them
      if (layer.animations.length === 0 && childAnims.length > 0 && !layer._animsAcknowledged) {
        const uniqueAnimNames = [...new Set(childAnims.map(a => a.name))].join(', ');
        fields += `
          <div style="background:rgba(251,191,36,0.07);border:1px solid rgba(251,191,36,0.2);
            border-radius:8px;padding:0.6rem 0.75rem;margin-bottom:0.6rem;">
            <div style="font-size:0.68rem;font-weight:700;color:#fbbf24;margin-bottom:6px;">
              ⚠ Children have animations not applied to the group
            </div>
            <div style="font-size:0.63rem;color:var(--text-muted);margin-bottom:8px;">
              Children use: ${uniqueAnimNames}
            </div>
            <div style="display:flex;gap:6px;">
              <button id="btnInheritAnims" style="flex:1;padding:5px 8px;background:rgba(124,58,237,0.2);
                border:1px solid rgba(124,58,237,0.4);color:#a78bfa;border-radius:6px;
                font-size:0.68rem;font-weight:700;cursor:pointer;">
                ↑ Apply to Group
              </button>
              <button id="btnKeepChildAnims" style="flex:1;padding:5px 8px;background:rgba(255,255,255,0.05);
                border:1px solid var(--card-border);color:var(--text-secondary);border-radius:6px;
                font-size:0.68rem;font-weight:700;cursor:pointer;">
                Keep as is
              </button>
            </div>
          </div>`;
      }

      fields += `
        <button id="btnUngroupLayer" style="width:100%;padding:0.45rem;margin-bottom:0.75rem;
          background:rgba(124,58,237,0.12);color:#a78bfa;border:1px solid rgba(124,58,237,0.25);
          border-radius:6px;font-weight:700;font-size:0.72rem;cursor:pointer;">
          ⬡ Ungroup (Ctrl+Shift+G)
        </button>`;
    }

    // ─────────────────────────────────────────────────────────────
    // KEYFRAME EDITOR — replaces "Layer Animations" section
    // Works for every element by default, no preset required.
    // ─────────────────────────────────────────────────────────────

    // Ensure layer has a layerKeyframes store (independent of preset animations)
    if (!layer.layerKeyframes) layer.layerKeyframes = [];

    const lkfs = layer.layerKeyframes;
    const curTimeSec = parseFloat((state.currentTime / 1000).toFixed(3));

    // Find if a keyframe already exists at current time (within 20ms tolerance)
    const kfAtCurrent = lkfs.find(k => Math.abs(k.time - curTimeSec) < 0.02);
    const kfAtCurrentIdx = lkfs.findIndex(k => Math.abs(k.time - curTimeSec) < 0.02);

    // Sort keyframes by time for prev/next navigation
    const sortedKfTimes = [...lkfs].sort((a,b)=>a.time-b.time).map(k=>k.time);
    const prevKfTime = sortedKfTimes.filter(t => t < curTimeSec - 0.01).pop();
    const nextKfTime = sortedKfTimes.find(t => t > curTimeSec + 0.01);

    // Build the keyframe list HTML — all properties are editable inputs
    const KFE_PROPS = [
      { key:'x',            label:'pos x',       type:'number', step:'1'   },
      { key:'y',            label:'pos y',       type:'number', step:'1'   },
      { key:'width',        label:'width',       type:'number', step:'1'   },
      { key:'height',       label:'height',      type:'number', step:'1'   },
      { key:'rotation',     label:'rotation°',   type:'number', step:'1'   },
      { key:'scaleX',       label:'scale x',     type:'number', step:'0.01' },
      { key:'scaleY',       label:'scale y',     type:'number', step:'0.01' },
      { key:'opacity',      label:'opacity',     type:'number', step:'0.01', min:'0', max:'1' },
      { key:'blur',         label:'blur px',     type:'number', step:'1', min:'0'   },
      { key:'borderRadius', label:'radius',      type:'number', step:'1'   },
      { key:'fill',         label:'fill',        type:'text'   },
      { key:'stroke',       label:'stroke',      type:'text'   },
      { key:'strokeWidth',  label:'strk w',      type:'number', step:'1', min:'0'   },
      { key:'color',        label:'txt color',   type:'text'   },
      { key:'fontSize',     label:'font sz',     type:'number', step:'1', min:'1'   },
      { key:'letterSpacing',label:'ltr spc',     type:'number', step:'0.1' },
      { key:'lineHeight',   label:'ln height',   type:'number', step:'0.1', min:'0.5' },
    ];

    let kfListHTML = '';
    const sortedKfs = [...lkfs].sort((a,b)=>a.time-b.time);
    sortedKfs.forEach((kf, idx) => {
      const isActive = Math.abs(kf.time - curTimeSec) < 0.02;
      const inputBg = isActive ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.04)';
      const inputBorder = isActive ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.1)';

      // Build editable input grid for all animatable properties
      const propInputs = KFE_PROPS.map(p => {
        const val = kf[p.key] !== undefined ? kf[p.key] : '';
        const minAttr = p.min !== undefined ? `min="${p.min}"` : '';
        const maxAttr = p.max !== undefined ? `max="${p.max}"` : '';
        return `<div style="display:flex;flex-direction:column;gap:1px;min-width:0;">
          <label style="font-size:0.52rem;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${p.label}</label>
          <input type="${p.type}" class="kfe-prop-input property-input"
            data-kf-time="${kf.time}" data-prop="${p.key}"
            ${minAttr} ${maxAttr} step="${p.step||'1'}"
            value="${val}"
            placeholder="—"
            style="width:100%;font-size:0.6rem;padding:2px 4px;
              background:${inputBg};border:1px solid ${inputBorder};
              border-radius:3px;color:var(--text-light);box-sizing:border-box;"/>
        </div>`;
      }).join('');

      kfListHTML += `
        <div class="kfe-kf-row${isActive?' kfe-kf-active':''}" data-kf-time="${kf.time}" style="
          background:${isActive?'rgba(124,58,237,0.08)':'rgba(255,255,255,0.02)'};
          border:1px solid ${isActive?'rgba(124,58,237,0.35)':'rgba(255,255,255,0.07)'};
          border-radius:6px;padding:0.4rem 0.5rem;margin-bottom:0.4rem;transition:all 0.15s;">
          <!-- Header row: time + easing + delete -->
          <div style="display:flex;align-items:center;gap:0.35rem;margin-bottom:0.35rem;cursor:pointer;" class="kfe-kf-header">
            <span style="font-size:0.68rem;font-weight:800;color:${isActive?'#a78bfa':'var(--text-secondary)'};min-width:36px;">${kf.time.toFixed(2)}s</span>
            <select class="kfe-easing-sel property-input" data-kf-time="${kf.time}" title="Easing out of this keyframe"
              style="font-size:0.58rem;padding:2px 4px;flex:1;min-width:0;
                background:rgba(124,58,237,0.1);border:1px solid rgba(124,58,237,0.25);border-radius:4px;color:var(--text-light);">
              <option value="linear" ${(kf.easing||'linear')==='linear'?'selected':''}>Linear</option>
              <option value="ease" ${kf.easing==='ease'?'selected':''}>Ease</option>
              <option value="ease-in" ${kf.easing==='ease-in'?'selected':''}>Ease In</option>
              <option value="ease-out" ${kf.easing==='ease-out'?'selected':''}>Ease Out</option>
              <option value="ease-in-out" ${kf.easing==='ease-in-out'?'selected':''}>Ease In-Out</option>
              <option value="cubic-bezier(0.34,1.56,0.64,1)" ${kf.easing==='cubic-bezier(0.34,1.56,0.64,1)'?'selected':''}>Bounce</option>
              <option value="cubic-bezier(0.22,1,0.36,1)" ${kf.easing==='cubic-bezier(0.22,1,0.36,1)'?'selected':''}>Elastic</option>
            </select>
            <button class="kfe-del-kf-btn" data-kf-time="${kf.time}"
              style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:10px;padding:2px 4px;
                border-radius:3px;flex-shrink:0;line-height:1;" title="Delete keyframe">✕</button>
          </div>
          <!-- Editable property grid -->
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px;">
            ${propInputs}
          </div>
        </div>`;
    });

    // Preset animations section (existing behavior preserved)
    let presetAnimsHTML = '';
    if (layer.animations.length === 0) {
      presetAnimsHTML = `<div style="font-size:0.68rem;color:var(--text-muted);margin-bottom:0.3rem;">No preset animations. Drag from Catalog to add.</div>`;
    } else {
      layer.animations.forEach((anim, i) => {
        const animId = anim.id || i;
        presetAnimsHTML += `
          <div style="background:rgba(255,255,255,0.03);border:1px solid var(--card-border);border-radius:6px;padding:0.45rem 0.5rem;margin-bottom:0.35rem;">
            <div style="display:flex;align-items:center;gap:4px;margin-bottom:0.3rem;">
              <span style="font-size:0.7rem;font-weight:700;color:#a78bfa;flex:1;">${anim.name}</span>
              <button class="layer-btn btn-del-anim" data-anim-id="${animId}" data-index="${i}">🗑</button>
            </div>
            <div class="property-row-split" style="margin-bottom:0.2rem;">
              <div>
                <label class="property-lbl" style="font-size:0.6rem;">Start (ms)</label>
                <input type="number" class="property-input anim-change" data-anim-id="${animId}" data-index="${i}" data-prop="start" value="${anim.start}"/>
              </div>
              <div>
                <label class="property-lbl" style="font-size:0.6rem;">Duration (ms)</label>
                <input type="number" class="property-input anim-change" data-anim-id="${animId}" data-index="${i}" data-prop="duration" value="${anim.duration}"/>
              </div>
            </div>
            <div class="property-row-split" style="margin-bottom:0.2rem;">
              <div>
                <label class="property-lbl" style="font-size:0.6rem;">Easing</label>
                <select class="property-input anim-change-select" data-anim-id="${animId}" data-index="${i}" data-prop="easing">
                  <option value="cubic-bezier(0.22,1,0.36,1)" ${anim.easing==='cubic-bezier(0.22,1,0.36,1)'?'selected':''}>Ease Out Expo</option>
                  <option value="linear" ${anim.easing==='linear'?'selected':''}>Linear</option>
                  <option value="ease" ${anim.easing==='ease'?'selected':''}>Ease</option>
                  <option value="ease-in" ${anim.easing==='ease-in'?'selected':''}>Ease In</option>
                  <option value="ease-out" ${anim.easing==='ease-out'?'selected':''}>Ease Out</option>
                  <option value="ease-in-out" ${anim.easing==='ease-in-out'?'selected':''}>Ease In Out</option>
                  <option value="cubic-bezier(0.34,1.56,0.64,1)" ${anim.easing==='cubic-bezier(0.34,1.56,0.64,1)'?'selected':''}>Spring Bounce</option>
                  <option value="cubic-bezier(0.4,0,0.2,1)" ${anim.easing==='cubic-bezier(0.4,0,0.2,1)'?'selected':''}>Material</option>
                </select>
              </div>
              <div>
                <label class="property-lbl" style="font-size:0.6rem;">Direction</label>
                <select class="property-input anim-change-select" data-anim-id="${animId}" data-index="${i}" data-prop="direction">
                  <option value="normal" ${anim.direction==='normal'?'selected':''}>Normal</option>
                  <option value="reverse" ${anim.direction==='reverse'?'selected':''}>Reverse</option>
                  <option value="alternate" ${anim.direction==='alternate'?'selected':''}>Alternate</option>
                  <option value="alternate-reverse" ${anim.direction==='alternate-reverse'?'selected':''}>Alt. Reverse</option>
                </select>
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:0.5rem;">
              <input type="checkbox" class="anim-change-checkbox" id="anim-repeat-${animId}" data-anim-id="${animId}" data-index="${i}" data-prop="infinite" ${anim.infinite?'checked':''}/>
              <label for="anim-repeat-${animId}" class="property-lbl" style="font-size:0.6rem;cursor:pointer;">Repeat ∞</label>
            </div>
          </div>`;
      });
    }

    fields += `
      <!-- ═══ KEYFRAME EDITOR ═══ -->
      <div style="margin-top:1rem;">
        <div class="inspector-sec-title" style="display:flex;align-items:center;gap:0.4rem;">
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M8 1l1.8 5.5H15l-4.7 3.4 1.8 5.5L8 12l-4.1 3.4 1.8-5.5L1 6.5h5.2z" fill="#a78bfa"/></svg>
          Keyframe Editor
        </div>

        <!-- Current Time + Navigation Controls -->
        <div style="background:rgba(124,58,237,0.07);border:1px solid rgba(124,58,237,0.18);border-radius:8px;padding:0.5rem 0.6rem;margin-bottom:0.5rem;">
          <div style="display:flex;align-items:center;gap:0.35rem;margin-bottom:0.4rem;">
            <span style="font-size:0.6rem;color:var(--text-muted);font-weight:700;text-transform:uppercase;letter-spacing:0.5px;flex:1;">Current Time</span>
            <span id="kfeCurrentTimeDisplay" style="font-size:0.78rem;font-weight:800;color:${kfAtCurrent?'#a78bfa':'var(--text-secondary)'};
              background:rgba(0,0,0,0.2);border-radius:4px;padding:2px 7px;min-width:40px;text-align:center;">
              ${curTimeSec.toFixed(2)}s
            </span>
            ${kfAtCurrent ? `<span style="font-size:0.58rem;background:rgba(124,58,237,0.25);border:1px solid rgba(124,58,237,0.4);color:#c4b5fd;border-radius:10px;padding:1px 6px;font-weight:700;">● KF</span>` : ''}
          </div>
          <div style="display:flex;gap:0.3rem;">
            <button id="kfeBtnPrev" title="Previous Keyframe"
              style="flex:1;padding:0.3rem;font-size:0.68rem;background:rgba(255,255,255,0.05);border:1px solid var(--card-border);
              color:${prevKfTime!==undefined?'var(--text-secondary)':'var(--text-muted)'};border-radius:5px;cursor:pointer;font-weight:600;transition:all 0.15s;"
              ${prevKfTime===undefined?'disabled':''}>◀ Prev</button>
            <button id="kfeBtnAdd" title="Add Keyframe at Current Time"
              style="flex:1.4;padding:0.3rem;font-size:0.68rem;
              background:${kfAtCurrent?'rgba(124,58,237,0.3)':'rgba(124,58,237,0.15)'};
              border:1px solid rgba(124,58,237,${kfAtCurrent?'0.6':'0.35'});
              color:#a78bfa;border-radius:5px;cursor:pointer;font-weight:700;transition:all 0.15s;">
              ${kfAtCurrent?'✎ Update':'+ Add KF'}
            </button>
            <button id="kfeBtnNext" title="Next Keyframe"
              style="flex:1;padding:0.3rem;font-size:0.68rem;background:rgba(255,255,255,0.05);border:1px solid var(--card-border);
              color:${nextKfTime!==undefined?'var(--text-secondary)':'var(--text-muted)'};border-radius:5px;cursor:pointer;font-weight:600;transition:all 0.15s;"
              ${nextKfTime===undefined?'disabled':''}>Next ▶</button>
            <button id="kfeBtnDel" title="Delete Keyframe at Current Time"
              style="padding:0.3rem 0.45rem;font-size:0.68rem;background:${kfAtCurrent?'rgba(239,68,68,0.12)':'rgba(255,255,255,0.03)'};
              border:1px solid ${kfAtCurrent?'rgba(239,68,68,0.3)':'var(--card-border)'};
              color:${kfAtCurrent?'#f87171':'var(--text-muted)'};border-radius:5px;cursor:pointer;transition:all 0.15s;"
              ${!kfAtCurrent?'disabled':''}>🗑</button>
          </div>
        </div>

        <!-- Keyframe List -->
        <div style="margin-bottom:0.5rem;">
          <div style="font-size:0.6rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.3rem;display:flex;align-items:center;gap:0.3rem;">
            <span>Keyframes (${lkfs.length})</span>
            ${lkfs.length>0?`<button id="kfeBtnClearAll"
              style="margin-left:auto;font-size:0.57rem;padding:1px 6px;background:rgba(239,68,68,0.08);
              border:1px solid rgba(239,68,68,0.2);color:#f87171;border-radius:4px;cursor:pointer;">Clear All</button>`:''}
          </div>
          <div id="kfeKeyframeList" style="max-height:180px;overflow-y:auto;">
            ${lkfs.length === 0
              ? `<div style="font-size:0.65rem;color:var(--text-muted);font-style:italic;padding:0.4rem 0;text-align:center;">
                  No keyframes yet.<br>Move playhead &amp; click <b style="color:#a78bfa;">+ Add KF</b>
                </div>`
              : kfListHTML}
          </div>
        </div>

        <!-- Preset Animations (existing catalog behavior preserved) -->
        <div style="border-top:1px solid rgba(255,255,255,0.07);padding-top:0.5rem;margin-top:0.25rem;">
          <div style="font-size:0.6rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.3rem;">
            Preset Animations
          </div>
          <div id="inspectorAnimsList">
            ${presetAnimsHTML}
          </div>
        </div>
      </div>
    `;

    fields += ``;
    container.innerHTML = fields;

    // Attach listeners - input for live updates, change for undo history
    container.querySelectorAll('.prop-change').forEach(input => {
      input.addEventListener('input', () => {
        const prop = input.dataset.prop;
        let val = input.value;
        if (input.type === 'number') val = parseFloat(val);
        layer[prop] = val;
        renderCanvas();
        if (prop === 'name' || prop === 'content') {
          renderLayersPanel();
          renderTimeline();
        }
      });
      input.addEventListener('change', () => {
        saveState();
      });
    });

    container.querySelectorAll('.prop-color-input').forEach(input => {
      input.addEventListener('input', () => {
        const prop = input.dataset.prop;
        layer[prop] = input.value;
        const matchingInput = container.querySelector(`.property-input.prop-change[data-prop="${prop}"]`);
        if (matchingInput) matchingInput.value = input.value;
        renderCanvas();
      });
      input.addEventListener('change', () => { saveState(); });
    });

    // UI component field listeners — update layer field, rebuild html live
    function refreshUILayer() {
      const uiEl = viewportNode && viewportNode.querySelector(`.canvas-element[data-id="${layer.id}"] .element-ui`);
      if (uiEl) uiEl.innerHTML = buildUIHtml(layer);
      saveState();
    }

    container.querySelectorAll('.ui-prop').forEach(input => {
      input.addEventListener('input', () => {
        const prop = input.dataset.prop;
        layer[prop] = input.type === 'number' ? parseFloat(input.value) : input.value;
        const uiEl = viewportNode && viewportNode.querySelector(`.canvas-element[data-id="${layer.id}"] .element-ui`);
        if (uiEl) uiEl.innerHTML = buildUIHtml(layer);
      });
      input.addEventListener('change', () => { saveState(); });
    });

    container.querySelectorAll('.ui-color-prop').forEach(picker => {
      picker.addEventListener('input', () => {
        const prop = picker.dataset.prop;
        layer[prop] = picker.value;
        // sync paired text input
        const textInput = container.querySelector(`.ui-prop[data-prop="${prop}"]`);
        if (textInput) textInput.value = picker.value;
        const uiEl = viewportNode && viewportNode.querySelector(`.canvas-element[data-id="${layer.id}"] .element-ui`);
        if (uiEl) uiEl.innerHTML = buildUIHtml(layer);
      });
      picker.addEventListener('change', () => { saveState(); });
    });

    // Image Frame — upload, URL, pan/scale controls
    const imgframeDrop = container.querySelector('#imgframeDropZone');
    const imgframeFile = container.querySelector('#imgframeFileInput');
    if (imgframeDrop && imgframeFile) {
      imgframeDrop.addEventListener('click', () => imgframeFile.click());
      imgframeDrop.addEventListener('dragover', (e) => {
        e.preventDefault();
        imgframeDrop.style.background = 'rgba(124,58,237,0.15)';
        imgframeDrop.style.borderColor = 'rgba(124,58,237,0.8)';
      });
      imgframeDrop.addEventListener('dragleave', () => {
        imgframeDrop.style.background = 'rgba(124,58,237,0.05)';
        imgframeDrop.style.borderColor = 'rgba(124,58,237,0.4)';
      });
      imgframeDrop.addEventListener('drop', (e) => {
        e.preventDefault();
        imgframeDrop.style.background = 'rgba(124,58,237,0.05)';
        imgframeDrop.style.borderColor = 'rgba(124,58,237,0.4)';
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) loadImgframeFile(file);
      });
      imgframeFile.addEventListener('change', () => {
        if (imgframeFile.files[0]) loadImgframeFile(imgframeFile.files[0]);
      });
      function loadImgframeFile(file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          layer.imgUrl = ev.target.result;
          saveState();
          renderCanvas();
          renderPropertyPanel();
        };
        reader.readAsDataURL(file);
      }
    }

    // Imageframe property inputs (URL, scale, panX, panY, radius)
    container.querySelectorAll('.imgframe-prop').forEach(input => {
      input.addEventListener('input', () => {
        const prop = input.dataset.prop;
        let val = input.value;
        if (prop === 'imgScale' || prop === 'imgX' || prop === 'imgY' || prop === 'radius') {
          val = parseFloat(val) || 0;
        }
        layer[prop] = val;
        // Update scale label
        const scaleLabel = container.querySelector('#imgScaleVal');
        if (scaleLabel && prop === 'imgScale') scaleLabel.textContent = parseFloat(val).toFixed(2) + '×';
        renderCanvas();
      });
      input.addEventListener('change', () => saveState());
    });

    // Avatar image upload — file input click + drag-drop zone
    const avatarDrop = container.querySelector('#avatarDropZone');
    const avatarFile = container.querySelector('#avatarFileInput');
    if (avatarDrop && avatarFile) {
      avatarDrop.addEventListener('click', () => avatarFile.click());

      avatarDrop.addEventListener('dragover', (e) => {
        e.preventDefault();
        avatarDrop.style.background = 'rgba(124,58,237,0.15)';
        avatarDrop.style.borderColor = 'rgba(124,58,237,0.8)';
      });
      avatarDrop.addEventListener('dragleave', () => {
        avatarDrop.style.background = 'rgba(124,58,237,0.05)';
        avatarDrop.style.borderColor = 'rgba(124,58,237,0.4)';
      });
      avatarDrop.addEventListener('drop', (e) => {
        e.preventDefault();
        avatarDrop.style.background = 'rgba(124,58,237,0.05)';
        avatarDrop.style.borderColor = 'rgba(124,58,237,0.4)';
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) loadAvatarFile(file);
      });

      avatarFile.addEventListener('change', () => {
        if (avatarFile.files[0]) loadAvatarFile(avatarFile.files[0]);
      });

      function loadAvatarFile(file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          layer.avatarUrl = ev.target.result; // base64 data URL
          refreshUILayer();
          renderPropertyPanel(); // re-render to show preview thumbnail
        };
        reader.readAsDataURL(file);
      }
    }

    // Animation configuration values
    container.querySelectorAll('.anim-change').forEach(input => {
      const handler = () => {
        const animId = input.dataset.animId;
        const fallbackIndex = parseInt(input.dataset.index);
        const anim = animId
          ? layer.animations.find(a => a.id === animId)
          : layer.animations[fallbackIndex];
        if (!anim) return;
        const prop = input.dataset.prop;
        anim[prop] = parseInt(input.value);
        bustAnimCache(layer.id, anim);
        saveState();
        renderTimeline();
        previewTimelineAtTime();
      };
      input.addEventListener('input', handler);
      input.addEventListener('change', handler);
    });

    container.querySelectorAll('.anim-change-select').forEach(select => {
      select.addEventListener('change', () => {
        const animId = select.dataset.animId;
        const fallbackIndex = parseInt(select.dataset.index);
        const anim = animId
          ? layer.animations.find(a => a.id === animId)
          : layer.animations[fallbackIndex];
        if (!anim) return;
        const prop = select.dataset.prop;
        anim[prop] = select.value;
        bustAnimCache(layer.id, anim);
        saveState();
        renderTimeline();
        previewTimelineAtTime();
      });
    });

    container.querySelectorAll('.anim-change-checkbox').forEach(cb => {
      cb.addEventListener('change', () => {
        const animId = cb.dataset.animId;
        const fallbackIndex = parseInt(cb.dataset.index);
        const anim = animId
          ? layer.animations.find(a => a.id === animId)
          : layer.animations[fallbackIndex];
        if (!anim) return;
        const prop = cb.dataset.prop;
        anim[prop] = cb.checked;
        bustAnimCache(layer.id, anim);
        saveState();
        renderTimeline();
        previewTimelineAtTime();
      });
    });

    container.querySelectorAll('.btn-del-anim').forEach(btn => {
      btn.addEventListener('click', () => {
        const animId = btn.dataset.animId;
        const fallbackIndex = parseInt(btn.dataset.index);
        const idx = animId
          ? layer.animations.findIndex(a => a.id === animId)
          : fallbackIndex;
        const resolvedIdx = idx !== -1 ? idx : fallbackIndex;
        if (resolvedIdx >= 0 && resolvedIdx < layer.animations.length) {
          layer.animations.splice(resolvedIdx, 1);
          saveState();
          renderAll();
        }
      });
    });

    // Ungroup button
    container.querySelector('#btnUngroupLayer')?.addEventListener('click', () => {
      ungroupLayer(layer.id);
    });

    // Inherit child animations onto the group
    container.querySelector('#btnInheritAnims')?.addEventListener('click', () => {
      const childAnims = (layer.children || []).flatMap(c =>
        (c.animations || []).map(a => ({
          ...JSON.parse(JSON.stringify(a)),
          id: 'anim_' + Date.now() + Math.random()
        }))
      );
      // Place each after the previous
      let cursor = 0;
      layer.animations = childAnims.map(a => {
        const placed = { ...a, start: cursor };
        cursor += a.duration;
        return placed;
      });
      saveState();
      renderAll();
      showToast(`Applied ${childAnims.length} animation(s) to group`);
    });

    container.querySelector('#btnKeepChildAnims')?.addEventListener('click', () => {
      // Just dismiss the warning — mark group as acknowledged
      layer._animsAcknowledged = true;
      saveState();
      renderPropertyPanel();
    });

    // ─── KFE: Add / Update keyframe at current playhead time ───
    container.querySelector('#kfeBtnAdd')?.addEventListener('click', () => {
      if (!layer.layerKeyframes) layer.layerKeyframes = [];
      const t = parseFloat((state.currentTime / 1000).toFixed(3));

      // ── Read the LIVE rendered values from the DOM element so that what
      // the user sees is exactly what gets stored, even during playback.
      const elNode = viewportNode && viewportNode.querySelector(`.canvas-element[data-id="${layer.id}"]`);
      const liveStyle = elNode ? window.getComputedStyle(elNode) : null;

      // Helper: parse a computed style number, falling back to a layer prop
      const liveNum = (cssProp, layerProp, fallback = 0) => {
        if (liveStyle) {
          const v = parseFloat(liveStyle.getPropertyValue(cssProp));
          if (!isNaN(v)) return v;
        }
        return layer[layerProp] != null ? layer[layerProp] : fallback;
      };

      // Parse transform matrix for translate / scale / rotate
      let liveX = layer.x, liveY = layer.y;
      let liveScaleX = layer.scaleX != null ? layer.scaleX : 1;
      let liveScaleY = layer.scaleY != null ? layer.scaleY : 1;
      let liveRotation = layer.rotation || 0;
      if (liveStyle) {
        const mat = new DOMMatrix(liveStyle.transform);
        if (mat && !isNaN(mat.m41)) {
          // mat.m41/m42 = translation; decompose scale & rotate from the 2×2
          const a = mat.a, b = mat.b, c = mat.c, d = mat.d;
          const sx = Math.sqrt(a*a + b*b);
          const sy = Math.sqrt(c*c + d*d);
          // translate is relative offset from WAAPI; add base position
          liveX = layer.x + mat.m41;
          liveY = layer.y + mat.m42;
          if (sx > 0.001) { liveScaleX = sx; liveScaleY = sy; }
          liveRotation = Math.round(Math.atan2(b, a) * 180 / Math.PI);
        }
      }

      // Width / height: WAAPI can animate these directly on the element
      const liveWidth  = liveNum('width',  'width',  layer.width);
      const liveHeight = liveNum('height', 'height', layer.height);

      // Opacity
      const liveOpacity = liveNum('opacity', 'opacity', 1);

      // Blur from filter: blur(Npx)
      let liveBlur = layer.blur != null ? layer.blur : 0;
      if (liveStyle) {
        const filterStr = liveStyle.filter || liveStyle.webkitFilter || '';
        const bm = filterStr.match(/blur\(([\d.]+)px\)/);
        if (bm) liveBlur = parseFloat(bm[1]);
      }

      // Border radius
      let liveBorderRadius = layer.radius != null ? layer.radius : 0;
      if (liveStyle) {
        const br = parseFloat(liveStyle.borderRadius);
        if (!isNaN(br)) liveBorderRadius = br;
      }

      const snapshot = {
        time:         t,
        easing:       'linear',
        x:            Math.round(liveX),
        y:            Math.round(liveY),
        width:        Math.round(liveWidth),
        height:       Math.round(liveHeight),
        rotation:     liveRotation,
        scaleX:       parseFloat(liveScaleX.toFixed(4)),
        scaleY:       parseFloat(liveScaleY.toFixed(4)),
        opacity:      parseFloat(liveOpacity.toFixed(4)),
        blur:         liveBlur,
        borderRadius: liveBorderRadius,
      };

      // Colour / text properties — read live from child element when possible
      const shapeEl  = elNode && elNode.querySelector('.element-shape');
      const textEl   = elNode && elNode.querySelector('.element-text');

      if (layer.fill !== undefined || shapeEl) {
        const liveFill = shapeEl
          ? (window.getComputedStyle(shapeEl).background || layer.fill)
          : layer.fill;
        snapshot.fill = liveFill || layer.fill;
      }
      if (layer.stroke      !== undefined) snapshot.stroke      = layer.stroke;
      if (layer.strokeWidth !== undefined) snapshot.strokeWidth  = layer.strokeWidth;
      if (layer.color !== undefined || textEl) {
        snapshot.color = textEl
          ? (window.getComputedStyle(textEl).color || layer.color)
          : layer.color;
      }
      if (layer.fontSize      !== undefined) snapshot.fontSize      = layer.fontSize;
      if (layer.letterSpacing !== undefined) {
        snapshot.letterSpacing = parseFloat(layer.letterSpacing) || 0;
      }
      if (layer.lineHeight !== undefined) {
        snapshot.lineHeight = parseFloat(layer.lineHeight) || 1;
      }

      const existing = layer.layerKeyframes.findIndex(k => Math.abs(k.time - t) < 0.02);
      if (existing >= 0) {
        // Update: merge new values in, preserve easing
        const prevEasing = layer.layerKeyframes[existing].easing;
        layer.layerKeyframes[existing] = { ...snapshot, easing: prevEasing };
      } else {
        layer.layerKeyframes.push(snapshot);
        layer.layerKeyframes.sort((a,b)=>a.time-b.time);
      }

      // Extend timeline duration if keyframe is beyond current duration
      if (t * 1000 > state.duration - 100) {
        state.duration = Math.max(state.duration, Math.ceil(t + 1) * 1000);
      }

      applyLayerKeyframeAnimation(layer);
      saveState();
      renderTimeline();
      renderPropertyPanel();
      showToast(`Keyframe at ${t.toFixed(2)}s ${existing>=0?'updated':'added'}`);
    });

    // ─── KFE: Prev keyframe navigation ───
    container.querySelector('#kfeBtnPrev')?.addEventListener('click', () => {
      if (!layer.layerKeyframes) return;
      const t = state.currentTime / 1000;
      const prev = [...layer.layerKeyframes].sort((a,b)=>a.time-b.time)
        .filter(k => k.time < t - 0.01).pop();
      if (prev != null) {
        state.currentTime = prev.time * 1000;
        updatePlayheadPosition();
        previewTimelineAtTime();
        renderPropertyPanel();
      }
    });

    // ─── KFE: Next keyframe navigation ───
    container.querySelector('#kfeBtnNext')?.addEventListener('click', () => {
      if (!layer.layerKeyframes) return;
      const t = state.currentTime / 1000;
      const next = [...layer.layerKeyframes].sort((a,b)=>a.time-b.time)
        .find(k => k.time > t + 0.01);
      if (next != null) {
        state.currentTime = next.time * 1000;
        updatePlayheadPosition();
        previewTimelineAtTime();
        renderPropertyPanel();
      }
    });

    // ─── KFE: Delete keyframe at current time ───
    container.querySelector('#kfeBtnDel')?.addEventListener('click', () => {
      if (!layer.layerKeyframes) return;
      const t = state.currentTime / 1000;
      const idx = layer.layerKeyframes.findIndex(k => Math.abs(k.time - t) < 0.02);
      if (idx >= 0) {
        layer.layerKeyframes.splice(idx, 1);
        applyLayerKeyframeAnimation(layer);
        saveState();
        renderTimeline();
        renderPropertyPanel();
        showToast('Keyframe deleted');
      }
    });

    // ─── KFE: Clear all keyframes ───
    container.querySelector('#kfeBtnClearAll')?.addEventListener('click', () => {
      layer.layerKeyframes = [];
      applyLayerKeyframeAnimation(layer);
      saveState();
      renderTimeline();
      renderPropertyPanel();
      showToast('All keyframes cleared');
    });

    // ─── KFE: Click keyframe in list → jump playhead ───
    // ─── KFE: Delete individual keyframe from list ───
    container.querySelectorAll('.kfe-del-kf-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const t = parseFloat(btn.dataset.kfTime);
        if (!layer.layerKeyframes) return;
        const idx = layer.layerKeyframes.findIndex(k => Math.abs(k.time - t) < 0.02);
        if (idx >= 0) {
          layer.layerKeyframes.splice(idx, 1);
          applyLayerKeyframeAnimation(layer);
          saveState();
          renderTimeline();
          renderPropertyPanel();
        }
      });
    });

    // ─── KFE: Easing selector per keyframe ───
    container.querySelectorAll('.kfe-easing-sel').forEach(sel => {
      sel.addEventListener('change', (e) => {
        e.stopPropagation();
        const t = parseFloat(sel.dataset.kfTime);
        if (!layer.layerKeyframes) return;
        const kf = layer.layerKeyframes.find(k => Math.abs(k.time - t) < 0.02);
        if (kf) {
          kf.easing = sel.value;
          applyLayerKeyframeAnimation(layer);
          saveState();
          previewTimelineAtTime();
        }
      });
    });

    // ─── KFE: Edit individual property values directly in the keyframe list ───
    container.querySelectorAll('.kfe-prop-input').forEach(input => {
      const handler = () => {
        const t = parseFloat(input.dataset.kfTime);
        const prop = input.dataset.prop;
        if (!layer.layerKeyframes) return;
        const kf = layer.layerKeyframes.find(k => Math.abs(k.time - t) < 0.02);
        if (!kf) return;

        const raw = input.value.trim();
        if (raw === '' || raw === '—') {
          // Empty field → remove property from keyframe (leave unset = not animated)
          delete kf[prop];
        } else {
          // Numeric props stored as numbers; text props (color, fill, shadow) stored as strings
          const numericProps = ['x','y','width','height','rotation','opacity','scaleX','scaleY','borderRadius','blur','strokeWidth','fontSize','letterSpacing','lineHeight'];
          if (numericProps.includes(prop)) {
            const n = parseFloat(raw);
            if (!isNaN(n)) kf[prop] = n;
          } else {
            kf[prop] = raw;
          }
        }

        applyLayerKeyframeAnimation(layer);
        saveState();
        previewTimelineAtTime();
      };

      input.addEventListener('input', handler);
      input.addEventListener('change', handler);

      // Stop row-click from firing when editing an input
      input.addEventListener('click', e => e.stopPropagation());
      input.addEventListener('mousedown', e => e.stopPropagation());
    });

    // ─── KFE: Click header row → jump playhead (not when interacting with inputs/selects) ───
    container.querySelectorAll('.kfe-kf-header').forEach(header => {
      header.addEventListener('click', (e) => {
        if (e.target.closest('.kfe-del-kf-btn') || e.target.closest('.kfe-easing-sel')) return;
        const row = header.closest('.kfe-kf-row');
        if (!row) return;
        const t = parseFloat(row.dataset.kfTime);
        state.currentTime = t * 1000;
        updatePlayheadPosition();
        previewTimelineAtTime();
        renderPropertyPanel();
      });
    });
  }

  // Convert custom keyframe data into WAAPI-compatible keyframe array on the animation
  function applyCustomKeyframes(anim) {
    if (!anim.keyframes || anim.keyframes.length === 0) return;
    // Merge into the keyframeMap so previewTimelineAtTime picks them up
    const wapiKfs = anim.keyframes.map(kf => {
      const frame = { offset: kf.offset };

      // ── Opacity ──────────────────────────────────────────────
      if (kf.opacity !== undefined) frame.opacity = kf.opacity;

      // ── Transform (translateX/Y, scale, rotate) ───────────────
      const transforms = [];
      if (kf.translateX !== undefined) transforms.push(`translateX(${kf.translateX}px)`);
      if (kf.translateY !== undefined) transforms.push(`translateY(${kf.translateY}px)`);
      if (kf.scale     !== undefined) transforms.push(`scale(${kf.scale})`);
      if (kf.rotate    !== undefined) transforms.push(`rotate(${kf.rotate}deg)`);
      if (transforms.length) frame.transform = transforms.join(' ');

      // ── Width ─────────────────────────────────────────────────
      // Accepts %, px, or bare number (treated as px)
      if (kf.width !== undefined && kf.width !== '') {
        const w = String(kf.width).trim();
        frame.width = /[%a-z]/i.test(w) ? w : `${w}px`;
      }

      // ── Height ────────────────────────────────────────────────
      if (kf.height !== undefined && kf.height !== '') {
        const h = String(kf.height).trim();
        frame.height = /[%a-z]/i.test(h) ? h : `${h}px`;
      }

      // ── Zoom ──────────────────────────────────────────────────
      // CSS zoom is not in the WAAPI spec; we apply it via an inline
      // style update alongside transform so it works everywhere.
      if (kf.zoom !== undefined && kf.zoom !== '') {
        frame.zoom = String(kf.zoom).trim();
      }

      return frame;
    });
    // Store compiled keyframes on the animation itself for the preview engine
    anim._compiledKeyframes = wapiKfs;
  }

  // ─── Compile layer-level keyframes into the _lkfCompiled store ───
  // The new compositing engine reads layer._lkfCompiled.raw directly for
  // JS interpolation, so we only need the sorted raw keyframes here.
  // The WAAPI keyframes array is kept for potential future use but the
  // playback engine no longer drives a WAAPI animation on the element.
  function applyLayerKeyframeAnimation(layer) {
    if (!layer.layerKeyframes || layer.layerKeyframes.length < 2) {
      layer._lkfCompiled = null;
      return;
    }

    const sorted = [...layer.layerKeyframes].sort((a,b) => a.time - b.time);
    const totalDuration = sorted[sorted.length - 1].time * 1000;
    if (totalDuration <= 0) { layer._lkfCompiled = null; return; }

    layer._lkfCompiled = {
      duration: totalDuration,
      raw:      sorted,   // sorted raw keyframes — used by JS interpolation engine
    };
  }

  // --- Timeline Editor Layout & Track Management ---
  let playbackTimer = null;

  function initTimelineControls() {
    const playBtn = document.getElementById('tlPlayBtn');
    const stopBtn = document.getElementById('tlStopBtn');
    const speedSel = document.getElementById('tlSpeedSel');

    playBtn.addEventListener('click', () => {
      if (state.isPlaying) {
        pauseTimeline();
      } else {
        playTimeline();
      }
    });

    stopBtn.addEventListener('click', () => {
      stopTimeline();
    });

    speedSel.addEventListener('change', () => {
      state.playbackSpeed = parseFloat(speedSel.value);
    });

    // Setup timeline playhead scrubber dragging
    const timelineArea = document.getElementById('tlTracksArea');
    timelineArea.addEventListener('mousedown', (e) => {
      if (e.target.closest('.timeline-anim-block')) return;
      
      const updatePlayhead = (evt) => {
        const rect = timelineArea.getBoundingClientRect();
        const mouseX = evt.clientX - rect.left;
        
        // Convert mouse position to time (100px = 1s = 1000ms) => actually 200px = 1000ms in renderTimeline
        const newTime = Math.max(0, Math.min(state.duration, (mouseX / 200) * 1000));
        state.currentTime = newTime;
        updatePlayheadPosition();
        previewTimelineAtTime();
      };
      
      updatePlayhead(e);

      const onMouseMove = (moveEvt) => {
        updatePlayhead(moveEvt);
      };

      const onMouseUp = () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        // Refresh KFE button states in inspector when scrub ends
        if (state.selectedLayerId) renderPropertyPanel();
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    });
  }

  function updatePlayheadPosition() {
    // 200px = 1000ms
    const x = (state.currentTime / 1000) * 200;
    const playheadLine = document.getElementById('tlPlayheadLine');
    const playheadHandle = document.getElementById('tlPlayheadHandle');
    const timelineTimeVal = document.getElementById('timelineTimeVal');
    
    if (playheadLine) playheadLine.style.left = `${x}px`;
    if (playheadHandle) playheadHandle.style.left = `${x}px`;
    if (timelineTimeVal) {
      timelineTimeVal.textContent = `${(state.currentTime / 1000).toFixed(1)}s / ${(state.duration / 1000).toFixed(1)}s`;
    }

    // Sync inspector KFE time display without full re-render
    const kfeDisplay = document.getElementById('kfeCurrentTimeDisplay');
    if (kfeDisplay) {
      const curT = state.currentTime / 1000;
      kfeDisplay.textContent = curT.toFixed(2) + 's';
      const layer = getActiveScene().layers.find(l => l.id === state.selectedLayerId);
      const hasKf = layer && layer.layerKeyframes &&
        layer.layerKeyframes.some(k => Math.abs(k.time - curT) < 0.02);
      kfeDisplay.style.color = hasKf ? '#a78bfa' : 'var(--text-secondary)';
    }
  }

  function playTimeline() {
    state.isPlaying = true;
    document.getElementById('tlPlayBtn').textContent = '⏸ Pause';
    
    let lastTime = performance.now();
    
    function loop(now) {
      if (!state.isPlaying) return;
      const delta = (now - lastTime) * state.playbackSpeed;
      lastTime = now;
      
      state.currentTime += delta;
      if (state.currentTime >= state.duration) {
        state.currentTime = 0; // Loop timeline
      }
      
      updatePlayheadPosition();
      previewTimelineAtTime();
      
      playbackTimer = requestAnimationFrame(loop);
    }
    
    playbackTimer = requestAnimationFrame(loop);
  }

  function pauseTimeline() {
    state.isPlaying = false;
    document.getElementById('tlPlayBtn').textContent = '▶ Play';
    cancelAnimationFrame(playbackTimer);
  }

  function stopTimeline() {
    pauseTimeline();
    state.currentTime = 0;
    updatePlayheadPosition();
    previewTimelineAtTime();
  }

  // Bust the WAAPI cache for a specific animation so it gets recreated with new keyframes/duration
  function bustAnimCache(layerId, anim) {
    const elNode = viewportNode && viewportNode.querySelector(`.canvas-element[data-id="${layerId}"]`);
    if (!elNode || !elNode._animCache) return;
    const cacheKey = anim.id || anim.name;
    const wa = elNode._animCache[cacheKey];
    if (wa) {
      try { wa.cancel(); } catch(e) {}
      delete elNode._animCache[cacheKey];
    }
  }

  // Previews animation at specific timeline location using Web Animations API
  // ─────────────────────────────────────────────────────────────────────────
  // Compositing helpers
  // ─────────────────────────────────────────────────────────────────────────

  // Smooth CSS colour interpolation via a 1×1 canvas (handles hex/rgb/rgba/named)
  const _lerpColorCanvas = document.createElement('canvas');
  _lerpColorCanvas.width = _lerpColorCanvas.height = 1;
  const _lerpColorCtx = _lerpColorCanvas.getContext('2d');
  function lerpColor(ca, cb, t) {
    try {
      const parseColor = (c) => {
        _lerpColorCtx.clearRect(0,0,1,1);
        _lerpColorCtx.fillStyle = c;
        _lerpColorCtx.fillRect(0,0,1,1);
        return _lerpColorCtx.getImageData(0,0,1,1).data;
      };
      const a = parseColor(ca), b = parseColor(cb);
      const r  = Math.round(a[0] + (b[0]-a[0])*t);
      const g  = Math.round(a[1] + (b[1]-a[1])*t);
      const bv = Math.round(a[2] + (b[2]-a[2])*t);
      const av = parseFloat((a[3]/255 + (b[3]/255 - a[3]/255)*t).toFixed(3));
      return `rgba(${r},${g},${bv},${av})`;
    } catch(e) { return t < 0.5 ? ca : cb; }
  }

  // Parse a CSS transform string into its numeric components.
  // Returns { translateX, translateY, rotate, scaleX, scaleY } (all others → identity).
  function parseTransformComponents(transformStr) {
    const result = { translateX: 0, translateY: 0, rotate: 0, scaleX: 1, scaleY: 1 };
    if (!transformStr || transformStr === 'none') return result;
    // Use DOMMatrix to decompose the full matrix
    try {
      const m = new DOMMatrix(transformStr);
      result.translateX = m.m41;
      result.translateY = m.m42;
      const sx = Math.sqrt(m.a*m.a + m.b*m.b);
      const sy = Math.sqrt(m.c*m.c + m.d*m.d);
      result.scaleX = sx || 1;
      result.scaleY = sy || 1;
      result.rotate = Math.atan2(m.b, m.a) * 180 / Math.PI;
    } catch(e) {}
    return result;
  }

  // Parse CSS filter string into a map of filter functions → numeric values.
  // e.g. "blur(4px) brightness(1.2)" → { blur: 4, brightness: 1.2 }
  function parseFilterComponents(filterStr) {
    const result = {};
    if (!filterStr || filterStr === 'none') return result;
    const re = /([\w-]+)\(([^)]+)\)/g;
    let m;
    while ((m = re.exec(filterStr)) !== null) {
      result[m[1]] = parseFloat(m[2]);
    }
    return result;
  }

  // Build a CSS filter string from a components map
  function buildFilterString(components) {
    const parts = [];
    if (components.blur    != null && components.blur    > 0) parts.push(`blur(${components.blur.toFixed(2)}px)`);
    if (components.brightness != null)  parts.push(`brightness(${components.brightness.toFixed(3)})`);
    if (components.contrast   != null)  parts.push(`contrast(${components.contrast.toFixed(3)})`);
    if (components.saturate   != null)  parts.push(`saturate(${components.saturate.toFixed(3)})`);
    if (components.hue_rotate != null)  parts.push(`hue-rotate(${components['hue-rotate'] ?? components.hue_rotate}deg)`);
    return parts.length ? parts.join(' ') : '';
  }

  // JS-interpolate a single numeric property across sorted raw keyframes at tSec.
  function lkfInterp(rawKfs, tSec, prop, fallback) {
    if (!rawKfs || rawKfs.length === 0) return fallback;
    if (rawKfs.length === 1) return rawKfs[0][prop] !== undefined ? rawKfs[0][prop] : fallback;
    const last = rawKfs[rawKfs.length - 1];
    if (tSec >= last.time) return last[prop] !== undefined ? last[prop] : fallback;
    const first = rawKfs[0];
    if (tSec <= first.time) return first[prop] !== undefined ? first[prop] : fallback;

    let from = first, to = last;
    for (let i = 0; i < rawKfs.length - 1; i++) {
      if (tSec >= rawKfs[i].time && tSec <= rawKfs[i+1].time) {
        from = rawKfs[i]; to = rawKfs[i+1]; break;
      }
    }
    const span = Math.max(0.0001, to.time - from.time);
    const t    = Math.max(0, Math.min(1, (tSec - from.time) / span));
    const fv   = from[prop] !== undefined ? from[prop] : fallback;
    const tv   = to[prop]   !== undefined ? to[prop]   : fallback;
    return fv + (tv - fv) * t;
  }

  function lkfInterpColor(rawKfs, tSec, prop, fallback) {
    if (!rawKfs || rawKfs.length === 0) return fallback;
    const last = rawKfs[rawKfs.length - 1];
    if (tSec >= last.time) return last[prop] !== undefined ? last[prop] : fallback;
    const first = rawKfs[0];
    if (tSec <= first.time) return first[prop] !== undefined ? first[prop] : fallback;

    let from = first, to = last;
    for (let i = 0; i < rawKfs.length - 1; i++) {
      if (tSec >= rawKfs[i].time && tSec <= rawKfs[i+1].time) {
        from = rawKfs[i]; to = rawKfs[i+1]; break;
      }
    }
    const span = Math.max(0.0001, to.time - from.time);
    const t    = Math.max(0, Math.min(1, (tSec - from.time) / span));
    const fv   = from[prop] !== undefined ? from[prop] : fallback;
    const tv   = to[prop]   !== undefined ? to[prop]   : fallback;
    return lerpColor(fv, tv, t);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // previewTimelineAtTime — composited playback engine
  //
  // Architecture:
  //   Each preset animation is sampled in isolation on its OWN dedicated
  //   off-screen element (one per unique animation fingerprint).  This
  //   eliminates the multi-animation interference bug: previously all
  //   animations shared one sampler node, so WAAPI would composite them
  //   together and getComputedStyle returned the wrong blended value.
  //
  //   LKF keyframes are evaluated purely in JS (no WAAPI) from the raw
  //   sorted keyframe store, using linear interpolation between adjacent
  //   keyframes.  This makes them frame-accurate even during fast scrubbing.
  //
  //   Both contributions are then additively/multiplicatively composed and
  //   written to the visible element exactly once per frame as:
  //     • one transform string  (translate + rotate + scale)
  //     • one opacity value     (multiplicative)
  //     • one filter string     (blur additive, others multiplicative)
  //   Child-element properties (text color, fill, fontSize …) are written
  //   to their respective child nodes after the root compositing step.
  // ─────────────────────────────────────────────────────────────────────────
  function previewTimelineAtTime() {
    const scene       = getActiveScene();
    const keyframeMap = (window.v1Data && window.v1Data.animationKeyframes) || {};

    // Pool of dedicated off-screen sampler nodes, keyed by animation fingerprint.
    // Using one node per animation avoids WAAPI composite interference.
    if (!window._samplerPool) window._samplerPool = {};
    const pool = window._samplerPool;

    function getSamplerFor(fp, waKfs, duration, easing) {
      let entry = pool[fp];
      if (!entry) {
        const el = document.createElement('div');
        el.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:100px;height:100px;pointer-events:none;visibility:hidden;';
        document.body.appendChild(el);
        entry = { el, wa: null, fp: null };
        pool[fp] = entry;
      }
      // Re-create the WAAPI animation if fingerprint changed or it died
      if (!entry.wa || entry.wa.playState === 'idle' || entry.wa.effect === null || entry.fp !== fp) {
        if (entry.wa) { try { entry.wa.cancel(); } catch(e) {} }
        try {
          entry.wa = entry.el.animate(waKfs, {
            duration,
            fill: 'both',
            easing: easing || 'linear',
            iterations: 1,
          });
          entry.wa.pause();
          entry.fp = fp;
        } catch(e) { return null; }
      }
      return entry;
    }

    scene.layers.forEach(layer => {
      const elNode = viewportNode
        ? viewportNode.querySelector(`.canvas-element[data-id="${layer.id}"]`)
        : null;
      if (!elNode) return;

      const baseRotation = layer.rotation || 0;
      const baseOpacity  = layer.opacity  != null ? layer.opacity : 1;

      // ── Step 1: Sample each preset animation independently ────────────
      //
      // preset accumulator — identity values so "no animation" == no change
      let preset = {
        translateX: 0, translateY: 0,
        rotate:     0,              // delta in degrees from the animation
        scaleX:     1, scaleY:  1,
        // opacity delta: we accumulate as a *multiplier relative to 1.0*,
        // not relative to layer.opacity, so we don't double-apply the base.
        opacityMul: 1,
        filters:    {},
        zoom:       null,
      };

      let anyPresetActive = false;

      layer.animations.forEach(anim => {
        const keyframes = anim._compiledKeyframes || keyframeMap[anim.name];
        if (!keyframes || keyframes.length < 2) return;

        const animStart = anim.start;
        const animEnd   = anim.start + anim.duration;
        const inRange   = state.currentTime >= animStart && state.currentTime <= animEnd;
        const past      = state.currentTime > animEnd;
        if (!inRange && !past) return;  // animation hasn't started yet

        anyPresetActive = true;
        const localTime = inRange ? (state.currentTime - animStart) : anim.duration;
        const waKfs     = keyframes.map(({ offset, ...rest }) => ({ ...rest, offset }));
        const fp        = `${anim.duration}|${anim.easing || 'linear'}|${
          anim._compiledKeyframes ? JSON.stringify(anim._compiledKeyframes) : anim.name
        }`;

        const entry = getSamplerFor(fp, waKfs, anim.duration, anim.easing || 'linear');
        if (!entry) return;
        entry.wa.currentTime = localTime;

        // Read the isolated computed style for THIS animation only
        const cs = window.getComputedStyle(entry.el);

        // ── Transform decomposition ──────────────────────────────────
        const tc = parseTransformComponents(cs.transform);
        preset.translateX += tc.translateX;
        preset.translateY += tc.translateY;
        // rotate: the sampler starts at identity (0 deg), so whatever
        // rotate came back IS the delta this animation contributes.
        preset.rotate     += tc.rotate;
        preset.scaleX     *= tc.scaleX;
        preset.scaleY     *= tc.scaleY;

        // ── Opacity (as a multiplier from 1.0) ───────────────────────
        // The preset keyframes express opacity as absolute (0-1).
        // We multiply all preset contributions together.  The base
        // layer.opacity is applied once at write-time.
        const op = parseFloat(cs.opacity);
        if (!isNaN(op)) preset.opacityMul *= op;

        // ── Filters ──────────────────────────────────────────────────
        const fComps = parseFilterComponents(cs.filter);
        Object.entries(fComps).forEach(([fn, val]) => {
          if (preset.filters[fn] == null) preset.filters[fn] = (fn === 'blur') ? 0 : 1;
          preset.filters[fn] = (fn === 'blur') ? preset.filters[fn] + val : preset.filters[fn] * val;
        });

        // ── Zoom (CSS non-standard, interpolate manually) ─────────────
        const compiledKfs = anim._compiledKeyframes;
        if (compiledKfs && compiledKfs.some(k => k.zoom !== undefined)) {
          const progress = localTime / anim.duration;
          const sorted   = [...compiledKfs].sort((a,b) => a.offset - b.offset);
          let from = sorted[0], to = sorted[sorted.length - 1];
          for (let ki = 0; ki < sorted.length - 1; ki++) {
            if (progress >= sorted[ki].offset && progress <= sorted[ki+1].offset) {
              from = sorted[ki]; to = sorted[ki+1]; break;
            }
          }
          const span  = Math.max(0.0001, to.offset - from.offset);
          const tProg = Math.max(0, Math.min(1, (progress - from.offset) / span));
          const zA = from.zoom !== undefined ? parseFloat(from.zoom) : 1;
          const zB = to.zoom   !== undefined ? parseFloat(to.zoom)   : 1;
          preset.zoom = (preset.zoom == null ? 1 : preset.zoom) * (zA + (zB - zA) * tProg);
        }
      });

      // ── Step 2: Compute LKF contribution via JS interpolation ─────────
      const rawKfs    = (layer._lkfCompiled && layer._lkfCompiled.raw) || [];
      const lkfActive = rawKfs.length >= 2;
      // tSec: use actual current time in seconds; don't clamp to lkfMaxT so
      // that after the last keyframe the last value is held (correct) but the
      // LKF is still considered "active" while time is within its range.
      const lkfMaxT   = lkfActive ? rawKfs[rawKfs.length - 1].time : 0;
      const lkfMinT   = lkfActive ? rawKfs[0].time : 0;
      const tSec      = state.currentTime / 1000;
      // Whether playhead is within the LKF range (hold last value when past end)
      const inLkfRange = lkfActive && tSec <= lkfMaxT;
      const pastLkf    = lkfActive && tSec > lkfMaxT;
      // Effective time for interpolation (clamped to [first,last] keyframe)
      const tLkf = lkfActive ? Math.max(lkfMinT, Math.min(lkfMaxT, tSec)) : 0;

      const lkfHasProp = (prop) => rawKfs.some(k => k[prop] !== undefined);

      // LKF deltas (identity = no change)
      let lkf = {
        translateX: 0, translateY: 0,
        rotate:     0,
        scaleX:     1, scaleY: 1,
        opacity:    null,   // null = not set by LKF
        blur:       null,   // null = not set by LKF
      };

      if (lkfActive) {
        if (lkfHasProp('x')) {
          const baseX = rawKfs[0].x !== undefined ? rawKfs[0].x : layer.x;
          lkf.translateX = lkfInterp(rawKfs, tLkf, 'x', baseX) - baseX;
        }
        if (lkfHasProp('y')) {
          const baseY = rawKfs[0].y !== undefined ? rawKfs[0].y : layer.y;
          lkf.translateY = lkfInterp(rawKfs, tLkf, 'y', baseY) - baseY;
        }
        if (lkfHasProp('rotation')) {
          lkf.rotate = lkfInterp(rawKfs, tLkf, 'rotation', baseRotation) - baseRotation;
        }
        if (lkfHasProp('scaleX')) lkf.scaleX = lkfInterp(rawKfs, tLkf, 'scaleX', 1);
        if (lkfHasProp('scaleY')) lkf.scaleY = lkfInterp(rawKfs, tLkf, 'scaleY', 1);
        if (lkfHasProp('opacity')) {
          lkf.opacity = lkfInterp(rawKfs, tLkf, 'opacity', baseOpacity);
        }
        if (lkfHasProp('blur')) {
          lkf.blur = lkfInterp(rawKfs, tLkf, 'blur', 0);
        }
      }

      // ── Step 3: Compose everything and write once ──────────────────────

      // TRANSFORM
      // translate: preset delta + LKF delta (both relative to base position)
      const finalTX     = preset.translateX + lkf.translateX;
      const finalTY     = preset.translateY + lkf.translateY;
      // rotation: base + preset rotation delta + LKF rotation delta
      const composedRot = baseRotation + preset.rotate + lkf.rotate;
      // scale: multiplicative — preset scale × LKF scale
      const finalScaleX = preset.scaleX * lkf.scaleX;
      const finalScaleY = preset.scaleY * lkf.scaleY;

      elNode.style.transform = `translate(${finalTX.toFixed(3)}px,${finalTY.toFixed(3)}px) rotate(${composedRot.toFixed(3)}deg) scale(${finalScaleX.toFixed(4)},${finalScaleY.toFixed(4)})`;

      // OPACITY
      // preset.opacityMul is the product of all preset keyframe opacities (0-1).
      // lkf.opacity is an absolute value (0-1) or null.
      // Final = baseOpacity × presetMul × lkfMul
      // where lkfMul = lkf.opacity / baseOpacity (converts absolute → relative)
      let finalOpacity;
      if (lkf.opacity !== null) {
        // LKF sets an absolute opacity; treat preset as a multiplier on top
        finalOpacity = lkf.opacity * preset.opacityMul;
      } else {
        // No LKF opacity — apply base × preset multiplier
        finalOpacity = baseOpacity * preset.opacityMul;
      }
      elNode.style.opacity = String(Math.max(0, Math.min(1, finalOpacity)));

      // FILTER
      // preset.filters already has accumulated filter values.
      // LKF blur is additive on top.
      const composedFilters = { ...preset.filters };
      if (lkf.blur !== null) {
        composedFilters.blur = (composedFilters.blur || 0) + lkf.blur;
      }
      elNode.style.filter = buildFilterString(composedFilters) || '';

      // ZOOM (preset only)
      if (preset.zoom != null) {
        elNode.style.zoom = String(preset.zoom);
      } else {
        elNode.style.zoom = '';
      }

      // ── LKF-only properties: width, height, radius, children ──────────
      if (lkfActive) {
        const shapeEl = elNode.querySelector('.element-shape');
        const textEl  = elNode.querySelector('.element-text');

        if (lkfHasProp('width'))
          elNode.style.width = `${lkfInterp(rawKfs, tLkf, 'width', layer.width).toFixed(1)}px`;
        if (lkfHasProp('height'))
          elNode.style.height = `${lkfInterp(rawKfs, tLkf, 'height', layer.height).toFixed(1)}px`;
        if (lkfHasProp('borderRadius'))
          elNode.style.borderRadius = `${lkfInterp(rawKfs, tLkf, 'borderRadius', layer.radius || 0).toFixed(1)}px`;

        if (lkfHasProp('fill') && shapeEl)
          shapeEl.style.background = lkfInterpColor(rawKfs, tLkf, 'fill', layer.fill || 'transparent');
        if (lkfHasProp('color') && textEl)
          textEl.style.color = lkfInterpColor(rawKfs, tLkf, 'color', layer.color || '#ffffff');
        if (lkfHasProp('fontSize') && textEl)
          textEl.style.fontSize = `${lkfInterp(rawKfs, tLkf, 'fontSize', layer.fontSize || 16).toFixed(2)}px`;
        if (lkfHasProp('letterSpacing') && textEl)
          textEl.style.letterSpacing = `${lkfInterp(rawKfs, tLkf, 'letterSpacing', parseFloat(layer.letterSpacing || 0)).toFixed(3)}px`;
        if (lkfHasProp('lineHeight') && textEl)
          textEl.style.lineHeight = lkfInterp(rawKfs, tLkf, 'lineHeight', parseFloat(layer.lineHeight || 1)).toFixed(4);
        if (lkfHasProp('stroke') || lkfHasProp('strokeWidth')) {
          const sw = lkfInterp(rawKfs, tLkf, 'strokeWidth', layer.strokeWidth || 0).toFixed(1);
          const sc = lkfInterpColor(rawKfs, tLkf, 'stroke', layer.stroke || 'transparent');
          elNode.style.outline = `${sw}px solid ${sc}`;
        }
      } else {
        // No LKF — clear any residual LKF inline styles from a previous render
        if (elNode._lkfStylesApplied) {
          elNode.style.width = elNode.style.height = elNode.style.borderRadius =
            elNode.style.outline = '';
          const tec = elNode.querySelector('.element-text');
          const sec = elNode.querySelector('.element-shape');
          if (tec) { tec.style.color = tec.style.fontSize = tec.style.letterSpacing = tec.style.lineHeight = ''; }
          if (sec) { sec.style.background = ''; }
        }
      }
      elNode._lkfStylesApplied = lkfActive;

      // ── Fallback: nothing animating at all — restore base render state ─
      if (!anyPresetActive && !lkfActive) {
        elNode.style.transform    = `rotate(${baseRotation}deg)`;
        elNode.style.opacity      = String(baseOpacity);
        elNode.style.filter       = '';
        elNode.style.zoom         = '';
        elNode.style.width        = '';
        elNode.style.height       = '';
        elNode.style.borderRadius = '';
        elNode.style.outline      = '';
      }
    });
  }

  // Use Web Animations API for a one-shot interpolation snapshot at a given progress (0-1)
  function applyInterpolation(elNode, keyframes, progress, layer) {
    const waKeyframes = keyframes.map(({ offset, ...rest }) => ({ ...rest, offset }));
    if (elNode._snapAnim) {
      try { elNode._snapAnim.cancel(); } catch(e) {}
    }
    try {
      const anim = elNode.animate(waKeyframes, { duration: 1000, fill: 'forwards', easing: 'linear' });
      anim.currentTime = progress * 1000;
      anim.pause();
      elNode._snapAnim = anim;
    } catch (e) {
      const idx = Math.min(Math.floor(progress * (keyframes.length - 1)), keyframes.length - 2);
      const from = keyframes[idx], to = keyframes[idx + 1];
      const seg  = (progress - from.offset) / Math.max(0.001, to.offset - from.offset);
      if (from.opacity != null && to.opacity != null)
        elNode.style.opacity = from.opacity + (to.opacity - from.opacity) * seg;
      if (from.transform)
        elNode.style.transform = `rotate(${layer.rotation || 0}deg) ${from.transform}`;
    }
  }

  // Draw timeline track blocks
  function renderTimeline() {
    const namesContainer = document.getElementById('tlTrackNames');
    const rowsContainer = document.getElementById('tlTrackRows');
    const ruler = document.getElementById('tlRuler');
    
    namesContainer.innerHTML = '';
    rowsContainer.innerHTML = '';
    ruler.innerHTML = '';

    // Draw ruler seconds ticks (200px = 1s)
    for (let s = 0; s <= 10; s++) {
      const mark = document.createElement('div');
      mark.className = 'timeline-second-mark';
      mark.style.left = `${s * 200}px`;
      mark.innerHTML = `${s}s`;
      ruler.appendChild(mark);
    }

    const scene = getActiveScene();
    scene.layers.forEach((layer) => {
      // Track Name row
      const nameRow = document.createElement('div');
      nameRow.className = 'timeline-track-name-row';
      nameRow.textContent = layer.name;
      namesContainer.appendChild(nameRow);

      // Track Blocks row
      const trackRow = document.createElement('div');
      trackRow.className = 'timeline-track-row';
      
      // Draw anim blocks inside this track
      layer.animations.forEach((anim, animIndex) => {
        const block = document.createElement('div');
        block.className = 'timeline-anim-block';
        
        // 200px = 1s = 1000ms
        const left = (anim.start / 1000) * 200;
        const width = (anim.duration / 1000) * 200;
        
        block.style.left = `${left}px`;
        block.style.width = `${width}px`;
        block.innerHTML = `
          <div class="timeline-anim-block-resize-handle left"></div>
          <span>${anim.name}</span>
          <div class="timeline-anim-block-resize-handle right"></div>
        `;

        // Handle Drag & Resize events on block
        block.addEventListener('mousedown', (e) => {
          e.stopPropagation();
          const startX = e.clientX;
          const originalStart = anim.start;
          const originalDuration = anim.duration;

          const isResizeLeft = e.target.classList.contains('left');
          const isResizeRight = e.target.classList.contains('right');

          const onMouseMove = (moveEvt) => {
            const dx = ((moveEvt.clientX - startX) / 200) * 1000;
            
            if (isResizeLeft) {
              const newStart = Math.max(0, originalStart + dx);
              const diff = newStart - anim.start;
              anim.start = newStart;
              anim.duration = Math.max(100, originalDuration - diff);
            } else if (isResizeRight) {
              anim.duration = Math.max(100, originalDuration + dx);
            } else {
              anim.start = Math.max(0, originalStart + dx);
            }
            
            // Limit timeline total bounds dynamically if overflow
            state.duration = Math.max(5000, anim.start + anim.duration);
            
            // Re-render blocks
            block.style.left = `${(anim.start / 1000) * 200}px`;
            block.style.width = `${(anim.duration / 1000) * 200}px`;
            updatePlayheadPosition();
            previewTimelineAtTime();
          };

          const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            saveState();
            renderAll();
          };

          window.addEventListener('mousemove', onMouseMove);
          window.addEventListener('mouseup', onMouseUp);
        });

        trackRow.appendChild(block);
      });

      // ─── Draw layer keyframe diamond markers on this track ───
      if (layer.layerKeyframes && layer.layerKeyframes.length > 0) {
        layer.layerKeyframes.forEach(kf => {
          const marker = document.createElement('div');
          const kfX = (kf.time * 1000 / 1000) * 200; // 200px = 1s
          const curT = state.currentTime / 1000;
          const isActive = Math.abs(kf.time - curT) < 0.02;

          marker.className = 'kfe-timeline-marker';
          marker.title = `Keyframe at ${kf.time.toFixed(2)}s — click to jump`;
          marker.dataset.kfTime = kf.time;
          marker.style.cssText = `
            position:absolute;
            left:${kfX}px;
            top:50%;
            transform:translate(-50%,-50%) rotate(45deg);
            width:8px;height:8px;
            background:${isActive ? '#a78bfa' : '#7c3aed'};
            border:1.5px solid ${isActive ? '#c4b5fd' : 'rgba(167,139,250,0.6)'};
            border-radius:2px;
            cursor:pointer;
            z-index:4;
            box-shadow:${isActive ? '0 0 6px rgba(167,139,250,0.8)' : 'none'};
            transition:all 0.15s;
          `;

          // Click marker → jump playhead and refresh panel
          marker.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            state.currentTime = kf.time * 1000;
            updatePlayheadPosition();
            previewTimelineAtTime();
            renderPropertyPanel();
          });

          // Drag marker left/right
          marker.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            const startX = e.clientX;
            const origTime = kf.time;

            const onMove = (mv) => {
              const dx = (mv.clientX - startX) / 200; // in seconds
              const newTime = Math.max(0, parseFloat((origTime + dx).toFixed(3)));
              kf.time = newTime;
              marker.style.left = `${(kf.time * 1000 / 1000) * 200}px`;
              state.currentTime = newTime * 1000;
              updatePlayheadPosition();
              previewTimelineAtTime();
            };
            const onUp = () => {
              layer.layerKeyframes.sort((a,b)=>a.time-b.time);
              applyLayerKeyframeAnimation(layer);
              saveState();
              renderTimeline();
              renderPropertyPanel();
              window.removeEventListener('mousemove', onMove);
              window.removeEventListener('mouseup', onUp);
            };
            window.addEventListener('mousemove', onMove);
            window.addEventListener('mouseup', onUp);
          });

          trackRow.appendChild(marker);
        });
      }

      rowsContainer.appendChild(trackRow);
    });
  }

  // --- Import / Export System ---

  // Clean a single layer down to only what's needed for animation playback
  function exportCleanLayer(layer) {
    // Fields that are pure internal/rendering state — never exported
    const STRIP = ['html', 'url', '_animCache', '_snapAnim', '_compiledKeyframes',
                   'fill', 'shapeType', 'radius', 'fontFamily', 'fontWeight',
                   'letterSpacing', 'lineHeight', 'alignment', 'content'];

    const clean = {
      id:       layer.id,
      name:     layer.name,
      type:     layer.type,
      x:        layer.x,
      y:        layer.y,
      width:    layer.width,
      height:   layer.height,
      opacity:  layer.opacity,
      rotation: layer.rotation || 0,
    };

    // Only include text content as a label (not full HTML)
    if (layer.type === 'text') clean.text = layer.content || '';
    if (layer.type === 'image' && layer.url && !layer.url.startsWith('data:')) {
      clean.imageUrl = layer.url; // external URLs only — no base64 blobs
    }
    // Image frame — export position/scale, external URL only (no base64)
    if (layer.type === 'imageframe') {
      if (layer.imgUrl && !layer.imgUrl.startsWith('data:')) clean.imageUrl = layer.imgUrl;
      clean.imgScale = layer.imgScale || 1;
      clean.imgX = layer.imgX || 0;
      clean.imgY = layer.imgY || 0;
      clean.radius = layer.radius || 0;
    }

    // Animations — strip internal cache keys
    if (layer.animations && layer.animations.length > 0) {
      clean.animations = layer.animations.map(anim => {
        const a = {
          id:        anim.id,
          name:      anim.name,
          start:     anim.start,
          duration:  anim.duration,
          easing:    anim.easing,
          direction: anim.direction,
          fill:      anim.fill,
        };
        if (anim.infinite) a.infinite = true;
        if (anim.keyframes && anim.keyframes.length > 0) a.keyframes = anim.keyframes;
        return a;
      });
    } else {
      clean.animations = [];
    }

    // Groups — export children recursively
    if (layer.type === 'group' && layer.children) {
      clean.children = layer.children.map(exportCleanLayer);
    }

    return clean;
  }

  function exportProjectJSON() {
    const W = state.canvasWidth  || 800;
    const H = state.canvasHeight || 600;

    // Check if a layer is fully outside the canvas bounds
    function isOverflowing(layer) {
      const lx = layer.x || 0;
      const ly = layer.y || 0;
      const lw = layer.width || 0;
      const lh = layer.height || 0;
      // Fully outside on any side
      return (lx + lw <= 0) || (ly + lh <= 0) || (lx >= W) || (ly >= H);
    }

    // Export a layer — if overflowing, strip position/size but keep animations
    function exportLayer(layer) {
      const clean = exportCleanLayer(layer);
      if (isOverflowing(layer)) {
        clean.overflow = true;   // flag it
        // Remove position/size — they are outside the visible canvas
        delete clean.x;
        delete clean.y;
        delete clean.width;
        delete clean.height;
        delete clean.rotation;
        delete clean.opacity;
        delete clean.text;
        delete clean.imageUrl;
        delete clean.imgScale;
        delete clean.imgX;
        delete clean.imgY;
        delete clean.radius;
        // Keep: id, name, type, animations
      }
      return clean;
    }

    const exportData = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      canvas: { width: W, height: H },
      duration: state.duration,
      scenes: state.scenes
        .filter(s => s.layers && s.layers.length > 0)  // skip empty scenes
        .map(scene => ({
          id:         scene.id,
          name:       scene.name,
          transition: scene.transition || 'fade',
          layers: scene.layers
            .filter(l => l.visible !== false)           // skip hidden layers
            .map(exportLayer)
        }))
    };

    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `animation_export_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Exported ${exportData.scenes.length} scene(s)`);
  }

  function importProjectJSON(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.scenes && data.project) {
          state.project = data.project;
          state.scenes = data.scenes;
          state.currentSceneId = data.scenes[0].id;
          state.selectedLayerId = null;
          recompileAllLayerKeyframes();
          saveState();
          renderAll();
          showToast("Project Loaded Successfully!");
        } else {
          showToast("Invalid JSON schema!");
        }
      } catch (err) {
        showToast("Error parsing JSON file!");
      }
    };
    reader.readAsText(file);
  }

  function setupFileMenu() {
    document.getElementById('btnExportProj').addEventListener('click', () => {
      exportProjectJSON();
    });

    document.getElementById('btnSaveProj').addEventListener('click', () => {
      localStorage.setItem('studio_project', JSON.stringify({
        project: state.project,
        scenes: state.scenes,
        canvasWidth: state.canvasWidth,
        canvasHeight: state.canvasHeight
      }));
      showToast("Project Saved to LocalStorage");
    });

    document.getElementById('btnLoadProj').addEventListener('click', () => {
      const stored = localStorage.getItem('studio_project');
      if (stored) {
        const data = JSON.parse(stored);
        state.project = data.project;
        state.scenes = data.scenes;
        state.currentSceneId = data.scenes[0].id;
        state.selectedLayerId = null;
        // Restore canvas dimensions if saved
        if (data.canvasWidth)  { state.canvasWidth  = data.canvasWidth; }
        if (data.canvasHeight) { state.canvasHeight = data.canvasHeight; }
        // Apply the stored canvas size to the viewport DOM node
        const vp = document.getElementById('canvasViewport');
        if (vp) {
          vp.style.width  = state.canvasWidth  + 'px';
          vp.style.height = state.canvasHeight + 'px';
        }
        const canvasSizeLabel = document.getElementById('canvasSizeLabel');
        if (canvasSizeLabel) canvasSizeLabel.textContent = `${state.canvasWidth}×${state.canvasHeight}`;
        recompileAllLayerKeyframes();
        saveState();
        renderAll();
        centerCanvas();
        showToast("Project Loaded");
      } else {
        document.getElementById('importFile').click();
      }
    });

    document.getElementById('importFile').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        importProjectJSON(file);
      }
    });
  }

  // --- Main Master Renderer ---
  function renderAll() {
    renderScenes();
    renderLayersPanel();
    renderCanvas();
    renderPropertyPanel();
    renderTimeline();
    updatePlayheadPosition();
    // Only re-apply animation state if the timeline has been actively scrubbed
    // (currentTime > 0) or playback is running, to avoid hiding elements at
    // their start-of-animation state on initial page load / undo / scene switch.
    if (state.currentTime > 0 || state.isPlaying) {
      previewTimelineAtTime();
    }
  }

  // Setup tab switcher logic
  function setupTabs() {
    const tabs = ['Anims', 'Comps', 'Assets'];
    tabs.forEach(tab => {
      document.getElementById(`tabBtn${tab}`).addEventListener('click', () => {
        tabs.forEach(t => document.getElementById(`tabBtn${t}`).classList.remove('active'));
        document.getElementById(`tabBtn${tab}`).classList.add('active');
        renderSidebarTab(tab.toLowerCase());
      });
    });

    // Default left panel loaded
    renderSidebarTab('anims');
  }

  // Wire up Add Scene button (created dynamically in initStudioDOM)
  function setupSceneControls() {
    document.getElementById('btnAddScene').addEventListener('click', addScene);
  }

  // Deselect layer when clicking blank canvas area
  function setupCanvasDeselect() {
    const wrapper = document.getElementById('canvasWrapper');
    wrapper.addEventListener('mousedown', (e) => {
      // Only deselect if the click target is the wrapper, canvas or viewport itself
      if (
        e.target === wrapper ||
        e.target === canvasNode ||
        e.target === viewportNode
      ) {
        if (state.selectedLayerId || state.selectedLayerIds.length > 0) {
          selectLayer(null);
        }
      }
    });

    // Intercept click on sb-item in studio mode
    document.querySelectorAll('.sb-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (state.activeMode === 'studio') {
          e.stopPropagation();
          e.preventDefault();
          if (state.selectedLayerId) {
            applyAnimToLayer(state.selectedLayerId, item.dataset.name);
          } else {
            showToast("Select a canvas layer first!");
          }
        }
      }, true); // use capture phase
    });
  }

  // Run initialization
  initStudioDOM();
  initCanvasRefs();
  setupModeToggles();
  setupTabs();
  initCanvasControls();
  initTimelineControls();
  setupFileMenu();
  setupSceneControls();
  setupCanvasDeselect();

  // Force default Studio mode on load
  document.getElementById('modeBtnStudio').click();
  renderAll();

  // Retry centering until the wrapper has real dimensions (grid layout may take a few frames)
  let centerAttempts = 0;
  function tryCenterAndPlay() {
    const ok = centerCanvas();
    centerAttempts++;
    if (!ok && centerAttempts < 20) {
      // Layout not ready yet — try again next frame
      requestAnimationFrame(tryCenterAndPlay);
    } else {
      renderAll(); // re-render at correct zoom
      setTimeout(() => playTimeline(), 80);
    }
  }
  requestAnimationFrame(tryCenterAndPlay);
});