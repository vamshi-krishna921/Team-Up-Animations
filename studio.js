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
            x: 60,
            y: 120,
            width: 440,
            height: 320,
            fill: '#ffffff',
            radius: 24,
            opacity: 1,
            visible: true,
            locked: true,
            animations: []
          },
          {
            id: 'layer_hero',
            type: 'image',
            name: 'Hero Illustration',
            url: 'hero_illustration.png',
            x: 440,
            y: 140,
            width: 320,
            height: 320,
            opacity: 1,
            visible: true,
            locked: false,
            animations: [
              {
                name: 'Slide Up',
                start: 1500,
                duration: 2000,
                easing: 'cubic-bezier(0.22,1,0.36,1)',
                infinite: false,
                direction: 'normal',
                fill: 'forwards'
              }
            ]
          },
          {
            id: 'layer_title',
            type: 'text',
            name: 'Title Text',
            x: 100,
            y: 180,
            width: 360,
            height: 80,
            content: 'Animate Beautifully',
            fontSize: 36,
            fontWeight: '700',
            fontFamily: 'Inter',
            color: '#6366f1',
            letterSpacing: '0px',
            lineHeight: '1.2',
            alignment: 'left',
            opacity: 1,
            visible: true,
            locked: false,
            animations: [
              {
                name: 'Slide Up',
                start: 0,
                duration: 3200,
                easing: 'cubic-bezier(0.22,1,0.36,1)',
                infinite: false,
                direction: 'normal',
                fill: 'forwards'
              }
            ]
          },
          {
            id: 'layer_subtitle',
            type: 'text',
            name: 'Subtitle Text',
            x: 100,
            y: 270,
            width: 360,
            height: 60,
            content: 'Design, animate and export stunning animations',
            fontSize: 16,
            fontWeight: '500',
            fontFamily: 'Inter',
            color: '#4b5563',
            letterSpacing: '0px',
            lineHeight: '1.4',
            alignment: 'left',
            opacity: 1,
            visible: true,
            locked: false,
            animations: [
              {
                name: 'Fade In',
                start: 500,
                duration: 1700,
                easing: 'ease-out',
                infinite: false,
                direction: 'normal',
                fill: 'forwards'
              }
            ]
          },
          {
            id: 'layer_button',
            type: 'ui',
            name: 'Button',
            x: 100,
            y: 350,
            width: 160,
            height: 44,
            html: '<button class="bounce-btn" style="width:100%;height:100%;cursor:default;background:#6366f1;color:#ffffff;border:none;border-radius:12px;font-weight:700;font-size:14px;box-shadow:0 4px 14px rgba(99,102,241,0.4);">Get Started</button>',
            opacity: 1,
            visible: true,
            locked: false,
            animations: [
              {
                name: 'Pulse',
                start: 1200,
                duration: 2000,
                easing: 'cubic-bezier(0.22,1,0.36,1)',
                infinite: false,
                direction: 'normal',
                fill: 'forwards'
              }
            ]
          },
          {
            id: 'layer_icons',
            type: 'ui',
            name: 'Floating Icons',
            x: 410,
            y: 150,
            width: 360,
            height: 280,
            html: '<div style="position:relative; width:100%; height:100%;"><div style="position:absolute; top:20px; left:10px; background:#6366f1; color:#fff; width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:18px; box-shadow:0 4px 10px rgba(0,0,0,0.15);">T</div><div style="position:absolute; top:120px; left:30px; background:#ec4899; color:#fff; width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:18px; box-shadow:0 4px 10px rgba(0,0,0,0.15);">🖼️</div><div style="position:absolute; top:110px; right:10px; background:#3b82f6; color:#fff; width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:18px; box-shadow:0 4px 10px rgba(0,0,0,0.15);">▶️</div></div>',
            opacity: 1,
            visible: true,
            locked: false,
            animations: [
              {
                name: 'Liquid Float',
                start: 2200,
                duration: 2800,
                easing: 'cubic-bezier(0.22,1,0.36,1)',
                infinite: false,
                direction: 'normal',
                fill: 'forwards'
              }
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
    isPlaying: false,
    currentTime: 0, // In milliseconds (0 to 5000ms)
    duration: 5000, // Total timeline length (5s)
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
    
    // UI Elements
    'Card': { type: 'ui', template: 'Card', width: 280, height: 140, html: `<div class="glass-card" style="width:100%;height:100%;"><div class="card-icon-circle bg-purple">✦</div><div class="card-content"><h4>Modern UI Card</h4><p>Draggable UI Component</p></div></div>` },
    'Button': { type: 'ui', template: 'Button', width: 180, height: 44, html: `<button class="bounce-btn" style="width:100%;height:100%;cursor:default;">Action Button ⚡</button>` },
    'Avatar': { type: 'ui', template: 'Avatar', width: 64, height: 64, html: `<div class="shimmer-avatar" style="width:100%;height:100%;margin:0;"></div>` },
    'Notification': { type: 'ui', template: 'Notification', width: 280, height: 60, html: `<div class="glass-card slide-banner" style="width:100%;height:100%;margin:0;"><div class="banner-status-dot"></div><span>Sync Complete</span></div>` }
  };

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

  function undo() {
    if (state.historyIndex > 0) {
      state.historyIndex--;
      const snapshot = JSON.parse(state.history[state.historyIndex]);
      state.scenes = snapshot.scenes;
      state.currentSceneId = snapshot.currentSceneId;
      state.selectedLayerId = snapshot.selectedLayerId;
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
      renderAll();
      showToast("Redo");
    }
  }

  // --- Keyboard Shortcuts ---
  window.addEventListener('keydown', (e) => {
    if (state.activeMode !== 'studio') return;
    
    // Undo / Redo
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      undo();
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
      e.preventDefault();
      redo();
    }
    
    // Delete selected layer
    if ((e.key === 'Delete' || e.key === 'Backspace') && state.selectedLayerId) {
      // Don't trigger if typing in property inputs or textarea
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' || document.activeElement.contentEditable === 'true') return;
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
      
      // Switch active scene
      div.addEventListener('click', (e) => {
        if (e.target.closest('.scene-actions') || e.target.closest('input')) return;
        state.currentSceneId = scene.id;
        state.selectedLayerId = null;
        state.selectedLayerIds = [];
        renderAll();
      });

      // Double-click to rename scene
      const nameSpan = div.querySelector('.scene-meta-name');
      nameSpan.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        const input = document.createElement('input');
        input.type = 'text';
        input.value = scene.name;
        input.className = 'scene-rename-input';
        input.style.fontSize = 'inherit';
        input.style.width = '100px';
        input.style.background = 'var(--bg-code)';
        input.style.color = 'var(--text-primary)';
        input.style.border = '1px solid var(--border)';
        input.style.borderRadius = '4px';
        input.style.padding = '2px 4px';
        
        nameSpan.replaceWith(input);
        input.focus();
        
        const saveRename = () => {
          const newName = input.value.trim();
          if (newName) {
            scene.name = newName;
            saveState();
            renderAll();
          } else {
            input.replaceWith(nameSpan);
          }
        };
        
        input.addEventListener('blur', saveRename);
        input.addEventListener('keydown', (evt) => {
          if (evt.key === 'Enter') saveRename();
          if (evt.key === 'Escape') input.replaceWith(nameSpan);
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

  // Draggable left panel components
  let currentDragType = null;
  let currentDragData = null;

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

    window.addEventListener('mousemove', (e) => {
      if (state.isPanning) {
        const dx = e.clientX - state.dragStart.x;
        const dy = e.clientY - state.dragStart.y;
        state.panX += dx;
        state.panY += dy;
        state.dragStart = { x: e.clientX, y: e.clientY };
        applyCanvasTransform();
      }
    });

    window.addEventListener('mouseup', () => {
      state.isPanning = false;
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

  function applyCanvasTransform() {
    canvasNode.style.transform = `translate(${state.panX}px, ${state.panY}px) scale(${state.zoom})`;
    document.getElementById('zoomVal').textContent = `${Math.round(state.zoom * 100)}%`;
    renderRulers();
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
      el.remove();
    });

    scene.layers.forEach((layer) => {
      if (!layer.visible) return;

      const div = document.createElement('div');
      div.className = `canvas-element ${state.selectedLayerIds.includes(layer.id) ? 'selected' : ''}`;
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
      } else if (layer.type === 'ui') {
        const uiDiv = document.createElement('div');
        uiDiv.className = 'element-ui';
        uiDiv.innerHTML = layer.html;
        div.appendChild(uiDiv);
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

  window.addEventListener('mouseup', () => {
    if (state.isDraggingElements) {
      state.isDraggingElements = false;
      saveState();
      renderAll();
    }
  });

  // --- Property Inspector Renderer ---
  function renderPropertyPanel() {
    const container = document.getElementById('inspectorContent');
    const scene = getActiveScene();
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
    }

    // Animation assignments
    fields += `
      <div class="inspector-sec-title" style="margin-top:1rem;">Layer Animations</div>
      <div id="inspectorAnimsList">
    `;

    if (layer.animations.length === 0) {
      fields += `<div style="font-size:0.68rem; color:var(--text-muted);">No animations attached. Drag from Catalog to add.</div>`;
    } else {
      layer.animations.forEach((anim, i) => {
        const animId = anim.id || i; // legacy anims without id fall back to index
        fields += `
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--card-border); border-radius:6px; padding:0.5rem; margin-bottom:0.5rem;">
            <div style="display:flex; justify-content:between; align-items:center; margin-bottom:0.4rem;">
              <span style="font-size:0.72rem; font-weight:700; color:#a78bfa;">${anim.name}</span>
              <button class="layer-btn btn-del-anim" data-anim-id="${animId}" data-index="${i}" style="margin-left:auto;">🗑</button>
            </div>
            <div class="property-row-split" style="margin-bottom:0.25rem;">
              <div>
                <label class="property-lbl" style="font-size:0.62rem;">Start (ms)</label>
                <input type="number" class="property-input anim-change" data-anim-id="${animId}" data-index="${i}" data-prop="start" value="${anim.start}"/>
              </div>
              <div>
                <label class="property-lbl" style="font-size:0.62rem;">Duration (ms)</label>
                <input type="number" class="property-input anim-change" data-anim-id="${animId}" data-index="${i}" data-prop="duration" value="${anim.duration}"/>
              </div>
            </div>
            <div class="property-row-split" style="margin-bottom:0.25rem;">
              <div>
                <label class="property-lbl" style="font-size:0.62rem;">Easing</label>
                <select class="property-input anim-change-select" data-anim-id="${animId}" data-index="${i}" data-prop="easing">
                  <option value="cubic-bezier(0.22,1,0.36,1)" ${anim.easing === 'cubic-bezier(0.22,1,0.36,1)' ? 'selected' : ''}>Ease Out Expo</option>
                  <option value="linear" ${anim.easing === 'linear' ? 'selected' : ''}>Linear</option>
                  <option value="ease" ${anim.easing === 'ease' ? 'selected' : ''}>Ease</option>
                  <option value="ease-in" ${anim.easing === 'ease-in' ? 'selected' : ''}>Ease In</option>
                  <option value="ease-out" ${anim.easing === 'ease-out' ? 'selected' : ''}>Ease Out</option>
                  <option value="ease-in-out" ${anim.easing === 'ease-in-out' ? 'selected' : ''}>Ease In Out</option>
                  <option value="cubic-bezier(0.34,1.56,0.64,1)" ${anim.easing === 'cubic-bezier(0.34,1.56,0.64,1)' ? 'selected' : ''}>Spring Bounce</option>
                  <option value="cubic-bezier(0.4,0,0.2,1)" ${anim.easing === 'cubic-bezier(0.4,0,0.2,1)' ? 'selected' : ''}>Material</option>
                </select>
              </div>
              <div>
                <label class="property-lbl" style="font-size:0.62rem;">Direction</label>
                <select class="property-input anim-change-select" data-anim-id="${animId}" data-index="${i}" data-prop="direction">
                  <option value="normal" ${anim.direction === 'normal' ? 'selected' : ''}>Normal</option>
                  <option value="reverse" ${anim.direction === 'reverse' ? 'selected' : ''}>Reverse</option>
                  <option value="alternate" ${anim.direction === 'alternate' ? 'selected' : ''}>Alternate</option>
                  <option value="alternate-reverse" ${anim.direction === 'alternate-reverse' ? 'selected' : ''}>Alt. Reverse</option>
                </select>
              </div>
            </div>
            <div style="margin-top:0.25rem; display:flex; align-items:center; gap:0.5rem;">
              <input type="checkbox" class="anim-change-checkbox" id="anim-repeat-${animId}" data-anim-id="${animId}" data-index="${i}" data-prop="infinite" ${anim.infinite ? 'checked' : ''}/>
              <label for="anim-repeat-${animId}" class="property-lbl" style="font-size:0.62rem; cursor:pointer;">Repeat Infinite (∞)</label>
            </div>
          </div>
        `;
      });
    }

    fields += `</div>`;

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
        if (matchingInput) {
          matchingInput.value = input.value;
        }
        renderCanvas();
      });
      input.addEventListener('change', () => {
        saveState();
      });
    });

    // Animation configuration values
    container.querySelectorAll('.anim-change').forEach(input => {
      input.addEventListener('change', () => {
        const animId = input.dataset.animId;
        const fallbackIndex = parseInt(input.dataset.index);
        const anim = animId
          ? layer.animations.find(a => a.id === animId)
          : layer.animations[fallbackIndex];
        if (!anim) return;
        const prop = input.dataset.prop;
        anim[prop] = parseInt(input.value);
        saveState();
        renderTimeline();
        previewTimelineAtTime();
      });
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
        saveState();
        renderTimeline();
        previewTimelineAtTime();
      });
    });

    container.querySelectorAll('.btn-del-anim').forEach(btn => {
      btn.addEventListener('click', () => {
        const animId = btn.dataset.animId;
        const fallbackIndex = parseInt(btn.dataset.index);
        // Find by id first (new animations); fall back to index for legacy pre-loaded animations
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

  // Previews animation at specific timeline location using Web Animations API
  function previewTimelineAtTime() {
    const scene = getActiveScene();
    const keyframeMap = (window.v1Data && window.v1Data.animationKeyframes) || {};

    scene.layers.forEach(layer => {
      const elNode = viewportNode.querySelector(`.canvas-element[data-id="${layer.id}"]`);
      if (!elNode) return;

      // Reset to layer's default transform/opacity before applying any active animation
      elNode.style.transform = `rotate(${layer.rotation || 0}deg)`;
      elNode.style.opacity = layer.opacity != null ? layer.opacity : 1;

      layer.animations.forEach(anim => {
        const animStart = anim.start;
        const animEnd   = anim.start + anim.duration;
        const keyframes = keyframeMap[anim.name];
        if (!keyframes || keyframes.length < 2) return;

        if (state.currentTime >= animStart && state.currentTime <= animEnd) {
          const progress = (state.currentTime - animStart) / anim.duration;
          applyInterpolation(elNode, keyframes, progress, layer);
        }
      });
    });
  }

  // Use Web Animations API for a one-shot interpolation snapshot at a given progress (0-1)
  function applyInterpolation(elNode, keyframes, progress, layer) {
    // Convert v1 keyframe format ({ offset, transform, opacity, ... }) to WAAPI format
    const waKeyframes = keyframes.map(kf => {
      const { offset, ...rest } = kf;
      return { ...rest, offset };
    });

    // Cancel any previous "snapshot" animation on this element
    if (elNode._snapAnim) {
      try { elNode._snapAnim.cancel(); } catch(e) {}
    }

    // Run a paused WAAPI animation and seek to the exact progress position
    try {
      const anim = elNode.animate(waKeyframes, {
        duration: 1000,          // duration doesn't matter since we immediately seek
        fill: 'forwards',
        easing: 'linear',        // linear so progress = position directly
      });
      anim.currentTime = progress * 1000;
      anim.pause();
      elNode._snapAnim = anim;
    } catch (e) {
      // Fallback: manual opacity + simple transform for browsers that can't handle complex keyframes
      const idx = Math.min(Math.floor(progress * (keyframes.length - 1)), keyframes.length - 2);
      const from = keyframes[idx];
      const to   = keyframes[idx + 1];
      const seg  = (progress - from.offset) / Math.max(0.001, to.offset - from.offset);
      if (from.opacity != null && to.opacity != null) {
        elNode.style.opacity = from.opacity + (to.opacity - from.opacity) * seg;
      }
      if (from.transform) {
        elNode.style.transform = `rotate(${layer.rotation || 0}deg) ${from.transform}`;
      }
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

      rowsContainer.appendChild(trackRow);
    });
  }

  // --- Import / Export System ---
  function exportProjectJSON() {
    const projectJSON = {
      project: state.project,
      scenes: state.scenes
    };
    
    const blob = new Blob([JSON.stringify(projectJSON, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.project.name.replace(/\s+/g, '_').toLowerCase()}_workspace.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Project Exported!");
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
        scenes: state.scenes
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
        saveState();
        renderAll();
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
  initCanvasRefs(); // Must come after initStudioDOM creates the elements
  setupModeToggles();
  setupTabs();
  initCanvasControls();
  initTimelineControls();
  setupFileMenu();
  setupSceneControls();
  setupCanvasDeselect();
  applyCanvasTransform();

  // Force default Studio mode on load
  document.getElementById('modeBtnStudio').click();
});
